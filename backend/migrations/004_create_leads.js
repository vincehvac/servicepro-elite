exports.up = function(knex) {
  return knex.schema.createTable('leads', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies');
    table.string('source').notNullable(); // web, phone, referral, etc.
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email');
    table.string('phone');
    table.json('address');
    table.text('description');
    table.enu('status', ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).defaultTo('new');
    table.decimal('potential_value', 10, 2);
    table.uuid('assigned_to').references('id').inTable('users');
    table.integer('priority').defaultTo(3); // 1-5 scale
    table.timestamp('follow_up_date');
    table.json('custom_fields');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('leads');
};