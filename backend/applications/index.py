'''
Business: Управление заявками на вступление в клуб
Args: event с httpMethod, body, headers; context с request_id
Returns: HTTP response со списком заявок или статусом создания
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute(
                "INSERT INTO applications (full_name, email, phone, message) VALUES (%s, %s, %s, %s) RETURNING id",
                (body.get('full_name'), body.get('email'), body.get('phone'), body.get('message'))
            )
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': result['id']})
            }
        
        elif method == 'GET':
            headers = event.get('headers', {})
            user_role = headers.get('x-user-role', headers.get('X-User-Role', ''))
            
            if user_role != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Access denied'})
                }
            
            cursor.execute(
                "SELECT * FROM applications ORDER BY created_at DESC"
            )
            applications = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(app) for app in applications], default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            app_id = body.get('id')
            status = body.get('status')
            
            cursor.execute(
                "UPDATE applications SET status = %s WHERE id = %s",
                (status, app_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
