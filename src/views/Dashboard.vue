<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="(item, index) in menu"
        :key="index"
        cols="6"
        md="3"
      >
        <v-card
          :color="item.color"
          dark
        >
          <v-card-title>
            {{ item.text }}
          </v-card-title>
          <div class="display-3 font-weight-medium text-center">
            <animated-number
              :value="item.orCount"
              :duration="300"
              :format-value="formatToNumber"
            />
          </div>
          <v-card-actions class="justify-end">
            <v-btn
              text
              class="pl-4 subtitle-1"
              :to="item.url"
            >
              立即查看<v-icon right>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col
        v-for="(data, index) in statistics"
        :key="index"
        cols="12"
        md="6"
        align="stretch"
        class="mb-3"
      >
        <v-card
          height="100%"
          outlined
          :class="index === 3 ? 'd-flex flex-column' : ''"
        >
          <v-card-title class="grey lighten-4">
            <div class="font-weight-bold">
              {{ data.title }}
            </div>
            <div
              class="ml-auto"
              style="max-width:130px"
            >
              <v-select
                v-model="data.option"
                :items="index === 2 ? minOptionWeek : minOptionDay"
                outlined
                rounded
                no-data-text="暂无数据"
                dense
                hide-details
                @change="getChartDataSingle(index)"
              />
            </div>
            <div class="ml-2">
              <v-btn
                text
                rounded
                @click="openDialog(index)"
              >
                {{ data.startDate }}~{{ data.endDate }}
                <v-icon right>
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <div
            class="pa-4"
            :class="index === 3 ? 'flex-grow-1 d-flex align-center' : ''"
          >
            <div
              v-if="index !== 2"
              :id="data.chartContainerId"
              :ref="data.chartContainerId"
              :class="index === 3 ? 'flex-grow-1' : ''"
            >
              <v-container
                v-if="index === 3"
                fluid
              >
                <v-row class="text-center">
                  <v-col>
                    <div class="grey--text">
                      订单金额
                    </div>
                    <div class="d-flex justify-center my-2 align-baseline">
                      <div class="display-2 mr-1">
                        <animated-number
                          :value="data.data.orderAllAmount ? data.data.orderAllAmount : 0"
                          :duration="300"
                          :format-value="formatToNumberTwo"
                          class="warning--text"
                        />
                      </div>
                      / {{ data.data.orderAllCount }}笔
                    </div>
                  </v-col>
                  <v-divider vertical />
                  <v-col>
                    <div class="grey--text">
                      收款金额
                    </div>
                    <div class="d-flex justify-center my-2 align-baseline">
                      <div class="display-2 mr-1">
                        <animated-number
                          :value="data.data.receiptAllAmount ? data.data.receiptAllAmount : 0"
                          :duration="300"
                          :format-value="formatToNumberTwo"
                          class="warning--text"
                        />
                      </div>
                      / {{ data.data.receiptAllCount }}笔
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div
              v-if="index === 2"
              class="height-100"
            >
              <v-tabs
                v-model="tabs"
                background-color="grey lighten-5"
                center
                grow
                class="px-4"
                @change="switchTab"
              >
                <v-tab>订单金额</v-tab>
                <v-tab>收款金额</v-tab>
                <v-tab>订单量</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tabs"
                keep-alive
              >
                <v-tab-item
                  eager
                  class="pt-4"
                >
                  <div
                    :id="data.chartGoodsAmountContainerId"
                    :ref="data.chartGoodsAmountContainerId"
                  />
                </v-tab-item>
                <v-tab-item
                  eager
                  class="pt-4"
                >
                  <div
                    :id="data.chartReceipetAmountContainerId"
                    :ref="data.chartReceipetAmountContainerId"
                  />
                </v-tab-item>
                <v-tab-item
                  eager
                  class="pt-4"
                >
                  <div
                    :id="data.chartOrderCountContainerId"
                    :ref="data.chartOrderCountContainerId"
                  />
                </v-tab-item>
              </v-tabs-items>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="700"
    >
      <v-card>
        <v-container
          fluid
          class="px-8"
        >
          <v-row class="text-center">
            <v-col cols="6">
              <div class="title mb-2">
                开始时间
              </div>
              <v-date-picker
                v-model="startDate"
                color="primary"
              />
            </v-col>
            <v-col cols="6">
              <div class="title mb-2">
                结束时间
              </div>
              <v-date-picker
                v-model="endDate"
                color="primary"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="grey lighten-4">
          <v-spacer />
          <v-btn
            color="secondary"
            text
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="confirmSelectedDate"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import G2 from '@antv/g2';
import * as R from 'ramda';
import moment from 'moment';
import AnimatedNumber from 'animated-number-vue';

const mapIndexed = R.addIndex(R.map);

// moment设置时间格式
moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    '_'
  ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'MM-DD',
    LLL: 'YY-MM-DD',
    LLLL: 'YYYY年MM月DD日ddddAh点mm分',
    l: 'YYYY-M-D',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm',
  },
});

const today = moment().format('L');
const yesterday = moment()
  .subtract(1, 'days')
  .format('L');
const thisMonday = moment()
  .weekday(1)
  .format('L');
const lastMonday = moment()
  .weekday(-6)
  .format('L');
const lastSunday = moment()
  .weekday(0)
  .format('L');
const firstDayThisMonth = moment()
  .startOf('month')
  .format('L');
const firstDayLastMonth = moment()
  .subtract(1, 'month')
  .startOf('month')
  .format('L');
const lastDayLastMonth = moment()
  .subtract(1, 'month')
  .endOf('month')
  .format('L');
const firstDayThisYear = moment()
  .startOf('year')
  .format('L');
const firstDayLastYear = moment()
  .subtract(1, 'years')
  .startOf('year')
  .format('L');
const lastDayLastYear = moment()
  .subtract(1, 'years')
  .endOf('year')
  .format('L');
const weekDaysFramework = mapIndexed(
  (item, index) => ({
    date: item,
    allAmount: 0,
    allCount: 0,
    index,
  }),
  R.concat(R.tail(moment.weekdaysShort()), R.take(1, moment.weekdaysShort()))
);
const yearFramework = mapIndexed(
  (item, index) => ({
    date: item,
    allAmount: 0,
    allCount: 0,
    index,
  }),
  moment.monthsShort()
);
const thisMonthDays = moment().daysInMonth();
const lastMonthDays = moment()
  .subtract(1, 'month')
  .daysInMonth();
const getDayArrayByMonthLength = (length) => {
  const arr = [];
  for (let i = 1; i <= length; i += 1) {
    arr.push(`${i}日`);
  }
  return arr;
};
const monthFrameWorkThisMonth = mapIndexed(
  (item, index) => ({
    date: item,
    allAmount: 0,
    allCount: 0,
    index,
  }),
  getDayArrayByMonthLength(thisMonthDays)
);
const monthFrameWorkLastMonth = mapIndexed(
  (item, index) => ({
    date: item,
    allAmount: 0,
    allCount: 0,
    index,
  }),
  getDayArrayByMonthLength(lastMonthDays)
);

// 定义商品销售统计图表对象
let goodsAmountChart = null;
// 定义客户订单统计图表对象
let orderAmountChart = null;
// 定义订单金额营收趋势统计图表对象
let trendOrderAmountChart = null;
// 定义收款金额营收趋势统计图表对象
let trendReceipetAmountChart = null;
// 定义订单量营收趋势统计图表对象
let trendOrderCountChart = null;

export default {
  name: 'Dashboard',
  components: {
    AnimatedNumber,
  },
  data() {
    return {
      dialog: false,
      tabs: 0,
      menu: [
        {
          text: '商品总数',
          orCount: 0,
          url: { name: 'product_list' },
          color: 'blue darken-2',
        },
        {
          text: '待审核订单',
          orCount: 0,
          url: { name: 'order_list', params: { active: '1' } },
          color: 'cyan darken-1',
        },
        {
          text: '待支付订单',
          orCount: 0,
          url: { name: 'order_list', params: { active: '2' } },
          color: 'teal darken-1',
        },
        {
          text: '客户总数',
          orCount: 0,
          url: { name: 'customer_list' },
          color: 'light-blue darken-1',
        },
      ],
      colorSet: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue'],
      startDate: today,
      endDate: today,
      statistics: [
        {
          startDateValue: today,
          endDateValue: today,
          title: '商品销售统计',
          range: '今日',
          rangeIndex: 0,
          data: [],
          startDate: today,
          endDate: today,
          operate: '4',
          option: 0,
          chartContainerId: 'goodsAmount',
          api: '/index/orderGoodAmout',
        },
        {
          startDateValue: today,
          endDateValue: today,
          title: '客户订单统计',
          range: '今日',
          rangeIndex: 0,
          data: [],
          startDate: today,
          endDate: today,
          operate: '4',
          option: 0,
          chartContainerId: 'orderAmount',
          api: '/index/orderBuyersAmout',
        },
        {
          startDateValue: thisMonday,
          endDateValue: today,
          title: '营收趋势',
          range: '本周',
          rangeIndex: 0,
          data: [],
          startDate: thisMonday,
          endDate: today,
          operate: '2',
          option: 0,
          chartGoodsAmountContainerId: 'trendOrderAmount',
          chartReceipetAmountContainerId: 'trendReceipetAmount',
          chartOrderCountContainerId: 'trendOrderCount',
          api: '/index/orderRevenueAmout',
        },
        {
          startDateValue: today,
          endDateValue: today,
          range: '今日',
          rangeIndex: 0,
          title: '营收简报',
          data: {},
          startDate: today,
          endDate: today,
          operate: '4',
          option: 0,
          chartContainerId: 'briefAmount',
          api: '/index/orderBriefAmout',
        },
      ],
      dateIndex: 0,
      minOptionDay: [
        {
          text: '今日',
          value: 0,
          operate: '4',
        },
        {
          text: '昨日',
          value: 1,
          operate: '4',
        },
        {
          text: '本周',
          value: 2,
          operate: '1',
        },
        {
          text: '上周',
          value: 3,
          operate: '1',
        },
        {
          text: '本月',
          value: 4,
          operate: '2',
        },
        {
          text: '上月',
          value: 5,
          operate: '2',
        },
        {
          text: '自定义',
          value: 6,
          operate: '4',
        },
      ],
      minOptionWeek: [
        {
          text: '本周',
          value: 0,
          operate: '1',
        },
        {
          text: '上周',
          value: 1,
          operate: '1',
        },
        {
          text: '本月',
          value: 2,
          operate: '2',
        },
        {
          text: '上月',
          value: 3,
          operate: '2',
        },
        {
          text: '本年',
          value: 4,
          operate: '3',
        },
        {
          text: '去年',
          value: 5,
          operate: '3',
        },
        {
          text: '自定义',
          value: 6,
          operate: '4',
        },
      ],
      trendFramwork: weekDaysFramework,
    };
  },
  computed: {
    ...mapState(['breadCrumbs']),
  },
  created() {
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: true,
        to: { name: 'home' },
        exact: true,
      },
      {
        text: '控制台',
        disabled: true,
        exact: true,
      },
    ]);
  },
  mounted() {
    this.initCharts();
    this.getConsoleData();
  },
  methods: {
    ...mapActions(['getConsoleDataAsync', 'getChartDataSingleAsync']),
    getConsoleData() {
      this.$store.commit('START_LOADING');
      this.getConsoleDataAsync({
        operate: '1',
        gaStartDate: this.statistics[0].startDate,
        gaEndDate: this.statistics[0].endDate,
        baStartDate: this.statistics[1].startDate,
        baEndDate: this.statistics[1].endDate,
        raStartDate: this.statistics[2].startDate,
        raEndDate: this.statistics[2].endDate,
        bfaStartDate: this.statistics[3].startDate,
        bfaEndDate: this.statistics[3].endDate,
      })
        .then((res) => {
          const arr = this.menu;
          arr[0].orCount = res.data.goodsCount;
          arr[1].orCount = res.data.orUnCheckCount;
          arr[2].orCount = res.data.orUnReceiptCount;
          arr[3].orCount = res.data.buyersCount;
          this.menu = arr;
          this.statistics[0].data = res.data.orderGoodAmout
            ? res.data.orderGoodAmout
            : [];
          this.statistics[1].data = res.data.orderBuyerAmout
            ? res.data.orderBuyerAmout
            : [];
          this.statistics[2].data = res.data.orderRevenueAmout
            ? res.data.orderRevenueAmout
            : [];
          this.statistics[3].data = res.data.orderBriefAmout
            ? res.data.orderBriefAmout
            : [];
          this.updateChart(0);
          this.updateChart(1);
          this.updateChart(2);
        })
        .catch((err) => {
          this.checkErr(err, 'getConsoleData');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    formatToNumber(value) {
      return value.toFixed(0);
    },
    formatToNumberTwo(value) {
      return value.toFixed(2);
    },
    openDialog(i) {
      this.dateIndex = i;
      this.startDate = this.statistics[i].startDate;
      this.endDate = this.statistics[i].endDate;
      this.dialog = true;
    },
    confirmSelectedDate() {
      const diff = Math.abs(
        moment(this.startDate).diff(moment(this.endDate), 'days')
      );
      if (diff > 731) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '两个日期之间不能超过两年',
        });
        return;
      }
      this.$set(this.statistics[this.dateIndex], 'startDate', this.startDate);
      this.$set(this.statistics[this.dateIndex], 'endDate', this.endDate);
      // 设置对应数据对应的option为自定义，值为6
      // 设置对应数据对应的operate为对应的option数组里的operate
      this.$set(this.statistics[this.dateIndex], 'option', 6);
      this.$set(this.statistics[this.dateIndex], 'operate', '4');
      // 调用单个统计数据获取接口
      this.$store.commit('START_LOADING');
      this.getChartDataSingle(this.dateIndex);
    },
    // 初始化所有统计图表
    initCharts() {
      this.initGoodsAmountChart();
      this.initOrderAmountChart();
      this.initTrendOrderAmountChart();
      this.initTrendReceipetAmountChart();
      this.initTrendOrderCountChart();
    },
    // 初始化商品统计图表
    initGoodsAmountChart() {
      goodsAmountChart = new G2.Chart({
        container: 'goodsAmount',
        forceFit: true,
        height: 400,
        padding: [40, 40, 80, 60],
      });
      this.resizeWindowForCharts();
      const data = [];
      goodsAmountChart.source(data);
      goodsAmountChart.axis('allAmount', {
        label: {
          textStyle: {
            fill: '#aaaaaa',
          },
        },
      });
      goodsAmountChart.axis('goodName', {
        label: {
          formatter: (v) => {
            if (v.length > 6) {
              return `${v.substr(0, 7)}...`;
            }
            return v;
          },
        },
      });
      goodsAmountChart.legend('goodName', {
        itemFormatter: (v) => {
          if (v.length > 6) {
            return `${v.substr(0, 7)}...`;
          }
          return v;
        },
      });
      goodsAmountChart.tooltip({
        share: true,
      });
      goodsAmountChart.scale('allAmount', {
        tickCount: 6,
      });
      goodsAmountChart
        .interval()
        .position('goodName*allAmount')
        .label('allAmount', {
          formatter: v => `￥${v}`,
        })
        .label('goodName', {
          formatter: (v) => {
            if (v.length > 6) {
              return `${v.substr(0, 7)}...`;
            }
            return v;
          },
        })
        .color('goodName', i => this.colorSet[i]);
      goodsAmountChart.render();
    },
    // 初始化客户订单统计图表
    initOrderAmountChart() {
      orderAmountChart = new G2.Chart({
        container: 'orderAmount',
        forceFit: true,
        height: 400,
        padding: [40, 40, 80, 60],
      });
      this.resizeWindowForCharts();
      const data = [];
      orderAmountChart.source(data);
      orderAmountChart.axis('allAmount', {
        label: {
          textStyle: {
            fill: '#aaaaaa',
          },
        },
      });
      orderAmountChart.axis('buyerName', {
        label: {
          formatter: (v) => {
            if (v.length > 6) {
              return `${v.substr(0, 7)}...`;
            }
            return v;
          },
        },
      });
      orderAmountChart.legend('buyerName', {
        itemFormatter: (v) => {
          if (v.length > 6) {
            return `${v.substr(0, 7)}...`;
          }
          return v;
        },
      });
      orderAmountChart.tooltip({
        share: true,
      });
      orderAmountChart.scale('allAmount', {
        tickCount: 6,
      });
      orderAmountChart
        .interval()
        .position('buyerName*allAmount')
        .label('allAmount', {
          formatter: v => `￥${v}`,
        })
        .label('goodName', {
          formatter: (v) => {
            if (v.length > 6) {
              return `${v.substr(0, 7)}...`;
            }
            return v;
          },
        })
        .color('buyerName', i => this.colorSet[i]);
      orderAmountChart.render();
    },
    // 初始化营收趋势订单金额统计图表
    initTrendOrderAmountChart() {
      trendOrderAmountChart = new G2.Chart({
        container: 'trendOrderAmount',
        forceFit: true,
        height: 400,
        padding: [40, 40, 80, 60],
      });
      this.resizeWindowForCharts();
      const data = [];
      trendOrderAmountChart.source(data);
      trendOrderAmountChart.axis('date', {
        tickLine: {
          alignWithLabel: false,
          length: 0,
        },
      });
      trendOrderAmountChart.axis('allAmount', {
        label: {
          textStyle: {
            fill: '#aaaaaa',
          },
        },
      });
      trendOrderAmountChart.tooltip({
        crosshairs: {
          type: 'line',
        },
      });
      trendOrderAmountChart
        .area()
        .shape('smooth')
        .position('date*allAmount')
        .label('allAmount', {
          formatter: v => `￥${v}`,
        });
      trendOrderAmountChart
        .line()
        .shape('smooth')
        .position('date*allAmount')
        .size(2);
      trendOrderAmountChart.render();
    },
    // 初始化营收趋势收款金额统计图表
    initTrendReceipetAmountChart() {
      trendReceipetAmountChart = new G2.Chart({
        container: 'trendReceipetAmount',
        forceFit: true,
        height: 400,
        padding: [40, 40, 80, 60],
      });
      this.resizeWindowForCharts();
      const data = [];
      trendReceipetAmountChart.source(data);
      trendReceipetAmountChart.axis('date', {
        tickLine: {
          alignWithLabel: false,
          length: 0,
        },
      });
      trendReceipetAmountChart.axis('allAmount', {
        label: {
          textStyle: {
            fill: '#aaaaaa',
          },
        },
      });
      trendReceipetAmountChart.tooltip({
        crosshairs: {
          type: 'line',
        },
      });
      trendReceipetAmountChart
        .area()
        .shape('smooth')
        .position('date*allAmount')
        .label('allAmount', {
          formatter: v => `￥${v}`,
        });
      trendReceipetAmountChart
        .line()
        .shape('smooth')
        .position('date*allAmount')
        .size(2);
      trendReceipetAmountChart.render();
    },
    // 初始化营收趋势收款金额统计图表
    initTrendOrderCountChart() {
      trendOrderCountChart = new G2.Chart({
        container: 'trendOrderCount',
        forceFit: true,
        height: 400,
        padding: [40, 40, 80, 60],
      });
      this.resizeWindowForCharts();
      const data = [];
      trendOrderCountChart.source(data);
      trendOrderCountChart.axis('date', {
        tickLine: {
          alignWithLabel: false,
          length: 0,
        },
      });
      trendOrderCountChart.axis('allCount', {
        label: {
          textStyle: {
            fill: '#aaaaaa',
          },
        },
      });
      trendOrderCountChart.tooltip({
        crosshairs: {
          type: 'line',
        },
      });
      trendOrderCountChart
        .area()
        .shape('smooth')
        .position('date*allCount');
      trendOrderCountChart
        .line()
        .shape('smooth')
        .position('date*allCount')
        .size(2);
      trendOrderCountChart.render();
    },
    // 更新图表数据
    updateChart(i) {
      switch (i) {
        case 0:
          this.changeGoodsAmountData();
          break;
        case 1:
          this.changeOrderAmountData();
          break;
        case 2:
          this.changeTrendOrderAmountData();
          this.changeTrendReceiptAmountData();
          this.changeTrendOrderCountData();
          break;
        default:
          break;
      }
    },
    // 触发窗口拉伸事件提供图表的显示宽度
    resizeWindowForCharts() {
      const event = document.createEvent('Event');
      event.initEvent('resize', true, true);
      window.dispatchEvent(event);
    },
    // 切换应收趋势tab
    switchTab(e) {
      if (e === 1 || e === 2) {
        this.resizeWindowForCharts();
      }
    },
    // 设置商品统计图表类型数据
    changeGoodsAmountData() {
      let arr = this.statistics[0].data;
      arr = mapIndexed((item, index) => {
        item.index = index;
        item.allAmount = +item.allAmount;
        return item;
      }, arr);
      goodsAmountChart.changeData(arr);
    },
    // 设置客户订单统计图表类型数据
    changeOrderAmountData() {
      let arr = this.statistics[1].data;
      arr = mapIndexed((item, index) => {
        item.index = index;
        item.allAmount = +item.allAmount;
        return item;
      }, arr);
      orderAmountChart.changeData(arr);
    },
    // 设置营收趋势订单金额统计图表类型数据
    // 设置依据为trendFrameWork
    changeTrendOrderAmountData() {
      const resource = this.statistics[2].data.revenueOrderAmout;
      const arr = JSON.parse(JSON.stringify(this.trendFramwork));
      R.map((item) => {
        arr[+item.showKey - 1].allCount = +item.allCount;
        arr[+item.showKey - 1].allAmount = +item.allAmount;
        return item;
      }, resource);
      if (arr.length > 12) {
        trendOrderAmountChart.source(arr, {
          date: {
            type: 'cat',
            values: arr.slice(0, 12).map(row => row.date),
          },
          value: {
            tickCount: 6,
          },
        });
        trendOrderAmountChart
          .interact('drag', {
            type: 'X',
          })
          .interact('scroll-bar', {
            type: 'X',
          });
      } else {
        trendOrderAmountChart.source(arr, {
          date: {
            type: 'cat',
          },
          value: {
            tickCount: 6,
          },
        });
        trendOrderAmountChart.interact('drag', false);
        trendOrderAmountChart.interact('scroll-bar', false);
      }
      trendOrderAmountChart.repaint();
    },
    // 设置营收趋势收款金额统计图表类型数据
    // 设置依据为trendFrameWork
    changeTrendReceiptAmountData() {
      const resource = this.statistics[2].data.revenueReceiptAmout;
      const arr = JSON.parse(JSON.stringify(this.trendFramwork));
      R.map((item) => {
        arr[+item.showKey - 1].allCount = +item.allCount;
        arr[+item.showKey - 1].allAmount = +item.allAmount;
        return item;
      }, resource);
      if (arr.length > 12) {
        trendReceipetAmountChart.source(arr, {
          date: {
            type: 'cat',
            values: arr.slice(0, 12).map(row => row.date),
          },
          value: {
            tickCount: 6,
          },
        });
        trendReceipetAmountChart
          .interact('drag', {
            type: 'X',
          })
          .interact('scroll-bar', {
            type: 'X',
          });
      } else {
        trendReceipetAmountChart.source(arr, {
          date: {
            type: 'cat',
          },
          value: {
            tickCount: 6,
          },
        });
        trendReceipetAmountChart.interact('drag', false);
        trendReceipetAmountChart.interact('scroll-bar', false);
      }
      trendReceipetAmountChart.repaint();
    },
    // 设置营收趋势订单数量统计图表类型数据
    // 设置依据为trendFrameWork
    changeTrendOrderCountData() {
      const resource = this.statistics[2].data.revenueOrderAmout;
      const arr = JSON.parse(JSON.stringify(this.trendFramwork));
      R.map((item) => {
        arr[+item.showKey - 1].allCount = +item.allCount;
        arr[+item.showKey - 1].allAmount = +item.allAmount;
        return item;
      }, resource);
      if (arr.length > 12) {
        trendOrderCountChart.source(arr, {
          date: {
            type: 'cat',
            values: arr.slice(0, 12).map(row => row.date),
          },
          value: {
            tickCount: 6,
          },
        });
        trendOrderCountChart
          .interact('drag', {
            type: 'X',
          })
          .interact('scroll-bar', {
            type: 'X',
          });
      } else {
        trendOrderCountChart.source(arr, {
          date: {
            type: 'cat',
          },
          value: {
            tickCount: 6,
          },
        });
        trendOrderCountChart.interact('drag', false);
        trendOrderCountChart.interact('scroll-bar', false);
      }
      trendOrderCountChart.repaint();
    },
    // 获取单个图表数据
    getChartDataSingle(i) {
      // 设置X坐标轴日期
      this.setDateByOption(i);
      this.getChartDataSingleAsync({
        api: this.statistics[i].api,
        params: {
          startDate: this.statistics[i].startDate,
          endDate: this.statistics[i].endDate,
          operate: this.statistics[i].operate,
        },
      })
        .then((res) => {
          this.$set(this.statistics[i], 'data', res.data);
          this.updateChart(i);
        })
        .catch((err) => {
          this.checkErr(err, 'getChartDataSingle');
        })
        .finally(() => {
          if (this.dialog) {
            this.dialog = false;
            this.$store.commit('END_LOADING');
          }
        });
    },
    // 根据开始日期和结束日期返回横坐标,60天以内返回每天的日期，60天到180天每隔两天生成一个日期，180天到2年每星期生成一个日期
    setAxisString(startDate, endDate) {
      const diff = moment(startDate).diff(moment(endDate), 'days');
      let beginDate;
      let interval;
      if (diff < 0) {
        beginDate = startDate;
      } else {
        beginDate = endDate;
      }
      if (Math.abs(diff) > 60 && Math.abs(diff) <= 180) {
        interval = 3;
      } else if (Math.abs(diff) > 180) {
        interval = 7;
      } else {
        interval = 1;
      }
      // diff不包含endDate当天，+1
      const dateLength = (Math.abs(diff) + 1) / interval;
      const dateString = [];
      for (let i = 0; i < dateLength; i += 1) {
        dateString.push(
          moment(beginDate)
            .add(interval * i, 'days')
            .format(interval === 7 ? 'LLL' : 'LL')
        );
      }
      return dateString;
    },
    // 设置趋势横坐标轴
    setTrendFramework(text, startDate, endDate) {
      if (text === '本周' || text === '上周') {
        this.trendFramwork = weekDaysFramework;
      } else if (text === '本月') {
        this.trendFramwork = monthFrameWorkThisMonth;
      } else if (text === '上月') {
        this.trendFramwork = monthFrameWorkLastMonth;
      } else if (text === '本年' || text === '去年') {
        this.trendFramwork = yearFramework;
      } else {
        this.trendFramwork = mapIndexed(
          (item, index) => ({
            date: item,
            name: item,
            allAmount: 0,
            allCount: 0,
            index,
          }),
          this.setAxisString(startDate, endDate)
        );
      }
    },
    // 选择时间选项后
    setDateByOption(i) {
      const optionIndex = this.statistics[i].option;
      let option = null;
      if (i !== 2) {
        option = this.minOptionDay[optionIndex];
      } else {
        option = this.minOptionWeek[optionIndex];
        // 设置X坐标轴日期
        this.setTrendFramework(
          option.text,
          this.statistics[i].startDate,
          this.statistics[i].endDate
        );
      }
      switch (option.text) {
        case '昨日':
          this.$set(this.statistics[i], 'startDate', yesterday);
          this.$set(this.statistics[i], 'endDate', yesterday);
          break;
        case '本周':
          this.$set(this.statistics[i], 'startDate', thisMonday);
          this.$set(this.statistics[i], 'endDate', today);
          break;
        case '上周':
          this.$set(this.statistics[i], 'startDate', lastMonday);
          this.$set(this.statistics[i], 'endDate', lastSunday);
          break;
        case '本月':
          this.$set(this.statistics[i], 'startDate', firstDayThisMonth);
          this.$set(this.statistics[i], 'endDate', today);
          break;
        case '上月':
          this.$set(this.statistics[i], 'startDate', firstDayLastMonth);
          this.$set(this.statistics[i], 'endDate', lastDayLastMonth);
          break;
        case '本年':
          this.$set(this.statistics[i], 'startDate', firstDayThisYear);
          this.$set(this.statistics[i], 'endDate', today);
          break;
        case '去年':
          this.$set(this.statistics[i], 'startDate', firstDayLastYear);
          this.$set(this.statistics[i], 'endDate', lastDayLastYear);
          break;
        default:
          break;
      }
      this.$set(this.statistics[i], 'operate', option.operate);
    },
  },
};
</script>
