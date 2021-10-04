//Steps
//Create a route for todos
//Query the db with knex to get all todos
//Render index view with todos that we got back

//So inside the routes directory we create this new file for todos routes, and we call it todosRouter
//The name of this router comes from the table name within our database called "todos"
//Add out first route 

const express = require('express');
const knex = require('../db/client'); //this allows us to interact with the db

//we are only using the route functionality from express
//so we don't need to create the initial of express
//but the initial of express.Router
const router = express.Router();

//NAME: todos#index, METHOD: GET, PATH: /todos
router.get('/', (req, res) => {
    //Query the db with knex to get all the todos
    //knex.select(*).from('todos').then(...) <- this works, but it's easier to write the line below:
    knex('clucks')
    .orderBy("created_at", "desc")
    .then(data => {
        data.forEach(element => {
            element.creatTime = returnTime(element.created_at);
        });
        res.render("clucks/index", {
            username: req.cookies.username,
            clucks: data,
        });
    })
})

//get the new page to create a new todo item
router.get('/new', (req, res) => {
    res.render("clucks/new");
})

//post the data that is entered into the new todo item form
router.post('/', (req, res) => {
    //all the data fro the form is going to be stored inside req.body
    //it has to be a todo req
    console.log(req.body);
    let username=req.cookies.username || 'anonymous';
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
    knex('clucks')
    .where("id", id)
    .del()
    .then(() => {
        res.redirect('/clucks')
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
        result = "too long ago";
    }
    return result;
}

//export this router in the end so that we can use the routes inside app.js
module.exports = router;
