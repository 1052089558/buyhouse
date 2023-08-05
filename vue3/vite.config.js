import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path, { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// const pathResolve = (dir: string): any => {
//   return resolve(__dirname, ".", dir)
// }

// const alias: Record<string, string> = {
//   '@': pathResolve("./src")
// }
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  // './'解决打包后访问空白页面的问题
  publicPath: "./",
  // 打包配置
  resolve: {
    alias: {
      "@": path.resolve("src"),
      comps: path.resolve(__dirname, "src/components"),
    },
  },
  // 引入全局基础scss

  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/common/css/variable.scss";`,
  //     },
  //   },
  // },
  build: {
    outDir: "dist", //指定输出路径
    assetsDir: "assets", // 指定生成静态资源的存放路径
    minify: "terser", // 混淆器，terser构建后文件体积更小
    terserOptions: {
      // 生产环境移除console
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
