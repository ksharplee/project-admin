<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      出库类型列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加出库类型
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="warehouseOutstockTypeList.data.items"
      :loading="loadingDataItems"
      loading-text="加载中..."
      no-data-text="暂无数据"
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
    <warehouse-outstock-type-single
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
            @click="deleteWarehouseOutstockType"
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
import WarehouseOutstockTypeSingle from '@/components/WarehouseOutstockTypeSingle.vue';

export default {
  name: 'WarehouseList',
  components: { WarehouseOutstockTypeSingle },
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
          text: '出库类型名称',
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
    ...mapState('warehouse', ['warehouseOutstockTypeList']),
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
        text: '出库类型',
        disabled: true,
        exact: true,
      },
    ]);
    this.getWarehouseOutstockTypeList();
  },
  methods: {
    ...mapActions('warehouse', ['getWarehouseOutstockTypeListAsync', 'deleteWarehouseOutstockTypeAsync']),
    getWarehouseOutstockTypeList() {
      this.$store.commit('START_LOADING');
      this.loadingDataItems = true;
      this.getWarehouseOutstockTypeListAsync().catch((err) => {
        this.checkErr(err, 'getWarehouseOutstockTypeList');
      }).finally(() => {
        this.loadingDataItems = false;
        this.$store.commit('END_LOADING');
      });
    },
    // 删除出库类型
    deleteWarehouseOutstockType() {
      this.deleting = true;
      this.deleteWarehouseOutstockTypeAsync({ id: this.toDeleteWarehouseType })
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
