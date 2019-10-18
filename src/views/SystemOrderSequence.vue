<template>
  <div>
    <div class="title">
      订单处理流程
    </div>
    <v-divider class="my-4" />
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-text class="pt-4 black--text body-1">
          <v-row class="mb-3">
            <v-col
              cols="12"
              lg="6"
              xl="4"
              class="text-right"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text required">&nbsp;&nbsp;&nbsp;&nbsp;公司名称&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="info.company"
                    :rules="companyRules"
                    placeholder="请输入公司名称"
                    outlined
                    clearable
                    required
                    single-line
                    dense
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              xl="4"
              class="text-right"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="info.contacts"
                    placeholder="请输入联系人"
                    outlined
                    clearable
                    required
                    single-line
                    dense
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              xl="4"
              class="text-right"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&nbsp;&nbsp;&nbsp;&nbsp;联系电话&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="info.mobile"
                    :rules="phoneRules"
                    type="number"
                    placeholder="请输入联系电话"
                    outlined
                    clearable
                    required
                    single-line
                    dense
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-btn
        :loading="submitting"
        :disabled="submitting"
        color="primary"
        class="px-12 body-1 mr-2"
        @click="addOrEditBasicInfo"
      >
        提交
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'SystemOrderSequenceInfo',
  data() {
    return {
      valid: true,
      submitting: false,
      loadingCities: false,
      loadingRegions: false,
      info: {
        image: '',
      },
      loadingArea: false,
      companyRules: [v => !!v || '请填写公司名称'],
      addressRules: [v => !!v || '请选择地区'],
      phoneRules: [
        v => (v && /^1[3456789]\d{9}$/.test(v)) || '手机号码格式有误',
      ],
      cities: [],
      regions: [],
    };
  },
  computed: {
    ...mapState('system', ['basicInfo', 'areaInfo']),
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
        text: '基本信息设置',
        disabled: true,
        exact: true,
      },
    ]);
    if (!this.basicInfo.status) {
      this.$store.commit('START_LOADING');
      this.getBasicInfoAsync()
        .then(() => {
          this.info = R.head(this.basicInfo.data);
          if (this.info.addressSecondId) {
            this.getCities(this.info.addressFirstId);
          }
          if (this.info.addressId) {
            this.getRegions(this.info.addressSecondId);
          }
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    } else {
      this.info = R.head(this.basicInfo.data);
      if (this.info.addressSecondId) {
        this.getCities(this.info.addressFirstId);
      }
      if (this.info.addressId) {
        this.getRegions(this.info.addressSecondId);
      }
    }
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
  },
  methods: {
    ...mapActions('system', [
      'getBasicInfoAsync',
      'addOrEditBasicInfoAsync',
      'getAreaInfoAsync',
      'getAreaRegionInfoAsync',
    ]),
    addOrEditBasicInfo() {
      this.submitting = true;
      this.addOrEditBasicInfoAsync(this.info)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，修改成功!',
          });
          this.info = R.head(this.basicInfo.data);
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
          this.$emit('close-dialog');
        });
    },
    getCitiesByChange(v) {
      this.getCities(v, true);
    },
    getCities(addressFirstId, isChange) {
      this.loadingCities = true;
      if (isChange) {
        this.info.addressSecondId = '';
        this.info.addressId = '';
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
      this.getRegions(v, true);
    },
    getRegions(addressSecondId, isChange) {
      this.loadingRegions = true;
      if (isChange) {
        this.info.addressId = '';
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
  },
};
</script>
