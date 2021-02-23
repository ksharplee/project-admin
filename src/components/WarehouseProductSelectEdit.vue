<template>
  <v-dialog
    :value="show"
    persistent
    max-width="1400"
    @click:outside="$emit('close-dialog')"
  >
    <v-card class="pa-3">
      <v-card-text
        ref="advancedSearch"
        class="advance-search pa-0"
      >
        <v-data-table
          v-model="selectedProducts"
          :headers="headers"
          :items="productListForSelect.data.items"
          :loading="loadingDataItems"
          item-key="goodDetailId"
          loading-text="加载中..."
          no-data-text="暂无数据"
          hide-default-footer
          show-select
          :items-per-page="20"
        >
          <template v-slot:top>
            <div
              class="text-left d-flex align-center mb-3"
              style="height: 36px"
            >
              <div class="title mr-4">
                选择商品
              </div>
              <!-- <v-menu
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
                    @click="searchProductByStatus(item)"
                  >
                    <v-list-item-title class="body-2">
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu> -->
              <div
                class="input-group ml-4"
                style="width:300px"
              >
                <div class="input-group-control">
                  <v-text-field
                    v-model="search.searchStr"
                    placeholder="请输入商品名称/货号"
                    outlined
                    class="white"
                    single-line
                    clearable
                    hide-details
                    dense
                    @click:clear="$set(search, 'searchStr', '');getProductList({p:1})"
                  />
                </div>
                <div class="input-group-append">
                  <v-btn
                    color="blue-grey lighten-4 px-0"
                    depressed
                    x-small
                    @click="getProductList({p:1})"
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
          <template v-slot:item.buNumber="{ item }">
            <v-text-field
              v-model="item.buNumber"
              dense
              outlined
              hide-details
            />
          </template>
          <template v-slot:item.buyPrice="{ item }">
            {{ item.price }}
          </template>
          <template v-slot:item.price="{ item }">
            <v-text-field
              v-model="item.price"
              dense
              outlined
              hide-details
            />
          </template>
          <template v-slot:footer>
            <v-divider />
            <div class="d-flex align-center">
              <div class="title">
                {{ $route.name.includes('outstock') ? '出库' : '入库' }}商品总数：{{ selectedProductsTotal }}
                <span class="ml-4">
                  总金额： <span class="error--text">￥<span class="display-1">{{ selectedProductsAmountTotal }}</span></span>
                </span>
              </div>
              <v-spacer />
              <div
                v-if="productListForSelect.status && productListForSelect.data.items.length"
                class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
              >
                <div class="mr-2">
                  共<span class="error--text">{{ productListForSelect.data.totalItem }}</span>商品
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
        <v-divider />
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          color="primary"
          large
          @click="$emit('update:selected', selectedProducts);$emit('update:close-dialog')"
        >
          确定选择
        </v-btn>
        <v-btn
          color="secondary"
          large
          @click="$emit('update:close-dialog')"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as R from 'ramda';
import {
  mapActions, mapState, mapGetters, mapMutations,
} from 'vuex';

export default {
  name: 'WarehouseProductSelectEdit',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
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
          value: 'buyPrice',
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
          text: `${this.$route.name.includes('outstock') ? '出库' : '入库'}数量'`,
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '120px',
        },
        {
          text: `${this.$route.name.includes('outstock') ? '出库' : '入库'}价格'`,
          value: 'price',
          align: 'center',
          sortable: false,
          width: '120px',
        },
      ],
      status: [
        {
          text: '全部状态',
          value: '0',
        },
        {
          text: '已上架',
          value: '5',
        },
        {
          text: '未上架',
          value: '1',
        },
        {
          text: '已下架',
          value: '2',
        },
      ],
      search: {},
      selectedProducts: [],
      showCategory: false,
      categorySelected: [],
      pageEnter: 1,
      currentStatus: '全部状态',
    };
  },
  computed: {
    ...mapState('product', ['productCategory']),
    ...mapGetters('product', ['productCategoryGetter']),
    ...mapState('order', ['productListForSelect']),
    page: {
      set(value) {
        this.productListForSelect.data.p = value;
      },
      get() {
        return +this.productListForSelect.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.productListForSelect.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.productListForSelect.data.totalItem / process.env.VUE_APP_PAGESIZE
      );
    },
    selectedProductsIds() {
      return R.pluck('goodDetailId', this.selected);
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
  watch: {
    show(newValue) {
      if (newValue) {
        this.setProductList();
      }
    },
  },
  created() {
    this.getCateListAsync()
      .catch((err) => {
        this.checkErr(err);
      });
  },
  methods: {
    ...mapActions('order', ['getProductListForSelectAsync']),
    ...mapMutations('warehouse', ['SET_WAREHOUSE_INSTOCK_LIST']),
    ...mapActions('product', ['getCateListAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getProductList();
      } else {
        this.pageEnter = 1;
      }
    },
    changePagination() {
      this.getProductList();
    },
    setProductList() {
      R.map((item) => {
        const product = R.find(R.propEq('goodDetailId', item.goodDetailId), this.selected);
        if (product) {
          item.price = product.price;
          item.buNumber = product.buNumber;
        }
        return item;
      }, this.productListForSelect.data.items);
      this.SET_WAREHOUSE_INSTOCK_LIST(this.productListForSelect);
      this.selectedProducts = R.filter(item => R.includes(item.goodDetailId, this.selectedProductsIds), this.productListForSelect.data.items);
    },
    getProductList(params) {
      this.loadingDataItems = true;
      this.getProductListForSelectAsync(
        {
          buyerId: '0', buyerUid: '0', ...this.search, ...params,
        },
      )
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    searchProductByStatus(item) {
      this.currentStatus = item.text;
      this.$set(this.search, 'dStatus', item.value);
      this.getProductList({ p: 1 });
    },
    getActiveCategory(arr) {
      this.categorySelected = arr;
      this.$set(this.search, 'categoryId', R.prop('id', R.head(this.categorySelected)));
      this.getProductList({ p: 1 });
      this.showCategory = false;
    },
  },
};
</script>
