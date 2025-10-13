exports.up = function(knex) {
  return knex.schema.createTable('invoices', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('customer_id').references('id').inTable('customers').notNullable();
    table.uuid('job_id').references('id').inTable('jobs');
    table.string('invoice_number').unique().notNullable();
    table.date('invoice_date').notNullable();
    table.date('due_date');
    table.json('line_items'); // Array of items
    table.decimal('subtotal', 10, 2);
    table.decimal('tax_amount', 10, 2);
    table.decimal('total_amount', 10, 2);
    table.decimal('amount_paid', 10, 2).defaultTo(0);
    table.decimal('balance_due', 10, 2);
    table.enu('status', ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled']).defaultTo('draft');
    table.json('payment_terms');
    table.text('notes');
    table.uuid('created_by').references('id').inTable('users');
    table.timestamp('sent_date');
    table.timestamp('paid_date');
    table.json('payment_history');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('invoices');
};