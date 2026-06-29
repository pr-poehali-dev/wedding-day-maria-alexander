"""Обработка RSVP-заявок: отправка уведомлений в Telegram и на почту."""
import json
import os
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


TELEGRAM_CHAT_IDS = ['@krpkh', '@etope4alno']
EMAIL_TO = 'mariakrepkih2003@gmail.com'
EMAIL_FROM = 'mariakrepkih2003@gmail.com'


def send_telegram(token: str, text: str):
    for chat_id in TELEGRAM_CHAT_IDS:
        url = f'https://api.telegram.org/bot{token}/sendMessage'
        data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode()
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req, timeout=10)


def send_email(smtp_password: str, subject: str, body: str):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = EMAIL_FROM
    msg['To'] = EMAIL_TO
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(EMAIL_FROM, smtp_password)
        server.sendmail(EMAIL_FROM, EMAIL_TO, msg.as_string())


def handler(event: dict, context) -> dict:
    """Принимает RSVP-заявку и отправляет уведомления в Telegram и на почту."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    count = body.get('count', '')
    drink = body.get('drink', '').strip()

    if not name or not count or not drink:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': {'error': 'Заполните все поля'}
        }

    text = (
        f'🎊 <b>Новая RSVP-заявка!</b>\n\n'
        f'👤 <b>Имя:</b> {name}\n'
        f'👥 <b>Количество гостей:</b> {count}\n'
        f'🍷 <b>Напиток:</b> {drink}'
    )

    email_body = (
        f'Новая RSVP-заявка на свадьбу Александра и Марии!\n\n'
        f'Имя: {name}\n'
        f'Количество гостей: {count}\n'
        f'Напиток: {drink}'
    )

    errors = []

    tg_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    if tg_token:
        try:
            send_telegram(tg_token, text)
        except Exception as e:
            errors.append(f'Telegram: {e}')

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    if smtp_password:
        try:
            send_email(smtp_password, f'RSVP: {name} — свадьба 29.08.2026', email_body)
        except Exception as e:
            errors.append(f'Email: {e}')

    return {
        'statusCode': 200,
        'headers': headers,
        'body': {'ok': True, 'errors': errors}
    }