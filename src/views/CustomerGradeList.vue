<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      客户等级
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加等级
      </v-btn>
    </div>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="customerGradeList.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
            >
              <!-- <td>{{ item.sort }}</td> -->
              <td>
                <div class="d-inline-flex align-center">
                  {{ item.dnames }}<v-chip
                    v-if="item.default === '1'"
                    color="error"
                    class="ml-2"
                    small
                  >
                    默认
                  </v-chip>
                </div>
              </td>
              <td>{{ item.rebate }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="target = item;edit = true;dialogSingle = true"
                    >
                      <v-icon color="teal">
                        mdi-pencil-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>编辑</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="dialogDelete = true;toDeleteGrade = item.id"
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
      </v-data-table>
    </v-card>
    <customer-grade-single
      :edit="edit"
      :target="target"
      :show="dialogSingle"
      @close-dialog="dialogSingle = false"
    />
    <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定删除吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteSupplier"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogDelete = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import CustomerGradeSingle from '@/components/CustomerGradeSingle.vue';

export default {
  name: 'CustomerGradeList',
  components: { CustomerGradeSingle },
  filters: {
    locked(v) {
      if (v === '0') {
        return '启用';
      }
      return '停用';
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteGrade: '',
      edit: true,
      target: {},
      headers: [
        // {
        //   text: "排序",
        //   value: "sort",
        //   align: "center",
        //   sortable: false
        // },
        {
          text: '等级名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '折扣率（百分比 例如：80为8折）',
          value: 'rebate',
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
      // useOptions: [
      //   {
      //     text: '启用',
      //     value: '0',
      //   },
      //   {
      //     text: '停用',
      //     value: '1',
      //   },
      // ],
    };
  },
  computed: {
    ...mapState('customer', ['customerGradeList']),
    page: {
      set(value) {
        this.customerGradeList.data.p = value;
      },
      get() {
        return +this.customerGradeList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.customerGradeList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.customerGradeList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '客户列表',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.customerGradeList.status) {
    this.$store.commit('START_LOADING');
    this.getCustomerGradeList();
    // }
  },
  methods: {
    ...mapActions('customer', [
      'getCustomerGradeListAsync',
      'deleteCustomerGradeAsync',
    ]),
    // 获取客户列表
    getCustomerGradeList(params) {
      this.loadingDataItems = true;
      this.getCustomerGradeListAsync(params)
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
      this.getCustomerGradeList();
    },
    // 删除客户
    deleteSupplier() {
      this.deleting = true;
      this.deleteCustomerGradeAsync({ id: this.toDeleteGrade })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.deleting = false;
          this.dialogDelete = false;
        });
    },
  },
};
</script>
