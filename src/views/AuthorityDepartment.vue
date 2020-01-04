<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      部门设置
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="openDialogAdd({parentId: '0', parentName: '根级部门'})"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加部门
      </v-btn>
    </div>

    <v-card>
      <div class="pa-4">
        <v-treeview
          v-if="departmentList && departmentList.length"
          :items="departmentList"
          item-text="dnames"
          item-key="id"
          hoverable
        >
          <template v-slot:prepend="{ item,leaf, open }">
            <v-icon>
              {{ leaf ? 'mdi-bookmark-outline' : open ? 'mdi-bookmark-outline' : 'mdi-bookmark' }}
            </v-icon>
          </template>
          <template v-slot:append="{ item,leaf }">
            <div class="d-flex text-center align-center">
              <div
                style="width:300px"
                class="text-right"
              >
                <v-tooltip
                  v-if="item.dLevel !== '4'"
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="openDialogAdd({parentId: item.id,parentName: item.dnames, item})"
                    >
                      <v-icon color="primary">
                        mdi-bell-plus
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>新增子部门</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="openDialogEdit(item)"
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
                      @click="openDialogDelete(item.id)"
                    >
                      <v-icon color="secondary">
                        mdi-delete-forever
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>删除</span>
                </v-tooltip>
              </div>
            </div>
          </template>
        </v-treeview>
        <div
          v-else
          class="py-4 grey--text text-center"
        >
          {{ $store.state.loading ? '加载中...' : '暂无部门信息' }}
        </div>
      </div>
    </v-card>
    <v-dialog
      v-model="dialogAdd"
      width="800"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title class="title grey lighten-3 pa-4 d-flex justify-space-between">
            添加部门
          </v-card-title>
          <div class="pa-4">
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>部门名称：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="departmentToAdd.dnames"
                  :rules="nameRules"
                  placeholder="请输入部门名称"
                  outlined
                  clearable
                  required
                  dense
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
                <span class="red--text">*</span>上级部门：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  :value="parentName"
                  disabled
                  outlined
                  required
                  dense
                  single-line
                  append-icon="mdi-chevron-down"
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
                排序：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="departmentToAdd.sort"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="addingDepartment"
              :disabled="!valid || addingDepartment"
              @click="addDepartmentConfirm"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogAdd = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      width="800"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title class="title grey lighten-3 pa-4">
            编辑部门
          </v-card-title>
          <div class="pa-4">
            <v-row
              align="center"
              class="mb-3"
            >
              <v-col
                cols="3"
                class="text-right"
              >
                <span class="red--text">*</span>部门名称：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="departmentToEdit.dnames"
                  :rules="nameRules"
                  placeholder="请输入部门名称"
                  outlined
                  clearable
                  required
                  dense
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
                <span class="red--text">*</span>上级部门：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  :value="parentName"
                  disabled
                  outlined
                  required
                  dense
                  single-line
                  append-icon="mdi-chevron-down"
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
                排序：
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="departmentToEdit.sort"
                  outlined
                  clearable
                  required
                  dense
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="editingDepartment"
              :disabled="!valid || editingDepartment"
              @click="editDepartmentConfirm"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="dialogEdit = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
            :loading="deletingDepartment"
            :disabled="deletingDepartment"
            @click="deleteDepartmentConfirm"
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
  name: 'AuthorityDepartment',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      addingDepartment: false,
      editingDepartment: false,
      deletingDepartment: false,
      parentName: '根级部门',
      valid: true,
      departmentToAdd: {},
      departmentToEdit: {},
      departmentToDelete: '',
      nameRules: [v => !!v || '请填写部门名称'],
      sortRules: [v => (v && v >= 0) || '请填写部门名称'],
      switchOptions: [
        {
          id: '1',
          name: '是',
        },
        {
          id: '0',
          name: '否',
        },
      ],
    };
  },
  computed: {
    ...mapState('authority', ['departmentList']),
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
        text: '部门设置',
        disabled: true,
        exact: true,
      },
    ]);
    this.getDepartmentList();
  },
  methods: {
    ...mapActions('authority', [
      'getDepartmentListAsync',
      'addDepartmentAsync',
      'editDepartmentAsync',
      'deleteDepartmentAsync',
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
    openDialogEdit(item) {
      this.dialogEdit = true;
      this.departmentToEdit = R.clone(item);
      this.parentName = item.dnames;
    },
    openDialogDelete(id) {
      this.dialogDelete = true;
      this.departmentToDelete = id;
    },
    addDepartmentConfirm() {
      this.addingDepartment = true;
      this.addDepartmentAsync(this.departmentToAdd)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.addingDepartment = false;
          this.dialogAdd = false;
        });
    },
    editDepartmentConfirm() {
      this.editingDepartment = true;
      this.editDepartmentAsync(R.dissoc('children', this.departmentToEdit))
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，编辑成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.editingDepartment = false;
          this.dialogEdit = false;
        });
    },
    getDepartmentList() {
      this.$store.commit('START_LOADING');
      this.getDepartmentListAsync()
        .catch((err) => {
          this.checkErr(err, 'getDepartmentList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    deleteDepartmentConfirm() {
      this.deletingDepartment = true;
      this.deleteDepartmentAsync({ id: this.departmentToDelete })
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
          this.deletingDepartment = false;
          this.dialogDelete = false;
        });
    },
  },
};
</script>
