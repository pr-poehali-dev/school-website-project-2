'''
Business: Управление заявками на вступление в клуб с email уведомлениями
Args: event с httpMethod, body, headers; context с request_id
Returns: HTTP response со списком заявок или статусом создания
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def send_email(to_email: str, subject: str, body: str):
    try:
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not all([smtp_host, smtp_user, smtp_password]):
            return
        
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html', 'utf-8'))
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as e:
        print(f"Email error: {e}")

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
                "SELECT full_name, email FROM applications WHERE id = %s",
                (app_id,)
            )
            app = cursor.fetchone()
            
            cursor.execute(
                "UPDATE applications SET status = %s WHERE id = %s",
                (status, app_id)
            )
            conn.commit()
            
            if app and app['email']:
                if status == 'approved':
                    subject = '✅ Ваша заявка одобрена!'
                    body_html = f'''
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #4CAF50;">Здравствуйте, {app['full_name']}!</h2>
                            <p>Рады сообщить, что ваша заявка на вступление в школьный клуб была <strong>одобрена</strong>!</p>
                            <p>Добро пожаловать в нашу команду! Мы свяжемся с вами в ближайшее время для обсуждения деталей.</p>
                            <p>С уважением,<br>Команда школьного клуба</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">Контакты: sashafetisov2010@ro.ru | +7 (901) 551-02-28</p>
                        </body>
                    </html>
                    '''
                elif status == 'rejected':
                    subject = 'Ваша заявка на рассмотрении'
                    body_html = f'''
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2>Здравствуйте, {app['full_name']}!</h2>
                            <p>Благодарим за интерес к нашему школьному клубу.</p>
                            <p>К сожалению, на данный момент мы не можем принять вашу заявку.</p>
                            <p>Вы можете попробовать подать заявку позже или связаться с нами для уточнения деталей.</p>
                            <p>С уважением,<br>Команда школьного клуба</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">Контакты: sashafetisov2010@ro.ru | +7 (901) 551-02-28</p>
                        </body>
                    </html>
                    '''
                else:
                    subject = None
                
                if subject:
                    send_email(app['email'], subject, body_html)
            
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
