<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      热搜设置
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加关键字
      </v-btn>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="productHotSearch.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
        :page.sync="page"
        @page-count="pageCount = $event"
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
            >
              <td class="pa-3">
                {{ item.dnames }}
              </td>
              <td class="pa-3">
                {{ item.isHot === '1' ? '是' : '否' }}
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="mx-1"
                      @click="target = item;edit = true;dialogSingle = true"
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
                      @click="dialogDelete = true;toDeleteHotSearch = item.id"
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
    <hot-search-single
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
            @click="deleteHotSearch"
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
import { mapState, mapActions } from 'vuex';
import HotSearchSingle from '@/components/HotSearchSingle.vue';

export default {
  name: 'ProductHotSearch',
  components: { HotSearchSingle },
  data() {
    return {
      page: 1,
      pageCount: 0,
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteHotSearch: '',
      edit: true,
      target: {},
      headers: [
        {
          text: '热搜关键字',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '是否首页显示',
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
    ...mapState('product', ['productHotSearch']),
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
        text: '热搜设置',
        disabled: true,
        exact: true,
      },
    ]);
    this.$store.commit('START_LOADING');
    this.getHotSearchList();
  },
  methods: {
    ...mapActions('product', ['getHotSearchListAsync', 'deleteHotSearchAsync']),
    getHotSearchList() {
      this.loadingDataItems = true;
      this.getHotSearchListAsync().catch((err) => {
        this.checkErr(err, 'getHotSearchList');
      })
        .finally(() => {
          this.loadingDataItems = false;
          this.$store.commit('END_LOADING');
        });
    },
    deleteHotSearch() {
      this.deleting = true;
      this.deleteHotSearchAsync({ id: this.toDeleteHotSearch })
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
