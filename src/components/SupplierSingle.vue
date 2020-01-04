<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加供应商
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
              <span class="error--text">*</span>供应商名称：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.dnames"
                :rules="nameRules"
                placeholder="请输入供应商名称"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <!-- <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              <span class="error--text">*</span>登录账号：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.account"
                :rules="accountRules"
                placeholder="请输入登录账号"
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
              <span class="error--text">*</span>登录密码：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.passwords"
                :rules="disallowChangePassword ? [] : passwordRules"
                :disabled="disallowChangePassword"
                placeholder="请输入登录密码"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
                hint="请直接输入新密码提交修改"
              />
            </v-col>
            <v-col v-if="edit">
              <v-btn
                color="primary"
                text
                class="body-1"
                @click="disallowChangePassword = !disallowChangePassword;"
              >
                {{ disallowChangePassword ? '修改密码' : '放弃修改' }}
              </v-btn>
            </v-col>
          </v-row> -->
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              联系人：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.contacter"
                placeholder="请输入联系人"
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
              联系电话：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.mobile"
                type="number"
                placeholder="请输入联系电话"
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
              详细地址：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.addressPart"
                placeholder="请输入详细地址"
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
              微信账号：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.weChat"
                placeholder="请输入微信账号"
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
              是否启用：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="supplier.locked"
                :items="locked"
                placeholder="请选择是否启用"
                dense
                clearable
                outlined
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
              QQ号码：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="supplier.qq"
                placeholder="请输入QQ号码"
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
              描述：
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model="supplier.desce"
                outlined
                value=""
                dense
                placeholder="请输入描述"
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
          @click="addSupplier"
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
  name: 'SupplierSingle',
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
      supplier: {
        locked: '0',
      },
      nameRules: [v => !!v || '请填写供应商名称'],
      // accountRules: [v => !!v || '请填写登陆账号'],
      // passwordRules: [v => !!v || '请填写登录密码'],
      // contacterRules: [v => !!v || '请填写联系人'],
      // addressRules: [v => !!v || '请填写详细地址'],
      // phoneRules: [
      //   v => !!v || '请输入联系电话...',
      //   v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误',
      // ],
      locked: [
        {
          text: '启用',
          value: '0',
        },
        {
          text: '停用',
          value: '1',
        },
      ],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.supplier = R.clone(this.target);
        this.disallowChangePassword = true;
      } else {
        this.supplier = {
          locked: '0',
        };
        this.disallowChangePassword = false;
      }
    },
  },
  methods: {
    ...mapActions('supplier', ['addSupplierAsync']),
    addSupplier() {
      this.submitting = true;
      this.addSupplierAsync({ ...this.supplier, edit: this.edit })
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
