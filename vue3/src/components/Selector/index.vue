<template>
  <div class="selector">
    <el-select
      :multiple='multiple'
      :size="size"
      v-model="current"
      :filterable="filterable"
      :disabled="disabled"
      placeholder="无"
      :clearable="clearable"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item[fidfield]"
        :label="item[fnamefield]"
        :value="item[fidfield]"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "default",
    },
    options: {
      type: Array,
      default: [],
    },
    current: {
      type: [Number, String],
      default: "",
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    fidfield: {
      type: String,
      default: "finterid",
    },
    fnamefield: {
      type: String,
      default: "fname",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const changeSelect = () => {
      context.emit("update:current", props.current);
      context.emit("changeselect", props.current);
    };

    return {
      changeSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>