// api/visitors.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Разрешаем доступ только с твоего сайта (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Сохранить нового посетителя
    try {
      const visitors = await kv.get('visitors') || [];
      visitors.push(req.body);
      await kv.set('visitors', visitors);
      res.status(200).json({ ok: true, count: visitors.length });
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  } 
  else if (req.method === 'GET') {
    // Получить всех посетителей (для админа)
    try {
      const visitors = await kv.get('visitors') || [];
      res.status(200).json(visitors);
    } catch (error) {
      console.error('Ошибка получения:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  } 
  else {
    res.status(405).json({ error: 'Метод не разрешен' });
  }
}