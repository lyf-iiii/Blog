# cli 开发

## 什么是脚手架

- 脚手架 cli = command-Line Interface
- 基于文本界面 通过键盘输入命令执行
- 讲解 nodejs 最先进的脚手架设计理念 和开发方法
- 自主搭建 5 大前端研发脚手架 覆盖前端研发全流程
- 读懂 10 个高水准、明星级前端源码库、分享源码阅读方法
- 解读前端脚手架面试题以仿真面试的方式学习高水准的回答

## shell

- shell 是一个命令解释器 当输入命令后 由 shell 进行解释后交给操作系统内核（OS Kernel） 进行处理

## bash

- 是 shell 的一个实现
- bash 是一个程序 职责是用来进行人机交互
- bash 和其他程序最大的区别在于 他不是用来完成特定任务 我们通过 bash shell 来执行程序
- bash 是脚手架的运行环境

## cli

- command-Line interface
- 命令行界面 是一种基于文本界面 用于运行程序
- 今天大部分操作系统都会以 GUI 作为基础 但是基于 Unix 的系统都会同时提供 CLI 和 GUI

## vue create vue-test-app --force

- 主命令 vue
- command: create
- command 的 params：vue-test-app
- options --force

## 脚手架执行原理

执行 vue create vue-test-app

- 在环境变量当中查找 vue 指令

  - which vue
  - lib/node_modules node 全局依赖安装目录

- 全局安装`@vue/cli`时发生了什么
- 为什么 vue 指向一个 js 文件 我们却可以直接通过 vue 命令直接去执行它
- 执行命令 在 vue/cli 的 package.json 文件中 指定了
- 全局安装 vue/cli 时发生了什么
- node 把 vue/cli 的包下载到了 全局依赖安装目录里 然后访问包里的 package.json 看是否配置了 bin
- 执行 vue 指令的时候发生了什么 没有使用 node 命令 却可以执行 包里面的 vue.js
- 因为包里面的 vue.js 第一行 写了 “#!/usr/bin/env node” 意思是到环境变量中去找 node
- 创建软连接
- ln -s /Users/sam/Desktop/vue-test/test.js imooc 创建了一个指令

- npm i -g lyf-test
- which lyf-test "/usr/local/bin/lyf-test"
- cd /usr/local/bin 找到 lyf-test 的映射为“../lib/node_modules/lyf-test/bin/index.js”
- cd ..
- cd lib/node_modules
- ll
- cd /lyf-test
- npm remove -g lyf-test

## 命令行 ui 显示

颜色渲染 chalk npm i chalk chalk-cli
loading 显示 ora npm i ora

## 命令行交互

命令行交互

readline

## 包管理 workspaces lerna

### workspaces

- npm init -w 包 A -w 包 B // 可以同时安装两个包
- npm i 插件名 -w 包名 // 给指定包安装依赖
- npm i -ws 给所有包安装依赖
- npm publish -w 包名 发布指定包
- npm publish -ws 发布全部包

### lerna

- npx lerna init // 初始化 lena
- npx lerna create 包名 // 创建一个包
- npx lerna add chalk /packages/a // 给指定包安装指定依赖 7+版本使用 workspaces 命令安装 add 删除
- npx lerna link
- npx lerna publish 发布项目

### pnpm

- pnpm init
- pnpm add pkg1 --filter pkg2 // 将 package 下的 pkg1 包安装到 pkg2 中
- node CJS 和 ESM 混合开发

## 第七章 cli-lyf 下载固定的模版

## 第八章 配置化

- mkdir cli-lyf-server
- npm init egg --type=simple // npm init <name> 会在 npm 找 create-<name> 来进行
- 配置 mongoDb 数据库 json 方式去存储 配置模版 json

## 第九章 渲染动态化

- 如何实现项目模版渲染动态化
- 通过 ejs 改良项目模版 生成动态模版
- 建立@ cli-imooc/init 的插件机制
- 实现一个 init 的插件 在插件中实现 ejs 模版渲染逻辑
- ejs 模版渲染 类型同 jsp 在 installTemplate 复制模版之前 使用 ejs.renderFile 方法来将模版进行解析 不能在 init 中写死 动态的逻辑 因此我们需要在 init 包中加入 plugins 逻辑 plugins 就是一个存在于 template 项目同级下的函数 执行这个函数 将 inquirer 封装的方法鹅 u makeList makeInput 传入 共 plugins 函数使用
- glob 文件匹配工具 批量操作某类文件
- 项目动态模版 使用 ejs 语法修改 package.json 等文件 将一些信息使用模版变成动态的

## 第十章 前端下载器

- 实现思路
- 掌握 github 和 giteeAPI 的使用方法
- 通过 github 和 gitee 实现根据仓库名称搜索项目的能力 github 能力更强 甚至可以根据远吗进行搜索
- 存储 githubgitee 的 token 具备 github 或 gitee API 的调用条件
- 通过搜索获取仓库信息 选取指定版本 （实现翻页功能）
- 将指定版本的源码拉取到本地
- 在本地安装依赖 安装可执行文件 启动项目

```shell
githubAPI 接入地址 https://docs.github.com/zh/rest/guides/getting-started-with-the-rest-api?apiVersion=2022-11-28
token https://github.com/settings/tokens
curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer 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" \
 -H "X-GitHub-Api-Version: 2022-11-28" \
 "https://api.github.com/search/repositories?q=vue+language:vue\&sort\=stars\&order\=desc\&per_page=5\&page\=1"
curl \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer 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" \
 https://api.github.com/repos/PanJiaChen/vue-element-admin/tags
curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer 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" \
 https://api.github.com/search/code\?q\=vue+language:js\&per_page\=5\&page\=1
curl -L \
 -H "Accept: application/vnd.github+json" \
 -H "Authorization: Bearer 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" \
 https://api.github.com/search/issues\?q\=vue+language:js\&per_page\=1\&page\=1
```

项目步骤

- github gitee token 录入 -> 调用搜索 API -> 选择需要下载到版本（github 和 gitee 存在差异）-> 下载指定版本的源码->依赖安装、bin 安装项目运行
- 如何选择对应分支 execa('git', ['clone', this.getRepoUrl(fullName), '-b', tag]);
- 如何自动安装依赖 execa('npm', ['install', '--registry=https://registry.npmmirror.com'], { cwd: projectPath })

## 第十二章 eslint 自动检查 及 jest mocha 自动化测试接入

## 第十三章 mocha 深入

## 第十四章 代码提交器

- 优势
- 提升代码提交效率
- 规范代码提交流程
- 局限
- 无法解决代码冲突
- 如何实现代码提交器
- 实现代码自动提交功能需要完成 4 个阶段
- 阶段 1 远程仓库自动初始化
- 技术难点 github gitee api 创建仓库
- 阶段 2 git 自动初始化
- 技术难点 线上仓库已经存在的时候 代码同步问题
- 阶段 3 git 自动提交
- 技术难点 代码冲突处理
- 阶段 4 git 自动发布
- 技术难点 自动发布流程设计和实现
- 确定 git mode (github & gitee)

## 第 17 章 云发布脚手架

- 减少发布过程中的手动操作成本 大幅提升 cicd 效率 快速实现项目发布上线
- 局限
- 存在较高的技术门槛
- 需要需用额外的服务 会产生技术成本
- 如何实现自动发布
- 方案 1 完全自主实现自动发布逻辑
- 方案 2 使用 github actions
- 方案 3 使用 jenkins

## 面试

- 脚手架开发的三个层次
- 了解概念
- 基本概念
- 用途
- 原理
- 常见脚手架
- 掌握技能
-
- 拿到结果
- 常见问题
- 脚手架的价值是什么
- 从无到有（能力建设）
- 提升效率（降本增效）
- 为什么要把脚手架写进简历
- 人无我有（大部分同学建立中没有包含这些内容）
- 人有我优（体现脚手架在我实际工作中的独特价值）
- 谈谈你对脚手架的理解
- 背后意图 了解求职者对脚手架的掌握程度
- 我在公司中做过 项目下载 项目安装 项目测试 项目 cicd 的脚手架，
- 实现原理
- 制作过程中因为脚手架执行 npm 命令实际上是本地 npm 对命令存储一个映射 我们可以在本机的 node_modules 里找到我们脚手架的命令 就可以看到对应链接到的项目目录 通过入口文件 的顶部写入命令行语句 !#/usr/bin/env node 让系统知道使用 nodejs 运行当前文件 然后通过 package.json 的 bin 属性中设置脚手架启动指令 会被注册
- 开发流程
- 采用 pnpm 的 monorepo 进行多包管理
- cli 包 作为入口包 配置命令行指令 以及指令名 入口中按照功能接入指令包
- command 包 对 commander 进行封装 作为基础命令包 所有脚手架命令继承 comand 包
- init 包 下载项目模版脚手架
- 存储模版地址
- 将模版包装
- util 包 公共方法包
- inquirer 命令行交互封装 主要是展示 list 选项 和 获取用户输入的值等
- log 封装 log.verbose 方便调试看的日志
- npm 封装 通过https://registry.npmjs.org/ 搜索 npm 包的最新版本
- axios 封装 设置 baseURL 与过期时间
-
- 比如下载项目模版功能放在 init 包 安装依赖放在 install 包 新建一个 command 包作为基础 command 类 其他 command 都继承它
- 公共的方法以及工具封装统一放在 utils 包内
- 用途
- vue-cli 项目创建
- vue-cli-service 项目运行
- 谈谈你开发过的脚手架
- 背后意图
- 进一步了解求职者对脚手架的实践经验
- 回答思路
- 陈述脚手架的开发经验
- 发现了什么业务问题
- 提出了什么技术方案
- 实现了什么业务结果
- 沉淀了什么技术能力
- 谈谈你在脚手架过程中碰到的技术问题
- 背后意图
- 了解求职者开发脚手架过程中碰到的具体技术问题 以辨别经历是否属实 同时判断求职者的技术能力和等级
- 回答思路
- 通过集体问题折射技术思考
- 如何提升脚手架开发效率 （多 package 管理+ 脚手架通用框架封装）
- 如何实现项目模版动态话（模版配置话+渲染动态化）
- 如何实现 gitflow 流程自动化 借助 git api 实现 git flow 工作流
- 如何实现前端 cicd github action + jenkins + docker

## 使用过的库

- import-local 判断当前执行文件是本地包还是全局包
- npmlog 日志打印
- chalk 文字色彩
- commander 脚手架开发框架
- semver 用于版本比较 semver.gte
- inquirer 命令行 文本输入 菜单选择
- fs-extra 提供比 fs 模块更大的功能 读写文件 文件夹
- path-exists pathExists 方法判断给定的路径是否存在
- ora 下载文件加载文件时 loading 效果控件
- axios
