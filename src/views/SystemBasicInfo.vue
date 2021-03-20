<template>
  <div>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title class="title grey lighten-3 pa-4">
          基本信息
        </v-card-title>
        <v-card-text class="pt-4">
          <v-container
            fluid
            class="pa-0 mb-4"
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
                    <span class="input-group-text required">LOGO</span>
                  </div>
                  <div class="input-group-control">
                    <img-upload-input
                      :image="info.logo ? info.logo : require('@/assets/imgWaiting.png')"
                      @update:src="$set(info, 'logo', $event)"
                      @update:delete="$set(info, 'logo', '')"
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
                    <span class="input-group-text required">公司英文名称</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.companyEn"
                      :rules="companyRules"
                      placeholder="请输入公司英文名称"
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
                    <span class="input-group-text">联系人英文名</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.contactsEn"
                      placeholder="请输入联系人英文名"
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
                    <span class="input-group-text">固定电话</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.tel"
                      placeholder="请输入固定电话"
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
                    <span class="input-group-text">手机号码</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.mobile"
                      type="number"
                      placeholder="请输入手机号码"
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
                    <span class="input-group-text">Email</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.email"
                      placeholder="请输入Email地址"
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
                    <span class="input-group-text required">英文详细地址</span>
                  </div>
                  <div class="input-group-control">
                    <v-text-field
                      v-model="info.addressPartEn"
                      :rules="addressRules"
                      placeholder="请输入英文详细地址"
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
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title class="title grey lighten-3 pa-4">
          关于我们
        </v-card-title>
        <v-card-text class="pt-4">
          <v-container
            fluid
            class="pa-0"
          >
            <v-row
              class="mb-3"
            >
              <v-col
                cols="12"
                lg="6"
                xl="4"
                class="text-right"
              >
                <div class="input-group align-start">
                  <div class="input-group-prepend large pt-3">
                    <span class="input-group-text">简述</span>
                  </div>
                  <div class="input-group-control">
                    <v-textarea
                      v-model="info.aboutSummary"
                      placeholder="请输入关于我们简述"
                      outlined
                      required
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
                <div class="input-group align-start">
                  <div class="input-group-prepend large pt-3">
                    <span class="input-group-text">英文简述</span>
                  </div>
                  <div class="input-group-control">
                    <v-textarea
                      v-model="info.aboutSummaryEn"
                      placeholder="请输入关于我们英文简述"
                      outlined
                      required
                      hide-details
                      dense
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                lg="6"
              >
                <v-card
                  outlined
                  elevation="0"
                >
                  <v-card-title class="pa-3 grey lighten-3 title">
                    关于我们详情
                  </v-card-title>
                  <component
                    :is="componentAboutUs"
                    :content="info.aboutUs"
                    @update:html="info.aboutUs = $event"
                  />
                </v-card>
              </v-col>
              <v-col
                cols="12"
                lg="6"
              >
                <v-card
                  outlined
                  elevation="0"
                >
                  <v-card-title class="pa-3 grey lighten-3 title">
                    关于我们英文详情
                  </v-card-title>
                  <component
                    :is="componentAboutUsEn"
                    :content="info.aboutUsEn"
                    @update:html="info.aboutUsEn = $event"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title class="title grey lighten-3 pa-4">
          联系我们
        </v-card-title>
        <v-card-text class="pt-4">
          <v-container
            fluid
            class="pa-0"
          >
            <v-row>
              <v-col
                cols="12"
                lg="6"
              >
                <v-card
                  outlined
                  elevation="0"
                >
                  <v-card-title class="pa-3 grey lighten-3 title">
                    详情
                  </v-card-title>
                  <component
                    :is="componentContactUs"
                    :content="info.contactUs"
                    @update:html="info.contactUs = $event"
                  />
                </v-card>
              </v-col>
              <v-col
                cols="12"
                lg="6"
              >
                <v-card
                  outlined
                  elevation="0"
                >
                  <v-card-title class="pa-3 grey lighten-3 title">
                    英文详情
                  </v-card-title>
                  <component
                    :is="componentContactUsEn"
                    :content="info.contactUsEn"
                    @update:html="info.contactUsEn = $event"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-btn
        :loading="submitting"
        :disabled="submitting"
        color="primary"
        large
        class="px-12 body-1 mr-2 mb-4"
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
import WangEditor from '@/components/WangEditor.vue';
import ImgUploadInput from '@/components/ImgUploadInput.vue';

export default {
  name: 'SystemBasicInfo',
  components: { ImgUploadInput },
  data() {
    return {
      componentAboutUs: null,
      componentAboutUsEn: null,
      componentContactUs: null,
      componentContactUsEn: null,
      valid: true,
      submitting: false,
      loadingCities: false,
      loadingRegions: false,
      info: {
        logo: '',
        image: '',
        isLoginStatus: '0',
      },
      loadingArea: false,
      companyRules: [v => !!v || '请填写公司名称'],
      addressRules: [v => !!v || '请填写公司地址'],
      phoneRules: [
        v => (v && /^1[3456789]\d{9}$/.test(v)) || '手机号码格式有误',
      ],
      cities: [],
      regions: [],
      loginStatus: [
        {
          text: '是',
          value: '1',
        },
        {
          text: '否',
          value: '0',
        },
      ],
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
      this.componentAboutUs = WangEditor;
      this.componentAboutUsEn = WangEditor;
      this.componentContactUs = WangEditor;
      this.componentContactUsEn = WangEditor;
      if (this.info.addressSecondId && this.info.addressSecondId !== '0') {
        this.getCities(this.info.addressFirstId);
      }
      if (this.info.addressId && this.info.addressId !== '0') {
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
            },
            R.head(this.basicInfo.data)
          );
          this.componentAboutUs = WangEditor;
          this.componentAboutUsEn = WangEditor;
          this.componentContactUs = WangEditor;
          this.componentContactUsEn = WangEditor;
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
