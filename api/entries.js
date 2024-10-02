const admin = require('firebase-admin');

// Firebase 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: 'https://matmn-dfc2a-default-rtdb.asia-southeast1.firebasedatabase.app/', // 실제 데이터베이스 URL로 변경
  });
}

const db = admin.database();

module.exports = async (req, res) => {
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

