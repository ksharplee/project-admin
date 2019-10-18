<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        {{ edit ? '编辑' : '添加' }}支付方式
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
              <span class="error--text">*</span>名称：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="payment.bankId"
                :items="bankList.data"
                :loading="loadingBankItems"
                placeholder="请选择支付方式"
                item-text="dnames"
                item-value="id"
                dense
                single-line
                hide-details
                outlined
                clearable
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
              <span class="error--text">*</span>手续费：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="payment.fee"
                :rules="rateRules"
                type="number"
                placeholder="请输入税率"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
            <v-col class="error--text">
              <div>额外费用</div> 例如：增加5%，请直接填数字5
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
              是否使用：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="payment.isUse"
                :items="options"
                placeholder="请选择是否使用"
                dense
                single-line
                hide-details
                outlined
                clearable
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
              说明：
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model="payment.desc"
                placeholder="请输入说明"
                outlined
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
              <span class="error--text">*</span>开户姓名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="payment.dnames"
                :rules="nameRules"
                placeholder="请输入开户姓名"
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
              <span class="error--text">*</span>账户：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="payment.account"
                :rules="accountRules"
                placeholder="请输入账户"
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
              <span class="error--text">*</span>开户行名称：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="payment.bankName"
                placeholder="请输入开户行名称"
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
          @click="addEditPayment"
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

export default {
  name: 'FinancePaymentSingle',
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
      loadingBankItems: false,
      payment: {
        isUse: '1',
      },
      nameRules: [v => !!v || '请填写开户姓名'],
      accountRules: [v => !!v || '请填写开户账号'],
      rateRules: [
        v => !!v || '请填写税率',
        v => v >= 0 || '税率不能小于0',
        v => v <= 100 || '税率不能大于100',
      ],
      options: [
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
    ...mapState('finance', ['bankList']),
  },
  watch: {
    show() {
      if (this.edit) {
        this.payment = R.clone(this.target);
      } else {
        this.payment = {
          isUse: '1',
        };
      }
    },
  },
  created() {
    // if (!this.bankList.status) {
    this.$store.commit('START_LOADING');
    this.getBankList();
    // }
  },
  methods: {
    ...mapActions('finance', ['addEditPaymentAsync', 'getBankListAsync']),
    getBankList(params) {
      this.loadingBankItems = true;
      this.getBankListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingBankItems = false;
        });
    },
    addEditPayment() {
      this.submitting = true;
      this.addEditPaymentAsync(this.payment)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.$emit('close-dialog');
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
};
</script>
