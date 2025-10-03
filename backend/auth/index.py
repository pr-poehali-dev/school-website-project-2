'''
Business: Аутентификация пользователей (регистрация, вход, проверка статуса)
Args: event с httpMethod, body, headers; context с request_id
Returns: HTTP response с токеном или статусом
'''

import json
import os
import hashlib
import secrets
import hmac
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def verify_telegram_auth(auth_data: Dict[str, Any], bot_token: str) -> bool:
    check_hash = auth_data.get('hash')
    if not check_hash:
        return False
    
    auth_data_copy = {k: v for k, v in auth_data.items() if k != 'hash'}
    data_check_string = '\n'.join(f"{k}={v}" for k, v in sorted(auth_data_copy.items()))
    
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return calculated_hash == check_hash

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                full_name = body.get('full_name')
                
                cursor.execute(
                    "INSERT INTO users (email, password_hash, full_name, role) VALUES (%s, %s, %s, %s) RETURNING id, email, full_name, role",
                    (email, hash_password(password), full_name, 'member')
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = generate_token()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'token': token,
                        'user': dict(user)
                    })
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                
                cursor.execute(
                    "SELECT id, email, full_name, role, is_active FROM users WHERE email = %s AND password_hash = %s",
                    (email, hash_password(password))
                )
                user = cursor.fetchone()
                
                if user and user.get('is_active', True):
                    token = generate_token()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'user': dict(user)
                        })
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'Неверные данные'})
                    }
            
            elif action == 'telegram_login':
                bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
                if not bot_token:
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Bot token not configured'})
                    }
                
                if not verify_telegram_auth(body, bot_token):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid authentication data'})
                    }
                
                telegram_id = str(body.get('id'))
                first_name = body.get('first_name', '')
                last_name = body.get('last_name', '')
                full_name = f"{first_name} {last_name}".strip()
                
                cursor.execute(
                    "SELECT id, email, full_name, role, is_active FROM users WHERE telegram_id = %s",
                    (telegram_id,)
                )
                user = cursor.fetchone()
                
                if user:
                    if not user['is_active']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Account is deactivated'})
                        }
                    
                    cursor.execute(
                        "UPDATE users SET last_login = NOW() WHERE id = %s",
                        (user['id'],)
                    )
                    conn.commit()
                    
                    token = generate_token()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'user': dict(user)
                        })
                    }
                else:
                    email = f"tg_{telegram_id}@telegram.user"
                    
                    cursor.execute(
                        """
                        INSERT INTO users (email, full_name, password_hash, role, telegram_id, is_active)
                        VALUES (%s, %s, %s, %s, %s, TRUE)
                        RETURNING id, email, full_name, role
                        """,
                        (email, full_name, '', 'member', telegram_id)
                    )
                    new_user = cursor.fetchone()
                    conn.commit()
                    
                    token = generate_token()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'user': dict(new_user)
                        })
                    }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()