const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Diff = require('text-diff');

const data = require('./data.json');

// Generic UUID generator function
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const one = 'A white fox went through the road. It was a very interesting sight.';
const other = 'A red fox went through the cliff. It was a very interesting sight.';

const diff = new Diff(); // options may be passed to constructor; see below
const textDiff = diff.main(one, other); // produces diff array

diff.cleanupEfficiency(textDiff);

const newDiff = textDiff.map((item) => {
  if (item[0] === 0) {
    return [
      0, item[1].length
    ]
  } else {
    return item;
  }
});

console.log(newDiff);

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.get('/getDocument/:docId', (req, res) => {
  const docId = req.params['docId'];
  const docData = data.documents.find((item) => item.id === docId);

  if (docData) {
    res.send(docData);
  } else {
    res.sendStatus(404);
  }
});

app.get('/getAllDocuments', (req, res) => {
  res.send(data.documents.map((item) => {
    return {
      id: item.id,
      name: item.name
    }
  }));
});

app.post('/createDocument', (req, res) => {
  const id = uuidv4();
  const name = req.body.name;

  data.documents.push({
    id: id,
    name: name,
    content: '',
    history: []
  });

  res.send({
    id,
  });
});

app.post('/saveDocument', (req, res) => {
  const id = req.body.id;
  const name = req.body.content;

  data.documents.push({
    id: id,
    name: name,
    content: '',
    history: []
  });

  res.send({
    id,
  });
});

app.listen(3000, () => console.log('Solution listening on port 3000!'));