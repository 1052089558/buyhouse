<script setup >
import { ref } from "vue"
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
const locale = ref(zhCn);
</script>

<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <router-view v-slot='{ Component }'>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<style scoped></style>