<template>
  <div>
    <div class="title pb-3">
      客户反馈
    </div>
    <v-data-table
      :headers="headers"
      :items="customerFeedbackList.data.items"
      class="text-center"
      no-data-text="暂无数据"
      hide-default-footer
      fixed-header
      :items-per-page="20"
    >
      <template v-slot:item.action="{item}">
        <v-btn
          icon
          @click="feedback = item;dialog = true"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <template v-slot:footer>
        <v-divider />
        <div
          v-if="customerFeedbackList.status && customerFeedbackList.data.items.length"
          class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
        >
          <div class="mr-2">
            共<span class="error--text">{{ customerFeedbackList.data.totalItem }}</span>条客户反馈
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
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4 align-center">
          From: {{ feedback.company }}
          <v-btn
            icon
            small
            class="ml-auto"
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-container class="pb-4 px-4">
          <v-row>
            <v-col
              cols="2"
              class="grey--text"
            >
              Subject:
            </v-col><v-col cols="10">
              {{ feedback.subject }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="2"
              class="grey--text"
            >
              Content:
            </v-col><v-col cols="10">
              {{ feedback.content }}
            </v-col>
          </v-row>
          <!-- <div class="mb-2">
            <span class="grey--text">Subject:</span> <span class="black--text ml-2">{{ feedback.subject }}</span>
          </div>
          <div class="grey--text">
            <div>Content:</div>
          </div> -->
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CustomerFeedbackList',
  data() {
    return {
      loadingDataItems: false,
      valid: true,
      dialog: false,
      feedback: {},
      headers: [
        {
          text: '公司',
          value: 'company',
          align: 'left',
          sortable: false,
        },
        {
          text: '主题',
          value: 'subject',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          sortable: false,
        },
        {
          text: '手机号码',
          value: 'phone',
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
    ...mapState('customer', ['customerFeedbackList']),
    page: {
      set(value) {
        this.customerFeedbackList.data.p = value;
      },
      get() {
        return +this.customerFeedbackList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.customerFeedbackList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.customerFeedbackList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '客户反馈',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getCustomerFeedbackList();
  },
  methods: {
    ...mapActions('customer', [
      'getCustomerFeedbackListAsync',
    ]),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getCustomerFeedbackList();
      } else {
        this.pageEnter = 1;
      }
    },
    // 获取客户列表
    getCustomerFeedbackList(params) {
      this.loadingDataItems = true;
      this.getCustomerFeedbackListAsync(params)
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
      this.getCustomerFeedbackList();
    },
  },
};
</script>
