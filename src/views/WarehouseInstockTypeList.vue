<template>
  <div>
    <v-card>
      <v-card-title>
        入库类型列表
        <v-btn
          color="primary"
          class="ml-auto"
          depressed
          @click="dialogSingle = true;edit = false"
        >
          <v-icon left>
            mdi-plus
          </v-icon>添加入库类型
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="warehouseInstockTypeList.data.items"
          :loading="loadingDataItems"
          loading-text="加载中..."
          no-data-text="暂无数据"
          hide-default-footer
          fixed-header
          :items-per-page="20"
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
                  @click="dialogDelete = true;toDeleteWarehouseType = item.id"
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
    <warehouse-instock-type-single
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
            @click="deleteWarehouseInstockType"
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
import WarehouseInstockTypeSingle from '@/components/WarehouseInstockTypeSingle.vue';

export default {
  name: 'WarehouseList',
  components: { WarehouseInstockTypeSingle },
  data() {
    return {
      loadingDataItems: false,
      loadingCustomerGrade: false,
      dialogSingle: false,
      dialogDelete: false,
      dialogSetGrade: false,
      deleting: false,
      settingGrade: false,
      toDeleteWarehouseType: '',
      edit: true,
      valid: true,
      target: {},
      search: {},
      toSetGradeItem: {},
      headers: [
        {
          text: '入库类型名称',
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
    ...mapState('warehouse', ['warehouseInstockTypeList']),
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
        text: '入库类型',
        disabled: true,
        exact: true,
      },
    ]);
    this.getWarehouseIntockTypeList();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseInstockTypeListAsync', 'deleteWarehouseInstockTypeAsync']),
    getWarehouseIntockTypeList() {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      this.getWarehouseInstockTypeListAsync().catch((err) => {
        this.checkErr(err, 'getWarehouseIntockTypeList');
      }).finally(() => {
        this.loadingDataItems = false;
        this.$store.commit('END_LOADING');
      });
    },
    // 删除入库类型
    deleteWarehouseInstockType() {
      this.deleting = true;
      this.deleteWarehouseInstockTypeAsync({ id: this.toDeleteWarehouseType })
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
