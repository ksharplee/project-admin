<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      供应商列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加供应商
      </v-btn>
    </div>
    <!--  -->
    <v-card>
      <v-card-text>
        <v-row class="mb-3">
          <v-col
            cols="12"
            md="4"
            lg="3"
            xl="2"
          >
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">供应商名称</span>
              </div>
              <div class="input-group-control">
                <v-text-field
                  v-model="search.dnames"
                  placeholder="请输入供应商名称"
                  outlined
                  class="white"
                  single-line
                  dense
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
                  outlined
                  class="white"
                  single-line
                  dense
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
                <span class="input-group-text">状态</span>
              </div>
              <div class="input-group-control">
                <v-select
                  v-model="search.locked"
                  :items="lockedOptions"
                  placeholder="请选择供应商状态"
                  class="white"
                  single-line
                  dense
                  outlined
                  clearable
                  no-data-text="暂无数据"
                  hide-details
                  @click:clear="clearSearchByConditions('locked')"
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
        <v-data-table
          :headers="headers"
          :items="supplierList.data.items"
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
                <td>{{ item.dnames }}</td>
                <td>{{ item.contacter }}</td>
                <td>{{ item.mobile }}</td>
                <td>{{ item.account }}</td>
                <td :class="item.locked === '0' ? 'success--text' : 'grey--text'">
                  {{ item.locked | locked }}
                </td>
                <td>{{ item.createTime | dateTruncate(16) }}</td>
                <td>
                  <!-- TODO: 分配供应商账号，输入账号密码 -->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        class="mx-1"
                        v-on="on"
                        @click="toViewSupplier = item;dialogView = true"
                      >
                        <v-icon color="primary">
                          mdi-cloud-search
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>查看详情</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        class="mx-1"
                        v-on="on"
                      >
                        <v-icon color="orange">
                          mdi-file-document-box-search
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>查看订单</span>
                  </v-tooltip>
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
            <v-divider />
            <div
              v-if="supplierList.status && supplierList.data.items.length"
              class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
            >
              <div class="mr-2">
                共<span class="error--text">{{ supplierList.data.totalItem }}</span>供应商
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
      </v-card-text>
    </v-card>
    <supplier-single
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
    <v-dialog
      v-model="dialogView"
      max-width="600"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          供应商详情
        </v-card-title>
        <v-card-text class="pt-4 black--text body-1">
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              供应商名称：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.dnames }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              登录账号：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.account }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              联系人：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.contacter }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              联系电话：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.mobile }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              详细地址：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.addressPart }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              微信账号：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.weChat }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              状态：
            </v-col>
            <v-col
              cols="6"
              :class="toViewSupplier.locked === '0' ? 'success--text' : 'error--text'"
            >
              {{ toViewSupplier.locked === '0' ? '启用' : '停用' }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              QQ号码：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.qq }}
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              描述：
            </v-col>
            <v-col cols="6">
              {{ toViewSupplier.desce }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="secondary"
            @click="dialogView = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import SupplierSingle from '@/components/SupplierSingle.vue';

export default {
  name: 'SupplierList',
  components: { SupplierSingle },
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
      dialogView: false,
      deleting: false,
      toDeleteSupplier: '',
      edit: true,
      target: {},
      search: {},
      toViewSupplier: {},
      headers: [
        {
          text: '供应商名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '联系人',
          value: 'contacter',
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
          text: '登录账号',
          value: 'account',
          align: 'center',
          sortable: false,
        },
        {
          text: '状态',
          value: 'locked',
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
      lockedOptions: [
        {
          text: '启用',
          value: '0',
        },
        {
          text: '停用',
          value: '1',
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('supplier', ['supplierList']),
    page: {
      set(value) {
        this.supplierList.data.p = value;
      },
      get() {
        return +this.supplierList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.supplierList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.supplierList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '供应商列表',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.supplierList.status) {
    this.$store.commit('START_LOADING');
    this.getSupplierList();
    // }
  },
  methods: {
    ...mapActions('supplier', ['getSupplierListAsync', 'deleteSupplierAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getSupplierList();
      } else {
        this.pageEnter = 1;
      }
    },
    // 获取供应商列表
    getSupplierList(params) {
      this.loadingDataItems = true;
      this.getSupplierListAsync(params)
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
      this.getSupplierList();
    },
    // 删除供应商
    deleteSupplier() {
      this.deleting = true;
      this.deleteSupplierAsync({ id: this.toDeleteSupplier })
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
    searchByConditions() {
      this.getSupplierList(this.search);
    },
    clearSearchAllConditions() {
      this.$refs.form.reset();
      this.getSupplierList();
    },
    clearSearchByConditions(target) {
      this.search[target] = '';
      this.getSupplierList(this.search);
    },
  },
};
</script>
