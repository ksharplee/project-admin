<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      发票类型管理
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加发票
      </v-btn>
    </div>

    <v-card
      outlined
      elevation="0"
    >
      <v-data-table
        :headers="headers"
        :items="invoiceList.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:item.isAdded="{ item }">
          {{ item.isAdded === '1' ? '增值税发票' : '普通发票' }}
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
                @click="dialogDelete = true;toDeleteInvoice = item.id"
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
    <finance-invoice-content
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
            @click="deleteInvoice"
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
import { mapState, mapActions } from 'vuex';
import FinanceInvoiceContent from '@/components/FinanceInvoiceContent.vue';

export default {
  name: 'FinanceInvoiceList',
  components: { FinanceInvoiceContent },
  filters: {
    locked(v) {
      if (v === '0') {
        return '启用';
      }
      return '停用';
    },
  },
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteInvoice: '',
      edit: true,
      target: {},
      headers: [
        {
          text: '名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '税率',
          value: 'invoiceTax',
          align: 'center',
          sortable: false,
        },
        {
          text: '类型',
          value: 'isAdded',
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
    ...mapState('finance', ['invoiceList']),
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
        text: '发票列表',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.invoiceList.status) {
    this.$store.commit('START_LOADING');
    this.getInvoiceList();
    // }
  },
  methods: {
    ...mapActions('finance', ['getInvoiceListAsync', 'deleteInvoiceAsync']),
    // 获取发票列表列表
    getInvoiceList(params) {
      this.loadingDataItems = true;
      this.getInvoiceListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 删除发票
    deleteInvoice() {
      this.deleting = true;
      this.deleteInvoiceAsync({ id: this.toDeleteInvoice })
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
