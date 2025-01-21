## 一 环境要求

### 1.1 开发环境

- 操作系统：`Windows 10/11`，`MacOS`；
- `Node 16.15.0` 及以上版本(某些情况下可能需要安装 `Python3` 环境)；
- `pnpm v8.1.0`及以上版本；
- `Visual Studio Code` (简称 VSCode)

### 1.2 运行环境

`Nginx 1.18.0` 及以上版本或 `TongHttpServer 6.0` (信创环境)

## 二 浏览器支持

> 支持现代浏览器，不支持 IE

| IE          | Edge            | Firefox         | Chrome          | Safari          |
| ----------- | --------------- | --------------- | --------------- | --------------- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 三 关联项目

> 需要使用下表中的对应分支

| 项目                     | 分支    | 说明                   |
| ------------------------ | ------------- | ---------------------- |
| **后端**(任一后端服务)   |                 |                        |
| future-boot           | v4.2.0 | Java 单体项目源码      |
| future-cloud          | v4.2.0 | Java 微服务项目源码    |
| **前端**                 |                   |                        |
| future-web      |  v4.2.0 | 开发平台前端源码       |
| future-web-datascreen-vue3 | v4.2.0 | 大屏前端项目源码(Vue3) |
| future-web-datareport      | v4.2.0 | 报表前端项目源码       |

## 四 使用说明

### 4.1 开发环境

#### 4.1.1 安装 pnpm

> 推荐使用 `pnpm`，若使用 `yarn` ，建议使用 `Yarn v1.22.x` 版本，否则可能出现依赖安装失败的情况。

在 Windows 的`PowerShell`中执行如下命令

```bash
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

MacOS 通过 `Homebrew` 安装 `pnpm`<br/> 若已经安装了 `Homebrew` 软件包管理器，则可以使用如下命令赖安装 pnpm：

```bash
brew install pnpm
```

也可以通过 npm 安装 pnpm

```bash
npm install -g pnpm
或
npm install -g @pnpm/exe
```

#### 4.1.2 安装依赖

使用如下命令安装项目依赖

```bash
pnpm install --registry http://registry.npmmirror.com
```

#### 4.1.3 后端接口配置

修改项目根目录 `.env.development` 中的后端接口地址

- Java 项目本地开发默认接口地址：`http://localhost:30000`


```bash
# 第7行，后端接口
VITE_PROXY = [["/dev","http://localhost:30000"]]

# 第17行，websocket地址
# 在本地开发环境，将后端默认接口地址的协议改成 ws 即可
VITE_GLOB_WEBSOCKET_URL='ws://localhost:30000'
```

#### 4.1.4 关联项目配置

打开 `/src/hooks/setting/index.ts` 配置文件，默认配置如下所示

```bash
...
const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_API_URL + '/api/file/Uploader',
    webSocketUrl: VITE_GLOB_WEBSOCKET_URL,
    cipherKey: 'EY8WePvjM5GGwQzn', // 加密key
    aMapJsKey: '26a65601349a5ec88318721884ef81b5',
    aMapWebKey: '09485f01587712b3c04e5a9abf324237',
    aMapSecurityJsCode: '243e837c2ba077b4143b9a9dd2893992',
    // 本地文件预览
    filePreviewServer: isDevMode() ? 'http://localhost:30090/FileServer' : VITE_GLOB_API_URL + '/FileServer',
    // 大屏应用前端路径
    dataVUrl: isDevMode() ? 'http://localhost:8100/DataV/' : prodUrlPrefix + '/DataV/',
    // 数据报表接口
    reportServer: isDevMode() ? 'http://localhost:30007' : VITE_GLOB_API_URL + '/ReportServer',
    // 报表前端路径
    report: isDevMode() ? 'http://localhost:8200' : VITE_GLOB_API_URL + '/Report',
};
...
```

#### 4.1.5 本地运行

完成上述操作后，使用如下命令运行前端项目

```bash
pnpm dev
```

### 4.2 运行环境

> 测试或生产环境

如果需要测试或生产环境发布，使用如下命令打包项目

```bash
pnpm build
```

然后将项目根目录下 `/dist/` 中所有的文件上传至服务器。

## 五 常见问题

### 5.1 修改项目基本信息

打开项目根目录 `.env` 文件，可以看到 `本地运行端口号`、`网站标题`、`简称` 等配置。

```bash
# 端口号
VITE_PORT = 3100

# 网站标题
VITE_GLOB_APP_TITLE = FUTURE快速开发平台

# 简称，用于配置文件名字 不要出现空格、数字开头等特殊字符
VITE_GLOB_APP_SHORT_NAME = future
```

### 5.2 代码更新后报错

在开发或打包时报依赖缺失，可以先删除项目根目录下的 `pnpm-lock.yaml` 文件，然后重新执行 `pnpm install` 安装依赖即可解决。
