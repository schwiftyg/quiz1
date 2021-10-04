const express = require('express');
const knex = require('../db/client'); 
const router = express.Router();
router.get('/', (req, res) => {
    res.redirect(`/clucks`);
})
router.get('/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    console.log(req.params);
    
    knex('clucks')
    .where('content','like', '%#'+keyword+'%')
    .orderBy("created_at", "desc")
    .then(data => {
        console.log(data);
        data.forEach(element => {
            element.creatTime = returnTime(element.created_at);
        });
        knex('trending')
            .select('*')
            .orderBy('count','desc')
            .returning('*')
            .then((trend)=>{
                res.render("clucks/index", {
                    username: req.cookies.username,
                    clucks: data,
                    trend:  trend,
                });
            })
       
    })
     
})

function returnTime(date) {
    const now = new Date();
    date = new Date(date);
    const ms = now.getTime() - date.getTime();
    let result = "";
    let checkMs = 0;
    if (ms < 60000) {
        result = "Just now"
    } else if (ms < 3600000) {
        checkMs = Math.floor(ms / 1000 / 60);
        if (checkMs > 1) {
            result = checkMs + " minutes ago";
        } else {
            result = "1 minute ago";
        }
    } else if (ms >= 3600000) {
        checkMs = Math.floor(ms / 1000 / 60 / 60);
        if (checkMs > 1) {
            result = checkMs + " hours ago";
        } else {
            result = "1 hour ago";
        }
    } else if (ms >= 86400000) {
        checkMs = Math.floor(ms / 1000 / 60 / 60 / 24);
        if (checkMs > 1) {
            result = checkMs + " days ago";
        } else {
            result = "1 day ago";
        }
    } else {
        result = "long time ago";
    }
    return result;
}

module.exports = router;