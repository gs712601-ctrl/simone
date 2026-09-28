var express=require('express');
var app= express();

var web=require('./routes/web.js')
var admin=require('./routes/admin.js')

app.use('/',web);
//http://localhost:3000/

app.use('/admin',admin);
//http://localhost:3000/admin/

app.listen(3000);