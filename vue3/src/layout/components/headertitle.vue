<template>
  <div class="context">
    <div class="context-left">
      <img :src="viteimg" alt="" />
      <div class="topic">公务车出行服务云平台</div>
    </div>
    <div class="context-right">
      <el-dropdown class="j_dropdown" :hide-on-click="false">
        <div class="user">{{ username }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item @click="outlogin">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import viteimg from "@/assets/vite.svg";
import { useRouter } from "vue-router";
import { reactive, toRefs } from "@vue/reactivity";
import { inject } from "vue";
export default {
  setup(props, context) {
    const util = inject("util");
    const state = reactive({
      username: util.getStor("userNa"),
    });
    const routers = useRouter();
    const outlogin = () => {
      localStorage.clear(); 
      routers.push({ path: "/login" });
      location.reload()
    };
    return {
      ...toRefs(state),
      viteimg,
      routers,
      // store,
      outlogin,
    };
  },
};
</script>

<style lang="scss" scoped>
.context {
  display: flex;
  justify-content: space-between;
  background-color: #05265f;
  height: 60px;
  line-height: 60px;
  vertical-align: middle;

  &-left {
    display: flex;

    img {
      height: 46px;
      margin:7px 10px 7px 20px;
    }

    .topic {
      color: #fff;
      font-size: 20px;
      font-weight: lighter;
    }
  }

  &-right {
    display: flex;
    .j_dropdown{
      line-height: inherit;
    }

    .user {
      font-size: 18px;
      color: #fff;
      margin-right: 24px;
    }

    img {
      margin-right: 10px;
      margin-top: 8px;
    }
  }
}
</style>