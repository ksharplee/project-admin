<template>
  <v-form
    v-if="instockOrder"
    ref="form"
    v-model="valid"
  >
    <v-card
      class="mb-4"
    >
      <v-card-title>
        入库单详情
      </v-card-title>
      <v-card-text
        style="color:#333"
      >
        <div class="mb-3 body-1 d-flex align-baseline">
          入库单号：<span class="display-1 font-weight-bold mr-8">{{ instockOrder.inNo }}</span>
          状态：<span :class="instockOrder.dStatus === '0' ? 'error--text' : instockOrder.dStatus === '1' ?'success--text' : 'grey--text'">{{ instockOrder.dStatus === '0' ? '待审核' : instockOrder.dStatus === '1' ? '已审核' : '已作废' }}</span>
        </div>
        <v-data-table
          :headers="headers"
          :items="instockOrder.detail"
          :loading="$store.state.loading"
          loading-text="加载中..."
          no-data-text="暂无数据"
          hide-default-footer
          fixed-header
          :items-per-page="20"
          :page.sync="page"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.image="{ item }">
            <div
              class="py-3"
            >
              <v-img
                :src="item.image ? `${item.image}?x-oss-process=image/resize,m_fill,w_100,h_100` : require('@/assets/imgWaiting.png')"
                aspect-ratio="1"
                class="grey lighten-1"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    />
                  </v-row>
                </template>
              </v-img>
            </div>
          </template>
          <template v-slot:item.goodName="{ item }">
            <div class="text-left">
              {{ item.goodName }}({{ item.goodNameEn }})
            </div>
          </template>
          <template v-slot:item.goodDetailName="{ item }">
            <div
              v-if="item.goodDetailName"
            >
              {{ item.goodDetailName }}({{ item.goodDetailNameEn }})
            </div>
          </template>
          <template
            v-slot:footer
          >
            <v-divider />
            <div class="d-flex align-center">
              <div class="title">
                入库商品总数：{{ instockOrder.goodNumber }}
              </div>
              <v-spacer />
              <div
                class="pa-4 d-flex align-center justify-end text-no-wrap body-1 flex-grow-1"
              >
                <div class="mr-2">
                  共<span class="error--text">{{ instockOrder.detail.length }}</span>商品
                </div>
                <v-pagination
                  v-model="page"
                  :length="pageCount"
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
            </div>
          </template>
        </v-data-table>
        <v-divider />
        <div class="body-1 mt-4">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">入库仓库：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ instockOrder.warehouseName }}</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">入库类型：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ instockOrder.inTypeName }}</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">入库日期：</span>
            </div>
            <div class="input-group-append">
              <span
                v-if="instockOrder.deliveryTime"
                class="input-group-text black--text"
              >{{ instockOrder.deliveryTime | dateTruncate(10) }}</span>
              <span
                v-else
                class="grey--text"
              >无</span>
            </div>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">备注：</span>
            </div>
            <div class="input-group-append">
              <span class="input-group-text black--text">{{ instockOrder.memo ? instockOrder.memo : '无' }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-btn
      v-if="instockOrder.dStatus === '0'"
      :loading="operating"
      color="primary"
      large
      class="px-12 body-1 ml-4"
      @click="dialog = true;operate = 'check';operateText='审核';"
    >
      审核
    </v-btn>
    <v-btn
      v-if="instockOrder.dStatus === '0'"
      color="secondary"
      large
      class="px-12 body-1 ml-4"
      :to="{ name: 'warehouse_instock_list_edit', params: { id: instockOrder.id }}"
    >
      编辑
    </v-btn>
    <v-btn
      v-if="instockOrder.dStatus === '0'"
      color="grey"
      large
      class="px-12 body-1 ml-4 white--text"
      @click="dialog = true; operate = 'delete';operateText='删除'; "
    >
      删除
    </v-btn>
    <v-btn
      v-if="instockOrder.dStatus === '1'"
      color="grey"
      large
      class="px-12 body-1 ml-4 white--text"
      @click="dialog = true;operate = 'nullify';operateText='作废';"
    >
      作废
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定{{ operateText }}吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="operating"
            :disabled="operating"
            @click="operateInstockOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialog = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';

export default {
  name: 'WarehouseInstockDetail',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialog: false,
      valid: true,
      instockOrder: null,
      headers: [
        {
          text: '图片',
          value: 'image',
          align: 'center',
          sortable: false,
          width: '90px',
        },
        {
          text: '商品名称',
          value: 'goodName',
          align: 'center',
          sortable: false,
          width: '300px',
        },
        {
          text: '货号',
          value: 'goodNo',
          align: 'center',
          sortable: false,
        },
        {
          text: '商品规格',
          value: 'goodDetailName',
          align: 'center',
          sortable: false,
        },
        // {
        //   text: '库存数量',
        //   value: 'stockNumber',
        //   align: 'center',
        //   sortable: false,
        // },
        {
          text: '入库数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '150px',
        },
      ],
      page: 1,
      pageEnter: 1,
      pageCount: 0,
      operate: '',
      operateText: '',
      operating: false,
    };
  },
  computed: {
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
        text: '入库列表',
        disabled: false,
        to: { name: 'warehouse_instock_list' },
        exact: true,
      },
      {
        text: '入库单详情',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllData();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseInstockDetailAsync', 'deleteWarehouseInstockAsync', 'checkWarehouseInstockAsync', 'nullifyWarehouseInstockAsync']),
    ...mapActions('order', ['getProductListForSelectAsync']),
    getAllData() {
      this.$store.commit('START_LOADING');
      this.getWarehouseInstockDetailAsync({ id: this.id }).then((res) => {
        this.instockOrder = res;
      }).catch((err) => {
        this.checkErr(err, 'getAllData');
      }).finally(() => {
        this.$store.commit('END_LOADING');
      });
    },
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
      } else {
        this.pageEnter = 1;
      }
    },
    operateInstockOrder() {
      if (this.operate === 'delete') {
        this.deleteWarehouseInstock();
      } else if (this.operate === 'check') {
        this.checkWarehouseInstock();
      } else {
        this.nullifyWarehouseInstock();
      }
    },
    // 删除入库单
    deleteWarehouseInstock() {
      this.operating = true;
      this.deleteWarehouseInstockAsync({ id: this.instockOrder.id, reload: true })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.$router.replace({ name: 'warehouse_instock_list' });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 作废入库单
    nullifyWarehouseInstock() {
      this.operating = true;
      this.nullifyWarehouseInstockAsync({ id: this.instockOrder.id })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废成功!',
          });
          this.getAllData();
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
    // 审核入库单
    checkWarehouseInstock() {
      this.operating = true;
      this.checkWarehouseInstockAsync({ id: this.instockOrder.id })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，审核成功!',
          });
          this.getAllData();
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialog = false;
        });
    },
  },
};
</script>
