<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      新增收款单
    </div>
    <v-divider class="my-4" />
    <v-form>
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
              <v-select
                v-model="search.buyerId"
                :items="customerFilter(searchCustomer)"
                placeholder="请选择客户"
                class="white"
                item-text="dnames"
                item-value="buyerId"
                single-line
                dense
                outlined
                clearable
                no-data-text="暂无数据"
                hide-details
                @click:clear="clearSearchConditions('buyerId')"
                @change="setGlobalCustomer"
              >
                <template v-slot:prepend-item>
                  <v-form>
                    <div class="pa-3">
                      <v-text-field
                        v-model="searchCustomer"
                        placeholder="输入客户名称搜索"
                        append-icon="mdi-magnify"
                        dense
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                      />
                    </div>
                  </v-form>
                </template>
              </v-select>
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
              <span class="input-group-text">上架时间</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="search.startShelfTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.startShelfTime"
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
                    @click:clear="clearSearchConditions('startShelfTime')"
                  />
                </template>
                <v-date-picker
                  v-model="search.startShelfTime"
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
                    @click="$refs.menuStart.save(search.startShelfTime)"
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
                :return-value.sync="search.endShelfTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.endShelfTime"
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
                    @click:clear="clearSearchConditions('endShelfTime')"
                  />
                </template>
                <v-date-picker
                  v-model="search.endShelfTime"
                  :min="search.startShelfTime"
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
                    @click="$refs.menuEnd.save(search.endShelfTime)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">订单号</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.orderNo"
                placeholder="请输入订单号"
                outlined
                single-line
                clearable
                class="white"
                hide-details
                dense
                @click:clear="clearSearchConditions('orderNo')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">商品名</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.goodName"
                placeholder="请输入商品名"
                outlined
                single-line
                clearable
                class="white"
                hide-details
                dense
                @click:clear="clearSearchConditions('goodName')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">付款状态</span>
            </div>
            <div class="input-group-control">
              <v-select
                v-model="search.operate"
                :items="operates"
                class="white"
                single-line
                dense
                outlined
                no-data-text="暂无数据"
                hide-details
              />
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            :disabled="!search.buyerId && !search.orderNo"
            color="primary"
            depressed
            @click="getOrderListBySearch"
          >
            搜索
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            class="ml-2"
            @click="resetSearchConditions"
          >
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4">
      <v-card-text class="py-2 d-flex align-center">
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          :to="{ name: 'product_add' }"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-exit-to-app
            </v-icon> 导出Excel
          </div>
        </v-btn>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="orderList"
        :loading="loadingDataItems"
        loading-text="加载中，请稍候..."
        class="text-center elevation-1"
        no-data-text="暂无数据"
        hide-default-footer
        :items-per-page="20"
      >
        <template v-slot:top>
          <v-divider />
          <v-form
            ref="form"
            v-model="valid"
            class="pa-3 grey lighten-4"
          >
            <h4 class="text-left py-3 error--text">
              请选择客户或输入订单号搜索未完成收款订单
            </h4>
            <v-row>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">收款日期</span>
                  </div>
                  <div class="input-group-control">
                    <v-menu
                      ref="menuDate"
                      v-model="menuDate"
                      :close-on-content-click="false"
                      :return-value.sync="payment.receiptTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="payment.receiptTime"
                          :disabled="!orderList.length"
                          class="white rounded-right-0"
                          placeholder="请选择上架时间"
                          outlined
                          single-line
                          dense
                          hide-details
                          append-icon="mdi-calendar-import"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="payment.receiptTime"
                        color="primary"
                        scrollable
                      >
                        <div class="flex-grow-1" />
                        <v-btn
                          text
                          color="primary"
                          @click="menuDate = false"
                        >
                          取消
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menuDate.save(payment.receiptTime)"
                        >
                          确定
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">收款账户</span>
                  </div>
                  <div class="input-group-control">
                    <v-select
                      v-model="payment.paymentId"
                      :items="paymentList.data"
                      :loading="loadingPaymentList"
                      :rules="accountRules"
                      :disabled="!orderList.length"
                      placeholder="请选择收款账户"
                      item-value="id"
                      item-text="dnames"
                      class="white"
                      clearable
                      outlined
                      dense
                      single-line
                      hide-details
                      no-data-text="暂无数据"
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">收款金额</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="payment.amount"
                      :rules="amountRules"
                      :disabled="!orderList.length"
                      placeholder="请输入收款金额"
                      outlined
                      single-line
                      clearable
                      class="white"
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">优惠金额</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="payment.freeAmount"
                      :disabled="!orderList.length"
                      placeholder="请输入优惠金额"
                      outlined
                      single-line
                      clearable
                      class="white"
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">核销金额</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      :value="checkAmount"
                      disabled
                      placeholder="请输入优惠金额"
                      outlined
                      single-line
                      class="white"
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
                lg="3"
                xl="2"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">附件</span>
                  </div>
                  <div class="input-group-control">
                    <v-file-input
                      ref="uploader"
                      :label="payment.annex"
                      :loading="loadingAttachment"
                      :disabled="!orderList.length"
                      class="white"
                      outlined
                      hide-details
                      dense
                      placeholder="请选择附件"
                      prepend-icon=""
                      append-icon="mdi-paperclip"
                      clearable
                      @change="getAttachmentUrl"
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
                    <span class="input-group-text">备注</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="payment.memo"
                      :disabled="!orderList.length"
                      placeholder="请输入付款单备注"
                      outlined
                      single-line
                      clearable
                      class="white"
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                align-self="center"
                cols="auto"
              >
                <v-btn
                  :disabled="!orderList.length"
                  color="secondary"
                  depressed
                  class="mr-2"
                  @click="checkBySequence"
                >
                  顺序分摊
                </v-btn>
                <v-btn
                  :disabled="!orderList.length"
                  color="secondary"
                  depressed
                  class="mr-2"
                  @click="checkByEvery"
                >
                  全部分摊
                </v-btn>
                <v-btn
                  :loading="adding"
                  :disabled="!valid || adding"
                  color="primary"
                  depressed
                  @click="addPaymentOrder"
                >
                  新增收款单
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-divider />
        </template>
        <template v-slot:item.check="{ item }">
          <v-text-field
            v-model="item.check"
            placeholder="请输入本次核销金额"
            outlined
            single-line
            clearable
            class="white my-3"
            hide-details
            dense
          />
        </template>
        <template v-slot:item.action="{ item }">
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
        </template>
        <template v-slot:item.receivedAmount="{ item }">
          <div class="error--text">
            {{ item.receivedAmount }}
          </div>
        </template>
        <template v-slot:item.unreceivedAmount="{ item }">
          <div class="error--text">
            {{ item.unreceivedAmount | toFixed }}
          </div>
        </template>
        <template v-slot:item.amontStatus="{ item }">
          <div class="error--text">
            {{ item.amontStatus | paymentStatus }}
          </div>
        </template>
        <template v-slot:item.actualAmount="{ item }">
          <div class="error--text">
            {{ item.actualAmount }}
          </div>
        </template>
        <template v-slot:body.append="{ headers }">
          <tr v-if="orderList.length">
            <td>合计</td>
            <td />
            <td />
            <td>{{ totalProductAmount | toFixed }}</td>
            <td>{{ totalFreightAmount | toFixed }}</td>
            <td>{{ totalFreeAmount | toFixed }}</td>
            <td class="error--text">
              {{ totalActualAmount | toFixed }}
            </td>
            <td />
            <td class="error--text">
              {{ totalReceivedAmount | toFixed }}
            </td>
            <td class="error--text">
              {{ totalUnreceivedAmount | toFixed }}
            </td>
            <td class="error--text">
              {{ checkAmountSet | toFixed }}
            </td>
            <td />
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'FinancePaymentConfirmMultiple',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      search: {
        operate: '3',
        buyerId: '',
      },
      valid: true,
      expanded: [],
      loadingDataItems: false,
      loadingPaymentList: false,
      loadingAttachment: false,
      adding: false,
      menuDate: false,
      menuStart: false,
      menuEnd: false,
      accountRules: [v => !!v || '请选择收款账户'],
      amountRules: [v => !!v || '请输入收款金额'],
      searchCustomer: '',
      orderList: [],
      payment: {
        receiptTime: new Date().toISOString().substr(0, 10),
        freeAmount: 0,
        amount: 0,
        annex: '',
        paymentId: '',
        memo: '',
      },
      operates: [
        {
          text: '全部',
          value: '3',
        },
        {
          text: '未付款',
          value: '8',
        },
        {
          text: '部分付款',
          value: '9',
        },
      ],
      headers: [
        {
          text: '订单日期',
          value: 'createTime',
          align: 'center',
          sortable: false,
        },
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
          text: '货品金额',
          value: 'amount',
          align: 'center',
          sortable: false,
        },
        {
          text: '运费金额',
          value: 'freight',
          align: 'center',
          sortable: false,
        },
        {
          text: '折扣金额',
          value: 'freeAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '成交金额',
          value: 'actualAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '收款状态',
          value: 'amontStatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '已收金额',
          value: 'receivedAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '未收金额',
          value: 'unreceivedAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '本次核销',
          value: 'check',
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
      totalReceivedAmount: '',
      totalActualAmount: '',
      totalFreeAmount: '',
      totalFreightAmount: '',
      totalProductAmount: '',
      totalUnreceivedAmount: '',
    };
  },
  computed: {
    ...mapState('customer', ['customerListForSelect']),
    ...mapGetters('customer', ['customerFilter']),
    ...mapState('finance', ['paymentList']),
    selectedCustomer() {
      return R.find(
        R.propEq('buyerId', this.search.buyerId),
        this.customerListForSelect.data
      );
    },
    // 表格核销金额
    checkAmountSet() {
      return R.reduce(R.add, 0, R.pluck('check', this.orderList));
    },
    // 核销金额
    checkAmount() {
      return +this.payment.amount + +this.payment.freeAmount;
    },
    params() {
      return R.mergeRight(this.payment, {
        buyerId: this.selectedCustomer
          ? this.selectedCustomer.buyerId
          : this.orderList[0].buyerId,
        buyerUid: this.selectedCustomer
          ? this.selectedCustomer.buyerUid
          : this.orderList[0].buyerUid,
        detail: R.map(
          item => ({
            orderId: item.id,
            amount: item.check,
          }),
          R.filter(item => item.check && item.check !== '0', this.orderList)
        ),
      });
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
        text: '新增收款单',
        disabled: true,
        exact: true,
      },
    ]);
    this.getCustomerListForSelect();
    // if (!this.paymentList.stauts) {
    this.getPaymentList();
    // }
  },
  methods: {
    ...mapActions('customer', ['getCustomerListForSelectAsync']),
    ...mapActions('order', [
      'getOrderListForPaymentAsync',
      'addPaymentOrderAsync',
      'confirmPaymentOrderAsync',
    ]),
    ...mapActions(['uploadAttachmentSync']),
    ...mapActions('finance', ['getPaymentListAsync']),
    addPaymentOrder() {
      if (!this.params.detail.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请设置核销金额',
        });
        return;
      }
      this.adding = true;
      this.addPaymentOrderAsync(this.params)
        .then((res) => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.confirmPaymentOrderAsync({ id: res })
            .then(() => {
              this.getOrderList();
              this.$router.replace({
                name: 'finance_payment_order_list',
              });
            })
            .catch((err) => {
              this.check(err, 'confirmPaymentOrderAsync');
            })
            .finally(() => {
              this.adding = false;
            });
        })
        .catch((err) => {
          this.checkErr(err, 'addPaymentOrder');
          this.adding = false;
        });
    },
    checkByEvery() {
      this.orderList = R.map((item) => {
        item.check = (+this.checkAmount * item.percentage).toFixed(2);
        return item;
      }, this.orderList);
    },
    checkBySequence() {
      let checkAmount = +this.checkAmount.toFixed(2);
      this.orderList = R.map((item) => {
        if (checkAmount >= item.unreceivedAmount) {
          item.check = item.unreceivedAmount.toFixed(2);
        } else {
          item.check = checkAmount.toFixed(2);
        }
        checkAmount -= +item.check;
        return item;
      }, this.orderList);
    },
    getPaymentList() {
      this.loadingPaymentList = true;
      this.getPaymentListAsync()
        .catch(err => this.checkErr(err))
        .finally(() => {
          this.loadingPaymentList = false;
        });
    },
    getAttachmentUrl(file) {
      this.loadingAttachment = true;
      const dataPost = new FormData();
      dataPost.append('file', file);
      this.uploadAttachmentSync(dataPost)
        .then((res) => {
          this.payment.annex = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingAttachment = false;
        });
    },
    getOrderListBySearch() {
      this.getOrderList();
    },
    reduceToTotal(target, arr) {
      return R.reduce(R.add, 0, R.pluck(target, arr));
    },
    getOrderList(params) {
      if (!this.search.buyerId && !this.search.orderNo) {
        this.orderList = [];
        return;
      }
      this.loadingDataItems = true;
      this.getOrderListForPaymentAsync(
        R.mergeRight(
          {
            sortType: '2',
            ...this.search,
          },
          params
        )
      )
        .then((res) => {
          this.totalReceivedAmount = this.reduceToTotal(
            'receivedAmount',
            res.items
          );
          this.totalActualAmount = this.reduceToTotal(
            'actualAmount',
            res.items
          );
          this.totalFreeAmount = this.reduceToTotal('freeAmount', res.items);
          this.totalFreightAmount = this.reduceToTotal('freight', res.items);
          this.totalProductAmount = this.reduceToTotal('amount', res.items);
          this.totalActualAmount = this.reduceToTotal(
            'actualAmount',
            res.items
          );
          this.totalUnreceivedAmount = R.reduce(
            R.add,
            0,
            R.map(
              item => R.subtract(item.actualAmount, item.receivedAmount),
              res.items
            )
          );
          res.items = R.map(
            item => R.mergeRight(
                {
                  check: '',
                  unreceivedAmount: R.subtract(
                    item.actualAmount,
                    item.receivedAmount
                  ),
                },
                item
              ),
            res.items
          );
          res.items = R.map(
            item => R.mergeRight(item, {
                percentage: R.divide(
                  item.unreceivedAmount,
                  this.totalUnreceivedAmount
                ),
              }),
            res.items
          );
          this.orderList = res.items;
        })
        .catch(err => this.checkErr(err, 'getOrderList'))
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    setGlobalCustomer(v) {
      this.$store.commit('SET_GLOBAL_CUSTOMER', v);
    },
    getCustomerListForSelect() {
      this.$store.commit('START_LOADING');
      this.getCustomerListForSelectAsync()
        .then(() => {
          if (this.$store.state.customerId) {
            this.search.buyerId = this.$store.state.customerId;
            this.getOrderList();
          }
        })
        .catch(err => this.checkErr(err, 'getCustomerListForSelect'))
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.getOrderList();
    },
    resetSearchConditions() {
      this.search = {
        operate: '3',
      };
      this.orderList = [];
    },
    changePagination() {
      this.getOrderList();
    },
  },
};
</script>
