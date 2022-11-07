# uni-app

## uni-app 开发规范

- 页面遵循 Vue 但文件组件（SFC）规范
- 组件标签靠近小程序规范
- 借口能力（JS API）靠近微信小程序规范 ， 但需将前缀 wx 替换为 uni 详见 uni-app 接口规范
- 数据绑定及事件处理同 vue.js 规范，同时补充了 App 及页面但生命周期
- 为兼容多端运行，建议使用 flex 布局进行开发

## uni-app 应用生命周期

### `uni-app` 支持如下应用生命周期函数：

| 函数名   | 说明                                           |
| -------- | ---------------------------------------------- |
| onLaunch | 当`uni-app` 初始化完成时触发（全局只触发一次） |
| onShow   | 当 `uni-app` 启动，或从后台进入前台显示        |
| onHide   | 当 `uni-app` 从前台进入后台                    |
| onError  | 当 `uni-app` 报错时触发                        |

## 页面生命周期

### `uni-app` 支持如下页面生命周期函数：

| 函数名   | 说明                                                                                                                                       | 平台差异说明 | 最低版本 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | -------- |
| onLoad   | 监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参），参考[示例](https://uniapp.dcloud.io/api/router?id=navigateto) |              |          |
| onShow   | 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面                                                                 |              |          |
| onReady  | 监听页面初次渲染完成。                                                                                                                     |              |          |
| onHide   | 监听页面隐藏                                                                                                                               |              |          |
| onUnload | 监听页面卸载                                                                                                                               |              |          |

`pages 首次被加载的时候才会触发onload 再次进入只触发onshow 相当于uniapp直接拥有vue的keep-alive缓存功能`

## 下啦刷新钩子 onPullDownRefresh

- uni.startPullDownRefresh()
- uni.stopPullDownRefresh()

## 上啦加载钩子 onReachBottom

```js
{
		  "path":"pages/list/list",
		    "style":{
		      "enablePullDownRefresh": true ,// 下拉刷新
			  "onReachBottomDistance":200 // 上拉加载的位置
		    }
		},
```

## 数据缓存

- uni.setStorage 添加缓存
- uni.setStorageSync 同步添加缓存
- uni.getStorage 获取缓存数据
- uni.getStorageSync 同步获取缓存数据
- uni.removeStorage 移除缓存数据
- uni.removeStorageSync 同步移除缓存数据

## 上传图片

```js
uni.chooseImage({
  count: 9,
  success: (res) => {
    this.imgArr = res.tempFilePaths;
  },
});
```

## 预览图片

```js
uni.previewImage({
  current,
  urls: this.imgArr,
  indicator: 'number',
  loop: true,
});
```

## 条件渲染注解

```html
<!-- #ifdef H5 -->
<view>我希望只在h5页面中看见</view>
<!-- #endif -->
<!-- #ifdef MP-WEIXIN -->
<view>我希望只在微信小程序页面中看见</view>
<!-- #endif -->
<script>
  // #ifdef H5
  console.log('我希望h5中打印');
  // #endif
  // #ifdef MP-WEIXIN
  console.log('我希望微信中打印');
  // #endif
</script>
<style>
  /* h5中的样式 */
  /* #ifdef H5 */
  view {
    color: hotpink;
  }
  /* #endif */
  /* 微信小程序中的样式 */
  /* #ifdef MP-WEIXIN */
  view {
    color: #0000ff;
  }
  /* #endif */
</style>
```

## navigator 跳转传参数

```html
<navigator url="/pages/detail/detail?id=80">跳转至详情页</navigator>
<navigator url="/pages/message/message" open-type="switchTab"
  >跳转至信息页</navigator
>
<navigator url="/pages/detail/detail" open-type="redirect"
  >跳转至详情页</navigator
>
<button @click="goDetail">跳转到详情页</button>
<button @click="goMessage">跳转到信息页</button>
<script>
  export default {
    methods: {
      goDetail() {
        uni.navigateTo({
          url: '/pages/detail/detail',
        });
      },
      goMessage() {
        uni.switchTab({
          url: '/pages/message/message',
        });
      },
    },
  };
</script>
```

## 接收参数

```js
onLoad(options){
  console.log(options)
}
```

## 组件通信

### 父->子 v-bind

### 子->父 uni.$emit()

### 兄弟

- uni.$on() 注册事件 订阅
- uni.$emit() 触发事件 发布
