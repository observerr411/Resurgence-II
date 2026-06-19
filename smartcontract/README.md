# Resurgence Smart Contracts

Production-ready Soroban smart contracts for the Stellar Disaster Relief Platform.

## Overview

This directory contains six core smart contracts that power the Resurgence platform:

1. **aid_registry.rs** - Emergency fund management with multi-signature security
2. **beneficiary_manager.rs** - Self-sovereign identity and biometric-free verification
3. **merchant_network.rs** - Local merchant onboarding and payment processing
4. **cash_transfer.rs** - Conditional cash transfers with spending rules
5. **supply_chain_tracker.rs** - Aid shipment tracking with geolocation and temperature monitoring
6. **anti_fraud.rs** - Pattern detection and fraud prevention

## Prerequisites

- Rust 1.70+ with Soroban CLI
- wasm32-unknown-unknown target
- Stellar CLI tools
- Node.js 18+ (for SDK integration)

## Installation

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Soroban CLI
cargo install soroban-cli

# Add wasm target
rustup target add wasm32-unknown-unknown
```

## Building

```bash
# Build all contracts
bash build.sh

# Or manually build with cargo
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test --lib
```

## Contract Architecture

### Aid Registry Contract
Manages emergency fund deployment and multi-signature disbursement.

**Key Functions:**
- `initialize(admin)` - Initialize with admin account
- `deploy_emergency_fund(...)` - Deploy new emergency fund
- `trigger_disbursement(...)` - Trigger multi-sig fund release
- `get_fund(fund_id)` - Retrieve fund details
- `get_fund_stats(fund_id)` - Get fund statistics

### Beneficiary Manager Contract
Handles beneficiary registration with biometric-free verification.

**Key Functions:**
- `initialize(admin)` - Initialize contract
- `register_beneficiary(...)` - Register new beneficiary
- `verify_beneficiary(beneficiary_id, verified)` - Verify beneficiary
- `get_beneficiary(beneficiary_id)` - Get beneficiary details
- `generate_qr_code(beneficiary_id)` - Generate offline QR code

### Merchant Network Contract
Manages merchant registration and verification.

**Key Functions:**
- `initialize(admin)` - Initialize contract
- `register_merchant(...)` - Register merchant
- `verify_merchant(merchant_id, verified)` - Verify merchant
- `get_merchant(merchant_id)` - Get merchant details
- `record_transaction(merchant_id, amount)` - Record transaction

### Cash Transfer Contract
Enables conditional cash transfers with spending rules.

**Key Functions:**
- `initialize(admin)` - Initialize contract
- `create_transfer(...)` - Create conditional transfer
- `spend(transfer_id, amount, category)` - Process spending
- `get_transfer(transfer_id)` - Get transfer details

### Supply Chain Tracker Contract
Tracks aid shipments with checkpoints and conditions.

**Key Functions:**
- `initialize(admin)` - Initialize contract
- `create_shipment(...)` - Create new shipment
- `update_checkpoint(...)` - Update shipment checkpoint
- `confirm_delivery(...)` - Confirm delivery
- `get_shipment_history(shipment_id)` - Get full history

### Anti-Fraud Contract
Detects and prevents fraudulent activities.

**Key Functions:**
- `initialize(admin)` - Initialize contract
- `detect_duplicate_registration(...)` - Check for duplicates
- `monitor_transaction(...)` - Monitor for suspicious patterns
- `verify_location(...)` - Verify geolocation
- `review_alert(...)` - Review fraud alerts

## Deployment

### Testnet Deployment

```bash
# Set environment variables
export ADMIN_SECRET_KEY="SADMIN_KEY_HERE"
export STELLAR_NETWORK="testnet"

# Deploy Aid Registry Contract
soroban contract deploy \
  --wasm target/wasm/aid_registry.wasm \
  --source-account ADMIN_SECRET_KEY \
  --network testnet

# Initialize contract
soroban contract invoke \
  --id CONTRACT_ID \
  --source ADMIN_SECRET_KEY \
  --network testnet \
  --function initialize \
  --arg '{"type": "Address", "value": "GADMIN_PUBLIC_KEY"}'

# Repeat for other contracts...
```

### Mainnet Deployment

For production mainnet deployment:

1. Conduct full security audit
2. Test thoroughly on testnet
3. Use multi-signature account for deployment
4. Deploy with time-lock mechanisms
5. Monitor for security incidents

## Security Considerations

### Multi-Signature Protection
- All critical operations (fund disbursement, beneficiary verification) require admin authorization
- Support for m-of-n multi-signature schemes
- Time-locked emergency releases

### Data Validation
- All inputs are validated before processing
- Spending rules are enforced on cash transfers
- Location-based restrictions can be applied

### Fraud Prevention
- Duplicate registration detection
- Suspicious transaction pattern monitoring
- Geolocation verification
- Transaction rate limiting

### Storage Security
- Sensitive data stored in persistent ledger
- Access control enforced at contract level
- Event logging for audit trails

## Integration with Backend

The backend SDK should:

1. Initialize contracts with admin keys
2. Call contract functions through Soroban RPC
3. Listen to contract events for notifications
4. Validate contract states
5. Maintain backup indices for querying

## Testing

```bash
# Run all tests
cargo test --lib

# Run tests with output
cargo test --lib -- --nocapture

# Run specific test
cargo test test_register_beneficiary -- --nocapture
```

## Development Guidelines

1. **Contract Upgrades**
   - Plan for contract migrations
   - Use data storage versioning
   - Maintain backward compatibility where possible

2. **Error Handling**
   - Clear, descriptive error messages
   - Proper panic handling
   - Event logging for failures

3. **Performance**
   - Optimize storage reads/writes
   - Batch operations where possible
   - Consider gas costs for operations

4. **Documentation**
   - Document all public functions
   - Include usage examples
   - Maintain API documentation

## Monitoring & Maintenance

### Health Checks
- Monitor contract call success rates
- Track transaction latency
- Alert on error conditions

### Upgrades
- Plan contract upgrades during low-traffic periods
- Test upgrades on testnet first
- Maintain audit logs of changes

### Compliance
- Follow humanitarian organization standards
- Maintain data privacy
- Document regulatory compliance

## Support & Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK](https://developers.stellar.org/)
- [Rust Soroban SDK](https://github.com/stellar/rs-soroban-sdk)
- [Smart Contract Best Practices](https://soroban.stellar.org/docs/learn/best-practices)

## License

MIT License - See LICENSE file for details

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

Built with ❤️ for the global humanitarian community
