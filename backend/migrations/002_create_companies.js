exports.up = function(knex) {
  return knex.schema.createTable('companies', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('industry');
    table.text('description');
    table.string('website');
    table.string('logo_url');
    table.json('address');
    table.string('phone');
    table.string('email');
    table.json('settings');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
};