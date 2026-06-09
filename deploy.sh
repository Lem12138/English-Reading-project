#!/bin/bash
# EnglishReader 部署脚本
# 用法: 在服务器项目根目录下 bash deploy.sh

set -e

echo "=== Building EnglishReader ==="

# 1. 安装依赖
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. 生成 Prisma Client
cd server && npx -p prisma@5 prisma generate --schema=src/prisma/schema.prisma && cd ..

# 3. 构建前端
cd client && npx vite build && cd ..

# 4. 推送数据库
cd server && npx -p prisma@5 prisma db push --schema=src/prisma/schema.prisma && cd ..

# 5. Seed 生成作文
echo ""
echo "=== Running seed (generating essays with DeepSeek)... ==="
cd server && npm run seed && cd ..

echo ""
echo "=== Build complete ==="
echo ""
echo "启动服务（PM2 推荐）:"
echo "  pm2 start \"cd server && npx tsx src/index.ts\" --name english-reader"
echo "  或直接运行:  cd server && npm run dev"
echo ""
echo "访问: http://服务器IP:3001"
