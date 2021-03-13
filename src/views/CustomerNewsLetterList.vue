<template>
  <div>
    <div class="title pb-3">
      客户订阅
    </div>
    <v-data-table
      :headers="headers"
      :items="customerNewsLetterList.data.items"
      class="text-center"
      no-data-text="暂无数据"
      hide-default-footer
      fixed-header
      :items-per-page="20"
    >
      <template v-slot:footer>
        <v-divider />
        <div
          v-if="customerNewsLetterList.status && customerNewsLetterList.data.items.length"
          class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
        >
          <div class="mr-2">
            共<span class="error--text">{{ customerNewsLetterList.data.totalItem }}</span>条客户订阅
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
    </v-data-table>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CustomerNewsLetterList',
  data() {
    return {
      loadingDataItems: false,
      headers: [
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          sortable: false,
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('customer', ['customerNewsLetterList']),
    page: {
      set(value) {
        this.customerNewsLetterList.data.p = value;
      },
      get() {
        return +this.customerNewsLetterList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.customerNewsLetterList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.customerNewsLetterList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '客户订阅',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getCustomerNewsLetterList();
  },
  methods: {
    ...mapActions('customer', [
      'getCustomerNewsLetterListAsync',
    ]),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getCustomerNewsLetterList();
      } else {
        this.pageEnter = 1;
      }
    },
    // 获取客户列表
    getCustomerNewsLetterList(params) {
      this.loadingDataItems = true;
      this.getCustomerNewsLetterListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 点击分页
    changePagination() {
      this.getCustomerNewsLetterList();
    },
  },
};
</script>
