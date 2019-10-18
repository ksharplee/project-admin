<template>
  <div>
    1
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as R from 'ramda';

export default {
  name: 'Dashboard',
  data() {
    return {
      // arr1: ['白色', '灰色', '蓝色', '红色', '紫色', '黄色'],
      arr1: ['白色', '灰色'],
      // arr2: ['5cm', '8cm', '10cm', '12cm', '15cm', '18cm', '20cm'],
      arr2: ['5cm', '8cm'],
      arr3: ['1kg', '2kg'],
    };
  },
  computed: {
    ...mapState(['breadCrumbs']),
    arrAll() {
      return [this.arr1, this.arr2, this.arr3];
    },
    head() {
      return R.head(this.arrAll);
    },
    tail() {
      return R.tail(this.arrAll);
    },
    stepOne() {
      return R.xprod(this.head, R.head(this.tail));
    },
    stepTwo() {
      return R.map(R.flatten, R.xprod(this.stepOne, R.last(this.arrAll)));
    },
    step() {
      return R.reduce(
        (acc, arr) => R.map(R.flatten, R.xprod(acc, arr)),
        this.head,
        this.tail
      );
    },
  },
  created() {
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: true,
        to: { name: 'home' },
        exact: true,
      },
    ]);
  },
  methods: {},
};
</script>
