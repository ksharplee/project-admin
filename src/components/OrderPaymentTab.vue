<template>
  <div class="pa-4">
    <v-card>
      <v-alert
        color="primary"
        dark
        dense
        tile
        text
        class="body-1"
      >
        <v-container
          fluid
        >
          <v-row no-gutters>
            <v-col cols="12">
              订单号：{{ order.orderNo }}<span class="ml-4">客户名称：</span>{{ order.buyerName }}
            </v-col>
            <v-col cols="12">
              <v-divider
                class="my-4"
                style="background-color: #dedede"
              />
            </v-col>
            <v-col
              cols="12"
              class="headline warning--text mb-2"
            >
              待支付：{{ +order.actualAmount - +order.receivedAmount | toFixed }} 元
            </v-col>
            <v-col cols="12">
              <span>订单金额：</span>{{ order.amount }}<span class="ml-4">应付金额：</span>{{ order.actualAmount }} <span class="ml-4">免收金额：</span>{{ order.freeAmount }} <span class="ml-4">已付款：</span>{{ order.receivedAmount }} <span class="ml-4">运费：</span>{{ order.freight }}
            </v-col>
          </v-row>
        </v-container>
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="paymentOrderList"
        :loading="loadingDatItems"
        class="text-center"
        loading-text="加载中..."
        item-key="id"
        no-data-text="暂无付款记录"
        hide-default-footer
        :items-per-page="20"
      >
        <template v-slot:item.amount="{ item }">
          <div class="error--text">
            {{ item.amount }}
          </div>
        </template>
        <template v-slot:item.actualAmount="{ item }">
          <div class="error--text">
            {{ item.actualAmount }}
          </div>
        </template>
        <template v-slot:item.dStatus="{ item }">
          <div :class="item.dStatus | paymentOrderStatusClass">
            {{ item.dStatus | paymentOrderStatusText }}
          </div>
        </template>
        <template v-slot:item.receiptTime="{ item }">
          {{ item.receiptTime | dateTruncate(16) }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                v-on="on"
                @click="dialogDetailItem = item; dialogDetail = true;"
              >
                <v-icon color="primary">
                  mdi-file-document-box-search
                </v-icon>
              </v-btn>
            </template>
            <span>详情</span>
          </v-tooltip>
          <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mx-1"
                    :disabled="item.dStatus !== '0'"
                    v-on="on"
                    @click="openDialogEdit(item)"
                  >
                    <v-icon color="teal">
                      mdi-pencil-circle
                    </v-icon>
                  </v-btn>
                </template>
                <span>编辑</span>
              </v-tooltip> -->
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
      </v-data-table>
    </v-card>
    <v-divider />
    <div
      class="py-4"
    >
      <v-btn
        v-if="order.receivedAmount !== order.actualAmount && (order.dStatus === '4' || order.dStatus === '5' || order.dStatus === '7' || order.dStatus === '8' || order.dStatus === '9' || order.dStatus === '10')"
        color="primary"
        large
        class="px-12 body-1 mr-4"
        @click="openDialogAdd"
      >
        添加收款记录
      </v-btn>
    </div>
    <!-- <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认删除此收款单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogDelete = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
      v-model="dialogDetail"
      max-width="750"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          收款记录详情
        </v-card-title>
        <v-container
          fluid
          class="px-4"
        >
          <v-row class="mb-3">
            <v-col cols="6">
              <span class="grey--text">支付流水号：</span> {{ dialogDetailItem.orderNo }}
            </v-col>
            <v-col cols="6">
              <span class="grey--text">状态：</span> <span :class="dialogDetailItem.dStatus | paymentOrderStatusClass">{{ dialogDetailItem.dStatus | paymentOrderStatusText }}</span>
            </v-col>
            <v-col cols="6">
              <span class="grey--text">收款时间：</span> {{ dialogDetailItem.receiptTime | dateTruncate(16) }}
            </v-col>
            <v-col cols="6">
              <span class="grey--text">收款金额：</span> <span class="error--text">{{ dialogDetailItem.amount }}</span>
            </v-col>
            <v-col cols="6">
              <span class="grey--text">实收金额：</span> <span class="error--text">{{ dialogDetailItem.actualAmount }}</span>
            </v-col>
            <v-col cols="6">
              <span class="grey--text">免受金额：</span> {{ dialogDetailItem.freeAmount }}
            </v-col>
            <v-col cols="6">
              <span class="grey--text">收款账户：</span> {{ dialogDetailItem.paymentName }}
            </v-col>
            <v-col cols="6">
              <span class="grey--text">附件：</span> <a
                v-if="dialogDetailItem.annex"
                :href="downloadUrl"
                target="_blank"
                download
              >下载</a><span v-else>无</span>
            </v-col>
            <v-col cols="12">
              <span class="grey--text">备注：</span> {{ dialogDetailItem.memo ? dialogDetailItem.memo : '无' }}
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSingle"
      max-width="750"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          添加收款记录
        </v-card-title>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-container>
            <v-alert
              color="grey lighten-3"
              dense
              tile
              class="body-1 mb-0"
            >
              <v-container
                fluid
                class="px-4"
              >
                <v-row no-gutters>
                  <v-col cols="12">
                    订单号：{{ order.orderNo }}
                    <span class="ml-4">客户名称：</span>{{ order.buyerName }}
                  </v-col>
                  <v-col cols="12" />
                  <v-col
                    cols="12"
                    class="headline error--text mb-2"
                  >
                    待支付：{{ +order.actualAmount - +order.receivedAmount | toFixed }} 元
                  </v-col>
                  <v-col cols="12">
                    <span>订单金额：</span>{{ order.amount }} <span class="ml-4">免收金额：</span>{{ order.freeAmount }} <span class="ml-4">已付款：</span>{{ order.receivedAmount }}
                  </v-col>
                </v-row>
              </v-container>
            </v-alert>
          </v-container>
          <v-container fluid>
            <v-row
              class="mb-3"
              no-gutters
            >
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    付款日期：
                  </v-col>
                  <v-col cols="7">
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
                          class="white rounded-left-0"
                          placeholder="请选择付款日期"
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
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    付款金额：
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      v-model="payment.amount"
                      :rules="amountRules"
                      type="number"
                      dense
                      outlined
                      required
                      single-line
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    免收金额：
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      v-model="payment.freeAmount"
                      type="number"
                      dense
                      outlined
                      required
                      single-line
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    核销金额：
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      :value="+payment.amount + +payment.freeAmount"
                      type="number"
                      disabled
                      dense
                      outlined
                      required
                      single-line
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    收款银行：
                  </v-col>
                  <v-col cols="7">
                    <v-select
                      v-model="payment.paymentId"
                      :items="paymentList.data"
                      :loading="loadingPaymentList"
                      :rules="accountRules"
                      placeholder="请选择收款账户"
                      item-value="id"
                      item-text="bankName"
                      clearable
                      outlined
                      dense
                      single-line
                      hide-details
                      no-data-text="暂无数据"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    收款账号：
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      :value="paymentAccount"
                      disabled
                      dense
                      outlined
                      required
                      readonly
                      single-line
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row align="center">
                  <v-col
                    cols="4"
                    class="text-right required"
                  >
                    附件：
                  </v-col>
                  <v-col cols="7">
                    <v-file-input
                      ref="uploader"
                      :loading="loadingAttachment"
                      outlined
                      hide-details
                      dense
                      placeholder="请选择附件"
                      prepend-icon=""
                      append-icon="mdi-paperclip"
                      clearable
                      @change="getAttachmentUrl"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    cols="2"
                    class="text-right required"
                  >
                    备注：
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      v-model="payment.memo"
                      outlined
                      value=""
                      dense
                      placeholder="请输入付款单备注"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
              color="primary"
              :loading="adding"
              :disabled="adding || !valid"
              @click="addPaymentOrder"
            >
              提交
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogSingle = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
  name: 'OrderPaymentTab',
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadingDatItems: false,
      loadingAttachment: false,
      loadingPaymentList: false,
      dialogDetail: false,
      dialogSingle: false,
      adding: false,
      addOrEdit: false,
      menuDate: false,
      valid: true,
      dialogConfirm: false,
      confirming: false,
      toConfirmOrder: '',
      dialogNullify: false,
      nullifying: false,
      toNullifyOrder: '',
      dialogDelete: false,
      deleting: false,
      toDeleteOrder: '',
      dialogDetailItem: {},
      dialogReject: false,
      rejecting: false,
      toRejectOrder: '',
      accountRules: [v => !!v || '请选择收款账户'],
      amountRules: [
        v => !!v || '请输入付款金额',
        v => v > 0 || '付款金额必须大于0',
      ],
      payment: {
        receiptTime: new Date().toISOString().substr(0, 10),
        freeAmount: 0,
        amount: 0,
        annex: '',
        paymentId: '',
        memo: '',
      },
      paymentOrderList: [],
      headers: [
        {
          text: '支付流水号',
          align: 'center',
          sortable: false,
          value: 'receiptNo',
        },
        {
          text: '收款时间',
          value: 'receiptTime',
          align: 'center',
          sortable: false,
        },
        {
          text: '实收金额',
          value: 'amount',
          align: 'center',
          sortable: false,
        },
        {
          text: '收款金额',
          value: 'actualAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '免收金额',
          value: 'freeAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '订单金额',
          value: 'orderAmount',
          align: 'center',
          sortable: false,
        },
        {
          text: '收款账户',
          value: 'paymentName',
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
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('finance', ['paymentList']),
    addOrEditParams() {
      return R.mergeRight(this.payment, {
        buyerId: this.order.buyerId,
        buyerUid: this.order.buyerUid,
        detail: [
          {
            orderId: this.order.id,
            amount: +this.payment.freeAmount + +this.payment.amount,
          },
        ],
      });
    },
    paymentAccount() {
      return R.prop(
        'account',
        R.find(R.propEq('id', this.payment.paymentId), this.paymentList.data)
      );
    },
    downloadUrl() {
      return `${process.env.VUE_APP_API}${this.dialogDetailItem.annex}`;
    },
  },
  created() {
    this.getPaymentOrderList();
  },
  methods: {
    ...mapActions('order', [
      'getPaymentOrderListAsync',
      'addPaymentOrderAsync',
      // 'editPaymentOrderAsync',
      // 'deletePaymentOrderAsync',
      'confirmPaymentOrderAsync',
      'nullifyPaymentOrderAsync',
    ]),
    ...mapActions('finance', [
      'getPaymentListAsync',
      'rejectPaymentOrderAsync',
    ]),
    ...mapActions(['uploadAttachmentSync']),
    // 删除收款单
    // deleteOrder() {
    //   this.deleting = true;
    //   this.deletePaymentOrderAsync({
    //     id: this.toDeleteOrder,
    //   })
    //     .then(() => {
    //       this.$store.commit('TOGGLE_SNACKBAR', {
    //         type: 'success',
    //         text: '恭喜，删除收款单成功!',
    //       });
    //       this.getPaymentOrderList();
    //     })
    //     .catch((err) => {
    //       this.checkErr(err, 'deleteOrder');
    //     })
    //     .finally(() => {
    //       this.deleting = false;
    //       this.dialogDelete = false;
    //     });
    // },
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
    openDialogAdd() {
      this.dialogSingle = true;
      this.getPaymentList();
      this.payment = {
        receiptTime: new Date().toISOString().substr(0, 10),
        freeAmount: 0,
        amount: 0,
        annex: '',
        paymentId: '',
        memo: '',
      };
    },
    // openDialogEdit(item) {
    //   this.payment = item;
    //   this.dialogSingle = true;
    //   this.getPaymentList();
    // },
    getPaymentOrderList() {
      this.loadingDatItems = true;
      this.getPaymentOrderListAsync({ orderId: this.order.id })
        .then((res) => {
          this.paymentOrderList = res;
        })
        .catch(err => this.checkErr(err, 'getPaymentOrderList'))
        .finally(() => {
          this.loadingDatItems = false;
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
          this.checkErr(err, 'getAttachmentUrl');
        })
        .finally(() => {
          this.loadingAttachment = false;
        });
    },
    getPaymentList() {
      this.loadingPaymentList = true;
      this.getPaymentListAsync()
        .catch(err => this.checkErr(err, 'getPaymentList'))
        .finally(() => {
          this.loadingPaymentList = false;
        });
    },
    addPaymentOrder() {
      this.adding = true;
      this.addPaymentOrderAsync(this.addOrEditParams)
        .then((res) => {
          this.confirmPaymentOrderAsync({ id: res, checkRight: false }).then(
            () => {
              this.$store.commit('TOGGLE_SNACKBAR', {
                type: 'success',
                text: '恭喜，添加成功!',
              });
              this.getPaymentOrderList();
              this.dialogSingle = false;
              this.$emit('update:refresh');
            }
          );
        })
        .catch(err => this.checkErr(err, 'addPaymentOrder'))
        .finally(() => {
          this.adding = false;
        });

      // if (this.addOrEdit) {
      //   this.editPaymentOrderAsync(this.addOrEditParams)
      //     .then(() => {
      //       this.$store.commit('TOGGLE_SNACKBAR', {
      //         type: 'success',
      //         text: '恭喜，添加成功!',
      //       });
      //       this.getPaymentOrderList();
      //     })
      //     .catch(err => this.checkErr(err, 'addPaymentOrder'))
      //     .finally(() => {
      //       this.adding = false;
      //       this.dialogSingle = false;
      //     });
      // } else {
      //   this.addPaymentOrderAsync(this.addOrEditParams)
      //     .then(() => {
      //       this.$store.commit('TOGGLE_SNACKBAR', {
      //         type: 'success',
      //         text: '恭喜，添加成功!',
      //       });
      //       this.getPaymentOrderList();
      //     })
      //     .catch(err => this.checkErr(err, 'addPaymentOrder'))
      //     .finally(() => {
      //       this.adding = false;
      //       this.dialogSingle = false;
      //     });
      // }
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
