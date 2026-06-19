import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { z } from 'zod';

export const fundRouter = Router();

const fundSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  amount: z.string(),
  disasterType: z.string(),
  location: z.string(),
  expiresAt: z.number(),
  signers: z.array(z.string()),
  threshold: z.number(),
});

// Get all emergency funds
fundRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Emergency funds retrieved successfully',
  });
});

// Get fund by ID
fundRouter.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      name: 'Emergency Fund',
      status: 'active',
    },
  });
});

// Deploy emergency fund
fundRouter.post('/', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  try {
    const data = fundSchema.parse(req.body);
    const fundId = crypto.randomUUID();

    res.status(201).json({
      success: true,
      data: {
        id: fundId,
        ...data,
        status: 'deployed',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
    });
  }
});

// Trigger disbursement
fundRouter.post('/:id/disburse', authenticate, authorize(['admin']), (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      fundId: id,
      disbursementId: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
    },
  });
});

// Get fund statistics
fundRouter.get('/:id/stats', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      fundId: id,
      totalDeployed: '1000000',
      totalDisbursed: '500000',
      beneficiariesServed: 1250,
      merchantsActive: 45,
    },
  });
});
