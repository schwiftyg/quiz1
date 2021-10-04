
exports.up = function(knex) {
    return knex.schema.createTable('trending',table=>{
        table.string('trend');
        table.integer('count');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('trending')
};
