
 // Update with your config settings.

module.exports = {

    development: {
      client: 'pg',
      connection: {
        database: 'Cluckr',
        // Linux users must include db username and password
        username: 'harry',
        password: '12345678'
      },
      migrations: {
        tableName: "migrations",
        directory: "db/migrations" //tell knex where our migration files will be created
      },
      seeds: {
        directory: "db/seeds"
      }
    } 
  
  };