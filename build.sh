#!/bin/bash
# Build script for entire Resurgence platform

set -e

echo "🚀 Resurgence Platform Build Script"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build backend
echo -e "${BLUE}📦 Building Backend...${NC}"
cd backend
npm install
npm run build
echo -e "${GREEN}✅ Backend build complete${NC}"
cd ..
echo ""

# Build smart contracts
echo -e "${BLUE}🏗️  Building Smart Contracts...${NC}"
cd smartcontract
bash build.sh
echo -e "${GREEN}✅ Smart contracts build complete${NC}"
cd ..
echo ""

echo -e "${GREEN}🎉 All builds complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure environment variables (.env files)"
echo "2. Set up PostgreSQL database"
echo "3. Run 'npm run migrate' in backend directory"
echo "4. Deploy smart contracts to Stellar network"
echo "5. Start backend with 'npm run dev' in backend directory"
echo ""
