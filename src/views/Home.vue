<template>
  <v-container
    fill-height
    fluid
    align-start
    class="pb-0"
  >
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
      color="secondary darken-3"
      dark
      width="220"
    >
      <v-list class="py-0">
        <v-list-item
          :to="{ name: 'home' }"
          exact
          active-class="primary darken-4"
        >
          <v-list-item-icon>
            <v-icon class="mdi-18px">
              mdi-home
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>首页</v-list-item-title>
        </v-list-item>
        <v-list-group
          v-for="item in navs"
          :key="item.text"
          v-model="item.model"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="mdi-18px">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
            :to="child.url"
            exact
            active-class="primary darken-4"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="secondary darken-4 elevation-1"
      dark
      clipped-left
    >
      <v-toolbar-title class="d-flex align-center">
        <v-app-bar-nav-icon
          class="mr-4"
          @click.stop="drawer = !drawer"
        />
        <span class="title">
          九域科技
        </span>
      </v-toolbar-title>
      <div class="flex-grow-1 ml-12">
        {{ user.userName }}，欢迎登录<span v-if="user.companyName">【{{ user.companyName }}】</span>后台管理系统!
      </div>
      <v-btn
        color="primary"
        @click="loginOut"
      >
        <v-icon left>
          mdi-power-standby
        </v-icon>退出登录
      </v-btn>
    </v-app-bar>
    <v-content class="height-100">
      <div style="background-color: #f6fbfd">
        <v-breadcrumbs
          :style="{ left: drawer ? '220px' : '0' }"
          :items="breadCrumbs"
          class="py-2 pl-4 pt-4"
        />
      </div>
      <transition :name="transitionName">
        <router-view
          class="child-view mx-2 white pa-4"
        />
      </transition>
    </v-content>
    <!-- <v-footer
      app
      inset
      class="body-2 grey--text justify-center align-center py-3"
      elevation="2"
    >
      Copyright © 九域科技, All Rights Reserved
    </v-footer> -->
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import * as R from 'ramda';

export default {
  data: () => ({
    drawer: null,
    transitionName: 'v-slide-x-transition',
    navs: [
      {
        icon: 'mdi-view-split-vertical',
        text: '商品',
        model: false,
        children: [
          { text: '商品列表', url: { name: 'product_list' } },
          { text: '类别管理', url: { name: 'product_category' } },
          { text: '品牌管理', url: { name: 'product_brand' } },
          { text: '单位管理', url: { name: 'product_unit' } },
        ],
      },
      {
        icon: 'mdi-account',
        text: '客户',
        model: false,
        children: [
          { text: '客户列表', url: { name: 'customer_list' } },
          { text: '客户等级', url: { name: 'customer_grade_list' } },
        ],
      },
      {
        icon: 'mdi-clipboard-text',
        text: '订单',
        model: false,
        children: [
          {
            text: '订货单',
            url: { name: 'order_list', params: { active: '0' } },
          },
          // { text: '退货单', url: { name: '' } },
          { text: '代客下单', url: { name: 'order_add' } },
        ],
      },
      {
        icon: 'mdi-account-multiple',
        text: '供应商',
        model: false,
        children: [{ text: '供应商列表', url: { name: 'supplier_list' } }],
      },
      {
        icon: 'mdi-account-card-details',
        text: '员工/部门',
        model: false,
        children: [
          { text: '部门设置', url: { name: 'authority_department' } },
          { text: '角色管理', url: { name: 'authority_role' } },
          { text: '员工设置', url: { name: 'employee_list' } },
        ],
      },
      {
        icon: 'mdi-warehouse',
        text: '出库入库',
        model: false,
        children: [
          { text: '商品入库', url: { name: 'warehouse_instock_list' } },
          { text: '入库类型', url: { name: 'warehouse_instock_type_list' } },
          { text: '商品出库', url: { name: 'warehouse_outstock_list' } },
          { text: '出库类型', url: { name: 'warehouse_outstock_type_list' } },
          { text: '仓库管理', url: { name: 'warehouse_list' } },
          { text: '商品库存', url: { name: 'warehouse_product_stock' } },
        ],
      },
      {
        icon: 'mdi-settings',
        text: '系统',
        model: false,
        children: [
          { text: '基本信息设置', url: { name: 'basic_info' } },
          { text: '订单处理流程', url: { name: 'order_sequence' } },
          { text: '小程序二维码', url: { name: 'qrcode' } },
          { text: '广告图设置', url: { name: 'ads' } },
        ],
      },
      // {
      //   icon: 'mdi-chart-areaspline-variant',
      //   text: '报表',
      //   model: false,
      //   children: [{ text: '报表数据', url: { name: '' } }],
      // },
      {
        icon: 'mdi-home-currency-usd',
        text: '财务',
        model: false,
        children: [
          { text: '收款单', url: { name: 'finance_payment_order_list' } },
          { text: '新增收款单', url: { name: 'finance_payment_add' } },
          // { text: '订单收款统计', url: { name: '' } },
          { text: '收款账户', url: { name: 'finance_payment' } },
          { text: '发票类型管理', url: { name: 'finance_invoice' } },
          { text: '银行管理', url: { name: 'finance_bank' } },
        ],
      },
    ],
  }),
  computed: {
    ...mapState(['breadCrumbs', 'user']),
    routerArray() {
      return R.pluck('children', this.navs);
    },
    routerNames() {
      return R.map(item => R.map(v => R.path(['url', 'name'], v), item), this.routerArray);
    },
  },
  watch: {
    $route(to, from) {
      const index = R.findIndex(R.includes(to.name), this.routerNames);
      if (index >= 0) {
        const obj = this.navs[index];
        obj.model = true;
        this.$set(this.navs, index, obj);
      }
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    },
  },
  created() {
    const index = R.findIndex(R.includes(this.$router.history.current.name), this.routerNames);
    if (index >= 0) {
      const obj = this.navs[index];
      obj.model = true;
      this.$set(this.navs, index, obj);
    }
  },
  methods: {
    ...mapMutations(['CLEAR_USER']),
    ...mapMutations('system', ['CLEAR_BASIC_INFO']),
    loginOut() {
      this.CLEAR_USER();
      this.CLEAR_BASIC_INFO();
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>
