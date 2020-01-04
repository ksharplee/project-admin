<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      订货单列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{ name: 'order_add' }"
      >
        <v-icon left>
          mdi-plus
        </v-icon>代客下单
      </v-btn>
    </div>

    <v-form ref="form">
      <v-row class="mb-2">
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
          md="4"
          lg="3"
          xl="2"
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
          md="4"
          lg="3"
          xl="2"
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
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">商品货号</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.goodNo"
                placeholder="请输入商品货号"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions('goodNo')"
              />
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchOrders"
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
      <v-tabs
        v-model="activeTab"
        background-color="secondary accent-4"
        class="elevation-1"
        dark
        @change="getActiveTab"
      >
        <v-tabs-slider color="yellow accent-4" />
        <v-tab
          v-for="(tab,i) in tabs"
          :key="i"
          :value="i"
        >
          {{ tab }}
        </v-tab>
        <v-tab-item
          v-for="(tab,i) in tabs"
          :key="i"
          :value="i"
        >
          <v-card
            flat
            tile
          >
            <order-list-component
              :index="i"
              :search="search"
              :loading="loadingTab[i]"
              :confirm-search="confirmSearch[i]"
            />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-form>
  </div>
</template>

<script>
// import * as R from 'ramda';
// import { mapState, mapActions } from 'vuex';
import OrderListComponent from '@/components/OrderListComponent.vue';

export default {
  name: 'OrderList',
  components: {
    OrderListComponent,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    active: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      activeTab: 0,
      search: {},
      tabs: [
        '全部订单',
        '待审核',
        '待支付',
        '待发货',
        '待确认',
        '已完成',
        '已作废',
      ],
      loadingTab: [true, false, false, false, false, false, false],
      confirmSearch: [false, false, false, false, false, false, false],
    };
  },
  computed: {
    disallowSearch() {
      return (
        !this.search.goodName
        && !this.search.goodNo
        && !this.search.buyerName
        && !this.search.orderNo
      );
    },
  },
  created() {
    this.activeTab = +this.active;
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
  },
  methods: {
    searchOrders() {
      if (this.disallowSearch) {
        return;
      }
      this.confirmSearchClick(this.activeTab);
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.confirmSearchClick(this.activeTab);
    },
    resetSearchConditions() {
      if (this.disallowSearch) {
        return;
      }
      this.$refs.form.reset();
      this.confirmSearchClick(this.activeTab);
    },
    confirmSearchClick(v) {
      this.$set(this.confirmSearch, v, !this.confirmSearch[v]);
    },
    getActiveTab(v) {
      this.loadingTab = [false, false, false, false, false, false, false];
      this.$set(this.loadingTab, v, true);
    },
  },
};
</script>
