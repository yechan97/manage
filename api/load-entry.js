const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const filePath = path.resolve('.', 'adminEntries.json');

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    res.status(200).json(JSON.parse(rawData));
  } else {
    res.status(200).json([]);
  }
}
