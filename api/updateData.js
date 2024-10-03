import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const dbPath = path.resolve('./database.sqlite');

  // 데이터베이스 파일이 없으면 초기화
  if (!fs.existsSync(dbPath)) {
    await initializeDatabase(dbPath);
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const { name, category, matName, color, quantity, type, notes } = req.body;

  try {
    await db.run(
      'INSERT INTO stock_entries (name, category, matName, color, quantity, type, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, matName, color, quantity, type, notes]
    );
    res.status(200).json({ message: 'Entry successfully added!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.close();
  }
}

// 데이터베이스 초기화 함수
async function initializeDatabase(dbPath) {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // stock_entries 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stock_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      matName TEXT,
      color TEXT,
      quantity INTEGER,
      type TEXT,
      notes TEXT
    );
  `);
  await db.close();
}
