<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      客户列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加客户
      </v-btn>
    </div>
    <v-divider class="my-4" />
    <v-form ref="form">
      <v-row class="mb-3">
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">客户账号</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.account"
                placeholder="请输入客户账号"
                dense
                outlined
                class="white"
                single-line
                clearable
                hide-details
                @click:clear="clearSearchByConditions('account')"
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
              <span class="input-group-text">客户姓名</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.dnames"
                placeholder="请输入客户姓名"
                dense
                outlined
                class="white"
                single-line
                clearable
                hide-details
                @click:clear="clearSearchByConditions('dnames')"
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
              <span class="input-group-text">手机号码</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.mobile"
                placeholder="请输入手机号码"
                dense
                outlined
                class="white"
                single-line
                clearable
                hide-details
                @click:clear="clearSearchByConditions('mobile')"
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
              <span class="input-group-text">客户等级</span>
            </div>
            <div class="input-group-control">
              <v-select
                v-model="search.gradeId"
                :items="customerGradeList.data"
                :loading="loadingCustomerGrade"
                :disabled="loadingCustomerGrade"
                placeholder="请选择客户等级"
                dense
                item-text="dnames"
                item-value="id"
                class="white"
                single-line
                outlined
                clearable
                no-data-text="暂无数据"
                hide-details
                @click:clear="clearSearchByConditions('gradeId')"
              />
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchByConditions"
          >
            搜索
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="clearSearchAllConditions"
          >
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card
      outlined
      elevation="1"
    >
      <v-data-table
        :headers="headers"
        :items="customerList.data.items"
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
              <td>{{ item.account }}</td>
              <td>{{ item.dnames }}</td>
              <td>{{ item.mobile }}</td>
              <td :class="item.gradeName ? '' : 'grey--text'">
                {{ item.gradeName ? item.gradeName : '无' }}
              </td>
              <td>{{ item.createTime | dateTruncate(16) }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      :to="{ name: 'customer_shippig_list', params: { id: item.buyerId, uid: item.buyerUid }}"
                      v-on="on"
                    >
                      <v-icon
                        color="primary"
                        style="margin-top:2px"
                      >
                        mdi-truck
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>收货地址</span>
                </v-tooltip>
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="dialogSetGrade = true;toSetGradeItem = item"
                    >
                      <v-icon color="orange">
                        mdi-star-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>设置等级</span>
                </v-tooltip> -->
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
                      @click="dialogDelete = true;toDeleteSupplier = item.id"
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
        <template v-slot:footer>
          <div
            v-if="customerList.status && customerList.data.items.length"
            class="pa-4 grey lighten-5"
          >
            <v-pagination
              v-model="page"
              :length="pageCount"
              @input="changePagination"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
    <customer-single
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
            @click="deleteCustomer"
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
    <!-- <v-dialog
      v-model="dialogSetGrade"
      max-width="500"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          设置<span class="primary--text">{{ toSetGradeItem.dnames }}</span>客户等级
        </v-card-title>
        <v-card-text class="pt-4 black--text body-1">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="error--text">*</span>等级：
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="toSetGradeItem.gradeId"
                  :items="customerGradeList.data"
                  item-text="dnames"
                  item-value="id"
                  dense
                  class="white"
                  single-line
                  outlined
                  clearable
                  no-data-text="暂无数据"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="settingGrade"
            :disabled="settingGrade"
            @click="setGrade"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogSetGrade = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
// import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import CustomerSingle from '@/components/CustomerSingle.vue';

export default {
  name: 'CustomerList',
  components: { CustomerSingle },
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
      loadingCustomerGrade: false,
      dialogSingle: false,
      dialogDelete: false,
      dialogSetGrade: false,
      deleting: false,
      settingGrade: false,
      toDeleteSupplier: '',
      edit: true,
      valid: true,
      target: {},
      search: {},
      toSetGradeItem: {},
      headers: [
        {
          text: '客户账号',
          value: 'account',
          align: 'center',
          sortable: false,
        },
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
        {
          text: '创建时间',
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
      useOptions: [
        {
          text: '启用',
          value: '0',
        },
        {
          text: '停用',
          value: '1',
        },
      ],
    };
  },
  computed: {
    ...mapState('customer', ['customerList', 'customerGradeList']),
    page: {
      set(value) {
        this.customerList.data.p = value;
      },
      get() {
        return +this.customerList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.customerList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.customerList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
    // if (!this.customerList.status) {
    this.$store.commit('START_LOADING');
    this.getCustomerList();
    // }
    // if (!this.customerGradeList.status) {
    this.loadingCustomerGrade = true;
    const promises = [
      this.getCustomerGradeListAsync(),
      this.getDepartmentListAsync(),
    ];
    Promise.all(promises)
      .catch((err) => {
        this.checkErr(err);
      })
      .finally(() => {
        this.$store.commit('END_LOADING');
        this.loadingCustomerGrade = false;
      });
    // }
  },
  methods: {
    ...mapActions('customer', [
      'getCustomerListAsync',
      'deleteCustomerAsync',
      'getCustomerGradeListAsync',
      'setCustomerGrade',
    ]),
    ...mapActions('authority', ['getDepartmentListAsync']),
    // 获取客户列表
    getCustomerList(params) {
      this.loadingDataItems = true;
      this.getCustomerListAsync(params)
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
      this.getCustomerList();
    },
    // 删除客户
    deleteCustomer() {
      this.deleting = true;
      this.deleteCustomerAsync({ id: this.toDeleteSupplier })
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
    // setGrade() {
    //   this.settingGrade = true;
    //   this.setCustomerGrade({
    //     id: this.toSetGradeItem.id,
    //     gradeId: this.toSetGradeItem.gradeId,
    //   })
    //     .catch((err) => {
    //       this.checkErr(err);
    //     })
    //     .finally(() => {
    //       this.settingGrade = false;
    //       this.dialogSetGrade = false;
    //     });
    // },
    searchByConditions() {
      this.getCustomerList(this.search);
    },
    clearSearchAllConditions() {
      this.$refs.form.reset();
      this.getCustomerList();
    },
    clearSearchByConditions(target) {
      this.search[target] = '';
      this.getCustomerList(this.search);
    },
  },
};
</script>
