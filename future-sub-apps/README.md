# 平台前端项目

## 项目结构

```

├── README.md
├── apis                                    # 后端接口
├── apps                                    # 业务工程模块
│   ├── base                                # 应用一
│   └── knowledge                           # 应用二
├── package.json                            # 公共包配置文件
├── packages                                # 基础公共模块
│   ├── ui                                  # 公共UI组件
│   └── utils                               # 公共工具函数
├── pnpm-workspace.yaml                     # pnpm 工作区配置文件
└── scirpts                                 # 脚本
    ├── packages
    └── workspaces

```

### 添加本地项目依赖

```
# 添加本地依赖@future/enums (在对应的项目目录下执行)
pnpm add @future/enums --workspace
```

```
# 同时启动所有子项目 (在根目录下执行)
pnpm run -r start
```

### 包安装规则

1. 通用第三方包安装顶层的package下

### 子项目间引用规则

1. apps 下的子项目可以不可相互引用
2. apis 不可引用工作区其他包
3. packages 下的子项目可以引用packages下的其他包, 但还是尽量避免引用(禁止A引用B, B引用A, 这样会导致循环依赖)
4. packages/ui 下的包需要容器应用提前安装ant-design-vue

> monorepo 开发注意点
>
> 1. pnpm Workspaces 是 monorepo 方式的一个实践, 是将一个大应用打散,变成多个小应用(这样可对公共的部分进行复用), 每个应用都可以独立编译打包, 但是在A应用引用B应用的情况下,B应用 通过本地链接（Linking）直接将源码引入到A应用中(node_modules)，所以A应用会对引入的B应用代码进行编译，这时,编译B应用代码的编译器配置用的是A应用的配置, 所以需要保证A应用的编译器配置包含B编译器的配置, 否则B代码有可能无法编译通过
> 2. 在开发过程中, 安装一些局部包, 或跑命令时, 直接进入到对应的子项目下执行, 这样心智负担最小, 开发起来与旧的方式习惯一致
> 3. 在开发公共组件应用时, 导入项应用内的模块时, 不要使用 @ 等别名进行导入, 否则会出现编译错误

### css 命名规范使用 BEM + ITCSS 规范

> BEM 命名规约是 .block-name**element-name--modifier-name，即 .模块名**元素名--修饰器名 三个部分，用双下划线 \_\_ 来明确区分模块名和元素名，用双横线 -- 来明确区分元素名和修饰器名。你也可以在保留 BEM 核心思想的前提下，自定义命名风格，如驼峰法、使用单下划线、使用单横线等。

### Git 提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

文档地址: https://www.antdv.com/docs/vue/getting-started-cn/
