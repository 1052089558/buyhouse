<template>
  <div class="edittable">

    <el-row
      class="subtoolbar"
      v-if="!readonly"
    >
      <slot></slot>

      <el-button
        v-if="showrowbtns|| showrowadd"
        size="mini"
        type="primary"
        @click="handleAdd()"
      >新增行</el-button>
      <el-button
        v-if="showrowbtns|| showrowdel"
        size="mini"
        type="danger"
        @click="handleDel()"
      >删除行</el-button>

      <el-button
        size="mini"
        type="warning"
        @click="handleSort()"
        v-if="!is_sort && cansort"
      >排序</el-button>
      <el-button
        size="mini"
        type="success"
        @click="handleEndSort()"
        v-if="is_sort && cansort"
      >结束排序</el-button>

      <el-button
        size="mini"
        type="primary"
        @click="handlePushWorkOrder()"
        v-if="canpushworkorder"
      >下推工单</el-button>

      <el-button
        size="mini"
        icon="el-icon-download"
        type="warning"
        v-if="candownload"
        @click="export2Excel()"
      >下载</el-button>
      <el-upload
        @change="handleChange"
        class="upload"
        action=""
        :show-file-list="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false"
      >
        <el-button
          icon="el-icon-upload"
          v-if="canupload"
          size="small"
          type="success"
        >上传</el-button>
      </el-upload>

    </el-row>

    <vxe-table
      :show-footer='showfooter'
      :footer-method="footerMethod"
      footer-row-class-name='xfooterclass'
      row-key
      @checkbox-all='onCheckchange'
      @checkbox-change='onCheckchange'
      :checkbox-config="{ checkField: 'checked' }"
      :data='table_data'
      ref="xTable"
      :border="border"
      :resizable="resizable"
      :auto-resize="true"
      highlight-current-row
      highlight-hover-row
      :show-overflow='showoverflow'
      :show-header-overflow='showheaderoverflow'
      v-loading="loading"
      :height="height"
      @cell-click="onCellClick"
      @cell-dblclick="dbClick"
      @header-cell-click='onHeaderCellClick'
      :row-style='rowStyle'
    >
      <vxe-column
        type="checkbox"
        width="40"
        v-if="showselection"
        fixed="left"
      ></vxe-column>
      <vxe-column
        type="seq"
        title="序号"
        width="60"
        fixed="left"
        v-if='showSeq'
      ></vxe-column>
      <vxe-column
        title="操作"
        fixed="left"
        :width="opWidth"
        v-if="hasViewOp"
      >
        <template #default="scope">
          <el-row>
            <el-button
              :type="opType"
              size="mini"
              @click="handleView(scope.row)"
            >{{ opName }}</el-button>
          </el-row>
        </template>
      </vxe-column>
      <vxe-column
        :type='item.type'
        :fixed="item.fixed"
        v-for="(item, index) in tablecolumns.filter(t=>{return !t.hidden})"
        :item="item"
        :key="item.prop"
        :index="index"
        :title="item.label"
        :width="item.width"
        :field="item.prop"
        :sortable="item.sortable"
      >
        <template
          #default="scope"
          v-if="item.type!='seq' && item.type!='checkbox' &&item.type!='radio' &&item.type!='expand' "
        >
          <el-row>
            <span
              v-if="
                !item.coloroptions &&
                !scope.row.edit &&
                item.type != 'workorderstate' &&
                item.type != 'tag' &&
                item.type != 'switch' &&
                item.type != 'title'
              "
              :style='getItemStyle(item, scope.row)'
            >{{ formatColumn(scope.row, item) }}</span>
            <div v-if="item.type == 'tag'">
              <el-tag
                effect="dark"
                type="warning"
                v-if="scope.row[item.prop] == 0"
              >否</el-tag>
              <el-tag
                effect="dark"
                type="success"
                v-else
              >是</el-tag>
            </div>
            <div v-if="item.coloroptions && !scope.row.edit">
              <el-tag
                effect="dark"
                :type="getTargetColorOption(item, scope, 'type')"
              >{{
                getTargetColorOption(item, scope, "name")
              }}</el-tag>
            </div>
            <work-order-state
              v-if="item.type == 'workorderstate'"
              :fstate="scope.row.fwstateid"
              :fbegindate="scope.row.fwbegindate"
              :fplanenddate="scope.row.fwplanenddate"
              :fpaused="scope.row.fwpaused"
              :faccepted="scope.row.fwaccepted"
            />
            <el-input
              @focus="inputfocus"
              @change="updateTable(scope.row, item)"
              :disabled="item.disable"
              v-if="item.type == 'input' && scope.row.edit"
              size="small"
              v-model="scope.row[item.prop]"
              :placeholder="'请输入' + item.label"
            ></el-input>
            <el-input
              @focus="inputfocus"
              @change="updateTable(scope.row, item)"
              min="0"
              :disabled="item.disable ? item.disable : scope.row[item.prop + '--disable']"
              type="number"
              v-if="item.type == 'number' && scope.row.edit"
              size="small"
              v-model="scope.row[item.prop]"
              :placeholder="'请输入' + item.label"
            ></el-input>
            <el-date-picker
              :clearable='item.clearable'
              :editable="item.editable"
              @change="updateTable(scope.row, item)"
              size="mini"
              :disabled="item.disable"
              v-if="(item.type == 'date' || item.type=='datetime') && scope.row.edit"
              v-model="scope.row[item.prop]"
              :type="item.type"
              :placeholder="'请选择' + item.label"
            >
            </el-date-picker>
            <selector-v2
              :style="{width:'100%'}"
              @changeselect="updateTable(scope.row, item)"
              v-if="item.type == 'selector' && scope.row.edit"
              :options="item.options?item.options:scope.row[item.prop+'--options']"
              v-model:current="scope.row[item.prop]"
              :disabled="item.disable"
              :fidfield="item.fidfield"
              :fnamefield="item.fnamefield"
              :fsubnamefield="item.fsubnamefield"
              :multiple="item.multiple"
              size="mini"
              :clearable='item.clearable'
            />
            <el-switch
              @change="updateTable(scope.row, item)"
              v-model="scope.row[item.prop]"
              v-if="item.type == 'switch'"
            />
            <span
              :style='getItemStyle(item, scope.row)'
              v-if="item.type == 'title' &&!(item.coloroptions && !scope.row.edit)"
            >{{ scope.row[item.prop] }}</span>
          </el-row>
        </template>
      </vxe-column>
    </vxe-table>
    <el-pagination
      :style="{marginTop:'20px'}"
      v-if="my_pagenation != null"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="my_pagenation.size"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="my_pagenation.current"
      :total="my_pagenation.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import moment from "moment";
import SelectorV2 from "comps/SelectorV2/index.vue";

import { ElMessage } from "element-plus";
import Sortable from "sortablejs";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import SSF from "ssf";

import WorkOrderState from "comps/WorkorderState/index.vue";
import { showToast, round } from "utils/tools.js";
import { whiteColor } from "utils/const.js";

export default {
  components: {
    WorkOrderState,
    SelectorV2,
  },
  props: {
    hasViewOp: {
      type: Boolean,
      default: false,
    },
    opName: {
      type: String,
      default: "查看",
    },
    opType: {
      type: String,
      default: "",
    },
    opWidth: {
      type: Number,
      default: 80,
    },
    showSeq: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    showoverflow: {
      type: Boolean,
      default: true,
    },
    showheaderoverflow: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rowkey: {
      type: String,
      default: "id",
    },
    showselection: {
      type: Boolean,
      default: true,
    },
    showrowbtns: {
      type: Boolean,
      default: true,
    },
    showrowadd: {
      type: Boolean,
      default: false,
    },
    showrowdel: {
      type: Boolean,
      default: false,
    },
    tablename: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "500",
    },
    tablecolumns: {
      type: Array,
      default: [],
    },
    tabledata: {
      type: Array,
      default: [],
    },
    cansort: {
      type: Boolean,
      default: false,
    },
    candownload: {
      type: Boolean,
      default: false,
    },
    canupload: {
      type: Boolean,
      default: false,
    },
    canpushworkorder: {
      type: Boolean,
      default: false,
    },
    pagenation: {
      type: Object,
      default: null,
    },
    showfooter: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const state = reactive({
      my_pagenation: null,
      new_date_json: {}, //数据结构
      //表格数据
      table_data: [],
      sortable: null,
      is_sort: false,
      maxid: 1,
      maxindex: 1,
      multipleSelection: [],
    });

    const xTable = ref(null);

    watch(
      () => props.tabledata,
      (newVal) => {
        if (newVal) {
          //console.log('newval', newVal)
          state.table_data = newVal.slice();
          getMax();
        }
      }
    );

    watch(
      () => props.tablecolumns,
      () => {
        xTable.value.refreshColumn();
      }
    );

    watch(
      () => props.pagenation,
      () => {
        if (props.pagenation) {
          state.my_pagenation = props.pagenation;
        }
      }
    );

    onMounted(() => {
      if (props.pagenation) {
        state.my_pagenation = props.pagenation;
      }
    });

    const getMax = () => {
      state.maxindex = 1;
      state.maxid = 1;
      state.table_data.forEach((t) => {
        if (t[props.rowkey] > state.maxid) {
          state.maxid = t[props.rowkey];
        }
        if (t.findex > state.maxindex) {
          state.maxindex = t.findex;
        }
      });
    };

    onMounted(() => {
      initEditAttribute();
      // 阻止默认行为
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
    });

    //行拖拽
    const rowDrop = () => {
      //console.log('drag')
      // const el = xTable.value.$el.querySelectorAll(
      //   ".el-table__body-wrapper > table > tbody"
      // )[0];

      const el = xTable.value.$el.querySelectorAll(
        ".body--wrapper>.vxe-table--body tbody"
      )[0];

      //console.log('el', el);

      state.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData("Text", "");
        },
        onEnd: (evt) => {
          //console.log('evt', evt);
          const currRow = state.table_data.splice(evt.oldIndex, 1)[0];
          state.table_data.splice(evt.newIndex, 0, currRow);

          let i = 1;
          state.table_data.forEach((t) => {
            t.findex = i++;
          });
          context.emit("dragrow", state.table_data);
          //console.log(state.table_data);
          // xTable.value.loadData(state.table_data);
        },
      });
    };

    const formatColumn = (row, item) => {
      if (item.type == "date") {
        return row[item.prop] != undefined
          ? moment(row[item.prop]).format("YYYY-MM-DD")
          : null;
      }
      if (item.type == "datetime") {
        return row[item.prop] != undefined
          ? moment(row[item.prop]).format("YYYY-MM-DD HH:mm:ss")
          : null;
      }
      if (item.type == "number") {
        if (item.point == 0) {
          return row[item.prop] != undefined ? parseInt(row[item.prop]) : null;
        } else {
          let point = item.point ? item.point : 2;
          return row[item.prop] != undefined
            ? parseFloat(row[item.prop]).toFixed(point)
            : null;
        }
      }
      if (item.type == "selector") {
        let options = item.options
          ? item.options
          : row[item.prop + "--options"];
        if (!item.multiple) {
          var target = options.find((t) => t[item.fidfield] == row[item.prop]);
          if (target != null) {
            return target[item.fnamefield];
          }
        } else {
          var array = row[item.prop];
          let result = "";
          if (array && array.length > 0) {
            array.forEach((t) => {
              var target = options.find((i) => {
                return i[item.fidfield] == t;
              });
              if (target) {
                result += target[item.fnamefield] + ";";
              }
            });
          }
          return result;
        }
      }
      return row[item.prop];
    };

    const handleAdd = () => {
      endEdit();
      endSort();
      var addDataJson = {};
      for (var key in state.new_date_json) {
        addDataJson[key] = "";
      }
      addDataJson.edit = true;
      addDataJson.add = true;
      addDataJson.readonly = false;
      addDataJson.editable = true;
      state.maxid++;
      state.maxindex++;
      addDataJson[props.rowkey] = state.maxid;
      addDataJson.findex = state.maxindex;
      addDataJson.fpushed = 0;
      addDataJson.finterid = -1;
      state.table_data.push(addDataJson);
      xTable.value.reloadData(state.table_data);
      context.emit("changerow", true);
    };

    const handleDel = () => {
      //console.log(state.multipleSelection)
      if (state.multipleSelection.length == 0) {
        showToast("未选择数据", "warning");
        return;
      }
      state.multipleSelection.forEach((t) => {
        //console.log(t);
        if (!t.readonly) {
          let index = state.table_data.indexOf(t);
          state.table_data.splice(index, 1);
        } else {
          showToast("只读行,不能删除！", "warning");
          return;
        }
      });
      context.emit("update:tabledata", state.table_data);
      context.emit("rowchange", true);
      context.emit("rowdeleted", state.multipleSelection);
    };

    //初始化编辑属性
    const initEditAttribute = () => {
      var dataArray = props.tabledata;
      if (dataArray.length > 0) {
        //添加编辑事件
        for (var index in dataArray) {
          dataArray[index]["edit"] = false;
          state.table_data.push(dataArray[index]);
        }
        if (Object.keys(state.new_date_json).length === 0) {
          //新增时，初始化数据结构
          initAddDataJson(dataArray[0]);
        }

        getMax();
      }
    };
    const initAddDataJson = (dataArray) => {
      //新增时，初始化数据结构
      var dataJson = dataArray;
      var newDataJson = {};
      for (var key in dataJson) {
        if (key === "edit") {
          newDataJson[key] = "true";
        } else {
          newDataJson[key] = "";
        }
      }
      newDataJson["add"] = true;
      state.new_date_json = newDataJson;
    };

    const handleSort = () => {
      state.is_sort = true;
      rowDrop();
    };

    const handleEndSort = () => {
      endSort();
    };

    const getTargetColorOption = (item, scope, prop) => {
      var target = item.coloroptions.find((t) => {
        return t.id == scope.row[item.prop];
      });
      //console.log('target', target);
      if (target) {
        return target[prop];
      } else {
        return "";
      }
    };

    const endSort = () => {
      state.is_sort = false;
      if (state.sortable != null) {
        state.sortable.destroy();
        state.sortable = null;
      }
    };

    const exportExcel = () => {
      /* generate workbook object from table */
      var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
      const el = xTable._value.$el;
      //console.log('el', el);

      var wb = XLSX.utils.table_to_book(el, xlsxParam);

      //console.log('wb', wb);

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          props.tablename + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") {
          //console.log(e, wbout);
        }
      }
      return wbout;
    };

    const export2Excel = () => {
      var wb = XLSX.utils.book_new();

      //console.log('columns', props.tablecolumns);
      //console.log('datas', state.table_data);

      let datas = [];
      let headers = [];
      let columns = props.tablecolumns.filter((t) => {
        return !t.hidden;
      });
      columns.forEach((t) => {
        if (t.type == "workorderstate" || t.type == "checkbox") return;
        headers.push(t.label);
      });

      state.table_data.forEach((d) => {
        let data = {};
        columns.forEach((t) => {
          if (t.type == "workorderstate" || t.type == "checkbox") return;
          //console.log(t);

          let key = t.label;
          let val = formatColumn(d, t);
          data = Object.assign(data, { [key]: val });
        });

        datas.push(data);
      });

      //console.log(datas, headers);

      var ws = XLSX.utils.json_to_sheet(datas, { header: headers });

      //console.log('ws', ws);

      // 在工作簿中增加工作表
      XLSX.utils.book_append_sheet(wb, ws, props.tablename);

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          props.tablename + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") {
          //console.log(e, wbout);
        }
      }
      return wbout;
    };

    const handleChange = (file) => {
      //console.log(file.raw);

      let fileTemp = file.raw;

      if (fileTemp) {
        if (
          fileTemp.type ==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          fileTemp.type == "application/vnd.ms-excel"
        ) {
          importfxx(fileTemp);
        } else {
          ElMessage({
            type: "error",
            message: "文件格式错误，请重新上传！",
            duration: 2000,
          });
        }
      } else {
        ElMessage({
          type: "warning",
          message: "请选择上传文件！",
        });
      }
    };

    const importfxx = (file) => {
      //console.log(file);
      // 通过DOM取文件数据
      var rABS = false; //是否将文件读取为二进制字符串
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (file) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          }

          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          let data = [...outdata];

          //console.log(data);

          let columns = props.tablecolumns.filter((t) => {
            return !t.hidden;
          });

          data.map((v) => {
            var addDataJson = {};
            //console.log('vkeys', Object.keys(v));
            var keys = Object.keys(v);
            keys.forEach((key) => {
              var target = columns.find((t) => {
                return t.label == key;
              });
              if (target != null) {
                if (target.type == "selector") {
                  if (!target.multiple) {
                    var tval = target.options.find((t) => {
                      return t[target.fnamefield] == v[key];
                    });
                    if (tval != null) {
                      addDataJson[target.prop] = tval[target.fidfield];
                    }
                  } else {
                    let array = v[key].indexOf(";")
                      ? v[key].split(";")
                      : [v[key]];
                    let result = [];
                    array.forEach((t) => {
                      var tval = target.options.find((i) => {
                        return i[target.fnamefield] == t;
                      });
                      if (tval) {
                        result.push(tval[target.fidfield]);
                      }
                    });
                    addDataJson[target.prop] = result;
                  }
                } else if (target.type == "date" || target.type == "datetime") {
                  let val = v[target.label];
                  //console.log('val', val);
                  if (val > 1) {
                    //console.log(11)
                    // val > 1 表示 日期格式的数据，val < = 1 表示 时间格式的数据，也就是只有 时分秒，没有年月日
                    val = new Date(
                      SSF.format("yyyy-mm-dd HH:mm:ss", val) + " GMT+0800"
                    ); // 写死 东八区的时区：GMT+0800
                  } else {
                    val = new Date(
                      "1900-01-01 " + SSF.format("HH:mm:ss", val) + " GMT+0800"
                    );
                  }
                  if (val == "Invalid Date") {
                    val = v[target.label];
                  }
                  //console.log('trag', val);
                  addDataJson[target.prop] = val;
                } else {
                  addDataJson[target.prop] = v[target.label];
                }
              }
            });

            addDataJson.edit = false;
            addDataJson.add = false;
            addDataJson.readonly = false;
            state.maxid++;
            state.maxindex++;
            addDataJson[props.rowkey] = state.maxid;
            addDataJson.findex = state.maxindex;
            //console.log('new ', addDataJson);
            state.table_data.push(addDataJson);
          });
          //console.log(state.table_data);
          context.emit("update:tabledata", state.table_data, "handleAdd");
        };
        reader.readAsArrayBuffer(file);
      };

      if (rABS) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsBinaryString(file);
      }
    };

    const onCellClick = ({ row }) => {
      //console.log(row);
      endEdit();
      context.emit("cellclick", row);
      if (!row.readonly) {
        row.edit = true;
      }
    };

    const onHeaderCellClick = () => {
      endEdit();
      endSort();
      context.emit("cellheaderclick");
    };

    const endEdit = () => {
      // endSort();
      state.table_data.forEach((t) => {
        t.edit = false;
      });
    };

    const handlePushWorkOrder = () => {
      if (state.multipleSelection.length == 0) {
        ElMessage({
          type: "warning",
          message: "未选择数据",
        });
      }
      let result = [];
      state.multipleSelection.forEach((t) => {
        if (!t.readonly) {
          result.push(t);
        }
      });

      context.emit("pushworkorder", result);
    };

    const tableClick = () => {
      //console.log(111);
    };

    const rowStyle = ({ row }) => {
      let result = {};
      if (row.hidden) {
        result = Object.assign(result, { display: "none" });
      }
      if (row.bgcolor) {
        result = Object.assign(result, { background: row.bgcolor });
      }
      if (row.rowstyle) {
        result = row.rowstyle;
      }
      if (row.rowbg) {
        let style = {
          background: row.rowbg,
          color: row.rowbg == whiteColor ? "000" : "#fff",
        };
        return style;
      }
      return result;
    };

    const getItemStyle = (item, row) => {
      if (item.bgcolors) {
        var target = item.bgcolors.find((t) => {
          return t.id == row[item.bgcolors[0].prop];
        });
        if (target) {
          return target.style;
        }
      }
      if (item.cellstyle) {
        return item.cellstyle;
      }
      if (item.cellbg) {
        let style = {
          background: item.cellbg,
          color: item.cellbg == whiteColor ? "#000" : "#fff",
          padding: "5px",
          borderRadius: "3px",
        };
        return style;
      }
    };

    const onCheckchange = ({ records }) => {
      state.multipleSelection = records;
      context.emit("selectchange", records);
    };

    const updateTable = (row, col) => {
      console.log("row", row);
      console.log("col", col);
      context.emit("update:tabledata", state.table_data);
      context.emit("cellchange", row, col);
    };

    const inputfocus = (e) => {
      e.target.select();
    };

    const dbClick = ({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      $event,
    }) => {
      context.emit("rowdbclick", row, column);
      console.log("row", row);
      console.log("column", column);
    };

    const handleCurrentChange = (val) => {
      state.my_pagenation.current = val;
      context.emit("changepage", state.my_pagenation);
    };

    const handleSizeChange = (val) => {
      state.my_pagenation.size = val;
      context.emit("changepage", state.my_pagenation);
    };
    const handleView = (row) => {
      context.emit("view", row);
    };

    const sumNum = (list, field) => {
      let count = 0;
      list.forEach((item) => {
        if (item[field]) {
          count += parseFloat(item[field]);
        }
      });
      return count != 0 ? round(count) : null;
    };

    const footerMethod = ({ columns, data }) => {
      const footers = [];
      columns.forEach((column, columnIndex) => {
        let colCell = null;
        let target = props.tablecolumns.find((t) => {
          return t.prop == column.property && t.summary && !t.hidden;
        });
        if (target) {
          colCell = sumNum(data, column.property);
        }
        footers.push(colCell);
      });
      // 返回一个二维数组的表尾合计
      return [footers];
    };

    return {
      ...toRefs(state),
      handleView,
      handleCurrentChange,
      handleSizeChange,
      handleAdd,
      initEditAttribute,
      initAddDataJson,
      formatColumn,
      xTable,
      handleSort,
      handleEndSort,
      exportExcel,
      export2Excel,
      handleChange,
      onCellClick,
      handleDel,
      handlePushWorkOrder,
      getTargetColorOption,
      tableClick,
      rowStyle,
      getItemStyle,
      onHeaderCellClick,
      onCheckchange,
      updateTable,
      inputfocus,
      dbClick,
      footerMethod,
    };
  },

  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.xfooterclass {
  color: #fff;
  font-weight: 600;
  background: #67c23a;
  font-size: 14px !important;
}
</style>

<style lang="scss" scope>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
.upload {
  margin-left: 10px !important;
}
.subtoolbar {
  margin-bottom: 10px;
}
</style>
