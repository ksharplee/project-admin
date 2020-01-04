<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加仓库
      </v-card-title>
      <v-card-text class="pt-4 black--text body-1">
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              <span class="error--text">*</span>仓库名称：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="warehouse.dnames"
                :rules="nameRules"
                placeholder="请输入仓库名称"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              排序：
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="warehouse.sort"
                :rules="nameRules"
                placeholder="请输入仓库序号"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="3"
              class="text-right"
            >
              设为默认：
            </v-col>
            <v-col cols="6">
              <v-checkbox
                :value="warehouse.isDefault === '1'"
                label="设为默认"
                hide-details
                class="mt-0"
                color="primary"
                dense
                @change="changeDefault"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="primary"
          :loading="submitting"
          :disabled="submitting || !valid"
          @click="addOrEditWarehouse"
        >
          提交
        </v-btn>
        <v-btn
          color="secondary"
          @click="$emit('close-dialog')"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as R from 'ramda';
import { mapActions } from 'vuex';

export default {
  name: 'WarehouseSingle',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      valid: true,
      submitting: false,
      warehouse: {
        dnames: '',
        sort: '99',
        isDefault: '0',
      },
      nameRules: [v => !!v || '请填写仓库名称'],
    };
  },
  computed: {
  },
  watch: {
    show() {
      if (this.edit) {
        this.warehouse = R.clone(this.target);
      } else {
        this.warehouse = {
          dnames: '',
          sort: '99',
          isDefault: '0',
        };
      }
    },
  },
  methods: {
    ...mapActions('warehouse', ['addWarehouseAsync', 'editWarehouseAsync']),
    changeDefault(v) {
      if (v) {
        this.$set(this.warehouse, 'isDefault', '1');
      } else {
        this.$set(this.warehouse, 'isDefault', '0');
      }
    },
    addOrEditWarehouse() {
      this.submitting = true;
      if (this.edit) {
        this.editWarehouseAsync({ ...this.warehouse })
          .then(() => {
            this.$store.commit('TOGGLE_SNACKBAR', {
              type: 'success',
              text: '恭喜，修改成功!',
            });
            this.$emit('close-dialog');
          })
          .catch((err) => {
            this.checkErr(err, 'addCustomer');
          })
          .finally(() => {
            this.submitting = false;
          });
      } else {
        this.addWarehouseAsync({ ...this.warehouse })
          .then(() => {
            this.$store.commit('TOGGLE_SNACKBAR', {
              type: 'success',
              text: '恭喜，添加成功!',
            });
            this.$emit('close-dialog');
          })
          .catch((err) => {
            this.checkErr(err, 'addCustomer');
          })
          .finally(() => {
            this.submitting = false;
          });
      }
    },
  },
};
</script>
