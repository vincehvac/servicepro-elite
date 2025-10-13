exports.up = function(knex) {
  return knex.schema.createTable('customers', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email');
    table.string('phone');
    table.string('alternate_phone');
    table.json('address');
    table.json('billing_address');
    table.string('customer_type');
    table.json('preferences');
    table.text('notes');
    table.boolean('is_active').defaultTo(true);
    table.decimal('credit_limit', 10, 2);
    table.json('payment_terms');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers');
};