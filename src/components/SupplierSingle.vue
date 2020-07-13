<template>
  <v-dialog
    :value="show"
    persistent
    max-width="1000"
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
          <v-row>
            <v-col cols="6">
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
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="3"
                  class="text-right"
                >
                  <span class="error--text">*</span>负责人联系电话：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.mobile"
                    type="number"
                    :rules="mobileRules"
                    placeholder="请输入销售负责人联系电话"
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
                  <span class="error--text">*</span>法人：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.legalPerson"
                    :rules="legalPersonRules"
                    placeholder="请输入法人姓名"
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
                  主营商品：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.mainGoods"
                    placeholder="请输入主营商品"
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
                  成立时间：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.creationTime"
                    placeholder="请输入成立时间"
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
                  经营面积：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.businessArea"
                    placeholder="请输入经营面积"
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
                  年产值：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.annualOutputValue"
                    placeholder="请输入年产值"
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
                  品质：
                </v-col>
                <v-col cols="6">
                  <v-radio-group
                    v-model="supplier.quality"
                    row
                    hide-details
                    class="my-0"
                    dense
                  >
                    <v-radio
                      label="优"
                      color="primary"
                      value="1"
                    />
                    <v-radio
                      label="良"
                      color="primary"
                      value="2"
                    />
                    <v-radio
                      label="差"
                      color="primary"
                      value="3"
                    />
                  </v-radio-group>
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
                  <!-- <v-select
                    v-model="supplier.locked"
                    :items="locked"
                    placeholder="请选择是否启用"
                    dense
                    clearable
                    outlined
                    single-line
                    hide-details
                    no-data-text="暂无数据"
                  /> -->
                  <v-radio-group
                    v-model="supplier.locked"
                    row
                    hide-details
                    class="my-0"
                    dense
                  >
                    <v-radio
                      label="启用"
                      color="primary"
                      value="0"
                    />
                    <v-radio
                      label="停用"
                      color="primary"
                      value="1"
                    />
                  </v-radio-group>
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
                  目前销售渠道：
                </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="supplier.salesChannels"
                    :items="channels"
                    chips
                    placeholder="请选择销售渠道"
                    multiple
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
            </v-col>
            <v-col cols="6">
              <v-row
                align="center"
                class="mb-3"
              >
                <v-col
                  cols="3"
                  class="text-right"
                >
                  <span class="error--text">*</span>销售负责人：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.contacter"
                    placeholder="请输入销售负责人"
                    :rules="contacterRules"
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
                  法人联系电话：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.legalPersonPhone"
                    type="number"
                    placeholder="请输入法人联系电话"
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
                  同类价格情况：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.similarPrice"
                    placeholder="请输入同类价格情况"
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
                  QQ号码：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.qq"
                    type="number"
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
                  员工人数：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.employeesNum"
                    type="number"
                    placeholder="请输入员工人数"
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
                  专利情况：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.patentInformation"
                    placeholder="请输入专利情况"
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
                  生产设备情况：
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="supplier.productionEquipment"
                    placeholder="请输入生产设备情况"
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
                  包装：
                </v-col>
                <v-col cols="6">
                  <v-radio-group
                    v-model="supplier.packing"
                    row
                    hide-details
                    class="my-0"
                    dense
                  >
                    <v-radio
                      label="新颖"
                      color="primary"
                      value="1"
                    />
                    <v-radio
                      label="常规"
                      color="primary"
                      value="2"
                    />
                    <v-radio
                      label="独有"
                      color="primary"
                      value="3"
                    />
                  </v-radio-group>
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
                  经营性质：
                </v-col>
                <v-col cols="6">
                  <v-radio-group
                    v-model="supplier.businessNature"
                    row
                    hide-details
                    class="my-0"
                    dense
                  >
                    <v-radio
                      label="生产"
                      color="primary"
                      value="1"
                    />
                    <v-radio
                      label="贸易"
                      color="primary"
                      value="2"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
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
        packing: '1',
        quality: '1',
        businessNature: '1',
      },
      channels: [
        {
          text: '传统批发',
          value: '1',
        },
        {
          text: '连锁',
          value: '2',
        },
        {
          text: '商超',
          value: '3',
        },
        {
          text: '专卖',
          value: '4',
        },
        {
          text: '电商',
          value: '5',
        },
        {
          text: '直播',
          value: '6',
        },
      ],
      nameRules: [v => !!v || '请填写供应商名称'],
      legalPersonRules: [v => !!v || '请填写法人姓名'],
      // accountRules: [v => !!v || '请填写登陆账号'],
      // passwordRules: [v => !!v || '请填写登录密码'],
      contacterRules: [v => !!v || '请填写销售负责人'],
      // addressRules: [v => !!v || '请填写详细地址'],
      mobileRules: [v => !!v || '请输入负责人联系电话...'],
      // locked: [
      //   {
      //     text: '启用',
      //     value: '0',
      //   },
      //   {
      //     text: '停用',
      //     value: '1',
      //   },
      // ],
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
          packing: '1',
          quality: '1',
          businessNature: '1',
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
