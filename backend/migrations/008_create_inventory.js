exports.up = function(knex) {
  return knex.schema.createTable('inventory_items', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies');
    table.string('sku').unique().notNullable();
    table.string('name').notNullable();
    table.string('category');
    table.text('description');
    table.string('manufacturer');
    table.string('model_number');
    table.decimal('cost_price', 10, 2);
    table.decimal('sale_price', 10, 2);
    table.integer('minimum_stock').defaultTo(0);
    table.integer('current_stock').defaultTo(0);
    table.string('unit_of_measure');
    table.string('location'); // warehouse location
    table.string('truck_assignment'); // for mobile inventory
    table.json('specifications');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('inventory_items');
};