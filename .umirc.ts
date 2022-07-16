import { defineConfig } from 'dumi';
// import img from '/src/img/logo.png'
export default defineConfig({
  title: '个人博客',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F09%2F20190809215049_LPvFh.thumb.700_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630764416&t=79710b9bc044c3447c2adf970b4bb01d',
  outputPath: 'docs-dist',
  mode: 'doc',
  base: '/src/',
  // more config: https://d.umijs.org/config
});
