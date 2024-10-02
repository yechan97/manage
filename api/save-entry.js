const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const filePath = path.resolve('.', 'adminEntries.json');
    let entries = [];

    // 기존 데이터 읽기
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath);
      entries = JSON.parse(rawData);
    }

    // 새 데이터 추가 (최근 5개까지만 유지)
    entries.unshift(data);
    if (entries.length > 5) entries = entries.slice(0, 5);

    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
    res.status(200).json({ status: 'success' });
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
