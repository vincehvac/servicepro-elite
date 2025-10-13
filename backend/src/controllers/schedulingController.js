const db = require('../config/database');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      jobId,
      technicianId,
      startTime,
      endTime,
      notes,
      confirmationMethod,
      isRecurring,
      recurringPattern
    } = req.body;

    // Check for scheduling conflicts
    const conflicts = await db('appointments')
      .where({ technician_id: technicianId })
      .where(function() {
        this.whereBetween('start_time', [startTime, endTime])
          .orWhereBetween('end_time', [startTime, endTime])
          .orWhere(function() {
            this.where('start_time', '<=', startTime)
              .where('end_time', '>=', endTime);
          });
      })
      .whereNot({ status: 'cancelled' });

    if (conflicts.length > 0) {
      return res.status(409).json({ 
        error: 'Scheduling conflict detected',
        conflicts: conflicts.map(c => ({
          startTime: c.start_time,
          endTime: c.end_time,
          status: c.status
        }))
      });
    }

    const [appointment] = await db('appointments')
      .insert({
        job_id: jobId,
        technician_id: technicianId,
        start_time: startTime,
        end_time: endTime,
        notes,
        confirmation_method: confirmationMethod,
        is_recurring: isRecurring,
        recurring_pattern: recurringPattern ? JSON.stringify(recurringPattern) : null
      })
      .returning('*');

    // Update job status
    await db('jobs')
      .where({ id: jobId })
      .update({ 
        status: 'scheduled',
        scheduled_start: startTime,
        scheduled_end: endTime,
        assigned_technician: technicianId
      });

    logger.info(`Appointment created for job ${jobId} with technician ${technicianId}`);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: {
        ...appointment,
        recurring_pattern: appointment.recurring_pattern ? JSON.parse(appointment.recurring_pattern) : null
      }
    });
  } catch (error) {
    logger.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getScheduleBoard = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      technicianId, 
      view = 'week' 
    } = req.query;

    let query = db('appointments')
      .join('jobs', 'appointments.job_id', 'jobs.id')
      .join('customers', 'jobs.customer_id', 'customers.id')
      .join('users', 'appointments.technician_id', 'users.id')
      .select(
        'appointments.*',
        'jobs.job_number',
        'jobs.job_type',
        'jobs.priority',
        'customers.first_name as customer_first_name',
        'customers.last_name as customer_last_name',
        'customers.address as customer_address',
        'users.first_name as tech_first_name',
        'users.last_name as tech_last_name'
      )
      .orderBy('appointments.start_time');

    if (startDate && endDate) {
      query = query.whereBetween('appointments.start_time', [startDate, endDate]);
    }

    if (technicianId) {
      query = query.where({ 'appointments.technician_id': technicianId });
    }

    const appointments = await query;

    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      jobId: apt.job_id,
      technicianId: apt.technician_id,
      technicianName: `${apt.tech_first_name} ${apt.tech_last_name}`,
      customerName: `${apt.customer_first_name} ${apt.customer_last_name}`,
      customerAddress: apt.customer_address ? JSON.parse(apt.customer_address) : null,
      startTime: apt.start_time,
      endTime: apt.end_time,
      status: apt.status,
      jobNumber: apt.job_number,
      jobType: apt.job_type,
      priority: apt.priority,
      notes: apt.notes,
      confirmed: apt.confirmed_at !== null
    }));

    // Group by technician for schedule board view
    const scheduleBoard = {};
    formattedAppointments.forEach(apt => {
      if (!scheduleBoard[apt.technicianId]) {
        scheduleBoard[apt.technicianId] = {
          technicianId: apt.technicianId,
          technicianName: apt.technicianName,
          appointments: []
        };
      }
      scheduleBoard[apt.technicianId].appointments.push(apt);
    });

    res.json({
      scheduleBoard: Object.values(scheduleBoard),
      totalAppointments: formattedAppointments.length
    });
  } catch (error) {
    logger.error('Get schedule board error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = {};

    const allowedFields = [
      'start_time', 'end_time', 'status', 'notes', 
      'confirmation_method', 'confirmed_at', 'location'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'location') {
          updates[key] = JSON.stringify(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    const [appointment] = await db('appointments')
      .where({ id })
      .update(updates)
      .returning('*');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update job status if appointment status changed
    if (req.body.status) {
      const jobStatusMap = {
        'in_progress': 'in_progress',
        'completed': 'completed',
        'cancelled': 'cancelled'
      };

      if (jobStatusMap[req.body.status]) {
        await db('jobs')
          .where({ id: appointment.job_id })
          .update({ status: jobStatusMap[req.body.status] });
      }
    }

    logger.info(`Appointment updated: ${id}`);

    res.json({
      message: 'Appointment updated successfully',
      appointment: {
        ...appointment,
        location: appointment.location ? JSON.parse(appointment.location) : null
      }
    });
  } catch (error) {
    logger.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTechnicianAvailability = async (req, res) => {
  try {
    const { technicianId, date } = req.query;

    // Get technician's working hours
    const technician = await db('users')
      .where({ id: technicianId, role: 'technician' })
      .first();

    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    const workingHours = {
      start: '08:00', // Default 8 AM
      end: '17:00',   // Default 5 PM
      breakStart: '12:00',
      breakEnd: '13:00'
    };

    // Get existing appointments for the date
    const appointments = await db('appointments')
      .where({ technician_id: technicianId })
      .whereBetween('start_time', [
        new Date(`${date}T00:00:00`),
        new Date(`${date}T23:59:59`)
      ])
      .whereNot({ status: 'cancelled' })
      .orderBy('start_time');

    const busySlots = appointments.map(apt => ({
      start: apt.start_time,
      end: apt.end_time,
      jobId: apt.job_id,
      status: apt.status
    }));

    // Calculate available slots
    const availableSlots = calculateAvailableSlots(workingHours, busySlots, date);

    res.json({
      technicianId,
      date,
      workingHours,
      busySlots,
      availableSlots
    });
  } catch (error) {
    logger.error('Get technician availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateAvailableSlots = (workingHours, busySlots, date) => {
  const slots = [];
  const slotDuration = 60; // 60 minutes
  
  const startTime = new Date(`${date}T${workingHours.start}:00`);
  const endTime = new Date(`${date}T${workingHours.end}:00`);
  const breakStart = new Date(`${date}T${workingHours.breakStart}:00`);
  const breakEnd = new Date(`${date}T${workingHours.breakEnd}:00`);

  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

    // Skip if slot overlaps with break time
    if (currentTime < breakEnd && slotEnd > breakStart) {
      currentTime = new Date(breakEnd);
      continue;
    }

    // Check if slot overlaps with busy periods
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return (currentTime < busyEnd && slotEnd > busyStart);
    });

    if (isAvailable && slotEnd <= endTime) {
      slots.push({
        start: currentTime.toISOString(),
        end: slotEnd.toISOString(),
        duration: slotDuration
      });
    }

    currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute increments
  }

  return slots;
};

const dispatchTechnician = async (req, res) => {
  try {
    const { jobId, technicianId, priority = 'normal' } = req.body;

    // Get job details
    const job = await db('jobs')
      .where({ id: jobId })
      .first();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get technician details
    const technician = await db('users')
      .where({ id: technicianId, role: 'technician' })
      .first();

    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // Update job with technician assignment
    await db('jobs')
      .where({ id: jobId })
      .update({
        assigned_technician: technicianId,
        status: 'dispatched',
        priority: priority === 'urgent' ? 1 : priority === 'high' ? 2 : 3
      });

    // Create notification for technician
    await db('notifications').insert({
      user_id: technicianId,
      type: 'job_assigned',
      title: 'New Job Assigned',
      message: `You have been assigned to job ${job.job_number}`,
      data: JSON.stringify({ jobId, jobNumber: job.job_number })
    });

    logger.info(`Job ${jobId} dispatched to technician ${technicianId}`);

    res.json({
      message: 'Technician dispatched successfully',
      job: {
        id: jobId,
        technicianId,
        technicianName: `${technician.first_name} ${technician.last_name}`,
        status: 'dispatched'
      }
    });
  } catch (error) {
    logger.error('Dispatch technician error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createAppointment,
  getScheduleBoard,
  updateAppointment,
  getTechnicianAvailability,
  dispatchTechnician
};