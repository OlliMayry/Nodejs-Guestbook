const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require('path');
const port = 3007;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/guestbook', function (req, res) {

    var data = require(__dirname + "/data.json"); 

         var results = '<table class="table table-dark">'+
        '<thead>'+
        '<tr>' +
        '<th scope="col">'+'Id'+'</th>' +
        '<th scope="col">' + 'Username' +'</th>' +
        '<th scope="col">' + 'Country' +'</th>' +
        '<th scope="col">' + 'Date' +'</th>' +
        '<th scope="col">' + 'Message' +'</th>' +
   '</tr>'+
'</thead>' ;
    
        for (var i = 0; i < data.length; i++) {
            results += 
            '<tbody>'+
            '<tr>' +
                 '<th scope="row">' + data[i].id + '</th>' +
                 '<td>' + data[i].username + '</td>' +
                '<td>' + data[i].country + '</td>' +
                '<td>' + data[i].date + '</td>' +
                '<td>' + data[i].message + '</td>' +
            '</tr>'+
            '</tbody>';
        }
        results += '</table>';
/*      res.send(results);  */
fs.readFile(__dirname + "/viestit.html", "utf8", function (err, contents) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while reading the file.");
    } else {
      var html = contents.replace("<!-- RESULTS_PLACEHOLDER -->", results);
      res.send(html);
    }
  });
});

app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname + "/add.html"); 
});

app.post('/submit-form', function (req, res) {

const username = req.body.username;
const country = req.body.country;
const message = req.body.message;

// Storing the JSON format data in myObject
const data = fs.readFileSync("data.json");
const myObject = JSON.parse(data);


// Adding the new data to our object
myObject.push({ username, country, message });

 // write the updated JSON data to the file
 fs.writeFileSync('data.json', JSON.stringify(myObject, null, 2));
 res.send('Message added successfully. <button onclick="window.location.href=\'/\'">Go to home page</button>'); 
});

/* app.get('/submit-form', function (req, res) {
    res.sendFile(__dirname + "/index.html"); 
}); */

app.get('/ajaxmessage', function (req, res) {
    res.send('Lets try to add some data to a file!');
});

//The 404 Route. Keep this as the last route
app.get('*', function (req, res) {
    /* res.send('Cant find requested page', 404); */
    res.status(404).send('Cant find requested page');
});

app.listen(port, function () {
    console.log('Example app listening on port 3007!');
});