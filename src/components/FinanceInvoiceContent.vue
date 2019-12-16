<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        {{ edit ? '编辑' : '添加' }}发票
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
              <span class="error--text">*</span>发票名称：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="invoice.dnames"
                :rules="nameRules"
                placeholder="请输入发票名称"
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
              <span class="error--text">*</span>税率：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="invoice.invoiceTax"
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
              <div>注：请输入税率</div> 例如：10为10%
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
              发票类型：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="invoice.isAdded"
                :items="defaultOptions"
                single-line
                hide-details
                dense
                outlined
                clearable
                no-data-text="暂无数据"
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
          @click="addOrEditInvoice"
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
  name: 'InvoiceContent',
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
      invoice: {
        isAdded: '0',
      },
      defaultOptions: [
        {
          text: '增值税发票',
          value: '1',
        },
        {
          text: '普通发票',
          value: '0',
        },
      ],
      nameRules: [v => !!v || '请填写发票名称'],
      rateRules: [
        v => !!v || '请填写税率',
        v => v >= 0 || '税率不能小于0',
        v => v <= 100 || '税率不能大于100',
      ],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.invoice = R.clone(this.target);
      } else {
        this.invoice = {
          isAdded: '0',
        };
      }
    },
  },
  methods: {
    ...mapActions('finance', ['addEditInvoiceAsync']),
    addOrEditInvoice() {
      this.submitting = true;
      this.addEditInvoiceAsync({ ...this.invoice, edit: this.edit })
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
