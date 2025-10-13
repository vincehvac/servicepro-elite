exports.up = function(knex) {
  return knex.schema.createTable('jobs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('customer_id').references('id').inTable('customers').notNullable();
    table.uuid('lead_id').references('id').inTable('leads');
    table.uuid('service_agreement_id').references('id').inTable('service_agreements');
    table.string('job_number').unique().notNullable();
    table.string('job_type').notNullable();
    table.text('description');
    table.json('address');
    table.enu('status', ['scheduled', 'dispatched', 'in_progress', 'completed', 'cancelled', 'on_hold']).defaultTo('scheduled');
    table.uuid('assigned_technician').references('id').inTable('users');
    table.uuid('dispatcher').references('id').inTable('users');
    table.timestamp('scheduled_start');
    table.timestamp('scheduled_end');
    table.timestamp('actual_start');
    table.timestamp('actual_end');
    table.decimal('estimated_duration', 5, 2); // hours
    table.integer('priority').defaultTo(3);
    table.json('equipment_details');
    table.text('customer_notes');
    table.text('technician_notes');
    table.decimal('estimated_cost', 10, 2);
    table.decimal('final_cost', 10, 2);
    table.json('custom_fields');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('jobs');
};