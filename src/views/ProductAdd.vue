<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
      class="pa-4"
    >
      <v-card
        outlined
        elevation="0"
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
                      item-key="id"
                      item-children="son"
                      open-on-click
                      rounded
                      activatable
                      return-object
                      @update:active="getActiveCategory"
                    >
                      <template v-slot:label="{ item,leaf, open }">
                        {{ item.dnames }}({{ item.dnamesEn }})
                      </template>
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
        elevation="0"
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
                  <span class="input-group-text required">商品英文名称</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="product.dnamesEn"
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
                    :item-text="getConcactName"
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
                    :item-text="getUnitConcactName"
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
                  <v-row class="mt-2">
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
                              :item-text="getUnitConcactName"
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
                              :item-text="getUnitConcactName"
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
          v-if="product.containSpec === '0'"
          outlined
          elevation="0"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品售价
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col
                v-for="(country, i) in countryLocal"
                :key="i"
                cols="12"
                md="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text required">{{ country.dnames }}</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="country.price"
                      :rules="priceRules"
                      type="number"
                      placeholder="请输入销售价"
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      suffix="$"
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
          v-if="product.containSpec === '1'"
          outlined
          elevation="0"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品规格
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row class="mb-4">
              <v-col
                v-for="specOption in specOptions"
                :key="specOption.index"
                cols="12"
                lg="6"
                xl="4"
              >
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">{{ specOption.specName }}({{ specOption.specNameEn }})</span>
                  </div>
                  <div class="input-group-control">
                    <v-select
                      v-model="specOption.selected"
                      :items="specOption.specItem"
                      :item-text="getSpecConcactName"
                      :placeholder="`请选择${specOption.specName}${specOption.specNameEn}`"
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
            </v-row>
            <v-slide-y-transition>
              <v-card
                v-if="selectedDetails.length"
                class="mb-4"
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
                    @change="setDataItems"
                  >
                    <v-chip
                      v-for="detail in selectedDetails"
                      :key="detail.detailName"
                      :value="detail.detailName"
                      filter
                    >
                      {{ detail.detailName }}({{ detail.detailNameEn }})
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
            <v-slide-y-transition>
              <v-card
                v-if="dataItems.length && product.containSpec === '1'"
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
                      <th
                        v-if="!usePriceStatus"
                        class="text-center"
                      >
                        成本价
                        <v-btn
                          icon
                          x-small
                          class="ml-2"
                          @click="dialogUnifyCostPrice = true"
                        >
                          <v-icon color="#666">
                            mdi-square-edit-outline
                          </v-icon>
                        </v-btn>
                      </th>
                      <th
                        v-if="!usePriceStatus"
                        class="text-center"
                      >
                        销售价
                        <v-btn
                          icon
                          x-small
                          class="ml-2"
                          @click="dialogUnifyPrice = true"
                        >
                          <v-icon color="#666">
                            mdi-square-edit-outline
                          </v-icon>
                        </v-btn>
                      </th>
                      <th class="text-center">
                        重量
                        <v-btn
                          icon
                          x-small
                          class="ml-2"
                          @click="dialogUnifyWeight = true"
                        >
                          <v-icon color="#666">
                            mdi-square-edit-outline
                          </v-icon>
                        </v-btn>
                      </th>
                      <th class="text-center">
                        条形码
                      </th>
                      <th class="text-center">
                        是否显示
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
                          @update:src="item.image = $event"
                          @update:delete="item.image = ''"
                        />
                      </td>
                      <td class="py-3">
                        {{ item.detailName }}({{ item.detailNameEn }})
                      </td>
                      <td
                        v-if="!usePriceStatus"
                        class="py-3"
                      >
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
                      <td
                        v-if="!usePriceStatus"
                        class="py-3"
                      >
                        <v-text-field
                          v-for="subitem in item.countryPrice"
                          :key="subitem.id"
                          v-model="subitem.price"
                          :rules="priceRules"
                          :prefix="getCountryName(subitem)"
                          type="number"
                          placeholder=""
                          class="mb-2"
                          dense
                          outlined
                          suffix="$"
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
                          :disabled="goodHasCode"
                          :style="goodHasCode ? 'background-color:#f5f5f5' : ''"
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
                        <v-select
                          v-model="item.isShow"
                          :items="specIsShow"
                          placeholder="请选择是否显示此规格商品"
                          dense
                          single-line
                          hide-details
                          outlined
                          clearable
                          no-data-text="暂无数据"
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="grey lighten-5">
                      <td :colspan="usePriceStatus ? 3 : 5" />
                      <td
                        colspan="2"
                      >
                        <div class="input-group">
                          <div class="input-group-control">
                            <v-text-field
                              v-model="product.barCode"
                              placeholder="请输入统一条形码"
                              :style="goodHasCode ? 'background-color:white' : ''"
                              :disabled="!goodHasCode"
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
                                v-model="goodHasCode"
                                label="统一规格条形码"
                                color="primary"
                                class="mt-0 overflow-hidden"
                                hide-details
                              />
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </v-simple-table>
              </v-card>
            </v-slide-y-transition>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
      <v-card
        outlined
        elevation="0"
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
                <v-btn
                  color="secondary"
                  outlined
                  @click="product.images = [
                    { picPath: '' },
                    { picPath: '' },
                    { picPath: '' },
                    { picPath: '' },
                    { picPath: '' },
                    { picPath: '' },
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
                  <img-upload-search
                    :image="img.picPath"
                    icon-size="36px"
                    @update:src="getEmitImg($event, i)"
                    @update:delete="img.picPath = ''"
                  />
                  <div class="d-flex justify-center pt-2">
                    <v-btn
                      icon
                      :disabled="!i"
                      color="gray"
                      @click="changeImgIndex(i, 'left')"
                    >
                      <v-icon>mdi-arrow-left-bold-circle</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="gray"
                      :disabled="i === 5"
                      @click="changeImgIndex(i, 'right')"
                    >
                      <v-icon>mdi-arrow-right-bold-circle</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
      <v-row>
        <v-col
          cols="12"
          lg="6"
        >
          <v-card
            outlined
            elevation="0"
            class="mb-4"
          >
            <v-card-title class="pa-3 grey lighten-3 title">
              商品描述
            </v-card-title>
            <wang-editor @update:html="product.detailDesc = $event" />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          lg="6"
        >
          <v-card
            outlined
            elevation="0"
            class="mb-4"
          >
            <v-card-title class="pa-3 grey lighten-3 title">
              商品英文描述
            </v-card-title>
            <wang-editor @update:html="product.detailDescEn = $event" />
          </v-card>
        </v-col>
      </v-row>
      <v-btn
        :loading="adding"
        :disabled="adding"
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
    <v-dialog
      v-model="dialogUnifyCostPrice"
      width="300"
    >
      <v-card>
        <v-card-title>
          统一设置成本价
          <v-spacer />
          <v-btn
            small
            icon
            @click="dialogUnifyCostPrice = false"
          >
            <v-icon color="#999">
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-text-field
            v-model="unifyCostPrice"
            label="成本价"
            outlined
            dense
            hide-details
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!unifyCostPrice"
            @click="setUnifyCostPrice"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogUnifyPrice"
      width="300"
    >
      <v-card>
        <v-card-title>
          统一设置销售价
          <v-spacer />
          <v-btn
            small
            icon
            @click="dialogUnifyPrice = false"
          >
            <v-icon color="#999">
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-text-field
            v-model="unifyPrice"
            label="销售价"
            outlined
            dense
            hide-details
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!unifyPrice"
            @click="setUnifyPrice"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogUnifyWeight"
      width="300"
    >
      <v-card>
        <v-card-title>
          统一设置重量
          <v-spacer />
          <v-btn
            small
            icon
            @click="dialogUnifyWeight = false"
          >
            <v-icon color="#999">
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-text-field
            v-model="unifyWeight"
            label="重量"
            outlined
            dense
            hide-details
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!unifyWeight"
            @click="setUnifyWeight"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions, mapGetters } from 'vuex';
import BrandSingle from '@/components/BrandSingle.vue';
import ImgUpload from '@/components/ImgUpload.vue';
import ImgUploadSearch from '@/components/ImgUploadSearch.vue';
import WangEditor from '@/components/WangEditor.vue';

export default {
  name: 'ProductAdd',
  components: {
    BrandSingle,
    ImgUpload,
    ImgUploadSearch,
    WangEditor,
  },
  data() {
    return {
      dialogUnifyCostPrice: false,
      unifyCostPrice: '',
      dialogUnifyPrice: false,
      unifyPrice: '',
      dialogUnifyWeight: false,
      unifyWeight: '',
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
      goodHasCode: true,
      cateName: '',
      isLiveOptions: [
        {
          value: '0',
          text: '否',
        },
        {
          value: '3',
          text: '是',
        },
      ],
      usePriceStatus: false,
      specIsShow: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '2',
          text: '否',
        },
      ],
      product: {
        containSpec: '0',
        zeroInventory: false,
        goodHasCode: false,
        isLive: '0',
        units: [],
        unitId: '',
        price: 1,
        images: [
          { picPath: '' },
          { picPath: '' },
          { picPath: '' },
          { picPath: '' },
          { picPath: '' },
          { picPath: '' },
        ],
        detailDesc: '',
        detailDescEn: '',
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
      specOptions: [],
      dataItemsDetailNames: [],
      unitsLeft: [],
      cateRules: [v => !!v || '请选择商品分类'],
      nameRules: [v => !!v || '请填写商品名称'],
      numberRules: [v => !!v || '请填写商品货号'],
      moqRules: [v => !!v || '请填写起订量'],
      stockRules: [v => !!v || '请填写库存数量'],
      unitRules: [v => !!v || '请选择商品单位'],
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
      countryLocal: [],
      dataItems: [],
    };
  },
  computed: {
    ...mapState('product', ['productCategory', 'productBrand', 'productUnits']),
    ...mapState('system', ['country']),
    ...mapGetters('product', ['productBrandInUse', 'brandFilter']),
    unitString() {
      return R.join(',', R.pluck('dnames', this.unitsLeft));
    },
    spec() {
      return R.map(
        item => ({
          id: '0',
          specName: item.specName,
          specNameEn: item.specNameEn,
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
          images: R.reject(item => R.isEmpty(item.picPath)),
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
    // 国家价格
    countryPrice() {
      return R.fromPairs(
        R.map(item => [item.id, item.price], this.countryLocal)
      );
    },
    selectedDetails() {
      return R.map(
        R.compose(
          R.mergeRight({
            id: '0',
            image: '',
            costPrice: '',
            price: 1,
            weight: '',
            barCode: '',
            isShow: '1',
          }),
          arr => ({
            specItems: R.map(
              item => ({
                specId: item.specIndex,
                specName: item.specName,
                specNameEn: item.specNameEn,
                specItemId: item.index,
                specItemName: item.itemName,
                specItemNameEn: item.itemNameEn,
                isNew: '1',
              }),
              arr
            ),
            detailName: R.join('/', R.pluck('itemName', arr)),
            detailNameEn: R.join('/', R.pluck('itemNameEn', arr)),
          })
        ),
        this.currentSpecOptions
      );
    },
  },
  watch: {
    goodHasCode(newValue) {
      if (newValue) {
        this.setAllSpec = true;
      } else {
        this.setAllSpec = false;
      }
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
    if (!this.country.status) {
      this.getCountryListAsync().then(() => {
        this.countryLocal = R.clone(this.country.data);
      });
    } else {
      this.countryLocal = R.clone(this.country.data);
    }
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
  },
  methods: {
    ...mapActions('product', [
      'getCateListAsync',
      'getCateAttrSpecAsync',
      'getBrandListAsync',
      'getUnitsListAsync',
      'addProductAsync',
    ]),
    ...mapActions('system', ['getCountryListAsync']),
    getCountryName(item) {
      return `${item.dnames}(${item.dnamesEn})`;
    },
    getEmitImg(e, i) {
      this.$set(this.product.images, i, e);
    },
    setUnifyPrice() {
      this.dataItems = R.map((item) => {
        item.countryPrice = R.map(
          R.assoc('price', this.unifyPrice),
          item.countryPrice
        );
        return item;
      }, this.dataItems);
      this.dialogUnifyPrice = false;
    },
    setUnifyWeight() {
      this.dataItems = R.map(
        R.assoc('weight', this.unifyWeight),
        this.dataItems
      );
      this.dialogUnifyWeight = false;
    },
    setUnifyCostPrice() {
      this.dataItems = R.map(
        R.assoc('costPrice', this.unifyCostPrice),
        this.dataItems
      );
      this.dialogUnifyCostPrice = false;
    },
    setDataItems() {
      const array = R.map((item) => {
        item.countryPrice = R.clone(this.countryLocal);
        return item;
      }, R.clone(this.selectedDetails));
      this.dataItems = R.filter(
        item => R.includes(item.detailName, this.dataItemsDetailNames),
        array
      );
    },
    updateCountryPrice(v, country, i) {
      this.dataItems[i].countryPrice[country] = v;
      this.$forceUpdate();
      // this.$set(this.dataItems[i].countryPrice, country, v);
    },
    getConcactName(item) {
      return `${item.dnames}(${item.dnamesEn})`;
    },
    getSpecConcactName(item) {
      return `${item.itemName}(${item.itemNameEn})`;
    },
    getUnitConcactName(item) {
      return `${item.dnames}(${item.enDnames})`;
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
    // 设置所有规格商品统一条形码
    setAllSpecBarcode(items) {
      return R.map((item) => {
        item.barCode = this.product.barCode;
        return item;
      }, items);
    },
    addProduct() {
      if (this.$refs.form.validate()) {
        const postData = this.params;
        if (this.goodHasCode) {
          postData.goodHasCode = '0';
        } else {
          postData.goodHasCode = '1';
        }
        if (this.product.containSpec === '1') {
          postData.spec = this.spec;
          const dataItems = R.map((item) => {
            item.countryPrice = R.fromPairs(
              R.map(
                subitem => [subitem.id, subitem.price],
                item.countryPrice
              )
            );
            return item;
          }, this.dataItems);
          if (this.goodHasCode) {
            postData.detail = this.setAllSpecBarcode(dataItems);
          } else {
            postData.detail = dataItems;
          }
        } else {
          // 无规格商品价格
          postData.countryPrice = this.countryPrice;
        }
        this.adding = true;
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
      }
    },
    setBundle(v) {
      if (v === '0') {
        this.product.units = [];
      }
    },
    // 修改图片顺序
    changeImgIndex(i, direction) {
      this.$set(
        this.product,
        'images',
        R.move(i, direction === 'right' ? i + 1 : i - 1, this.product.images)
      );
    },
  },
};
</script>
