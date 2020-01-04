<template>
  <v-dialog
    v-model="dialog"
    max-width="1000"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        选择客户
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container
            fluid
            class="pa-4"
          >
            <v-row class="mb-4">
              <v-col
                cols="12"
                md="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">客户名称</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="search.dnames"
                      placeholder="请输入客户名称"
                      outlined
                      dense
                      single-line
                      clearable
                      hide-details
                      @click:clear="clearSearchConditions('dnames')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">手机号码</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="search.mobile"
                      placeholder="请输入客户手机号码"
                      outlined
                      dense
                      single-line
                      clearable
                      hide-details
                      @click:clear="clearSearchConditions('mobile')"
                    />
                  </div>
                </div>
              </v-col>
              <v-col align-self="center">
                <v-btn
                  color="primary mr-2"
                  depressed
                  @click="searchCustomers"
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
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="customerListForSearch.data.items"
              :loading="loadingDataItems"
              :items-per-page="20"
              loading-text="加载中，请稍候..."
              class="text-center elevation-1"
              single-select
              show-select
              no-data-text="暂无数据"
              hide-default-footer
              fixed-header
            >
              <template v-slot:footer>
                <v-divider />
                <div
                  v-if="customerListForSearch.status && customerListForSearch.data.items.length"
                  class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
                >
                  <div class="mr-2">
                    共<span class="error--text">{{ customerListForSearch.data.totalItem }}</span>客户
                  </div>
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                    :total-visible="7"
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
          </v-container>
          <v-card-actions class="grey lighten-3">
            <div class="flex-grow-1" />
            <v-btn
              color="primary"
              :disabled="!selected.length"
              @click="returnSelectedValue"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="$emit('close-dialog')"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
  name: 'CustomerList',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    selectedCustomer: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loadingDataItems: false,
      search: {},
      selected: [],
      headers: [
        {
          text: '姓名',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '手机号码',
          value: 'mobile',
          align: 'center',
          sortable: false,
        },
        {
          text: '会员等级',
          value: 'gradeName',
          align: 'center',
          sortable: false,
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('customer', ['customerListForSearch']),
    page: {
      set(value) {
        this.customerListForSearch.data.p = value;
      },
      get() {
        return +this.customerListForSearch.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.customerListForSearch.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.customerListForSearch.data.totalItem
          / process.env.VUE_APP_ITEMPERPAGE
      );
    },
  },
  watch: {
    dialog() {
      if (!this.customerListForSearch.status) {
        this.getCustomerList();
      }
    },
  },
  created() {
    this.selected = this.selectedCustomer;
  },
  methods: {
    ...mapActions('customer', ['getCustomerListForSearchAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getCustomerList();
      } else {
        this.pageEnter = 1;
      }
    },
    getCustomerList(params) {
      this.loadingDataItems = true;
      this.getCustomerListForSearchAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    searchCustomers() {
      this.getCustomerList(this.search);
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.getCustomerList(this.search);
    },
    resetSearchConditions() {
      this.$refs.form.reset();
      this.getCustomerList();
    },
    changePagination() {
      this.getCustomerList(this.search);
    },
    returnSelectedValue() {
      this.$emit('update:selected', this.selected);
      this.$emit('close-dialog');
    },
  },
};
</script>
