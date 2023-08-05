<template>
  <div class="myform">
    <el-form
      ref="form"
      :model="data"
      :label-width="labelwidth"
    >
      <el-row
        v-for="(row, rindex) in fields"
        :key="rindex"
      >
        <el-col
          v-for="(item, cindex) in row.filter((t) => {
            return !t.hidden;
          })"
          :key="cindex"
          :span="item.span"
          :xs="24"
          :sm="12"
          :md="item.span"
          :lg="item.span"
          :xl="item.span"
        >
          <el-form-item
            :key="cindex"
            :prop="item.prop"
            :rules="
              item.required
                ? [
                    {
                      required: true,
                      message: '请填写' + item.label,
                      trigger: ['blur', 'change'],
                    },
                  ]
                : [{ required: false }]
            "
            :label="item.label"
            :style="item.style"
          >
            <el-input
              :rows="item.rows"
              @change="changeinput($event, item.prop)"
              :type="item.type"
              v-if="
                item.type == 'text' ||
                item.type == 'number' ||
                item.type == 'textarea' ||
                item.type == 'textwithbtn'
              "
              v-model="data[item.prop]"
              :readonly="item.readonly"
            >
              <template
                #append
                v-if="item.type == 'textwithbtn'"
              >
                <el-button @click="btnClick($event, item.prop)">{{
                  item.btntext ? item.btntext : "选择"
                }}</el-button>
              </template>
            </el-input>
            <el-date-picker
              :clearable="item.clearable"
              @change="changedate($event, item.prop)"
              :style="{ width: '100%' }"
              :type="item.type"
              :editable="item.editable"
              v-if="item.type == 'datetime' || item.type == 'date'"
              v-model="data[item.prop]"
              :readonly="item.readonly"
            ></el-date-picker>
            <selector-v2
              :clearable="item.clearable"
              @changeselect="changeselect($event, item.prop)"
              :disabled="item.disabled"
              v-if="item.type == 'selector'"
              v-model:current="data[item.prop]"
              :options="item.options"
              :fidfield="item.fidfield"
              :fnamefield="item.fnamefield"
              :fsubnamefield="item.fsubnamefield"
            ></selector-v2>
            <el-switch
              @change="changeinput($event, item.prop)"
              v-if="item.type == 'switch'"
              v-model="data[item.prop]"
            ></el-switch>
            <radio-group
              @changeradio="changeinput($event, item.prop)"
              v-if="item.type == 'radiogroup'"
              :options="item.options"
              :current="data[item.prop]"
            ></radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import SelectorV2 from "comps/SelectorV2/index.vue";
import RadioGroup from "comps/RadioGroup/index.vue";
import { ref } from "@vue/reactivity";
export default {
  components: {
    SelectorV2,
    RadioGroup,
  },
  props: {
    labelwidth: {
      type: String,
      default: "80px",
    },
    data: {
      type: Object,
      default: {},
    },
    fields: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const changeselect = (e, prop) => {
      props.data[prop] = e;
      context.emit("changeselect", e, prop);
      context.emit("changefield", e, prop);
    };
    const changedate = (e, prop) => {
      props.data[prop] = e;
      context.emit("changedate", e, prop);
      context.emit("changefield", e, prop);
    };
    const changeinput = (e, prop) => {
      context.emit("changefield", e, prop);
    };
    const form = ref(null);

    const validate = () => {
      // console.log(22)
      let result = false;
      form.value.validate((valid) => {
        if (valid) {
          result = true;
        }
      });
      return result;
    };

    const clearValidate = () => {
      // console.log('cl')
      form.value.clearValidate();
    };

    const btnClick = (e, prop) => {
      // console.log(e, prop);
      context.emit("btnclick", e, prop);
    };

    return {
      changeselect,
      changedate,
      changeinput,
      form,
      validate,
      clearValidate,
      btnClick,
    };
  },
};
</script>

<style lang="scss" scoped></style>
