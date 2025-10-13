const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  getScheduleBoard,
  updateAppointment,
  getTechnicianAvailability,
  dispatchTechnician
} = require('../controllers/schedulingController');

const router = express.Router();

// Validation middleware
const appointmentValidation = [
  body('jobId').isUUID(),
  body('technicianId').isUUID(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
];

const dispatchValidation = [
  body('jobId').isUUID(),
  body('technicianId').isUUID(),
  body('priority').optional().isIn(['urgent', 'high', 'normal', 'low'])
];

// Routes
router.post('/appointments', appointmentValidation, createAppointment);
router.get('/board', getScheduleBoard);
router.put('/appointments/:id', appointmentValidation, updateAppointment);
router.get('/availability', getTechnicianAvailability);
router.post('/dispatch', dispatchValidation, dispatchTechnician);

module.exports = router;