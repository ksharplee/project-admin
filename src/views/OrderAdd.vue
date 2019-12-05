<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      代客下单
    </div>
    <v-divider class="my-4" />
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          选择客户
        </v-card-title>
        <v-container fluid>
          <v-btn
            color="primary"
            @click="dialogCustomer = true;selectedProducts = []"
          >
            <v-icon left>
              mdi-plus
            </v-icon>选择客户
          </v-btn>
        </v-container>
        <v-slide-y-transition>
          <v-simple-table
            v-if="selectedCustomer.length"
            class="text-center elevation-1"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">
                    姓名
                  </th>
                  <th class="text-center">
                    手机号码
                  </th>
                  <th class="text-center">
                    会员等级
                  </th>
                  <th class="text-center">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in selectedCustomer"
                  :key="item.id"
                >
                  <td>{{ item.dnames }}</td>
                  <td>{{ item.mobile }}</td>
                  <td>{{ item.gradeName }}</td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          :disabled="item.dstatus === '1'"
                          icon
                          class="mx-1"
                          v-on="on"
                          @click="selectedCustomer = [];selectedProducts = []"
                        >
                          <v-icon color="secondary">
                            mdi-delete-forever
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>删除</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-slide-y-transition>
      </v-card>
      <v-slide-y-transition>
        <div class="mb-4">
          <customer-shipping-list
            v-show="selectedCustomer.length"
            :array="selectedCustomer"
            :component="true"
            @update:selectedAddress="getSelectedAddress"
          />
        </div>
      </v-slide-y-transition>
      <customer-list
        :dialog="dialogCustomer"
        :selected-customer="selectedCustomer"
        @close-dialog="dialogCustomer = false"
        @update:selected="getSelectedCustomer"
      />
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          商品清单
          <div class="ml-auto">
            <div class="input-group">
              <div class="input-group-control">
                <v-text-field
                  placeholder="扫描输入条形码/二维码"
                  dense
                  outlined
                  clearable
                  class="white"
                  required
                  single-line
                  hide-details
                />
              </div>
              <div class="input-group-append">
                <span class="input-group-text">条形码/二维码</span>
              </div>
              <div class="input-group-append">
                <v-btn
                  :disabled="!selectedCustomer.length"
                  color="primary"
                  depressed
                  @click="dialogProduct = true"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon> 添加商品
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-title>
        <v-divider class="my-0" />
        <v-data-table
          :headers="headers"
          :items="selectedProductsApply"
          class="text-center"
          item-key="id"
          no-data-text="暂无数据"
          hide-default-footer
          :items-per-page="20"
        >
          <template v-slot:item.goodDetailName="{ item }">
            {{ item.goodDetailName ? item.goodDetailName : '无' }}
          </template>
          <template v-slot:item.amount="{ item }">
            {{ getProductPrice(item) | toFixed }}
          </template>
          <template v-slot:item.memo="{ item }">
            <v-text-field
              v-model="item.memo"
              dense
              outlined
              required
              single-line
              hide-details
            />
          </template>
          <template v-slot:item.unit="{ item }">
            <v-select
              v-model="item.buUnitId"
              :items="item.units"
              item-value="unitId"
              item-text="unitName"
              outlined
              dense
              single-line
              hide-details
              no-data-text="暂无数据"
            />
          </template>
          <template v-slot:item.buNumber="{ item }">
            <div class="input-group">
              <div class="input-group-control">
                <v-text-field
                  v-model="item.buNumber"
                  type="number"
                  :rules="numberRules"
                  dense
                  outlined
                  required
                  single-line
                  hide-details
                />
              </div>
            </div>
          </template>
          <template v-slot:item.price="{ item }">
            <v-text-field
              v-model="item.price"
              :rules="priceRules"
              hide-details
              :suffix="`每${item.unitName}`"
              dense
              required
              outlined
            />
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
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  :disabled="item.dstatus === '1'"
                  icon
                  class="mx-1"
                  v-on="on"
                  @click="deleteSelectedProduct(item.goodId)"
                >
                  <v-icon color="secondary">
                    mdi-delete-forever
                  </v-icon>
                </v-btn>
              </template>
              <span>删除</span>
            </v-tooltip>
          </template>
          <template v-slot:footer>
            <v-container
              v-if="selectedProductsApply.length"
              fluid
              class="grey lighten-4"
            >
              <v-row align="center">
                <v-col cols="auto">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">免收金额</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="order.freeAmount"
                        type="number"
                        placeholder="请输入免收金额"
                        dense
                        outlined
                        class="white"
                        suffix="元"
                        required
                        single-line
                        hide-details
                      />
                    </div>
                  </div>
                </v-col>
                <v-col cols="auto">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">配送费用</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="order.freight"
                        type="number"
                        placeholder="请输入配送费用"
                        dense
                        outlined
                        class="white"
                        suffix="元"
                        required
                        single-line
                        hide-details
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  cols="auto"
                  class="ml-auto"
                >
                  商品金额：￥{{ totalAmount | toFixed }}
                </v-col>
                <v-col
                  v-if="order.isInvoice === '1'"
                  cols="auto"
                >
                  税费：￥{{ tax | toFixed }}
                </v-col>
                <v-col
                  cols="auto"
                  class="pr-0"
                >
                  应付金额：
                </v-col>
                <v-col
                  cols="auto"
                  class="display-1 error--text pl-0 font-weight-bold"
                  align-self="start"
                >
                  ￥{{ (totalAmount + +(order.freight ? order.freight : 0) - +(order.freeAmount ? order.freeAmount : 0) + tax) | toFixed }}
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-data-table>
      </v-card>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          开票金额
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">是否开票</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="order.isInvoice"
                    :items="useInvoice"
                    :rules="invoiceRules"
                    clearable
                    outlined
                    dense
                    single-line
                    hide-details
                    no-data-text="暂无数据"
                    @change="getInvoiceList"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-if="order.isInvoice === '1'"
              cols="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">发票信息</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="selectedInvoice"
                    :items="invoiceList.data"
                    :loading="loadingInvoices"
                    placeholder="请选择发票"
                    item-text="dnames"
                    item-value="id"
                    clearable
                    outlined
                    dense
                    single-line
                    hide-details
                    return-object
                    no-data-text="暂无数据"
                    @change="getSelectedInvoice"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="order.isInvoice === '1' && selectedInvoice && selectedInvoice.isAdded"
            align="center"
          >
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">发票抬头</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="order.invoiceTitle"
                    :rules="invoiceTitleRules"
                    placeholder="请填写发票抬头"
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">纳税人号</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="order.taxpayer"
                    placeholder="请填写纳税人号"
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </div>
              </div>
            </v-col>
            <template v-if="order.isInvoice === '1' && selectedInvoice && selectedInvoice.isAdded === '1'">
              <v-col cols="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">联系电话</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="order.tel"
                      placeholder="请填写联系电话"
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">开户银行</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="order.bank"
                      placeholder="请填写开户银行"
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">银行账号</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="order.cardNo"
                      placeholder="请填写银行账号"
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                    />
                  </div>
                </div>
              </v-col>
              <v-col cols="8">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">公司地址</span>
                  </div>
                  <div class="input-group-control">
                    <v-textarea
                      v-model="order.invoiceAddr"
                      outlined
                      value=""
                      dense
                      placeholder="请填写纳税公司地址"
                      hide-details
                    />
                  </div>
                </div>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-card>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          附加信息
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">交货日期</span>
                </div>
                <div class="input-group-control">
                  <v-menu
                    ref="menuDate"
                    v-model="menuDate"
                    :close-on-content-click="false"
                    :return-value.sync="order.deliveryTime"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="order.deliveryTime"
                        class="white rounded-left-0"
                        placeholder="请选择交货日期"
                        outlined
                        single-line
                        dense
                        clearable
                        hide-details
                        append-icon="mdi-calendar-import"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="order.deliveryTime"
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
                        @click="$refs.menuDate.save(order.deliveryTime)"
                      >
                        确定
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">附件信息</span>
                </div>
                <div class="input-group-control">
                  <v-file-input
                    ref="uploader"
                    :loading="loadingAttachment"
                    outlined
                    hide-details
                    single-line
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
          </v-row>
          <v-row align="center">
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">处理流程</span>
                </div>
                <div class="input-group-control">
                  <!-- :rules="orderSequenceRules" -->
                  <v-select
                    v-model="selectedOrderSequence"
                    :items="orderSequence.data"
                    :loading="loadingOrderSequence"
                    placeholder="请选择订单流程"
                    item-text="flowName"
                    item-value="id"
                    clearable
                    outlined
                    dense
                    required
                    single-line
                    hide-details
                    return-object
                    no-data-text="加载中..."
                    @focus="getOrderSequenceList"
                    @change="getSelectedOrderSequence"
                  />
                </div>
              </div>
            </v-col>
            <v-col
              v-if="order.processId"
              cols="8"
            >
              {{ selectedOrderSequence.flowContentDesc | flowContentFilter }}
            </v-col>
            <v-col
              v-else
              cols="8"
            >
              <v-btn
                text
                class="primary--text"
                :to="{ name: 'order_sequence' }"
              >
                添加订单流程
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&nbsp;&nbsp;&nbsp;备&nbsp;&nbsp;注&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-textarea
                    v-model="order.memo"
                    outlined
                    value=""
                    dense
                    placeholder="请输入备注"
                    hide-details
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <product-selection
        :show="dialogProduct"
        :buyer-id="selectedCustomer.length ? selectedCustomer[0].buyerId : ''"
        :buyer-uid="selectedCustomer.length ? selectedCustomer[0].buyerUid : ''"
        :selected="selectedProducts"
        @close-dialog="dialogProduct = false"
        @update:selectedProducts="getSelectedProducts"
      />
      <v-btn
        :disabled="!valid || disallowSubmit || addingOrder"
        :loading="addingOrder"
        color="primary"
        large
        class="px-12 body-1"
        @click="addOrder"
      >
        提交
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import * as R from "ramda";
import { mapState, mapActions } from "vuex";
import CustomerList from "@/components/CustomerList.vue";
import CustomerShippingList from "@/views/CustomerShippingList.vue";
import ProductSelection from "@/components/ProductSelection.vue";

export default {
  name: "OrderAdd",
  components: {
    CustomerList,
    CustomerShippingList,
    ProductSelection
  },
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogCustomer: false,
      dialogProduct: false,
      loadCustomers: false,
      loadingInvoices: false,
      loadingOrderSequence: false,
      loadingAttachment: false,
      addingOrder: false,
      selectedCustomer: [],
      selectedAddress: {},
      selectedProducts: [],
      selectedInvoice: {},
      valid: true,
      menuDate: false,
      order: {
        isInvoice: "0"
      },
      selectedOrderSequence: {
        flowType: "1",
        flowName: "标准流程",
        flowDescription: "标准流程"
      },
      useInvoice: [
        {
          text: "是",
          value: "1"
        },
        {
          text: "否",
          value: "0"
        }
      ],
      selectedProductsUnits: [],
      invoiceRules: [v => !!v || "请选择是否开票"],
      orderSequenceRules: [v => !!v || "请选择订单流程"],
      invoiceTitleRules: [v => !!v || "请填写发票抬头"],
      priceRules: [v => !!v || "请填写商品价格"],
      numberRules: [v => v > 0 || "商品数量必须大于0"],
      // ltzRules: [v => v >= 0 || '数字不能小于0'],
      // phoneRules: [v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误'],
      headers: [
        {
          text: "图片",
          align: "center",
          sortable: false,
          value: "image",
          width: "100px"
        },
        {
          text: "商品名称",
          value: "goodName",
          align: "center",
          sortable: false
        },
        {
          text: "商品规格",
          value: "goodDetailName",
          align: "center",
          sortable: false
        },
        {
          text: "销售价(元)",
          value: "price",
          align: "center",
          sortable: false,
          width: "160px"
        },
        {
          text: "数量",
          value: "buNumber",
          align: "center",
          sortable: false,
          width: "160px"
        },
        {
          text: "销售单位",
          value: "unit",
          align: "center",
          sortable: false,
          width: "200px"
        },
        {
          text: "小计(元)",
          value: "amount",
          align: "center",
          sortable: false
        },
        {
          text: "备注",
          value: "memo",
          align: "center",
          sortable: false,
          width: "200px"
        },
        {
          text: "操作",
          value: "action",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  computed: {
    ...mapState("finance", ["invoiceList"]),
    ...mapState("system", ["orderSequence"]),
    taxRate() {
      return (
        +R.prop(
          "invoiceTax",
          R.find(R.propEq("id", this.selectedInvoice.id), this.invoiceList.data)
        ) / 100
      );
    },
    tax() {
      if (!R.isEmpty(this.selectedInvoice)) {
        return this.totalAmount * this.taxRate;
      }
      return 0;
    },
    disallowSubmit() {
      return (
        !this.selectedAddress ||
        R.isEmpty(this.selectedAddress) ||
        R.isEmpty(this.selectedOrderSequence) ||
        (this.order.isInvoice === "1" && R.isEmpty(this.selectedInvoice)) ||
        !this.selectedCustomer.length ||
        !this.selectedProductsApply.length
      );
    },
    totalAmount() {
      return R.reduce(
        (acc, item) => R.add(acc, this.getProductPrice(item)),
        0,
        this.selectedProductsApply
      );
    },
    selectedProductsApply() {
      return R.map(item => {
        item.buNumber = 1;
        item.memo = "";
        item.priceOld = item.price;
        item.price = item.byPrice.toFixed(2);
        item.buUnitId = item.unitId;
        item.units = R.prop(
          "units",
          R.find(R.propEq("goodId", item.goodId), this.selectedProductsUnits)
        );
        return item;
      }, R.clone(this.selectedProducts));
    },
    detail() {
      return R.map(
        item => ({
          goodDetailId: item.goodDetailId,
          buUnitId: item.buUnitId,
          buNumber: item.buNumber,
          price: item.price,
          memo: item.memo,
          packeNum: R.prop(
            "packeNum",
            R.find(R.propEq("unitId", item.buUnitId), item.units)
          )
        }),
        this.selectedProductsApply
      );
    }
  },
  created() {
    this.$store.commit("SET_BREADCRUMBS", [
      {
        text: "首页",
        disabled: false,
        to: { name: "home" },
        exact: true
      },
      {
        text: "代客下单",
        disabled: true,
        exact: true
      }
    ]);
  },
  methods: {
    ...mapActions(["uploadAttachmentSync"]),
    ...mapActions("finance", ["getInvoiceListAsync"]),
    ...mapActions("system", ["orderSequenceListAsync"]),
    ...mapActions("order", ["getProductUnitsAsync", "addOrderAsync"]),
    getProductPrice(item) {
      if (item.unitId && item.units) {
        return (
          +item.buNumber *
          +item.price *
          +R.prop(
            "packeNum",
            R.find(R.propEq("unitId", item.buUnitId), item.units)
          )
        );
      }
      return +item.buNumber * +item.price;
    },
    async getProductUnits(params) {
      const res = await this.getProductUnitsAsync(params);
      return {
        goodId: params.goodId,
        units: res
      };
    },
    getSelectedProducts(arr) {
      this.selectedProducts = arr;
      const goodIds = R.uniq(R.pluck("goodId", arr));
      const resUnits = R.map(
        goodId => this.getProductUnits({ goodId }),
        goodIds
      );
      Promise.all(resUnits)
        .then(res => {
          this.selectedProductsUnits = res;
        })
        .catch(err => {
          this.checkErr(err, "getSelectedProducts");
        });
    },
    getSelectedInvoice(invoice) {
      this.order.invoiceId = invoice.id;
    },
    getSelectedAddress(addr) {
      this.selectedAddress = addr;
      this.order.addrId = addr && addr.id;
    },
    getSelectedCustomer(arr) {
      this.selectedCustomer = arr;
      this.order.buyerId = arr[0].buyerId;
      this.order.buyerUid = arr[0].buyerUid;
    },
    getInvoiceList(v) {
      if (v === "1" && !this.invoiceList.status) {
        this.loadingInvoices = true;
        this.getInvoiceListAsync()
          .catch(err => {
            this.checkErr(err);
          })
          .finally(() => {
            this.loadingInvoices = false;
          });
      }
    },
    // 获取订单流程列表
    getOrderSequenceList() {
      // if (!this.orderSequence.status) {
      this.loadingOrderSequence = true;
      this.orderSequenceListAsync({ isDelete: "0" })
        // .then(res => {
        //   if (res.length) {
        //     this.dataItems = res;
        //   } else {
        //     this.dataItems = [
        //       {
        //         flowType: "1",
        //         flowName: "标准流程",
        //         flowDescription: "标准流程"
        //       }
        //     ];
        //   }
        // })
        .catch(err => {
          this.checkErr(err, "orderSequenceList");
        })
        .finally(() => {
          this.loadingOrderSequence = false;
        });
      // }
    },
    getSelectedOrderSequence(v) {
      this.order.processId = v.id;
    },
    getAttachmentUrl(file) {
      this.loadingAttachment = true;
      const dataPost = new FormData();
      dataPost.append("file", file);
      this.uploadAttachmentSync(dataPost)
        .then(res => {
          this.order.annex = res;
        })
        .catch(err => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingAttachment = false;
        });
    },
    addOrder() {
      this.addingOrder = true;
      this.addOrderAsync(R.mergeRight(this.order, { detail: this.detail }))
        .then(() => {
          this.$store.commit("TOGGLE_SNACKBAR", {
            type: "success",
            text: "恭喜，添加成功!"
          });
          this.$router.replace({ name: "order_list" });
        })
        .catch(err => {
          this.checkErr(err, "addOrder");
        })
        .finally(() => {
          this.addingOrder = false;
        });
    },
    deleteSelectedProduct(id) {
      this.selectedProducts = R.reject(
        R.propEq("goodId", id),
        this.selectedProducts
      );
    }
  }
};
</script>
