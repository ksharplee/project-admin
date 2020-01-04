<template>
  <div>
    <v-card
      outlined
      elevation="0"
      class="mb-4"
    >
      <v-card-title class="pa-3 grey lighten-3 title d-flex">
        商品类别
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品分类：
              </v-col>
              <v-col cols="auto">
                {{ product.categoryName }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                包含规格：
              </v-col>
              <v-col cols="auto">
                {{ product.containSpec === '1' ? '是' : '否' }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card
      outlined
      elevation="0"
      class="mb-4"
    >
      <v-card-title class="pa-3 grey lighten-3 title d-flex">
        基础信息
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col
            cols="12"
            lg="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品名称：
              </v-col>
              <v-col cols="auto">
                {{ product.dnames }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品品牌：
              </v-col>
              <v-col cols="auto">
                {{ product.brandName }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品货号：
              </v-col>
              <v-col cols="auto">
                {{ product.dno }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                &nbsp;起&nbsp;订&nbsp;量&nbsp;：
              </v-col>
              <v-col cols="auto">
                {{ product.moq }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品单位：
              </v-col>
              <v-col cols="auto">
                {{ product.unitName }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                库存数量：
              </v-col>
              <v-col cols="auto">
                {{ product.stock }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            xl="4"
          >
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                零库存出售：
              </v-col>
              <v-col cols="auto">
                {{ product.zeroInventory === '1' ? '是' : '否' }}
              </v-col>
            </v-row>
          </v-col>
          <v-slide-y-transition>
            <v-col
              v-if="product.containSpec === '0'"
              cols="12"
              md="6"
              xl="4"
            >
              <v-row justify="start">
                <v-col
                  cols="auto"
                  class="grey--text"
                >
                  &nbsp;成&nbsp;本&nbsp;价&nbsp;：
                </v-col>
                <v-col cols="auto">
                  {{ product.costPrice }}元
                </v-col>
              </v-row>
            </v-col>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-col
              v-if="product.containSpec === '0'"
              cols="12"
              md="6"
              xl="4"
            >
              <v-row justify="start">
                <v-col
                  cols="auto"
                  class="grey--text"
                >
                  &nbsp;销&nbsp;售&nbsp;价&nbsp;：
                </v-col>
                <v-col cols="auto">
                  {{ product.price }}元
                </v-col>
              </v-row>
            </v-col>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-col
              v-if="product.containSpec === '0'"
              cols="12"
              md="6"
              xl="4"
            >
              <v-row justify="start">
                <v-col
                  cols="auto"
                  class="grey--text"
                >
                  商品重量：
                </v-col>
                <v-col cols="auto">
                  {{ product.weight }}克
                </v-col>
              </v-row>
            </v-col>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-col
              v-if="product.containSpec === '0'"
              cols="12"
              md="6"
              xl="4"
            >
              <v-row justify="start">
                <v-col
                  cols="auto"
                  class="grey--text"
                >
                  &nbsp;条&nbsp;形&nbsp;码&nbsp;：
                </v-col>
                <v-col cols="auto">
                  {{ product.barCode }}
                </v-col>
              </v-row>
            </v-col>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-col
              v-if="product.units"
              cols="12"
            >
              <v-card
                flat
                outlined
                class="body-1"
              >
                <v-card-title class="pa-3 grey lighten-3 title d-flex">
                  打包设置
                </v-card-title>
                <div class="pa-3">
                  <v-row>
                    <v-col
                      v-for="(bundle, i) in product.units"
                      :key="i"
                      cols="12"
                      md="6"
                      xl="4"
                    >
                      1{{ bundle.unitName }} = {{ bundle.packeNum }}{{ product.unitName }}
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
          </v-slide-y-transition>
        </v-row>
      </v-container>
    </v-card>
    <v-slide-y-transition>
      <v-card
        v-if="product.attr"
        outlined
        elevation="0"
        class="mb-4"
      >
        <v-card-title class="pa-3 grey lighten-3 title d-flex">
          商品参数
        </v-card-title>
        <v-container fluid>
          <v-row>
            <v-col
              v-for="attr in product.attr"
              :key="attr.attrId"
              cols="12"
              lg="6"
              xl="4"
            >
              <v-row justify="start">
                <v-col
                  cols="auto"
                  class="grey--text"
                >
                  {{ attr.attrName }}：
                </v-col>
                <v-col cols="auto">
                  {{ attr.attrValue }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-card
        v-if="product.detail && product.detail.length && product.containSpec === '1'"
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
                成本价(元)
              </th>
              <th class="text-center">
                销售价(元)
              </th>
              <th class="text-center">
                重量(克)
              </th>
              <th class="text-center">
                条形码
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(detail, i) in product.detail"
              :key="i"
            >
              <td class="py-3">
                <v-img
                  :src="detail.image ? `${detail.image}?x-oss-process=image/resize,m_fill,w_100,h_100` : require('@/assets/imgWaiting.png')"
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
              </td>
              <td class="py-3">
                {{ detail.detailName }}
              </td>
              <td class="py-3">
                {{ detail.costPrice }}
              </td>
              <td class="py-3">
                {{ detail.price }}
              </td>
              <td class="py-3">
                {{ detail.weight }}
              </td>
              <td class="py-3">
                {{ detail.barCode }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
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
        <v-row>
          <v-col
            v-for="(img,i) in product.images"
            :key="i"
            cols="6"
            md="3"
            lg="2"
            xl="1"
          >
            <v-img
              :src="img.image ? `${img.image}?x-oss-process=image/resize,m_fill,w_300,h_300` : require('@/assets/imgWaiting.png')"
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
        </v-row>
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
        disabled
      />
    </v-card>
    <v-card
      outlined
      elevation="0"
      class="mb-4"
    >
      <v-card-title class="pa-3 grey lighten-3 title">
        商品供应商
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-row justify="start">
              <v-col
                cols="auto"
                class="grey--text"
              >
                商品供应商：
              </v-col>
              <v-col cols="auto">
                {{ product.supplyers | supplierString }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
  </v-col>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';
import WangEditor from '@/components/WangEditor.vue';

export default {
  name: 'ProductDetail',
  filters: {
    supplierString: (arr) => {
      if (arr) {
        return R.join(',', R.pluck('supplyerName', arr));
      }
      return '无';
    },
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
      product: {},
    };
  },
  computed: {},
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
        text: '商品详情',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getProductDetailAsync({ id: this.id })
      .then((res) => {
        this.product = R.clone(res);
        // 异步获取描述结束再挂载编辑器
        this.component = WangEditor;
      })
      .catch((err) => {
        this.checkErr(err, 'getProductDetailAsync');
      })
      .finally(() => {
        this.$store.commit('END_LOADING');
      });
  },
  methods: {
    ...mapActions('product', ['getProductDetailAsync']),
  },
};
</script>
