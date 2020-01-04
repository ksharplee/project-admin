<template>
  <div class="pa-4">
    <v-expansion-panels
      v-model="panels"
      focusable
      multiple
      accordion
    >
      <v-expansion-panel>
        <v-expansion-panel-header>订单基本信息</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            no-gutters
            class="mt-2"
          >
            <v-col cols="6">
              <v-row align="center">
                <v-col
                  md="4"
                  lg="2"
                  class="grey--text"
                >
                  订单状态
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                  class="title"
                  :class="order.dStatus | orderStatusClass"
                >
                  {{ order.dStatus | orderStatus }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row align="center">
                <v-col
                  md="4"
                  lg="2"
                  class="grey--text"
                >
                  订单号
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.orderNo }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row align="center">
                <v-col
                  md="4"
                  lg="2"
                  class="grey--text"
                >
                  客户名称
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.buyerName }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  收货信息
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  <span class="grey--text">收货人：</span>{{ order.contacter }} <span class="ml-4 grey--text">联系电话：</span>{{ order.mobile }} <span class="ml-4 grey--text">收货地址：</span>{{ order.addr }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  交货日期
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                  :class="order.deliveryTime ? '' : 'grey--text'"
                >
                  {{ order.deliveryTime ? order.deliveryTime : '无' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  备注信息
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                  :class="order.memo ? '' : 'grey--text'"
                >
                  {{ order.memo ? order.memo : '无' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  附件信息
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                  :class="order.annex ? '' : 'grey--text'"
                >
                  <a
                    v-if="order.annex"
                    :href="downloadUrl"
                    target="_blank"
                    download
                  >下载</a><span v-else>无</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  订单处理流程
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.processFlag | orderSequenceText }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  发票类型
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.isInvoice !== '1' ? '不开票' : order.invoiceType === '1' ? '增值税发票' : '普通发票' }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="order.isInvoice === '1'">
        <v-expansion-panel-header>发票信息</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            no-gutters
            class="mt-2"
          >
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  发票抬头
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.invoiceTitle }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  纳税人号
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.taxpayer }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  md="2"
                  lg="1"
                  class="grey--text"
                >
                  税率
                </v-col>
                <v-col
                  md="8"
                  lg="10"
                >
                  {{ order.invoiceTax }}
                </v-col>
              </v-row>
            </v-col>
            <template v-if="order.invoiceType === '1'">
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    md="2"
                    lg="1"
                    class="grey--text"
                  >
                    联系电话
                  </v-col>
                  <v-col
                    md="8"
                    lg="10"
                  >
                    {{ order.tel }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    md="2"
                    lg="1"
                    class="grey--text"
                  >
                    开户银行
                  </v-col>
                  <v-col
                    md="8"
                    lg="10"
                  >
                    {{ order.bank }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    md="2"
                    lg="1"
                    class="grey--text"
                  >
                    银行账号
                  </v-col>
                  <v-col
                    md="8"
                    lg="10"
                  >
                    {{ order.cardNo }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    md="2"
                    lg="1"
                    class="grey--text"
                  >
                    公司地址
                  </v-col>
                  <v-col
                    md="8"
                    lg="10"
                  >
                    {{ order.invoiceAddr }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col
                    md="2"
                    lg="1"
                    class="grey--text"
                  >
                    税费
                  </v-col>
                  <v-col
                    md="8"
                    lg="10"
                    class="error--text"
                  >
                    {{ order.invoiceAmount }} 元
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>商品信息</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            class="mt-4"
            flat
          >
            <v-data-table
              :headers="headers"
              :items="order.detail"
              class="text-center"
              item-key="id"
              no-data-text="暂无数据"
              hide-default-footer
              :items-per-page="20"
            >
              <template v-slot:item.buUnitName="{ item }">
                {{ item.buUnitId === item.unitId ? item.unitName : item.buUnitName }}
                <div
                  v-if="item.buUnitId !== item.unitId"
                  class="grey--text"
                >
                  (1{{ item.buUnitName }} = {{ item.packeNum }}{{ item.unitName }})
                </div>
              </template>
              <template v-slot:item.goodDetailName="{ item }">
                {{ item.goodDetailName ? item.goodDetailName : '无' }}
              </template>
              <template v-slot:item.memo="{ item }">
                <div :class="item.memo ? '' : 'grey--text'">
                  {{ item.memo ? item.memo : '无' }}
                </div>
              </template>
              <template v-slot:item.image="{ item }">
                <div class="py-3">
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
              <template v-slot:footer>
                <v-container
                  fluid
                  class="grey lighten-4"
                >
                  <v-row align="center">
                    <v-col cols="auto">
                      <span class="grey--text">免收金额：</span>{{ order.freeAmount }}
                    </v-col>
                    <v-col cols="auto">
                      <span class="grey--text">配送费用：</span>{{ order.freight }}
                    </v-col>
                    <v-col
                      cols="auto"
                      class="pr-0 ml-auto"
                    >
                      应付金额：
                    </v-col>
                    <v-col
                      cols="auto"
                      class="display-1 error--text pl-0 font-weight-bold"
                      align-self="start"
                    >
                      ￥{{ order.actualAmount }}
                    </v-col>
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
            <template v-if="order.dStatus === '1'">
              <v-divider />
              <v-card-title class="pa-3 d-flex">
                <div class="ml-auto">
                  <v-btn
                    color="primary"
                    depressed
                    @click="dialogEdit = true"
                  >
                    <v-icon left>
                      mdi-pencil
                    </v-icon> 编辑商品
                  </v-btn>
                </div>
              </v-card-title>
            </template>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div
      class="py-4"
    >
      <template v-if="order.dStatus === '1'">
        <v-btn
          color="primary"
          large
          class="px-12 body-1 mr-4"
          @click="dialogConfirm = true;"
        >
          确认订单
        </v-btn>
        <v-btn
          color="secondary"
          large
          class="px-12 body-1 mr-4"
          @click="dialogCancel = true;"
        >
          取消订单
        </v-btn>
      </template>
      <v-btn
        v-if="order.dStatus === '5'"
        color="primary"
        large
        class="px-12 body-1 mr-4"
        @click="$emit('update:changeTab', 1)"
      >
        我要发货
      </v-btn>
      <v-btn
        v-if="order.dStatus === '4' || order.dStatus === '5'"
        :disabled="order.amontStatus !== '0'"
        color="secondary"
        large
        class="px-12 body-1 mr-4"
        @click="dialogNullify = true;"
      >
        作废订单
      </v-btn>
      <v-btn
        v-if="order.dStatus === '4'"
        color="primary"
        large
        class="px-12 body-1 mr-4"
        @click="dialogFinacialCheck = true;"
      >
        财务审核订单
      </v-btn>
      <v-btn
        v-if="order.dStatus === '8' || order.dStatus === '9'"
        color="primary"
        large
        class="px-12 body-1 mr-4"
        @click="dialogComplete = true;"
      >
        完成订单
      </v-btn>
    </div>
    <order-detail-edit
      v-if="order.dStatus === '1'"
      :show="dialogEdit"
      :order="order"
      @update:refresh="$emit('update:refresh')"
      @close-dialog="dialogEdit = false"
    />
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
// import * as R from 'ramda';
import { mapActions } from 'vuex';
import OrderDetailEdit from '@/components/OrderDetailEdit.vue';

export default {
  name: 'OrderDetailTab',
  components: {
    OrderDetailEdit,
  },
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogEdit: false,
      dialogCancel: false,
      canceling: false,
      dialogConfirm: false,
      confirming: false,
      dialogFinacialCheck: false,
      finacialChecking: false,
      dialogNullify: false,
      nullifying: false,
      dialogComplete: false,
      completing: false,
      panels: [0, 1, 2],
      headers: [
        {
          text: '图片',
          align: 'center',
          sortable: false,
          value: 'image',
          width: '100px',
        },
        {
          text: '商品名称',
          value: 'goodName',
          align: 'center',
          sortable: false,
        },
        {
          text: '商品货号',
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
        {
          text: '销售价',
          value: 'price',
          align: 'center',
          sortable: false,
        },
        {
          text: '数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
        },
        {
          text: '销售单位',
          value: 'buUnitName',
          align: 'center',
          sortable: false,
        },
        {
          text: '小计',
          value: 'amount',
          align: 'center',
          sortable: false,
        },
        {
          text: '备注',
          value: 'memo',
          align: 'center',
          sortable: false,
          width: '200px',
        },
      ],
      byPriceRules: [v => !!v || '请填写商品价格'],
    };
  },
  computed: {
    downloadUrl() {
      return `${process.env.VUE_APP_API}${this.order.annex}`;
    },
  },
  created() {},
  methods: {
    ...mapActions('order', [
      'cancelOrderAsync',
      'confirmOrderAsync',
      'finacialCheckOrderAsync',
      'nullifyOrderAsync',
      'completeOrderAsync',
    ]),
    // 取消订单
    cancelOrder() {
      this.canceling = true;
      this.cancelOrderAsync({
        id: this.order.id,
        sectionId: this.$store.state.user.sectionId,
        single: true,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，取消订单成功!',
          });
          this.$router.replace({ name: 'order_list', params: { active: '0' } });
        })
        .catch((err) => {
          this.checkErr(err, 'cancelOrder');
        })
        .finally(() => {
          this.canceling = false;
        });
    },
    // 确认订单
    confirmOrder() {
      this.confirming = true;
      this.confirmOrderAsync({
        id: this.order.id,
        sectionId: this.$store.state.user.sectionId,
        single: true,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，确认订单成功!',
          });
          this.dialogConfirm = false;
          this.$emit('update:refresh');
          // this.$router.replace({ name: 'order_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'confirmOrder');
        })
        .finally(() => {
          this.confirming = false;
        });
    },
    // 财务审核订单
    finacialCheckOrder() {
      this.finacialChecking = true;
      this.finacialCheckOrderAsync({
        id: this.order.id,
        sectionId: this.$store.state.user.sectionId,
        single: true,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，财务审核订单成功!',
          });
          this.dialogFinacialCheck = false;
          this.$emit('update:refresh');
          // this.$router.replace({ name: 'order_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'finacialCheckOrder');
        })
        .finally(() => {
          this.finacialChecking = false;
        });
    },
    // 作废订单
    nullifyOrder() {
      this.nullifying = true;
      this.nullifyOrderAsync({
        id: this.order.id,
        sectionId: this.$store.state.user.sectionId,
        single: true,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废订单成功!',
          });
          this.$router.replace({ name: 'order_list', params: { active: '0' } });
        })
        .catch((err) => {
          this.checkErr(err, 'nullifyOrder');
        })
        .finally(() => {
          this.nullifying = false;
        });
    },
    // 完成订单
    completeOrder() {
      this.completing = true;
      this.completeOrderAsync({
        id: this.order.id,
        sectionId: this.$store.state.user.sectionId,
        single: true,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，订单已完成!',
          });
          this.dialogComplete = false;
          this.$emit('update:refresh');
          // this.$router.replace({ name: 'order_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'completeOrder');
        })
        .finally(() => {
          this.completing = false;
        });
    },
  },
};
</script>
