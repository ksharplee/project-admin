<template>
  <div>
    <div class="title">
      {{ id ? '编辑角色' : '添加角色' }}
    </div>

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
                        v-model="role.dnames"
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
                      class="pa-3 grey lighten-4 d-flex align-center"
                    >
                      <div>
                        <v-checkbox
                          v-model="item.all"
                          :label="item.dnames"
                          color="primary"
                          hide-details
                          dense
                          class="mt-0"
                          @change="selectAll(item)"
                        />
                      </div>
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
                            v-model="role.baseData"
                            :label="base.baseName"
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
        </div>
      </v-card>
      <v-btn
        :disabled="!valid || submitting"
        :loading="submitting"
        color="primary"
        large
        class="px-12 body-1 my-4"
        @click="addOrEditAuthorityRole"
      >
        提交
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as R from 'ramda';

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
      role: {
        dnames: '',
        baseData: [],
      },
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
    } else if (this.id) {
      this.$store.commit('START_LOADING');
      this.getAuthorityRoleDetail();
    }
  },
  methods: {
    ...mapActions('authority', [
      'getAuthorityListAsync',
      'addAuthorityRoleAsync',
      'editAuthorityRoleAsync',
      'getAuthorityRoleDetailAsync',
    ]),
    selectAll(item) {
      if (item.all) {
        this.$set(
          this.role,
          'baseData',
          R.uniq(R.concat(R.pluck('baseId', item.bases), this.role.baseData))
        );
      } else {
        this.$set(
          this.role,
          'baseData',
          R.without(R.pluck('baseId', item.bases), this.role.baseData)
        );
      }
    },
    getAuthorityList() {
      this.$store.commit('START_LOADING');
      this.getAuthorityListAsync()
        .then(() => {
          if (this.id) {
            this.getAuthorityRoleDetail();
          }
        })
        .catch((err) => {
          this.checkErr(err, 'getAuthorityList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    // 添加角色
    addOrEditAuthorityRole() {
      this.submitting = true;
      if (this.id) {
        this.editAuthorityRoleAsync(R.omit(['hasRight', 'right'], this.role))
          .then(() => {
            this.$store.commit('TOGGLE_SNACKBAR', {
              type: 'success',
              text: '恭喜，修改成功!',
            });
            this.$router.replace({ name: 'authority_role' });
          })
          .catch(err => [this.checkErr(err, 'addOrEditAuthorityRole')])
          .finally(() => {
            this.submitting = false;
          });
      } else {
        this.addAuthorityRoleAsync(this.role)
          .then(() => {
            this.$store.commit('TOGGLE_SNACKBAR', {
              type: 'success',
              text: '恭喜，添加成功!',
            });
            this.$router.replace({ name: 'authority_role' });
          })
          .catch((err) => {
            this.checkErr(err, 'addAuthorityRole');
          })
          .finally(() => {
            this.submitting = false;
          });
      }
    },
    getAuthorityRoleDetail() {
      this.getAuthorityRoleDetailAsync({ id: this.id })
        .then((res) => {
          this.role = res;
          this.$set(this.role, 'baseData', res.hasRight);
        })
        .catch((err) => {
          this.checkErr(err, 'getAuthorityRoleDetail');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
  },
};
</script>
