<template>
  <v-row no-gutters>
    <v-col cols="4">
      <v-select
        :value="addressFirstId"
        :items="areaInfo.data"
        :loading="loadingArea"
        :disabled="loadingArea"
        class="rounded-right-0"
        item-text="areaName"
        item-value="id"
        single-line
        dense
        outlined
        placeholder="省"
        no-data-text="暂无数据"
        hide-details
        @change="getCitiesByChange"
      />
    </v-col>
    <v-col
      cols="4"
      style="margin-right:-1px;margin-left:-1px"
    >
      <v-select
        :value="addressSecondId"
        :items="cities"
        :loading="loadingCities"
        :disabled="!addressFirstId || loadingCities"
        class="rounded-0"
        item-text="areaName"
        item-value="id"
        single-line
        dense
        outlined
        placeholder="市"
        no-data-text="暂无数据"
        hide-details
        @change="getRegionsByChange"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        :value="addressId"
        :items="regions"
        :loading="loadingRegions"
        :disabled="!addressSecondId || loadingRegions"
        class="rounded-left-0"
        item-text="areaName"
        item-value="id"
        single-line
        dense
        outlined
        placeholder="区"
        no-data-text="暂无数据"
        hide-details
        @change="getRegionByChange"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Area',
  props: {
    addressFirstId: {
      type: String,
      default: '',
    },
    addressSecondId: {
      type: String,
      default: '',
    },
    addressId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingArea: false,
      loadingCities: false,
      loadingRegions: false,
      cities: [],
      regions: [],
    };
  },
  computed: {
    ...mapState('system', ['areaInfo']),
  },
  created() {
    if (!this.areaInfo.status) {
      this.loadingArea = true;
      this.getAreaInfoAsync()
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingArea = false;
        });
    }
    if (this.addressFirstId) {
      this.getCities(this.addressFirstId);
    }
    if (this.addressSecondId) {
      this.getRegions(this.addressSecondId);
    }
  },
  methods: {
    ...mapActions('system', [
      'getBasicInfoAsync',
      'getAreaInfoAsync',
      'getAreaRegionInfoAsync',
    ]),
    getCitiesByChange(v) {
      this.$emit('update:first', v);
      this.getCities(v, true);
    },
    getCities(addressFirstId, isChange) {
      this.loadingCities = true;
      if (isChange) {
        this.addressSecondId = '';
        this.addressId = '';
      }
      this.getAreaRegionInfoAsync({ dLevel: '2', parentId: addressFirstId })
        .then((res) => {
          this.cities = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingCities = false;
        });
    },
    getRegionsByChange(v) {
      this.$emit('update:second', v);
      this.getRegions(v, true);
    },
    getRegions(addressSecondId, isChange) {
      this.loadingRegions = true;
      if (isChange) {
        this.addressId = '';
      }
      this.getAreaRegionInfoAsync({ dLevel: '3', parentId: addressSecondId })
        .then((res) => {
          this.regions = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingRegions = false;
        });
    },
    getRegionByChange(v) {
      this.$emit('update:third', v);
    },
  },
};
</script>
