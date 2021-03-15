<template>
  <v-card>
    <v-form
      ref="form"
      v-model="valid"
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
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">商品分类</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    :value="product.categoryName"
                    disabled
                    placeholder="请选择分类"
                    outlined
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
                  <span class="input-group-text required">包含规格</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    v-model="product.containSpec"
                    :items="containSpecOptions"
                    disabled
                    placeholder="请选择是否包含规格"
                    single-line
                    hide-details
                    dense
                    outlined
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
                  <span class="input-group-text py-0 mb-0">
                    <v-checkbox
                      v-model="product.zeroInventory"
                      label="零库存出售"
                      color="primary"
                      class="mt-0 pt-0 overflow-hidden"
                      hide-details
                    />
                  </span>
                </div>
              </div>
            </v-col>
            <v-col
              v-if="$store.state.user.priceStatus === '1'"
              cols="12"
              md="6"
              xl="4"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">启用价格区间</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    :value="usePriceStatus"
                    :items="priceStatusOptions"
                    :disabled="!product.priceArea || !product.priceArea.length"
                    placeholder="是否启用价格区间"
                    dense
                    single-line
                    hide-details
                    outlined
                    clearable
                    no-data-text="暂无数据"
                    @change="setUsePriceStatus"
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
                      :value="product.price"
                      :rules="priceRules"
                      type="number"
                      placeholder="请输入销售价"
                      dense
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      @input="setProductPrice"
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
                class="body-1 mt-2"
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
          outlined
          elevation="0"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品参数
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col
                v-for="(attr, i) in product.attr"
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
                      v-if="attr.genre == '1'"
                      v-model="attr.attrValue"
                      :placeholder="`请输入${attr.attrName}`"
                      outlined
                      clearable
                      required
                      single-line
                      hide-details
                      dense
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
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  outlined
                  @click="dialogAdd = true"
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
          elevation="0"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title d-flex">
            商品规格
          </v-card-title>
          <v-card-text class="pt-4">
            <v-card
              outlined
              elevation="0"
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
                    <th>
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
                    v-for="(item, i) in product.detail"
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
                    <td
                      v-if="!usePriceStatus"
                      class="py-3"
                    >
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
                    <td
                      v-if="!usePriceStatus"
                      class="py-3"
                    >
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
                        :disabled="goodHasCode"
                        :style="goodHasCode ? 'background-color:#f5f5f5' : ''"
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
                    <td
                      :colspan="usePriceStatus ? 3 : 5"
                    />
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
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-card
          v-if="usePriceStatus"
          outlined
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title">
            价格区间设置
          </v-card-title>
          <v-card-text class="pt-3">
            <v-card outlined>
              <v-simple-table class="text-center">
                <thead>
                  <tr>
                    <th class="text-center">
                      最小数量
                    </th>
                    <th class="text-center">
                      最大数量
                    </th>
                    <th class="text-center">
                      销售价
                    </th>
                    <th class="text-center">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item,i) in priceAreaLocal"
                    :key="i"
                  >
                    <td
                      style="width:25%"
                      class="py-3"
                    >
                      <v-text-field
                        v-model="item.minNum"
                        :rules="i > 0 ? [minNumRules(item.minNum,i)] : []"
                        :disabled="i === 0"
                        type="number"
                        dense
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                      />
                    </td>
                    <td
                      style="width:25%"
                      class="py-3"
                    >
                      <v-text-field
                        v-model="item.maxNum"
                        :rules="[maxNumRules(item.maxNum,i)]"
                        type="number"
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
                        :value="item.price"
                        type="number"
                        dense
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        @input="setPriceAreaPrice($event,i)"
                      />
                    </td>
                    <td class="py-3">
                      <v-btn
                        :disabled="i === 0"
                        icon
                        @click="removeFromPriceAreaLocal(i)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="grey lighten-5">
                  <tr>
                    <td
                      colspan="4"
                      class="text-left py-3"
                    >
                      <v-btn
                        color="secondary"
                        outlined
                        @click="addToPriceAreaLocal"
                      >
                        <v-icon>mdi-plus</v-icon>添加区间
                      </v-btn>
                    </td>
                  </tr>
                </tfoot>
              </v-simple-table>
            </v-card>
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
      <v-card
        outlined
        elevation="0"
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
    <v-dialog
      v-model="dialogAdd"
      width="500"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="validAdd"
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
              :disabled="!validAdd"
              @click="addAttrLocal"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogAdd = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
            @click="dialogUnifyCostPrice = false;setByTarget('costPrice', unifyCostPrice)"
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
            @click="dialogUnifyPrice = false;setByTarget('price', unifyPrice)"
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
            @click="dialogUnifyWeight = false;setByTarget('weight', unifyWeight)"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions, mapGetters } from 'vuex';
import BrandSingle from '@/components/BrandSingle.vue';
import ImgUpload from '@/components/ImgUpload.vue';
import ImgUploadMultiple from '@/components/ImgUploadMultiple.vue';
import WangEditor from '@/components/WangEditor.vue';

const isNotEmpty = v => !!v && R.complement(R.isEmpty(v));

const mapIndexed = R.addIndex(R.map);

export default {
  name: 'ProductEdit',
  components: {
    BrandSingle,
    ImgUpload,
    ImgUploadMultiple,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogUnifyCostPrice: false,
      unifyCostPrice: '',
      dialogUnifyPrice: false,
      unifyPrice: '',
      dialogUnifyWeight: false,
      unifyWeight: '',
      component: null,
      loadingCate: false,
      loadingBrand: false,
      loadingUnits: false,
      loadingSuppliers: false,
      addable: true,
      editing: false,
      valid: true,
      validAdd: true,
      dialogAdd: false,
      dialogBrand: false,
      dialogSupplier: false,
      dialogCategory: false,
      searchSupplier: '',
      searchBrand: '',
      attrToAdd: {
        attrId: '0',
        attrValue: '',
        attrName: '',
        genre: '1',
      },
      priceStatusOptions: [
        {
          value: false,
          text: '否',
        },
        {
          value: true,
          text: '是',
        },
      ],
      usePriceStatus: false,
      priceAreaLocal: [
        {
          minNum: '1',
          maxNum: '',
          price: '',
        },
      ],
      goodHasCode: false,
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
      unitsLeft: [],
      cateRules: [v => !!v || '请选择商品分类'],
      nameRules: [v => !!v || '请填写商品名称'],
      attrNameRules: [v => !!v || '请填写属性名称'],
      attrValueRules: [v => !!v || '请填写属性值'],
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
    priceAreaAvailable() {
      return R.all(R.where({
        minNum: isNotEmpty,
        maxNum: isNotEmpty,
        price: isNotEmpty,
      }), this.priceAreaLocal);
    },
    unitString() {
      return R.join(',', R.pluck('dnames', this.unitsLeft));
    },
    params() {
      return R.evolve(
        {
          zeroInventory: v => (v ? '1' : '0'),
          images: R.compose(
            R.reject(R.isEmpty),
            R.pluck('image')
          ),
          attr: () => R.filter(R.has('attrValue'), this.product.attr),
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
    this.loadingBrand = true;
    this.getBrandListAsync({ isUse: '1' })
      .catch((err) => {
        this.checkErr(err, 'getBrandListAsync');
      })
      .finally(() => {
        this.loadingBrand = false;
      });
    this.loadingSuppliers = true;
  },
  methods: {
    ...mapActions('product', [
      'getBrandListAsync',
      'getUnitsListAsync',
      'editProductAsync',
      'getProductDetailEditAsync',
    ]),
    // 删除本地添加的属性
    deleteAttrAdded(i) {
      this.$set(this.product, 'attr', R.remove(i, 1, this.product.attr));
    },
    // 本地添加属性
    addAttrLocal() {
      this.$set(
        this.product,
        'attr',
        R.append(this.attrToAdd, this.product.attr)
      );
      this.attrToAdd = {
        attrId: '0',
        attrValue: '',
        attrName: '',
        genre: '1',
      };
      this.dialogAdd = false;
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
    // 设置所有规格商品统一条形码
    setAllSpecBarcode(items) {
      return R.map((item) => {
        item.barCode = this.product.barCode;
        return item;
      }, items);
    },
    editProduct() {
      const postData = this.params;
      if (this.goodHasCode) {
        postData.goodHasCode = '0';
      } else {
        postData.goodHasCode = '1';
      }
      if (this.usePriceStatus) {
        if (this.priceAreaAvailable) {
          postData.priceArea = this.priceAreaLocal;
        } else {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'error',
            text: '请将价格区间填写完整',
          });
          return;
        }
      }
      if (this.product.containSpec === '1') {
        if (this.goodHasCode) {
          postData.detail = this.setAllSpecBarcode(this.product.detail);
        }
        if (this.usePriceStatus) {
          postData.detail = R.map(R.assoc('price', postData.priceArea[0].price), postData.detail);
        }
      }
      this.editing = true;
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
      const params = { id: this.id };
      if (this.$store.state.user.priceStatus === '1') {
        params.priceStatus = '2';
      }
      this.getProductDetailEditAsync(params)
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
          // 是否设置了统一规格条形码
          if (response.goodHasCode === '0' && response.containSpec === '1') {
            this.goodHasCode = true;
          }
          // 设置本地价格区间
          if (response.priceArea && response.priceArea.length) {
            this.priceAreaLocal = response.priceArea;
            this.usePriceStatus = true;
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
          }
          this.product = response;
          // 异步获取描述结束再挂载编辑器
          this.component = WangEditor;
        })
        .catch((err) => {
          this.checkErr(err, 'getProductDetailEditAsync');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    // 修改图片顺序
    changeImgIndex(i, direction) {
      this.$set(this.product, 'images', R.move(i, direction === 'right' ? i + 1 : i - 1, this.product.images));
    },
    setByTarget(target, v) {
      this.$set(this.product, 'detail', R.map(R.assoc(target, v), this.product.detail));
    },
    setProductPrice(v) {
      this.$set(this.product, 'price', v);
      if (this.usePriceStatus) {
        const item = this.priceAreaLocal[0];
        item.price = v;
        this.$set(this.priceAreaLocal, 0, item);
      }
    },
    setPriceAreaPrice(v, i) {
      const item = this.priceAreaLocal[i];
      item.price = v;
      this.$set(this.priceAreaLocal, i, item);
      if (i === 0) {
        this.$set(this.product, 'price', v);
      }
    },
    setUsePriceStatus(v) {
      this.usePriceStatus = v;
      if (v) {
        const item = this.priceAreaLocal[0];
        item.price = this.product.price;
        this.$set(this.priceAreaLocal, 0, item);
      }
    },
    addToPriceAreaLocal() {
      const item = this.priceAreaLocal[this.priceAreaLocal.length - 1];
      if (!item.minNum || !item.maxNum || !item.price) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请先填写区间信息',
        });
        return;
      }
      this.priceAreaLocal = R.append({
        minNum: +this.priceAreaLocal[this.priceAreaLocal.length - 1].maxNum + 1,
        maxNum: '',
        price: '',
      }, this.priceAreaLocal);
    },
    removeFromPriceAreaLocal(i) {
      this.priceAreaLocal = R.remove(i, 1, this.priceAreaLocal);
    },
    minNumRules(v, i) {
      return (v > 0 && v > +this.priceAreaLocal[i - 1].maxNum) || ' ';
    },
    maxNumRules(v, i) {
      return (v > 0 && v > +this.priceAreaLocal[i].minNum) || ' ';
    },
  },
};
</script>
