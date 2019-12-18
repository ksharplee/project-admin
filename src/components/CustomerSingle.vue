<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加客户
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
              <span class="error--text">*</span>手机号：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.mobile"
                :rules="phoneRules"
                :disabled="edit"
                type="number"
                placeholder="请输入手机号"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
                @blur="checkCustomerMobile"
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
              <span class="error--text">*</span>用户名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.account"
                :rules="accountRules"
                :disabled="edit || exist"
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
            v-if="!exist && !edit"
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              <span class="error--text">*</span>密码：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.passwords"
                :rules="passwordRules"
                :disabled="edit || !customer.mobile"
                placeholder="请输入密码"
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
              <span class="error--text">*</span>客户姓名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.dnames"
                :rules="nameRules"
                :disabled="!customer.mobile || exist"
                placeholder="请输入客户姓名"
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
              <span class="error--text">*</span>备注姓名：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="customer.buyerUserName"
                :rules="substituteNameRules"
                :disabled="!customer.mobile"
                placeholder="请输入备注姓名"
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
              <span class="error--text">*</span>客户部门：
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="showMenu"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="customer.sectionName"
                    placeholder="请选择部门"
                    single-line
                    outlined
                    dense
                    class="custom-text-area"
                    readonly
                    append-icon="mdi-menu-down"
                    hide-details
                    v-on="on"
                  />
                </template>
                <v-card>
                  <v-card-text class="custom-treeview-class">
                    <v-treeview
                      v-if="departmentList && departmentList.length"
                      :items="departmentList"
                      :active="[customer.sectionId]"
                      item-text="dnames"
                      item-key="id"
                      activatable
                      dense
                      active-class="active-treenode"
                      @update:active="returnActiveDepartment"
                    />
                    <div
                      v-else
                      class="py-4 grey--text text-center"
                    >
                      暂无部门信息
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
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
              客户等级：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="customer.gradeId"
                :items="customerGradeList.data"
                item-text="dnames"
                item-value="id"
                placeholder="请选择客户等级"
                dense
                class="white"
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
              部门员工：
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="customer.sellMenId"
                :items="employeeList"
                :loading="loadingEmployeeList"
                item-text="userNames"
                item-value="id"
                placeholder="请选择部门员工"
                dense
                class="white"
                single-line
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
import { mapState, mapGetters, mapActions } from 'vuex';

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
      showMenu: false,
      loadingEmployeeList: false,
      checkingMobile: false,
      disallowChangePassword: false,
      submitting: false,
      employeeList: [],
      customer: {},
      nameRules: [v => !!v || '请填写客户姓名'],
      substituteNameRules: [v => !!v || '请填写备注姓名'],
      accountRules: [v => !!v || '请填写用户名'],
      passwordRules: [v => !!v || '请填写密码'],
      phoneRules: [
        v => !!v || '请输入联系电话...',
        v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误',
      ],
      exist: false,
    };
  },
  computed: {
    ...mapState('customer', ['customerGradeList']),
    ...mapState('authority', ['departmentList', 'departmentAll']),
    ...mapGetters('authority', ['postDepartmentsFilter']),
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
    showMenu() {
      if (!this.showMenu) {
        this.getEmployeeList(this.customer.sectionId);
      }
    },
  },
  methods: {
    ...mapActions('customer', [
      'addOrEditCustomerAsync',
      'checkCustomerMobileAsync',
    ]),
    ...mapActions('system', ['getEmployeeListAsync']),
    getEmployeeList(id) {
      this.loadingEmployeeList = true;
      this.getEmployeeListAsync({ all: '1', sectionId: id }).then((res) => {
        this.employeeList = res;
      })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingEmployeeList = false;
        });
    },
    returnActiveDepartment(v) {
      this.$set(this.customer, 'sectionId', R.head(v));
      this.$set(
        this.customer,
        'sectionName',
        R.prop('dnames', R.head(this.postDepartmentsFilter([R.head(v)])))
      );
    },
    checkCustomerMobile() {
      this.checkingMobile = true;
      this.checkCustomerMobileAsync({ mobile: this.customer.mobile })
        .then((res) => {
          if (res.roleId) {
            this.customer = res.data;
            this.customer.dnames = res.data.userName;
            this.customer.id = '0';
            this.exist = true;
          }
        })
        .catch((err) => {
          this.checkErr(err, 'checkCustomerMobile');
        })
        .finally(() => {
          this.checkingMobile = false;
        });
    },
    addCustomer() {
      this.submitting = true;
      this.addOrEditCustomerAsync({ ...this.customer, edit: this.edit })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.$emit('close-dialog');
        })
        .catch((err) => {
          this.checkErr(err, 'addCustomer');
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
};
</script>
