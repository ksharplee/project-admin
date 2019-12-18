<template>
  <div>
    <div class="title">
      基本信息设置
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
          <v-row>
            <v-col
              cols="12"
              md="4"
              lg="3"
              xl="2"
              class="text-right"
            >
              <img-upload
                :image="info.logo ? info.logo : require('@/assets/imgWaiting.png')"
                placeholder="请上传LOGO图片"
                icon-size="48px"
                :show-input="true"
                @update:src="info.logo = $event"
                @update:delete="info.logo = ''"
              />
            </v-col>
            <v-col
              rows="12"
              md="8"
              lg="9"
              xl="10"
            >
              <v-row class="mb-3">
                <v-col
                  cols="12"
                  lg="6"
                  xl="4"
                  class="text-right"
                >
                  <div class="input-group">
                    <div class="input-group-prepend large">
                      <span class="input-group-text required">公司名称</span>
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
                        hide-details
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
                    <div class="input-group-prepend large">
                      <span class="input-group-text">联系人</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="info.contacts"
                        placeholder="请输入联系人"
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
                  lg="6"
                  xl="4"
                  class="text-right"
                >
                  <div class="input-group">
                    <div class="input-group-prepend large">
                      <span class="input-group-text">联系电话</span>
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
                        hide-details
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
                    <div class="input-group-prepend large">
                      <span class="input-group-text required">地区</span>
                    </div>
                    <div class="input-group-control">
                      <v-row no-gutters>
                        <v-col cols="4">
                          <v-select
                            v-model="info.addressFirstId"
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
                            v-model="info.addressSecondId"
                            :items="cities"
                            :loading="loadingCities"
                            :disabled="!info.addressFirstId || loadingCities"
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
                            v-model="info.addressId"
                            :items="regions"
                            :loading="loadingRegions"
                            :disabled="!info.addressSecondId || loadingRegions"
                            class="rounded-left-0"
                            item-text="areaName"
                            item-value="id"
                            single-line
                            dense
                            outlined
                            placeholder="区"
                            no-data-text="暂无数据"
                            hide-details
                          />
                        </v-col>
                      </v-row>
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
                    <div class="input-group-prepend large">
                      <span class="input-group-text required">详细地址</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="info.addressPart"
                        :rules="addressRules"
                        placeholder="请输入详细地址"
                        hide-details
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
                    <div class="input-group-prepend large">
                      <span class="input-group-text">短信服务平台</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="info.smServer"
                        placeholder="请输入短信服务平台"
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
                  lg="6"
                  xl="4"
                  class="text-right"
                >
                  <div class="input-group">
                    <div class="input-group-prepend large">
                      <span class="input-group-text">短信宝账号</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="info.smAccount"
                        placeholder="请输入短信宝账号"
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
                  lg="6"
                  xl="4"
                  class="text-right"
                >
                  <div class="input-group">
                    <div class="input-group-prepend large">
                      <span class="input-group-text">短信宝密码</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="info.smPassword"
                        placeholder="请输入短信宝密码"
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
              </v-row>
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
import ImgUpload from '@/components/ImgUpload.vue';

export default {
  name: 'SystemBasicInfo',
  components: { ImgUpload },
  data() {
    return {
      valid: true,
      submitting: false,
      loadingCities: false,
      loadingRegions: false,
      info: {
        logo: '',
        image: '',
        addressSecondId: '',
        addressId: '',
        addressFirstId: '',
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
      this.getBasicInfo();
    } else {
      this.info = R.defaultTo(
        {
          logo: '',
          image: '',
          addressSecondId: '',
          addressId: '',
          addressFirstId: '',
        },
        R.head(this.basicInfo.data)
      );
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
    getBasicInfo() {
      this.$store.commit('START_LOADING');
      this.getBasicInfoAsync()
        .then(() => {
          this.info = R.defaultTo(
            {
              logo: '',
              image: '',
              addressSecondId: '',
              addressId: '',
              addressFirstId: '',
            },
            R.head(this.basicInfo.data)
          );
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
    },
    addOrEditBasicInfo() {
      this.submitting = true;
      this.addOrEditBasicInfoAsync(this.info)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，修改成功!',
          });
          this.getBasicInfo();
        })
        .catch((err) => {
          this.checkErr(err, 'addOrEditBasicInfo');
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
          this.checkErr(err, 'getCities');
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
          this.checkErr(err, 'getRegions');
        })
        .finally(() => {
          this.loadingRegions = false;
        });
    },
  },
};
</script>
