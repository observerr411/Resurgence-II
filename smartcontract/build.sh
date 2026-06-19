#!/bin/bash
# Build script for Soroban smart contracts

set -e

echo "🏗️  Building Resurgence Smart Contracts..."

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI not found. Please install it:"
    echo "   curl -L https://github.com/stellar/rs-soroban-sdk/releases/download/..."
    exit 1
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found. Please install it:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Add wasm target
echo "📦 Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown

# Build all contracts
echo "🔨 Building contracts..."
cargo build --release --target wasm32-unknown-unknown

# Create output directory
mkdir -p target/wasm

# Copy built contracts
echo "📁 Copying WASM binaries..."
cp target/wasm32-unknown-unknown/release/*.wasm target/wasm/ 2>/dev/null || true

# Run tests
echo "🧪 Running tests..."
cargo test --lib

echo "✅ Build complete!"
echo "📍 WASM binaries available in: target/wasm/"
echo ""
echo "📝 Next steps:"
echo "   1. Deploy contracts: soroban contract deploy --wasm target/wasm/aid_registry.wasm --source-account ACCOUNT --network testnet"
echo "   2. Initialize contracts with appropriate parameters"
echo "   3. Set up contract IDs in SDK configuration"
