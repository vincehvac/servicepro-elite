exports.up = function(knex) {
  return knex.schema.createTable('service_agreements', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('customer_id').references('id').inTable('customers').notNullable();
    table.string('agreement_number').unique().notNullable();
    table.string('service_type').notNullable();
    table.text('description');
    table.decimal('contract_value', 10, 2);
    table.date('start_date').notNullable();
    table.date('end_date');
    table.enu('billing_frequency', ['monthly', 'quarterly', 'annually']).defaultTo('monthly');
    table.json('services_included');
    table.json('terms_conditions');
    table.boolean('is_active').defaultTo(true);
    table.boolean('auto_renew').defaultTo(false);
    table.uuid('created_by').references('id').inTable('users');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('service_agreements');
};