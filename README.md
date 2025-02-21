# 天赋测评系统

基于科学方法的儿童天赋测评与发展指导系统，帮助家长发现和培养孩子的天赋潜能。

## 功能特点

- 🎯 多维度天赋测评
  - 量表测评（112题）
  - 问答测评（36题）
  - 场景观察
  - 自我认知

- 📊 专业分析报告
  - 天赋维度分析
  - 兴趣倾向分析
  - 发展建议
  - 个性化推荐

- 🔐 安全可靠
  - 微信授权登录
  - 数据加密存储
  - 隐私保护

## 技术栈

### 前端
- React 18
- TypeScript
- Ant Design
- Emotion (CSS-in-JS)
- Vite
- React Router
- Axios

### 后端
- Node.js
- TypeScript
- Koa2
- TypeORM
- PostgreSQL
- JWT认证
- 微信开放平台API

## 开发环境要求

- Node.js >= 16.0.0
- PostgreSQL >= 12
- 微信公众号测试号（开发环境）
- 微信认证服务号（生产环境）

## 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd talent-assessment
```

2. 安装依赖
```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

3. 环境配置
```bash
# 后端配置
cd server
cp .env.example .env
# 编辑 .env 文件，填写必要的配置信息
```

4. 数据库设置
```bash
# 创建数据库
createdb talent_assessment

# 运行数据库迁移
npm run migration:run
```

5. 启动开发服务器
```bash
# 启动前端开发服务器
cd client
npm run dev

# 启动后端开发服务器
cd server
npm run dev
```

## 开发指南

### 目录结构
```
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/    # 通用组件
│   │   ├── pages/        # 页面组件
│   │   ├── utils/        # 工具函数
│   │   └── data/         # 静态数据
│   └── ...
├── server/                # 后端项目
│   ├── src/
│   │   ├── entity/       # 数据实体
│   │   ├── routes/       # API路由
│   │   └── utils/        # 工具函数
│   └── ...
```

### 开发规范
- 遵循 TypeScript 规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React Hooks 最佳实践
- 遵循 RESTful API 设计规范

### 分支管理
- main: 主分支，用于生产环境
- develop: 开发分支，用于开发环境
- feature/*: 功能分支
- bugfix/*: 问题修复分支
- release/*: 发布分支

## 部署

### 前端部署
```bash
cd client
npm run build
# 将 dist 目录部署到 Web 服务器
```

### 后端部署
```bash
cd server
npm run build
# 使用 PM2 或其他进程管理工具运行
pm2 start dist/index.js
```

## 测试

```bash
# 运行前端测试
cd client
npm test

# 运行后端测试
cd server
npm test
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 项目负责人：[姓名]
- 邮箱：[邮箱地址]
- 微信：[微信号]