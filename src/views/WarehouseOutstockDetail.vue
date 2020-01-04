<template>
  <v-form
    v-if="outstockOrder"
    ref="form"
    v-model="valid"
  >
    <v-card
      class="mb-4"
    >
      <v-card-title>
        出库单详情
      </v-card-title>
      <v-card-text
        style="color:#333"
      >
        <div class="mb-3 body-1 d-flex align-baseline">
          出库单号：<span class="display-1 font-weight-bold mr-8">{{ outstockOrder.sendNo }}</span>
          状态：<span :class="outstockOrder.dStatus === '0' ? 'error--text' : outstockOrder.dStatus === '1' ?'success--text' : 'grey--text'">{{ outstockOrder.dStatus === '0' ? '待审核' : outstockOrder.dStatus === '1' ? '已审核' : '已作废' }}</span>
        </div>
        <v-data-table
          :headers="headers"
          :items="outstockOrder.detail"
          :loading="$store.state.loading"
          loading-text="加载中..."
          no-data-text="暂无数据"
          hide-default-footer
          fixed-header
          :items-per-page="20"
          :page.sync="page"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.image="{ item }">
            <div
              class="py-3"
            >
              <v-img
                :src="item.image ? `${item.image}?x-oss-process=image/resize,m_fill,w_100,h_100` : require('@/assets/imgWaiting.png')"
                aspect-ratio="1"
                class="grey lighten-1"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </div>
          </template>
          <template v-slot:item.goodName="{ item }">
            <div class="text-left">
              {{ item.goodName }}
            </div>
          </template>
          <template
            v-slot:footer
          >
            <v-divider />
            <div class="d-flex align-center">
              <div class="title">
                出库商品总数：{{ outstockOrder.goodNumber }}
                <span class="ml-4">
                  总金额： <span class="error--text">￥<span class="display-1">{{ outstockOrder.amount }}</span></span>
                </span>
              </div>
              <v-spacer />
              <div
                class="pa-4 d-flex align-center justify-end text-no-wrap body-1 flex-grow-1"
              >
                <div class="mr-2">
                  共<span class="error--text">{{ outstockOrder.detail.length }}</span>商品
                </div>
                <v-pagination
                  v-model="page"
                  :length="pageCount"
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
            </div>
          </template>
        </v-data-table>
        <v-divider />
        <div class="body-1 mt-4">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">出库仓库：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ outstockOrder.warehouseName }}</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">出库类型：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ outstockOrder.outTypeName }}</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">出库日期：</span>
            </div>
            <div class="input-group-append">
              <span
                v-if="outstockOrder.deliveryTime"
                class="input-group-text black--text"
              >{{ outstockOrder.deliveryTime | dateTruncate(10) }}</span>
              <span
                v-else
                class="grey--text"
              >无</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">备注：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ outstockOrder.memo ? outstockOrder.memo : '无' }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-btn
      v-if="outstockOrder.dStatus === '0'"
      :loading="operating"
      color="primary"
      large
      class="px-12 body-1 ml-4"
      @click="dialog = true;operate = 'check';operateText='审核';"
    >
      审核
    </v-btn>
    <v-btn
      v-if="outstockOrder.dStatus === '0'"
      color="secondary"
      large
      class="px-12 body-1 ml-4"
      :to="{ name: 'warehouse_outstock_list_edit', params: { id: outstockOrder.id }}"
    >
      编辑
    </v-btn>
    <v-btn
      v-if="outstockOrder.dStatus === '0'"
      color="grey"
      large
      class="px-12 body-1 ml-4 white--text"
      @click="dialog = true; operate = 'delete';operateText='删除'; "
    >
      删除
    </v-btn>
    <v-btn
      v-if="outstockOrder.dStatus === '1'"
      color="grey"
      large
      class="px-12 body-1 ml-4 white--text"
      @click="dialog = true;operate = 'nullify';operateText='作废';"
    >
      作废
    </v-btn>
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
            @click="operateOutstockOrder"
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
  </v-form>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';

export default {
  name: 'WarehouseOutstockDetail',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialog: false,
      valid: true,
      outstockOrder: null,
      headers: [
        {
          text: '图片',
          value: 'image',
          align: 'center',
          sortable: false,
          width: '90px',
        },
        {
          text: '商品名称',
          value: 'goodName',
          align: 'center',
          sortable: false,
          width: '300px',
        },
        {
          text: '货号',
          value: 'goodNo',
          align: 'center',
          sortable: false,
        },
        {
          text: '商品规格',
          value: 'goodDetailName',
          align: 'center',
          sortable: false,
        },
        // {
        //   text: '库存数量',
        //   value: 'stockNumber',
        //   align: 'center',
        //   sortable: false,
        // },
        {
          text: '出库数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '150px',
        },
        {
          text: '出库价格',
          value: 'price',
          align: 'center',
          sortable: false,
          width: '150px',
        },
      ],
      page: 1,
      pageEnter: 1,
      pageCount: 0,
      operate: '',
      operateText: '',
      operating: false,
    };
  },
  computed: {
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
        text: '出库列表',
        disabled: false,
        to: { name: 'warehouse_outstock_list' },
        exact: true,
      },
      {
        text: '出库单详情',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllData();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseOutstockDetailAsync', 'deleteWarehouseOutstockAsync', 'checkWarehouseOutstockAsync', 'nullifyWarehouseOutstockAsync']),
    ...mapActions('order', ['getProductListForSelectAsync']),
    getAllData() {
      this.$store.commit('START_LOADING');
      this.getWarehouseOutstockDetailAsync({ id: this.id }).then((res) => {
        this.outstockOrder = res;
      }).catch((err) => {
        this.checkErr(err, 'getAllData');
      }).finally(() => {
        this.$store.commit('END_LOADING');
      });
    },
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
      } else {
        this.pageEnter = 1;
      }
    },
    operateOutstockOrder() {
      if (this.operate === 'delete') {
        this.deleteWarehouseOutstock();
      } else if (this.operate === 'check') {
        this.checkWarehouseOutstock();
      } else {
        this.nullifyWarehouseOutstock();
      }
    },
    // 删除出库单
    deleteWarehouseOutstock() {
      this.operating = true;
      this.deleteWarehouseOutstockAsync({ id: this.outstockOrder.id, reload: true })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.$router.replace({ name: 'warehouse_outstock_list' });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 作废出库单
    nullifyWarehouseOutstock() {
      this.operating = true;
      this.nullifyWarehouseOutstockAsync({ id: this.outstockOrder.id })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废成功!',
          });
          this.getAllData();
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 审核出库单
    checkWarehouseOutstock() {
      this.operating = true;
      this.checkWarehouseOutstockAsync({ id: this.outstockOrder.id })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，审核成功!',
          });
          this.getAllData();
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
