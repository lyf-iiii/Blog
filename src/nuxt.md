# nuxt

## context

- context 是从 Nuxt 额外提供的对象，在"asyncData"、"plugins"、"middlewares"、"modules" 和 "store/nuxtServerInit" 等特殊的 Nuxt 生命周期区域中都会使用到 context。

### app 在服务端使用的类 this 对象 在服务端的生命周期内 无法使用 this 来获取实例上的方法和属性 app 可以弥补这个缺陷

- 服务端使用 app
- 客户段使用 this 保证全局方法的公用例如 axios

  ### store

- asyncData 内置了 store 对象

- ```js
  async asyncData({app, store}) {
    let list = await app.$axios.getIndexList({
      // ...
    })
  }
  ```

- 可以在 store 中使用 this 访问全局方法

  ```js
  export const mutations = {
    updateList(state, payload) {
      console.log(this.$axios);
      state.list = payload;
    },
  };
  ```

### params query

- Params 和 query 是 route.params 和 route.query 的别名

- ```js
  async asyncData({app, params}){
    let list = await app.$axios.getIndexList({
      id:params.id,
      pageNum:1,
      pageSize:20
    })
  }
  ```

### redirect

- 该方法重定向用户请求到另一个路由，通常会用在权限验证。用法：`redirect(params)`，`params` 参数包含 `status`(状态码，默认为 302)、`path`(路由路径)、`query`(参数)，其中 `status` 和 `query` 是可选的。当然如果你只是单纯的重定向路由，可以传入路径字符串，就像 `redirect('/index')

- ```js
  redirect({
    path: '/login',
    query: {
      isExpires: 1,
    },
  });
  ```

### error

```js
error({
  statusCode: 404,
  message: '标签不存在',
});
```

## 生命周期

- 顺序： validate => asyncData => fetch => hea

### asyncData

- 组件初始化前调用 运作在服务端环境
- 没有 this window document 对象
- 一般在 `asyncData` 会对主要页面数据进行预先请求，获取到的数据会交由服务端拼接成 `html` 返回前端渲染，以此提高首屏加载速度和进行 `seo` 优化

### fetch

- fetch 方法用于在渲染页面前填充应用的状态树（store）数据， 与 asyncData 方法类似，不同的是它不会设置组件的数据。

```js
export default {
  fetch({ store, params }) {
    return axios.get('http://my-api/stars').then((res) => {
      store.commit('setStars', res.data);
    });
  },
};
```

```js
export default {
  async fetch({ store, params }) {
    let { data } = await axios.get('http://my-api/stars');
    store.commit('setStars', data);
  },
};
```

### validate

- 可以访问 this.methods.xxx
- 返回一个 boolean 判断页面是否渲染或者报错

### watchQuery

- 监听参数字符串更改并在更改时执行组件方法 (asyncData, fetch, validate, layout, ...)

### head

- Nuxt.js 使用了 vue-meta 更新应用的 头部标签(Head) 和 html 属性。
- 使用 `head` 方法设置当前页面的头部标签，该方法里能通过 `this` 获取组件的数据。除了好看以外，正确的设置 `meta` 标签，还能有利于页面被搜索引擎查找，进行 `seo` 优化。一般都会设置 `description`(简介) 和 `keyword`(关键词)。

- 在 `nuxt.config.js` 中，我们还可以设置全局的 `head`:

- ```js
  module.exports = {
    head: {
      title: '掘金',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover',
        },
        { name: 'referrer', content: 'never' },
        {
          hid: 'keywords',
          name: 'keywords',
          content:
            '掘金,稀土,Vue.js,微信小程序,Kotlin,RxJava,React Native,Wireshark,敏捷开发,Bootstrap,OKHttp,正则表达式,WebGL,Webpack,Docker,MVVM',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            '掘金是一个帮助开发者成长的社区，是给开发者用的 Hacker News，给设计师用的 Designer News，和给产品经理用的 Medium。掘金的技术文章由稀土上聚集的技术大牛和极客共同编辑为你筛选出最优质的干货，其中包括：Android、iOS、前端、后端等方面的内容。用户每天都可以在这里找到技术世界的头条内容。与此同时，掘金内还有沸点、掘金翻译计划、线下活动、专栏文章等内容。即使你是 GitHub、StackOverflow、开源中国的用户，我们相信你也可以在这里有所收获。',
        },
      ],
    },
  };
  ```

## 加载外部资源

```js
// nuxt.config.js
module.exports = {
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/atom-one-light.min.css',
      },
    ],
    script: [
      {
        src: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/highlight.min.js',
      },
    ],
  },
};
```

## 组件配置

```js
export default {
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/atom-one-light.min.css',
        },
      ],
      script: [
        {
          src: '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/highlight.min.js',
        },
      ],
    };
  },
};
```

## asyncData 请求并行

```js
export default {
  asyncData() {
    // 数组解构获得对应请求的数据
    let [indexData, recommendAuthors, recommendBooks] = await Promise.all([
      // 文章列表
      app.$api.getIndexList({
        first: 20,
        order: 'POPULAR',
        category: 1
      }).then(res => res.s == 1 ? res.d : {}),
      // 推荐作者
      app.$api.getRecommendAuthor({
        limit: 5
      }).then(res => res.s == 1 ? res.d : []),
      // 推荐小册
      app.$api.getRecommendBook().then(res => res.s === 1 ? res.d.data : []),
    ])
    return {
      indexData,
      recommendAuthors,
      recommendBooks
    }
  }
}
```

## cookie cookie-universal-nuxt

- 安装 `cookie-universal-nuxt`

- ```js
  // 获取
  app.$cookies.get('name');
  // 设置
  app.$cookies.set('name', 'value');
  // 删除
  app.$cookies.remove('name');
  ```
