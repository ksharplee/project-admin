<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      品牌列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加品牌
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
              <span class="input-group-text">品牌名称</span>
            </div>
            <div class="input-group-control">
              <v-text-field
                v-model="search.dnames"
                placeholder="请输入品牌名称搜索"
                outlined
                class="white"
                single-line
                clearable
                hide-details
                dense
                @click:clear="clearSearchConditions('dnames')"
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
              <span class="input-group-text">是否启用</span>
            </div>
            <div class="input-group-control">
              <v-select
                v-model="search.isUse"
                :items="useOptions"
                placeholder="请选择是否启用"
                class="white"
                single-line
                outlined
                clearable
                no-data-text="暂无数据"
                dense
                hide-details
                @click:clear="clearSearchConditions('isUse')"
              />
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-btn
            color="primary mr-2"
            depressed
            @click="searchBrand"
          >
            搜索
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            @click="resetSearchConditions"
          >
            重置
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card
      outlined
      elevation="1"
    >
      <v-data-table
        :headers="headers"
        :items="productBrand.data.items"
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
              <td>{{ item.sort }}</td>
              <td class="pa-3">
                <v-img
                  :src="item.image ? item.image : require('@/assets/imgWaiting.png')"
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
              <td>{{ item.dnames }}</td>
              <td :class="item.isUse === '0' ? 'grey--text' : 'success--text'">
                {{ item.isUse === '0' ? '否' : '是' }}
              </td>
              <td>{{ item.desc }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      v-on="on"
                      @click="target = item;edit = true;dialogSingle = true"
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
                      @click="dialogDelete = true;toDeleteBrand = item.id"
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
    <brand-single
      :edit="edit"
      :target="target"
      :show="dialogSingle"
      @close-dialog="dialogSingle = false"
    />
    <v-dialog
      v-model="dialogDelete"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定删除吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="deleting"
            :disabled="deleting"
            @click="deleteBrand"
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
  </div>
</template>

<script>
// import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';
import BrandSingle from '@/components/BrandSingle.vue';

export default {
  name: 'ProductBrand',
  components: { BrandSingle },
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteBrand: '',
      edit: true,
      target: {},
      search: {},
      headers: [
        {
          text: '排序',
          value: 'sort',
          align: 'center',
          sortable: false,
        },
        {
          text: '品牌图片',
          value: 'image',
          align: 'center',
          sortable: false,
        },
        {
          text: '品牌名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '是否启用',
          value: 'isUse',
          align: 'center',
          sortable: false,
        },
        {
          text: '品牌描述',
          value: 'desc',
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
      useOptions: [
        {
          text: '启用',
          value: '1',
        },
        {
          text: '停用',
          value: '0',
        },
      ],
    };
  },
  computed: {
    ...mapState('product', ['productBrand']),
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
        text: '品牌列表',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.productBrand.status) {
    this.$store.commit('START_LOADING');
    this.getBrandList();
    // }
  },
  methods: {
    ...mapActions('product', ['getBrandListAsync', 'deleteBrandAsync']),
    // 获取品牌列表
    getBrandList(params) {
      this.loadingDataItems = true;
      this.getBrandListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 删除品牌
    deleteBrand() {
      this.deleting = true;
      this.deleteBrandAsync({ id: this.toDeleteBrand })
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
    searchBrand() {
      this.getBrandList(this.search);
    },
    clearSearchConditions(target) {
      this.search[target] = '';
      this.getBrandList(this.search);
    },
    resetSearchConditions() {
      this.$refs.form.reset();
      this.getBrandList();
    },
  },
};
</script>
