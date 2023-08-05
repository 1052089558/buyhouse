<template>
  <div class="name">
    {{ name }},{{ info.add }}
    <div class="age">{{ info.age }}</div>
  </div>
</template>

<script >
import { reactive, toRefs } from "vue";
export default {
  setup(props, context) {
    let state = reactive({
      name: "凉白开",
      info: {
        age: 23,
        add: "福建",
      },
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less">
.name {
  display: inline;
  background-color: aquamarine;
  .age {
    display: inline;
    background-color: red;
  }
}
</style>