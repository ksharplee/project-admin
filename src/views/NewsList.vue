<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      新闻列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{name: 'news_add'}"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加新闻
      </v-btn>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="newsList.data.items"
        :loading="loadingDataItems"
        class="text-center"
        no-data-text="暂无数据"
        loading-text="加载中，请稍候..."
        disable-pagination
        hide-default-footer
        :items-per-page="20"
      >
        <template v-slot:item.dnames="{ item }">
          <div class="text-left">
            {{ item.dnames }}
          </div>
        </template>
        <template v-slot:item.dnamesEn="{ item }">
          <div class="text-left">
            {{ item.dnamesEn }}
          </div>
        </template>
        <template v-slot:item.summary="{ item }">
          <div class="text-left">
            {{ item.summary }}
          </div>
        </template>
        <template v-slot:item.summaryEn="{ item }">
          <div class="text-left">
            {{ item.summaryEn }}
          </div>
        </template>
        <template v-slot:item.image="{ item }">
          <div class="py-3">
            <v-img
              :src="
                item.image
                  ? `${item.image}?x-oss-process=image/resize,m_fill,w_100,h_100`
                  : require('@/assets/imgWaiting.png')
              "
              aspect-ratio="1.5"
              class="grey lighten-1"
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
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{name: 'news_edit', params: {id: item.id, item}}"
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
                :disabled="item.isRequire === '1'"
                v-on="on"
                @click="dialogDelete = true;toDeleteInfo = item.id"
              >
                <v-icon color="secondary">
                  mdi-delete-forever
                </v-icon>
              </v-btn>
            </template>
            <span>删除</span>
          </v-tooltip>
        </template>
        <template v-slot:footer>
          <v-divider />
          <div
            v-if="newsList.status && newsList.data.items.length"
            class="pa-4 d-flex align-center justify-end text-no-wrap body-1"
          >
            <div class="mr-2">
              共<span class="error--text">{{ newsList.data.totalItem }}</span>客户
            </div>
            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              @input="changePagination"
            />
            <div class="mx-2">
              跳至
            </div>
            <div style="width:50px">
              <input
                v-model="pageEnter"
                type="text"
                class="width-100 px-2 text-center"
                style="height:30px;border:1px solid #ddd;max-width:100%;border-radius:3px"
                @keyup.enter="changePaginationDirectly"
              >
            </div>
            <div class="ml-2">
              页
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
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
            @click="deleteInfo"
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
import * as R from 'ramda';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NewsList',
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteInfo: '',
      edit: true,
      target: {},
      headers: [
        {
          text: '图片',
          value: 'image',
          align: 'center',
          sortable: false,
          width: 170,
        },
        {
          text: '标题',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '英文标题',
          value: 'dnamesEn',
          align: 'center',
          sortable: false,
        },
        {
          text: '简述',
          value: 'summary',
          align: 'center',
          sortable: false,
        },
        {
          text: '英文简述',
          value: 'summaryEn',
          align: 'center',
          sortable: false,
        },
        {
          text: '操作',
          value: 'action',
          align: 'right',
          sortable: false,
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('information', ['newsList']),
    page: {
      set(value) {
        this.newsList.data.p = value;
      },
      get() {
        return +this.newsList.data.p;
      },
    },
    pageCount() {
      if (
        process.env.VUE_APP_PAGESIZE == null
        || this.newsList.data.totalItem == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.newsList.data.totalItem / process.env.VUE_APP_ITEMPERPAGE
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
        text: '新闻列表',
        disabled: true,
        exact: true,
      },
    ]);
    if (!this.newsList.status) {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      this.getNewsListAsync().catch((err) => {
        this.checkErr(err);
      })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    }
  },
  methods: {
    ...mapActions('information', ['getNewsListAsync', 'deleteNewsAsync']),
    changePaginationDirectly() {
      if (R.is(Number, this.pageEnter)) {
        if (this.pageEnter <= this.pageCount) {
          this.page = this.pageEnter;
        } else {
          this.pageEnter = this.pageCount;
        }
        this.getCustomerList();
      } else {
        this.pageEnter = 1;
      }
    },
    changePagination() {
      this.getCustomerList();
    },
    // 删除新闻
    deleteInfo() {
      this.deleting = true;
      this.deleteInfoAsync({ id: this.toDeleteInfo })
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
