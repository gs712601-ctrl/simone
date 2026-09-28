var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');


router.use(express.static('public'));

var conn=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'simone',
})

var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({ extended: true }));


router.get('/',async(req,res)=>{
  var sql='select * from home where hid=1';
  var data=await exe (sql);

 res.render('web/index.ejs',{home:data[0]});
})

router.get('/about',(req,res)=>{
  res.render('web/about.ejs')
})

router.get('/services',async(req,res)=>{
  var sql='select * from service';
  var service= await exe(sql);
res.render('web/services.ejs',{service:service})
})

router.get('/resume',(req,res)=>{
  res.render('web/resume.ejs')
})

router.get('/portfolio', async (req, res) => {

    var sql = 'select * from work';

    var data = await exe(sql);

    res.render('web/portfolio.ejs', {work:data});

});

router.get('/clients',(req,res)=>{
  res.render('web/clients.ejs')
})

router.get('/contact',(req,res)=>{
  res.render('web/contact.ejs')
})
router.post('/contact/save',async (req, res)=>{
  // res.send('save')
  // res.send(req.body)
  var {name,email,message}=req.body;
  var da=new Date();
var date1 = da.getDate() + "-" + Number(da.getMonth() + 1) + "-" + da.getFullYear();
  // res.send(date1)

  var sql='insert into contact_data(name,email,message,status,cdate) values(?,?,?,?,?)';
  var data=await exe (sql,[name,email,message,'pending',date1]);
  res.redirect('/contact');
})

module.exports=router;