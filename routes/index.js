var express = require('express');
var router = express.Router();
const sql = require("../utils/db")

/* GET home page. */
router.get('/',async function(req, res, next) {
 try{
  const users = await sql `select * from users`;
  console.log('users', users);
 }catch(Ex){
    if(Ex.erors && Ex.erors[0].message){
      //Kết nối
      console.log('Kết Nối',Ex.erors[0].message);
    }else{
      //Truy vấn sai
      console.log(Ex.message);
    }
  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
