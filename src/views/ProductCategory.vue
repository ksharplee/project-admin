<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      类别列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="openDialogAdd({parentId: '0'})"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加类别
      </v-btn>
    </div>
    <v-card>
      <div class="d-flex grey lighten-3 py-4 text-center px-2 font-weight-bold">
        <div class="flex-grow-1">
          分类名称
        </div>
        <div style="width:150px">
          排序
        </div>
        <div style="width:150px">
          前台显示
        </div>
        <div
          style="width:300px"
          class="text-right pr-6"
        >
          操作
        </div>
      </div>
      <v-treeview
        v-if="productCategory.data.items.length"
        :items="productCategory.data.items"
        item-key="id"
        item-children="son"
        hoverable
      >
        <template v-slot:label="{ item,leaf, open }">
          {{ item.dnames }}({{ item.dnamesEn }})
        </template>
        <template v-slot:prepend="{ item,leaf, open }">
          <v-icon>
            {{ leaf ? 'mdi-bookmark-outline' : open ? 'mdi-bookmark-outline' : 'mdi-bookmark' }}
          </v-icon>
        </template>
        <template v-slot:append="{ item,leaf }">
          <div class="d-flex text-center align-center">
            <div style="width:150px">
              {{ item.sort }}
            </div>
            <div style="width:150px">
              {{ item.isPublish === '1' ? '显示' : '不显示' }}
            </div>
            <div
              style="width:300px"
              class="text-right"
            >
              <v-tooltip
                v-if="item.isEnd === '0'"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mx-1"
                    v-on="on"
                    @click="openDialogAdd({parentId: item.id, item})"
                  >
                    <v-icon color="primary">
                      mdi-bell-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>增加子类</span>
              </v-tooltip>
              <v-tooltip
                v-if="item.isEnd === '1'"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    :to="{ name: 'product_attr', params: { id: item.id, cate: item.dnames }}"
                    icon
                    class="mx-1"
                    v-on="on"
                  >
                    <v-icon color="warning">
                      mdi-spa
                    </v-icon>
                  </v-btn>
                </template>
                <span>属性管理</span>
              </v-tooltip>
              <v-tooltip
                v-if="item.isEnd === '1'"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    :to="{ name: 'product_spec', params: { id: item.id, cate: item.dnames }}"
                    icon
                    class="mx-1"
                    v-on="on"
                  >
                    <v-icon color="amber accent-3">
                      mdi-file-document-box
                    </v-icon>
                  </v-btn>
                </template>
                <span>规格管理</span>
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
              <v-tooltip
                v-if="item.isEnd === '1' || !item.son"
                bottom
              >
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
        暂无商品分类
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
            添加分类
            <span class="error--text body-1">只有最后一级分类可以设置商品的属性和规格</span>
          </v-card-title>
          <div class="pa-4">
            <v-row>
              <v-col>
                分类名称
              </v-col>
              <v-col>
                分类英文名称
              </v-col>
              <v-col>
                是否是最后一级
              </v-col>
              <v-col>
                是否显示前台
              </v-col>
              <v-col>
                排序
              </v-col>
            </v-row>
            <v-row
              v-for="(cate, index) in cateToAdd"
              :key="index"
              class="mb-2"
            >
              <v-col>
                <v-text-field
                  v-model="cate.dnames"
                  :rules="nameRules"
                  placeholder="请输入分类名"
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                  dense
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="cate.dnamesEn"
                  :rules="nameRules"
                  placeholder="请输入分类名"
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                  dense
                />
              </v-col>
              <v-col>
                <v-select
                  v-model="cate.isEnd"
                  :items="switchOptions"
                  item-text="name"
                  item-value="id"
                  single-line
                  outlined
                  clearable
                  hide-details
                  dense
                  no-data-text="暂无数据"
                />
              </v-col>
              <v-col>
                <v-select
                  v-model="cate.isPublish"
                  :items="switchOptions"
                  item-text="name"
                  item-value="id"
                  single-line
                  outlined
                  clearable
                  hide-details
                  dense
                  no-data-text="暂无数据"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="cate.sort"
                  :rules="sortRules"
                  placeholder="请输入分类序号"
                  type="number"
                  outlined
                  clearable
                  single-line
                  hide-details
                  dense
                />
              </v-col>
            </v-row>
            <v-btn
              color="primary"
              outlined
              @click="addCateToTemp"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              添加
            </v-btn>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="addingCate"
              :disabled="!valid || addingCate"
              @click="addCateConfirm"
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
            添加分类
          </v-card-title>
          <div class="pa-4">
            <v-row>
              <v-col>
                分类名称
              </v-col>
              <v-col>
                分类英文名称
              </v-col>
              <v-col>
                是否是最后一级
              </v-col>
              <v-col>
                是否显示前台
              </v-col>
              <v-col>
                排序
              </v-col>
            </v-row>
            <v-row class="mb-2">
              <v-col>
                <v-text-field
                  v-model="cateToEdit.dnames"
                  :rules="nameRules"
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                  dense
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="cateToEdit.dnamesEn"
                  :rules="nameRules"
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                  dense
                />
              </v-col>
              <v-col>
                <v-select
                  v-model="cateToEdit.isEnd"
                  :items="switchOptions"
                  item-text="name"
                  item-value="id"
                  single-line
                  outlined
                  clearable
                  hide-details
                  dense
                  no-data-text="暂无数据"
                />
              </v-col>
              <v-col>
                <v-select
                  v-model="cateToEdit.isPublish"
                  :items="switchOptions"
                  item-text="name"
                  item-value="id"
                  single-line
                  outlined
                  clearable
                  hide-details
                  dense
                  no-data-text="暂无数据"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="cateToEdit.sort"
                  :rules="sortRules"
                  type="number"
                  outlined
                  clearable
                  single-line
                  hide-details
                  dense
                />
              </v-col>
            </v-row>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="editingCate"
              :disabled="!valid || editingCate"
              @click="editCateConfirm"
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
            :loading="deletingCate"
            :disabled="deletingCate"
            @click="deleteCateConfirm"
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ProductCategory',
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
      addingCate: false,
      editingCate: false,
      deletingCate: false,
      valid: true,
      cateToAdd: {},
      cateToEdit: {},
      cateToDelete: '',
      parentId: '0',
      nameRules: [v => !!v || '请填写分类名称'],
      sortRules: [v => (v && v >= 0) || '请填写分类名称'],
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
    ...mapState('product', ['productCategory']),
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
        text: '类别列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.getCateList();
    // const sessionData = JSON.parse(sessionStorage.getItem('productCategory'));
    // if (!this.productCategory.length && sessionData && sessionData.length) {
    //   this.SET_PRODUCT_CATEGORY(sessionData);
    // } else {
    // }
  },
  methods: {
    ...mapMutations('product', ['SET_PRODUCT_CATEGORY']),
    ...mapActions('product', [
      'addCateAsync',
      'getCateListAsync',
      'editCateAsync',
      'deleteCateAsync',
    ]),
    openDialogAdd(param) {
      this.dialogAdd = true;
      this.parentId = param.parentId;
      this.cateToAdd = [
        {
          parentId: param.parentId,
          dnames: '',
          sort: 99,
          isEnd: '0',
          isPublish: '1',
        },
      ];
    },
    openDialogEdit(item) {
      this.dialogEdit = true;
      this.cateToEdit = R.clone(item);
    },
    openDialogDelete(id) {
      this.dialogDelete = true;
      this.cateToDelete = id;
    },
    addCateToTemp() {
      this.cateToAdd = R.append(
        {
          parentId: this.parentId,
          dnames: '',
          sort: 99,
          isEnd: '',
          isPublish: '',
        },
        this.cateToAdd
      );
    },
    addCateConfirm() {
      this.addingCate = true;
      this.addCateAsync(this.cateToAdd)
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
          this.addingCate = false;
          this.dialogAdd = false;
        });
    },
    editCateConfirm() {
      this.editingCate = true;
      this.editCateAsync(this.cateToEdit)
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
          this.editingCate = false;
          this.dialogEdit = false;
        });
    },
    getCateList() {
      this.$store.commit('START_LOADING');
      this.getCateListAsync()
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
        });
    },
    deleteCateConfirm() {
      this.deletingCate = true;
      this.deleteCateAsync({ id: this.cateToDelete })
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
          this.deletingCate = false;
          this.dialogDelete = false;
        });
    },
  },
};
</script>
