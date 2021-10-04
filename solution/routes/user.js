const express = require('express');
// const knex = require('../db/client');
const router = express.Router();


router.get('/sign_in',(req,res)=>{
    res.render('signin',{username:false})
})

router.get('/signout',(req,res)=>{
    res.clearCookie('username')
    res.redirect('/user/signin')
})

router.get('',(req,res)=>{
    // console.log(req.cookies)
    let username=req.cookies.username
    console.log(username)
    res.render('cluck',{username:username})
})

router.use((req,res,next)=>{
    const username = req.cookies.username;    
    res.locals.username=""
    //local will change the variable the global variable
    if(username){
      res.locals.username = username;
      console.log(`Signed in as ${username}`);
    }
    next();
  })


router.post('/sign_in',(req,res)=>{
    const COOKIE_EXPIRE = 1000 * 60 * 60 * 24 * 7;
    const username = req.body.username; 
    res.cookie('username', username, { maxAge: COOKIE_EXPIRE });
    res.redirect('/clucks/new')
})
/*
router.get('/newcluck',(req,res)=>{
    res.render('newcluck')
})*/










module.exports = router;