<template>
  <v-dialog
    :value="show"
    persistent
    max-width="750"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加收货地址
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
              <span class="error--text">*</span>收货人：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="shipping.contacter"
                :rules="nameRules"
                placeholder="请输入收货人"
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
              <span class="error--text">*</span>手机号码：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="shipping.mobile"
                :rules="phoneRules"
                type="number"
                placeholder="请输入手机号码"
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
              设为默认：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="shipping.isDefault"
                :items="defaultOptions"
                dense
                single-line
                outlined
                clearable
                no-data-text="暂无数据"
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
              国家：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="shipping.countryId"
                :items="country.data"
                :item-text="getCountryName"
                item-value="id"
                dense
                single-line
                outlined
                clearable
                no-data-text="暂无数据"
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
              <span class="error--text">*</span>详细地址：
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model="shipping.addressPart"
                :rules="addressRules"
                placeholder="请输入详细地址"
                outlined
                dense
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
          @click="addOrEditCustomerShipping"
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ShippingSingle',
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
    buyerId: {
      type: String,
      default: '',
    },
    buyerUid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: true,
      submitting: false,
      shipping: {
        isDefault: '0',
        addressFirstId: '',
        addressSecondId: '',
        addressId: '',
      },
      nameRules: [v => !!v || '请填写收货人'],
      addressRules: [v => !!v || '请填写详细地址'],
      phoneRules: [
        v => !!v || '请输入手机号码...',
        v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误',
      ],
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
    };
  },
  computed: {
    ...mapState('system', ['country']),
  },
  watch: {
    show() {
      if (this.edit) {
        this.shipping = R.clone(this.target);
      } else {
        this.shipping = {
          isDefault: '0',
        };
      }
    },
  },
  created() {
    if (!this.country.status) {
      this.getCountryListAsync().catch((err) => {
        this.checkErr(err, 'getCountryList');
      });
    }
  },
  methods: {
    ...mapActions('customer', ['addOrEditCustomerShippingAsync']),
    ...mapActions('system', ['getCountryListAsync']),
    getCountryName(item) {
      return `${item.dnames}(${item.dnamesEn})`;
    },
    addOrEditCustomerShipping() {
      this.submitting = true;
      const params = this.shipping;
      params.addressId = this.shipping.countryId;
      this.addOrEditCustomerShippingAsync({
        buyerId: this.buyerId,
        buyerUid: this.buyerUid,
        ...params,
        edit: this.edit,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.$emit('update:reload');
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
