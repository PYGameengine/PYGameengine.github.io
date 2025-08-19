# PYGameengine 官网

这是 PYGameengine 项目的官方网站，包含项目介绍、文档、下载功能和团队信息。

## 网站结构

```
e:\demo\index\
├── index.html          # 网站首页
├── styles.css          # 全局样式文件
├── scripts.js          # 交互脚本文件
├── download.html       # 下载页面
├── about.html          # 关于我们页面
├── 404.html            # 404错误页面
└── docs/               # 文档目录
    ├── index.html      # 文档首页
    └── installation.html # 安装指南文档
```

## 功能特点

- **响应式设计**：适配各种设备屏幕尺寸
- **现代化UI**：采用简洁、专业的设计风格
- **完整导航**：清晰的页面导航结构
- **文档系统**：包含入门指南和详细安装说明
- **下载功能**：提供各平台的下载选项
- **团队介绍**：展示开发团队信息
- **错误处理**：友好的404页面

## 如何运行

1. 确保您的计算机上安装了现代浏览器（如 Chrome、Firefox、Safari、Edge 等）
2. 直接在浏览器中打开 `e:\demo\index\index.html` 文件
3. 或者使用任何静态文件服务器提供这些文件

### 使用 Python 简单服务器

```bash
cd e:\demo\index
python -m http.server
```

然后在浏览器中访问 `http://localhost:8000`

### 使用 Node.js 服务器

```bash
cd e:\demo\index
npm install -g http-server
http-server
```

然后在浏览器中访问 `http://localhost:8080`

## 自定义网站

您可以通过修改以下文件来自定义网站内容：

- 修改 `styles.css` 更改网站样式
- 更新 `index.html`、`download.html`、`about.html` 等文件以更改页面内容
- 在 `docs/` 目录中添加或修改文档文件

## 注意事项

- 网站使用了一些外部资源（如 Font Awesome 图标），请确保您的设备可以访问互联网
- 对于生产环境，建议使用专业的Web服务器和CDN服务
- 下载功能目前是模拟的，需要配置实际的下载文件路径

## 联系我们

如果您有任何问题或建议，请联系我们：
- 邮箱: contact@pygameengine.com
- GitHub: github.com/pygameengine

© 2024 PYGameengine. 保留所有权利。