"""Обработка RSVP-заявок: отправка уведомлений в Telegram двум получателям."""
import json
import urllib.request


BOTS = [
    {'token': '8949783908:AAEfsB5pUuCcZ3TQcAlNl43LeI9de8i5N4k', 'chat_id': '789210376'},
    {'token': '8999159804:AAEjZbwBexJgrdVo6-xLe5pWlwPgR5jmx1I', 'chat_id': '291039408'},
]


def send_telegram(token: str, chat_id: str, text: str):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode()
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req, timeout=10)


def handler(event: dict, context) -> dict:
    """Принимает RSVP-заявку и отправляет уведомления в Telegram двум получателям."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    count = body.get('count', '')
    drink = body.get('drink', '').strip()

    if not name or not count or not drink:
        return {'statusCode': 400, 'headers': cors, 'body': {'error': 'Заполните все поля'}}

    text = (
        f'\U0001f38a <b>Новая RSVP-заявка!</b>\n\n'
        f'\U0001f464 <b>Имя:</b> {name}\n'
        f'\U0001f465 <b>Количество гостей:</b> {count}\n'
        f'\U0001f377 <b>Напиток:</b> {drink}'
    )

    errors = []
    for bot in BOTS:
        try:
            send_telegram(bot['token'], bot['chat_id'], text)
        except Exception as e:
            errors.append(f"chat {bot['chat_id']}: {e}")

    return {'statusCode': 200, 'headers': cors, 'body': {'ok': True, 'errors': errors}}
