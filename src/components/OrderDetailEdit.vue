<template>
  <v-dialog
    :value="show"
    persistent
    max-width="1200"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4 d-flex">
        编辑订单商品
        <div class="ml-auto">
          <div class="input-group">
            <div class="input-group-control">
              <v-text-field
                placeholder="扫描输入条形码/二维码"
                dense
                outlined
                clearable
                class="white"
                required
                single-line
                hide-details
              />
            </div>
            <div class="input-group-append">
              <span class="input-group-text">条形码/二维码</span>
            </div>
            <div class="input-group-append">
              <v-btn
                color="primary"
                depressed
                @click="dialogProduct = true"
              >
                <v-icon left>
                  mdi-plus
                </v-icon> 添加商品
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-title>
      <v-container fluid>
        <v-card outlined>
          <v-data-table
            :headers="headers"
            :items="selectedProductsApply"
            class="text-center"
            item-key="id"
            no-data-text="暂无数据"
            hide-default-footer
            :items-per-page="20"
            :page.sync="page"
            @page-count="pageCount = $event"
          >
            <template v-slot:item.goodDetailName="{ item }">
              {{ item.goodDetailName ? item.goodDetailName : '无' }}
            </template>
            <template v-slot:item.amount="{ item }">
              {{ getProductPrice(item) }}
            </template>
            <template v-slot:item.memo="{ item }">
              <v-text-field
                v-model="item.memo"
                dense
                outlined
                required
                single-line
                hide-details
              />
            </template>
            <template v-slot:item.unit="{ item }">
              <v-select
                v-model="item.buUnitId"
                :items="item.units"
                item-value="unitId"
                item-text="unitName"
                outlined
                dense
                single-line
                hide-details
                no-data-text="暂无数据"
              />
            </template>
            <template v-slot:item.buNumber="{ item }">
              <div class="input-group">
                <div class="input-group-control">
                  <v-text-field
                    v-model="item.buNumber"
                    dense
                    outlined
                    required
                    single-line
                    hide-details
                  />
                </div>
              </div>
            </template>
            <template v-slot:item.price="{ item }">
              <v-text-field
                v-model="item.price"
                :rules="priceRules"
                hide-details
                :suffix="`每${item.unitName}`"
                dense
                required
                outlined
              />
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
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :disabled="item.dstatus === '1'"
                    icon
                    class="mx-1"
                    v-on="on"
                    @click="deleteSelectedProduct(item.goodDetailId)"
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
              <v-container
                v-if="selectedProductsApply.length"
                fluid
                class="grey lighten-4"
              >
                <v-row align="center">
                  <v-col cols="auto">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">免收金额</span>
                      </div>
                      <div class="input-group-control">
                        <v-text-field
                          v-model="orderToEdit.freeAmount"
                          placeholder="请输入免收金额"
                          dense
                          outlined
                          class="white"
                          suffix="元"
                          required
                          single-line
                          hide-details
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">配送费用</span>
                      </div>
                      <div class="input-group-control">
                        <v-text-field
                          v-model="orderToEdit.freight"
                          placeholder="请输入配送费用"
                          dense
                          outlined
                          class="white"
                          suffix="元"
                          required
                          single-line
                          hide-details
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="ml-auto"
                  >
                    商品金额：￥{{ totalAmount }}
                  </v-col>
                  <v-col
                    cols="auto"
                    class="pr-0"
                  >
                    应付金额：
                  </v-col>
                  <v-col
                    cols="auto"
                    class="display-1 error--text pl-0 font-weight-bold"
                    align-self="start"
                  >
                    ￥{{ totalAmountCacul }}
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-data-table>
          <v-divider />
          <div
            v-if="pageCount > 1"
            class="text-center pt-3"
          >
            <v-pagination
              v-model="page"
              :length="pageCount"
            />
          </div>
        </v-card>
      </v-container>
      <v-card-actions class="grey lighten-4 py-3">
        <div class="flex-grow-1" />
        <v-btn
          color="primary"
          :loading="editing"
          :disabled="editing"
          @click="editOrder"
        >
          提交
        </v-btn>
        <v-btn
          color="secondary"
          @click="$emit('close-dialog')"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
    <product-selection
      :show="dialogProduct"
      :buyer-id="order.buyerId"
      :buyer-uid="order.buyerUid"
      :selected="selectedProducts"
      @close-dialog="dialogProduct = false"
      @update:selectedProducts="getSelectedProducts"
    />
  </v-dialog>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';
import ProductSelection from '@/components/ProductSelection.vue';

export default {
  name: 'OrderDetailEdit',
  components: {
    ProductSelection,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      dialogProduct: false,
      selectedProducts: [],
      selectedProductsUnits: [],
      editing: false,
      orderToEdit: {},
      priceRules: [v => !!v || '请填写商品价格'],
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
          value: 'goodName',
          align: 'center',
          width: '150px',
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
          width: '160px',
        },
        {
          text: '数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '100px',
        },
        {
          text: '销售单位',
          value: 'unit',
          align: 'center',
          sortable: false,
          width: '120px',
        },
        {
          text: '小计',
          value: 'amount',
          align: 'center',
          sortable: false,
        },
        {
          text: '备注',
          value: 'memo',
          align: 'center',
          sortable: false,
          width: '150px',
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    totalAmountCacul() {
      return (
        +this.totalAmount
        + +(this.orderToEdit.freight ? +this.orderToEdit.freight : 0)
        - +(this.orderToEdit.freeAmount ? +this.orderToEdit.freeAmount : 0)
      ).toFixed(2);
    },
    totalAmount() {
      return R.reduce(
        (acc, item) => R.add(acc, this.getProductPrice(item)),
        0,
        this.selectedProductsApply
      ).toFixed(2);
    },
    selectedProductsIds() {
      return R.pluck('goodDetailId', this.selectedProductsApply);
    },
    selectedProductsApply() {
      return R.map((item) => {
        item.buUnitId = item.buUnitId ? item.buUnitId : item.unitId;
        item.buNumber = item.buNumber ? item.buNumber : 1;
        item.units = R.prop(
          'units',
          R.find(R.propEq('goodId', item.goodId), this.selectedProductsUnits)
        );
        return item;
      }, R.clone(this.selectedProducts));
    },
    detail() {
      return R.map(
        item => ({
          goodDetailId: item.goodDetailId,
          buUnitId: item.buUnitId,
          buNumber: item.buNumber,
          price: item.price,
          memo: item.memo,
          packeNum: R.prop(
            'packeNum',
            R.find(R.propEq('unitId', item.buUnitId), item.units)
          ),
        }),
        this.selectedProductsApply
      );
    },
    params() {
      return R.mergeRight(this.orderToEdit, { detail: this.detail });
    },
  },
  created() {
    this.orderToEdit = this.order;
    this.getSelectedProducts(this.order.detail);
  },
  methods: {
    ...mapActions('order', ['getProductUnitsAsync', 'editOrderAsync']),
    getProductPrice(item) {
      let price = null;
      if (item.unitId && item.units) {
        price = +item.buNumber
          * +item.price
          * +R.prop(
            'packeNum',
            R.find(R.propEq('unitId', item.buUnitId), item.units)
          );
      } else {
        price = +item.buNumber * +item.price;
      }
      return price.toFixed(2);
    },
    async getProductUnits(params) {
      const res = await this.getProductUnitsAsync(params);
      return {
        goodId: params.goodId,
        units: res,
      };
    },
    getSelectedProducts(arr) {
      // 如果返回的商品已存在订单中
      this.selectedProducts = R.map((item) => {
        if (R.includes(item.goodDetailId, this.selectedProductsIds)) {
          item = R.mergeRight(
            item,
            R.find(
              R.propEq('goodDetailId', item.goodDetailId),
              this.selectedProductsApply
            )
          );
        }
        return item;
      }, arr);
      const goodIds = R.uniq(R.pluck('goodId', arr));
      const resUnits = R.map(
        goodId => this.getProductUnits({ goodId }),
        goodIds
      );
      Promise.all(resUnits)
        .then((res) => {
          this.selectedProductsUnits = res;
        })
        .catch((err) => {
          this.checkErr(err, 'getSelectedProducts');
        });
    },
    editOrder() {
      this.editing = true;
      this.editOrderAsync({ ...this.params, sectionId: this.$store.state.user.sectionId })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，编辑成功!',
          });
          this.$emit('close-dialog');
          this.$emit('update:refresh');
        })
        .catch(err => this.checkErr(err, 'editOrder'))
        .finally(() => {
          this.editing = false;
        });
    },
    deleteSelectedProduct(id) {
      this.selectedProducts = R.reject(
        R.propEq('goodDetailId', id),
        this.selectedProducts
      );
    },
  },
};
</script>
