<template>
  <div class="listtable">
    <el-row
      align="middle"
      class="subtoolbar"
      v-if="!readonly"
    >
      <slot></slot>
      <el-button
        :size="btnsize"
        :style="{marginLeft:'10px'}"
        icon="el-icon-download"
        type="success"
        v-if="candownload"
        @click="export2Excel()"
      >导出</el-button>
    </el-row>
    <vxe-table
      :show-footer='showfooter'
      :footer-method="footerMethod"
      footer-row-class-name='xfooterclass'
      row-key
      :checkbox-config="{ checkField: 'checked' }"
      :border="border"
      :resizable="resizable"
      :auto-resize="true"
      highlight-current-row
      highlight-hover-row
      :show-overflow='showoverflow'
      :show-header-overflow='showheaderoverflow'
      @checkbox-all="onCheckchange"
      @cell-click="onCellClick"
      @checkbox-change='onCheckchange'
      @cell-dblclick="dbClick"
      v-loading="loading"
      ref="mytable"
      :data="table_data"
      style="width: 100%"
      :height="height"
      :span-method="rowspanMethod"
      :row-style='rowStyle'
    >
      <vxe-column
        fixed="left"
        type="checkbox"
        width="40"
        v-if="hasSelection"
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
        :sort-config="{ multiple: true, trigger: 'cell' }"
        :sortable="(item.type=='date'|| item.type=='datetime')? true:item.sortable"
        :fixed="item.fixed"
        v-for="(item, index, key) in tablecolumns.filter(t=>{return !t.hidden})"
        :item="item"
        :key="key"
        :index="index"
        :title="item.label"
        :width="item.width"
        :field='item.prop'
      >
        <template #default="scope">
          <el-row>
            <span
              :style="getItemStyle(item, scope.row)"
              v-if="
                item.type != 'statebar' &&
                item.type != 'workorderstate' &&
                item.type != 'datestatebar' &&
                item.type != 'tag'
              "
            >{{ formatColumn(scope.row, item) }}</span>
            <statebar
              v-if="item.type == 'statebar'"
              :data="scope.row.stateData"
            />
            <date-statebar
              :readonly="item.readonly"
              v-if="item.type == 'datestatebar'"
              :data="scope.row.fstate"
            />
            <workorder-state
              v-if="item.type == 'workorderstate'"
              :fstate="scope.row.fstate"
              :fbegindate="scope.row.fbegindate"
              :fplanenddate="scope.row.fplanenddate"
              :fpaused="scope.row.fpaused"
              :faccepted="scope.row.faccepted"
            />
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
          </el-row>
        </template>
      </vxe-column>

    </vxe-table>

    <el-pagination
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
import { toRefs, reactive, watch, onMounted, ref } from "vue";
import moment from "moment";
import Statebar from "comps/Statebar/index.vue";
import DateStatebar from "comps/DateStateBar/index.vue";
import WorkorderState from "comps/WorkorderState/index.vue";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { round } from "utils/tools.js";
import { whiteColor } from "utils/const.js";

export default {
  components: {
    Statebar,
    WorkorderState,
    DateStatebar,
  },
  props: {
    btnsize: {
      type: String,
      default: "small",
    },
    showSeq: {
      type: Boolean,
      default: false,
    },
    candownload: {
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
      default: false,
    },
    showheaderoverflow: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "600",
    },
    tablecolumns: {
      type: Array,
      default: [],
    },
    tabledata: {
      type: Array,
      default: [],
    },
    pagenation: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasViewOp: {
      type: Boolean,
      default: true,
    },
    opName: {
      type: String,
      default: "查看",
    },
    opWidth: {
      type: Number,
      default: 80,
    },
    opType: {
      type: String,
      default: "",
    },
    hasSelection: {
      type: Boolean,
      default: false,
    },
    spanfields: {
      type: Array,
      default: [],
    },
    fidfield: {
      type: String,
      default: "finterid",
    },
    hidecolumn: {
      type: String,
      default: "",
    },
    tablename: {
      type: String,
      default: "查询列表",
    },
    showfooter: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const state = reactive({
      table_data: [],
      my_pagenation: null,
      hasSpanRows: [],
      multipleSelection: [],
    });

    const mytable = ref(null);

    watch(
      () => props.tabledata,
      () => {
        state.table_data = props.tabledata;
        filterData(state.table_data, props.fidfield);
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
      state.table_data = props.tabledata;
      if (props.pagenation) {
        state.my_pagenation = props.pagenation;
      }
    });

    const formatColumn = (row, item) => {
      if (item.type == "date" || item.type == "datetime") {
        if (row[item.prop] && row[item.prop] != undefined) {
          let formater =
            item.type == "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss";
          return moment(row[item.prop]).format(formater);
        } else {
          return null;
        }
      }
      if (item.type == "number") {
        let point = item.point ? item.point : 2;
        return row[item.prop] != undefined
          ? parseFloat(row[item.prop]).toFixed(point)
          : null;
      }
      if (item.type == "selector") {
        var target = item.options.find(
          (t) => t[item.fidfield] == row[item.prop]
        );
        if (target != null) {
          return target[item.fnamefield];
        }
      } else {
        return row[item.prop];
      }
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
    const dbClick = ({ row }) => {
      context.emit("rowdbclick", row);
    };

    const filterData = (datas, idfield) => {
      if (!props.hideheader || datas.length == 0) return;
      datas.sort((a, b) => {
        return a[idfield] - b[idfield];
      });
      // 数据处理
      var ids = [];
      datas.forEach((t) => {
        let id = t[idfield];
        if (ids.length > 0) {
          var target = ids.find((i) => {
            return i.id == id;
          });
          if (!target) {
            ids.push({
              id: id,
              count: 1,
            });
          } else {
            target.count++;
          }
        } else {
          ids.push({
            id: id,
            count: 1,
          });
        }
      });

      datas.forEach((t) => {
        let target = ids.find((i) => {
          return i.id == t[idfield];
        });
        if (target) {
          t.rowspan = target.count;
          ids.splice(ids.indexOf(target), 1);
        } else {
          t.rowspan = 0;
        }
      });
    };

    const rowspanMethod = ({
      row,
      _rowIndex,
      column,
      _columnIndex,
      visibleData,
    }) => {
      if (props.hidecolumn == "") return;
      let colindex = 0;
      let target = props.tablecolumns.find((t) => {
        return t.prop == props.hidecolumn;
      });
      if (target) {
        colindex = props.tablecolumns.indexOf(target);
        if (props.hasViewOp) {
          colindex++;
        }
        if (props.hasSelection) {
          colindex++;
        }
      }
      if (colindex == 0) return;

      let idfield = props.fidfield;
      const cellValue = row[idfield];
      if (cellValue && _columnIndex <= colindex) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[idfield] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[idfield] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    };

    const onCheckchange = ({ records }) => {
      //console.log(records);
      state.multipleSelection = records;
      context.emit("selectchange", state.multipleSelection);
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

    const rowStyle = ({ row }) => {
      if (row.rowstyle) {
        return row.rowstyle;
      }
      if (row.rowbg) {
        let style = {
          background: row.rowbg,
          color: row.rowbg == "#fff" ? "000" : "#fff",
        };
        return style;
      }
    };

    const export2Excel = () => {
      var wb = XLSX.utils.book_new();

      //console.log('columns', props.tablecolumns);
      //console.log('datas', state.table_data);
      let columns = props.tablecolumns.filter((t) => {
        return !t.hidden;
      });
      let datas = [];
      let headers = [];
      columns.forEach((t) => {
        if (
          t.type == "workorderstate" ||
          t.type == "checkbox" ||
          t.type == "datestatebar"
        )
          return;
        headers.push(t.label);
      });

      state.table_data.forEach((d) => {
        let data = {};
        columns.forEach((t) => {
          if (
            t.type == "workorderstate" ||
            t.type == "checkbox" ||
            t.type == "datestatebar"
          )
            return;
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

    const onCellClick = ({ row }) => {
      context.emit("cellclick", row);
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
      //console.log('columns', columns);
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
      formatColumn,
      handleSizeChange,
      handleCurrentChange,
      handleView,
      dbClick,
      rowspanMethod,
      onCheckchange,
      getItemStyle,
      mytable,
      rowStyle,
      export2Excel,
      onCellClick,
      footerMethod,
    };
  },
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

<style lang="scss" scoped>
@import "styles/variables.module.scss";

.listtable {
  margin-top: 10px;
  .subtoolbar {
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
