<template>
  <div>
    <v-card>
      <v-card-title>
        仓库列表
        <v-btn
          color="primary"
          class="ml-auto"
          depressed
          @click="dialogSingle = true;edit = false"
        >
          <v-icon left>
            mdi-plus
          </v-icon>添加仓库
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="warehouseList.data.items"
          :no-data-text="$store.state.loading ? '加载中...' : '暂无数据'"
          hide-default-footer
          fixed-header
        >
          <template v-slot:item.dnames="{ item }">
            {{ item.dnames }}
            <v-chip
              v-if="item.isDefault === '1'"
              color="error"
              class="ml-2"
              x-small
            >
              默认
            </v-chip>
          </template>
          <template v-slot:item.action="{ item }">
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
                  @click="dialogDelete = true;toDeleteWarehouse = item.id"
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
        <v-divider />
      </v-card-text>
    </v-card>
    <warehouse-single
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
            @click="deleteWarehouse"
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
import WarehouseSingle from '@/components/WarehouseSingle.vue';

export default {
  name: 'WarehouseList',
  components: { WarehouseSingle },
  data() {
    return {
      loadingDataItems: false,
      loadingCustomerGrade: false,
      dialogSingle: false,
      dialogDelete: false,
      dialogSetGrade: false,
      deleting: false,
      settingGrade: false,
      toDeleteWarehouse: '',
      edit: true,
      valid: true,
      target: {},
      search: {},
      toSetGradeItem: {},
      headers: [
        {
          text: '仓库名称',
          value: 'dnames',
          align: 'left',
          sortable: false,
        },
        {
          text: '操作',
          value: 'action',
          align: 'center',
          width: '120px',
          sortable: false,
        },
      ],
      useOptions: [
        {
          text: '启用',
          value: '0',
        },
        {
          text: '停用',
          value: '1',
        },
      ],
      pageEnter: 1,
    };
  },
  computed: {
    ...mapState('warehouse', ['warehouseList']),
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
        text: '仓库列表',
        disabled: true,
        exact: true,
      },
    ]);
    this.getWarehouseList();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseListAsync', 'deleteWarehouseAsync']),
    getWarehouseList() {
      this.$store.commit('START_LOADING');
      this.getWarehouseListAsync().catch((err) => {
        this.checkErr(err, 'getWarehouseList');
      }).finally(() => {
        this.$store.commit('END_LOADING');
      });
    },
    // 删除仓库
    deleteWarehouse() {
      this.deleting = true;
      this.deleteWarehouseAsync({ id: this.toDeleteWarehouse })
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
