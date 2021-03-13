<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加热搜
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
              关键字：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="hotSearch.dnames"
                :rules="nameRules"
                placeholder="请输入热搜关键字"
                dense
                outlined
                clearable
                required
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
              是否首页显示：
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="hotSearch.isHot"
                :items="isHotOptions"
                placeholder="请选择是否首页显示"
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
              排序：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="hotSearch.sort"
                :rules="sortRules"
                type="number"
                placeholder="请输入排序"
                dense
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
          @click="addOrEditHotSearch"
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

export default {
  name: 'BrandSingle',
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
      hotSearch: {
        sort: '99',
        isHot: '0',
      },
      isHotOptions: [
        {
          value: '1',
          text: '是',
        },
        {
          value: '0',
          text: '否',
        },
      ],
      nameRules: [v => !!v || '请填写热搜关键字'],
      sortRules: [v => (v && v >= 0) || '排序不能小于0'],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.hotSearch = R.clone(this.target);
      } else {
        this.hotSearch = {
          sort: '99',
          isHot: '0',
        };
      }
    },
  },
  created() {},
  methods: {
    ...mapActions('product', ['addHotSearchAsync', 'editHotSearchAsync']),
    addHotSearch() {
      this.submitting = true;
      this.addHotSearchAsync({ ...this.hotSearch, edit: this.edit })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.hotSearch = {
            sort: '99',
            isHot: '0',
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
    editHotSearch() {
      this.submitting = true;
      this.editHotSearchAsync({ ...this.hotSearch })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.hotSearch = {
            sort: '99',
            isHot: '0',
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
    addOrEditHotSearch() {
      if (this.edit) {
        this.editHotSearch();
      } else {
        this.addHotSearch();
      }
    },
  },
};
</script>
