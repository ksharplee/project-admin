<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加单位
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
              中文名称：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="unit.dnames"
                :rules="nameRules"
                placeholder="请输入单位中文名称"
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
              英文名称：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="unit.enDnames"
                placeholder="请输入单位英文名称"
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
              排序：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="unit.sort"
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
          @click="addOrEditUnit"
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
      unit: {
        sort: '99',
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
      nameRules: [v => !!v || '请填写单位中文名称'],
      sortRules: [v => (v && v >= 0) || '排序不能小于0'],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.unit = R.clone(this.target);
      } else {
        this.unit = {
          sort: '99',
        };
      }
    },
  },
  created() {},
  methods: {
    ...mapActions('product', ['addOrEditUnitsAsync']),
    addOrEditUnit() {
      this.submitting = true;
      this.addOrEditUnitsAsync(this.unit)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.unit = {};
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
