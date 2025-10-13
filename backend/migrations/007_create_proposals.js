exports.up = function(knex) {
  return knex.schema.createTable('proposals', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('customer_id').references('id').inTable('customers').notNullable();
    table.uuid('lead_id').references('id').inTable('leads');
    table.string('proposal_number').unique().notNullable();
    table.string('title').notNullable();
    table.text('description');
    table.json('services'); // Array of service items
    table.decimal('subtotal', 10, 2);
    table.decimal('tax_amount', 10, 2);
    table.decimal('total_amount', 10, 2);
    table.enu('status', ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired']).defaultTo('draft');
    table.date('valid_until');
    table.uuid('created_by').references('id').inTable('users');
    table.timestamp('sent_date');
    table.timestamp('accepted_date');
    table.json('custom_fields');
    table.string('template_used');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('proposals');
};