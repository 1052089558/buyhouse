<template>
  <div class="breadclass">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="item in filterRouterList"
        :key="item.path"
        :to="{ path: item?.path }"
      >
        {{ item?.meta?.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
import { computed, onMounted, reactive } from "vue";
import { toRefs } from "@vueuse/shared";
export default {
  setup() {
    const router = useRouter();
    const filterRouterList = computed(() => {
      // 过滤掉没有meta的
      console.log(router.currentRoute.value.matched);
      return router.currentRoute.value.matched.filter(
        (item) => item.meta.title
      );
    });
    return {
      router,

      filterRouterList,
    };
  },
};
</script>
<style scoped lang="scss">
.breadclass {
  margin-bottom: 20px;
}
</style>