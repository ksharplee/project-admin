<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      角色管理
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{ name: 'authority_role_add' }"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加角色
      </v-btn>
    </div>
    <v-divider class="my-4" />
    <v-card>
      <v-data-table
        :headers="headers"
        :items="roleList.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{ name: 'authority_role_edit', params: { id: item.id }}"
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
                @click="dialogDelete = true;roleToDelete = item.id"
              >
                <v-icon color="secondary">
                  mdi-delete-forever
                </v-icon>
              </v-btn>
            </template>
            <span>删除</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="350px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="grey lighten-3">
          确定删除吗?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteAuthorityRole"
          >
            确定
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
  </div>
</template>

<script>
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AuthorityRole',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogDelete: false,
      deleting: false,
      valid: true,
      roleToDelete: '',
      headers: [
        {
          text: '角色名称',
          value: 'dnames',
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
    };
  },
  computed: {
    ...mapState('authority', ['roleList']),
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
        disabled: true,
        exact: true,
      },
    ]);
    if (!this.roleList.status) {
      this.getAuthorityRoleList();
    }
  },
  methods: {
    ...mapActions('authority', [
      'getAuthorityRoleListAsync',
      'deleteAuthorityRoleAsync',
    ]),
    openDialogAdd(param) {
      this.dialogAdd = true;
      this.parentId = param.parentId;
      this.parentName = param.parentName;
      this.departmentToAdd = {
        parentId: param.parentId,
        dnames: '',
        sort: 99,
      };
    },
    getAuthorityRoleList() {
      this.$store.commit('START_LOADING');
      this.getAuthorityRoleListAsync()
        .catch((err) => {
          this.checkErr(err, 'getAuthorityRoleList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    deleteAuthorityRole() {
      this.deleting = true;
      this.deleteAuthorityRoleAsync({ id: this.roleToDelete })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
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
  },
};
</script>
