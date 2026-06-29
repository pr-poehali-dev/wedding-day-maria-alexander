"""Обработка RSVP-заявок: отправка уведомлений в Telegram двум получателям."""
import json
import os
import urllib.request


BOTS = [
    {'token_env': 'TELEGRAM_BOT_TOKEN_1', 'chat_id_env': 'TELEGRAM_CHAT_ID_1'},
    {'token_env': 'TELEGRAM_BOT_TOKEN_2', 'chat_id_env': 'TELEGRAM_CHAT_ID_2'},
]


def send_telegram(token: str, chat_id: str, text: str):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode()
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req, timeout=10)


def handler(event: dict, context) -> dict:
    """Принимает RSVP-заявку и отправляет уведомления в Telegram двум получателям."""
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
        return {'statusCode': 400, 'headers': headers, 'body': {'error': 'Заполните все поля'}}

    text = (
        f'🎊 <b>Новая RSVP-заявка!</b>\n\n'
        f'👤 <b>Имя:</b> {name}\n'
        f'👥 <b>Количество гостей:</b> {count}\n'
        f'🍷 <b>Напиток:</b> {drink}'
    )

    errors = []
    for bot in BOTS:
        token = os.environ.get(bot['token_env'], '')
        chat_id = os.environ.get(bot['chat_id_env'], '')
        if token and chat_id:
            try:
                send_telegram(token, chat_id, text)
            except Exception as e:
                errors.append(f"{bot['token_env']}: {e}")

    return {'statusCode': 200, 'headers': headers, 'body': {'ok': True, 'errors': errors}}
