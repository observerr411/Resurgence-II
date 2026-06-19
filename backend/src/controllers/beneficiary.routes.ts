import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { z } from 'zod';

export const beneficiaryRouter = Router();

// Schema validation
const beneficiarySchema = z.object({
  name: z.string().min(2),
  disasterId: z.string(),
  location: z.string(),
  walletAddress: z.string(),
  familySize: z.number().positive(),
  specialNeeds: z.array(z.string()).optional(),
});

// Get all beneficiaries
beneficiaryRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Beneficiaries retrieved successfully',
  });
});

// Get beneficiary by ID
beneficiaryRouter.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      name: 'Sample Beneficiary',
      status: 'verified',
    },
  });
});

// Register new beneficiary
beneficiaryRouter.post('/', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  try {
    const data = beneficiarySchema.parse(req.body);
    const beneficiaryId = crypto.randomUUID();

    res.status(201).json({
      success: true,
      data: {
        id: beneficiaryId,
        ...data,
        status: 'registered',
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

// Update beneficiary
beneficiaryRouter.patch('/:id', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      message: 'Beneficiary updated successfully',
    },
  });
});

// Verify beneficiary
beneficiaryRouter.post('/:id/verify', authenticate, authorize(['admin']), (req, res) => {
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

// Generate QR code
beneficiaryRouter.post('/:id/qr-code', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      beneficiaryId: id,
      qrCode: `data:image/png;base64,...`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
});
