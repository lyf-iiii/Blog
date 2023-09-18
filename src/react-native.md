# react native 学习记录

## react native 特点

1. 一份源码同时打包安卓和 ios 节约开发成本 还能带来接近原生的体验与性能
2. react native 是使用 javascript 开发的既支持动态更新又支持复杂业务的主流移动夸段框架

## react native 适合哪些团队

1. 业务更新迭代较快的团队与出海团队
2. 既要支持动态更新 又要支持复杂业务的场景

## react native 新架构

1. 启动性能会有 2 倍左右的提升
   a. js 引擎 hermes 引擎 支持 js 的 AOT 预编译 常规 js 编译字节码再编译成二进制机器码 AOT 预编译帮助 js 直接编译成字节码 跳过这个步骤
   b. 老架构是 js-core
2. 通信性能会有 3 倍左右的提升
   a. 老架构通信是通过 js bridge
   b. 新架构的通信方式是 JSI
   ⅰ. 把很对 C++接口暴露给 react native 使用
3. 新架构的渲染流水有了很大的变化 这会带来更好的用户体验
   a. 老架构只有异步渲染一种方式 原生视图渲染是同步的 可能会造成页面抖动
   b. 新架构接入了同步渲染 新的可能 在原生视图里嵌套 react native 2 在 react native 应用也能更方便的引入一些需要同步的原生组件
4. react native 服务端渲染方案

## 第六章 实现一个体验好的点按组件

点击 和 长按的区分

可触发区域 hitRect
可保留区域 pressRect

## 第七章 输入框

输入框建议使用受控组件
处理输入框焦点 ref react.forwardRef ref.current.focus
学会处理与输入框联动的键盘 包括键盘右下角的按钮 键盘提示文案 键盘类型等等
请你思考一下 TextInput 的异步 onChange 和同步 onChangeSync 的区别是什么 Fabric 的同步特性将给 React native 带来什么变化

## 第八章 列表

- faltList 组件
- 开源的 RecyclerListView 性能更好
- 通常评判列表卡顿的指标是 ui 线程的帧率 和 js 线程的帧率
- RecyclerListView 优化原理
  - 底层是滚动组件 scrollView rn 的 scrollView 组件 android 底层是 HorizontalScrollView ios 的底层实现用的是 UIScrollVIew
  - flatList 列表组件就是自动按需渲染的 尽量填上 getItemLayout 属性
  - RecyclerListView 优化思路：原来你要销毁一个浏览器中 dom，再重新创建一个新的 DOM 现在你只改变了原有 dom 的属性 并把原有的 DOM 挪到新的位置上
  - RecyclerListView 在滚动式服用了列表想 而不是创建新的列表项因此性能好
- 如何选择
  - 列表项高度不确定的时候选 FlatList
  - 列表项高度确定的时候选择 recyclerListView

## 第九章 ui 调试

- 进阶能力 复用组件及其状态
  - 1.编译时修改组件的注册方式
  - 2.运行时 用代理的方式 i 管理新旧组件的切换
- 三个技巧
  - 同屏预览
  - 拥抱函数组件 函数组件能保留原有组件状态 减少操作交互的次数
  - 单独拎出来调试
- 为什么保留类组件的热重载非常不可靠，但函数组件却是可行的
  - 保留类组件的热重载非常不可靠，是因为类组件的实例化对象和方法是密不可分的，类组件的代码发生变化后，需要重新实例化对象、调用方法，才能让新代码生效。而热重载是在运- 行时动态加载新代码，无法实现重新实例化对象、调用方法这类操作，因此导致了保留类组件热重载的不可靠性。
  - 相比之下，函数组件的热重载可行，是因为函数组件本质上就是一个 JavaScript 函数，只会产生一个新的执行上下文，不涉及到对象实例化、方法调用等复杂操作。因此，在函数- 组件代码发生变化时，只需要重新执行该函数即可，非常简单高效，热重载也可以轻松实现。
  - 此外，函数组件在处理数据流时也更加简洁易懂，只需要通过 props 参数来传递数据，不需要显式地管理状态。这种函数组件的编写方式被称为“纯函数”，可以更好地满足 React - 框架的设计理念，也方便进行测试和维护。
  - 当然，目前 React 的版本已经支持类组件的热重载，但由于类组件的本质特点，其实现原理仍然比函数组件要复杂一些，所以函数组件仍然是更加可行和优选的选择。

## 第十章 解决 bug 的思路

- 一个模型 两个原则 三条思路
- 一个模型：发现问题 找到原因 修复 bug
- 两个原则：
  - 不带上线原则 尽可能在本地开发时发现问题
  - 本地复现原则 如果 bug 已经被带上线了 我们要尽快发现它 还要尽可能多地收集线上信息
  - 完善的上线流程 代码自动化本地校验 线上校验 项目成员 codereview ，githook 的自动脚本来执行我们的 jest 单元测试 并娇艳 ts eslint 是否通过 ，ui 验收、qa - 测试、pm 体验，
  - A/B 测试和灰度测试都是用于测试产品和设计方案的方法，但两者的实现方式和应用场景有所不同。
  - A/B 测试是将用户随机分为两组，一组用户看到原版本的产品或设计方案，另一组用户则看到变化后的版本，通过比较两组用户的反馈数据并进行统计分析，来决定哪个版本更受用户- 欢迎。A/B 测试的目标是验证两个版本的差异对用户行为和反馈的影响，以帮助产品团队做出最优决策。
  - 灰度测试是将新版产品或设计方案逐步推广给一小部分用户使用，然后根据反馈和数据分析结果，逐步增加用户占比，最终推广至全量用户。灰度测试的目标是在尽可能少的用户中测- 试新版本，尽早发现问题并解决，以避免因新版本的问题而影响到全部用户。
  - 在具体实践中，A/B 测试通常用于验证两种设计方案或功能改进哪种更好，可以快速得出结论，适用于对产品或设计方案进行小规模的改进和优化。而灰度测试则更适合在产品或设计- 方案进行大规模升级或变革时使用，可以在保证用户体验和稳定性的前提下，逐步推进新版本的上线和推广。
  - 总之，A/B 测试和灰度测试都是优秀的测试方法，在产品和设计方案的改进过程中起到了至关重要的作用。需要根据具体情况进行选择和使用，以达到更好的效果和用户体验。
- 三条思路

  - 推理
    - filpper
  - 分法
    - 环境
  - 上一版有没有问题

  - 问人
  - DeepL 翻译

## 第十一章 双列瀑布流组件

- 核心思想 左高放右 右高放左
- 怎么把修改好的 node_modules 代码保存 三种思路
  - 直接复制源码 升级版本困难
  - 运行时进行修改 如果私有属性没办法运行时继承 那么重写为新类
  - 编译时修改
    - npx patch-package some-package
    - patch-package 是一个很有用的工具，可以帮助开发者快速修补第三方软件包中的错误或缺陷，同时还可以保持自己代码库的整洁和可维护性

## 第十二章 电商首页

- useSWR 和 react-query 差不多

## 第十三章 生态

- detox 真机调试
- 路由 react navigation 比 react native navigation 好

## 第十四章 动画 reanimated

js 执行计算 ui 线程执行渲染

## 第十五章 手势 Gesture

拖拽手势

## 第十六章 单视图 如何解决手势冲突

## 第十七章 多视图 如何解决手势冲突

## 第十八章 navigation

## 第十九章 redux

- redux 流行程度最高 仍旧是大型项目的首选 useReducer 和 useContext 会造成更多代码 redux 结合 redux-toolkit 一定程度减少模版代码
- redux 什么时候用？当觉得状态管理是研发痛点的时候 才需要开始着手解决 当使用 useState 和 useReducer 管理状态时 如果会遇到性能问题 和 维护性问题时就可以考虑使用 redux 了 。当有大量的全局状态需要管理时 当应用状态频繁更新遇到性能瓶颈时，当管理状态的逻辑复杂到需要代码分治时，当多人协作开发需要遵守同一套最佳实践时，就是考虑使用 redux 的时候
- redux 核心原理 state 驱动 view 更新 用户操作 view 出发 action 在通过 action 来更新 state
- 在初始化时 redux 筒鼓 reducer 来初始化 state state 驱动 view 渲染 在更新状态时 用户操作 view 触发 action action 和当前 state 会被分法给处理分片状态的 reducer 函数 reducer 函数来执行更新逻辑和返回新的 state 并最终刷新 view
- redux 最佳实践
- useSelector 按需获取状态 相比 store.getState 全部获取 避免 rerender 导致应用性能变差
- react-query 管理异步状态 isLoader data isError

## 第二十章 sentry 线上错误与性能监控

- 线上环境复杂 产生的 bug 很可能在本地难以复现 为了解决这个问题 需要监控系统
- 如果线上错误和性能的监控需求 但是没有内部现成的监控系统 直接用 sentry
- 实现简易 sdk
- 用户 id 模拟 react-native-uuid 存到 mmkv 中 mmkv 是持久化键值存储
- 用户设备模拟 react-native-device-infos
- 错误收集
- js 报错
- promise 报错
- 组件 render 报错
- ErroRBoundary WithErrorBoundary 方法 来帮助 函数组件和 类组件捕获 render 错误
- 组件报错 触发 getDerivedStateFromError 回调
- 性能收集
- 启动耗时 开启是 native 底层里的 react componentDidMount 是组件挂载完成的时间点
- 页面跳转耗时

请求耗时 xmlHTTPRequest open 事件里记录 startTime onreadystatechange 事件结束记录 totalTime

## 第二十一章 如何从 0 集成 reactNative

- app 混合开发 指的是一个 app 部分功能用 native 构建 部分功能能用跨端框架构建
- 目前比较流行的跨端框架有 h5 reatnative flutter 布局动态化
- 混合开发的缺点：
- 性能不佳 h5 渲染链路长 reactnative 依托于 js bridge 交互 最新架构使用 jsi 虽然 flutter 绘制流程直接使用 skia 但依赖于原生的能力仍需异步交互
- 兼容性差 安卓 ios 个版本都存在各种兼容性问题 特别是安卓碎片化严重
- 问题排查成本高 跨端框架一般设计 native、FE、Server 中间做了大量桥接转换，排查链路比纯 native 长
- 动态化能力受限 相比纯原生的插件化 跨端框架动态更新的业务 如果涉及 native 部分组件更新 需要依赖 app 发版
- react-navigation app 导航框架
- redux 处理工作模块的状态
- fetch app 与服务器的交互框架
- asyncStroag 数据存储和对数据库的操作
- flatList 下拉刷新 上拉加载
- 自定义组件 定制化组件需求
- 离线缓存框架 为 app 提供数据支持
- native modules native 模块和封装 native sdk 的调用
- codepush 动态部署 热更新
- native sdk 统计分享 第三方登录的功能
- 图标插件 icon
- 官方组件
