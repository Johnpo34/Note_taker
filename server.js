var express = require('express')
var path = require('path')
var fs = require('fs')
var { v4: uuidv4 } = require('uuid')

var app = express()
var PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', function (req, res) {
    fs.readFile('db/db.json', 'utf-8', function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.post('/api/notes', function (req, res) {
    var note = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }
    fs.readFile('db/db.json', 'utf-8', function (err, data) {
        if (err) throw err;
        var db = JSON.parse(data)
        db.push(note)
        fs.writeFile('db/db.json', JSON.stringify(db), function (err) {
            if (err) throw err;
            console.log('New Note Saved');
        })
        res.sendFile(path.join(__dirname, '/public/notes.html'))
    })
})

app.delete('/api/notes/:id', function(req, res) {
    var clicked = req.params.id
    fs.readFile('db/db.json', 'utf-8', function (err, data) {
        if (err) throw err;
        var db = JSON.parse(data)
        var newDb = db.filter(item => item.id !== clicked)
        fs.writeFile('db/db.json', JSON.stringify(newDb), function (err) {
            if (err) throw err;
            console.log('Note Deleted');
        })
        res.sendFile(path.join(__dirname, '/public/notes.html'))
    })
})

app.listen(PORT, function () {
    console.log("APP listening on: http://localhost:" + PORT);
})