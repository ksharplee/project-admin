<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      信息列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        :to="{name: 'information_add'}"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加信息
      </v-btn>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="infoList.data"
        :loading="loadingDataItems"
        class="text-center"
        no-data-text="暂无数据"
        loading-text="加载中，请稍候..."
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :to="{name: 'information_edit', params: {id: item.id, item}}"
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'InformationList',
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
          text: '标题',
          value: 'dnames',
          align: 'left',
          sortable: false,
        },
        {
          text: '类别',
          value: 'categoryName',
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
    ...mapState('information', ['infoList']),
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
        text: '信息列表',
        disabled: true,
        exact: true,
      },
    ]);
    if (!this.infoList.status) {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      this.getInfoListAsync().catch((err) => {
        this.checkErr(err);
      })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    }
  },
  methods: {
    ...mapActions('information', ['getInfoListAsync', 'deleteInfoAsync']),
    // 删除信息
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
