<template>
  <v-dialog
    :value="show"
    persistent
    max-width="1000"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        选择商品
      </v-card-title>
      <v-container fluid>
        <v-form ref="form">
          <v-row class="mb-3">
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">商品名称</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="search.dnames"
                    placeholder="请输入商品名称"
                    dense
                    outlined
                    clearable
                    class="white"
                    required
                    single-line
                    hide-details
                    @click:clear="clearSearchConditions('dnames')"
                  />
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">商品货号</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="search.dno"
                    placeholder="请输入商品货号"
                    dense
                    outlined
                    clearable
                    class="white"
                    required
                    single-line
                    hide-details
                    @click:clear="clearSearchConditions('dno')"
                  />
                </div>
              </div>
            </v-col>
            <v-col align-self="center">
              <v-btn
                color="primary mr-2"
                depressed
                @click="searchProducts"
              >
                搜索
              </v-btn>
              <v-btn
                color="secondary"
                depressed
                @click="resetSearchConditions"
              >
                重置
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-container
          fluid
          class="grey lighten-4 px-4"
        >
          <v-row class="white">
            <v-col
              cols="5"
              class="pa-3"
            >
              <v-card outlined>
                <v-data-table
                  v-model="selectedFromList"
                  :headers="headers"
                  :items="productListForSelect.data.items"
                  :loading="loadingDataItems"
                  loading-text="加载中..."
                  item-key="goodDetailId"
                  no-data-text="暂无数据"
                  show-select
                  hide-default-footer
                  fixed-header
                  :items-per-page="20"
                  height="500"
                >
                  <template
                    v-slot:header.data-table-select="{ on, props }"
                  >
                    <v-simple-checkbox
                      :ripple="false"
                      color="primary"
                      v-bind="props"
                      v-on="on"
                    />
                  </template>
                  <template
                    v-slot:item.data-table-select="{ isSelected, select, item }"
                  >
                    <v-simple-checkbox
                      color="primary"
                      :value="isSelected || existInSelectedIds(item.goodDetailId)"
                      :ripple="false"
                      @input="select($event)"
                    />
                  </template>
                  <template v-slot:item.item="{ item }">
                    <v-row>
                      <v-col cols="3">
                        <v-img
                          :src="item.image ? `${item.image}?x-oss-process=image/resize,m_mfit,w_100,h_100` : require('@/assets/imgWaiting.png')"
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
                      </v-col>
                      <v-col
                        cols="9"
                        class="text-left align-self-stretch d-flex flex-column justify-lg-space-between"
                      >
                        <div class="font-weight-medium primary--text line-break">
                          {{ item.goodName }}({{ item.goodNameEn }})
                        </div>
                        <div class="body-2">
                          <div v-if="item.goodDetailName">
                            {{ item.goodDetailName }}({{ item.goodDetailNameEn }})
                          </div>
                          <span class="grey--text">零售价：</span><span class="error--text mr-3">{{ item.containSpec === '1' ? `${item.minPrice}~${item.maxPrice}` : item.price }}</span> <span class="grey--text">单位：</span>{{ item.unitName }}
                        </div>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:footer>
                    <v-divider class="my-0" />
                    <div class="pa-3 grey lighten-4 d-flex align-center body-2">
                      <v-chip
                        label
                        small
                        class="grey lighten-4"
                      >
                        {{ `${page} / ${pageCount}` }}
                      </v-chip>
                      <v-btn
                        :disabled="page === 1"
                        color="primary"
                        text
                        small
                        class="ml-auto"
                        @click="changePagination('minus')"
                      >
                        <v-icon left>
                          mdi-menu-left
                        </v-icon> 上一页
                      </v-btn>
                      <v-btn
                        :disabled="pageCount === page"
                        color="primary"
                        text
                        small
                        class="ml-2"
                        @click="changePagination('plus')"
                      >
                        下一页
                        <v-icon right>
                          mdi-menu-right
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col
              cols="2"
              class="d-flex align-center justify-center"
            >
              <div>
                <div class="mb-2">
                  <v-btn
                    :disabled="!selectedFromList.length"
                    color="secondary"
                    depressed
                    @click="addToSelectedProducts"
                  >
                    添加 <v-icon right>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
                <v-btn
                  :disabled="!selectedFromResults.length"
                  color="secondary"
                  depressed
                  @click="deleteSelectedProducts"
                >
                  <v-icon left>
                    mdi-chevron-left
                  </v-icon>移除
                </v-btn>
              </div>
            </v-col>
            <v-col cols="5">
              <v-card outlined>
                <v-data-table
                  v-model="selectedFromResults"
                  :headers="headers"
                  :items="selectedResults"
                  item-key="goodDetailId"
                  no-data-text="暂无数据"
                  show-select
                  hide-default-footer
                  fixed-header
                  height="500"
                  :items-per-page="20"
                  :page.sync="pageSelected"
                >
                  <template v-slot:item.item="{ item }">
                    <v-row>
                      <v-col cols="3">
                        <v-img
                          :src="item.image ? `${item.image}?x-oss-process=image/resize,m_mfit,w_100,h_100` : require('@/assets/imgWaiting.png')"
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
                      </v-col>
                      <v-col
                        cols="9"
                        class="text-left align-self-stretch d-flex flex-column justify-lg-space-between"
                      >
                        <div class="font-weight-medium primary--text line-break">
                          {{ item.goodName }}({{ item.goodNameEn }})
                        </div>
                        <div class="body-2">
                          <div v-if="item.goodDetailName">
                            {{ item.goodDetailName }}({{ item.goodDetailNameEn }})
                          </div>
                          <span class="grey--text">零售价：</span><span class="error--text mr-3">{{ item.containSpec === '1' ? `${item.minPrice}~${item.maxPrice}` : item.price }}</span> <span class="grey--text">单位：</span>{{ item.unitName }}
                        </div>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:footer>
                    <v-divider class="my-0" />
                    <div class="pa-3 grey lighten-4 d-flex align-center body-2">
                      <v-chip
                        label
                        small
                        class="grey lighten-4"
                      >
                        {{ `${pageSelected} / ${pageCountSelected}` }}
                      </v-chip>
                      <v-btn
                        :disabled="pageSelected === 1"
                        color="primary"
                        text
                        small
                        class="ml-auto"
                        @click="pageSelected -= 1"
                      >
                        <v-icon left>
                          mdi-menu-left
                        </v-icon> 上一页
                      </v-btn>
                      <v-btn
                        :disabled="pageCountSelected === pageSelected"
                        color="primary"
                        text
                        small
                        class="ml-2"
                        @click="pageSelected += 1"
                      >
                        下一页
                        <v-icon right>
                          mdi-menu-right
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="primary"
          @click="confirmSelectedProducts"
        >
          确定
        </v-btn>
        <v-btn
          color="secondary"
          @click="$emit('close-dialog')"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// 选中商品 => 添加到右侧并选中 => 确定抛出
import * as R from 'ramda';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'ProductSelection',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
    },
    buyerId: {
      type: String,
      default: '',
    },
    buyerUid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingDataItems: false,
      selectedProducts: [],
      search: {},
      headers: [
        {
          text: '商品',
          align: 'center',
          sortable: false,
          value: 'item',
        },
      ],
      pageSelected: 1,
      // 已选的商品id
      selectedIds: [],
      // 从列表中选中的商品
      selectedFromList: [],
      // 从结果中选中的商品
      selectedFromResults: [],
      // 结果列表
      selectedResults: [],
    };
  },
  computed: {
    ...mapState('order', ['productListForSelect']),
    ...mapGetters('order', ['selectedProductsFilter']),
    pageCountSelected() {
      return Math.ceil(
        this.selectedResults.length / 20
      ) || 1;
    },
    // selectedProductIds() {
    //   return R.pluck('goodDetailId', this.selected);
    // },
    selectedProductsByIds() {
      return R.filter((item) => {
        if (R.includes(item.goodDetailId, this.selectedIds)) {
          return true;
        }
        return false;
      }, this.productListForSelect.data.items);
    },
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
  },
  watch: {
    show() {
      if (this.show) {
        // 已选中的id和products
        this.selectedIds = R.pluck('goodDetailId', this.selected);
        this.selectedResults = JSON.parse(JSON.stringify(this.selected));
        // this.selectedFromResults = this.selectedResults;
        this.getProductList();
      }
    },
  },
  methods: {
    ...mapActions('order', ['getProductListForSelectAsync']),
    existInSelectedIds(id) {
      return !!this.selectedIds.find(item => item === id);
    },
    getProductList(params) {
      this.loadingDataItems = true;
      this.getProductListForSelectAsync(
        R.mergeRight(
          { buyerId: this.buyerId, buyerUid: this.buyerUid, ...this.search },
          params
        )
      )
        .then(() => {
          // if (this.selected.length) {
          //   this.selectedProducts = this.selectedProductsByIds;
          //   this.selectedToCancelOrEmit = this.selectedProductsByIds;
          // }
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
          this.$store.commit('END_LOADING');
        });
    },
    changePagination(edit) {
      if (edit === 'plus') {
        this.getProductList({
          dnames: this.search,
          p: +this.page + 1,
        });
      } else {
        this.getProductList({
          dnames: this.search,
          p: +this.page - 1,
        });
      }
    },
    deleteSelectedProducts() {
      const selectedIds = R.pluck('goodDetailId', this.selectedFromResults);
      this.selectedResults = R.without(
        this.selectedFromResults,
        this.selectedResults
      );
      // this.selectedFromResults = this.selectedResults;
      this.selectedIds = R.without(selectedIds, this.selectedIds);
    },
    confirmSelectedProducts() {
      this.$emit('update:selectedProducts', this.selectedResults);
      this.$emit('close-dialog');
      // this.selectedResults = [];
      // this.selectedProducts = [];
    },
    searchProducts() {
      this.getProductList({ ...this.search, p: 1 });
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.getProductList({ ...this.search, p: 1 });
    },
    resetSearchConditions() {
      this.$refs.form.reset();
      this.getProductList();
    },
    addToSelectedProducts() {
      const selectedAll = R.concat(this.selectedResults, this.selectedFromList);
      const selectedIds = R.pluck('goodDetailId', this.selectedFromList);
      this.selectedResults = selectedAll;
      // this.selectedFromResults = selectedAll;
      this.selectedFromList = [];
      this.selectedIds = R.concat(this.selectedIds, selectedIds);
    },
  },
};
</script>
