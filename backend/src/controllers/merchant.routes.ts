import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { z } from 'zod';

export const merchantRouter = Router();

const merchantSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  walletAddress: z.string(),
  documents: z.array(z.string()).optional(),
});

// Get all merchants
merchantRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Merchants retrieved successfully',
  });
});

// Get merchant by ID
merchantRouter.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      name: 'Sample Merchant',
      status: 'verified',
    },
  });
});

// Register merchant
merchantRouter.post('/', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  try {
    const data = merchantSchema.parse(req.body);
    const merchantId = crypto.randomUUID();

    res.status(201).json({
      success: true,
      data: {
        id: merchantId,
        ...data,
        status: 'pending_verification',
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

// Verify merchant
merchantRouter.post('/:id/verify', authenticate, authorize(['admin']), (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      status: 'verified',
      verifiedAt: new Date(),
    },
  });
});

// Get merchant statistics
merchantRouter.get('/:id/stats', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      merchantId: id,
      totalTransactions: 245,
      totalVolume: '50000',
      averageTransaction: '204.08',
      beneficiariesServed: 89,
    },
  });
});
