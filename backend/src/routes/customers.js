const express = require('express');
const { body } = require('express-validator');
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

const router = express.Router();

// Validation middleware
const customerValidation = [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('customerType').optional().isIn(['residential', 'commercial', 'industrial']),
  body('creditLimit').optional().isFloat({ min: 0 })
];

// Routes
router.post('/', customerValidation, createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', customerValidation, updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;