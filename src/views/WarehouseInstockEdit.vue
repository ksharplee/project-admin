<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-card class="mb-4">
      <v-card-title>
        编辑入库单
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <div class="input-group mb-5">
              <div class="input-group-prepend large">
                <span class="input-group-text required">选择仓库</span>
              </div>
              <div class="input-group-control">
                <v-select
                  v-model="instockOrder.warehouseId"
                  :items="warehouseList.data.items"
                  :rules="warehouseRules"
                  placeholder="请选择仓库"
                  dense
                  item-text="dnames"
                  item-value="id"
                  class="white"
                  single-line
                  outlined
                  clearable
                  no-data-text="暂无数据"
                  hide-details
                />
              </div>
              <div class="input-group-append">
                <v-btn
                  color="secondary"
                  small
                  depressed
                  @click="dialogWarehouse = true"
                >
                  添加 <v-icon right>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </div>
            </div>
            <div class="input-group mb-5">
              <div class="input-group-prepend large">
                <span class="input-group-text required">选择入库类型</span>
              </div>
              <div class="input-group-control">
                <v-select
                  v-model="instockOrder.inTypeId"
                  :items="warehouseInstockTypeList.data.items"
                  :rules="instockTypeRules"
                  placeholder="请选择入库类型"
                  dense
                  item-text="dnames"
                  item-value="id"
                  class="white"
                  single-line
                  outlined
                  clearable
                  no-data-text="暂无数据"
                  hide-details
                />
              </div>
            </div>
            <div class="input-group mb-5">
              <div class="input-group-prepend large">
                <span class="input-group-text">入库时间</span>
              </div>
              <div class="input-group-control">
                <v-menu
                  v-model="menuDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="instockOrder.deliveryTime"
                      class="white"
                      placeholder="请选择入库时间"
                      single-line
                      dense
                      outlined
                      hide-details
                      clearable
                      append-icon="mdi-calendar-import"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="instockOrder.deliveryTime"
                    color="primary"
                    scrollable
                    @input="menuDate = false"
                  />
                </v-menu>
              </div>
            </div>
            <div class="input-group mb-5">
              <div class="input-group-prepend large">
                <span class="input-group-text required">入库商品</span>
              </div>
              <div class="input-group-control">
                <v-btn
                  color="primary"
                  depressed
                  @click="dialogProductSelect = true"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon> 新增入库商品
                </v-btn>
                <v-btn
                  color="secondary"
                  depressed
                  class="ml-3"
                >
                  <v-icon
                    left
                  >
                    mdi-focus-field-horizontal
                  </v-icon> 扫码选择
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div class="input-group align-start">
              <div
                class="input-group-prepend large"
                style="padding-top:8px"
              >
                <span class="input-group-text">备注</span>
              </div>
              <div class="input-group-control">
                <v-textarea
                  v-model="instockOrder.memo"
                  label=""
                  name="name"
                  dense
                  outlined
                  textarea
                  hide-details
                  rows="7"
                  placeholder="请输入备注内容"
                />
              </div>
            </div>
          </v-col>
        </v-row>
        <v-data-table
          v-if="selectedProducts.length"
          :headers="headers"
          :items="selectedProducts"
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
              {{ item.goodName }}
            </div>
          </template>
          <template v-slot:item.buNumber="{ item }">
            <v-text-field
              v-model="item.buNumber"
              :rules="numberRules"
              dense
              outlined
              hide-details
            />
          </template>
          <template v-slot:item.price="{ item }">
            <v-text-field
              v-model="item.price"
              :rules="priceRules"
              dense
              outlined
              hide-details
            />
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  class="mx-1"
                  v-on="on"
                  @click="deleteSelectedProduct(item.goodDetailId)"
                >
                  <v-icon color="secondary">
                    mdi-delete-forever
                  </v-icon>
                </v-btn>
              </template>
              <span>删除</span>
            </v-tooltip>
          </template>
          <template
            v-slot:footer
          >
            <v-divider />
            <div class="d-flex align-center">
              <div class="title">
                入库商品总数：{{ selectedProductsTotal }}
                <span class="ml-4">
                  总金额： <span class="error--text">￥<span class="display-1">{{ selectedProductsAmountTotal }}</span></span>
                </span>
              </div>
              <v-spacer />
              <div
                class="pa-4 d-flex align-center justify-end text-no-wrap body-1 flex-grow-1"
              >
                <div class="mr-2">
                  共<span class="error--text">{{ selectedProducts.length }}</span>商品
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
      </v-card-text>
    </v-card>
    <v-btn
      :disabled="!valid || submitting || !selectedProducts.length || !allDetailNumberEntered || !allDetailPriceEntered"
      :loading="submitting"
      color="primary"
      large
      class="px-12 body-1 ml-4"
      @click="editWarehouseInstock"
    >
      确定修改
    </v-btn>
    <warehouse-single
      :edit="false"
      :show="dialogWarehouse"
      @close-dialog="dialogWarehouse = false"
    />
    <warehouse-product-select-edit
      :show="dialogProductSelect"
      :selected="selectedProducts"
      @update:selected="selectedProducts = $event"
      @update:close-dialog="dialogProductSelect = false"
    />
  </v-form>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import WarehouseSingle from '@/components/WarehouseSingle.vue';
import WarehouseProductSelectEdit from '@/components/WarehouseProductSelectEdit.vue';

export default {
  name: 'WarehouseInstockEdit',
  components: { WarehouseSingle, WarehouseProductSelectEdit },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialogProductSelect: false,
      dialogWarehouse: false,
      valid: true,
      menuDate: false,
      submitting: false,
      instockOrder: {
        warehouseId: '',
        inTypeId: '',
        memo: '',
        deliveryTime: new Date().toISOString().substr(0, 10),
      },
      warehouseRules: [v => !!v || '请选择仓库'],
      instockTypeRules: [v => !!v || '请选择入库类型'],
      numberRules: [v => !!v || '请输入入库数量'],
      priceRules: [v => !!v || '请选择入库价格'],
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
        {
          text: '库存数量',
          value: 'stockNumber',
          align: 'center',
          sortable: false,
        },
        {
          text: '入库数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '150px',
        },
        {
          text: '入库价格',
          value: 'price',
          align: 'center',
          sortable: false,
          width: '150px',
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
          width: '120px',
        },
      ],
      page: 1,
      pageEnter: 1,
      pageCount: 0,
      selectedProducts: [],
    };
  },
  computed: {
    ...mapState('warehouse', ['warehouseInstockTypeList', 'warehouseList']),
    selectedProductsTotal() {
      return R.sum(R.map(item => (R.has('buNumber', item) ? +item.buNumber : 0), this.selectedProducts)).toFixed(0);
    },
    selectedProductsAmountTotal() {
      return R.sum(R.map((item) => {
        if (item.buNumber && item.buNumber > 0 && item.price && item.price > 0) {
          return item.buNumber * item.price;
        }
        return 0;
      }, this.selectedProducts)).toFixed(2);
    },
    detail() {
      return R.map(item => ({
        goodDetailId: item.goodDetailId,
        buUnitId: item.unitId,
        packeNum: 1,
        buNumber: item.buNumber,
        price: item.price,
      }), this.selectedProducts);
    },
    allDetailNumberEntered() {
      return R.all(item => !!item.buNumber, this.selectedProducts);
    },
    allDetailPriceEntered() {
      return R.all((item => !!item.price), this.selectedProducts);
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
        text: '入库列表',
        disabled: false,
        to: { name: 'warehouse_instock_list' },
        exact: true,
      },
      {
        text: '编辑入库单',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllData();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseListAsync', 'getWarehouseInstockTypeListAsync', 'addWarehouseInstockAsync', 'getWarehouseInstockDetailAsync', 'editWarehouseInstockAsync']),
    ...mapActions('order', ['getProductListForSelectAsync']),
    deleteSelectedProduct(id) {
      this.selectedProducts = R.reject(R.propEq('goodDetailId', id), this.selectedProducts);
    },
    getAllData() {
      this.$store.commit('START_LOADING');
      const promises = [this.getWarehouseInstockTypeListAsync(), this.getWarehouseListAsync(), this.getWarehouseInstockDetailAsync({ id: this.id }), this.getProductListForSelectAsync()];
      Promise.all(promises).then((res) => {
        this.instockOrder = R.nth(2, res);
        this.selectedProducts = R.map(item => ({
          ...item,
          price: item.price,
        }), this.instockOrder.detail);
      }).catch((err) => {
        this.checkErr(err, 'getAllData');
      }).finally(() => {
        this.$store.commit('END_LOADING');
      });
    },
    getWarehouseIntockTypeList() {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      this.getWarehouseInstockTypeListAsync().catch((err) => {
        this.checkErr(err, 'getWarehouseIntockTypeList');
      }).finally(() => {
        this.loadingDataItems = false;
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
    editWarehouseInstock() {
      if (!this.selectedProducts.length) {
        this.checkErr(new Error('请选择入库商品'));
        return;
      }
      this.submitting = true;
      this.editWarehouseInstockAsync(R.mergeRight(this.instockOrder, { detail: this.detail })).then(() => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'success',
          text: '恭喜，编辑成功!',
        });
        this.$router.replace({ name: 'warehouse_instock_list' });
      }).catch((err) => {
        this.checkErr(err, 'addWarehouseInstock');
      }).finally(() => {
        this.submitting = false;
      });
    },
  },
};
</script>
