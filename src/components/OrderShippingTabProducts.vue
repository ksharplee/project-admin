<template>
  <v-data-table
    :headers="headers"
    :items="productsApply"
    class="text-center"
    item-key="id"
    :no-data-text="noDataText"
    hide-default-footer
    persistent
    :items-per-page="20"
  >
    <template v-slot:item.goodName="{ item }">
      <div class="text-left">
        {{ item.goodName }}
      </div>
    </template>
    <template v-slot:item.goodDetailName="{ item }">
      {{ item.goodDetailName ? item.goodDetailName : '无' }}
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
        @change="changeUnit(item)"
      />
    </template>
    <template v-slot:item.buNumber="{ item }">
      <div class="input-group">
        <div class="input-group-control">
          <v-text-field
            v-model="item.buNumber"
            type="number"
            :suffix="getItemUnitName(item)"
            dense
            outlined
            required
            hide-details
          />
        </div>
      </div>
    </template>
    <template v-slot:item.needToSend="{ item }">
      {{ +item.goodNumber - +item.sendNumber }}{{ item.unitName }}
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
    <template v-slot:item.memo="{ item }">
      <div :class="item.memo ? '' : 'grey--text'">
        {{ item.memo ? item.memo : '无' }}
      </div>
    </template>
  </v-data-table>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';

export default {
  name: 'OrderShippingTabProducts',
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    need: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    selectedProductsUnits: {
      type: Array,
      default: () => [],
    },
    noDataText: {
      type: String,
      default: '暂无数据',
    },
  },
  data() {
    return {};
  },
  computed: {
    headers() {
      if (this.edit) {
        return [
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
            sortable: false,
            width: '300px',
          },
          {
            text: '商品规格',
            value: 'goodDetailName',
            align: 'center',
            sortable: false,
          },
          {
            text: '本次发货数量',
            value: 'buNumber',
            align: 'center',
            sortable: false,
            width: '300px',
          },
          {
            text: '单位',
            value: 'unit',
            align: 'center',
            sortable: false,
            width: '150px',
          },
          {
            text: '备注',
            value: 'memo',
            align: 'center',
            sortable: false,
          },
        ];
      }
      return [
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
          sortable: false,
          width: '300px',
        },
        {
          text: '商品货号',
          value: 'goodNo',
          align: 'center',
          sortable: false,
        },
        {
          text: '商品规格',
          value: 'goodDetailName',
          align: 'center',
          sortable: false,
        },
        {
          text: '剩余发货数量',
          value: 'needToSend',
          align: 'center',
          sortable: false,
        },
        {
          text: '本次发货数量',
          value: 'buNumber',
          align: 'center',
          sortable: false,
          width: '300px',
        },
        {
          text: '单位',
          value: 'unit',
          align: 'center',
          sortable: false,
          width: '150px',
        },
        {
          text: '备注',
          value: 'memo',
          align: 'center',
          sortable: false,
        },
      ];
    },
    productsApply() {
      // 只返回购买数量和发货数量不同的商品
      return R.reject(
        item => item.goodNumber === item.sendNumber,
        R.map((item) => {
          // 判断:当前商品购买数量是否大于等于打包数量，若是，保持原来的打包单位，若否，使用最小打包单位
          const buNumberGtePacknum = R.gte(item.buNumber, item.sendNumber);
          // item.buUnitId = item.buUnitId;
          // 计算当前商品的购买数量
          const buNumber = R.subtract(item.goodNumber, item.sendNumber);
          // 根据前面的判断设置发货数量
          item.buNumber = buNumberGtePacknum
            ? R.divide(buNumber, item.packeNum)
            : buNumber;
          // 根据前面的判断设置发货单位
          item.buUnitId = buNumberGtePacknum ? item.buUnitId : item.unitId;
          // if (!this.edit) {
          //   item.buNumber =              (+item.goodNumber - +item.sendNumber) / item.packeNum;
          // }
          const unitsAll = R.filter(
            unit => +unit.packeNum <= buNumber,
            R.prop(
              'units',
              R.find(
                R.propEq('goodId', item.goodId),
                this.selectedProductsUnits
              )
            ) || []
          );
          item.units = unitsAll;
          return item;
        }, R.clone(this.products))
      );
    },
    // 所有剩下需要发货的商品详情
    detail() {
      return R.map(
        item => ({
          indexId: item.indexId,
          buUnitId: item.buUnitId,
          buNumber: item.buNumber,
          packeNum: R.prop(
            'packeNum',
            R.find(R.propEq('unitId', item.buUnitId), item.units)
          ),
        }),
        this.productsApply
      );
    },
    // 需要提交的发货单商品详情
    detailToPost() {
      return R.filter(
        item => item.buNumber && item.buNumber !== '0',
        this.detail
      );
    },
  },
  watch: {
    need() {
      this.$emit('update:detail', this.detailToPost);
    },
  },
  created() {},
  methods: {
    ...mapActions('order', [
      'getShippingOrderListAsync',
      'addShippingOrderAsync',
    ]),
    getItemUnitName(item) {
      if (!item.units.length) {
        return item.unitName;
      }
      const unit = R.find(R.propEq('unitId', item.buUnitId), item.units);
      if (item.unitId !== item.buUnitId) {
        return `1${unit.unitName} = ${unit.packeNum}${item.unitName}`;
      }
      return unit.unitName;
    },
    changeUnit(item) {
      console.log('函数: changeUnit -> item', item);
    },
    // rulesNumber(item) {
    //   return [
    //     v => v * item.packeNum <= +item.goodNumber - +item.sendNumber
    //       || '发货数量不能超过未发货数量',
    //   ];
    // },
  },
};
</script>
