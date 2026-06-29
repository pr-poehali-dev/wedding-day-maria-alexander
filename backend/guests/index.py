"""Возвращает список гостей, подтвердивших присутствие на свадьбе."""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список всех RSVP-заявок из БД."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT id, name, count, drink, created_at FROM rsvp_guests ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    guests = [
        {
            'id': r[0],
            'name': r[1],
            'count': r[2],
            'drink': r[3],
            'created_at': r[4].strftime('%d.%m.%Y %H:%M'),
        }
        for r in rows
    ]

    total = sum(g['count'] for g in guests)

    return {
        'statusCode': 200,
        'headers': cors,
        'body': {'guests': guests, 'total': total}
    }
