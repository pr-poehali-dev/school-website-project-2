'''
Business: Управление посещаемостью участников клуба
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными посещаемости
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            date = params.get('date', datetime.now().strftime('%Y-%m-%d'))
            
            cursor.execute("""
                SELECT 
                    u.id, u.full_name, u.email,
                    COALESCE(a.present, false) as present,
                    a.notes
                FROM users u
                LEFT JOIN attendance a ON u.id = a.user_id AND a.date = %s
                WHERE u.role = 'member'
                ORDER BY u.full_name
            """, (date,))
            
            attendance = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'date': date,
                    'attendance': [dict(a) for a in attendance]
                }, default=str)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            date = body.get('date', datetime.now().strftime('%Y-%m-%d'))
            present = body.get('present', False)
            notes = body.get('notes', '')
            
            cursor.execute("""
                INSERT INTO attendance (user_id, date, present, notes)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (user_id, date) 
                DO UPDATE SET present = EXCLUDED.present, notes = EXCLUDED.notes
            """, (user_id, date, present, notes))
            
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
