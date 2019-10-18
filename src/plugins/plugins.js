import * as R from 'ramda';

const mapIndexed = R.addIndex(R.map);

export default {
  install: (Vue, options) => {
    Vue.mixin({
      methods: {
        checkErr(err, source) {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'error',
            text: err.message,
          });
          console.log(`函数: ${source} -> err.message`, err.message);
          if (err.message === '非法访问') {
            this.$router.replace({ name: 'login' });
          }
        },
      },
    });
    // 截取日期前num个字符
    Vue.filter('dateTruncate', (str, num) => {
      if (str) {
        return R.take(num, str);
      }
      return '无';
    });
    // 截取小数点后两位
    Vue.filter('toFixed', (v) => {
      if (v) {
        return v.toFixed(2);
      }
      return 0;
    });
    // 拼接地址字符串
    Vue.filter('addressStr', (item) => {
      if (item && item.firstArea && item.secondArea && item.thirdArea) {
        return `${item.firstArea} ${item.secondArea} ${item.thirdArea} ${item.addressPart}`;
      }
      return '无';
    });
    // 订单流程字符串拼接
    Vue.filter('flowContentFilter', (v) => {
      if (v) {
        return R.join(' --> ', R.split(',', v));
      }
      return '无';
    });
    // 订单类型字符串, 1:正常采购 2:小样采购 3:立即购买 4:代客下单
    Vue.filter('orderType', (v) => {
      if (v === '1') {
        return '正常采购';
      }
      if (v === '2') {
        return '小样采购';
      }
      if (v === '3') {
        return '立即购买';
      }
      return '代客下单';
    });
    // 订单发货状态字符串, 1:提交 2:已取消(采) 3:已取消(供) 4:已确(供) 5:财务审核 6:作废(供) 7:部分发货 8:完成发货 9:确认收货(采) 10:完成(供)
    Vue.filter('shippingStatus', (v) => {
      if (v === '7') {
        return '部分发货';
      }
      if (v === '8') {
        return '已发货';
      }
      if (v === '9') {
        return '已确认收获';
      }
      return '备货中/待发货';
    });
    Vue.filter('OrderStatus', (v) => {
      if (v === '1') {
        return '待确认';
      }
      if (v === '2') {
        return '采购商已取消';
      }
      if (v === '3') {
        return '供应商已取消';
      }
      if (v === '4') {
        return '待财务审核';
      }
      if (v === '5') {
        return '待发货确认';
      }
      if (v === '6') {
        return '已作废';
      }
      if (v === '7') {
        return '部分发货';
      }
      if (v === '8') {
        return '完成发货';
      }
      if (v === '9') {
        return '已确认收货';
      }
      if (v === '10') {
        return '已完成';
      }
      return '无';
    });
    Vue.filter('OrderStatusClass', (v) => {
      if (v === '1' || v === '4' || v === '5' || v === '8' || v === '9' || v === '10') {
        return 'success--text';
      }
      if (v === '2' || v === '3' || v === '6') {
        return 'grey--text';
      }
      return '';
    });
    // 订单付款状态 0:未收款 2:部分收款 3:完成收款
    Vue.filter('paymentStatus', (v) => {
      if (v === '0') {
        return '未收款';
      }
      if (v === '2') {
        return '部分收款';
      }
      if (v === '3') {
        return '完成收款';
      }
      return '无';
    });
    Vue.filter('paymentStatusClass', (v) => {
      if (v === '0') {
        return 'error--text';
      }
      if (v === '3') {
        return 'success--text';
      }
      return 'grey-text';
    });
    // 订单流程 提交订单 --> 确认订单 --> 财务审核 --> 确认发货 --> 确认收货 --> 完成
    const texts = ['提交订单', '确认订单', '财务审核', '确认发货', '确认收货', '完成'];
    Vue.filter('orderSequenceText', (v) => {
      if (v) {
        let str = '';
        mapIndexed((s, i) => {
          if (s === '1') {
            str = R.concat(`-->${texts[i]}`, str);
          }
        }, v);
        str = R.slice(3, str.length, str);
        return str;
      }
    });
    // 订单发货单/收款单状态
    Vue.filter('orderShippingStatusText', (v) => {
      if (v) {
        if (v === '0') {
          return '待审核';
        }
        if (v === '1') {
          return '已审核';
        }
        return '已作废';
      }
    });
    Vue.filter('orderShippingStatusClass', (v) => {
      if (v) {
        if (v === '0') {
          return 'error--text';
        }
        if (v === '1') {
          return 'success--text';
        }
        return 'grey--text';
      }
    });
    // 订单发货单/收款单状态
    Vue.filter('orderSubStatusText', (v) => {
      if (v) {
        if (v === '1') {
          return '待审核';
        }
        if (v === '2') {
          return '已审核';
        }
        return '已作废';
      }
    });
    Vue.filter('orderSubStatusClass', (v) => {
      if (v) {
        if (v === '1') {
          return 'error--text';
        }
        if (v === '2') {
          return 'success--text';
        }
        return 'grey--text';
      }
    });
    // 收款单状态
    Vue.filter('paymentOrderStatusText', (v) => {
      if (v) {
        // if (v === '0') {
        //   return '未收款';
        // }
        if (v === '1') {
          return '已驳回';
        }
        if (v === '2') {
          return '未审核';
        }
        if (v === '3') {
          return '已审核';
        }
        if (v === '4') {
          return '已作废';
        }
        return '无';
      }
    });
    Vue.filter('paymentOrderStatusClass', (v) => {
      if (v) {
        if (v === '2') {
          return 'error--text';
        }
        // if (v === '0' || v === '2') {
        //   return 'error--text';
        // }
        if (v === '3') {
          return 'success--text';
        }
        if (v === '4' || v === '1') {
          return 'grey--text';
        }
        return 'grey--text';
      }
    });
  },
};
