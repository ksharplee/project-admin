<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="warehouseInstockList.data.items"
      :loading="loadingDataItems"
      loading-text="加载中..."
      no-data-text="暂无数据"
      hide-default-footer
      :items-per-page="20"
    >
      <template v-slot:top>
        <div
          class="text-left d-flex align-center mb-3"
          style="height: 36px"
        >
          <v-menu
            offset-y
          >
            <template v-slot:activator="{ on, value }">
              <v-btn
                text
                class="px-1 ml-2"
                v-on="on"
              >
                {{ currentStatus }} <v-icon
                  :class="value ? 'rotate-180' : ''"
                >
                  mdi-chevron-down mdi-18px
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in status"
                :key="index"
                @click="searchOrderByStatus(item)"
              >
                <v-list-item-title class="body-2">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu
            offset-y
          >
            <template v-slot:activator="{ on, value }">
              <v-btn
                text
                class="px-1 ml-2"
                v-on="on"
              >
                {{ currentType }} <v-icon
                  :class="value ? 'rotate-180' : ''"
                >
                  mdi-chevron-down mdi-18px
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in warehouseInstockTypeListLocal"
                :key="index"
                @click="searchOrderByType(item)"
              >
                <v-list-item-title class="body-2">
                  {{ item.dnames }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu
            offset-y
          >
            <template v-slot:activator="{ on, value }">
              <v-btn
                text
                class="px-1 ml-2"
                v-on="on"
              >
                {{ currentWarehouse }} <v-icon
                  :class="value ? 'rotate-180' : ''"
                >
                  mdi-chevron-down mdi-18px
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in warehouseListLocal"
                :key="index"
                @click="searchOrderByWarehouse(item)"
              >
                <v-list-item-title class="body-2">
                  {{ item.dnames }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div
            class="input-group flex-nowrap ml-2"
            style="width:400px"
          >
            <div
              class="d-flex custom-text-field-wrap"
            >
              <div class="input-group-control">
                <v-menu
                  v-model="menuStart"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="search.startTime"
                      class="white"
                      placeholder="请选择入库时间"
                      single-line
                      dense
                      solo
                      flat
                      hide-details
                      clearable
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="search.startTime"
                    color="primary"
                    :max="search.endTime ? search.endTime : null"
                    scrollable
                    @input="menuStart = false"
                  />
                </v-menu>
              </div>
              <div class="input-group-innerpend">
                <span class="input-group-text">到</span>
              </div>
              <div class="input-group-control">
                <v-menu
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="search.endTime"
                      :disabled="!search.startTime"
                      class="white"
                      placeholder="请选择截止时间"
                      single-line
                      clearable
                      dense
                      solo
                      flat
                      hide-details
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="search.endTime"
                    :min="search.startTime"
                    color="primary"
                    scrollable
                    @input="menuEnd = false"
                  />
                </v-menu>
              </div>
              <div class="input-group-append mr-2">
                <v-icon>mdi-calendar-import</v-icon>
              </div>
            </div>
          </div>
          <div
            class="input-group ml-4"
            style="width:300px"
          >
            <div class="input-group-control">
              <v-text-field
                v-model="search.searchStr"
                placeholder="请输入入库单号"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions"
              />
            </div>
            <div class="input-group-append">
              <v-btn
                color="blue-grey lighten-4 px-0"
                depressed
                x-small
                @click="getWarehouseIntockList({ search })"
              >
                <v-icon
                  color="blue-grey darken-2"
                >
                  mdi-magnify mdi-18px
                </v-icon>
              </v-btn>
            </div>
          </div>
          <v-spacer />
          <v-btn
            color="primary"
            class="ml-auto"
            depressed
            :to="{ name: 'warehouse_instock_list_add' }"
          >
            <v-icon left>
              mdi-plus
            </v-icon>新增入库单
          </v-btn>
        </div>
      </template>
      <template v-slot:item.deliveryTime="{ item }">
        <span v-if="item.deliveryTime">{{ item.deliveryTime | dateTruncate(10) }}</span>
        <span
          v-else
          class="grey--text"
        >无</span>
      </template>
      <template v-slot:item.dStatus="{ item }">
        <span :class="item.dStatus === '0' ? 'error--text' : item.dStatus === '1' ?'success--text' : 'grey--text'">{{ item.dStatus === '0' ? '待审核' : item.dStatus === '1' ? '已审核' : '已作废' }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <v-menu
          offset-y
          left
        >
          <template v-slot:activator="{ on }">
            <v-icon
              color="secondary"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <v-list>
            <v-list-item
              :to="{ name: 'warehouse_instock_list_detail', params: { id: item.id }}"
            >
              <v-list-item-title>
                <v-icon
                  class="mr-1"
                  small
                  style="position:relative;top:-1px"
                >
                  mdi-file-document-box-search
                </v-icon>详情
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="item.dStatus !== '0'"
              :to="{ name: 'warehouse_instock_list_edit', params: { id: item.id }}"
            >
              <v-list-item-title>
                <v-icon
                  class="mr-1"
                  small
                  style="position:relative;top:-1px"
                >
                  mdi-pencil-circle
                </v-icon>编辑
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="item.dStatus !== '0'"
              @click="dialog = true;operate = 'check';operateText='审核';toOperateInstockOrder = item.id"
            >
              <v-list-item-title>
                <v-icon
                  class="mr-1"
                  small
                  style="position:relative;top:-1px"
                >
                  mdi-clipboard-check
                </v-icon>审核
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="item.dStatus !== '1'"
              @click="dialog = true;operate = 'nullify';operateText='作废';toOperateInstockOrder = item.id"
            >
              <v-list-item-title>
                <v-icon
                  class="mr-1"
                  small
                  style="position:relative;top:-1px"
                >
                  mdi-close-circle
                </v-icon>作废
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="item.dStatus !== '0'"
              @click="dialog = true; operate = 'delete';operateText='删除'; toOperateInstockOrder = item.id"
            >
              <v-list-item-title>
                <v-icon
                  class="mr-1"
                  small
                  style="position:relative;top:-1px"
                >
                  mdi-delete-forever
                </v-icon>删除
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:footer>
        <v-divider />
        <div
          v-if="warehouseInstockList.status && warehouseInstockList.data.items.length"
          class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
        >
          <div class="mr-2">
            共<span class="error--text">{{ warehouseInstockList.data.totalItem }}</span>入库单
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            @input="changePagination"
          />
          <div class="mx-2">
            跳至
          </div>
          <div style="width:50px">
            <input
              v-model="pageEnter"
              type="text"
              class="width-100 px-2 text-center"
              style="height:30px;border:1px solid #ddd;max-width:100%;border-radius:3px"
              @keyup.enter="changePaginationDirectly"
            >
          </div>
          <div class="ml-2">
            页
          </div>
        </div>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定{{ operateText }}吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="operating"
            :disabled="operating"
            @click="operateInstockOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialog = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'WarehouseInstockList',
  data() {
    return {
      loadingDataItems: false,
      dialog: false,
      operate: '',
      operateText: '',
      operating: false,
      toOperateInstockOrder: '',
      menuStart: false,
      menuEnd: false,
      valid: true,
      target: {},
      search: {
        inTypeId: '',
        dStatus: '',
        startTime: '',
        endTime: '',
        searchStr: '',
      },
      status: [
        {
          text: '全部状态',
          value: '0',
        },
        {
          text: '未审核',
          value: '1',
        },
        {
          text: '已审核',
          value: '2',
        },
        {
          text: '已作废',
          value: '3',
        },
      ],
      currentStatus: '全部状态',
      currentType: '全部类型',
      currentWarehouse: '所有仓库',
      headers: [
        {
          text: '入库单号',
          value: 'inNo',
          align: 'center',
          sortable: false,
        },
        {
          text: '入库仓库',
          value: 'warehouseName',
          align: 'center',
          sortable: false,
        },
        {
          text: '商品金额(元)',
          value: 'amount',
          align: 'center',
          sortable: false,
        },
        {
          text: '入库数量',
          value: 'goodNumber',
          align: 'center',
          sortable: false,
        },
        {
          text: '全部类型',
          value: 'inTypeName',
          align: 'center',
          sortable: false,
        },
        {
          text: '入库时间',
          value: 'deliveryTime',
          align: 'center',
          sortable: false,
        },
        {
          text: '全部状态',
          value: 'dStatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          width: '120px',
          sortable: false,
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('warehouse', ['warehouseInstockList', 'warehouseInstockTypeList', 'warehouseList']),
    warehouseInstockTypeListLocal() {
      return R.prepend({
        id: '',
        dnames: '全部类型',
      }, this.warehouseInstockTypeList.data.items);
    },
    warehouseListLocal() {
      return R.prepend({
        id: '',
        dnames: '所有仓库',
      }, this.warehouseList.data.items);
    },
    page: {
      set(value) {
        this.warehouseInstockList.data.p = value;
      },
      get() {
        return +this.warehouseInstockList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.warehouseInstockList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.warehouseInstockList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
      );
    },
  },
  created() {
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: false,
        to: { name: 'home' },
        exact: true,
      },
      {
        text: '商品入库',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllData();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseIntockListAsync', 'getWarehouseListAsync', 'getWarehouseInstockTypeListAsync', 'deleteWarehouseInstockAsync', 'checkWarehouseInstockAsync', 'nullifyWarehouseInstockAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getWarehouseIntockList(this.search);
      } else {
        this.pageEnter = 1;
      }
    },
    changePagination() {
      this.getWarehouseIntockList(this.search);
    },
    clearSearchConditions() {
      this.$set(this.search, 'searchStr', '');
      this.getWarehouseIntockList(this.search);
    },
    getAllData() {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      const promises = [this.getWarehouseIntockListAsync(), this.getWarehouseInstockTypeListAsync(), this.getWarehouseListAsync()];
      Promise.all(promises).catch((err) => {
        this.checkErr(err, 'getAllData');
      }).finally(() => {
        this.loadingDataItems = false;
        this.$store.commit('END_LOADING');
      });
    },
    searchOrderByStatus(item) {
      this.currentStatus = item.text;
      this.$set(this.search, 'dStatus', item.value);
      this.getWarehouseIntockList(this.search);
    },
    searchOrderByWarehouse(item) {
      this.currentWarehouse = item.dnames;
      this.$set(this.search, 'warehouseId', item.id);
      this.getWarehouseIntockList(this.search);
    },
    searchOrderByType(item) {
      this.currentType = item.dnames;
      this.$set(this.search, 'inTypeId', item.id);
      this.getWarehouseIntockList(this.search);
    },
    getWarehouseIntockList(params) {
      this.loadingDataItems = true;
      this.getWarehouseIntockListAsync(params).catch((err) => {
        this.checkErr(err, 'getWarehouseList');
      }).finally(() => {
        this.loadingDataItems = false;
      });
    },
    operateInstockOrder() {
      if (this.operate === 'delete') {
        this.deleteWarehouseInstock();
      } else if (this.operate === 'check') {
        this.checkWarehouseInstock();
      } else {
        this.nullifyWarehouseInstock();
      }
    },
    // 删除入库单
    deleteWarehouseInstock() {
      this.operating = true;
      this.deleteWarehouseInstockAsync({ id: this.toOperateInstockOrder, reload: true })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 作废入库单
    nullifyWarehouseInstock() {
      this.operating = true;
      this.nullifyWarehouseInstockAsync({ id: this.toOperateInstockOrder, reload: true })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 审核入库单
    checkWarehouseInstock() {
      this.operating = true;
      this.checkWarehouseInstockAsync({ id: this.toOperateInstockOrder, reload: true })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，审核成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
  },
};
</script>
