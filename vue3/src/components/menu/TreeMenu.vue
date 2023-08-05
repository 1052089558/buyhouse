<template>
  <div class="admin_nav" :class="mode">
    <div class="nav_box">
      <el-menu
        router
        :default-active="this.$route.path"
        unique-opened
        :background-color="backgroundColor"
        :text-color="TextColor"
        :active-text-color="activeTextColor"
        :mode="mode"
      >
        <template v-for="one in treeData">
          <el-sub-menu
            :index="one.tData.url"
            v-if="one.child && one.child.length"
            :key="one.tData.menuId"
          >
            <template v-slot:title>
              <i :class="one.icone" v-if="one.icone"></i>
              <span>{{ one.tData.cName }}</span>
            </template>
            <template v-for="item in one.child">
              <el-sub-menu
                :index="item.tData.url"
                v-if="item.child && item.child.length"
                :key="item.tData.menuid"
              >
                <template #title>
                  <i :class="item.icone" v-if="item.icone"></i>
                  <span>{{ item.tData.cName }}</span>
                </template>
                <div v-for="(k, index) in item.child" :key="index">
                  <el-menu-item :index="k.tData.url">
                    <i :class="k.icone" v-if="k.icone"></i>
                    <template #title>{{ k.tData.cName }}</template>
                  </el-menu-item>
                </div>
              </el-sub-menu>
              <el-menu-item
                :index="item.tData.url"
                v-bind:key="item.tData.menuId"
                v-else-if="!item.blank"
              >
                <i :class="item.icone" v-if="item.icone"></i>
                <template v-slot:title>{{ item.tData.cName }}</template>
              </el-menu-item>
              <a
                :href="item.tData.url"
                v-bind:key="item.tData.menuId + 1"
                target="_blank"
                class="nav_a"
                v-else
              >
                <el-menu-item v-bind:key="item.tData.menuId">
                  <i :class="item.icone" v-if="item.icone"></i>
                  <span>{{ item.tData.cName }}</span>
                </el-menu-item>
              </a>
            </template>
          </el-sub-menu>
          <el-menu-item
            :index="one.tData.url"
            v-bind:key="one.tData.menuId + 2"
            v-else-if="!one.blank"
          >
            <i :class="one.icone" v-if="one.icone"></i>
            <template #title>{{ one.tData.cName }}</template>
          </el-menu-item>
          <a
            :href="one.tData.url"
            v-bind:key="one.tData.menuId + 3"
            target="_blank"
            class="nav_a"
            v-else
          >
            <el-menu-item v-bind:key="one.id">
              <i :class="one.icone" v-if="one.icone"></i>
              <span>{{ one.tData.cName }}</span>
            </el-menu-item>
          </a>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script >
import { ref, onMounted } from "vue";

export default {
  name: "TreeMenu",
  props: {
    treeData: {
      type: Array,
      default: [],
    },
    backgroundColor: {
      type: String,
      default: "#edf0f5",
    },
    activeTextColor: {
      type: String,
      default: "#05265f",
    },
    TextColor: {
      type: String,
      default: "#7c5b5b",
    },
    mode: {
      type: String,
      default: "vertical", //horizontal
    },
  },
  setup(props) {
    onMounted(() => {

    });
    return {};
  },
};
</script>
<style lang="scss" scoped="admin_nav">
.admin_nav {
  position: absolute;
  top:0;
  bottom:0;
 
  &.vertical {
    height: 100%;
    background-color: #edf0f5;
    overflow-y: scroll;
    width: 230px;
    margin-right: -20px;

    .nav_box {
      width: 100%;

      .el-menu {
        border: none;
        // .is-alive {
        //   background: rgb(67, 74, 80) !important;
        // }
      }
    }
  }

  .nav_a {
    text-decoration: none;
  }
}
</style>
<style lang="scss">
.admin_nav {
  .el-menu-item {
    font-size: 18px;
    color: #1e1e1e;
  }

  &.vertical {
    .el-menu-item,
    .el-sub-menu__title {
      &.is-active {
        * {
          color: #05265f;
        }
      }

      * {
        color: #5b5b5b;
        font-size: 18px;
      }
    }

    .el-sub-menu.is-active:not(.is-opened) .el-sub-menu__title,
    .el-menu-item.is-active {
      // background: rgb(67, 74, 80) !important;
      position: relative;

      i {
        &.el-sub-menu__icon-arrow {
          color: #05265f;
          font-weight: bold;
        }
      }

      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #05265f;
      }
    }
  }
}
</style>