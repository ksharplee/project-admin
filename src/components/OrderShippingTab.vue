<template>
  <div class="pt-4">
    <v-expansion-panels
      v-model="panels"
      focusable
      multiple
      flat
    >
      <v-expansion-panel>
        <v-expansion-panel-header>已生成发货单</v-expansion-panel-header>
        <v-expansion-panel-content class="pt-3">
          <v-card
            :loading="loadingDataItems"
            class="pt-1"
          >
            <v-expansion-panels v-if="shippingList.length || loadingDataItems">
              <v-expansion-panel
                v-for="shippingOrder in shippingList"
                :key="shippingOrder.id"
              >
                <v-expansion-panel-header>
                  <div>
                    单号：<span class="primary--text">{{ shippingOrder.sendNo }}</span>
                    <span class="ml-4">运单号：</span><span class="primary--text">{{ shippingOrder.wayBillNo }}</span>
                    <span class="ml-4">状态：</span><span :class="shippingOrder.dStatus | orderShippingStatusClass">{{ shippingOrder.dStatus | orderShippingStatusText }}</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card
                    outlined
                    class="mt-4"
                    flat
                  >
                    <v-simple-table class="text-center">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th
                              class="text-center"
                              style="width:80px"
                            >
                              图片
                            </th>
                            <th class="text-center">
                              商品名称
                            </th>
                            <th class="text-center">
                              规格
                            </th>
                            <th class="text-center">
                              本次发货数
                            </th>
                            <th class="text-center">
                              备注
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="item in shippingOrder.detail"
                            :key="item.id"
                          >
                            <td class="py-2">
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
                            </td>
                            <td>{{ item.goodName }}({{ item.goodNameEn }})</td>
                            <td><span v-if="item.goodDetailName">{{ item.goodDetailName }}({{ item.goodDetailNameEn }})</span></td>
                            <td>{{ item.buNumber }}{{ item.buUnitName }}({{ item.buUnitNameEn }})</td>
                            <td>{{ item.memo ? item.memo : '无' }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                  <div class="pt-4 text-right d-flex">
                    <div class="text-left">
                      <div class="mb-1">
                        <span class="grey--text">发货日期：</span>{{ shippingOrder.deliveryTime | dateTruncate(10) }}
                      </div>
                      <div class="mb-1">
                        <span class="grey--text">发货仓库：</span>{{ shippingOrder.warehouseName }}
                      </div>
                      <div><span class="grey--text">备注：</span> {{ shippingOrder.memo ? shippingOrder.memo : '无' }}</div>
                    </div>
                    <div
                      v-if="shippingOrder.dStatus !== '2'"
                      class="ml-auto"
                    >
                      <v-btn
                        v-if="shippingOrder.dStatus === '0'"
                        color="primary"
                        text
                        class="body-1"
                        @click="openDialogEdit(shippingOrder)"
                      >
                        <v-icon left>
                          mdi-pencil
                        </v-icon>
                        编辑
                      </v-btn>
                      <v-btn
                        v-if="shippingOrder.dStatus === '0'"
                        color="success"
                        text
                        class="body-1 ml-2"
                        @click="dialogConfirm = true;toConfirmShippingOrder = shippingOrder.id"
                      >
                        <v-icon left>
                          mdi-check
                        </v-icon>
                        审核
                      </v-btn>
                      <v-btn
                        v-if="shippingOrder.dStatus === '1'"
                        color="error lighten-2"
                        text
                        class="body-1 ml-2"
                        @click="dialogNullify = true;toNullifyShippingOrder = shippingOrder.id"
                      >
                        <v-icon left>
                          mdi-cancel
                        </v-icon>
                        作废
                      </v-btn>
                      <v-btn
                        v-if="shippingOrder.dStatus === '0'"
                        color="secondary"
                        text
                        class="body-1 ml-2"
                        @click="dialogDelete = true;toDeleteShippingOrder = shippingOrder.id"
                      >
                        <v-icon left>
                          mdi-delete
                        </v-icon>
                        删除
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-card-text
              v-else
              class="text-center py-4 body-1 grey--text"
            >
              暂无发货单
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>待发货商品</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            outlined
            class="mt-4"
            flat
          >
            <order-shipping-tab-products
              :products="order.detail"
              :need="need"
              :selected-products-units="selectedProductsUnits"
              no-data-text="所有商品都已发出"
              @update:detail="detailToPost = $event"
            />
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div
      class="py-4"
    >
      <v-btn
        v-if="order.dStatus === '5' || order.dStatus === '7'"
        color="primary"
        large
        class="px-12 body-1 mr-4"
        @click="openDialogShipping"
      >
        马上发货
      </v-btn>
    </div>
    <v-dialog
      v-model="dialogShipping"
      max-width="650"
    >
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-card>
          <v-card-title class="title grey lighten-3 pa-4">
            填写发货单
          </v-card-title>
          <v-container fluid>
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                发货时间：
              </v-col>
              <v-col cols="5">
                <v-menu
                  ref="menuDate"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="shipping.deliveryTime"
                      class="white rounded-left-0"
                      placeholder="请选择发货日期"
                      outlined
                      single-line
                      dense
                      hide-details
                      append-icon="mdi-calendar-import"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="shipping.deliveryTime"
                    color="primary"
                    scrollable
                    @input="menuDate = false"
                  />
                </v-menu>
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
                <span class="error--text required">*</span>发货仓库：
              </v-col>
              <v-col cols="5">
                <v-select
                  v-model="shipping.warehouseId"
                  :loading="loadingWarehouse"
                  :items="warehouseList.data.items"
                  :rules="warehouseRules"
                  item-text="dnames"
                  item-value="id"
                  placeholder="请选择仓库"
                  clearable
                  outlined
                  dense
                  single-line
                  hide-details
                  no-data-text="暂无数据"
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
                运单号：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="shipping.wayBillNo"
                  placeholder="请输入运单号"
                  dense
                  outlined
                  clearable
                  required
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
                备注：
              </v-col>
              <v-col cols="8">
                <v-textarea
                  v-model="shipping.memo"
                  outlined
                  value=""
                  dense
                  placeholder="请输入发货单备注"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
              color="primary"
              :loading="adding"
              :disabled="adding || !valid"
              @click="addShippingOrder"
            >
              提交
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogShipping = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="dialogNullify"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认作废此发货单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="nullifying"
            :disabled="nullifying"
            @click="nullifyShippingOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogNullify = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogConfirm"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认通过此发货单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="confirming"
            :disabled="confirming"
            @click="confirmShippingOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogConfirm = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认删除此发货单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteShippingOrder"
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
      v-model="dialogEditConfirm"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确认编辑此发货单吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="editing"
            :disabled="editing"
            @click="editShippingOrder"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogEditConfirm = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      max-width="1200"
    >
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-card>
          <v-card-title class="title grey lighten-3 pa-4">
            编辑发货单
          </v-card-title>
          <v-container>
            <v-card outlined>
              <order-shipping-tab-products
                :products="toEditShippingOrder.detail"
                :need="needShippingOrder"
                :edit="true"
                :selected-products-units="selectedProductsUnits"
                @update:detail="detailToShippingOrder = $event"
              />
              <v-divider />
              <v-card-text class="body-1">
                <v-container fluid>
                  <v-row
                    align="center"
                    class="mb-3"
                  >
                    <v-col
                      cols="3"
                      class="text-right"
                    >
                      发货时间：
                    </v-col>
                    <v-col cols="5">
                      <v-menu
                        ref="menuDate"
                        v-model="menuDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="toEditShippingOrder.deliveryTime"
                            class="white rounded-left-0"
                            placeholder="请选择发货日期"
                            outlined
                            single-line
                            dense
                            hide-details
                            append-icon="mdi-calendar-import"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="toEditShippingOrder.deliveryTime"
                          color="primary"
                          scrollable
                          @input="menuDate = false"
                        />
                      </v-menu>
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
                      <span class="error--text required">*</span>发货仓库：
                    </v-col>
                    <v-col cols="5">
                      <v-select
                        v-model="toEditShippingOrder.warehouseId"
                        :loading="loadingWarehouse"
                        :items="warehouseList.data.items"
                        :rules="warehouseRules"
                        item-text="dnames"
                        item-value="id"
                        placeholder="请选择仓库"
                        clearable
                        outlined
                        dense
                        single-line
                        hide-details
                        no-data-text="暂无数据"
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
                      运单号：
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model="shipping.wayBillNo"
                        placeholder="请输入运单号"
                        dense
                        outlined
                        clearable
                        required
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
                      备注：
                    </v-col>
                    <v-col cols="8">
                      <v-textarea
                        v-model="toEditShippingOrder.memo"
                        outlined
                        value=""
                        dense
                        placeholder="请输入发货单备注"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-container>
          <v-card-actions class="grey lighten-4 py-3">
            <div class="flex-grow-1" />
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="dialogEditConfirm = true;needShippingOrder = !needShippingOrder;"
            >
              提交
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogEdit = false;"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import OrderShippingTabProducts from '@/components/OrderShippingTabProducts.vue';

export default {
  name: 'OrderShippingTab',
  components: {
    OrderShippingTabProducts,
  },
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadingWarehouse: false,
      dialogNullify: false,
      nullifying: false,
      toNullifyShippingOrder: '',
      dialogDelete: false,
      deleting: false,
      toDeleteShippingOrder: '',
      dialogConfirm: false,
      confirming: false,
      toConfirmShippingOrder: '',
      dialogShipping: false,
      dialogEdit: false,
      dialogEditConfirm: false,
      editing: false,
      toEditShippingOrder: {},
      loadingDataItems: false,
      menuDate: false,
      shippingList: [],
      panels: [0, 1],
      valid: true,
      shipping: {
        deliveryTime: new Date().toISOString().substr(0, 10),
      },
      warehouseRules: [v => !!v || '请选择发货仓库'],
      adding: false,
      need: false,
      needShippingOrder: false,
      detailToShippingOrder: [],
      detailToPost: [],
      selectedProductsUnits: [],
    };
  },
  computed: {
    ...mapState('warehouse', ['warehouseList']),
    params() {
      return R.mergeRight(
        {
          orderId: this.order.id,
          detail: this.detailToPost,
        },
        this.shipping
      );
    },
    editShippingOrderParams() {
      return R.mergeRight(this.toEditShippingOrder, {
        orderId: this.order.id,
        detail: this.detailToShippingOrder,
      });
    },
  },
  created() {
    this.getShippingOrderList();
    this.getSelectedProductsUnits(this.order.detail);
  },
  methods: {
    ...mapActions('order', [
      'getShippingOrderListAsync',
      'getProductUnitsAsync',
      'addShippingOrderAsync',
      'nullifyShippingOrderAsync',
      'deleteShippingOrderAsync',
      'confirmShippingOrderAsync',
      'editShippingOrderAsync',
    ]),
    ...mapActions('warehouse', ['getWarehouseListAsync']),
    openDialogEdit(shippingOrder) {
      this.toEditShippingOrder = shippingOrder; this.dialogEdit = true;
      if (!this.warehouseList.status) {
        this.getWarehouseList();
      }
    },
    openDialogShipping() {
      this.dialogShipping = true; this.need = !this.need;
      if (!this.warehouseList.status) {
        this.getWarehouseList();
      }
    },
    getWarehouseList() {
      this.loadingWarehouse = true;
      this.getWarehouseListAsync().catch((err) => {
        this.checkErr(err, 'openDialogShipping');
      }).finally(() => {
        this.loadingWarehouse = false;
      });
    },
    async getProductUnits(params) {
      const res = await this.getProductUnitsAsync(params);
      return {
        goodId: params.goodId,
        units: res,
      };
    },
    getSelectedProductsUnits(arr) {
      // 如果返回的商品已存在订单中
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
          this.checkErr(err, 'getSelectedProductsUnits');
        });
    },
    getShippingOrderList() {
      this.loadingDataItems = true;
      this.getShippingOrderListAsync({ orderId: this.order.id })
        .then((res) => {
          this.shippingList = res;
        })
        .catch(err => this.checkErr(err, 'getShippingOrderList'))
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    addShippingOrder() {
      this.adding = true;
      this.addShippingOrderAsync(this.params)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，提交发货成功!',
          });
          this.$emit('update:refresh');
          this.getShippingOrderList();
        })
        .catch(err => this.checkErr(err, 'addShippingOrder'))
        .finally(() => {
          this.adding = false;
          this.dialogShipping = false;
        });
    },
    nullifyShippingOrder() {
      this.nullifying = true;
      this.nullifyShippingOrderAsync({
        id: this.toNullifyShippingOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，作废发货单成功!',
          });
          this.getShippingOrderList();
          this.$emit('update:refresh');
        })
        .catch((err) => {
          this.checkErr(err, 'nullifyShippingOrder');
        })
        .finally(() => {
          this.nullifying = false;
          this.dialogNullify = false;
        });
    },
    deleteShippingOrder() {
      this.deleting = true;
      this.deleteShippingOrderAsync({
        id: this.toDeleteShippingOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除发货单成功!',
          });
          this.getShippingOrderList();
        })
        .catch((err) => {
          this.checkErr(err, 'deleteShippingOrder');
        })
        .finally(() => {
          this.deleting = false;
          this.dialogDelete = false;
        });
    },
    confirmShippingOrder() {
      this.confirming = true;
      this.confirmShippingOrderAsync({
        id: this.toConfirmShippingOrder,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，确认发货单成功!',
          });
          // 更新发货单列表和订单详情
          this.getShippingOrderList();
          this.$emit('update:refresh');
        })
        .catch((err) => {
          this.checkErr(err, 'confirmShippingOrder');
        })
        .finally(() => {
          this.confirming = false;
          this.dialogConfirm = false;
        });
    },
    editShippingOrder() {
      this.editing = true;
      this.editShippingOrderAsync(this.editShippingOrderParams)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，编辑发货单成功!',
          });
          this.getShippingOrderList();
        })
        .catch((err) => {
          this.checkErr(err, 'confirmShippingOrder');
        })
        .finally(() => {
          this.editing = false;
          this.dialogEdit = false;
          this.dialogEditConfirm = false;
        });
    },
  },
};
</script>
