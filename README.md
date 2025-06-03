# Social-X Frontend

Social-X 是一个现代化的社交媒体平台前端项目，基于 React 和 Ant Design Pro 构建。

## 技术栈

- React 18
- TypeScript
- Ant Design Pro
- UmiJS
- Monaco Editor
- Markdown 支持
- Emoji 支持

## 项目架构

```
social-x-frontend/
├── config/                 # UmiJS 配置文件
├── src/                    # 源代码目录
│   ├── components/        # 公共组件
│   ├── constants/         # 常量定义
│   ├── hooks/            # 自定义 Hooks
│   ├── pages/            # 页面组件
│   ├── services/         # API 服务
│   ├── app.tsx           # 应用入口
│   ├── global.tsx        # 全局配置
│   └── global.less       # 全局样式
├── public/                # 静态资源
├── .husky/               # Git hooks 配置
├── .github/              # GitHub 配置
└── nginx.conf            # Nginx 配置文件
```

## 开发环境要求

- Node.js >= 12.0.0
- npm >= 6.0.0

## 安装和启动

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
# 开发环境
npm run dev

# 测试环境
npm run start:test

# 预发布环境
npm run start:pre
```

3. 构建生产版本：

```bash
npm run build
```

4. 预览生产构建：

```bash
npm run preview
```

## 可用的脚本命令

- `npm run dev`: 启动开发服务器
- `npm run build`: 构建生产版本
- `npm run preview`: 预览生产构建
- `npm run lint`: 运行代码检查
- `npm run lint:fix`: 自动修复代码问题
- `npm run tsc`: 运行 TypeScript 类型检查

## 项目特性

- 完整的 TypeScript 支持
- 代码规范和格式化配置
- Git hooks 集成
- 多环境配置支持
- Markdown 编辑器支持
- Emoji 选择器
- 响应式设计

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 Git hooks 确保代码质量

## 部署

项目提供了 Nginx 配置文件，可以用于生产环境部署。部署步骤：

1. 构建项目：

```bash
npm run build
```

2. 将 `dist` 目录下的文件部署到 Web 服务器
3. 配置 Nginx 使用提供的 `nginx.conf` 或 `nginx-prod.conf`

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
