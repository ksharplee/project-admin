<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="supplierList.data.items"
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
                {{ currentStatus }} <v-icon
                  :class="value ? 'rotate-180' : ''"
                >
                  mdi-chevron-down mdi-18px
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in status"
                :key="index"
                @click="searchSupplierByStatus(item)"
              >
                <v-list-item-title class="body-2">
                  {{ item.text }}
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
                placeholder="请输入供应商名称"
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
                    @click="toViewSupplier = item;dialogView = true"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        small
                      >
                        mdi-cloud-search
                      </v-icon>详情
                    </v-list-item-title>
                  </v-list-item>
                  <!-- <v-list-item
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        small
                      >
                        mdi-file-document-box-search
                      </v-icon>查看订单
                    </v-list-item-title>
                  </v-list-item> -->
                  <v-list-item
                    @click="target = item;edit = true;dialogSingle = true"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
                        small
                      >
                        mdi-pencil-circle
                      </v-icon>编辑
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="dialogDelete = true;toDeleteSupplier = item.id"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-1"
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
      max-width="1000"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          供应商详情
        </v-card-title>
        <v-card-text class="pt-4 black--text body-1">
          <v-row>
            <v-col cols="6">
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  供应商名称：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.dnames }}
                </v-col>
              </v-row>
              <!-- <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right grey--text"
            >
              登录账号：
            </v-col>
            <v-col cols="8">
              {{ toViewSupplier.account }}
            </v-col>
          </v-row> -->
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  负责人联系电话：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.mobile }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  法人：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.legalPerson }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  主营商品：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.mainGoods }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  微信账号：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.weChat }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  成立时间：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.creationTime }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  年产值：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.annualOutputValue }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  品质：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.quality === '1' ? '优' : toViewSupplier.quality === '2' ? '良' : '差' }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  经营面积：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.businessArea }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  目前销售渠道：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.salesChannels }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  是否启用：
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
                  cols="4"
                  class="text-right grey--text"
                >
                  描述：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.desce }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  销售负责人：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.contacter }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  详细地址：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.addressPart }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  法人联系电话：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.legalPersonPhone }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  同类价格情况：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.similarPrice }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  QQ号码：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.qq }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  员工人数：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.employeesNum }}人
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  专利情况：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.patentInformation }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  生产设备情况：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.productionEquipment }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  包装：
                </v-col>
                <v-col cols="8">
                  {{ toViewSupplier.packing === '1' ? '新颖' : toViewSupplier.packing === '2' ? '常规' : '独有' }}
                </v-col>
              </v-row>
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="4"
                  class="text-right grey--text"
                >
                  经营性质：
                </v-col>
                <v-col cols="6">
                  {{ toViewSupplier.businessNature === '1' ? '生产' : '贸易' }}
                </v-col>
              </v-row>
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
      status: [
        {
          text: '全部状态',
          value: '',
        },
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
      currentStatus: '全部状态',
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
    searchSupplierByStatus(item) {
      this.currentStatus = item.text;
      this.$set(this.search, 'locked', item.value);
      this.searchByConditions();
    },
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
