const db = require('../config/database');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      alternatePhone,
      address,
      billingAddress,
      customerType,
      preferences,
      notes,
      creditLimit,
      paymentTerms
    } = req.body;

    const [customer] = await db('customers')
      .insert({
        company_id: req.user.company_id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        alternate_phone: alternatePhone,
        address: JSON.stringify(address),
        billing_address: JSON.stringify(billingAddress),
        customer_type: customerType,
        preferences: JSON.stringify(preferences),
        notes,
        credit_limit: creditLimit,
        payment_terms: JSON.stringify(paymentTerms)
      })
      .returning('*');

    logger.info(`New customer created: ${customer.first_name} ${customer.last_name}`);

    res.status(201).json({
      message: 'Customer created successfully',
      customer: {
        ...customer,
        address: JSON.parse(customer.address),
        billing_address: customer.billing_address ? JSON.parse(customer.billing_address) : null,
        preferences: customer.preferences ? JSON.parse(customer.preferences) : null,
        payment_terms: customer.payment_terms ? JSON.parse(customer.payment_terms) : null
      }
    });
  } catch (error) {
    logger.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, type, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('customers')
      .where({ company_id: req.user.company_id })
      .orderBy('created_at', 'desc');

    if (search) {
      query = query.where(function() {
        this.where('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('phone', 'ilike', `%${search}%`);
      });
    }

    if (type) {
      query = query.where({ customer_type: type });
    }

    if (status === 'active') {
      query = query.where({ is_active: true });
    } else if (status === 'inactive') {
      query = query.where({ is_active: false });
    }

    const customers = await query
      .limit(limit)
      .offset(offset);

    const total = await db('customers')
      .where({ company_id: req.user.company_id })
      .count('* as count')
      .first();

    const formattedCustomers = customers.map(customer => ({
      ...customer,
      address: customer.address ? JSON.parse(customer.address) : null,
      billing_address: customer.billing_address ? JSON.parse(customer.billing_address) : null,
      preferences: customer.preferences ? JSON.parse(customer.preferences) : null,
      payment_terms: customer.payment_terms ? JSON.parse(customer.payment_terms) : null
    }));

    res.json({
      customers: formattedCustomers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    logger.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await db('customers')
      .where({ id, company_id: req.user.company_id })
      .first();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get customer jobs
    const jobs = await db('jobs')
      .where({ customer_id: id })
      .orderBy('created_at', 'desc')
      .limit(10);

    // Get customer service agreements
    const serviceAgreements = await db('service_agreements')
      .where({ customer_id: id })
      .orderBy('created_at', 'desc');

    // Get customer equipment
    const equipment = await db('customer_equipment')
      .where({ customer_id: id })
      .orderBy('created_at', 'desc');

    const formattedCustomer = {
      ...customer,
      address: customer.address ? JSON.parse(customer.address) : null,
      billing_address: customer.billing_address ? JSON.parse(customer.billing_address) : null,
      preferences: customer.preferences ? JSON.parse(customer.preferences) : null,
      payment_terms: customer.payment_terms ? JSON.parse(customer.payment_terms) : null,
      jobs,
      serviceAgreements,
      equipment
    };

    res.json({ customer: formattedCustomer });
  } catch (error) {
    logger.error('Get customer by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = {};

    const allowedFields = [
      'first_name', 'last_name', 'email', 'phone', 'alternate_phone',
      'address', 'billing_address', 'customer_type', 'preferences',
      'notes', 'credit_limit', 'payment_terms', 'is_active'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        if (['address', 'billing_address', 'preferences', 'payment_terms'].includes(key)) {
          updates[key] = JSON.stringify(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    const [customer] = await db('customers')
      .where({ id, company_id: req.user.company_id })
      .update(updates)
      .returning('*');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    logger.info(`Customer updated: ${customer.first_name} ${customer.last_name}`);

    res.json({
      message: 'Customer updated successfully',
      customer: {
        ...customer,
        address: customer.address ? JSON.parse(customer.address) : null,
        billing_address: customer.billing_address ? JSON.parse(customer.billing_address) : null,
        preferences: customer.preferences ? JSON.parse(customer.preferences) : null,
        payment_terms: customer.payment_terms ? JSON.parse(customer.payment_terms) : null
      }
    });
  } catch (error) {
    logger.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await db('customers')
      .where({ id, company_id: req.user.company_id })
      .update({ is_active: false })
      .returning('*');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    logger.info(`Customer deactivated: ${customer.first_name} ${customer.last_name}`);

    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    logger.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};