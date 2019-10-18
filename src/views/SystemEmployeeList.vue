<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      员工列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{ name: 'employee_add' }"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加员工
      </v-btn>
    </div>
    <v-divider class="my-4" />
    <v-form ref="form">
      <v-row class="mb-3">
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">员工姓名</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.userNames"
                placeholder="请输入员工姓名"
                outlined
                class="white"
                single-line
                dense
                clearable
                hide-details
                @click:clear="clearSearchByConditions('userNames')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">手机号码</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.mobile"
                placeholder="请输入手机号码"
                outlined
                single-line
                dense
                clearable
                class="white"
                hide-details
                @click:clear="clearSearchByConditions('mobile')"
              />
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="8"
          lg="6"
          xl="4"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">入职时间</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="search.startDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.startDate"
                    class="white rounded-right-0"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="search.startDate"
                  scrollable
                  color="primary"
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuStart = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuStart.save(search.startDate)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="input-group-innerpend">
              <span class="input-group-text">到</span>
            </div>
            <div class="input-group-control">
              <v-menu
                ref="menuEnd"
                v-model="menuEnd"
                :close-on-content-click="false"
                :return-value.sync="search.endDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="search.endDate"
                    class="white rounded-left-0"
                    outlined
                    single-line
                    dense
                    clearable
                    hide-details
                    append-icon="mdi-calendar-import"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="search.endDate"
                  :min="search.startDate"
                  color="primary"
                  scrollable
                >
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    color="primary"
                    @click="menuEnd = false"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuEnd.save(search.endDate)"
                  >
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          xl="2"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">员工状态</span>
            </div>
            <div class="input-group-control">
              <v-select
                v-model="search.locked"
                :items="lockedOptions"
                placeholder="请选择员工状态"
                class="white"
                single-line
                dense
                outlined
                clearable
                no-data-text="暂无数据"
                hide-details
                @click:clear="clearSearchByConditions('locked')"
              />
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchByConditions"
          >
            搜索
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="clearSearchAllConditions"
          >
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="employeeList.data.items"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
            >
              <td class="pa-3">
                <v-img
                  :src="item.logo ? `${item.logo}?x-oss-process=image/resize,m_fill,w_100,h_100` : require('@/assets/imgWaiting.png')"
                  aspect-ratio="1"
                  class="grey lighten-2 mx-auto"
                  max-width="65"
                  max-height="65"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </td>
              <td>{{ item.account }}</td>
              <td>{{ item.userNames }}</td>
              <td>{{ item.mobile }}</td>
              <td :class="item.locked === '0' ? 'success--text' : 'grey--text'">
                {{ item.locked === '0' ? '启用' : '停用' }}
              </td>
              <td>{{ item.entryTime | dateTruncate(16) }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="getEmployeeSingle({id:item.id})"
                    >
                      <v-icon color="primary">
                        mdi-cloud-search
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>查看详情</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      :to="{ name: 'employee_edit', params: { id: item.id }}"
                      v-on="on"
                    >
                      <v-icon color="teal">
                        mdi-pencil-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>编辑</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="dialogPassword = true;toChangePasswordEmployee = item"
                    >
                      <v-icon color="warning">
                        mdi-lock-reset
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>修改密码</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="dialogDelete = true;toDeleteEmployee = item"
                    >
                      <v-icon color="secondary">
                        {{ item.locked === '0' ? 'mdi-radiobox-blank' : 'mdi-radiobox-marked' }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ item.locked === '0' ? '停用' : '启用' }}</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
        <template v-slot:footer>
          <div
            v-if="employeeList.data.items.length"
            class="pa-4 grey lighten-5"
          >
            <div
              v-if="employeeList.status && employeeList.data.items.length"
              class="pa-4 grey lighten-5 d-flex align-center text-no-wrap"
            >
              <span>当前共有员工：<span class="error--text">{{ employeeList.data.totalItem }}</span></span>
              <v-pagination
                v-model="page"
                :length="pageCount"
                @input="changePagination"
              />
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定{{ toDeleteEmployee.locked === '0' ? '停用' : '启用' }}<span class="primary--text">{{ toDeleteEmployee.userNames }}</span>吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteEmployee"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogDelete = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogPassword"
      max-width="500"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          修改<span class="primary--text">{{ toChangePasswordEmployee.userNames }}</span>的登录密码
        </v-card-title>
        <v-card-text class="pt-6">
          <v-form v-model="valid">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text ">登录密码</span>
              </div>
              <div class="input-group-control">
                <v-text-field
                  v-model="toChangePasswordEmployee.passwords"
                  :rules="passwordRules"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="changingPassword"
            :disabled="changingPassword || !valid"
            @click="changeEmployeePassword"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogPassword = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDetail"
      max-width="650px"
      @click:outside="dialogDetail = false;employee = {}"
    >
      <v-card :loading="loadingDataDetail">
        <v-card-title class="title grey lighten-3 pa-4">
          员工<span
            v-if="employee.userName"
            class="primary--text"
          >{{ employee.userName }}</span><span v-else>...</span>详情
        </v-card-title>
        <v-container
          v-if="!loadingDataDetail"
          fluid
        >
          <v-row>
            <v-col cols="12">
              <v-row align="center">
                <v-col
                  cols="2"
                  class="grey--text text-right"
                >
                  员工头像：
                </v-col>
                <v-col cols="4">
                  <v-img
                    :src="employee.logo"
                    class="grey lighten-3"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        />
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  用户名：
                </v-col>
                <v-col cols="8">
                  {{ employee.account }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工姓名：
                </v-col>
                <v-col cols="8">
                  {{ employee.userName }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  手机号码：
                </v-col>
                <v-col cols="8">
                  {{ employee.mobile }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  入职时间：
                </v-col>
                <v-col cols="8">
                  {{ employee.entryTime }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  身份证号：
                </v-col>
                <v-col cols="8">
                  {{ employee.idCode }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工籍贯：
                </v-col>
                <v-col cols="8">
                  {{ employee.birthplace }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工性别：
                </v-col>
                <v-col cols="8">
                  {{ employee.sex === '0' ? '男' : '女' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工状态：
                </v-col>
                <v-col
                  cols="8"
                  :class="employee.locked === '0' ? 'success--text' : 'error--text'"
                >
                  {{ employee.locked === '0' ? '已启用' : '已停用' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  出生日期：
                </v-col>
                <v-col cols="8">
                  {{ employee.birthDay || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工学历：
                </v-col>
                <v-col cols="8">
                  {{ employee.educational || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  毕业院校：
                </v-col>
                <v-col cols="8">
                  {{ employee.collage || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row>
                <v-col
                  cols="4"
                  class="grey--text text-right"
                >
                  员工专业：
                </v-col>
                <v-col cols="8">
                  {{ employee.speciality || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="2"
                  class="grey--text text-right"
                >
                  家庭地址：
                </v-col>
                <v-col cols="10">
                  {{ employee.homeAddress || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="2"
                  class="grey--text text-right"
                >
                  现住地址：
                </v-col>
                <v-col cols="10">
                  {{ employee.nowAddress || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="2"
                  class="grey--text text-right"
                >
                  员工特长：
                </v-col>
                <v-col cols="10">
                  {{ employee.speciality || '未提交' }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="secondary"
            @click="dialogDetail = false;employee = {}"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SystemEmployeeList',
  data() {
    return {
      valid: true,
      loadingDataItems: false,
      dialogDetail: false,
      search: {},
      employee: {},
      loadingDataDetail: false,
      dialogDelete: false,
      deleting: false,
      dialogPassword: false,
      changingPassword: false,
      toDeleteEmployee: {},
      toChangePasswordEmployee: {},
      menuStart: false,
      menuEnd: false,
      categories: [
        {
          text: '首饰',
          value: '1',
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
      headers: [
        {
          text: '头像',
          align: 'center',
          sortable: false,
          value: 'logo',
          width: '100px',
        },
        {
          text: '用户名',
          value: 'account',
          align: 'center',
          sortable: false,
        },
        {
          text: '姓名',
          value: 'userNames',
          align: 'center',
          sortable: false,
        },
        {
          text: '手机',
          value: 'mobile',
          align: 'center',
          sortable: false,
        },
        {
          text: '状态',
          value: 'locked',
          align: 'center',
          sortable: false,
        },
        {
          text: '入职时间',
          value: 'entryTime',
          align: 'center',
          sortable: false,
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
        },
      ],
      passwordRules: [v => !!v || '请填写登录密码'],
    };
  },
  computed: {
    ...mapState(['breadCrumbs']),
    ...mapState('system', ['employeeList']),
    page: {
      set(value) {
        this.employeeList.data.p = value;
      },
      get() {
        return +this.employeeList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.employeeList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.employeeList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.employeeList.status) {
    this.$store.commit('START_LOADING');
    this.getEmployeeList();
    // }
  },
  methods: {
    ...mapActions('system', [
      'getEmployeeListAsync',
      'addOrEditEmployeeAsync',
      'getEmployeeSingleAsync',
    ]),
    changePagination() {
      this.getEmployeeList();
    },
    getEmployeeList(params) {
      this.loadingDataItems = true;
      this.getEmployeeListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 启停用员工
    deleteEmployee() {
      this.deleting = true;
      this.addOrEditEmployeeAsync({
        id: this.toDeleteEmployee.id,
        locked: this.toDeleteEmployee.locked === '0' ? '1' : '0',
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，操作成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.deleting = false;
          this.dialogDelete = false;
        });
    },
    // 获取员工详情
    getEmployeeSingle(params) {
      this.loadingDataDetail = true;
      this.dialogDetail = true;
      this.getEmployeeSingleAsync(params)
        .then((res) => {
          this.employee = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataDetail = false;
        });
    },
    // 修改员工登陆密码
    changeEmployeePassword() {
      this.changingPassword = true;
      this.getEmployeeSingleAsync({
        id: this.toChangePasswordEmployee.id,
        passwords: this.toChangePasswordEmployee.passwords,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，修改密码成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.changingPassword = false;
          this.dialogPassword = false;
        });
    },
    searchByConditions() {
      this.getEmployeeList(this.search);
    },
    clearSearchAllConditions() {
      this.$refs.form.reset();
      this.getEmployeeList();
    },
    clearSearchByConditions(target) {
      this.search[target] = '';
      this.getEmployeeList(this.search);
    },
  },
};
</script>
