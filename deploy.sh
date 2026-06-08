#!/bin/bash
# EnglishReader 部署脚本
# 用法: bash deploy.sh

echo "=== Building EnglishReader ==="

# 1. 安装依赖
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. 构建前端
cd client && npx vite build && cd ..

# 3. 初始化数据库
cd server && npx prisma db push --schema=src/prisma/schema.prisma && cd ..

echo ""
echo "=== Build complete ==="
echo ""
echo "To start the server:"
echo "  cd server && npm run dev"
echo ""
echo "Or with PM2 (recommended for production):"
echo "  pm2 start server/src/index.ts --name english-reader --interpreter tsx"
echo ""
echo "Access the site at http://your-server-ip:3001"
