<template>
  <div>
    <div class="title">
      {{ id ? '编辑角色' : '添加角色' }}
    </div>
    <v-divider class="my-4" />
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-card elevation-1>
        <div class="subtitle-1 px-3 pt-4">
          角色权限设置
        </div>
        <v-container
          fluid
          class="py-0"
        >
          <v-row>
            <v-col
              cols="12"
              md="8"
              lg="9"
              xl="10"
              class="py-0"
            >
              <v-row>
                <v-col
                  rows="12"
                  md="6"
                  xl="4"
                >
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text required">角色名称</span>
                    </div>
                    <div class="input-group-control">
                      <v-text-field
                        v-model="role.name"
                        :rules="nameRules"
                        placeholder="请输入角色名称"
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
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <div class="subtitle-1 px-3 pt-4">
          角色权限明细
        </div>
        <div class="pa-3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-hover
                v-for="item in authorityList"
                :key="item.id"
                v-slot:default="{ hover }"
              >
                <v-card
                  tile
                  outlined
                  style="margin-bottom:-1px"
                >
                  <v-row no-gutters>
                    <v-col
                      cols="4"
                      md="2"
                      lg="1"
                      class="pa-3 grey lighten-4"
                    >
                      {{ item.dnames }}
                    </v-col>
                    <v-divider vertical />
                    <v-col
                      class="pa-3"
                      :class="hover ? 'grey lighten-4' : ''"
                    >
                      1
                    </v-col>
                  </v-row>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
          <!-- <v-simple-table style="border:1px solid #ddd">
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="item in authorityList"
                  :key="item.id"
                >
                  <td style="border-right:1px solid #ddd;width:120px">
                    {{ item.dnames }}
                  </td>
                  <td>
                    1
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table> -->
        </div>
      </v-card>
      <v-btn
        :disabled="!valid || submitting"
        color="secondary"
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
import { mapState, mapActions } from 'vuex';
import * as R from 'ramda';
import md5 from 'md5';

export default {
  name: 'AuthorityRoleSingle',
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
      role: {},
      nameRules: [v => !!v || '请填写角色姓名'],
    };
  },
  computed: {
    ...mapState('authority', ['authorityList']),
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
        text: '角色管理',
        disabled: false,
        to: { name: 'authority_role' },
        exact: true,
      },
      {
        text: this.id ? '编辑角色' : '添加角色',
        disabled: true,
        exact: true,
      },
    ]);
    if (!this.authorityList) {
      this.getAuthorityList();
    }
    // if (this.id) {
    //   this.$store.commit('START_LOADING');
    //   this.getEmployeeSingle({ id: this.id });
    // }
  },
  methods: {
    ...mapActions('authority', ['getAuthorityListAsync']),
    getAuthorityList() {
      this.$store.commit('START_LOADING');
      this.getAuthorityListAsync()
        .catch((err) => {
          this.checkErr(err, 'getAuthorityList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    // 添加/编辑角色
    addOrEditEmployee() {
      this.submitting = true;
      const postData = this.employee;
      if (postData.passwords) {
        postData.passwords = md5(this.employee.passwords);
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
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 获取角色详情
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
