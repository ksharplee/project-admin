<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        {{ edit ? '编辑' : '添加' }}银行
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
              <v-text-field
                v-model="bank.dnames"
                :rules="nameRules"
                placeholder="请输入银行名称"
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
              银行LOGO：
            </v-col>
            <v-col cols="6">
              <img-upload
                :image="bank.logo"
                icon-size="48px"
                @update:src="bank.logo = $event"
                @update:delete="bank.logo = ''"
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
          @click="addOrEditBank"
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
  name: 'FinanceBankSingle',
  components: {
    ImgUpload,
  },
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
      bank: {
        logo: '',
      },
      nameRules: [v => !!v || '请填写银行名称'],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.bank = R.clone(this.target);
        if (!this.bank.logo) {
          this.bank.logo = require('@/assets/imgWaiting.png');
        }
      } else {
        this.bank = {
          logo: '',
        };
      }
    },
  },
  methods: {
    ...mapActions('finance', ['addOrEditBankAsync']),
    addOrEditBank() {
      this.submitting = true;
      this.addOrEditBankAsync({ ...this.bank, edit: this.edit })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.$emit('close-dialog');
        })
        .catch((err) => {
          this.checkErr(err, 'addOrEditBank');
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
};
</script>
