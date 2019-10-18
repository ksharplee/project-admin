<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        {{ edit ? '编辑' : '添加' }}等级
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
              <span class="error--text">*</span>等级名称：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="grade.dnames"
                :rules="nameRules"
                placeholder="请输入等级名称"
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
              <span class="error--text">*</span>折扣率：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="grade.rebate"
                :rules="rateRules"
                type="number"
                placeholder="请输入折扣率"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
            <v-col class="error--text">
              <div>注：请输入百分比</div> 例如：80为8折
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
              设为默认等级：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="grade.default"
                :items="defaultOptions"
                single-line
                dense
                outlined
                clearable
                no-data-text="暂无数据"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="primary"
          :loading="submitting"
          :disabled="submitting || !valid"
          @click="addOrEditCustomerGrade"
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
  name: 'CustomerSingle',
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
      disallowChangePassword: false,
      submitting: false,
      grade: {
        default: '0',
      },
      defaultOptions: [
        {
          text: '是',
          value: '1',
        },
        {
          text: '否',
          value: '0',
        },
      ],
      nameRules: [v => !!v || '请填写等级名称'],
      rateRules: [
        v => !!v || '请填写等级折扣率',
        v => v >= 0 || '等级折扣率不能小于0',
        v => v <= 100 || '等级折扣率不能大于100',
      ],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.grade = R.clone(this.target);
        this.disallowChangePassword = true;
      } else {
        this.grade = {
          default: '0',
        };
        this.disallowChangePassword = false;
      }
    },
  },
  methods: {
    ...mapActions('customer', ['addOrEditCustomerGradeAsync']),
    addOrEditCustomerGrade() {
      this.submitting = true;
      this.addOrEditCustomerGradeAsync(this.grade)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
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
