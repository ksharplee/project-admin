<template>
  <div>
    <div class="title">
      {{ id ? '编辑员工' : '添加员工' }}
    </div>

    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card
        outlined
        elevation-1
      >
        <v-container fluid>
          <v-row>
            <v-col
              cols="12"
              md="4"
              lg="3"
              xl="2"
              class="pt-4"
            >
              <img-upload
                :image="employee.logo"
                icon-size="48px"
                :show-input="true"
                placeholder="员工头像"
                @update:src="employee.logo = $event"
                @update:delete="employee.logo = ''"
              />
            </v-col>
            <v-col
              cols="12"
              md="8"
              lg="9"
              xl="10"
            >
              <v-row>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">用&nbsp;&nbsp;户&nbsp;&nbsp;名</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.account"
                        :rules="accountRules"
                        placeholder="请输入用户名"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text "
                        :class="id ? '' : 'required'"
                      >登录密码</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.passwords"
                        :rules="id ? [] : passwordRules"
                        placeholder="请输入登录密码"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">员工姓名</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.userName"
                        :rules="nameRules"
                        placeholder="请输入员工姓名"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">手机号码</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.mobile"
                        :rules="phoneRules"
                        type="number"
                        placeholder="请输入手机号码"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">入职时间</span>
                    </div>
                    <div class="input-group-control">
                      <v-menu
                        ref="menuEntry"
                        v-model="menuEntry"
                        :close-on-content-click="false"
                        :return-value.sync="employee.entryTime"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="employee.entryTime"
                            :rules="entryTimeRules"
                            placeholder="请选择入职时间"
                            append-icon="mdi-calendar-import"
                            readonly
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                            dense
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="employee.entryTime"
                          color="primary"
                          scrollable
                        >
                          <div class="flex-grow-1" />
                          <v-btn
                            text
                            color="primary"
                            @click="menuEntry = false"
                          >
                            取消
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menuEntry.save(employee.entryTime)"
                          >
                            确定
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">身份证号</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.idCode"
                        :rules="idRules"
                        placeholder="请输入身份证号"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">员工籍贯</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.birthplace"
                        :rules="locationRules"
                        placeholder="请输入员工籍贯"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">员工性别</span>
                    </div>
                    <div class="input-group-control">
                      <v-select
                        v-model="employee.sex"
                        :items="sexOptions"
                        :rules="sexRules"
                        placeholder="请选择员工性别"
                        single-line
                        hide-details
                        dense
                        outlined
                        clearable
                        no-data-text="暂无数据"
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">出生日期</span>
                    </div>
                    <div class="input-group-control">
                      <v-menu
                        ref="menuBirth"
                        v-model="menuBirth"
                        :close-on-content-click="false"
                        :return-value.sync="employee.birthDay"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="employee.birthDay"
                            placeholder="请选择出生日期"
                            append-icon="mdi-calendar-import"
                            readonly
                            outlined
                            clearable
                            required
                            single-line
                            hide-details
                            dense
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="employee.birthDay"
                          color="primary"
                          scrollable
                        >
                          <div class="flex-grow-1" />
                          <v-btn
                            text
                            color="primary"
                            @click="menuBirth = false"
                          >
                            取消
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menuBirth.save(employee.birthDay)"
                          >
                            确定
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">员工学历</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.educational"
                        placeholder="请输入员工学历"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">毕业院校</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.collage"
                        placeholder="请输入毕业院校"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">员工专业</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.speciality"
                        placeholder="请输入员工专业"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">家庭地址</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.homeAddress"
                        placeholder="请输入家庭地址"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">现住地址</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="employee.nowAddress"
                        placeholder="请输入现住地址"
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">员工状态</span>
                    </div>
                    <div class="input-group-control">
                      <v-select
                        v-model="employee.locked"
                        :items="lockedOptions"
                        placeholder="请选择员工状态"
                        single-line
                        hide-details
                        dense
                        outlined
                        clearable
                        no-data-text="暂无数据"
                      />
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="12"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">所属部门</span>
                    </div>
                    <div class="input-group-control">
                      <v-menu
                        v-model="showMenu"
                        offset-y
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-textarea
                            :placeholder="postDepartmentsLocal.length ? '' : '请选择部门'"
                            :loading="loadingDepartment"
                            single-line
                            outlined
                            dense
                            rows="1"
                            auto-grow
                            readonly
                            append-icon="mdi-menu-down"
                            hide-details
                            class="custom-text-area"
                            v-on="on"
                          >
                            <template v-slot:prepend-inner>
                              <v-chip
                                v-for="item in postDepartmentsLocal"
                                :key="item.id"
                                close
                                small
                                class="mr-2 mb-2"
                                @click:close="deletePostDepartment(item.id)"
                              >
                                {{ item.dnames }}
                              </v-chip>
                            </template>
                          </v-textarea>
                        </template>
                        <v-card>
                          <v-card-text class="custom-treeview-class">
                            <v-treeview
                              v-if="departmentList && departmentList.length"
                              :items="departmentList"
                              :active="employee.sectionId ? employee.sectionId : []"
                              item-text="dnames"
                              item-key="id"
                              activatable
                              multiple-active
                              dense
                              active-class="active-treenode"
                              @update:active="returnActiveDepartments"
                            />
                            <div
                              v-else
                              class="py-4 grey--text text-center"
                            >
                              {{ loadingDepartment ? '加载中...' : '暂无部门信息' }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </div>
                  </div>
                </v-col>
                <v-col
                  rows="12"
                  md="12"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">员工特长</span>
                    </div>
                    <div class="input-group-control">
                      <v-textarea
                        v-model="employee.speciality"
                        placeholder="请输入员工特长"
                        outlined
                        single-line
                        hide-details
                        dense
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-btn
        :loading="submitting"
        :disabled="!valid || submitting || !employee.sectionId || !employee.sectionId.length"
        color="primary"
        large
        class="px-12 body-1 my-4"
        @click="addOrEditEmployee"
      >
        提交
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import * as R from 'ramda';
import md5 from 'md5';
import ImgUpload from '@/components/ImgUpload.vue';

export default {
  name: 'SystemEmployeeSingle',
  components: { ImgUpload },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: true,
      submitting: false,
      menuEntry: false,
      menuBirth: false,
      showMenu: false,
      postDepartments: [],
      employee: {
        logo: '',
        locked: '0',
        sex: '1',
        sectionId: [],
      },
      loadingDepartment: false,
      sexOptions: [
        {
          text: '男',
          value: '1',
        },
        {
          text: '女',
          value: '0',
        },
      ],
      lockedOptions: [
        {
          text: '停用',
          value: '1',
        },
        {
          text: '启用',
          value: '0',
        },
      ],
      accountRules: [v => !!v || '请填写用户名'],
      passwordRules: [v => !!v || '请填写登录密码'],
      nameRules: [v => !!v || '请填写员工姓名'],
      locationRules: [v => !!v || '请填写员工籍贯'],
      phoneRules: [
        v => !!v || '请输入联系电话...',
        v => /^1[3456789]\d{9}$/.test(v) || '手机号码格式有误',
      ],
      entryTimeRules: [v => !!v || '请选择入职时间'],
      sexRules: [v => !!v || '请选择员工性别'],
      idRules: [
        v => !!v || '请填写身份证号',
        v => /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          v
        ) || '身份证号码格式有误',
      ],
    };
  },
  computed: {
    ...mapState('system', ['employeeList']),
    ...mapState('authority', ['departmentList', 'departmentAll']),
    ...mapGetters('authority', ['postDepartmentsFilter']),
    postDepartmentsLocal() {
      return this.postDepartmentsFilter(
        this.employee.sectionId ? this.employee.sectionId : []
      );
    },
  },
  created() {
    this.$store.commit('SET_BREADCRUMBS', [
      {
        text: '首页',
        disabled: false,
        to: { name: 'home' },
        exact: true,
      },
      {
        text: '员工列表',
        disabled: false,
        to: { name: 'employee_list' },
        exact: true,
      },
      {
        text: this.id ? '编辑员工' : '添加员工',
        disabled: true,
        exact: true,
      },
    ]);
    if (this.id) {
      this.$store.commit('START_LOADING');
      if (!this.departmentList) {
        this.loadingDepartment = true;
        this.getDepartmentListAsync()
          .then(() => {
            this.getEmployeeSingle({ id: this.id });
          })
          .catch((err) => {
            this.checkErr(err, 'getDepartmentList');
          })
          .finally(() => {
            this.loadingDepartment = false;
          });
      } else {
        this.getEmployeeSingle({ id: this.id });
      }
    } else if (!this.departmentList) {
      this.$store.commit('START_LOADING');
      this.loadingDepartment = true;
      this.getDepartmentListAsync()
        .catch((err) => {
          this.checkErr(err, 'getDepartmentList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDepartment = false;
        });
    }
  },
  methods: {
    ...mapActions('system', [
      'addOrEditEmployeeAsync',
      'getEmployeeSingleAsync',
    ]),
    ...mapActions('authority', ['getDepartmentListAsync']),
    deletePostDepartment(id) {
      this.$set(
        this.employee,
        'sectionId',
        R.without([id], this.employee.sectionId)
      );
      // this.postDepartments = R.without([id], this.postDepartments);
    },
    returnActiveDepartments(v) {
      this.$set(this.employee, 'sectionId', v);
      // this.postDepartments = v;
    },
    // 添加/编辑员工
    addOrEditEmployee() {
      const postData = this.employee;
      if (!postData.sectionId || !postData.sectionId.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请选择员工所属部门',
        });
        return;
      }
      this.submitting = true;
      if (postData.passwords) {
        postData.passwords = md5(this.employee.passwords);
      }
      if (this.id) {
        postData.edit = true;
      } else {
        postData.add = true;
      }
      this.addOrEditEmployeeAsync(postData)
        // this.addOrEditEmployeeAsync(this.employee)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.$router.replace({ name: 'employee_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'addOrEditEmployee');
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 获取员工详情
    getEmployeeSingle(params) {
      this.getEmployeeSingleAsync(params)
        .then((res) => {
          this.employee = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
  },
};
</script>
