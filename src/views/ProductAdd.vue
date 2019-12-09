<template>
  <div>
    <div class="title">
      添加商品
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
                        v-model="cateName"
                        :rules="cateRules"
                        :loading="loadingCate"
                        :disabled="loadingCate"
                        placeholder="请选择分类"
                        dense
                        readonly
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        append-icon="mdi-menu-down"
                        v-on="on"
                        @click:clear="cateName = '';product.categoryId = ''"
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
                    :disabled="!specOptions.length"
                    placeholder="请选择是否包含规格"
                    dense
                    single-line
                    hide-details
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
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
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
                    dense
                    single-line
                    hide-details
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
                            dense
                            append-icon="mdi-magnify"
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
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
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
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
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
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
                    dense
                    single-line
                    hide-details
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
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </div>
                <div class="input-group-append">
                  <span class="input-group-text py-0 mb-0">
                    <v-checkbox
                      v-model="product.zeroInventory"
                      label="零库存出售"
                      color="primary"
                      class="mt-0 overflow-hidden"
                      hide-details
                    />
                  </span>
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
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
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
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
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
                      dense
                      suffix="克"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
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
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                    />
                  </div>
                </div>
              </v-col>
            </v-slide-y-transition>
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
                    dense
                    single-line
                    hide-details
                    outlined
                    clearable
                    no-data-text="暂无数据"
                    @change="setBundle"
                  />
                </div>
              </div>
            </v-col>
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
                        <div class="input-group">
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
                              dense
                              single-line
                              hide-details
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
                              placeholder="多少"
                              dense
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
                              dense
                              single-line
                              hide-details
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
                              placeholder="多少"
                              dense
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
          outlined
          elevation="1"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品参数
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col
                v-for="(attr, i) in attrOptions"
                :key="i"
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
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      :append-icon="attr.attrId === '0' ? 'mdi-delete' : ''"
                      @click:append="deleteAttrAdded(i)"
                    />
                    <v-select
                      v-else
                      v-model="attr.attrValue"
                      :items="attr.attrItem"
                      item-text="attrItemName"
                      item-value="attrItemId"
                      :placeholder="`请选择${attr.attrName}`"
                      dense
                      single-line
                      hide-details
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
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  outlined
                  @click="dialogAddAttr = true"
                >
                  <v-icon>mdi-plus</v-icon>添加参数
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-card
          v-if="product.containSpec === '1'"
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
                      dense
                      single-line
                      hide-details
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
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  outlined
                  @click="dialogAddSpec = true"
                >
                  <v-icon>mdi-plus</v-icon>添加规格
                </v-btn>
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
          <v-simple-table class="text-center">
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
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.price"
                    :rules="priceRules"
                    type="number"
                    placeholder=""
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.weight"
                    type="number"
                    suffix="克"
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
                  />
                </td>
                <td class="py-3">
                  <v-text-field
                    v-model="item.barCode"
                    placeholder=""
                    dense
                    outlined
                    clearable
                    required
                    single-line
                    hide-details
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
                    :image="img.src"
                    icon-size="36px"
                    @update:src="img.src = $event"
                    @update:delete="img.src = ''"
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
        <wang-editor @update:html="product.detailDesc = $event" />
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
                    dense
                    single-line
                    outlined
                    clearable
                    no-data-text="暂无数据"
                    chips
                    small-chips
                    multiple
                    deletable-chips
                    hide-details
                  >
                    <template v-slot:prepend-item>
                      <v-form>
                        <div class="pa-3">
                          <v-text-field
                            v-model="searchSupplier"
                            placeholder="输入供应商名称搜索"
                            append-icon="mdi-magnify"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
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
      <!-- <v-btn
        :disabled="!valid"
        color="secondary"
        large
        class="px-12 body-1 mr-2"
      >
        保存
      </v-btn> -->
      <v-btn
        :loading="adding"
        :disabled="!valid || adding ||(!dataItems.length && product.containSpec === '1')"
        color="primary"
        large
        class="px-12 body-1"
        @click="addProduct"
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
    <v-dialog
      v-model="dialogAddAttr"
      width="500"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="validAddAttr"
        >
          <v-card-title class="title grey lighten-3 pa-4 d-flex justify-space-between">
            添加商品属性
          </v-card-title>
          <div class="pa-4">
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>属性名称：
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="attrToAdd.attrName"
                  :rules="attrNameRules"
                  placeholder="请输入属性名称"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>属性值：
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="attrToAdd.attrValue"
                  :rules="attrValueRules"
                  placeholder="请输入属性值"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!validAddAttr"
              @click="addAttrLocal"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogAddAttr = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogAddSpec"
      width="500"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="validAddSpec"
        >
          <v-card-title class="title grey lighten-3 pa-4 d-flex justify-space-between">
            添加商品规格
          </v-card-title>
          <div class="pa-4">
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>规格名称：
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="specToAdd.specName"
                  :rules="specNameRules"
                  placeholder="请输入属性名称"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>属性值：
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="specToAdd.specValue"
                  :rules="specValueRules"
                  placeholder="多个属性值用/分隔"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!validAddSpec"
              @click="addSpecLocal"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogAddSpec = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
  name: 'ProductAdd',
  components: {
    BrandSingle,
    ImgUpload,
    ImgUploadMultiple,
    SupplierSingle,
    WangEditor,
  },
  data() {
    return {
      loadingCate: false,
      loadingBrand: false,
      loadingUnits: false,
      loadingSuppliers: false,
      addable: true,
      adding: false,
      valid: true,
      validAddAttr: true,
      validAddSpec: true,
      dialogAddAttr: false,
      dialogAddSpec: false,
      dialogBrand: false,
      dialogSupplier: false,
      dialogCategory: false,
      searchSupplier: '',
      searchBrand: '',
      cateName: '',
      product: {
        containSpec: '0',
        zeroInventory: false,
        units: [],
        attr: [],
        unitId: '',
        images: [
          { src: '' },
          { src: '' },
          { src: '' },
          { src: '' },
          { src: '' },
          { src: '' },
        ],
        detailDesc: '',
      },
      attrToAdd: {
        attrId: '0',
        attrValue: '',
        attrName: '',
        genre: '1',
      },
      specToAdd: {
        id: '0',
        index: 0,
        specValue: '',
        specName: '',
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
      attrNameRules: [v => !!v || '请填写属性名称'],
      attrValueRules: [v => !!v || '请填写属性值'],
      specNameRules: [v => !!v || '请填写规格名称'],
      specValueRules: [v => !!v || '请填写规格值'],
      costRules: [v => (v && v >= 0) || '成本价不能小于0'],
      costPriceRules: [
        v => !!v || '请填写成本价',
        v => (v && v >= 0) || '成本价不能小于0',
      ],
      priceRules: [
        v => !!v || '请填写销售价',
        v => (v && v >= 0) || '销售价不能小于0',
      ],
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
          id: '0',
          specName: item.specName,
          index: item.index,
          specItem: item.selected,
        }),
        R.filter(
          item => item.selected && item.selected.length,
          this.specOptions
        )
      );
    },
    params() {
      return R.evolve(
        {
          zeroInventory: v => (v ? '1' : '0'),
          images: R.compose(
            R.reject(R.isEmpty),
            R.pluck('src')
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
      return R.map(
        R.prop('selected'),
        R.filter(
          item => item.selected && item.selected.length,
          this.specOptions
        )
      );
    },
    headSelectedSpecOptions() {
      return this.selectedSpecOptions.length
        ? R.head(this.selectedSpecOptions)
        : [];
    },
    tailSelectedSpecOptions() {
      if (this.selectedSpecOptions.length) {
        return R.tail(this.selectedSpecOptions);
      }
      return [];
    },
    // 所有规格组合
    currentSpecOptions() {
      if (this.tailSelectedSpecOptions.length) {
        return (
          R.reduce(
            (acc, arr) => R.map(R.flatten, R.xprod(acc, arr)),
            this.headSelectedSpecOptions,
            this.tailSelectedSpecOptions
          ) || []
        );
      }
      return this.headSelectedSpecOptions.length
        ? R.map(item => [item], this.headSelectedSpecOptions)
        : [];
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
      return R.filter(
        item => R.includes(item.detailName, this.dataItemsDetailNames),
        this.selectedDetails
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
        disabled: false,
        to: { name: 'product_list' },
        exact: true,
      },
      {
        text: '添加商品',
        disabled: true,
        exact: true,
      },
    ]);
    this.loadingCate = true;
    this.getCateListAsync()
      .catch((err) => {
        this.checkErr(err, 'getCateListAsync');
      })
      .finally(() => {
        this.loadingCate = false;
      });
    this.loadingBrand = true;
    this.getBrandListAsync({ isUse: '1' })
      .catch((err) => {
        this.checkErr(err, 'getBrandListAsync');
      })
      .finally(() => {
        this.loadingBrand = false;
      });
    this.loadingUnits = true;
    this.getUnitsListAsync()
      .catch((err) => {
        this.checkErr(err, 'getUnitsListAsync');
      })
      .finally(() => {
        this.loadingUnits = false;
      });
    this.loadingSuppliers = true;
    this.getSupplierListAsync({ locked: '0' })
      .catch((err) => {
        this.checkErr(err, 'getSupplierListAsync');
      })
      .finally(() => {
        this.loadingSuppliers = false;
      });
  },
  methods: {
    ...mapActions('product', [
      'getCateListAsync',
      'getCateAttrSpecAsync',
      'getBrandListAsync',
      'getUnitsListAsync',
      'addProductAsync',
    ]),
    ...mapActions('supplier', ['getSupplierListAsync']),
    // 删除本地添加的属性
    deleteAttrAdded(i) {
      this.attrOptions = R.remove(i, 1, this.attrOptions);
    },
    // 本地添加属性
    addAttrLocal() {
      this.attrOptions = R.append(this.attrToAdd, this.attrOptions);
      this.attrToAdd = {
        attrId: '0',
        attrValue: '',
        attrName: '',
        genre: '1',
      };
      this.dialogAddAttr = false;
    },
    // 删除本地添加的规格
    deleteSpecAdded(i) {
      this.specOptions = R.remove(i, 1, this.specOptions);
    },
    // 本地添加规格
    addSpecLocal() {
      const index = this.specOptions.length;
      const spec = R.dissoc('specValue', R.clone(this.specToAdd));
      spec.index = index;
      const specItemArr = R.split('/', this.specToAdd.specValue);
      spec.specItem = mapIndexed(
        (item, i) => ({
          id: '0',
          index: i,
          itemName: item,
          specIndex: index,
          specName: spec.specName,
        }),
        specItemArr
      );
      this.specOptions = R.append(spec, this.specOptions);
      this.specToAdd = {
        id: '0',
        index: 0,
        specValue: '',
        specName: '',
      };
      this.dialogAddSpec = false;
    },
    // xprod
    xprod(arr1, arr2) {
      return R.xprod(arr1, arr2);
    },
    // 获取当前产品分类
    getActiveCategory(arr) {
      this.categorySelected = arr;
    },
    setProductCategory() {
      this.product.categoryId = R.prop('id', R.head(this.categorySelected));
      this.cateName = R.prop('dnames', R.head(this.categorySelected));
      this.dialogCategory = false;
      this.getCateAttrSpecAsync({ categoryId: this.product.categoryId })
        .then((res) => {
          this.attrOptions = res.attr;
          // this.specOptions = R.map(R.assoc('selected', []), res.spec);
          this.specOptions = res.spec;
        })
        .catch((err) => {
          this.checkErr(err, 'setProductCategory');
        });
    },
    // 设置打包销售
    addBundle() {
      this.unitsLeft = R.reject(
        R.propEq('id', R.prop('id', this.bundleCurrent)),
        this.unitsLeft
      );
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
      // this.$set(this.product, 'unitName', v.dnames);
      this.unitsLeft = R.reject(R.propEq('id', v.id), this.productUnits.data);
      this.product.units = [];
    },
    addProduct() {
      this.adding = true;
      const postData = this.params;
      if (this.product.containSpec === '1') {
        postData.spec = this.spec;
        postData.detail = this.dataItems;
      }
      this.addProductAsync(postData)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.$router.replace({ name: 'product_list' });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.adding = false;
        });
    },
    // 批量添加图片
    getMultipleImgs(pics) {
      const mapIndexed = R.addIndex(R.map);
      this.$set(
        this.product,
        'images',
        mapIndexed((item, i) => {
          if (pics[i]) {
            item.src = pics[i];
          } else {
            item = {
              src: '',
            };
          }
          return item;
        }, this.product.images)
      );
    },
    setBundle(v) {
      if (v === '0') {
        this.product.units = [];
      }
    },
  },
};
</script>
