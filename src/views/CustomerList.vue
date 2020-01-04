<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="customerList.data.items"
      class="text-center"
      no-data-text="暂无数据"
      hide-default-footer
      fixed-header
      :items-per-page="20"
    >
      <template v-slot:top>
        <div
          class="text-left d-flex align-center mb-3"
          style="height: 36px"
        >
          <v-menu
            offset-y
          >
            <template v-slot:activator="{ on, value }">
              <v-btn
                text
                class="px-1 ml-2"
                v-on="on"
              >
                {{ currentGrade }} <v-icon
                  :class="value ? 'rotate-180' : ''"
                >
                  mdi-chevron-down mdi-18px
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in customerGradeLocal"
                :key="index"
                @click="searchCustomerByGradeId(item)"
              >
                <v-list-item-title class="body-2">
                  {{ item.dnames }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <div
            class="input-group ml-4"
            style="width:300px"
          >
            <div class="input-group-control">
              <v-text-field
                v-model="search.dnames"
                placeholder="请输入客户姓名"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchByConditions('dnames')"
              />
            </div>
            <div class="input-group-append">
              <v-btn
                color="blue-grey lighten-4 px-0"
                depressed
                x-small
                @click="searchByConditions"
              >
                <v-icon
                  color="blue-grey darken-2"
                >
                  mdi-magnify mdi-18px
                </v-icon>
              </v-btn>
            </div>
          </div>
          <v-spacer />
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
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
          >
            <td>{{ item.defaulte === '1' ? '默认客户' : item.account }}</td>
            <td>{{ item.defaulte === '1' ? '默认客户' : item.dnames }}</td>
            <td>{{ item.defaulte === '1' ? '默认客户' : item.mobile }}</td>
            <td :class="item.gradeName ? '' : 'grey--text'">
              {{ item.gradeName ? item.gradeName : '无' }}
            </td>
            <td>{{ item.sectionName ? item.sectionName : '无' }}</td>
            <td>{{ item.sellMenName ? item.sellMenName : '无' }}</td>
            <td>{{ item.createTime | dateTruncate(16) }}</td>
            <td>
              <v-menu
                offset-y
                left
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="secondary"
                    v-on="on"
                  >
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    :disabled="item.defaulte === '1'"
                    :to="{ name: 'customer_shippig_list', params: { id: item.buyerId, uid: item.buyerUid }}"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        :color="item.defaulte === '1' ? '#999' : ''"
                        small
                      >
                        mdi-truck
                      </v-icon>收货地址
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="item.defaulte === '1'"
                    @click="target = item;edit = true;dialogSingle = true"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        :color="item.defaulte === '1' ? '#999' : ''"
                        small
                      >
                        mdi-pencil-circle
                      </v-icon>编辑
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="item.defaulte === '1'"
                    @click="dialogDelete = true;toDeleteCustomer = item.id"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        :color="item.defaulte === '1' ? '#999' : ''"
                        small
                      >
                        mdi-delete-forever
                      </v-icon>删除
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:footer>
        <v-divider />
        <div
          v-if="customerList.status && customerList.data.items.length"
          class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
        >
          <div class="mr-2">
            共<span class="error--text">{{ customerList.data.totalItem }}</span>客户
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
import * as R from 'ramda';
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
      toDeleteCustomer: '',
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
          text: '所属部门',
          value: 'sectionName',
          align: 'center',
          sortable: false,
        },
        {
          text: '负责员工',
          value: 'sellMenName',
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
      currentGrade: '全部等级',
      pageEnter: 1,
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
    customerGradeLocal() {
      return R.prepend({
        id: '',
        dnames: '全部等级',
      }, this.customerGradeList.data);
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
    searchCustomerByGradeId(item) {
      this.currentGrade = item.dnames;
      this.$set(this.search, 'gradeId', item.id);
      this.searchByConditions();
    },
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
      this.deleteCustomerAsync({ id: this.toDeleteCustomer })
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
