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
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              <span class="red--text">*</span>品牌名称：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="brand.dnames"
                :rules="nameRules"
                placeholder="请输入品牌名称"
                outlined
                clearable
                required
                dense
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              品牌图片：
            </v-col>
            <v-col cols="5">
              <img-upload
                :image="brand.image ? brand.image : require('@/assets/imgWaiting.png')"
                icon-size="48px"
                @update:src="brand.image = $event"
                @update:delete="brand.image = ''"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              是否启用：
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="brand.isUse"
                :items="isUse"
                placeholder="请选择是否启用"
                clearable
                outlined
                dense
                single-line
                hide-details
                no-data-text="暂无数据"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              品牌描述：
            </v-col>
            <v-col cols="9">
              <v-textarea
                v-model="brand.desc"
                outlined
                value=""
                dense
                placeholder="请输入品牌描述"
                hide-details
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              排序：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="brand.sort"
                :rules="sortRules"
                type="number"
                dense
                placeholder="请输入排序"
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          :loading="submitting"
          :disabled="submitting"
          color="primary"
          @click="addOrEditProductBrand"
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
import { mapActions } from 'vuex';
import ImgUpload from '@/components/ImgUpload.vue';

export default {
  name: 'BrandSingle',
  components: { ImgUpload },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      valid: true,
      submitting: false,
      brand: {
        image: '',
      },
      isUse: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '0',
          text: '否',
        },
      ],
      nameRules: [v => !!v || '请填写品牌名称'],
      sortRules: [v => (v && v >= 0) || '排序不能小于0'],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.brand = R.clone(this.target);
      } else {
        this.brand = {};
      }
    },
  },
  created() {},
  methods: {
    ...mapActions('product', ['addOrEditBrandAsync']),
    addOrEditProductBrand() {
      this.submitting = true;
      this.addOrEditBrandAsync({ ...this.brand, edit: this.edit })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.brand = {
            image: '',
          };
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
          this.$emit('close-dialog');
        });
    },
  },
};
</script>
