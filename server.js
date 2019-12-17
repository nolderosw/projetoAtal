const express = require('express');
const huffman = require('./public/huffman.js')

const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

app.get('/getAudio', (req,res) =>{
  let buffer = huffman.readAudioFile();
  res.status(200).json({bf: buffer});
})

app.post('/messages', async (req, res) => {
  if (!req.body.audioArrayBuffer) {
    return res.status(400).json({ error: 'No req.body.message' });
  }
  else{
    huffman.writeAudioFile(req.body.audioArrayBuffer)
    .then(() => {
      res.status(201).json({ message: 'Saved message' });
    })
    .catch(err => {
      console.log('Error writing message to file', err);
      res.sendStatus(500);
    });
  }
});

const PORT = process.env.PORT || 3545;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
