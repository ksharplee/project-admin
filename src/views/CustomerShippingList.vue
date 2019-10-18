<template>
  <div>
    <v-card :loading="loadingDataItems">
      <v-card-title class="title grey lighten-3 pa-4 d-flex flex-wrap align-center">
        客户收货地址列表
        <!-- <span
          v-if="array && array.length"
          class="body-1 ml-3 grey--text"
        >当前选择收货地址：<span class="primary--text">{{ selectedShippingAddress | addressStr }}</span></span> -->
        <v-btn
          color="primary"
          class="ml-auto"
          outlined
          small
          @click="dialogSingle = true;edit = false"
        >
          <v-icon left>
            mdi-plus
          </v-icon>添加收货地址
        </v-btn>
        <v-slide-x-transition>
          <v-btn
            v-if="array.length && dataItems.length > 1"
            color="secondary"
            class="ml-2"
            outlined
            small
            @click="toggleShippingList = !toggleShippingList"
          >
            {{ toggleShippingList ? '展开' : '收起' }}
            <v-icon right>
              {{ toggleShippingList ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
            </v-icon>
          </v-btn>
        </v-slide-x-transition>
      </v-card-title>
      <v-container fluid>
        <div v-if="!dataItems.length && !loadingDataItems">
          暂无收货地址，<a @click="dialogSingle = true;edit = false">马上添加</a>
        </div>
        <div
          v-else
          :style="{ height: toggleShippingList ? '65px' : 'auto'}"
          class="overflow-hidden"
        >
          <v-radio-group
            v-model="selectedShippingAddress"
            class="my-0 "
            dense
            hide-details
          >
            <v-alert
              v-for="(item, i) in dataItems"
              :key="item.id"
              :color="item.id === selectedShippingAddress.id ? 'primary' : 'secondary'"
              border="left"
              outlined
              text
              dense
            >
              <v-container
                fluid
                class="py-0"
              >
                <v-row align="center">
                  <!-- <v-col cols="1">
                  <v-icon :color="item.isDefault === '1' ? 'primary' : 'grey'">
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </v-col> -->
                  <v-col
                    v-if="array && array.length"
                    class="py-0"
                    cols="1"
                  >
                    <v-radio
                      :value="item"
                      color="primary"
                      @change="getSelectedShippingAddress(i)"
                    />
                  </v-col>
                  <v-col
                    class="py-0"
                    cols="1"
                  >
                    {{ item.contacter }}
                  </v-col>
                  <v-col
                    class="py-0"
                    cols="2"
                  >
                    {{ item.mobile }}
                  </v-col>
                  <v-col
                    class="py-0"
                    cols="6"
                  >
                    {{ item | addressStr }}
                  </v-col>
                  <v-col
                    class="py-0"
                    cols="1"
                  >
                    <v-chip
                      v-if="item.isDefault === '1'"
                      class="ma-2"
                      color="error"
                      text-color="white"
                      x-small
                    >
                      默认
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="auto"
                    class="py-0 ml-auto"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          class="mx-1"
                          small
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
                          small
                          v-on="on"
                          @click="dialogDelete = true;toDeleteShipping = item.id"
                        >
                          <v-icon color="secondary">
                            mdi-delete-forever
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>删除</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-container>
            </v-alert>
          </v-radio-group>
        </div>
      </v-container>
    </v-card>
    <shipping-single
      :buyer-id="id ? id : array.length ? array[0].buyerId : ''"
      :buyer-uid="uid ? uid : array.length ? array[0].buyerUid : ''"
      :edit="edit"
      :target="target"
      :show="dialogSingle"
      @update:reload="getCustomerShppingList({ buyerId: id ? id : array[0].buyerId })"
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
            @click="deleteCustomerShipping"
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
import { mapActions } from 'vuex';
import ShippingSingle from '@/components/ShippingSingle.vue';

export default {
  name: 'CustomerShippingList',
  components: { ShippingSingle },
  props: {
    id: {
      type: String,
      default: '',
    },
    uid: {
      type: String,
      default: '',
    },
    component: {
      type: Boolean,
      default: false,
    },
    array: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loadingDataItems: false,
      toggleShippingList: false,
      dialogSingle: false,
      dialogDelete: false,
      deleting: false,
      toDeleteShipping: '',
      edit: true,
      target: {},
      search: {},
      dataItems: [],
      selectedShippingAddress: {},
    };
  },
  computed: {
    // sortedItems() {
    //   return R.sort((a, b) => b.isDefault - a.isDefault, this.dataItems);
    // },
  },
  watch: {
    array() {
      if (this.array.length) {
        this.getCustomerShppingList({ buyerId: this.array[0].buyerId });
      }
    },
    selectedShippingAddress() {
      this.$emit('update:selectedAddress', this.selectedShippingAddress);
    },
  },
  created() {
    if (!this.component) {
      this.$store.commit('SET_BREADCRUMBS', [
        {
          text: '首页',
          disabled: false,
          to: { name: 'home' },
          exact: true,
        },
        {
          text: '客户列表',
          disabled: false,
          to: { name: 'customer_list' },
          exact: true,
        },
        {
          text: '收货地址列表',
          disabled: true,
          exact: true,
        },
      ]);
    }
    if (this.id) {
      this.getCustomerShppingList({
        buyerId: this.id,
      });
    } else {
      this.toggleShippingList = true;
    }
  },
  methods: {
    ...mapActions('customer', [
      'getCustomerShippingListAsync',
      'deleteCustomerShippingAsync',
    ]),
    // 获取客户收货地址列表
    getCustomerShppingList(params) {
      this.loadingDataItems = true;
      this.getCustomerShippingListAsync(params)
        .then((res) => {
          this.dataItems = res;
          this.selectedShippingAddress = R.find(
            R.propEq('isDefault', '1'),
            this.dataItems
          );
          this.$emit('update:selectedAddress', this.selectedShippingAddress);
        })
        .catch((err) => {
          this.checkErr(err, 'getCustomerShppingList');
        })
        .finally(() => {
          this.loadingDataItems = false;
        });
    },
    // 删除客户收货地址
    deleteCustomerShipping() {
      this.deleting = true;
      this.deleteCustomerShippingAsync({
        id: this.toDeleteShipping,
        buyerId: this.id ? this.id : this.array[0].buyerId,
        buyerUid: this.uid ? this.uid : this.array[0].buyerUid,
      })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，删除成功!',
          });
          this.getCustomerShppingList({
            buyerId: this.id ? this.id : this.array[0].buyerId,
          });
        })
        .catch((err) => {
          this.checkErr(err, 'deleteCustomerShipping');
        })
        .finally(() => {
          this.deleting = false;
          this.dialogDelete = false;
        });
    },
    getSelectedShippingAddress(i) {
      this.dataItems = R.move(i, 0, this.dataItems);
    },
  },
};
</script>
