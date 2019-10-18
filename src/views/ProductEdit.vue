<template>
  <div>
    <div class="title">
      编辑商品
    </div>
    <v-divider class="my-4" />
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          选择商品类别
          <span class="error--text ml-auto body-2">注：选择商品分类后，对应的属性规格才会展示出来。</span>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col
              cols="12"
              lg="6"
              xl="4"
            >
              <v-dialog
                ref="dialog"
                v-model="dialogCategory"
                width="600px"
              >
                <template v-slot:activator="{ on }">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">商品分类</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="product.categoryName"
                        :rules="cateRules"
                        :loading="loadingCate"
                        :disabled="loadingCate"
                        placeholder="请选择分类"
                        readonly
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                        append-icon="mdi-menu-down"
                        v-on="on"
                        @click:clear="product.categoryName = '';product.categoryId = ''"
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
                      <template v-slot:prepend="{ item, leaf, open }">
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
                      @click="dialogCategory = false"
                    >
                      取消
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">包含规格</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="product.containSpec"
                    :items="containSpecOptions"
                    :disabled="!spec.length"
                    placeholder="请选择是否包含规格"
                    single-line
                    hide-details
                    dense
                    outlined
                    clearable
                    no-data-text="暂无数据"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title">
          基础信息
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">商品名称</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="product.dnames"
                    :rules="nameRules"
                    placeholder="请输入商品名称"
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">商品品牌</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="product.brandId"
                    :items="brandFilter(searchBrand)"
                    :loading="loadingBrand"
                    :disabled="loadingBrand"
                    item-text="dnames"
                    item-value="id"
                    placeholder="请选择商品品牌"
                    single-line
                    hide-details
                    dense
                    outlined
                    clearable
                    no-data-text="暂无数据"
                  >
                    <template v-slot:prepend-item>
                      <v-form>
                        <div class="pa-3">
                          <v-text-field
                            v-model="searchBrand"
                            placeholder="输入品牌名称搜索"
                            append-icon="mdi-magnify"
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                            dense
                          />
                        </div>
                      </v-form>
                    </template>
                  </v-select>
                </div>
                <div class="input-group-append">
                  <v-btn
                    color="secondary"
                    depressed
                    @click="dialogBrand = true"
                  >
                    <v-icon left>
                      mdi-plus
                    </v-icon> 添加品牌
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">商品货号</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="product.dno"
                    :rules="numberRules"
                    placeholder="请输入商品货号"
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">&nbsp;起&nbsp;订&nbsp;量&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="product.moq"
                    :rules="moqRules"
                    type="number"
                    placeholder="请输入起订量"
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">商品单位</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    :value="product.unitId"
                    :items="productUnits.data"
                    :rules="unitRules"
                    :loading="loadingUnits"
                    :disabled="loadingUnits"
                    item-text="dnames"
                    item-value="id"
                    placeholder="请选择商品单位"
                    single-line
                    hide-details
                    dense
                    outlined
                    clearable
                    return-object
                    no-data-text="暂无数据"
                    @change="selectProductUnit"
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">库存数量</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="product.stock"
                    type="number"
                    placeholder="请输入库存数量"
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </div>
                <div class="input-group-append">
                  <span class="input-group-text py-0 ">
                    <v-checkbox
                      v-model="product.zeroInventory"
                      label="零库存出售"
                      color="primary"
                      class="mt-0 pt-0 overflow-hidden"
                      style="height:34px;"
                    />
                  </span>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">打包销售</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="isBundle"
                    :items="bundleOptions"
                    :disabled="!product.unitId"
                    placeholder="是否打包销售"
                    single-line
                    hide-details
                    dense
                    outlined
                    clearable
                    no-data-text="暂无数据"
                    @change="setBundle"
                  />
                </div>
              </div>
            </v-col>
            <v-slide-y-transition>
              <v-col
                v-if="product.containSpec === '0'"
                cols="12"
                md="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">&nbsp;成&nbsp;本&nbsp;价&nbsp;</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="product.costPrice"
                      :rules="costPriceRules"
                      type="number"
                      placeholder="请输入成本价"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
            </v-slide-y-transition>
            <v-slide-y-transition>
              <v-col
                v-if="product.containSpec === '0'"
                cols="12"
                md="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">&nbsp;销&nbsp;售&nbsp;价&nbsp;</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="product.price"
                      :rules="priceRules"
                      type="number"
                      placeholder="请输入销售价"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
            </v-slide-y-transition>
            <v-slide-y-transition>
              <v-col
                v-if="product.containSpec === '0'"
                cols="12"
                md="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">商品重量</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="product.weight"
                      type="number"
                      placeholder="请输入商品重量"
                      suffix="克"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
            </v-slide-y-transition>
            <v-slide-y-transition>
              <v-col
                v-if="product.containSpec === '0'"
                cols="12"
                md="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">&nbsp;条&nbsp;形&nbsp;码&nbsp;</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="product.barCode"
                      placeholder="请输入条形码"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
            </v-slide-y-transition>
          </v-row>
          <v-slide-y-transition>
            <div v-if="isBundle === '1'">
              <v-card
                flat
                outlined
                class="body-1"
              >
                <v-card-title class="pa-3 grey lighten-3 title d-flex">
                  打包设置
                  <span class="ml-auto body-2 error--text">设置打包单位后请点击下方按钮确认添加</span>
                </v-card-title>
                <div class="pa-3">
                  基本商品单位：<span class="success--text font-weight-bold">【{{ selectedUnitName }}】</span>，剩余可设置打包单位<span class="success--text font-weight-bold">【{{ unitString }}】</span>
                  <v-row>
                    <template v-if="product.units.length">
                      <v-col
                        v-for="(bundle, i) in product.units"
                        :key="i"
                        cols="12"
                        md="6"
                        xl="4"
                      >
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">1</span>
                          </div>
                          <div class="input-group-control">
                            <v-select
                              v-model="bundle.id"
                              :items="productUnits.data"
                              disabled
                              item-text="dnames"
                              item-value="id"
                              placeholder="打包单位"
                              single-line
                              hide-details
                              dense
                              outlined
                              no-data-text="暂无数据"
                            />
                          </div>
                          <div class="input-group-innerpend">
                            <span class="input-group-text">=</span>
                          </div>
                          <div class="input-group-control">
                            <v-text-field
                              v-model="bundle.packeNum"
                              outlined
                              single-line
                              hide-details
                              dense
                              placeholder="多少"
                            />
                          </div>
                          <div class="input-group-innerpend">
                            <span class="input-group-text">{{ selectedUnitName }}</span>
                          </div>
                          <div class="input-group-append">
                            <span class="input-group-text pa-0">
                              <v-btn
                                color="secondary"
                                icon
                                tile
                                @click="deleteBundle(bundle,i)"
                              >
                                <v-icon>mdi-close-circle mdi-18px</v-icon>
                              </v-btn>
                            </span>
                          </div>
                        </div>
                      </v-col>
                    </template>
                    <template v-if="product.units.length !== productUnits.data.length - 1 && addable">
                      <v-col
                        cols="12"
                        md="6"
                        xl="4"
                      >
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">1</span>
                          </div>
                          <div class="input-group-control">
                            <v-select
                              v-model="bundleCurrent.id"
                              :items="unitsLeft"
                              item-text="dnames"
                              item-value="id"
                              placeholder="打包单位"
                              single-line
                              hide-details
                              dense
                              clearable
                              outlined
                              no-data-text="暂无数据"
                            />
                          </div>
                          <div class="input-group-innerpend">
                            <span class="input-group-text">=</span>
                          </div>
                          <div class="input-group-control">
                            <v-text-field
                              v-model="bundleCurrent.packeNum"
                              outlined
                              single-line
                              hide-details
                              dense
                              placeholder="多少"
                            />
                          </div>
                          <div class="input-group-innerpend">
                            <span class="input-group-text">{{ selectedUnitName || '未设置' }}</span>
                          </div>
                          <div class="input-group-append">
                            <span class="input-group-text pa-0">
                              <v-btn
                                color="secondary"
                                icon
                                tile
                                @click="addable = false"
                              >
                                <v-icon>mdi-close-circle mdi-18px</v-icon>
                              </v-btn>
                            </span>
                          </div>
                        </div>
                      </v-col>
                    </template>
                  </v-row>
                  <v-btn
                    :disabled="disallowAddBundle"
                    color="primary"
                    outlined
                    @click="addBundle"
                  >
                    <v-icon>mdi-plus</v-icon>确认添加
                  </v-btn>
                  <v-btn
                    v-if="!addable"
                    class="ml-2"
                    color="secondary"
                    outlined
                    @click="addable = true"
                  >
                    <v-icon>mdi-plus</v-icon>添加
                  </v-btn>
                </div>
              </v-card>
            </div>
          </v-slide-y-transition>
        </v-card-text>
      </v-card>
      <v-slide-y-transition>
        <v-card
          v-if="attrOptions.length"
          outlined
          elevation="1"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品属性
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col
                v-for="attr in attrOptions"
                :key="attr.attrId"
                cols="12"
                lg="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">{{ attr.attrName }}</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-if="attr.genre === '1'"
                      v-model="attr.attrValue"
                      :placeholder="`请输入${attr.attrName}`"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
                    />
                    <v-select
                      v-else
                      v-model="attr.attrValue"
                      :items="attr.attrItem"
                      item-text="attrItemName"
                      item-value="attrItemId"
                      :placeholder="`请选择${attr.attrName}`"
                      single-line
                      hide-details
                      dense
                      outlined
                      clearable
                      return-object
                      no-data-text="暂无数据"
                      :chips="attr.genre === '3'"
                      :small-chips="attr.genre === '3'"
                      :multiple="attr.genre === '3'"
                      :deletable-chips="attr.genre === '3'"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-card
          v-if="specOptions.length && product.containSpec === '1'"
          outlined
          elevation="1"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品规格
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col
                v-for="specOption in specOptions"
                :key="specOption.index"
                cols="12"
                lg="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">{{ specOption.specName }}</span>
                  </div>
                  <div class="input-group-control">
                    <v-select
                      v-model="specOption.selected"
                      :items="specOption.specItem"
                      item-text="itemName"
                      :placeholder="`请选择${specOption.specName}`"
                      single-line
                      hide-details
                      dense
                      outlined
                      clearable
                      return-object
                      no-data-text="暂无数据"
                      chips
                      small-chips
                      deletable-chips
                      multiple
                      @click:clear="dataItems = []"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-slide-y-transition>
              <v-card
                v-if="selectedDetails.length"
                class="mt-4"
                outlined
              >
                <v-card-title class="grey lighten-3 pa-4 title d-flex align-center">
                  可选规格
                  <span class="error--text body-2 ml-auto">请选择您要设置的规格</span>
                </v-card-title>
                <v-card-text class="pt-4">
                  <v-chip-group
                    v-model="dataItemsDetailNames"
                    multiple
                    column
                    active-class="primary"
                  >
                    <v-chip
                      v-for="detail in selectedDetails"
                      :key="detail.detailName"
                      :value="detail.detailName"
                      filter
                    >
                      {{ detail.detailName }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-card
          v-if="dataItems.length && product.containSpec === '1'"
          class="mb-4"
          outlined
        >
          <v-simple-table
            class="text-center"
            fixed-header
          >
            <thead>
              <tr>
                <th
                  width="100"
                  class="text-center"
                >
                  主图
                </th>
                <th class="text-center">
                  规格
                </th>
                <th class="text-center">
                  成本价
                </th>
                <th class="text-center">
                  销售价
                </th>
                <th class="text-center">
                  重量
                </th>
                <th class="text-center">
                  条形码
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in dataItems"
                :key="i"
              >
                <td class="py-3">
                  <img-upload
                    :image="item.image"
                    @update:src="item.image = $event;$forceUpdate()"
                    @update:delete="item.image = '';$forceUpdate()"
                  />
                </td>
                <td class="py-3">
                  {{ item.detailName }}
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.costPrice"
                    :rules="costRules"
                    type="number"
                    placeholder=""
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.price"
                    :rules="priceRules"
                    type="number"
                    placeholder=""
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.weight"
                    type="number"
                    suffix="克"
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.barCode"
                    placeholder=""
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                    dense
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-slide-y-transition>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title">
          商品图片
        </v-card-title>
        <v-card-text class="pt-4">
          <p>图片格式JPEG，文件大小4M以内，您最多可以上传 6 张图片,切勿盗用他人图片，以免受网规处罚。</p>
          <v-card outlined>
            <v-card-text>
              <div class="mb-2">
                <img-upload-multiple
                  :counter="6"
                  @update:pics="getMultipleImgs"
                />
                <v-btn
                  color="secondary"
                  outlined
                  class="ml-3"
                  @click="product.images = [
                    { image: '' },
                    { image: '' },
                    { image: '' },
                    { image: '' },
                    { image: '' },
                    { image: '' },
                  ]"
                >
                  <v-icon left>
                    mdi-delete-forever mdi-18px
                  </v-icon>全部删除
                </v-btn>
              </div>
              <v-row>
                <v-col
                  v-for="(img,i) in product.images"
                  :key="i"
                  cols="6"
                  md="3"
                  lg="2"
                  xl="1"
                >
                  <img-upload
                    :image="img.image"
                    icon-size="36px"
                    @update:src="img.image = $event"
                    @update:delete="img.image = ''"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title">
          商品描述
        </v-card-title>
        <component
          :is="component"
          :content="product.detailDesc"
          @update:html="product.detailDesc = $event"
        />
      </v-card>
      <v-card
        outlined
        elevation="1"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title">
          商品供应商
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col
              cols="12"
              lg="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">商品供应商</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="product.supplyers"
                    :items="supplierFilter(searchSupplier)"
                    :loading="loadingSuppliers"
                    :disabled="loadingSuppliers"
                    item-text="dnames"
                    item-value="supplyId"
                    placeholder="请选择商品供应商"
                    single-line
                    hide-details
                    dense
                    outlined
                    clearable
                    no-data-text="暂无数据"
                    chips
                    small-chips
                    multiple
                    deletable-chips
                  >
                    <template v-slot:prepend-item>
                      <v-form>
                        <div class="pa-3">
                          <v-text-field
                            v-model="searchSupplier"
                            placeholder="输入供应商名称搜索"
                            append-icon="mdi-magnify"
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                            dense
                          />
                        </div>
                      </v-form>
                    </template>
                  </v-select>
                </div>
                <div class="input-group-append">
                  <v-btn
                    color="secondary"
                    depressed
                    @click="dialogSupplier = true"
                  >
                    <v-icon left>
                      mdi-plus
                    </v-icon> 添加供应商
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-btn
        :loading="editing"
        :disabled="!valid || editing"
        color="primary"
        large
        class="px-12 body-1"
        @click="editProduct"
      >
        提交
      </v-btn>
    </v-form>
    <brand-single
      :show="dialogBrand"
      @close-dialog="dialogBrand = false"
    />
    <supplier-single
      :show="dialogSupplier"
      @close-dialog="dialogSupplier = false"
    />
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions, mapGetters } from 'vuex';
import BrandSingle from '@/components/BrandSingle.vue';
import ImgUpload from '@/components/ImgUpload.vue';
import ImgUploadMultiple from '@/components/ImgUploadMultiple.vue';
import SupplierSingle from '@/components/SupplierSingle.vue';
import WangEditor from '@/components/WangEditor.vue';

const mapIndexed = R.addIndex(R.map);

export default {
  name: 'ProductEdit',
  components: {
    BrandSingle,
    ImgUpload,
    ImgUploadMultiple,
    SupplierSingle,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      component: null,
      loadingCate: false,
      loadingBrand: false,
      loadingUnits: false,
      loadingSuppliers: false,
      addable: true,
      editing: false,
      valid: true,
      dialogBrand: false,
      dialogSupplier: false,
      dialogCategory: false,
      searchSupplier: '',
      searchBrand: '',
      product: {
        containSpec: '0',
        zeroInventory: false,
        units: [],
        attr: [],
        unitId: '',
        images: [
          { image: '' },
          { image: '' },
          { image: '' },
          { image: '' },
          { image: '' },
          { image: '' },
        ],
        detailDesc: '',
      },
      // 是否打包销售
      isBundle: '0',
      // 已选单位名称
      selectedUnitName: '',
      categorySelected: [],
      bundleCurrent: {
        id: '',
        packeNum: '',
      },
      bundleOptions: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '0',
          text: '否',
        },
      ],
      containSpecOptions: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '0',
          text: '否',
        },
      ],
      attrOptions: [],
      specOptions: [],
      dataItemsDetailNames: [],
      unitsLeft: [],
      cateRules: [v => !!v || '请选择商品分类'],
      nameRules: [v => !!v || '请填写商品名称'],
      numberRules: [v => !!v || '请填写商品货号'],
      moqRules: [v => !!v || '请填写起订量'],
      stockRules: [v => !!v || '请填写库存数量'],
      unitRules: [v => !!v || '请选择商品单位'],
      costRules: [v => (v && v >= 0) || '成本价不能小于0'],
      costPriceRules: [
        v => !!v || '请填写成本价',
        v => (v && v >= 0) || '成本价不能小于0',
      ],
      priceRules: [
        v => !!v || '请填写销售价',
        v => (v && v >= 0) || '销售价不能小于0',
      ],
      res: {},
    };
  },
  computed: {
    ...mapState('product', ['productCategory', 'productBrand', 'productUnits']),
    ...mapGetters('product', ['productBrandInUse', 'brandFilter']),
    ...mapState('supplier', ['supplierList']),
    ...mapGetters('supplier', ['supplierFilter']),
    unitString() {
      return R.join(',', R.pluck('dnames', this.unitsLeft));
    },
    attrTransed() {
      return R.map((item) => {
        if (item.genre === '3') {
          return R.compose(
            R.mergeRight({ id: '0' }),
            R.dissoc('attrItem')
          )(item);
        }
        return R.dissoc('attrItem', item);
      }, this.attrOptions);
    },
    spec() {
      return R.map(
        item => ({
          id: item.id,
          specName: item.specName,
          index: item.index,
          specItem: item.selected,
        }),
        this.specOptions
      );
    },
    params() {
      return R.evolve(
        {
          zeroInventory: v => (v ? '1' : '0'),
          images: R.compose(
            R.reject(R.isEmpty),
            R.pluck('image')
          ),
          attr: () => R.filter(R.has('attrValue'), this.attrTransed),
          units: arr => R.map(
              item => ({
                unitId: item.id,
                packeNum: item.packeNum,
              }),
              arr
            ),
        },
        this.product
      );
    },
    // 不允许添加打包单位
    disallowAddBundle() {
      return !this.bundleCurrent.id || !this.bundleCurrent.packeNum;
    },
    // 已选规格
    selectedSpecOptions() {
      return R.map(R.prop('selected'), this.specOptions);
    },
    // 所有规格组合
    currentSpecOptions() {
      return (
        R.reduce(
          R.xprod,
          R.head(this.selectedSpecOptions),
          R.tail(this.selectedSpecOptions)
        ) || []
      );
    },
    // 可选规格组合
    selectedDetails() {
      return R.map(
        R.compose(
          R.mergeRight({
            id: '0',
            image: '',
            costPrice: '',
            price: '',
            weight: '',
            barCode: '',
          }),
          arr => ({
            specItems: R.map(
              item => ({
                specId: item.specIndex,
                specName: item.specName,
                specItemId: item.index,
                specItemName: item.itemName,
                isNew: '1',
              }),
              arr
            ),
            detailName: R.join('/', R.pluck('itemName', arr)),
          })
        ),
        this.currentSpecOptions
      );
    },
    // 已选规格组合
    dataItems() {
      let arr = R.filter(
        item => R.includes(item.detailName, this.dataItemsDetailNames),
        this.selectedDetails
      );
      if (this.product.detail) {
        arr = R.map((item) => {
          const fetchDetail = R.find(
            R.propEq('detailName', item.detailName),
            this.product.detail
          );
          if (fetchDetail) {
            item = R.mergeRight(item, fetchDetail);
          }
          return item;
        }, arr);
      }
      return arr;
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
        disabled: false,
        to: { name: 'product_list' },
        exact: true,
      },
      {
        text: '编辑商品',
        disabled: true,
        exact: true,
      },
    ]);
    this.getProductDetailEdit();
    // if (!this.productCategory.status) {
    this.loadingCate = true;
    this.getCateListAsync()
      .catch((err) => {
        this.checkErr(err, 'getCateListAsync');
      })
      .finally(() => {
        this.loadingCate = false;
      });
    // }
    // if (!this.productBrand.status) {
    this.loadingBrand = true;
    this.getBrandListAsync({ isUse: '1' })
      .catch((err) => {
        this.checkErr(err, 'getBrandListAsync');
      })
      .finally(() => {
        this.loadingBrand = false;
      });
    // }
    // if (!this.supplierList.status) {
    this.loadingSuppliers = true;
    this.getSupplierListAsync({ locked: '0' })
      .catch((err) => {
        this.checkErr(err, 'getSupplierListAsync');
      })
      .finally(() => {
        this.loadingSuppliers = false;
      });
    // }
  },
  methods: {
    ...mapActions('product', [
      'getCateListAsync',
      'getCateAttrSpecAsync',
      'getBrandListAsync',
      'getUnitsListAsync',
      'editProductAsync',
      'getProductDetailEditAsync',
    ]),
    ...mapActions('supplier', ['getSupplierListAsync']),
    // 获取当前产品分类
    getActiveCategory(arr) {
      this.categorySelected = arr;
    },
    setProductCategory() {
      this.product.categoryId = R.prop('id', R.head(this.categorySelected));
      this.product.categoryName = R.prop(
        'dnames',
        R.head(this.categorySelected)
      );
      this.dialogCategory = false;
      this.getCateAttrSpec();
    },
    getCateAttrSpec(edit) {
      this.getCateAttrSpecAsync({ categoryId: this.product.categoryId })
        .then((res) => {
          this.attrOptions = res.attr;
          if (edit) {
            // 编辑时设置属性
            this.attrOptions = R.map((item) => {
              const value = R.prop(
                'attrValue',
                R.find(R.propEq('attrId', item.attrId), this.product.attr)
              );
              if (value) {
                item.attrValue = value;
              }
              return item;
            }, this.attrOptions || []);
            // 编辑时设置规格
            this.specOptions = mapIndexed((item, i) => {
              item = R.mergeRight(
                item,
                R.dissoc('specItem', this.product.spec[i])
              );
              item.selected = this.product.spec[i].specItem;
              item.specItem = R.map((specSingleItem) => {
                const fetchSpec = R.find(
                  subitem => subitem.index === `${specSingleItem.index}`,
                  item.selected
                );
                if (fetchSpec) {
                  specSingleItem = fetchSpec;
                }
                return specSingleItem;
              }, item.specItem);
              return item;
            }, res.spec || []);
            this.dataItemsDetailNames = R.pluck(
              'detailName',
              this.product.detail || []
            );
          } else {
            this.specOptions = R.map(R.assoc('selected', []), res.spec);
          }
        })
        .catch((err) => {
          this.checkErr(err, 'getCateAttrSpec');
        });
    },
    // 设置打包销售
    setUnitsLeft(params) {
      this.unitsLeft = R.reject(R.propEq('id', params), this.unitsLeft);
    },
    addBundle() {
      this.setUnitsLeft(this.bundleCurrent.id);
      this.$set(
        this.product,
        'units',
        R.append(this.bundleCurrent, this.product.units)
      );
      this.bundleCurrent = {
        id: '',
        packeNum: '',
      };
    },
    deleteBundle(bundle, i) {
      this.unitsLeft = R.append(
        R.find(R.propEq('id', bundle.id), this.productUnits.data),
        this.unitsLeft
      );
      this.$set(this.product, 'units', R.remove(i, 1, this.product.units));
    },
    // 选择商品单位
    selectProductUnit(v) {
      this.product.unitId = v.id;
      this.selectedUnitName = v.dnames;
      this.unitsLeft = R.reject(R.propEq('id', v.id), this.productUnits.data);
      this.product.units = [];
    },
    editProduct() {
      this.editing = true;
      const postData = this.params;
      if (this.product.containSpec === '1') {
        postData.spec = this.spec;
        postData.detail = this.dataItems;
      }
      this.editProductAsync(postData)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，修改成功!',
          });
          this.$router.replace({ name: 'product_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'editProduct');
        })
        .finally(() => {
          this.editing = false;
        });
    },
    // 批量添加图片
    getMultipleImgs(pics) {
      // const mapIndexed = R.addIndex(R.map);
      this.$set(
        this.product,
        'images',
        mapIndexed((item, i) => {
          if (pics[i]) {
            item.image = pics[i];
          } else {
            item = {
              image: '',
            };
          }
          return item;
        }, this.product.images)
      );
    },
    setBundle(v) {
      if (v === '0' || !this.product.units) {
        this.product.units = [];
      }
    },
    // 获取产品详情
    async getProductDetailEdit() {
      this.$store.commit('START_LOADING');
      if (!this.productUnits.status) {
        await this.getUnitsListAsync();
      }
      this.getProductDetailEditAsync({ id: this.id })
        .then((res) => {
          this.res = res;
          const response = R.clone(res);
          // 是否设置了供应商
          if (response.supplyers) {
            response.supplyers = R.pluck('supplyerId', res.supplyers);
          } else {
            response.supplyers = [];
          }
          // 是否上传了图片
          if (response.images) {
            response.images = R.concat(
              response.images,
              R.times(() => R.clone({ image: '' }), 6 - response.images.length)
            );
          } else {
            response.images = R.times(() => R.clone({ image: '' }), 6);
          }
          // 设置已选中单位
          this.selectedUnitName = response.unitName;
          this.unitsLeft = R.reject(
            R.propEq('id', response.unitId),
            this.productUnits.data
          );
          if (response.units) {
            this.isBundle = '1';
            response.units = R.map((item) => {
              item.id = item.unitId;
              return item;
            }, response.units);
            R.map(item => this.setUnitsLeft(item.id), response.units);
            // console.log(
            //   '函数: getProductDetailEdit -> response.units',
            //   response.units
            // );
          }
          this.product = response;
          // 异步获取描述结束再挂载编辑器
          this.component = WangEditor;
          this.getCateAttrSpec(true);
        })
        .catch((err) => {
          this.checkErr(err, 'getProductDetailEditAsync');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
  },
};
</script>
