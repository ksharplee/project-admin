<template>
  <div>
    <div class="pa-3">
      <v-menu
        offset-y
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            dark
            class="ml-auto"
            depressed
            v-on="on"
          >
            {{ sortType.text }}
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(type, i) in sortTypes"
            :key="i"
            @click="setSortType(type)"
          >
            <v-list-item-title>{{ type.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-data-table
      :headers="headers"
      :items="orderList.data.items"
      :loading="loadingDataItems"
      loading-text="加载中，请稍候..."
      class="text-center elevation-1"
      no-data-text="暂无数据"
      hide-default-footer
      :items-per-page="20"
    >
      <template v-slot:item.shipping="{ item }">
        {{ item.dStatus | shippingStatus }}
      </template>
      <template v-slot:item.amontStatus="{ item }">
        <div :class="item.amontStatus | paymentStatusClass">
          {{ item.amontStatus | paymentStatus }}
        </div>
      </template>
      <template v-slot:item.dStatus="{ item }">
        <div :class="item.dStatus | OrderStatusClass">
          {{ item.dStatus | orderStatus }}
        </div>
      </template>
      <template v-slot:item.actualAmount="{ item }">
        <div class="py-3">
          <div class="mb-1">
            {{ item.actualAmount }}
          </div>
          <div class="body-2 grey--text">
            (含运费：{{ item.freight }} 税费：{{ item.invoiceAmount }})
          </div>
        </div>
      </template>
      <template v-slot:item.orderType="{ item }">
        <v-chip small>
          {{ item.orderType | orderType }}
        </v-chip>
      </template>
      <template v-slot:footer>
        <div
          v-if="orderList.status && orderList.data.items.length"
          class="pa-4 grey lighten-5"
        >
          <div
            v-if="orderList.status && orderList.data.items.length"
            class="pa-4 grey lighten-5 d-flex align-center text-no-wrap"
          >
            <span>当前共有订单：<span class="error--text">{{ orderList.data.totalItem }}</span></span>
            <v-pagination
              v-model="page"
              :length="pageCount"
              @input="changePagination"
            />
          </div>
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="text-left">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{ name: 'order_detail', params: { id: item.id, currentTab: '0' }}"
                v-on="on"
              >
                <v-icon color="primary">
                  mdi-file-document-box-search
                </v-icon>
              </v-btn>
            </template>
            <span>订单详情</span>
          </v-tooltip>
          <!-- 已提交订单可以确认或取消 -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '1'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogConfirm = true;toConfirmOrder = item.id"
              >
                <v-icon color="pink lighten-2">
                  mdi-clipboard-check
                </v-icon>
              </v-btn>
            </template>
            <span>订单确认</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '1'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogCancel = true;toCancelOrder = item.id"
              >
                <v-icon color="secondary">
                  mdi-file-cancel
                </v-icon>
              </v-btn>
            </template>
            <span>取消订单</span>
          </v-tooltip>
          <!-- 已确认，未完成，并且未作废的订单可以添加收款记录 -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!(item.dStatus === '4' || item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9' || item.dStatus === '10')"
                icon
                class="mx-1"
                :to="{ name: 'order_detail', params: { id: item.id, currentTab: '2' }}"
                v-on="on"
              >
                <v-icon color="warning lighten-1">
                  mdi-credit-card
                </v-icon>
              </v-btn>
            </template>
            <span>添加收款记录</span>
          </v-tooltip>
          <!-- 已确认订单可财务审核，但只有付款状态为未付款的才可作废订单 -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.amontStatus !== '0' || !(item.dStatus === '4' || item.dStatus === '5')"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogNullify = true;toNullifyOrder = item.id"
              >
                <v-icon color="error lighten-2">
                  mdi-close-circle
                </v-icon>
              </v-btn>
            </template>
            <span>订单作废</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '4'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogFinacialCheck = true;toFinacialCheckOrder = item.id"
              >
                <v-icon color="amber">
                  mdi-check-decagram
                </v-icon>
              </v-btn>
            </template>
            <span>财务审核</span>
          </v-tooltip>
          <!-- 已通过财务审核的订单可进行发货操作 -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!(item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9')"
                icon
                class="mx-1"
                :to="{ name: 'order_detail', params: { id: item.id, currentTab: '1' }}"
                v-on="on"
              >
                <v-icon color="cyan">
                  mdi-truck
                </v-icon>
              </v-btn>
            </template>
            <span>订单发货</span>
          </v-tooltip>
          <!-- 已确认收货或者完成发货并且完成收款的订单可以进行完成订单操作 -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.amontStatus !== '3' || !(item.dStatus === '8' || item.dStatus === '9')"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogComplete = true;toCompleteOrder = item.id"
              >
                <v-icon color="success">
                  mdi-file-check
                </v-icon>
              </v-btn>
            </template>
            <span>完成订单</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialogCancel"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定取消此订单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="canceling"
            :disabled="canceling"
            @click="cancelOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogCancel = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogConfirm"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定确认此订单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="confirming"
            :disabled="confirming"
            @click="confirmOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogConfirm = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogFinacialCheck"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          此订单确认通过财务审核吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="finacialChecking"
            :disabled="finacialChecking"
            @click="finacialCheckOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogFinacialCheck = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogNullify"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认作废此订单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="nullifying"
            :disabled="nullifying"
            @click="nullifyOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogNullify = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogComplete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认完成此订单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="completing"
            :disabled="completing"
            @click="completeOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogComplete = false"
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
  name: 'OrderListComponent',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Object,
      default: () => {},
    },
    confirmSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialogCancel: false,
      canceling: false,
      toCancelOrder: '',
      dialogConfirm: false,
      confirming: false,
      toConfirmOrder: '',
      dialogFinacialCheck: false,
      finacialChecking: false,
      toFinacialCheckOrder: '',
      dialogNullify: false,
      nullifying: false,
      toNullifyOrder: '',
      dialogComplete: false,
      completing: false,
      toCompleteOrder: '',
      // 1:下单时间升序 2:下单时间降序 3:订单金额升序 4:订单金额降序 5:订单状态升序 6:订单状态降序
      sortTypes: [
        { text: '按下单时间降序', value: '2' },
        { text: '按下单时间升序', value: '1' },
        { text: '按订单金额降序', value: '4' },
        { text: '按订单金额升序', value: '3' },
        { text: '按订单状态降序', value: '6' },
        { text: '按订单状态升序', value: '5' },
      ],
      sortType: { text: '按下单时间降序', value: '2' },
      headers: [
        {
          text: '订单号',
          value: 'orderNo',
          align: 'center',
          sortable: false,
        },
        {
          text: '客户名称',
          value: 'buyerName',
          align: 'center',
          sortable: false,
        },
        {
          text: '订单金额',
          value: 'actualAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '发货状态',
          value: 'shipping',
          align: 'center',
          sortable: false,
        },
        {
          text: '订单来源',
          value: 'orderType',
          align: 'center',
          sortable: false,
        },
        {
          text: '订单状态',
          value: 'dStatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '付款状态',
          value: 'amontStatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '下单时间',
          value: 'createTime',
          align: 'center',
          sortable: false,
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('order', ['orderList']),
    page: {
      set(value) {
        this.orderList.data.p = value;
      },
      get() {
        return +this.orderList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.orderList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.orderList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
      );
    },
  },
  watch: {
    loading() {
      if (this.loading) {
        this.getOrderList();
      }
    },
    confirmSearch() {
      this.getOrderList({});
    },
  },
  created() {
    this.getOrderList();
  },
  methods: {
    ...mapActions('order', [
      'getOrderListAsync',
      'cancelOrderAsync',
      'confirmOrderAsync',
      'finacialCheckOrderAsync',
      'nullifyOrderAsync',
      'completeOrderAsync',
    ]),
    getOrderList(params) {
      this.loadingDataItems = true;
      this.getOrderListAsync(
        R.mergeRight(
          {
            sortType: this.sortType.value,
            operate: this.index + 1,
            ...this.search,
          },
          params
        )
      )
        .catch((err) => {
          this.checkErr(err, 'getOrderList');
        })
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    changePagination() {
      this.getOrderList();
    },
    setSortType(v) {
      this.sortType = v;
      this.getOrderList();
    },
    // 取消订单
    cancelOrder() {
      this.canceling = true;
      this.cancelOrderAsync({
        id: this.toCancelOrder,
        sortType: this.sortType.value,
        operate: this.index + 1,
        ...this.search,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，取消订单成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'cancelOrder');
        })
        .finally(() => {
          this.canceling = false;
          this.dialogCancel = false;
        });
    },
    // 确认订单
    confirmOrder() {
      this.confirming = true;
      this.confirmOrderAsync({
        id: this.toConfirmOrder,
        sortType: this.sortType.value,
        operate: this.index + 1,
        ...this.search,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，确认订单成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'confirmOrder');
        })
        .finally(() => {
          this.confirming = false;
          this.dialogConfirm = false;
        });
    },
    // 财务审核订单
    finacialCheckOrder() {
      this.finacialChecking = true;
      this.finacialCheckOrderAsync({
        id: this.toFinacialCheckOrder,
        sortType: this.sortType.value,
        operate: this.index + 1,
        ...this.search,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，财务审核订单成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'finacialCheckOrder');
        })
        .finally(() => {
          this.finacialChecking = false;
          this.dialogFinacialCheck = false;
        });
    },
    // 作废订单
    nullifyOrder() {
      this.nullifying = true;
      this.nullifyOrderAsync({
        id: this.toNullifyOrder,
        sortType: this.sortType.value,
        operate: this.index + 1,
        ...this.search,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废订单成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'nullifyOrder');
        })
        .finally(() => {
          this.nullifying = false;
          this.dialogNullify = false;
        });
    },
    // 完成订单
    completeOrder() {
      this.completing = true;
      this.completeOrderAsync({
        id: this.toCompleteOrder,
        sortType: this.sortType.value,
        operate: this.index + 1,
        ...this.search,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，订单已完成!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'completeOrder');
        })
        .finally(() => {
          this.completing = false;
          this.dialogComplete = false;
        });
    },
  },
};
</script>
