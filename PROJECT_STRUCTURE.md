# Resurgence - Stellar Disaster Relief Platform

Production-ready full-stack implementation of a blockchain-based disaster relief platform.

## 📁 Project Structure

```
resurgence/
├── app/                    # Next.js frontend application
├── backend/                # Node.js/Express backend API
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utilities
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database ORM
│   ├── package.json        # Dependencies
│   └── README.md           # Backend documentation
├── smartcontract/          # Soroban smart contracts
│   ├── src/
│   │   ├── aid_registry.rs
│   │   ├── beneficiary_manager.rs
│   │   ├── merchant_network.rs
│   │   ├── cash_transfer.rs
│   │   ├── supply_chain_tracker.rs
│   │   └── anti_fraud.rs
│   ├── Cargo.toml          # Rust dependencies
│   ├── build.sh            # Build script
│   └── README.md           # Smart contracts documentation
├── docker-compose.yml      # Local development setup
├── build.sh                # Full build script
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Docker & Docker Compose (optional, for local development)
- PostgreSQL 12+ (or use Docker)
- Stellar CLI tools

### Development Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up
   ```
   Or manually:

4. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   cd ..
   ```

6. **Start backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on http://localhost:3001

7. **Start frontend**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## 🏗️ Building Smart Contracts

```bash
cd smartcontract

# Build all contracts
bash build.sh

# Or manually with cargo
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test --lib
```

WASM binaries are available in `target/wasm/`

## 📝 Smart Contracts Overview

### 1. Aid Registry Contract
Emergency fund management with multi-signature security
- Deploy emergency funds
- Multi-sig fund disbursement
- Fund statistics and tracking

### 2. Beneficiary Manager Contract
Self-sovereign identity verification
- Register beneficiaries (biometric-free)
- Behavioral and social verification factors
- QR code generation for offline access

### 3. Merchant Network Contract
Local merchant onboarding and management
- Register merchants
- Verify merchants
- Track transaction statistics

### 4. Cash Transfer Contract
Conditional cash transfers with spending rules
- Create transfers with spending limits
- Category-based spending restrictions
- Real-time balance tracking

### 5. Supply Chain Tracker Contract
Aid shipment tracking with conditions
- Create and track shipments
- Temperature and location monitoring
- Delivery confirmation with checkpoints

### 6. Anti-Fraud Contract
Pattern detection and fraud prevention
- Duplicate registration detection
- Suspicious transaction monitoring
- Geolocation verification
- Fraud alert management

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register organization
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Beneficiaries
- `GET /api/v1/beneficiaries` - List beneficiaries
- `POST /api/v1/beneficiaries` - Register beneficiary
- `GET /api/v1/beneficiaries/:id` - Get beneficiary
- `POST /api/v1/beneficiaries/:id/verify` - Verify
- `POST /api/v1/beneficiaries/:id/qr-code` - Generate QR

### Emergency Funds
- `GET /api/v1/funds` - List funds
- `POST /api/v1/funds` - Deploy fund
- `GET /api/v1/funds/:id` - Get fund details
- `POST /api/v1/funds/:id/disburse` - Trigger disbursement
- `GET /api/v1/funds/:id/stats` - Get statistics

### Merchants
- `GET /api/v1/merchants` - List merchants
- `POST /api/v1/merchants` - Register merchant
- `POST /api/v1/merchants/:id/verify` - Verify merchant
- `GET /api/v1/merchants/:id/stats` - Get stats

### Transfers
- `GET /api/v1/transfers` - List transfers
- `POST /api/v1/transfers` - Create transfer
- `POST /api/v1/transfers/:id/spend` - Process spending
- `GET /api/v1/transfers/:id/details` - Get details

### Supply Chain
- `GET /api/v1/supply-chain` - List shipments
- `POST /api/v1/supply-chain` - Create shipment
- `POST /api/v1/supply-chain/:id/checkpoint` - Update checkpoint
- `POST /api/v1/supply-chain/:id/confirm-delivery` - Confirm delivery
- `GET /api/v1/supply-chain/:id/history` - Get history

### Health
- `GET /health` - Health check
- `GET /health/ready` - Readiness check

## 🔐 Security Features

### Multi-Signature Protection
- 2-of-3 NGO/Government/UN signatures for fund release
- 3-of-4 for critical medical supplies
- Time-locked emergency releases

### Identity Verification
- Biometric-free verification (behavioral + social factors)
- Community vouching system
- Recovery codes for account restoration
- Trust scoring based on transaction history

### Fraud Prevention
- Duplicate registration detection
- Suspicious transaction pattern monitoring
- Geolocation verification
- Spending rule enforcement

### Access Control
- Location-based restrictions
- Category-based spending rules
- Time-based transfer expiry
- Multi-factor authentication

## 📊 Technology Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

### Smart Contracts
- Soroban SDK (Rust)
- Stellar Blockchain
- WebAssembly (WASM)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Kubernetes ready

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:cov
```

### Smart Contract Tests
```bash
cd smartcontract
cargo test --lib
```

## 📋 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/resurgence_db
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
ADMIN_SECRET_KEY=SADMIN_KEY_HERE
```

See `backend/.env.example` for complete list.

## 🚢 Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

### Environment-specific
- **Development**: Local/testnet
- **Staging**: Cloud/testnet
- **Production**: Cloud/mainnet

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Smart Contracts Documentation](./smartcontract/README.md)
- [Frontend Documentation](./README.md)
- [API Documentation](./backend/README.md#api-routes)

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

See CONTRIBUTING.md for detailed guidelines.

## 📄 License

MIT License - See LICENSE file for details.

## 🆘 Support

### Technical Issues
- GitHub Issues: Report bugs and request features
- Documentation: Check README files in each directory

### Humanitarian Support
- NGO Onboarding: partnerships@resurgence.org
- Emergency Response: 24/7 hotline (1-555-RELIEF)

## 🌟 Acknowledgments

- **Stellar Development Foundation** for blockchain infrastructure
- **UN OCHA** for humanitarian guidance
- **WHO** for medical supply chain standards
- **Red Cross** for emergency response best practices

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Smart contracts deployed
- ✅ Backend API functional
- ✅ Frontend UI components
- ✅ Authentication system
- ✅ Beneficiary registration
- ✅ Emergency fund deployment

### v1.1 (Next)
- [ ] Mobile app (React Native)
- [ ] SMS/USSD fallback
- [ ] Offline QR code support
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications

### v2.0 (Future)
- [ ] Cross-chain support
- [ ] Decentralized identity (DID)
- [ ] DAO governance
- [ ] Automated compliance reporting
- [ ] AI-powered fraud detection

---

**Built with ❤️ for the global humanitarian community**

*Using blockchain technology to deliver aid more efficiently, transparently, and securely.*
