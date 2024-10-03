import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  // 데이터베이스 경로 설정
  const dbPath = path.resolve('./database.sqlite');

  // 데이터베이스 파일이 없으면 초기화
  if (!fs.existsSync(dbPath)) {
    await initializeDatabase(dbPath);
  }

  // 데이터베이스 열기
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    // 모든 데이터 조회
    const rows = await db.all('SELECT * FROM stock_entries');
    res.status(200).json(rows);
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
