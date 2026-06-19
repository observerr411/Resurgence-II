import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { z } from 'zod';

export const transferRouter = Router();

const transferSchema = z.object({
  beneficiaryId: z.string(),
  amount: z.string(),
  token: z.string(),
  expiresAt: z.number(),
  spendingRules: z.array(z.object({
    category: z.string(),
    limit: z.string(),
  })).optional(),
  purpose: z.string(),
});

// Get all transfers
transferRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Transfers retrieved successfully',
  });
});

// Get transfer by ID
transferRouter.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      beneficiaryId: 'test',
      amount: '1000',
      status: 'active',
    },
  });
});

// Create conditional transfer
transferRouter.post('/', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  try {
    const data = transferSchema.parse(req.body);
    const transferId = crypto.randomUUID();

    res.status(201).json({
      success: true,
      data: {
        id: transferId,
        ...data,
        status: 'active',
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

// Process spending
transferRouter.post('/:id/spend', authenticate, (req, res) => {
  const { id } = req.params;
  const { merchantId, amount, category, location } = req.body;

  res.status(200).json({
    success: true,
    data: {
      transferId: id,
      transactionId: crypto.randomUUID(),
      merchantId,
      amount,
      category,
      status: 'completed',
      timestamp: new Date(),
    },
  });
});

// Get transfer details
transferRouter.get('/:id/details', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      transferId: id,
      beneficiaryId: 'test',
      totalAmount: '1000',
      spent: '450',
      remaining: '550',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      spendingRules: [
        { category: 'food', limit: '400', spent: '200' },
        { category: 'medical', limit: '300', spent: '150' },
      ],
    },
  });
});
