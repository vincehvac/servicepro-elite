exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enu('role', ['admin', 'manager', 'technician', 'dispatcher', 'sales']).notNullable();
    table.string('phone');
    table.string('avatar_url');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login');
    table.json('preferences');
    table.string('department');
    table.string('employee_id');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};