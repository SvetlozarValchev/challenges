const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Data = require('./data.json');
const Diff = require('text-diff');
const diff = new Diff(); // options may be passed to constructor; see below

// Generic UUID generator function
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.get('/api/getAllDocuments', (req, res) => {
    res.send(Data.documents.map((item) => {
        return {
            id: item.id,
            name: item.name
        }
    }));
});

app.get('/api/getDocument/:docId', (req, res) => {
    const docId = req.params['docId'];
    const docData = Data.documents.find((item) => item.id === docId);

    if (docData) {
        res.send(docData);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/createDocument', (req, res) => {
    const id = uuidv4();
    const name = req.body.name;

    Data.documents.push({
        id: id,
        name: name,
        content: '',
        history: []
    });

    res.send({
        id,
    });
});

app.post('/api/saveDocument', (req, res) => {
    const id = req.body.id;
    const content = req.body.content;
    const docIndex = Data.documents.findIndex((item) => item.id === id);

    const textDiff = diff.main(content, Data.documents[docIndex].content); // produces diff array

    diff.cleanupEfficiency(textDiff);

    const revision = Data.documents[docIndex].history.length > 0 ? Data.documents[docIndex].history[0].revision + 1 : 1;

    const historyObj = {
        revision: revision,
        diff: textDiff.map((item) => item[0] <= 0 ? [item[0], item[1].length] : item)
    };

    Data.documents[docIndex].content = content;
    Data.documents[docIndex].history.unshift(historyObj);

    res.send(historyObj);
});

app.listen(3000, () => console.log('Solution listening on port 3000!'));