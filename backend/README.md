# Backend README

Production-ready Node.js/Express backend for the Stellar Disaster Relief Platform.

## Overview

This backend provides RESTful API endpoints for:
- User authentication and authorization
- Emergency fund management
- Beneficiary registration and verification
- Merchant network onboarding
- Conditional cash transfer processing
- Supply chain tracking
- Fraud detection and prevention

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 12+
- Stellar CLI tools

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Seed database (optional)
npm run db:seed
```

## Development

```bash
# Start development server with hot reload
npm run dev

# The API will be available at http://localhost:3001
```

## Building for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:cov` - Run tests with coverage
- `npm run migrate` - Run database migrations
- `npm run migrate:prod` - Run migrations in production
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## API Routes

### Authentication
- `POST /api/v1/auth/signup` - Register new user/organization
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Beneficiaries
- `GET /api/v1/beneficiaries` - List beneficiaries
- `GET /api/v1/beneficiaries/:id` - Get beneficiary
- `POST /api/v1/beneficiaries` - Register beneficiary
- `PATCH /api/v1/beneficiaries/:id` - Update beneficiary
- `POST /api/v1/beneficiaries/:id/verify` - Verify beneficiary
- `POST /api/v1/beneficiaries/:id/qr-code` - Generate QR code

### Emergency Funds
- `GET /api/v1/funds` - List funds
- `GET /api/v1/funds/:id` - Get fund details
- `POST /api/v1/funds` - Deploy emergency fund
- `POST /api/v1/funds/:id/disburse` - Trigger disbursement
- `GET /api/v1/funds/:id/stats` - Get fund statistics

### Merchants
- `GET /api/v1/merchants` - List merchants
- `GET /api/v1/merchants/:id` - Get merchant
- `POST /api/v1/merchants` - Register merchant
- `POST /api/v1/merchants/:id/verify` - Verify merchant
- `GET /api/v1/merchants/:id/stats` - Get merchant stats

### Transfers
- `GET /api/v1/transfers` - List transfers
- `GET /api/v1/transfers/:id` - Get transfer
- `POST /api/v1/transfers` - Create conditional transfer
- `POST /api/v1/transfers/:id/spend` - Process spending
- `GET /api/v1/transfers/:id/details` - Get transfer details

### Supply Chain
- `GET /api/v1/supply-chain` - List shipments
- `GET /api/v1/supply-chain/:id` - Get shipment
- `POST /api/v1/supply-chain` - Create shipment
- `POST /api/v1/supply-chain/:id/checkpoint` - Update checkpoint
- `POST /api/v1/supply-chain/:id/confirm-delivery` - Confirm delivery
- `GET /api/v1/supply-chain/:id/history` - Get shipment history

### Health
- `GET /health` - Health check
- `GET /health/ready` - Readiness check

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Development/production environment
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT signing secret
- `STELLAR_NETWORK` - Stellar network (testnet/mainnet)
- `STELLAR_RPC_URL` - Soroban RPC endpoint
- `ADMIN_SECRET_KEY` - Admin account private key

## Architecture

### Directory Structure
```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/       # Business logic
│   ├── models/         # Data models
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utilities
│   ├── types/          # TypeScript types
│   └── index.ts        # Entry point
├── prisma/             # Database schema
├── .env.example        # Environment template
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript config
```

### Middleware Stack
- `helmet` - Security headers
- `cors` - Cross-origin requests
- `express-rate-limit` - Rate limiting
- `pino-http` - HTTP logging
- Custom authentication middleware
- Custom error handler

## Database

This project uses Prisma ORM with PostgreSQL.

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npm run migrate -- --name add_feature

# Reset database (dev only)
npx prisma db push --skip-generate

# View database UI
npx prisma studio
```

## Authentication & Authorization

### JWT-based Authentication
- Generate JWT tokens on login
- Include token in Authorization header: `Bearer <token>`
- Tokens expire after configured duration
- Refresh token mechanism (to be implemented)

### Role-based Authorization
- `admin` - Full system access
- `organization_admin` - Organization-level access
- `staff` - Limited access for field workers
- `beneficiary` - Self-service access only

## Error Handling

All errors follow a standard format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "request_id": "uuid"
}
```

## Logging

Logs are output in JSON format using Pino logger.

Development: Pretty-printed logs
Production: JSON structured logs for log aggregation

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:cov
```

## Deployment

### Docker Deployment
```bash
docker build -t resurgence-backend .
docker run -p 3001:3001 --env-file .env resurgence-backend
```

### Kubernetes Deployment
See `k8s/` directory for manifests.

### Environment-specific Configuration
- Development: Local PostgreSQL, testnet Stellar
- Staging: Cloud PostgreSQL, testnet Stellar
- Production: Managed PostgreSQL, mainnet Stellar

## Security

### HTTPS
- Enable in production
- Use environment variable for certificate paths

### CORS
- Configure allowed origins in .env
- Default: Allow frontend URL only

### Rate Limiting
- API requests limited to 100 per 15 minutes per IP
- Configurable via environment variables

### Input Validation
- All inputs validated with Zod schemas
- SQL injection protected via Prisma ORM
- XSS protection via Express sanitization

### Data Protection
- Passwords hashed with bcryptjs
- Sensitive data encrypted at rest
- Audit logging for sensitive operations

## Monitoring & Observability

### Metrics
- Track API response times
- Monitor error rates
- Count requests by endpoint

### Logging
- All requests logged with request ID
- Errors logged with full context
- Sensitive data redacted

### Health Checks
- Liveness probe: /health
- Readiness probe: /health/ready

## Performance Optimization

- Connection pooling for database
- Request caching where appropriate
- Compression for API responses
- Efficient database queries with Prisma

## Maintenance

### Dependency Updates
```bash
npm outdated          # Check outdated packages
npm update            # Update packages
npm audit             # Check security issues
npm audit fix         # Fix vulnerabilities
```

### Database Maintenance
```bash
# Backup
pg_dump resurgence_db > backup.sql

# Restore
psql resurgence_db < backup.sql
```

## Support & Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Stellar SDK](https://developers.stellar.org/)
- [Zod Validation](https://zod.dev/)

## License

MIT License - See LICENSE file for details

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

Built with ❤️ for the global humanitarian community
