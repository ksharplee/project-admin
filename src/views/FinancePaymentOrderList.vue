<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      收款单列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{ name: 'finance_payment_add'}"
      >
        <v-icon left>
          mdi-plus
        </v-icon>新增收款单
      </v-btn>
    </div>

    <v-form ref="form">
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">客户名称</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.buyerName"
                placeholder="请输入客户名称"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions('buyerName')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="8"
          lg="6"
          xl="4"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">日期</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="search.beginDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.beginDate"
                    class="white rounded-right-0"
                    placeholder="请选择上架时间"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                    @click:clear="clearSearchConditions('beginDate')"
                  />
                </template>
                <v-date-picker
                  v-model="search.beginDate"
                  color="primary"
                  scrollable
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuStart = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuStart.save(search.beginDate)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="input-group-innerpend">
              <span class="input-group-text">到</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuEnd"
                v-model="menuEnd"
                :close-on-content-click="false"
                :return-value.sync="search.endDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.endDate"
                    class="white rounded-left-0"
                    placeholder="请选择下架时间"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                    @click:clear="clearSearchConditions('endDate')"
                  />
                </template>
                <v-date-picker
                  v-model="search.endDate"
                  :min="search.startDate"
                  color="primary"
                  scrollable
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuEnd = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuEnd.save(search.endDate)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchPaymentOrderList"
          >
            搜索
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="resetSearchConditions"
          >
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="paymentOrderList.data.items"
        class="text-center"
        item-key="id"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:item.dStatus="{ item }">
          <div :class="item.dStatus | paymentOrderStatusClass">
            {{ item.dStatus | paymentOrderStatusText }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                v-on="on"
                @click="getPaymentOrderDetail(item.id)"
              >
                <v-icon color="primary">
                  mdi-file-document-box-search
                </v-icon>
              </v-btn>
            </template>
            <span>详情</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '2'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogConfirm = true;toConfirmOrder = item.id"
              >
                <v-icon color="amber">
                  mdi-check-decagram
                </v-icon>
              </v-btn>
            </template>
            <span>审核</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '2'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogReject = true;toRejectOrder = item.id"
              >
                <v-icon color="secondary">
                  mdi-minus-circle
                </v-icon>
              </v-btn>
            </template>
            <span>驳回</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="item.dStatus !== '3'"
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
            <span>作废</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <v-divider />
          <div
            v-if="paymentOrderList.status && paymentOrderList.data.items.length"
            class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
          >
            <div class="mr-2">
              共<span class="error--text">{{ paymentOrderList.data.totalItem }}</span>收款单
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
    </v-card>
    <v-dialog
      v-model="dialogNullify"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认作废此收款单吗?
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
      v-model="dialogConfirm"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定审核通过此收款单吗?
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
      v-model="dialogReject"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定驳回此收款单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="rejecting"
            :disabled="rejecting"
            @click="rejectOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogReject = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDetail"
      max-width="750"
    >
      <v-card :loading="loadingPaymentDetail">
        <v-card-title class="title grey lighten-3 pa-4">
          收款单详情
        </v-card-title>
        <v-container fluid>
          <v-card outlined>
            <v-simple-table class="text-center">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">
                      订单号
                    </th>
                    <th class="text-center">
                      核销金额
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in dialogDetailItem.detail"
                    :key="item.id"
                  >
                    <td>{{ item.orderNo }}</td>
                    <td>{{ item.amount }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-container>
        <v-card-actions class="grey lighten-4">
          <div class="flex-grow-1" />
          <v-btn
            color="secondary"
            @click="dialogDetail = false"
          >
            关闭
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
  name: 'FinancePaymentOrderList',
  data() {
    return {
      loadingDataItems: false,
      search: {},
      menuStart: false,
      menuEnd: false,
      loadingPaymentDetail: false,
      dialogDetail: false,
      dialogDetailItem: {},
      dialogNullify: false,
      nullifying: false,
      toNullifyOrder: '',
      dialogConfirm: false,
      confirming: false,
      toConfirmOrder: '',
      dialogReject: false,
      rejecting: false,
      toRejectOrder: '',
      headers: [
        {
          text: '收款单号',
          align: 'center',
          sortable: false,
          value: 'receiptNo',
        },
        {
          text: '收款金额（元）',
          value: 'actualAmount',
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
          text: '开票人',
          value: 'createUserName',
          align: 'center',
          sortable: false,
        },
        {
          text: '状态',
          value: 'dStatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '日期',
          value: 'receiptTime',
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
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('finance', ['paymentOrderList']),
    page: {
      set(value) {
        this.paymentOrderList.data.p = value;
      },
      get() {
        return +this.paymentOrderList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.paymentOrderList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.paymentOrderList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '收款单列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getPaymentOrderList();
  },
  methods: {
    ...mapActions('finance', [
      'getPaymentOrderListAsync',
      'rejectPaymentOrderAsync',
      'getPaymentOrderDetailAsync',
    ]),
    ...mapActions('order', [
      'nullifyPaymentOrderAsync',
      'confirmPaymentOrderAsync',
    ]),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getPaymentOrderList();
      } else {
        this.pageEnter = 1;
      }
    },
    getPaymentOrderDetail(id) {
      this.dialogDetail = true;
      this.loadingPaymentDetail = true;
      this.getPaymentOrderDetailAsync({ id })
        .then((res) => {
          this.dialogDetailItem = res;
        })
        .catch(err => this.checkErr(err, 'getPaymentOrderDetail'))
        .finally(() => {
          this.loadingPaymentDetail = false;
        });
    },
    getPaymentOrderList() {
      this.loadingDataItems = true;
      this.getPaymentOrderListAsync(this.search)
        .catch(err => this.checkErr(err, 'getPaymentOrderList'))
        .finally(() => {
          this.loadingDataItems = false;
          this.$store.commit('END_LOADING');
        });
    },
    searchPaymentOrderList() {
      this.getPaymentOrderList();
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.getPaymentOrderList();
    },
    resetSearchConditions() {
      this.$refs.form.reset();
      this.getPaymentOrderList();
    },
    changePagination() {
      this.getPaymentOrderList();
    },
    // 作废收款单
    nullifyOrder() {
      this.nullifying = true;
      this.nullifyPaymentOrderAsync({
        id: this.toNullifyOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废收款单成功!',
          });
          this.getPaymentOrderList();
          this.$emit('update:refresh');
        })
        .catch((err) => {
          this.checkErr(err, 'nullifyOrder');
        })
        .finally(() => {
          this.nullifying = false;
          this.dialogNullify = false;
        });
    },
    // 审核收款单
    confirmOrder() {
      this.confirming = true;
      this.confirmPaymentOrderAsync({
        id: this.toConfirmOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，确认收款单成功!',
          });
          this.getPaymentOrderList();
          this.$emit('update:refresh');
        })
        .catch((err) => {
          this.checkErr(err, 'confirmOrder');
        })
        .finally(() => {
          this.confirming = false;
          this.dialogConfirm = false;
        });
    },
    // 驳回收款单
    rejectOrder() {
      this.rejecting = true;
      this.rejectPaymentOrderAsync({
        id: this.toRejectOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，确认收款单成功!',
          });
          this.getPaymentOrderList();
          this.$emit('update:refresh');
        })
        .catch((err) => {
          this.checkErr(err, 'rejectOrder');
        })
        .finally(() => {
          this.rejecting = false;
          this.dialogReject = false;
        });
    },
  },
};
</script>
