<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        员工权限设置 <span class="ml-12 body-1">姓名：{{ name }}</span><span class="ml-6 body-1">手机：{{ mobile }}</span>
      </v-card-title>
      <v-card-text class="pt-4 black--text body-1">
        <div class="red--text h6 mb-3">
          角色与权限关联，选择该账号的角色可完成权限设置
        </div>
        <v-row align="center">
          <v-col
            cols="auto"
            class="text-right"
          >
            账号权限
          </v-col>
          <v-col
            cols="auto"
            class="pl-6"
          >
            <div v-if="$store.state.loading">
              加载中...
            </div>
            <v-row v-else-if="roleList.data.length">
              <v-checkbox
                v-for="role in roleList.data"
                :key="role.id"
                v-model="postIds"
                :label="role.dnames"
                color="primary"
                hide-details
                :value="role.id"
                class="mt-0 mr-4"
                dense
                @change="getAuthorityRoleRight(role.id)"
              />
            </v-row>
            <div v-else>
              暂无角色，<router-link
                :to="{ name: 'authority_role_add' }"
                class="primary--text"
              >
                前往设置
              </router-link>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="auto"
            class="text-right pt-3"
          >
            数据权限
          </v-col>
          <v-col
            cols="auto"
            class="pl-6"
          >
            <v-row>
              <v-radio-group
                v-model="rangeType"
                mandatory
                row
                hide-details
                class="my-0"
                dense
              >
                <v-radio
                  v-for="(range,i) in rangeTypes"
                  :key="i"
                  :label="range.text"
                  color="primary"
                  :value="range.value"
                />
              </v-radio-group>
            </v-row>
            <v-row
              v-if="rangeType === '3'"
              align="center"
            >
              <v-menu
                v-model="showMenu"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <div style="position:relative">
                    <div
                      class="white"
                      style="position:absolute;z-index:1;top:24px;left:8px;max-width:90%;height:24px;overflow:hidden"
                    >
                      <v-chip
                        v-for="item in postDepartmentNames"
                        :key="item.id"
                        close
                        small
                        class="mr-2"
                        @click:close="deletePostDepartment(item.id)"
                      >
                        {{ item.dnames }}
                      </v-chip>
                    </div>
                    <v-text-field
                      placeholder="请选择部门"
                      single-line
                      outlined
                      dense
                      class="mt-4 custom-text-filed"
                      style="width:500px"
                      readonly
                      hide-details
                      v-on="on"
                      @focus="getDepartmentList"
                    />
                  </div>
                </template>
                <v-card>
                  <v-card-text class="custom-treeview-class">
                    <v-treeview
                      v-if="departmentList && departmentList.length"
                      :items="departmentList"
                      :active="postDepartments"
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
            </v-row>
          </v-col>
        </v-row>
        <div class="subtitle-1 pt-4 mb-3">
          角色权限明细
        </div>
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
                    class="pa-3 grey lighten-4 d-flex align-center"
                  >
                    {{ item.dnames }}
                  </v-col>
                  <v-divider vertical />
                  <v-col
                    class="pa-3 d-flex flex-wrap"
                    :class="hover ? 'grey lighten-4' : ''"
                  >
                    <template v-for="(base) in item.bases">
                      <div
                        :key="base.baseId"
                        style="width:170px"
                      >
                        <v-checkbox
                          :input-value="allAuthority"
                          :label="base.baseName"
                          readonly
                          color="primary"
                          hide-details
                          dense
                          :value="base.baseId"
                          class="mt-0 mr-4"
                        />
                      </div>
                      <div
                        v-if="base.isEnd === '1'"
                        :key="base.baseName"
                        class="col-12 pa-0"
                      />
                    </template>
                  </v-col>
                </v-row>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-btn
      :disabled="!valid || submitting"
      :loading="submitting"
      color="primary"
      large
      class="px-12 body-1 my-4"
      @click="setAuthorityEmployeeRight"
    >
      提交
    </v-btn>
  </v-form>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AuthorityEmployeeRight',
  props: {
    id: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      valid: true,
      submitting: false,
      loadingDepartment: false,
      showMenu: false,
      postDepartments: [],
      baseData: {},
      postIds: [],
      rangeType: '1',
      rangeTypes: [
        {
          text: '全部',
          value: '1',
        },
        {
          text: '自己',
          value: '2',
        },
        {
          text: '选部门',
          value: '3',
        },
      ],
      dialog: false,
    };
  },
  computed: {
    ...mapState('authority', [
      'roleList',
      'authorityList',
      'departmentList',
      'departmentAll',
    ]),
    allAuthority() {
      let arr = [];
      R.forEachObjIndexed((value, key) => {
        if (+value !== 0) {
          arr = R.append(key, arr);
        }
      }, this.baseData);
      return arr;
    },
    postDepartmentNames() {
      return R.filter(
        item => R.includes(item.id, this.postDepartments),
        this.departmentAll ? this.departmentAll : []
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
        text: '员工权限设置',
        disabled: true,
        exact: true,
      },
    ]);
    this.getAllAuthorityData();
  },
  methods: {
    ...mapActions('authority', [
      'getAuthorityListAsync',
      'getAuthorityEmployeeRightAsync',
      'getDepartmentListAsync',
      'getAuthorityRoleRightAsync',
      'getAuthorityRoleListAsync',
      'setAuthorityEmployeeRightAsync',
    ]),
    deletePostDepartment(id) {
      this.postDepartments = R.without([id], this.postDepartments);
    },
    returnActiveDepartments(v) {
      this.postDepartments = v;
    },
    getDepartmentList() {
      if (!this.departmentList) {
        this.loadingDepartment = true;
        this.getDepartmentListAsync()
          .catch((err) => {
            this.checkErr(err, 'getDepartmentList');
          })
          .finally(() => {
            this.loadingDepartment = false;
          });
      }
    },
    setAuthorityEmployeeRight() {
      if (this.rangeType === '3' && !this.postDepartments.length) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: '请选择至少一个部门',
        });
        return;
      }
      this.submitting = true;
      const params = {
        userId: this.id,
        rangeType: this.rangeType,
        postIds: this.postIds,
      };
      if (this.rangeType === '3') {
        params.sectionIds = this.postDepartments;
      }
      this.setAuthorityEmployeeRightAsync(params)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，设置成功!',
          });
          this.$router.replace({ name: 'employee_list' });
        })
        .catch((err) => {
          this.checkErr(err, 'setAuthorityEmployeeRight');
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    getAuthorityRoleRight(id) {
      this.getAuthorityRoleRightAsync({ id })
        .then((res) => {
          if (R.includes(id, this.postIds)) {
            R.map((key) => {
              this.$set(
                this.baseData,
                key,
                +this.baseData[key] ? +this.baseData[key] + 1 : 1
              );
            }, res);
          } else {
            R.map((key) => {
              this.$set(this.baseData, key, +this.baseData[key] - 1);
            }, res);
          }
        })
        .catch((err) => {
          this.checkErr(err);
        });
    },
    getAllAuthorityData() {
      this.$store.commit('START_LOADING');
      // 角色列表
      const role = this.getAuthorityRoleListAsync();
      // 所有权限
      const authority = this.getAuthorityListAsync();
      let promises = [];
      if (!this.authorityList) {
        promises = R.append(role, promises);
      }
      if (!this.roleList.status) {
        promises = R.append(authority, promises);
      }
      Promise.all(promises)
        .then(() => {
          this.getAuthorityEmployeeRight();
        })
        .catch((err) => {
          this.checkErr(err, 'getAllAuthorityData');
        });
    },
    getAuthorityEmployeeRight() {
      this.getAuthorityEmployeeRightAsync({ userId: this.id })
        .then((res) => {
          this.baseData = res.hasRight;
          this.rangeType = res.rangeType;
          this.postIds = res.hasPost;
          if (res.rangeType === '3') {
            this.getDepartmentListAsync()
              .then(() => {
                this.postDepartments = R.pluck('sectionId', res.hasSection);
              })
              .catch((err) => {
                this.checkErr(err, 'getAuthorityEmployeeRight');
              })
              .finally(() => {
                this.$store.commit('END_LOADING');
              });
          } else {
            this.$store.commit('END_LOADING');
          }
        })
        .catch((err) => {
          this.checkErr(err, 'getAuthorityEmployeeRight');
        });
    },
  },
};
</script>
