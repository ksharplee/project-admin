<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      广告图设置
    </div>

    <v-expansion-panels
      v-if="!this.$store.state.loading"
      v-model="panels"
      focusable
      accordion
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="body-1">
          首页横幅
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(ad, i) in ads"
                  :key="ad.ad_id"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-card>
                    <img-upload
                      :image="ad.ad_code"
                      aspect-ratio="2.2"
                      @update:src="ad.ad_code = $event;"
                      @update:delete="deleteAd(i)"
                    />
                    <v-container fluid>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告链接</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.ad_link"
                            placeholder="请输入广告链接"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告名称</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.ad_name"
                            placeholder="请输入广告名称"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告排序</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.orderBy"
                            placeholder="请输入广告排序"
                            type="number"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                    </v-container>
                    <v-card-actions>
                      <v-btn
                        :disabled="!ad.ad_code"
                        color="primary"
                        class="ml-auto"
                        text
                        @click="dialogItem = ad;dialog = true"
                      >
                        查看大图
                      </v-btn>

                      <v-btn
                        color="secondary"
                        text
                        @click="deleteAd(i)"
                      >
                        删除
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-card>
                    <img-upload
                      :image="adToAdd.ad_code"
                      aspect-ratio="2.2"
                      icon-size="48px"
                      best-size="750px * 340px"
                      @update:src="adToAdd.ad_code = $event;addToAds()"
                      @update:delete="adToAdd.ad_code = '';"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions class="grey lighten-4">
              <v-btn
                :loading="addingAd"
                color="primary"
                large
                class="px-12 body-1 ml-auto"
                @click="setAds"
              >
                提交
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel
        v-for="(position, i) in otherAds"
        :key="position.position_id"
      >
        <v-expansion-panel-header class="body-1">
          {{ position.position_name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card elevation="0">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(ad, subIndex) in position.ads"
                  :key="ad.ad_id"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-card>
                    <img-upload
                      :image="ad.ad_code"
                      aspect-ratio="2.2"
                      @update:src="ad.ad_code = $event;"
                      @update:delete="deleteOtherAd(i,subIndex)"
                    />
                    <v-container fluid>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告链接</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.ad_link"
                            placeholder="请输入广告链接"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告名称</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.ad_name"
                            placeholder="请输入广告名称"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                      <div class="input-group my-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text">广告排序</span>
                        </div>
                        <div class="input-group-control">
                          <v-text-field
                            v-model="ad.orderBy"
                            placeholder="请输入广告排序"
                            type="number"
                            dense
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                          />
                        </div>
                      </div>
                    </v-container>
                    <v-card-actions>
                      <v-btn
                        :disabled="!ad.ad_code"
                        color="primary"
                        class="ml-auto"
                        text
                        @click="dialogItem = ad;dialog = true"
                      >
                        查看大图
                      </v-btn>

                      <v-btn
                        color="secondary"
                        text
                        @click="deleteOtherAd(i,subIndex)"
                      >
                        删除
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-card>
                    <img-upload
                      :image="adToAdd.ad_code"
                      aspect-ratio="2.2"
                      icon-size="48px"
                      best-size="750px * 340px"
                      @update:src="adToAdd.ad_code = $event;addToOtherAds(i)"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions class="grey lighten-4">
              <v-btn
                :loading="addingOtherAd"
                color="primary"
                large
                class="px-12 body-1 ml-auto"
                @click="setOtherAds(i)"
              >
                提交
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog
      v-model="dialog"
      fullscreen
      overlay-opacity="50"
    >
      <v-card
        dark
        style="background-color:rgba(0,0,0,.75)"
        class="height-100"
      >
        <div class="height-100 d-flex align-center justify-center">
          <div
            class="text-center"
            style="max-width: 80%;max-height:80%"
          >
            <img
              :src="dialogItem.ad_code"
              style="max-width: 100%;max-height:100%"
              alt=""
            >
            <div class="mt-4">
              <v-btn
                icon
                dark
                color="primary"
                @click="dialog = false"
              >
                <v-icon dark>
                  mdi-close-circle-outline mdi-48px
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';
import ImgUpload from '@/components/ImgUpload.vue';

export default {
  name: 'SystemAds',
  components: {
    ImgUpload,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
      dialogItem: {},
      ads: [],
      otherAds: [],
      adToAdd: {
        ad_code: '',
      },
      addingAd: false,
      addingOtherAd: false,
      panels: 0,
    };
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
        text: '广告图设置',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllAds();
  },
  methods: {
    ...mapActions('system', [
      'getAdsAsync',
      'setAdsAsync',
      'getOtherAdsAsync',
      'setOtherAdsAsync',
    ]),
    addToAds() {
      this.ads = R.append(this.adToAdd, this.ads);
      this.adToAdd = {
        ad_code: '',
      };
    },
    addToOtherAds(i) {
      this.$set(
        this.otherAds,
        i,
        R.assoc(
          'ads',
          R.append(this.adToAdd, this.otherAds[i].ads),
          this.otherAds[i]
        )
      );
      this.adToAdd = {
        ad_code: '',
      };
    },
    setAds() {
      this.addingAd = true;
      this.setAdsAsync({
        ads: this.ads,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.getAds();
        })
        .catch((err) => {
          this.checkErr(err, 'setAds');
          this.addingAd = false;
        });
    },
    setOtherAds(i) {
      this.addingOtherAd = true;
      this.setOtherAdsAsync([
        {
          pid: this.otherAds[i].position_id,
          ads: this.otherAds[i].ads,
        },
      ])
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.getOtherAds();
        })
        .catch((err) => {
          this.checkErr(err, 'setAds');
          this.addingOtherAd = false;
        });
    },
    async getAllAds() {
      this.$store.commit('START_LOADING');
      const ads = await this.getAdsAsync();
      const otherAds = await this.getOtherAdsAsync();
      this.ads = ads;
      this.otherAds = otherAds;
      this.$store.commit('END_LOADING');
    },
    getAds() {
      this.getAdsAsync()
        .then((res) => {
          this.ads = res;
        })
        .catch((err) => {
          this.checkErr(err, 'getAds');
        })
        .finally(() => {
          this.addingAd = false;
        });
    },
    getOtherAds() {
      this.getOtherAdsAsync()
        .then((res) => {
          this.otherAds = res;
        })
        .catch((err) => {
          this.checkErr(err, 'getOtherAds');
        })
        .finally(() => {
          this.addingOtherAd = false;
        });
    },
    deleteAd(i) {
      this.ads = R.remove(i, 1, this.ads);
    },
    deleteOtherAd(i, subIndex) {
      this.$set(
        this.otherAds,
        i,
        R.assoc(
          'ads',
          R.remove(subIndex, 1, this.otherAds[i].ads),
          this.otherAds[i]
        )
      );
    },
  },
};
</script>
