<template>
  <div>
    <div class="title d-flex flex-wrap align-center pb-3">
      订单流程
      <v-btn
        color="primary"
        class="ml-auto"
        depressed
        @click="dialogSingle = true;edit = false"
      >
        <v-icon left>
          mdi-plus
        </v-icon>添加订单流程
      </v-btn>
    </div>

    <v-card
      outlined
      elevation="0"
    >
      <v-data-table
        :headers="headers"
        :items="orderSequence.data"
        class="text-center"
        no-data-text="暂无数据"
        hide-default-footer
        fixed-header
        :items-per-page="20"
      >
        <template v-slot:item.isDefault="{ item }">
          <v-chip
            v-if="item.isDefault === '1'"
            color="error"
            small
          >
            默认
          </v-chip>
        </template>
        <template v-slot:item.flowType="{ item }">
          {{ item.flowType === '1' ? '订货单流程' : '退货单流程' }}
        </template>
        <template v-slot:item.flowContentDesc="{ item }">
          {{ item.flowContentDesc | flowContentFilter }}
        </template>
        <template v-slot:item.flowDescription="{ item }">
          {{ item.flowDescription }}
        </template>
        <template v-slot:item.isDelete="{ item }">
          <div :class="item.isDelete === '1' ? 'grey--text' : 'success--text'">
            {{ item.isDelete === '1' ? '禁用' : '启用' }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-1"
                :disabled="item.processId === '0'"
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
                :disabled="item.processId === '0'"
                v-on="on"
                @click="dialogDisable = true;toDisableSequence = item"
              >
                <v-icon color="secondary">
                  {{ item.isDelete === '1' ? 'mdi-radiobox-blank' : 'mdi-radiobox-marked' }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ item.isDelete === '1' ? '启用' : '禁用' }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <order-sequence-single
      :edit="edit"
      :target="target"
      :show="dialogSingle"
      @close-dialog="dialogSingle = false"
    />
    <v-dialog
      v-model="dialogDisable"
      max-width="350"
    >
      <v-card>
        <v-card-title class="title grey lighten-3 pa-4">
          确定{{ toDisableSequence.isDelete === '1' ? '启用' : '禁用' }}<span class="primary--text">{{ toDisableSequence.flowName }}</span>吗?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="primary"
            :loading="disabling"
            :disabled="disabling"
            @click="disableOrderSequence"
          >
            提交
          </v-btn>
          <v-btn
            color="secondary"
            @click="dialogDisable = false"
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
import { mapActions, mapState } from 'vuex';
import OrderSequenceSingle from '@/components/OrderSequenceSingle.vue';

export default {
  name: 'OrderSequenceList',
  components: { OrderSequenceSingle },
  // filters: {
  //   flowContentFilter: (v) => {
  //     if (v) {
  //       return R.join(' --> ', R.split(',', v));
  //     }
  //     return '无';
  //   },
  // },
  data() {
    return {
      loadingDataItems: false,
      dialogSingle: false,
      dialogDisable: false,
      disabling: false,
      toDisableSequence: {},
      edit: true,
      target: {},
      options: [
        {
          text: '是',
          value: '1',
        },
        {
          text: '否',
          value: '0',
        },
      ],
      headers: [
        {
          text: '流程类型',
          value: 'flowType',
          align: 'center',
          sortable: false,
        },
        {
          text: '名称',
          value: 'flowName',
          align: 'center',
          sortable: false,
        },
        {
          text: '描述',
          value: 'flowDescription',
          align: 'center',
          sortable: false,
        },
        {
          text: '内容',
          value: 'flowContentDesc',
          align: 'center',
          sortable: false,
          width: '500px',
        },
        {
          text: '默认',
          value: 'isDefault',
          align: 'center',
          sortable: false,
        },
        {
          text: '状态',
          value: 'isDelete',
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
    ...mapState('system', ['orderSequence']),
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
        text: '订单处理流程',
        disabled: true,
        exact: true,
      },
    ]);
    // if (!this.orderSequence.status) {
    this.$store.commit('START_LOADING');
    this.orderSequenceList();
    // }
  },
  methods: {
    ...mapActions('system', [
      'orderSequenceListAsync',
      'disableOrderSequenceAsync',
    ]),
    // 获取订单流程列表
    orderSequenceList(params) {
      this.loadingDataItems = true;
      this.orderSequenceListAsync(params)
        .then((res) => {
          this.dataItems = res;
        })
        .catch((err) => {
          this.checkErr(err, 'orderSequenceList');
        })
        .finally(() => {
          this.$store.commit('END_LOADING');
          this.loadingDataItems = false;
        });
    },
    // 禁用/启用订单流程
    disableOrderSequence() {
      this.disabling = true;
      this.disableOrderSequenceAsync({
        id: this.toDisableSequence.id,
        isDelete: this.toDisableSequence.isDelete === '1' ? '0' : '1',
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，操作成功!',
          });
        })
        .catch((err) => {
          this.checkErr(err, 'deleteCustomerShipping');
        })
        .finally(() => {
          this.disabling = false;
          this.dialogDisable = false;
        });
    },
  },
};
</script>
