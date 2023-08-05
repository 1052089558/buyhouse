<template>
  <div class="layout">
    <el-container class="j_con_box">
      <el-header class="j_header">
        <headertitle></headertitle>
      </el-header>
      <el-container class="j_bot_box">
        <el-aside class="j_aside">
          <tree-menu :treeData="treeData" />
        </el-aside>
        <el-main>
          <Breadcrumb />
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { onBeforeMount, onMounted } from "vue";
import headertitle from "./components/headertitle.vue";
import Breadcrumb from "./components/breadcrumb.vue";
import { reactive, toRefs } from "@vue/reactivity";
import TreeMenu from "../components/menu/TreeMenu.vue";
// import menv from "../mock/menv.json"


export default {
  components: {
    headertitle,
    TreeMenu,
    Breadcrumb,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      isCollapse: false,
      treeData: [],

    });
    // onActivated(() => {
    //   getTreeData()
    // })
    onMounted(() => {
      getTreeData()
    })
    //动态获取菜单栏目数据
    const getTreeData = () => {
      // state.treeData = state.menv
      // state.treeData = state.treeData.slice()
    };

    return {
      onBeforeMount,
      ...toRefs(state),
      getTreeData
    };
  },
};
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100%;
  width: 100%;

  .j_con_box {
    overflow: hidden;
    height: 100%;

    .j_header {
      padding: 0;
    }

    .j_bot_box {
      overflow: hidden;

      .j_aside {
        overflow: hidden;
        position: relative;
        width: 230px;
      }
    }
  }
}

.el-main {
  text-align: center;
  overflow-y: scroll;
}
</style>