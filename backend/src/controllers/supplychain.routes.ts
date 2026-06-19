import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { z } from 'zod';

export const supplyChainRouter = Router();

const shipmentSchema = z.object({
  itemName: z.string(),
  itemType: z.string(),
  quantity: z.string(),
  unit: z.string(),
  origin: z.object({
    location: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    location: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  temperatureRange: z.object({
    minTemp: z.number().optional(),
    maxTemp: z.number().optional(),
    critical: z.boolean().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

// Get all shipments
supplyChainRouter.get('/', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Shipments retrieved successfully',
  });
});

// Get shipment by ID
supplyChainRouter.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id,
      itemName: 'Medical Supplies',
      status: 'in_transit',
    },
  });
});

// Create shipment
supplyChainRouter.post('/', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  try {
    const data = shipmentSchema.parse(req.body);
    const shipmentId = crypto.randomUUID();

    res.status(201).json({
      success: true,
      data: {
        id: shipmentId,
        ...data,
        status: 'created',
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

// Update checkpoint
supplyChainRouter.post('/:id/checkpoint', authenticate, authorize(['organization_admin', 'admin']), (req, res) => {
  const { id } = req.params;
  const { location, status, notes } = req.body;

  res.status(200).json({
    success: true,
    data: {
      shipmentId: id,
      checkpointId: crypto.randomUUID(),
      location,
      status,
      timestamp: new Date(),
    },
  });
});

// Confirm delivery
supplyChainRouter.post('/:id/confirm-delivery', authenticate, (req, res) => {
  const { id } = req.params;
  const { recipientId, condition, notes } = req.body;

  res.status(200).json({
    success: true,
    data: {
      shipmentId: id,
      recipientId,
      condition,
      status: 'delivered',
      deliveredAt: new Date(),
    },
  });
});

// Get shipment history
supplyChainRouter.get('/:id/history', authenticate, (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      shipmentId: id,
      history: [
        {
          timestamp: new Date(),
          location: 'Origin Warehouse',
          status: 'created',
        },
      ],
    },
  });
});
