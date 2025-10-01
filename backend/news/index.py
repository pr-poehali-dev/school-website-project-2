'''
Business: Управление новостями клуба (публикации с фото и видео)
Args: event с httpMethod, body; context с request_id
Returns: HTTP response со списком новостей или статусом создания
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            cursor.execute("""
                SELECT n.*, u.full_name as author_name
                FROM news n
                LEFT JOIN users u ON n.author_id = u.id
                ORDER BY n.created_at DESC
                LIMIT 50
            """)
            
            news = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(n) for n in news], default=str)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            headers = event.get('headers', {})
            author_id = headers.get('x-user-id', headers.get('X-User-Id'))
            
            cursor.execute(
                "INSERT INTO news (title, content, author_id, image_url, video_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (body.get('title'), body.get('content'), author_id, body.get('image_url'), body.get('video_url'))
            )
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': result['id']})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
