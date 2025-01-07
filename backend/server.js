const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.post('/verify-certificate', upload.single('certificateFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file received.' });
  }

  const filePath = req.file.path;

  // Exécution du script Python
  exec(`python verify_certificate.py ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      return res.status(500).json({ message: 'Error in Python script execution' });
    }

    const result = stdout.trim();
    console.log(`Prediction: ${result}`);

    res.json({ message: `Certificat is ${result}` });

    // Supprimer le fichier après traitement
    fs.unlink(filePath).catch(console.error);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
