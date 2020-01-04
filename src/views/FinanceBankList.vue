<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      银行列表设置
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加银行
      </v-btn>
    </div>

    <v-card
      outlined
      elevation="0"
    >
      <v-data-table
        :headers="headers"
        :items="bankList.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:item.logo="{ item }">
          <div class="py-3">
            <v-img
              :src="item.logo ? item.logo : require('@/assets/imgWaiting.png')"
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
          </div>
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
                @click="dialogDelete = true;toDeleteBank = item.id"
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
    <finance-bank-single
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
            @click="deleteBank"
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
import FinanceBankSingle from '@/components/FinanceBankSingle.vue';

export default {
  name: 'FinanceBankList',
  components: { FinanceBankSingle },
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
      toDeleteBank: '',
      edit: true,
      target: {},
      headers: [
        {
          text: '图片',
          value: 'logo',
          align: 'center',
          sortable: false,
        },
        {
          text: '银行名称',
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
    ...mapState('finance', ['bankList']),
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
        text: '银行',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.bankList.status) {
    this.$store.commit('START_LOADING');
    this.getBankList();
    // }
  },
  methods: {
    ...mapActions('finance', ['getBankListAsync', 'deleteBankAsync']),
    getBankList(params) {
      this.loadingDataItems = true;
      this.getBankListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    deleteBank() {
      this.deleting = true;
      this.deleteBankAsync({ id: this.toDeleteBank })
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
