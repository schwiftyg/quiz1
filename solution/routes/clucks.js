const express = require('express');
const knex = require('../db/client'); 
const router = express.Router();

router.get('/', (req, res) => {
     knex('clucks')
    .orderBy("created_at", "desc")
    .then(data => {
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
 
router.get('/new', (req, res) => {
    res.render("clucks/new");
})

router.post('/', (req, res) => {
    
    console.log(req.body);
    let username=req.cookies.username ;

    let trendArr=[];
    if(req.body.content.includes("#")){
        let contentArr=req.body.content.split(" ")
        for(let x of contentArr){
            if(x.includes("#")){
                trendArr.push(x)
            }
        }
        for(let x of trendArr){
            knex('trending')
                .select('*')
                .where('trend','like', x)
                .then((record)=>{
                    if(record.length===0){
                        knex('trending')
                        .insert({
                            trend:`${x}`,
                            count:1
                        })
                        .returning("*")
                        .then(()=>{
                            return "inserted new trend"
                        })
                    }else{
                        let count=record[0].count+1;
                        knex('trending')
                        .where('trend','ilike',x)
                        .update({
                            count:count
                        })
                        .returning('*')
                        .then((record)=>{
                              console.log(record)
                        })
                    }
                })
        }
    }

    knex('clucks')
    .insert({
       username: username,      
       content: req.body.content,
       image_url: req.body.image_url
    })
    .returning('*') //ask knex to return the record we just added
    .then(data => {
        res.redirect(`/clucks/${data[0].id}`)         
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    knex('clucks')
    .where("id", id)
    .first()
    .then(data => {
        res.render("clucks/show", { clucks: data })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    knex("clucks")
    .where("id", req.params.id)
    .then(data => {
        console.log(data[0].content);
        let trendArr=[];
        if(data[0].content.includes("#")){
            let contentArr=data[0].content.split(" ")
            for(let x of contentArr){
                if(x.includes("#")){
                    trendArr.push(x)
                }
            }
            for(let x of trendArr){        
                //let count=record[0].count-1;
                knex('trending')
                .select('*')
                .where('trend','like', x)
                .then((record)=>{
                    let count=record[0].count-1;
                    knex('trending')
                    .where('trend','ilike',x)
                    .update({
                        count:count
                    })
                    .returning('*')
                    .then((record)=>{
                            console.log(record)
                    })  
                }) 
            }
        }

        knex('clucks')
        .where("id", id)
        .del()
        .then(() => {
            res.redirect('/clucks')
        })
    })

})

//route to get the edit page
//also get that specific record and pass it to the edit page
router.get('/:id/edit', (req,res) => {
    knex("clucks")
    .where("id", req.params.id)
    .then(data => {
        res.render("clucks/edit", { cluck: data[0] });
    })
})

router.patch('/:id', (req, res) => {
    console.log(req.body);
    console.log(req.params);
    /// delete old trending first, then add new trending 
    knex("clucks")
    .where("id", req.params.id)
    .then(data => {
    
        let trendArr=[];
        if(data[0].content.includes("#")){
            let contentArr=data[0].content.split(" ")
            for(let x of contentArr){
                if(x.includes("#")){
                    trendArr.push(x)
                }
            }
            for(let x of trendArr){        
                //let count=record[0].count-1;
                knex('trending')
                .select('*')
                .where('trend','like', x)
                .then((record)=>{
                    let count=record[0].count-1;
                    knex('trending')
                    .where('trend','ilike',x)
                    .update({
                        count:count
                    })
                    .returning('*')
                    .then((record)=>{
                            console.log(record)
                    })  
                }) 
            }
        }
    })    

    trendArr=[];
    if(req.body.content.includes("#")){
        let contentArr=req.body.content.split(" ")
        for(let x of contentArr){
            if(x.includes("#")){
                trendArr.push(x)
            }
        }
        for(let x of trendArr){
            knex('trending')
                .select('*')
                .where('trend','like', x)
                .then((record)=>{
                    if(record.length===0){
                        knex('trending')
                        .insert({
                            trend:`${x}`,
                            count:1
                        })
                        .returning("*")
                        .then(()=>{
                            return "inserted new trend"
                        })
                    }else{
                        let count=record[0].count+1;
                        knex('trending')
                        .where('trend','ilike',x)
                        .update({
                            count:count
                        })
                        .returning('*')
                        .then((record)=>{
                              console.log(record)
                        })
                    }
                })
        }
    }

    knex("clucks")
    .where("id", req.params.id)
    .update(
        {
        content: req.body.content,
        image_url: req.body.image_url,
        updated_at:knex.fn.now()
    }
    ).then(() => {
        res.redirect(`/clucks/${req.params.id}`)
    })
})




// replace faker demo image from unsplash
router.get('/demo/:id', function (req, res) {      
    if(req.params.id==0){        
        knex("clucks")
        .min('id')     
        .then(data => {
            //console.log(data[0]);
            res.render('../db/seeds/demo',{ id: data[0]['min'] } );
        })
    }else{
          res.render('../db/seeds/demo',{ id:  req.params.id } );
    }
});

router.patch('/input_demo_image/:id', (req, res) => {   
    //console.log(req.body);
    //console.log(req.params);
    knex("clucks")
    .where("id", req.params.id)
    .update(      
        {  
        imageUrl: req.body.imgurl
        }    
    ).then(() => {
        knex("clucks")
        .max('id')     
        .then(data => {
            next_id = parseInt(req.params.id)+1;
            console.log(next_id);
            if(req.params.id>data[0]['max']){ 
                res.redirect("/clucks");
            }else{                
                res.redirect(`/clucks/demo/${next_id}`);                
            }
        })
    })    
});

 

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

//export this router in the end so that we can use the routes inside app.js
module.exports = router;
