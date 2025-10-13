exports.up = function(knex) {
  return knex.schema.createTable('appointments', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('job_id').references('id').inTable('jobs').notNullable();
    table.uuid('technician_id').references('id').inTable('users').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.enu('status', ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).defaultTo('scheduled');
    table.text('notes');
    table.string('confirmation_method');
    table.timestamp('confirmed_at');
    table.json('location'); // GPS coordinates
    table.boolean('is_recurring').defaultTo(false);
    table.json('recurring_pattern');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('appointments');
};