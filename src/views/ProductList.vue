<template>
  <div>
    <v-card>
      <v-card-text
        ref="advancedSearch"
        class="advance-search pa-0"
      >
        <v-data-table
          v-model="selectedProducts"
          :items="productList.data.items"
          :headers="headers"
          class="text-center"
          item-key="id"
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
              <template v-if="selectedProducts.length">
                <v-btn
                  color="secondary"
                  icon
                  text
                  x-small
                  class="mr-3"
                  :ripple="false"
                  @click="selectedProducts = []"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                已选择&nbsp;<span class="primary--text">{{ selectedProducts.length }} </span>&nbsp;项
                <v-divider
                  vertical
                  class="ml-8 mr-4"
                />
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="getOperateProducts('上架')"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-inbox-arrow-up mdi-18px
                  </v-icon> 上架
                </v-btn>
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="getOperateProducts('下架')"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-inbox-arrow-down mdi-18px
                  </v-icon> 下架
                </v-btn>
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="getToDeleteProducts"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-delete mdi-18px
                  </v-icon> 删除
                </v-btn>
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="openDialogLabel"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-bookmark mdi-18px
                  </v-icon> 设置标签
                </v-btn>
              </template>
              <template v-else-if="searchStatus">
                搜索结果
                <v-divider
                  vertical
                  class="ml-6 mr-3"
                />
                <v-btn
                  text
                  class="mr-2 px-1 py-1"
                  @click="clearAdvancedSearch"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-eraser mdi-18px
                  </v-icon> 清除搜索
                </v-btn>
                <v-btn
                  text
                  class="px-1 py-1"
                  @click="dialogSearch = true"
                >
                  <v-icon
                    color="grey darken-1"
                    class="mr-1"
                  >
                    mdi-feature-search mdi-18px
                  </v-icon> 继续搜索
                </v-btn>
              </template>
              <template v-else>
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
                      {{ categorySelected.length ? categorySelected[0].dnames : '全部分类' }} <v-icon :class="value ? 'rotate-180' : ''">
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
                <v-menu offset-y>
                  <template v-slot:activator="{ on, value }">
                    <v-btn
                      text
                      class="px-1 ml-2"
                      v-on="on"
                    >
                      {{ currentStatus }} <v-icon :class="value ? 'rotate-180' : ''">
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
                </v-menu>
                <div
                  class="input-group ml-4"
                  style="width:300px"
                >
                  <div class="input-group-control">
                    <v-text-field
                      v-model="dnames"
                      placeholder="请输入商品名称"
                      outlined
                      class="white"
                      single-line
                      clearable
                      hide-details
                      dense
                      @click:clear="dnames = '';getProductList({p: '1'})"
                    />
                  </div>
                  <div class="input-group-append">
                    <v-btn
                      color="blue-grey lighten-4 px-0"
                      depressed
                      x-small
                      @click="getProductList({ dnames, p: '1' })"
                    >
                      <v-icon color="blue-grey darken-2">
                        mdi-magnify mdi-18px
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  text
                  class="ml-2 px-1"
                  @click="dialogSearch = true"
                >
                  高级搜索
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  depressed
                  class="px-5"
                  :to="{ name: 'product_add' }"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon> 新增
                </v-btn>
              </template>
            </div>
            <v-divider />
          </template>
          <template v-slot:item.dnames="{ item }">
            <div class="text-left py-3">
              {{ item.dnames }}
              <div class="mt-1">
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
              </div>
            </div>
          </template>
          <template v-slot:item.price="{ item }">
            {{ item.containSpec === '1' ? `${item.minPrice}~${item.maxPrice}` : item.price }}
          </template>
          <template v-slot:item.isLive="{ item }">
            {{ item.isLive === '4' ? '直播中' : item.isLive === '3' ? '审核中' : item.isLive === '2' ? '已驳回' : '未提交' }}
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
                  v-for="(config, i) in productConfig"
                  :key="i"
                  :disabled="i !== 0 && item.dstatus === '4'"
                  @click="configProduct(i, item.id)"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      :color="i !== 0 && item.dstatus === '4' ? '#999' : ''"
                      style="position:relative;top:-1px"
                      v-text="config.icon"
                    />{{ config.text }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="+item.isLive < 3"
                  @click="configProduct(3, item.id, '3')"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      style="position:relative;top:-1px"
                    >
                      mdi-arrow-up-circle
                    </v-icon>直播提交
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-if="+item.isLive >= 3"
                  @click="configProduct(4, item.id,'1')"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-1"
                      small
                      style="position:relative;top:-1px"
                    >
                      mdi-arrow-down-circle
                    </v-icon>直播撤回
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:footer>
            <v-divider />
            <div
              v-if="productList.status && productList.data.items.length"
              class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
            >
              <div class="mr-2">
                共<span class="error--text">{{ productList.data.totalItem }}</span>商品
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
      v-model="dialogLive"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定将此商品{{ toLiveOperate === '3' ? '提交' : '撤回' }}直播吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="living"
            :disabled="living"
            @click="liveProduct"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogLive = false"
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
    <v-dialog
      v-model="dialogLabel"
      :attach="$refs.advancedSearch"
      content-class="ma-0"
      hide-overlay
    >
      <v-card>
        <v-card-title>
          批量设置标签
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="selectedProducts"
            :headers="headersLabel"
            item-key="id"
            no-data-text="暂无数据"
            hide-default-footer
            hide-default-header
            :items-per-page="20"
          >
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th>
                    商品货号
                  </th>
                  <th>商品名称</th>
                  <th>
                    <v-checkbox
                      :value="isNew.length === selectedProducts.length"
                      label="新品"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isNew.length > 0 && isNew.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event, 'isNew')"
                    />
                  </th>
                  <th>
                    <v-checkbox
                      :value="isHot.length === selectedProducts.length"
                      label="热卖"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isHot.length > 0 && isHot.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event,'isHot')"
                    />
                  </th>
                  <th>
                    <v-checkbox
                      :value="isRecommend.length === selectedProducts.length"
                      label="推荐"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isRecommend.length > 0 && isRecommend.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event,'isRecommend')"
                    />
                  </th>
                  <th>
                    <v-checkbox
                      :value="isPromotion.length === selectedProducts.length"
                      label="促销"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isPromotion.length > 0 && isPromotion.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event,'isPromotion')"
                    />
                  </th>
                  <th>
                    <v-checkbox
                      :value="isSpot.length === selectedProducts.length"
                      label="现货"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isSpot.length > 0 && isSpot.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event,'isSpot')"
                    />
                  </th>
                  <th>
                    <v-checkbox
                      :value="isOrder.length === selectedProducts.length"
                      label="订单"
                      class="ml-2 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="isOrder.length > 0 && isOrder.length < selectedProducts.length"
                      @change="setSelectedProductsLabel($event,'isOrder')"
                    />
                  </th>
                </tr>
              </thead>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                >
                  <td>{{ item.dno }}</td>
                  <td>{{ item.dnames }}</td>
                  <td>
                    <v-checkbox
                      v-model="isNew"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      v-model="isHot"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      v-model="isRecommend"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      v-model="isPromotion"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      v-model="isSpot"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                  <td>
                    <v-checkbox
                      v-model="isOrder"
                      label=""
                      class="ml-2 mt-0 pt-0"
                      dense
                      color="primary"
                      hide-details
                      :value="item.id"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <v-divider />
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-btn
            color="secondary"
            depressed
            class="ml-4"
            @click="dialogLabel = false"
          >
            取消
          </v-btn>
          <v-btn
            :loading="setttingLabel"
            color="primary mr-2"
            depressed
            @click="setProductLabel"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogSearch"
      :attach="$refs.advancedSearch"
      content-class="ma-0"
      hide-overlay
    >
      <v-card>
        <v-card-title>
          高级搜索
        </v-card-title>
        <v-form ref="form">
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                md="6"
                lg="4"
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
                md="6"
                lg="4"
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
                md="6"
                lg="4"
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
                md="6"
                lg="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">商品类别</span>
                  </div>
                  <div class="input-group-control">
                    <v-menu
                      v-model="showCategorySearch"
                      offset-y
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, value }">
                        <v-text-field
                          :value="categorySearchSelected.length ? categorySearchSelected[0].dnames : ''"
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
                          @click:clear="categorySearchSelected = []"
                        />
                      </template>
                      <v-card
                        elevation="0"
                        width="800"
                      >
                        <v-card-text>
                          <v-treeview
                            :items="productCategoryGetter"
                            :active="categorySearchSelected"
                            dense
                            item-text="dnames"
                            item-key="id"
                            item-children="son"
                            activatable
                            return-object
                            class="custom-treeview-class"
                            @update:active="getActiveCategorySearch"
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
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="4"
                xl="3"
              >
                <div class="input-group flex-nowrap">
                  <div class="input-group-prepend">
                    <span class="input-group-text">价格区间</span>
                  </div>
                  <div class="d-flex custom-text-field-wrap">
                    <div class="input-group-control">
                      <v-text-field
                        v-model="search.minPrice"
                        placeholder="最低价格"
                        solo
                        flat
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
                        placeholder="最高价格"
                        solo
                        flat
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
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="4"
                xl="3"
              >
                <div class="input-group flex-nowrap">
                  <div class="input-group-prepend">
                    <span class="input-group-text">上架时间</span>
                  </div>
                  <div class="d-flex custom-text-field-wrap">
                    <div class="input-group-control">
                      <v-menu
                        ref="menuStart"
                        v-model="menuStart"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="search.startShelfTime"
                            class="white"
                            placeholder="请选择上架时间"
                            single-line
                            dense
                            solo
                            flat
                            hide-details
                            clearable
                            readonly
                            v-on="on"
                            @click:clear="clearSearchConditions('startShelfTime')"
                          />
                        </template>
                        <v-date-picker
                          v-model="search.startShelfTime"
                          color="primary"
                          scrollable
                          @input="menuStart = false"
                        />
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
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="search.endShelfTime"
                            class="white"
                            placeholder="请选择截止时间"
                            single-line
                            clearable
                            dense
                            solo
                            flat
                            hide-details
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
                          @input="menuEnd = false"
                        />
                      </v-menu>
                    </div>
                    <div class="input-group-append mr-2">
                      <v-icon>mdi-calendar-import</v-icon>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">上架状态</span>
                  </div>
                  <div class="input-group-append">
                    <v-radio-group
                      v-model="search.dStatus"
                      row
                      dense
                      class="mt-0"
                      hide-details
                    >
                      <v-radio
                        v-for="item in status"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                        color="primary"
                      />
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">商品标签</span>
                  </div>
                  <div class="input-group-append">
                    <!-- <v-checkbox
                      :value="search.type.length === 6"
                      label="全部"
                      class="mr-4 mt-0"
                      dense
                      color="primary"
                      hide-details
                      :indeterminate="search.type.length > 0 && search.type.length < 6"
                      @change="selectProductType"
                    />
                    <v-checkbox
                      v-for="label in labels"
                      :key="label.value"
                      v-model="search.type"
                      :label="label.text"
                      :value="label.value"
                      class="mr-4 mt-0"
                      dense
                      color="primary"
                      hide-details
                    /> -->
                    <v-radio-group
                      v-model="search.type"
                      row
                      dense
                      class="mt-0"
                      hide-details
                    >
                      <v-radio
                        label="全部"
                        value="0"
                        color="primary"
                      />
                      <v-radio
                        v-for="label in labels"
                        :key="label.value"
                        :label="label.text"
                        :value="label.value"
                        color="primary"
                      />
                    </v-radio-group>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions class="pb-4">
          <v-btn
            color="secondary"
            class="ml-4"
            text
            @click="$refs.form.reset()"
          >
            清空
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="dialogSearch = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchProducts"
          >
            搜索
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import * as R from 'ramda';

export default {
  name: 'ProductList',
  data() {
    return {
      loadingDataItems: false,
      loadingCategory: false,
      dialogDelete: false,
      dialogOperate: false,
      dialogSearch: false,
      dialogLabel: false,
      menuStart: false,
      menuEnd: false,
      deleting: false,
      operating: false,
      showCategory: false,
      showCategorySearch: false,
      dnames: '',
      categorySelected: [],
      categorySearchSelected: [],
      search: {
        dStatus: '0',
        type: '0',
      },
      searchStatus: false,
      operate: '上架',
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
      currentStatus: '全部状态',
      productConfig: [
        {
          text: '查看',
          icon: 'mdi-file-document-box-search',
        },
        {
          text: '编辑',
          icon: 'mdi-pencil-circle',
        },
        {
          text: '删除',
          icon: 'mdi-delete-forever',
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
          text: '直播状态',
          value: 'isLive',
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
      headersLabel: [
        {
          text: '商品货号',
          align: 'left',
          sortable: false,
          value: 'dno',
          width: '200px',
        },
        {
          text: '商品名称',
          value: 'dnames',
          align: 'left',
          sortable: false,
          width: '300px',
        },
        {
          text: '新品',
          value: 'new',
          align: 'left',
          sortable: false,
        },
        {
          text: '热卖',
          value: 'hot',
          align: 'left',
          sortable: false,
        },
        {
          text: '推荐',
          value: 'recommend',
          align: 'left',
          sortable: false,
        },
        {
          text: '促销',
          value: 'promotion',
          align: 'left',
          sortable: false,
        },
        {
          text: '现货',
          value: 'spot',
          align: 'left',
          sortable: false,
        },
        {
          text: '订货',
          value: 'order',
          align: 'left',
          sortable: false,
        },
      ],
      labels: [
        {
          text: '最新新品',
          value: '2',
        },
        {
          text: '热卖商品',
          value: '3',
        },
        {
          text: '推荐商品',
          value: '4',
        },
        {
          text: '促销商品',
          value: '5',
        },
        {
          text: '现货商品',
          value: '6',
        },
        {
          text: '订货商品',
          value: '7',
        },
      ],
      isNew: [],
      isHot: [],
      isRecommend: [],
      isPromotion: [],
      isSpot: [],
      isOrder: [],
      pageEnter: 1,
      setttingLabel: false,
      dialogLive: false,
      living: false,
      toLiveProduct: '',
      toLiveOperate: '',
    };
  },
  computed: {
    ...mapState(['breadCrumbs']),
    ...mapState('product', ['productList', 'productCategory']),
    ...mapGetters('product', ['productCategoryGetter']),
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
    // selectedProductsForLabel() {
    //   return R.any(item => !!item.length, [this.isNew, this.isHot, this.isRecommend, this.isPromotion, this.isSpot, this.isOrder]);
    // },
    selectedProductsIds() {
      return R.pluck('id', this.selectedProducts);
    },
    notNew() {
      return R.without(this.isNew, this.selectedProductsIds);
    },
    notHot() {
      return R.without(this.isHot, this.selectedProductsIds);
    },
    notRecommend() {
      return R.without(this.isRecommend, this.selectedProductsIds);
    },
    notPromotion() {
      return R.without(this.isPromotion, this.selectedProductsIds);
    },
    notSpot() {
      return R.without(this.isSpot, this.selectedProductsIds);
    },
    notOrder() {
      return R.without(this.isOrder, this.selectedProductsIds);
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
    // this.getOnlineCate();
  },
  methods: {
    ...mapActions('product', [
      'getProductListAsync',
      'getCateListAsync',
      'deleteProductAsync',
      'operateProductAsync',
      'setProductLabelAsync',
      'setProductLiveAsync',
      'getOnlineCateAsync',
    ]),
    openDialogLabel() {
      this.isNew = R.pluck(
        'id',
        R.filter(R.propEq('isNew', '1'), this.selectedProducts)
      );
      this.isPromotion = R.pluck(
        'id',
        R.filter(R.propEq('isPromotion', '1'), this.selectedProducts)
      );
      this.isRecommend = R.pluck(
        'id',
        R.filter(R.propEq('isRecommend', '1'), this.selectedProducts)
      );
      this.isHot = R.pluck(
        'id',
        R.filter(R.propEq('isHot', '1'), this.selectedProducts)
      );
      this.isSpot = R.pluck(
        'id',
        R.filter(R.propEq('isSpot', '1'), this.selectedProducts)
      );
      this.isOrder = R.pluck(
        'id',
        R.filter(R.propEq('isOrder', '1'), this.selectedProducts)
      );
      this.dialogLabel = true;
    },
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
    // 批量设置标签
    setSelectedProductsLabel(v, target) {
      if (v) {
        this[target] = R.pluck('id', this.selectedProducts);
      } else {
        this[target] = [];
      }
    },
    clearAdvancedSearch() {
      this.searchStatus = false;
      this.getProductList({ p: '1' });
    },
    selectProductType(v) {
      if (v) {
        this.$set(this.search, 'type', ['2', '3', '4', '5', '6', '7']);
      } else {
        this.$set(this.search, 'type', []);
      }
    },
    searchProductByStatus(item) {
      this.currentStatus = item.text;
      this.getProductList({ dStatus: item.value, p: '1' });
    },
    liveProduct() {
      this.living = true;
      this.setProductLiveAsync({
        id: this.toLiveProduct,
        operate: this.toLiveOperate,
      }).then(() => {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'success',
          text: `恭喜，${this.toLiveOperate === '3' ? '提交' : '撤回'}成功!`,
        });
      })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.living = false;
          this.dialogLive = false;
        });
    },
    configProduct(i, id, toLive) {
      switch (i) {
        case 0:
          this.$router.push({ name: 'product_detail', params: { id } });
          break;
        case 1:
          this.$router.push({ name: 'product_edit', params: { id } });
          break;
        case 2:
          this.dialogDelete = true;
          this.toDeleteProducts = [id];
          break;
        case 3:
          this.dialogLive = true;
          this.toLiveProduct = id;
          this.toLiveOperate = toLive;
          break;
        case 4:
          this.dialogLive = true;
          this.toLiveProduct = id;
          this.toLiveOperate = toLive;
          break;
        default:
          break;
      }
    },
    reverseSelectedProducts() {
      this.selectedProducts = R.without(
        this.selectedProducts,
        this.productList.data.items
      );
    },
    getActiveCategory(arr) {
      this.categorySelected = arr;
      this.getProductList({
        categoryId: R.prop('id', R.head(this.categorySelected)),
        p: '1',
      });
      this.showCategory = false;
    },
    getActiveCategorySearch(arr) {
      this.categorySearchSelected = arr;
      this.$set(
        this.search,
        'categoryId',
        R.prop('id', R.head(this.categorySearchSelected))
      );
      this.showCategorySearch = false;
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
      this.dialogSearch = false;
      this.searchStatus = true;
      this.getProductList(this.search);
    },
    clearSearchConditions(target) {
      this.search[target] = '';
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
    setProductLabel() {
      this.setttingLabel = true;
      const tempIds = JSON.parse(JSON.stringify(this.selectedProductsIds));
      const promises = [];
      if (this.isNew.length) {
        promises.push(this.setLabelToNew());
      }
      if (this.notNew.length) {
        promises.push(this.cancelLabelFromNew());
      }
      if (this.isHot.length) {
        promises.push(this.setLabelToHot());
      }
      if (this.notHot.length) {
        promises.push(this.cancelLabelFromHot());
      }
      if (this.isRecommend.length) {
        promises.push(this.setLabelToRecommend());
      }
      if (this.notRecommend.length) {
        promises.push(this.cancelLabelFromRecommend());
      }
      if (this.isPromotion.length) {
        promises.push(this.setLabelToPromotion());
      }
      if (this.notPromotion.length) {
        promises.push(this.cancelLabelFromPromotion());
      }
      if (this.isSpot.length) {
        promises.push(this.setLabelToSpot());
      }
      if (this.notSpot.length) {
        promises.push(this.cancelLabelFromSpot());
      }
      if (this.isOrder.length) {
        promises.push(this.setLabelToOrder());
      }
      if (this.notOrder.length) {
        promises.push(this.cancelLabelFromOrder());
      }
      Promise.all(promises)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，设置标签成功!',
          });
          this.getProductListAsync(this.search)
            .then(() => {
              this.dialogLabel = false;
              this.selectedProducts = R.filter(
                item => R.includes(item.id, tempIds),
                this.productList.data.items
              );
            })
            .catch((err) => {
              this.checkErr(err, 'setProductLabel');
            })
            .finally(() => {
              this.setttingLabel = false;
            });
        })
        .catch((err) => {
          this.checkErr(err, 'setProductLabel');
        });
      // const params = {
      //   index: i + 1,
      //   operate: isSet ? '1' : '2',
      //   id: R.pluck('id', this.selectedProducts),
      // };
      // this.setProductLabelAsync(params)
      //   .then(() => {
      //     this.$store.commit('TOGGLE_SNACKBAR', {
      //       type: 'success',
      //       text: `恭喜，${isSet ? '设置' : '取消'}标签成功!`,
      //     });
      //     this.selectedProducts = [];
      //   })
      //   .catch(err => this.checkErr(err))
      //   .finally(() => this.$store.commit('END_LOADING'));
    },
    async setLabelToNew() {
      return this.setProductLabelAsync({
        index: 1,
        operate: '1',
        id: this.isNew,
      });
    },
    async cancelLabelFromNew() {
      return this.setProductLabelAsync({
        index: 1,
        operate: '2',
        id: this.notNew,
      });
    },
    async setLabelToHot() {
      return this.setProductLabelAsync({
        index: 2,
        operate: '1',
        id: this.isHot,
      });
    },
    async cancelLabelFromHot() {
      return this.setProductLabelAsync({
        index: 2,
        operate: '2',
        id: this.notHot,
      });
    },
    async setLabelToRecommend() {
      return this.setProductLabelAsync({
        index: 3,
        operate: '1',
        id: this.isRecommend,
      });
    },
    async cancelLabelFromRecommend() {
      return this.setProductLabelAsync({
        index: 3,
        operate: '2',
        id: this.notRecommend,
      });
    },
    async setLabelToPromotion() {
      return this.setProductLabelAsync({
        index: 4,
        operate: '1',
        id: this.isPromotion,
      });
    },
    async cancelLabelFromPromotion() {
      return this.setProductLabelAsync({
        index: 4,
        operate: '2',
        id: this.notPromotion,
      });
    },
    async setLabelToSpot() {
      return this.setProductLabelAsync({
        index: 5,
        operate: '1',
        id: this.isSpot,
      });
    },
    async cancelLabelFromSpot() {
      return this.setProductLabelAsync({
        index: 5,
        operate: '2',
        id: this.notSpot,
      });
    },
    async setLabelToOrder() {
      return this.setProductLabelAsync({
        index: 6,
        operate: '1',
        id: this.isOrder,
      });
    },
    async cancelLabelFromOrder() {
      return this.setProductLabelAsync({
        index: 6,
        operate: '2',
        id: this.notOrder,
      });
    },
    getOnlineCate() {
      this.getOnlineCateAsync().catch((err) => {
        this.checkErr(err, 'getOnlineCate');
      });
    },
  },
};
</script>
