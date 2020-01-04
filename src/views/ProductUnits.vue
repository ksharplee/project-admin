<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      单位列表
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加单位
      </v-btn>
    </div>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="productUnits.data"
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
                {{ item.dnames }}
              </td>

              <td>{{ item.enDnames }}</td>
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
                      @click="dialogDelete = true;toDeleteUnit = item.id"
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
    <units-single
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
            @click="deleteUnits"
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
import UnitsSingle from '@/components/UnitsSingle.vue';

export default {
  name: 'ProductUnits',
  components: { UnitsSingle },
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteUnit: '',
      edit: true,
      target: {},
      headers: [
        {
          text: '排序',
          value: 'sort',
          align: 'center',
          sortable: false,
        },
        {
          text: '中文名称',
          value: 'dnames',
          align: 'center',
          sortable: false,
        },
        {
          text: '英文名称',
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
    ...mapState('product', ['productUnits']),
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
        text: '单位列表',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.productUnits.status) {
    this.$store.commit('START_LOADING');
    this.getUnitsList();
    // }
  },
  methods: {
    ...mapActions('product', ['getUnitsListAsync', 'deleteUnitsAsync']),
    // 获取单位列表
    getUnitsList(params) {
      this.loadingDataItems = true;
      this.getUnitsListAsync(params)
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 删除单位
    deleteUnits() {
      this.deleting = true;
      this.deleteUnitsAsync({ id: this.toDeleteUnit })
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
