import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Создаем таблицу если не существует
    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (req.method === 'POST') {
      // Добавление нового посетителя
      const { firstName, lastName } = req.body;
      
      const result = await sql`
        INSERT INTO visitors (first_name, last_name)
        VALUES (${firstName}, ${lastName})
        RETURNING *
      `;
      
      return res.status(200).json({ success: true, visitor: result.rows[0] });
    }
    
    else if (req.method === 'GET') {
      // Получение всех посетителей
      const result = await sql`
        SELECT * FROM visitors 
        ORDER BY timestamp DESC
      `;
      
      return res.status(200).json(result.rows);
    }
    
    else if (req.method === 'DELETE') {
      // Очистка всей таблицы
      await sql`DELETE FROM visitors`;
      return res.status(200).json({ success: true });
    }
    
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}