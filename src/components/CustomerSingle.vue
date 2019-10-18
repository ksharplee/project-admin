<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        分配客户
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
              <span class="error--text">*</span>用户名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.account"
                :rules="accountRules"
                :disabled="edit"
                placeholder="请输入用户名"
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
              <span class="error--text">*</span>姓名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.dnames"
                :rules="nameRules"
                placeholder="请输入姓名"
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
              <span class="error--text">*</span>手机号：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.mobile"
                :rules="phoneRules"
                type="number"
                placeholder="请输入手机号"
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
          color="primary"
          :loading="submitting"
          :disabled="submitting || !valid"
          @click="addCustomer"
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
      customer: {},
      nameRules: [v => !!v || '请填写客户姓名'],
      accountRules: [v => !!v || '请填写用户名'],
      phoneRules: [
        v => !!v || '请输入联系电话...',
        v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误',
      ],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.customer = R.clone(this.target);
        this.disallowChangePassword = true;
      } else {
        this.customer = {};
        this.disallowChangePassword = false;
      }
    },
  },
  methods: {
    ...mapActions('customer', ['addOrEditCustomerAsync']),
    addCustomer() {
      this.submitting = true;
      this.addOrEditCustomerAsync(this.customer)
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
