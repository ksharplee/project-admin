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
          meta: {
            required: true,
            id: '500',
          },
        },
        {
          path: 'system/qrcode',
          name: 'qrcode',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemQrcode.vue'),
          meta: {
            required: true,
            id: '77',
          },
        },
        {
          path: 'system/basic-info',
          name: 'basic_info',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemBasicInfo.vue'),
          meta: {
            required: true,
            id: '76',
          },
        },
        {
          path: 'system/order-sequence',
          name: 'order_sequence',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemOrderSequenceList.vue'),
          meta: {
            required: true,
            id: '70',
          },
        },
        {
          path: 'system/employee-list',
          name: 'employee_list',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeList.vue'),
          meta: {
            required: true,
            id: '248',
          },
        },
        {
          path: 'system/employee-add',
          name: 'employee_add',
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeSingle.vue'),
          meta: {
            required: true,
            id: '243',
          },
        },
        {
          path: 'system/employee-edit/id=:id',
          name: 'employee_edit',
          props: true,
          component: () => import(/* webpackChunkName: "group-system" */ './views/SystemEmployeeSingle.vue'),
          meta: {
            required: true,
            id: '244',
          },
        },
        {
          path: 'product/list',
          name: 'product_list',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductList.vue'),
          meta: {
            required: true,
            id: '320',
          },
        },
        {
          path: 'product/add',
          name: 'product_add',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductAdd.vue'),
          meta: {
            required: true,
            id: '300',
          },
        },
        {
          path: 'product/edit/id=:id',
          name: 'product_edit',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductEdit.vue'),
          meta: {
            required: true,
            id: '301',
          },
        },
        {
          path: 'product/detail/id=:id',
          name: 'product_detail',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductDetail.vue'),
          meta: {
            required: true,
            id: '321',
          },
        },
        {
          path: 'product/unit',
          name: 'product_unit',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductUnits.vue'),
          meta: {
            required: true,
            id: '68',
          },
        },
        {
          path: 'product/brand',
          name: 'product_brand',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductBrand.vue'),
          meta: {
            required: true,
            id: '356',
          },
        },
        {
          path: 'product/category',
          name: 'product_category',
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductCategory.vue'),
          meta: {
            required: true,
            id: '27',
          },
        },
        {
          path: 'product/spec/id=:id&&cate=:cate',
          name: 'product_spec',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductSpec.vue'),
          meta: {
            required: true,
            id: '53',
          },
        },
        {
          path: 'product/attr/id=:id&&cate=:cate',
          name: 'product_attr',
          props: true,
          component: () => import(/* webpackChunkName: "group-product" */ './views/ProductAttr.vue'),
          meta: {
            required: true,
            id: '38',
          },
        },
        {
          path: 'supplier/list',
          name: 'supplier_list',
          component: () => import(/* webpackChunkName: "group-supplier" */ './views/SupplierList.vue'),
          meta: {
            required: true,
            id: '219',
          },
        },
        {
          path: 'customer/list',
          name: 'customer_list',
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerList.vue'),
          meta: {
            required: true,
            id: '261',
          },
        },
        {
          path: 'customer/grade/list',
          name: 'customer_grade_list',
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerGradeList.vue'),
          meta: {
            required: true,
            id: '252',
          },
        },
        {
          path: 'customer/shippig/list/id=:id&&uid=:uid',
          name: 'customer_shippig_list',
          props: true,
          component: () => import(/* webpackChunkName: "group-customer" */ './views/CustomerShippingList.vue'),
          meta: {
            required: true,
            id: '354',
          },
        },
        // 权限
        {
          path: 'authority/department',
          name: 'authority_department',
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityDepartment.vue'),
          meta: {
            required: true,
            id: '6504',
          },
        },
        {
          path: 'authority/role',
          name: 'authority_role',
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityRole.vue'),
          meta: {
            required: true,
            id: '6524',
          },
        },
        {
          path: 'authority/role/add',
          name: 'authority_role_add',
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityRoleSingle.vue'),
          meta: {
            required: true,
            id: '6521',
          },
        },
        {
          path: 'authority/role/edit/id=:id',
          name: 'authority_role_edit',
          props: true,
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityRoleSingle.vue'),
          meta: {
            required: true,
            id: '6522',
          },
        },
        {
          path: 'authority/employee/right/id=:id&&name=:name&&mobile=:mobile',
          name: 'authority_employee_right',
          props: true,
          component: () => import(/* webpackChunkName: "group-authority" */ './views/AuthorityEmployeeRight.vue'),
          meta: {
            required: true,
            id: '6541',
          },
        },
        // 财务
        {
          path: 'finance/invoice/list',
          name: 'finance_invoice',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinanceInvoiceList.vue'),
          meta: {
            required: true,
            id: '4000',
          },
        },
        {
          path: 'finance/payment-list',
          name: 'finance_payment',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentList.vue'),
          meta: {
            required: true,
            id: '4004',
          },
        },
        {
          path: 'finance/bank/list',
          name: 'finance_bank',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinanceBankList.vue'),
          meta: {
            required: true,
            id: '4008',
          },
        },
        {
          path: 'finance/payment-add',
          name: 'finance_payment_add',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentAdd.vue'),
          meta: {
            required: true,
            id: '4009',
          },
        },
        {
          path: 'finance/payment-order/list',
          name: 'finance_payment_order_list',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/FinancePaymentOrderList.vue'),
          meta: {
            required: true,
            id: '1111',
          },
        },
        // 订单
        {
          path: 'order/add',
          name: 'order_add',
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderAdd.vue'),
          meta: {
            required: true,
            id: '1034',
          },
        },
        {
          path: 'order/list/active=:active',
          name: 'order_list',
          props: true,
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderList.vue'),
          meta: {
            required: true,
            id: '1052',
          },
        },
        {
          path: 'order/detail/id=:id&&tab=:currentTab',
          name: 'order_detail',
          props: true,
          component: () => import(/* webpackChunkName: "group-finance" */ './views/OrderDetail.vue'),
          meta: {
            required: true,
            id: '1053',
          },
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
