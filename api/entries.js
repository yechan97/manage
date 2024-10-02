module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // 새 엔트리 추가
    const entry = req.body;
    const newEntryRef = db.ref('entries').push();
    await newEntryRef.set(entry);
    res.status(200).json({ message: 'Entry added successfully', entry });
  } else if (req.method === 'GET') {
    // 모든 엔트리 반환
    const snapshot = await db.ref('entries').once('value');
    const entries = snapshot.val();
    res.status(200).json(entries ? Object.values(entries) : []);
  } else if (req.method === 'DELETE') {
    // 모든 엔트리 삭제
    await db.ref('entries').remove();
    res.status(200).json({ message: 'All entries have been cleared.' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
