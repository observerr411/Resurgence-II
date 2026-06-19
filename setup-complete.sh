#!/bin/bash
# Make build script executable
chmod +x backend/.gitignore smartcontract/.gitignore build.sh backend/Dockerfile

echo "✅ Setup complete!"
echo ""
echo "📚 Documentation:"
echo "   - Backend: ./backend/README.md"
echo "   - Smart Contracts: ./smartcontract/README.md"
echo "   - Full Structure: ./PROJECT_STRUCTURE.md"
echo ""
echo "🚀 Quick Start:"
echo "   1. cd backend && npm install"
echo "   2. cp .env.example .env"
echo "   3. npm run migrate"
echo "   4. npm run dev"
echo ""
echo "Or use Docker:"
echo "   docker-compose up"
