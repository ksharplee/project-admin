import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'home',
          component: Dashboard,
        },
        {
          path: 'system/ads',
          name: 'ads',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemAds.vue'),
        },
        {
          path: 'system/qrcode',
          name: 'qrcode',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemQrcode.vue'),
        },
        {
          path: 'system/basic-info',
          name: 'basic_info',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemBasicInfo.vue'),
        },
        {
          path: 'system/order-sequence',
          name: 'order_sequence',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemOrderSequenceLIst.vue'),
        },
        {
          path: 'system/employee-list',
          name: 'employee_list',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeList.vue'),
        },
        {
          path: 'system/employee-add',
          name: 'employee_add',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeSingle.vue'),
        },
        {
          path: 'system/employee-edit/id=:id',
          name: 'employee_edit',
          props: true,
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeSingle.vue'),
        },
        {
          path: 'product/list',
          name: 'product_list',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductList.vue'),
        },
        {
          path: 'product/add',
          name: 'product_add',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductAdd.vue'),
        },
        {
          path: 'product/edit/id=:id',
          name: 'product_edit',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductEdit.vue'),
        },
        {
          path: 'product/detail/id=:id',
          name: 'product_detail',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductDetail.vue'),
        },
        {
          path: 'product/unit',
          name: 'product_unit',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductUnits.vue'),
        },
        {
          path: 'product/brand',
          name: 'product_brand',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductBrand.vue'),
        },
        {
          path: 'product/category',
          name: 'product_category',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductCategory.vue'),
        },
        {
          path: 'product/spec/id=:id&&cate=:cate',
          name: 'product_spec',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductSpec.vue'),
        },
        {
          path: 'product/attr/id=:id&&cate=:cate',
          name: 'product_attr',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductAttr.vue'),
        },
        {
          path: 'supplier/list',
          name: 'supplier_list',
          component: () => import(/* webpackChunkName: "group-supplier" */ './views/SupplierList.vue'),
        },
        {
          path: 'customer/list',
          name: 'customer_list',
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerList.vue'),
        },
        {
          path: 'customer/grade/list',
          name: 'customer_grade_list',
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerGradeList.vue'),
        },
        {
          path: 'customer/shippig/list/id=:id&&uid=:uid',
          name: 'customer_shippig_list',
          props: true,
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerShippingList.vue'),
        },
        // 权限
        {
          path: 'authority/department',
          name: 'authority_department',
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityDepartment.vue'),
        },
        // 财务
        {
          path: 'finance/invoice/list',
          name: 'finance_invoice',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinanceInvoiceList.vue'),
        },
        {
          path: 'finance/payment-list',
          name: 'finance_payment',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentList.vue'),
        },
        {
          path: 'finance/bank/list',
          name: 'finance_bank',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinanceBankList.vue'),
        },
        {
          path: 'finance/payment-add',
          name: 'finance_payment_add',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentAdd.vue'),
        },
        {
          path: 'finance/payment-order/list',
          name: 'finance_payment_order_list',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentOrderList.vue'),
        },
        // 订单
        {
          path: 'order/add',
          name: 'order_add',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderAdd.vue'),
        },
        {
          path: 'order/list',
          name: 'order_list',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderList.vue'),
        },
        {
          path: 'order/detail/id=:id&&tab=:currentTab',
          name: 'order_detail',
          props: true,
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderDetail.vue'),
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
