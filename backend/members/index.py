'''
Business: Управление участниками клуба (получение списка, удаление, изменение роли)
Args: event с httpMethod, body, headers; context с request_id
Returns: HTTP response со списком участников или статусом операции
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
                'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Role, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_role = headers.get('x-user-role', headers.get('X-User-Role', ''))
    
    if user_role != 'admin':
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Access denied'})
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            
            if query_params.get('grades') == 'true':
                user_id = query_params.get('user_id')
                
                if user_id:
                    cursor.execute(
                        """
                        SELECT g.id, g.user_id, g.category, g.score, g.comment, 
                               g.graded_at, u.full_name as graded_by_name
                        FROM grades g
                        LEFT JOIN users u ON g.graded_by = u.id
                        WHERE g.user_id = %s
                        ORDER BY g.graded_at DESC
                        """,
                        (user_id,)
                    )
                else:
                    cursor.execute(
                        """
                        SELECT g.id, g.user_id, g.category, g.score, g.comment, 
                               g.graded_at, u1.full_name as user_name, u2.full_name as graded_by_name
                        FROM grades g
                        LEFT JOIN users u1 ON g.user_id = u1.id
                        LEFT JOIN users u2 ON g.graded_by = u2.id
                        ORDER BY g.graded_at DESC
                        """
                    )
                
                grades = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(record) for record in grades], default=str)
                }
            
            elif query_params.get('history') == 'true':
                user_id = query_params.get('user_id')
                
                if user_id:
                    cursor.execute(
                        """
                        SELECT 
                            rh.id,
                            rh.user_id,
                            u.full_name as user_name,
                            u.email as user_email,
                            rh.old_role,
                            rh.new_role,
                            rh.changed_by_admin_id,
                            a.full_name as admin_name,
                            rh.changed_at,
                            rh.reason
                        FROM role_history rh
                        LEFT JOIN users u ON rh.user_id = u.id
                        LEFT JOIN users a ON rh.changed_by_admin_id = a.id
                        WHERE rh.user_id = %s
                        ORDER BY rh.changed_at DESC
                        """,
                        (user_id,)
                    )
                else:
                    cursor.execute(
                        """
                        SELECT 
                            rh.id,
                            rh.user_id,
                            u.full_name as user_name,
                            u.email as user_email,
                            rh.old_role,
                            rh.new_role,
                            rh.changed_by_admin_id,
                            a.full_name as admin_name,
                            rh.changed_at,
                            rh.reason
                        FROM role_history rh
                        LEFT JOIN users u ON rh.user_id = u.id
                        LEFT JOIN users a ON rh.changed_by_admin_id = a.id
                        ORDER BY rh.changed_at DESC
                        LIMIT 100
                        """
                    )
                
                history = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(record) for record in history], default=str)
                }
            else:
                show_deleted = query_params.get('show_deleted') == 'true'
                
                if show_deleted:
                    cursor.execute(
                        "SELECT id, email, full_name, role, created_at, is_active FROM users WHERE is_active = FALSE ORDER BY created_at DESC"
                    )
                else:
                    cursor.execute(
                        "SELECT id, email, full_name, role, created_at, is_active FROM users WHERE is_active = TRUE ORDER BY created_at DESC"
                    )
                members = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(member) for member in members], default=str)
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('id')
            new_role = body.get('role')
            admin_id = body.get('admin_id')
            reason = body.get('reason', '')
            
            if not user_id or not new_role:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User ID and role required'})
                }
            
            if new_role not in ['admin', 'member']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid role'})
                }
            
            cursor.execute(
                "SELECT role FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            old_role = user['role'] if user else None
            
            if old_role and old_role != new_role:
                cursor.execute(
                    "INSERT INTO role_history (user_id, old_role, new_role, changed_by_admin_id, reason) VALUES (%s, %s, %s, %s, %s)",
                    (user_id, old_role, new_role, admin_id, reason)
                )
            
            cursor.execute(
                "UPDATE users SET role = %s WHERE id = %s",
                (new_role, user_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'restore_user':
                user_id = body.get('user_id')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User ID required'})
                    }
                
                cursor.execute(
                    "UPDATE users SET is_active = TRUE WHERE id = %s",
                    (user_id,)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif action == 'add_grade':
                user_id = body.get('user_id')
                category = body.get('category')
                score = body.get('score')
                comment = body.get('comment', '')
                graded_by = int(headers.get('x-user-id', headers.get('X-User-Id', 0)))
                
                if not all([user_id, category, score is not None]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cursor.execute(
                    """
                    INSERT INTO grades 
                    (user_id, category, score, comment, graded_by)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    (user_id, category, score, comment, graded_by)
                )
                
                grade_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': grade_id})
                }
            
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User ID required'})
                }
            
            cursor.execute(
                "SELECT role, is_active FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            
            if user and user['role'] == 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Cannot remove admin'})
                }
            
            cursor.execute(
                "UPDATE users SET is_active = FALSE WHERE id = %s",
                (user_id,)
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