var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session');
const fileUpload =require('express-fileupload');
var path=require('path');



router.use(express.static('public'));
var conn=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'simone',
})

var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({ extended: true }));
router.use(session({
  secret:'A2ZITHUB',
  resave:false,
  saveUninitialized:true
}))
router.use(fileUpload())

function login_check(req,res,next){
  if(req.session.name){
    next();

  }else{  
    res.redirect('/admin')
  }
}

router.get('/',(req,res)=>{
  // res.send(req.session)
  res.render('admin/login.ejs');
})
router.post('/login_check',async(req,res)=>{
  // res.send('welcome');
  // res.send(req.body);
  var {username,password}=req.body;
  // res.send(username);
  var sql='select * from login where username=? and password=?';
  var data= await exe (sql,[username,password]);
  // res.send(data);
if(data[0]){
    req.session.id=data[0].lid;
    req.session.name=data[0].name;
    res.redirect('/admin/dashboard')

}
else{
    res.redirect('/admin');
}
})

router.get('/dashboard',(req,res)=>{
  // res.send(req.session.name);
  var name=req.session.name
  res.render('admin/dashboard.ejs',{name:name})
})

router.get('/form',(req,res)=>{
  // res.send('form');
  res.render('admin/form.ejs')
})

router.get('/table',(req,res)=>{
  // res.send('table');
  res.render('admin/table.ejs')
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/admin')
})
router.get('/service_add',(req,res)=>{
  res.render('admin/service_add.ejs');
})

router.post('/service_save', async (req,res)=>{
  // res.send(req.body);
  var {s_icons,s_title,s_desc}=req.body;
  var sql= 'insert into service(s_icons,s_title,s_desc)values(?,?,?)';
  var data =await exe(sql,[s_icons,s_title,s_desc]);
  // res.send('Done');
  res.redirect('/admin/service_add')
})

router.get('/service_list',async(req,res)=>{
  var sql='select * from service';
  var data=await exe (sql);
  // res.send(data);
  res.render('admin/service_list.ejs',{service:data});
})

router.get('/education_add',(req,res)=>{
  res.render('admin/education_add.ejs')
})

router.get('/work_add',(req,res)=>{
  res.render('admin/work_add.ejs')
})
router.post('/work_save',async(req,res)=>{
  // res.send(req.files)
  var {w_title,w_desc}=req.body;
  //img
  var img =req.files.w_img;
  var imgname=req.files.w_img.name;
  var newname=Date.now()+imgname;
 var imgpath = path.join(__dirname, '../public/image', newname);
  img.mv(imgpath,(err)=>{});
  // res.send(newname);
  var sql='insert into work(w_img,w_title,w_desc)values(?,?,?)';
  var data =await exe(sql,[newname,w_title,w_desc]);

  // res.send('saved')
  res.redirect('/admin/work_add')  
})
router.get('/work_list', async(req,res)=>{
  var sql ='select * from work ';
  var data =await exe (sql,)
  res.render('admin/work_list.ejs',{work:data});
})
router.get('/contact_pending',(req,res)=>{
  
})

router.get('/home_update',async(req,res)=>{
  var sql='select * from home where hid=1';
  var data=await exe(sql);
  // res.send(data[0]);
  res.render('admin/home_update.ejs',{home:data[0]});
});
router.post('/home_update_save/:id/:img',async(req,res)=>{
  var id =req.params.id;
  var oldimg =req.params.img;
  var{h_title1,h_title2,h_title3,h_desc,}=req.body;
  // res.send(req.body);

  // res.send(req.files);
  if(req.files){
    //new
   var img =req.files.h_img;
  var imgname=req.files.h_img.name;
  var myphoto=Date.now()+imgname;
 var imgpath = path.join(__dirname, '../public/image', myphoto);
  img.mv(imgpath,(err)=>{});
//remove
  }else{
    var myphoto=oldimg;
  }
  var sql='update home set h_img=?,h_title1=?,h_title2=?,h_title3=?,h_desc=? where hid=?';
  var data=await exe (sql,[myphoto,h_title1,h_title2,h_title3,h_desc,id]);
  res.redirect('/admin/home_update');


})

module.exports=router;
