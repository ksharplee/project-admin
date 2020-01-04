<template>
  <div>
    <v-card>
      <v-card-text
        ref="advancedSearch"
        class="advance-search pa-0"
      >
        <v-data-table
          v-model="selectedOrders"
          :headers="headers"
          :items="orderList.data.items"
          :loading="loadingDataItems"
          loading-text="加载中，请稍候..."
          class="text-center"
          no-data-text="暂无数据"
          hide-default-footer
          :items-per-page="20"
        >
          <!-- show-select -->
          <template v-slot:top>
            <div
              class="text-left d-flex align-center mb-2"
              style="height: 36px"
            >
              <template
                v-if="selectedOrders.length"
              >
                <v-btn
                  color="secondary"
                  icon
                  text
                  x-small
                  class="mr-3"
                  :ripple="false"
                  @click="selectedOrders = []"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                已选择&nbsp;<span class="primary--text">{{ selectedOrders.length }} </span>&nbsp;项
                <v-divider
                  vertical
                  class="ml-8 mr-4"
                />
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-shield-check mdi-18px
                  </v-icon> 订单审核
                </v-btn>
              </template>
              <template v-else-if="searchStatus">
                搜索结果
                <v-divider
                  vertical
                  class="ml-6 mr-3"
                />
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="clearAdvancedSearch"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-eraser mdi-18px
                  </v-icon> 清除搜索
                </v-btn>
                <v-btn
                  text
                  class="px-1 py-1"
                  @click="dialogSearch = true"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-feature-search mdi-18px
                  </v-icon> 继续搜索
                </v-btn>
              </template>
              <template v-else>
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
                <div
                  class="input-group ml-4"
                  style="width:300px"
                >
                  <div class="input-group-control">
                    <v-text-field
                      v-model="search.orderNo"
                      placeholder="请输入订单号搜索"
                      outlined
                      class="white"
                      single-line
                      clearable
                      hide-details
                      dense
                      @click:clear="$set(search,'orderNo', '');getOrderList()"
                      @keyup.enter="getOrderList({ orderNo: search.orderNo })"
                    />
                  </div>
                  <div class="input-group-append">
                    <v-btn
                      color="blue-grey lighten-4 px-0"
                      depressed
                      x-small
                      @click="getOrderList({ orderNo: search.orderNo })"
                    >
                      <v-icon
                        color="blue-grey darken-2"
                      >
                        mdi-magnify mdi-18px
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  text
                  class="ml-2 px-1"
                  @click="dialogSearch = true"
                >
                  高级搜索
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  depressed
                  class="px-5"
                  :to="{ name: 'order_add' }"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon> 代客下单
                </v-btn>
              </template>
            </div>
          </template>
          <template v-slot:item.orderNo="{ item }">
            <router-link :to="{ name: 'order_detail', params: { id: item.id, currentTab: '0' }}">
              {{ item.orderNo }}
            </router-link><v-chip
              v-if="item.orderType === '4'"
              outlined
              small
              color="#ddd"
              text-color="primary"
              class="px-1 ml-2"
            >
              代下单
            </v-chip>
          </template>
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
          <template v-slot:footer>
            <v-divider />
            <div
              v-if="orderList.status && orderList.data.items.length"
              class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
            >
              <div class="mr-2">
                共<span class="error--text">{{ orderList.data.totalItem }}</span>订单
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
                  :to="{ name: 'order_detail', params: { id: item.id, currentTab: '0' }}"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      style="position:relative;top:-1px"
                    >
                      mdi-file-document-box-search
                    </v-icon>订单详情
                  </v-list-item-title>
                </v-list-item>
                <!-- 已提交订单可以确认或取消 -->
                <v-list-item
                  :disabled="item.dStatus !== '1'"
                  @click="dialogConfirm = true;toConfirmOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.dStatus !== '1' ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-clipboard-check
                    </v-icon>确认订单
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="item.dStatus !== '1'"
                  @click="dialogCancel = true;toCancelOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.dStatus !== '1' ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-file-cancel
                    </v-icon>取消订单
                  </v-list-item-title>
                </v-list-item>
                <!-- 已确认，未完成，并且未作废的订单可以添加收款记录 -->
                <v-list-item
                  :disabled="!(item.dStatus === '4' || item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9' || item.dStatus === '10')"
                  :to="{ name: 'order_detail', params: { id: item.id, currentTab: '2' }}"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="!(item.dStatus === '4' || item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9' || item.dStatus === '10') ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-credit-card
                    </v-icon>添加收款记录
                  </v-list-item-title>
                </v-list-item>
                <!-- 已确认订单可财务审核，但只有付款状态为未付款的才可作废订单 -->
                <v-list-item
                  :disabled="item.amontStatus !== '0' || !(item.dStatus === '4' || item.dStatus === '5')"
                  @click="dialogNullify = true;toNullifyOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.amontStatus !== '0' || !(item.dStatus === '4' || item.dStatus === '5') ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-close-circle
                    </v-icon>订单作废
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="item.dStatus !== '4'"
                  @click="dialogFinacialCheck = true;toFinacialCheckOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.dStatus !== '4' ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-check-decagram
                    </v-icon>财务审核
                  </v-list-item-title>
                </v-list-item>
                <!-- 已通过财务审核的订单可进行发货操作 -->
                <v-list-item
                  :disabled="!(item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9')"
                  :to="{ name: 'order_detail', params: { id: item.id, currentTab: '1' }}"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="!(item.dStatus === '5' || item.dStatus === '7' || item.dStatus === '8' || item.dStatus === '9') ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-truck
                    </v-icon>订单发货
                  </v-list-item-title>
                </v-list-item>
                <!-- 已确认收货或者完成发货并且完成收款的订单可以进行完成订单操作 -->
                <v-list-item
                  :disabled="item.amontStatus !== '3' || !(item.dStatus === '8' || item.dStatus === '9')"
                  @click="dialogComplete = true;toCompleteOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.amontStatus !== '3' || !(item.dStatus === '8' || item.dStatus === '9') ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-file-check
                    </v-icon>完成订单
                  </v-list-item-title>
                </v-list-item>
                <!-- <v-list-item
                  @click="dialogDistribute = true;toCompleteOrder = item.id"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="item.amontStatus !== '3' || !(item.dStatus === '8' || item.dStatus === '9') ? '#999' : ''"
                      style="position:relative;top:-1px"
                    >
                      mdi-swap-horizontal-bold
                    </v-icon>订单分配
                  </v-list-item-title>
                </v-list-item> -->
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogDistribute"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          订单分配
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="distributing"
            :disabled="distributing"
            @click="distributeOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogDistribute = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    <v-dialog
      v-model="dialogSearch"
      :attach="$refs.advancedSearch"
      content-class="ma-0"
      hide-overlay
    >
      <v-card>
        <v-card-title>
          高级搜索
        </v-card-title>
        <v-form ref="form">
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                md="6"
                lg="4"
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
                md="6"
                lg="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">订货单号</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="search.orderNo"
                      placeholder="请输入订货单号"
                      outlined
                      class="white"
                      single-line
                      clearable
                      hide-details
                      dense
                      @click:clear="clearSearchConditions('orderNo')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">商品名称</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="search.goodName"
                      placeholder="请输入商品名称"
                      outlined
                      class="white"
                      single-line
                      clearable
                      hide-details
                      dense
                      @click:clear="clearSearchConditions('goodName')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">订单状态</span>
                  </div>
                  <div class="input-group-append">
                    <v-radio-group
                      v-model="search.operate"
                      row
                      dense
                      class="mt-0"
                      hide-details
                    >
                      <v-radio
                        v-for="item in status"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                        color="primary"
                      />
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">收款状态</span>
                  </div>
                  <div class="input-group-append">
                    <v-radio-group
                      v-model="search.amontStatus"
                      row
                      dense
                      class="mt-0"
                      hide-details
                    >
                      <v-radio
                        v-for="item in amontStatus"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                        color="primary"
                      />
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">下单方式</span>
                  </div>
                  <div class="input-group-append">
                    <v-radio-group
                      v-model="search.orderType"
                      row
                      dense
                      class="mt-0"
                      hide-details
                    >
                      <v-radio
                        v-for="item in orderType"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                        color="primary"
                      />
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions class="pb-4">
          <v-btn
            color="secondary"
            class="ml-4"
            text
            @click="$refs.form.reset()"
          >
            清空
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="dialogSearch = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchOrders"
          >
            搜索
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
  name: 'OrderList',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeTab: 0,
      search: {
        operate: '1',
        orderType: '0',
        amontStatus: '0',
      },
      loadingDataItems: false,
      sortTypes: [
        { text: '按下单时间降序', value: '2' },
        { text: '按下单时间升序', value: '1' },
        { text: '按订单金额降序', value: '4' },
        { text: '按订单金额升序', value: '3' },
        { text: '按订单状态降序', value: '6' },
        { text: '按订单状态升序', value: '5' },
      ],
      sortType: { text: '按下单时间降序', value: '2' },
      menuStart: false,
      menuEnd: false,
      dialogDistribute: false,
      distributing: false,
      dialogSearch: false,
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
      currentStatus: '全部订单',
      selectedOrders: [],
      searchStatus: false,
      searchStr: '',
      status: [
        {
          text: '全部订单',
          value: '1',
        },
        {
          text: '待审核',
          value: '2',
        },
        {
          text: '待支付',
          value: '3',
        },
        {
          text: '待发货',
          value: '4',
        },
        {
          text: '待确认',
          value: '5',
        },
        {
          text: '已完成',
          value: '6',
        },
        {
          text: '已作废',
          value: '7',
        },
      ],
      amontStatus: [
        { text: '全部', value: '0' },
        { text: '未收款', value: '1' },
        { text: '部分收款', value: '3' },
        { text: '完成收款', value: '4' },
      ],
      orderType: [
        { text: '全部', value: '0' },
        { text: '代下单', value: '4' },
        { text: '自主下单', value: '1' },
      ],
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
      pageEnter: 1,
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
  created() {
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: false,
        to: { name: 'home' },
        exact: true,
      },
      {
        text: '订单列表',
        disabled: true,
        exact: true,
      },
    ]);
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
    distributeOrder() {},
    searchOrders() {
      this.dialogSearch = false;
      this.searchStatus = true;
      this.getOrderList(this.search);
    },
    clearSearchConditions(target) {
      this.search[target] = '';
    },
    clearAdvancedSearch() {
      this.searchStatus = false;
      this.search = {
        operate: '1',
        orderType: '0',
        amontStatus: '0',
      };
      this.getOrderList();
    },
    searchOrderByStatus(item) {
      this.currentStatus = item.text;
      this.$set(this.search, 'operate', item.value);
      this.getOrderList(this.search);
    },
    getOrderList(params) {
      this.loadingDataItems = true;
      this.getOrderListAsync(
        R.mergeRight(
          {
            sortType: this.sortType.value,
            operate: '1',
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
    // 取消订单
    cancelOrder() {
      this.canceling = true;
      this.cancelOrderAsync({
        sectionId: this.$store.state.user.sectionId,
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
        sectionId: this.$store.state.user.sectionId,
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
        sectionId: this.$store.state.user.sectionId,
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
        sectionId: this.$store.state.user.sectionId,
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
        sectionId: this.$store.state.user.sectionId,
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
