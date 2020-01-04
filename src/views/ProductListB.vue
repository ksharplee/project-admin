<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      商品列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{ name: 'product_add' }"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加商品
      </v-btn>
    </div>

    <v-form ref="form">
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">商品名称</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.dnames"
                placeholder="请输入商品名称"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions('dnames')"
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
              <span class="input-group-text">供应商名称</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.supplyer"
                placeholder="请输入供应商名称"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions('supplyer')"
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
              <span class="input-group-text">商品货号</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.dno"
                placeholder="请输入商品准确货号"
                outlined
                single-line
                clearable
                class="white"
                hide-details
                dense
                @click:clear="clearSearchConditions('dno')"
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
          <v-dialog
            ref="dialog"
            v-model="dialogCategory"
            width="600px"
          >
            <template v-slot:activator="{ on }">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">商品类别</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="cateName"
                    :loading="loadingCategory"
                    :disabled="loadingCategory"
                    class="white"
                    placeholder="请选择商品类别"
                    readonly
                    outlined
                    clearable
                    required
                    single-line
                    dense
                    hide-details
                    append-icon="mdi-menu-down"
                    v-on="on"
                    @click:clear="clearSearchConditions('categoryId')"
                  />
                </div>
              </div>
            </template>
            <v-card>
              <v-card-title class="title grey lighten-3 pa-4">
                选择商品分类
              </v-card-title>
              <v-card-text class="pt-4">
                <v-treeview
                  :items="productCategory.data.items"
                  :active="categorySelected"
                  dense
                  item-text="dnames"
                  item-key="id"
                  item-children="son"
                  open-on-click
                  rounded
                  activatable
                  return-object
                  @update:active="getActiveCategory"
                >
                  <template v-slot:prepend="{ item,leaf, open }">
                    <v-icon>
                      {{ leaf ? 'mdi-bookmark-outline' : open ? 'mdi-bookmark-outline' : 'mdi-bookmark' }}
                    </v-icon>
                  </template>
                </v-treeview>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="setProductCategory"
                >
                  确定
                </v-btn>
                <v-btn
                  color="secondary"
                  @click="dialogCategory = false;"
                >
                  取消
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">上架状态</span>
            </div>
            <div class="input-group-control">
              <v-select
                v-model="search.dStatus"
                :items="status"
                placeholder="请选择上架状态"
                class="white"
                single-line
                dense
                outlined
                clearable
                no-data-text="暂无数据"
                hide-details
                @click:clear="clearSearchConditions('dStatus')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="4"
          xl="3"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">价格区间</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.minPrice"
                outlined
                class="white rounded-right-0"
                single-line
                dense
                clearable
                hide-details
                @click:clear="clearSearchConditions('minPrice')"
              />
            </div>
            <div class="input-group-innerpend">
              <span class="input-group-text">到</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.maxPrice"
                outlined
                class="white rounded-0"
                single-line
                dense
                clearable
                hide-details
                @click:clear="clearSearchConditions('maxPrice')"
              />
            </div>
            <div class="input-group-append">
              <span class="input-group-text">元</span>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="8"
          lg="6"
          xl="4"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">上架时间</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="search.startShelfTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.startShelfTime"
                    class="white rounded-right-0"
                    placeholder="请选择上架时间"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                    @click:clear="clearSearchConditions('startShelfTime')"
                  />
                </template>
                <v-date-picker
                  v-model="search.startShelfTime"
                  color="primary"
                  scrollable
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuStart = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuStart.save(search.startShelfTime)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="input-group-innerpend">
              <span class="input-group-text">到</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuEnd"
                v-model="menuEnd"
                :close-on-content-click="false"
                :return-value.sync="search.endShelfTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.endShelfTime"
                    class="white rounded-left-0"
                    placeholder="请选择上架截止时间"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                    @click:clear="clearSearchConditions('endShelfTime')"
                  />
                </template>
                <v-date-picker
                  v-model="search.endShelfTime"
                  :min="search.startShelfTime"
                  color="primary"
                  scrollable
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuEnd = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuEnd.save(search.endShelfTime)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
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
    <v-card class="mt-4">
      <v-card-text class="py-2 d-flex align-center">
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          :to="{ name: 'product_add' }"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-plus-circle
            </v-icon> 添加商品
          </div>
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          @click="selectedProducts = productList.data.items"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-check-circle
            </v-icon> 全选
          </div>
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          @click="reverseSelectedProducts"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-arrow-left-circle
            </v-icon> 反选
          </div>
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          @click="getOperateProducts('上架')"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-cloud-upload
            </v-icon> 上架
          </div>
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          @click="getOperateProducts('下架')"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-cloud-download
            </v-icon> 下架
          </div>
        </v-btn>
        <v-btn
          color="white"
          depressed
          class="height-auto py-2 mr-2"
          @click="getToDeleteProducts"
        >
          <div class="d-flex flex-column">
            <v-icon
              color="grey darken-2"
              class="mb-1"
            >
              mdi-delete
            </v-icon> 删除
          </div>
        </v-btn>
        <v-menu
          offset-y
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              dark
              class="ml-auto"
              depressed
              v-on="on"
            >
              设置商品标签
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(label, i) in labels"
              :key="i"
              @click="setProductLabel(true,i)"
            >
              <v-list-item-title>设为{{ label.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          offset-y
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="secondary"
              dark
              class="ml-2"
              depressed
              v-on="on"
            >
              取消商品标签
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(label, i) in labels"
              :key="i"
              @click="setProductLabel(false,i)"
            >
              <v-list-item-title>取消{{ label.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-text>
      <v-data-table
        v-model="selectedProducts"
        :headers="headers"
        :items="productList.data.items"
        class="text-center"
        item-key="id"
        show-select
        no-data-text="暂无数据"
        hide-default-footer
        :items-per-page="20"
      >
        <!-- <template v-slot:top>
          <v-divider />
          <div class="grey lighten-4 pa-4 text-left">
            当前共有商品：{{ productList.data.totalItem }}
          </div>
          <v-divider />
        </template> -->
        <template v-slot:item.dnames="{ item }">
          <div class="text-left py-3">
            <div>
              <v-chip
                v-if="item.isNew === '1'"
                x-small
                class="mr-1 px-2"
                color="primary"
              >
                新
              </v-chip>
              <v-chip
                v-if="item.isHot === '1'"
                x-small
                class="mr-1 px-2"
                color="error"
              >
                热
              </v-chip>
              <v-chip
                v-if="item.isOrder === '1'"
                x-small
                class="mr-1 white--text px-2"
                color="teal"
              >
                订
              </v-chip>
              <v-chip
                v-if="item.isPromotion === '1'"
                x-small
                class="mr-1 px-2"
                color="warning"
              >
                促
              </v-chip>
              <v-chip
                v-if="item.isRecommend === '1'"
                x-small
                class="mr-1 px-2"
                color="success"
              >
                荐
              </v-chip>
              <v-chip
                v-if="item.isSpot === '1'"
                x-small
                class="mr-1 px-2"
                color="secondary"
              >
                现
              </v-chip>
            </div>{{ item.dnames }}
          </div>
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.containSpec === '1' ? `${item.minPrice}~${item.maxPrice}` : item.price }}
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
        <template v-slot:item.dstatus="{ item }">
          <span :class="item.dstatus === '4' ? 'success--text' : 'grey--text'">{{ item.dstatus === '4' ? '已上架' : item.dstatus === '0' ? '未上架' : '已下架' }}</span>
        </template>
        <template v-slot:item.shelfTime="{ item }">
          <span :class="item.shelfTime ? '' : 'grey--text'">{{ item.shelfTime | dateTruncate(16) }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{ name: 'product_detail', params: { id: item.id }}"
                v-on="on"
              >
                <v-icon color="primary">
                  mdi-file-document-box-search
                </v-icon>
              </v-btn>
            </template>
            <span>详情</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{ name: 'product_edit', params: { id: item.id }}"
                :disabled="item.dstatus === '4'"
                v-on="on"
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
                :disabled="item.dstatus === '4'"
                icon
                class="mx-1"
                v-on="on"
                @click="dialogDelete = true;toDeleteProducts = [item.id]"
              >
                <v-icon color="secondary">
                  mdi-delete-forever
                </v-icon>
              </v-btn>
            </template>
            <span>删除</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <div
            v-if="productList.status && productList.data.items.length"
            class="pa-4 grey lighten-5 d-flex align-center text-no-wrap"
          >
            <span>当前共有商品：<span class="error--text">{{ productList.data.totalItem }}</span></span>
            <v-pagination
              v-model="page"
              :length="pageCount"
              @input="changePagination"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定删除{{ toDeleteProducts.length === 1 ? '此商品' : `这${toDeleteProducts.length}个商品` }}吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting || !toDeleteProducts.length"
            @click="deleteProduct"
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
      v-model="dialogOperate"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定{{ operate }}{{ toOperateProducts.length === 1 ? '此商品' : `这${toOperateProducts.length}个商品` }}吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="operating"
            :disabled="operating || !toOperateProducts.length"
            @click="operateProduct"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogOperate = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as R from 'ramda';

export default {
  name: 'ProductList',
  data() {
    return {
      loadingDataItems: false,
      loadingCategory: false,
      dialogCategory: false,
      dialogDelete: false,
      dialogOperate: false,
      menuStart: false,
      menuEnd: false,
      deleting: false,
      operating: false,
      cateName: '',
      categorySelected: [],
      search: {},
      operate: '上架',
      status: [
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
      toDeleteProducts: [],
      toOperateProducts: [],
      selectedProducts: [],
      headers: [
        {
          text: '图片',
          align: 'center',
          sortable: false,
          value: 'image',
          width: '100px',
        },
        {
          text: '商品名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
          width: '300px',
        },
        {
          text: '商品货号',
          value: 'dno',
          align: 'center',
          sortable: false,
        },
        {
          text: '库存数量',
          value: 'stock',
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
          text: '商品供应商',
          value: 'goodSupplyers',
          align: 'center',
          sortable: false,
        },
        {
          text: '上架状态',
          value: 'dstatus',
          align: 'center',
          sortable: false,
        },
        {
          text: '上架时间',
          value: 'shelfTime',
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
      labels: [
        {
          text: '新品',
        },
        {
          text: '热卖',
        },
        {
          text: '推荐',
        },
        {
          text: '促销',
        },
        {
          text: '现货',
        },
        {
          text: '订货',
        },
      ],
    };
  },
  computed: {
    ...mapState(['breadCrumbs']),
    ...mapState('product', ['productList', 'productCategory']),
    page: {
      set(value) {
        this.productList.data.p = value;
      },
      get() {
        return +this.productList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.productList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.productList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '商品列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getProductList();
    this.loadingCategory = true;
    this.getCateListAsync()
      .catch((err) => {
        this.checkErr(err);
      })
      .finally(() => {
        this.loadingCategory = false;
      });
  },
  methods: {
    ...mapActions('product', [
      'getProductListAsync',
      'getCateListAsync',
      'deleteProductAsync',
      'operateProductAsync',
      'setProductLabelAsync',
    ]),
    reverseSelectedProducts() {
      this.selectedProducts = R.without(
        this.selectedProducts,
        this.productList.data.items
      );
    },
    getActiveCategory(arr) {
      this.categorySelected = arr;
    },
    setProductCategory() {
      this.search.categoryId = R.prop('id', R.head(this.categorySelected));
      this.cateName = R.prop('dnames', R.head(this.categorySelected));
      this.dialogCategory = false;
    },
    changePagination() {
      this.getProductList(this.search);
    },
    getProductList(params) {
      this.loadingDataItems = true;
      this.getProductListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
          this.$store.commit('END_LOADING');
        });
    },
    searchProducts() {
      this.getProductList(this.search);
    },
    clearSearchConditions(target) {
      if (target === 'categoryId') {
        this.cateName = '';
      }
      this.search[target] = '';
      this.getProductList(this.search);
    },
    resetSearchConditions() {
      this.$refs.form.reset();
      this.cateName = '';
      this.getProductList();
    },
    // 删除商品
    getToDeleteProducts() {
      if (!this.selectedProducts.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请先选择商品',
        });
        return;
      }
      if (R.find(R.propEq('dstatus', '4'), this.selectedProducts)) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '已上架商品不能删除',
        });
        return;
      }
      this.dialogDelete = true;
      this.toDeleteProducts = R.pluck('id', this.selectedProducts);
    },
    deleteProduct() {
      this.deleting = true;
      this.deleteProductAsync({ id: this.toDeleteProducts })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.selectedProducts = [];
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.deleting = false;
          this.dialogDelete = false;
        });
    },
    // 商品上下架
    getOperateProducts(operate) {
      if (!this.selectedProducts.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请先选择商品',
        });
        return;
      }
      this.dialogOperate = true;
      this.operate = operate;
      this.toOperateProducts = R.pluck('id', this.selectedProducts);
    },
    operateProduct() {
      this.operating = true;
      this.operateProductAsync({
        id: this.toOperateProducts,
        operate: this.operate === '上架' ? '1' : '2',
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.operate}成功!`,
          });
          this.selectedProducts = [];
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.operating = false;
          this.dialogOperate = false;
        });
    },
    // 商品取消/设置标签
    setProductLabel(isSet, i) {
      if (!this.selectedProducts.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请先选择商品',
        });
        return;
      }
      this.$store.commit('START_LOADING');
      const params = {
        index: i + 1,
        operate: isSet ? '1' : '2',
        id: R.pluck('id', this.selectedProducts),
      };
      this.setProductLabelAsync(params)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${isSet ? '设置' : '取消'}标签成功!`,
          });
          this.selectedProducts = [];
        })
        .catch(err => this.checkErr(err))
        .finally(() => this.$store.commit('END_LOADING'));
    },
  },
};
</script>
