var express = require('express');
var app = express();
app.use(express.static('/'));
app.get('/', function (req, res,next) {
res.redirect('/');
});
app.listen(8080)
console.log('app running on port 8080')