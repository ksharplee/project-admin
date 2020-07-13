<template>
  <div>
    <div class="title d-flex align-center pb-2">
      <span class="primary--text">{{ cate }}</span>的规格列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogAdd = true"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加规格
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
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="(item, i) in items"
              :key="item.id"
            >
              <td>{{ item.sort }}</td>
              <td>{{ item.dnames }}</td>
              <td>{{ item.specItem | concatItemNames }}</td>
              <td>
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
            添加规格
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col md="3">
                规格名称：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="specToAdd.dnames"
                  :rules="nameRules"
                  placeholder="请填写规格名称"
                  outlined
                  clearable
                  required
                  single-line
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                排序：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="specToAdd.sort"
                  :rules="sortRules"
                  type="number"
                  placeholder="排序不能小于0，数字越小越靠前"
                  outlined
                  clearable
                  single-line
                  dense
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col
                md="3"
                class="pt-4"
              >
                规格值：
              </v-col>
              <v-col md="8">
                <div
                  v-for="(specItem, i) in specToAdd.specItem"
                  :key="i"
                  class="input-group mb-3"
                >
                  <div class="input-group-control">
                    <v-text-field
                      v-model="specItem.itemName"
                      placeholder="请输入规格值"
                      outlined
                      clearable
                      required
                      single-line
                      dense
                      hide-details
                    />
                  </div>
                  <div class="input-group-append">
                    <span class="input-group-text pa-0">
                      <v-btn
                        color="secondary"
                        icon
                        tile
                        :disabled="specToAdd.specItem.length === 1"
                        @click="deleteItemFromSpecToAdd(i)"
                      >
                        <v-icon>mdi-delete-forever mdi-18px</v-icon>
                      </v-btn>
                    </span>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  outlined
                  @click="addItemToSpecToAdd"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  添加
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="addingSpec"
              :disabled="!valid || addingSpec"
              @click="addSpecConfirm"
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
      max-width="500px"
    >
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title class="title grey lighten-3 pa-4">
            添加规格
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col md="3">
                规格名称：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="specToEdit.dnames"
                  :rules="nameRules"
                  placeholder="请填写规格名称"
                  outlined
                  clearable
                  required
                  single-line
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col md="3">
                排序：
              </v-col>
              <v-col md="8">
                <v-text-field
                  v-model="specToEdit.sort"
                  :rules="sortRules"
                  type="number"
                  placeholder="排序不能小于0，数字越小越靠前"
                  outlined
                  clearable
                  single-line
                  dense
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col
                md="3"
                class="pt-4"
              >
                规格值：
              </v-col>
              <v-col md="8">
                <div
                  v-for="(specItem, i) in specToEdit.specItem"
                  :key="i"
                  class="input-group mb-3"
                >
                  <div class="input-group-control">
                    <v-text-field
                      v-model="specItem.itemName"
                      placeholder="请输入规格值"
                      outlined
                      clearable
                      required
                      single-line
                      dense
                      hide-details
                    />
                  </div>
                  <div class="input-group-append">
                    <span class="input-group-text pa-0">
                      <v-btn
                        color="secondary"
                        icon
                        tile
                        :disabled="specToEdit.specItem.length === 1"
                        @click="deleteItemFromSpecToEdit(i)"
                      >
                        <v-icon>mdi-delete-forever mdi-18px</v-icon>
                      </v-btn>
                    </span>
                  </div>
                </div>
                <v-btn
                  color="primary"
                  outlined
                  @click="addItemToSpecToEdit"
                >
                  <v-icon left>
                    mdi-plus
                  </v-icon>
                  添加
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="editingSpec"
              :disabled="!valid || editingSpec"
              @click="editSpecConfirm"
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
            @click="deleteSpecConfirm"
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
  name: 'ProductSpec',
  filters: {
    concatItemNames(arr) {
      return R.join('，', R.pluck('itemName', arr));
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
      loadingDataItems: false,
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      addingSpec: false,
      editingSpec: false,
      deletingCate: false,
      specToDelete: {},
      specToEdit: {
        sort: 99,
      },
      valid: true,
      specToAdd: {
        sort: 99,
        specItem: [
          {
            itemName: '',
          },
        ],
      },
      nameRules: [v => !!v || '请填写规格名称'],
      sortRules: [v => (v && v >= 0) || '排序不能小于0'],
      headers: [
        {
          text: '排序',
          value: 'sort',
          align: 'center',
          sortable: false,
        },
        {
          text: '规格名称',
          align: 'center',
          sortable: false,
          value: 'dnames',
        },
        {
          text: '值',
          value: 'specItem',
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
        R.without([''], R.pluck('itemName', this.specToAdd.specItem))
      );
    },
    toAddParams() {
      return {
        categoryId: this.id,
        dnames: this.specToAdd.dnames,
        sort: this.specToAdd.sort,
        specItem: R.map(R.objOf('itemName'), this.toAddItemNames),
      };
    },
    toEditItemNames() {
      return R.uniq(
        R.without([''], R.pluck('itemName', this.specToEdit.specItem))
      );
    },
    toEditParams() {
      return {
        categoryId: this.id,
        id: this.specToEdit.id,
        dnames: this.specToEdit.dnames,
        sort: this.specToEdit.sort,
        specItem: R.map(R.objOf('itemName'), this.toEditItemNames),
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
        text: '规格列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getCateSpecList();
  },
  methods: {
    ...mapActions('product', [
      'addCateSpecAsync',
      'getCateSpecListAsync',
      'deleteCateSpecAsync',
      'editCateSpecAsync',
    ]),
    // 编辑规格
    openDialogEdit(item) {
      this.dialogEdit = true;
      this.specToEdit = item;
    },
    editSpecConfirm() {
      this.addingSpec = true;
      this.editCateSpecAsync(this.toEditParams)
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
          this.dialogEdit = false;
          this.editingSpec = false;
        });
    },
    addItemToSpecToEdit() {
      this.$set(
        this.specToEdit,
        'specItem',
        R.append(
          {
            itemName: '',
          },
          this.specToEdit.specItem
        )
      );
    },
    deleteItemFromSpecToEdit(i) {
      this.$set(
        this.specToEdit,
        'specItem',
        R.remove(i, 1, this.specToEdit.specItem)
      );
    },
    // 添加规格
    addSpecConfirm() {
      this.addingSpec = true;
      this.addCateSpecAsync(this.toAddParams)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.resetSpecToAdd();
          this.getCateSpecList();
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.addingSpec = false;
          this.dialogAdd = false;
        });
    },
    addItemToSpecToAdd() {
      this.$set(
        this.specToAdd,
        'specItem',
        R.append(
          {
            itemName: '',
          },
          this.specToAdd.specItem
        )
      );
    },
    deleteItemFromSpecToAdd(i) {
      this.$set(
        this.specToAdd,
        'specItem',
        R.remove(i, 1, this.specToAdd.specItem)
      );
    },
    // 获取规格列表
    getCateSpecList() {
      this.loadingDataItems = true;
      this.getCateSpecListAsync({
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
    // 删除规格
    openDialogDelete(item, i) {
      this.dialogDelete = true;
      this.specToDelete = item;
      this.specToDelete.index = i;
    },
    deleteSpecConfirm() {
      this.deletingCate = true;
      this.deleteCateSpecAsync({
        id: this.specToDelete.id,
        categoryId: this.specToDelete.categoryId,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.dataItems = R.remove(this.specToDelete.index, 1, this.dataItems);
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.dialogDelete = false;
          this.deletingCate = false;
        });
    },
    // 重置添加规格
    resetSpecToAdd() {
      this.specToAdd = {
        sort: 99,
        attrItem: [
          {
            itemName: '',
          },
        ],
      };
    },
  },
};
</script>
