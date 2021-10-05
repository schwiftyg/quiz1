const { fake } = require("faker");
const faker = require("faker")

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('clucks').del()
    .then(function () {
      // Inserts seed entries
      const clucks=[];        
      /*for (let i = 0; i < 30; i++) {        
        clucks.push(
          { 
            //username: faker.name.firstName, 
            content: faker.lorem.sentences,              
          },
        )
      };*/
      clucks.push(
        { 
          username: "firstName", 
          content: "sentences"              
        }
      )
      return knex('clucks').insert(clucks);      
    });
};
