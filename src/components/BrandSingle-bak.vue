<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加品牌
      </v-card-title>
      <v-card-text class="pt-4 black--text body-1">
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <img-upload
                placeholder="请上传品牌图片"
                icon-size="48px"
                :show-input="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">品牌名称</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="brand.name"
                    :rules="nameRules"
                    placeholder="请输入品牌名称"
                    clearable
                    hide-details
                    single-line
                    dense
                    outlined
                    required
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">是否启用</span>
                </div>
                <div class="input-group-control">
                  <v-select
                    :items="isUse"
                    placeholder="请选择是否启用"
                    clearable
                    outlined
                    hide-details
                    single-line
                    dense
                    return-object
                    no-data-text="暂无数据"
                  />
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&nbsp;&nbsp;排&nbsp;&nbsp;&nbsp;&nbsp;序&nbsp;&nbsp;</span>
                </div>
                <div class="input-group-control">
                  <v-text-field
                    v-model="brand.sort"
                    placeholder="请输入排序"
                    clearable
                    outlined
                    hide-details
                    single-line
                    dense
                    required
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">品牌名称</span>
                </div>
                <div class="input-group-control">
                  <v-textarea
                    placeholder="请输入品牌描述"
                    outlined
                    hide-details
                    single-line
                    dense
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          :disabled="!valid"
          color="primary"
          @click="dialog = false"
        >
          提交
        </v-btn>
        <v-btn
          color="secondary"
          @click="$emit('close-dialog')"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import ImgUpload from '@/components/ImgUpload.vue';

export default {
  name: 'BrandSingle',
  components: { ImgUpload },
  props: {
    id: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      brand: {},
      isUse: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '2',
          text: '否',
        },
      ],
      nameRules: [v => !!v || '请填写品牌名称'],
    };
  },
  created() {},
  methods: {},
};
</script>
