import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - получить всех посетителей
    if (req.method === 'GET') {
      const visitors = await kv.lrange('visitors', 0, -1);
      const parsed = visitors.map(v => JSON.parse(v));
      return res.status(200).json(parsed.reverse());
    }

    // POST - добавить посетителя
    if (req.method === 'POST') {
      const { firstName, lastName } = req.body;
      
      const visitor = {
        id: Date.now(),
        firstName,
        lastName,
        timestamp: new Date().toISOString(),
      };

      await kv.lpush('visitors', JSON.stringify(visitor));
      return res.status(201).json({ visitor, success: true });
    }

    // DELETE - очистить лог
    if (req.method === 'DELETE') {
      await kv.del('visitors');
      return res.status(200).json({ success: true, message: 'Лог очищен' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}