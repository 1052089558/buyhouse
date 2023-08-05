<template>
  <div class="selector">
    <el-select-v2
      :multiple='multiple'
      v-model="current"
      :options="_options"
      placeholder="无"
      :disabled="disabled"
      @change="changeSelect"
      :filterable="filterable"
      :clearable="clearable"
      :size="size"
    />
  </div>
</template>



<script>
import { onMounted, reactive, toRefs, watch } from "@vue/runtime-core";
export default {
  props: {
    size: {
      type: String,
      default: "medium",
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
    fsubnamefield: {
      type: String,
      default: "",
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

    const state = reactive({
      _options: [],
    });

    onMounted(() => {
      getOptions();
    });

    watch(
      () => props.current,
      () => {
        getOptions();
      }
    );

    watch(
      () => props.options,
      () => {
        getOptions();
      }
    );

    const getOptions = () => {
      state._options = props.options.map((t) => {
        return {
          value: t[props.fidfield],
          label: props.fsubnamefield
            ? t[props.fnamefield] + "-" + t[props.fsubnamefield]
            : t[props.fnamefield],
        };
      });
    };

    return {
      ...toRefs(state),
      changeSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>