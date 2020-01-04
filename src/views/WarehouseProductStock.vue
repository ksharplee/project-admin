<template>
  <div>
    <v-card>
      <v-card-text
        ref="advancedSearch"
        class="advance-search pa-0"
      >
        <v-data-table
          :headers="headers"
          :items="warehouseProductStock.data.items"
          :loading="loadingDataItems"
          item-key="goodDetailId"
          loading-text="加载中..."
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
              <div class="title mr-4">
                商品库存
              </div>
              <v-menu
                v-model="showCategory"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, value }">
                  <v-btn
                    text
                    class="px-1"
                    v-on="on"
                  >
                    {{ categorySelected.length ? categorySelected[0].dnames : '全部分类' }} <v-icon
                      :class="value ? 'rotate-180' : ''"
                    >
                      mdi-chevron-down mdi-18px
                    </v-icon>
                  </v-btn>
                </template>
                <v-card
                  elevation="0"
                  width="800"
                >
                  <v-card-text>
                    <v-treeview
                      :items="productCategoryGetter"
                      :active="categorySelected"
                      dense
                      item-text="dnames"
                      item-key="id"
                      item-children="son"
                      activatable
                      return-object
                      class="custom-treeview-class"
                      @update:active="getActiveCategory"
                    >
                      <template v-slot:prepend="{ item,leaf, open }">
                        <v-icon>
                          {{ leaf ? 'mdi-bookmark-outline' : open ? 'mdi-bookmark-outline' : 'mdi-bookmark' }}
                        </v-icon>
                      </template>
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-menu>
              <v-menu
                offset-y
              >
                <template v-slot:activator="{ on, value }">
                  <v-btn
                    text
                    class="px-1 ml-2"
                    v-on="on"
                  >
                    {{ currentWarehouse }} <v-icon
                      :class="value ? 'rotate-180' : ''"
                    >
                      mdi-chevron-down mdi-18px
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in warehouseListLocal"
                    :key="index"
                    @click="searchProductByWarehouse(item)"
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
                    v-model="searchStr"
                    placeholder="请输入商品名称"
                    outlined
                    class="white"
                    single-line
                    clearable
                    hide-details
                    dense
                    @click:clear="$set(search, 'searchStr', '');getWarehouseProductStock()"
                  />
                </div>
                <div class="input-group-append">
                  <v-btn
                    color="blue-grey lighten-4 px-0"
                    depressed
                    x-small
                    @click="getWarehouseProductStock"
                  >
                    <v-icon
                      color="blue-grey darken-2"
                    >
                      mdi-magnify mdi-18px
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:item.image="{ item }">
            <div class="py-3">
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
          <template v-slot:footer>
            <v-divider />
            <div class="d-flex align-center">
              <v-spacer />
              <div
                v-if="warehouseProductStock.status && warehouseProductStock.data.items.length"
                class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
              >
                <div class="mr-2">
                  共<span class="error--text">{{ warehouseProductStock.data.totalItem }}</span>商品
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
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'WarehouseProductStock',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingDataItems: false,
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
          text: '销售价',
          value: 'price',
          align: 'center',
          sortable: false,
        },
        {
          text: '库存数量',
          value: 'stockNumber',
          align: 'center',
          sortable: false,
        },
      ],
      searchStr: '',
      selectedProducts: [],
      showCategory: false,
      categorySelected: [],
      pageEnter: 1,
      currentWarehouse: '所有仓库',
      currentWarehouseId: '',
    };
  },
  computed: {
    ...mapState('warehouse', ['warehouseProductStock', 'warehouseList']),
    ...mapState('product', ['productCategory']),
    ...mapGetters('product', ['productCategoryGetter']),
    search() {
      return {
        searchStr: this.searchStr,
        categoryId: R.prop('id', R.head(this.categorySelected)),
        warehouseId: this.currentWarehouseId,
      };
    },
    warehouseListLocal() {
      return R.prepend({
        id: '',
        dnames: '所有仓库',
      }, this.warehouseList.data.items);
    },
    page: {
      set(value) {
        this.warehouseProductStock.data.p = value;
      },
      get() {
        return +this.warehouseProductStock.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.warehouseProductStock.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.warehouseProductStock.data.totalItem / process.env.VUE_APP_PAGESIZE
      );
    },
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
        text: '商品库存',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllData();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseProductStockAsync', 'getWarehouseListAsync']),
    ...mapActions('product', ['getCateListAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getWarehouseProductStock();
      } else {
        this.pageEnter = 1;
      }
    },
    getAllData() {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      const promises = [this.getWarehouseListAsync(), this.getWarehouseProductStockAsync(), this.getCateListAsync()];
      Promise.all(promises).catch((err) => {
        this.checkErr(err, 'getAllData');
      }).finally(() => {
        this.loadingDataItems = false;
        this.$store.commit('END_LOADING');
      });
    },
    changePagination() {
      this.getWarehouseProductStock();
    },
    getWarehouseProductStock() {
      this.loadingDataItems = true;
      this.getWarehouseProductStockAsync(this.search)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    searchProductByWarehouse(item) {
      this.currentWarehouse = item.dnames;
      this.currentWarehouseId = item.id;
      this.getWarehouseProductStock();
    },
    getActiveCategory(arr) {
      this.categorySelected = arr;
      this.getWarehouseProductStock();
      this.showCategory = false;
    },
  },
};
</script>
