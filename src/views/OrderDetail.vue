<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      订单详情
    </div>
    <v-divider class="my-4" />
    <v-tabs
      v-model="activeTab"
      background-color="secondary accent-4"
      dark
    >
      <v-tabs-slider color="yellow accent-4" />
      <v-tab
        v-for="(tab,i) in tabs"
        :key="i"
        :value="i"
      >
        {{ tab }}
      </v-tab>
      <v-tab-item :value="0">
        <v-card
          flat
          tile
        >
          <component
            :is="orderDetailTab"
            :order="order"
            @update:changeTab="activeTab = $event"
            @update:refresh="getOrderDetail"
          />
        </v-card>
      </v-tab-item>
      <v-tab-item :value="1">
        <v-card
          flat
          tile
        >
          <component
            :is="orderShippingTab"
            :order="order"
            @update:refresh="getOrderDetail"
          />
        </v-card>
      </v-tab-item>
      <v-tab-item :value="2">
        <v-card
          flat
          tile
        >
          <component
            :is="orderPaymentTab"
            :order="order"
            @update:refresh="getOrderDetail"
          />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
// import * as R from 'ramda';
import { mapActions } from 'vuex';
import OrderDetailTab from '@/components/OrderDetailTab.vue';
import OrderShippingTab from '@/components/OrderShippingTab.vue';
import OrderPaymentTab from '@/components/OrderPaymentTab.vue';

export default {
  name: 'OrderDetail',
  props: {
    id: {
      type: String,
      default: '',
    },
    currentTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeTab: 0,
      tabs: ['订单详情', '发货记录', '收款记录'],
      orderDetailTab: null,
      orderShippingTab: null,
      orderPaymentTab: null,
      order: {},
    };
  },
  created() {
    this.activeTab = +this.currentTab;
    this.getOrderDetail();
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: false,
        to: { name: 'home' },
        exact: true,
      },
      {
        text: '订单列表',
        disabled: false,
        to: { name: 'order_list', params: { active: '0' } },
        exact: true,
      },
      {
        text: '订单详情',
        disabled: true,
        exact: true,
      },
    ]);
  },
  methods: {
    ...mapActions('order', ['getOrderDetailAsync']),
    getOrderDetail() {
      this.$store.commit('START_LOADING');
      this.getOrderDetailAsync({ id: this.id })
        .then((res) => {
          this.order = res;
          this.orderDetailTab = OrderDetailTab;
          this.orderShippingTab = OrderShippingTab;
          this.orderPaymentTab = OrderPaymentTab;
        })
        .catch((err) => {
          this.checkErr(err, 'getOrderDetailAsync');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
  },
};
</script>
