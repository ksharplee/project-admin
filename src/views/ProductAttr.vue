<template>
  <div>
    <div class="title d-flex align-center">
      <span class="primary--text">{{ cate }}</span>的属性列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogAdd = true"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加属性
      </v-btn>
    </div>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="dataItems"
        :loading="loadingDataItems"
        item-key="id"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        class="text-center"
        :items-per-page="20"
        :page.sync="page"
        @page-count="pageCount = $event"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="(item, i) in items"
              :key="item.id"
            >
              <td>{{ item.sort }}</td>
              <td>{{ item.dnames }}</td>
              <td>{{ item.genre | genreText }}</td>
              <td>{{ item.attrItem | concatItemNames }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="openDialogEdit(item, i)"
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
                      @click="openDialogDelete(item, i)"
                    >
                      <v-icon color="secondary">
                        mdi-delete-forever
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>删除</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <v-divider />
      <div
        v-if="pageCount > 1"
        class="text-center pt-3"
      >
        <v-pagination
          v-model="page"
          :length="pageCount"
        />
      </div>
    </v-card>
    <v-dialog
      v-model="dialogAdd"
      max-width="500px"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title class="title grey lighten-3 pa-4">
            添加属性
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col md="3">
                属性名称：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="attrToAdd.dnames"
                  :rules="nameRules"
                  placeholder="请填写属性名称"
                  dense
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                属性类型：
              </v-col>
              <v-col md="8">
                <v-select
                  v-model="attrToAdd.genre"
                  :items="genreOptions"
                  dense
                  single-line
                  outlined
                  hide-details
                  no-data-text="暂无数据"
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                排序：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="attrToAdd.sort"
                  :rules="sortRules"
                  type="number"
                  placeholder="排序不能小于0，数字越小越靠前"
                  dense
                  outlined
                  required
                  clearable
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <template v-if="attrToAdd.genre !== '1'">
              <v-row>
                <v-col
                  md="3"
                  class="pt-4"
                >
                  属性值：
                </v-col>
                <v-col md="8">
                  <div
                    v-for="(attrItem, i) in attrToAdd.attrItem"
                    :key="i"
                    class="input-group mb-3"
                  >
                    <div class="input-group-control">
                      <v-text-field
                        v-model="attrItem.attrItemName"
                        placeholder="请输入属性值"
                        dense
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                      />
                    </div>
                    <div class="input-group-append">
                      <span class="input-group-text pa-0">
                        <v-btn
                          color="secondary"
                          icon
                          tile
                          :disabled="attrToAdd.attrItem.length === 1"
                          @click="deleteItemFromAttrToAdd(i)"
                        >
                          <v-icon>mdi-delete-forever mdi-18px</v-icon>
                        </v-btn>
                      </span>
                    </div>
                  </div>
                  <v-btn
                    color="primary"
                    outlined
                    @keyup.enter="addItemToAttrToAdd"
                    @click="addItemToAttrToAdd"
                  >
                    <v-icon left>
                      mdi-plus
                    </v-icon>
                    添加
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="addingAttr"
              :disabled="!valid || addingAttr"
              @click="addAttrConfirm"
            >
              确定
            </v-btn>
            <v-btn
              color="secondary"
              @click="closeDialogAdd"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogEdit"
      max-width="500px"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title class="title grey lighten-3 pa-4">
            编辑属性
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col md="3">
                属性名称：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="attrToEdit.dnames"
                  :rules="nameRules"
                  placeholder="请填写属性名称"
                  dense
                  outlined
                  clearable
                  required
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                属性类型：
              </v-col>
              <v-col md="8">
                <v-select
                  v-model="attrToEdit.genre"
                  :items="genreOptions"
                  dense
                  disabled
                  single-line
                  outlined
                  hide-details
                  no-data-text="暂无数据"
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                排序：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="attrToEdit.sort"
                  :rules="sortRules"
                  type="number"
                  placeholder="排序不能小于0，数字越小越靠前"
                  dense
                  outlined
                  clearable
                  single-line
                  hide-details
                />
              </v-col>
            </v-row>
            <template v-if="attrToEdit.genre !== '1'">
              <v-row>
                <v-col
                  md="3"
                  class="pt-4"
                >
                  属性值：
                </v-col>
                <v-col md="8">
                  <div
                    v-for="(attrItem, i) in attrToEdit.attrItem"
                    :key="i"
                    class="input-group mb-3"
                  >
                    <div class="input-group-control">
                      <v-text-field
                        v-model="attrItem.attrItemName"
                        placeholder="请输入属性值"
                        dense
                        outlined
                        clearable
                        required
                        single-line
                        hide-details
                      />
                    </div>
                    <div class="input-group-append">
                      <span class="input-group-text pa-0">
                        <v-btn
                          color="secondary"
                          icon
                          tile
                          :disabled="attrToEdit.attrItem.length === 1"
                          @click="deleteItemFromAttrToEdit(i)"
                        >
                          <v-icon>mdi-delete-forever mdi-18px</v-icon>
                        </v-btn>
                      </span>
                    </div>
                  </div>
                  <v-btn
                    color="primary"
                    outlined
                    @keyup.enter="addItemToAttrToEdit"
                    @click="addItemToAttrToEdit"
                  >
                    <v-icon left>
                      mdi-plus
                    </v-icon>
                    添加
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="editingAttr"
              :disabled="!valid || editingAttr"
              @click="editAttrConfirm"
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
            @click="deleteAttrConfirm"
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
import { mapActions } from 'vuex';

export default {
  name: 'ProductAttr',
  filters: {
    concatItemNames(arr) {
      return arr[0].attrItemName
        ? R.join('，', R.pluck('attrItemName', arr))
        : '无';
    },
    genreText(genre) {
      if (genre === '1') {
        return '文本框';
      }
      if (genre === '2') {
        return '单选框';
      }
      return '多选框';
    },
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    cate: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      loadingDataItems: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      addingAttr: false,
      editingAttr: false,
      deletingCate: false,
      attrToDelete: {},
      attrToEdit: {
        sort: 99,
        genre: '1',
        attrItem: [
          {
            attrItemName: '',
          },
        ],
      },
      valid: true,
      attrToAdd: {
        sort: 99,
        genre: '1',
        attrItem: [
          {
            attrItemName: '',
          },
        ],
      },
      genreOptions: [
        {
          value: '1',
          text: '文本框',
        },
        {
          value: '2',
          text: '单选',
        },
        {
          value: '3',
          text: '多选框',
        },
      ],
      nameRules: [v => !!v || '请填写属性名称'],
      textRules: [v => !!v || '请填写属性值'],
      radioRules: [v => !!v || '请填写属性值'],
      sortRules: [v => (v && v >= 0) || '排序不能小于0'],
      headers: [
        {
          text: '排序',
          value: 'sort',
          align: 'center',
          sortable: false,
        },
        {
          text: '属性名称',
          align: 'center',
          sortable: false,
          value: 'dnames',
        },
        {
          text: '属性类型',
          align: 'center',
          sortable: false,
          value: 'genre',
        },
        {
          text: '值',
          value: 'attrItem',
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
      dataItems: [],
    };
  },
  computed: {
    toAddItemNames() {
      return R.uniq(
        R.without([''], R.pluck('attrItemName', this.attrToAdd.attrItem))
      );
    },
    toAddParams() {
      return {
        categoryId: this.id,
        dnames: this.attrToAdd.dnames,
        sort: this.attrToAdd.sort,
        genre: this.attrToAdd.genre,
        attrItem: R.map(R.objOf('attrItemName'), this.toAddItemNames),
      };
    },
    toEditItemNames() {
      return R.uniq(
        R.without([''], R.pluck('attrItemName', this.attrToEdit.attrItem))
      );
    },
    toEditParams() {
      return {
        categoryId: this.id,
        id: this.attrToEdit.id,
        dnames: this.attrToEdit.dnames,
        genre: this.attrToEdit.genre,
        sort: this.attrToEdit.sort,
        attrItem: R.map(R.objOf('attrItemName'), this.toEditItemNames),
      };
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
        text: '类别管理',
        disabled: false,
        to: { name: 'product_category' },
        exact: true,
      },
      {
        text: '属性列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getCateAttrList();
  },
  methods: {
    ...mapActions('product', [
      'addCateAttrAsync',
      'getCateAttrListAsync',
      'deleteCateAttrAsync',
      'editCateAttrAsync',
    ]),
    // 编辑属性
    openDialogEdit(item, i) {
      this.dialogEdit = true;
      this.attrToEdit = R.clone(item);
      this.attrToEdit.index = i;
    },
    addItemToAttrToEdit() {
      this.$set(
        this.attrToEdit,
        'attrItem',
        R.append(
          {
            attrItemName: '',
          },
          this.attrToEdit.attrItem
        )
      );
    },
    editAttrConfirm() {
      this.editingAttr = true;
      this.editCateAttrAsync(this.toEditParams)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，编辑成功!',
          });
          if (this.attrToEdit.genre === '1') {
            this.$set(
              this.dataItems,
              this.attrToEdit.index,
              R.compose(
                R.assoc('attrItem', [{ attrItemName: '' }]),
                R.dissoc('index')
              )(this.attrToEdit)
            );
          } else {
            this.$set(
              this.dataItems,
              this.attrToEdit.index,
              R.dissoc('index', this.attrToEdit)
            );
          }
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.dialogEdit = false;
          this.editingAttr = false;
        });
    },
    deleteItemFromAttrToEdit(i) {
      this.$set(
        this.attrToEdit,
        'attrItem',
        R.remove(i, 1, this.attrToEdit.attrItem)
      );
    },
    // 重置添加属性
    resetAttrToAdd() {
      this.attrToAdd = {
        sort: 99,
        genre: '1',
        attrItem: [
          {
            attrItemName: '',
          },
        ],
      };
    },
    // 添加属性
    addAttrConfirm() {
      this.addingAttr = true;
      this.addCateAttrAsync(this.toAddParams)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.resetAttrToAdd();
          this.getCateAttrList();
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.addingAttr = false;
          this.dialogAdd = false;
        });
    },
    closeDialogAdd() {
      this.dialogAdd = false;
      this.resetAttrToAdd();
    },
    addItemToAttrToAdd() {
      this.$set(
        this.attrToAdd,
        'attrItem',
        R.append(
          {
            attrItemName: '',
          },
          this.attrToAdd.attrItem
        )
      );
    },
    deleteItemFromAttrToAdd(i) {
      this.$set(
        this.attrToAdd,
        'attrItem',
        R.remove(i, 1, this.attrToAdd.attrItem)
      );
    },
    // 获取属性列表
    getCateAttrList() {
      this.loadingDataItems = true;
      this.getCateAttrListAsync({
        id: this.id,
      })
        .then((res) => {
          this.dataItems = res;
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.loadingDataItems = false;
          this.$store.commit('END_LOADING');
        });
    },
    // 删除属性
    openDialogDelete(item, i) {
      this.dialogDelete = true;
      this.attrToDelete = item;
      this.attrToDelete.index = i;
    },
    deleteAttrConfirm() {
      this.deletingCate = true;
      this.deleteCateAttrAsync({
        id: this.attrToDelete.id,
        categoryId: this.attrToDelete.categoryId,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.dataItems = R.remove(this.attrToDelete.index, 1, this.dataItems);
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.dialogDelete = false;
          this.deletingCate = false;
        });
    },
  },
};
</script>
