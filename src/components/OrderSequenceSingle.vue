<template>
  <v-dialog
    :value="show"
    persistent
    max-width="1000"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        {{ edit ? '编辑' : '添加' }}订单流程
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
              cols="2"
              class="text-right"
            >
              <span class="error--text">*</span>流程类型：
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="sequence.flowType"
                :items="flowTypes"
                :rules="typeRules"
                placeholder="请选择流程类型"
                dense
                clearable
                outlined
                single-line
                hide-details
                no-data-text="暂无数据"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="2"
              class="text-right"
            >
              <span class="error--text">*</span>流程名称：
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="sequence.flowName"
                :rules="nameRules"
                placeholder="请输入流程名称"
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
              cols="2"
              class="text-right"
            >
              设为默认：
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="sequence.isDefault"
                :items="defaultOptions"
                dense
                clearable
                outlined
                single-line
                hide-details
                no-data-text="暂无数据"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="2"
              class="text-right"
            >
              描述：
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model="sequence.flowDescription"
                outlined
                value=""
                dense
                placeholder="请输入描述"
              />
            </v-col>
          </v-row>
          <v-row
            align="center"
            class="mb-3"
          >
            <v-col
              cols="2"
              class="text-right"
            >
              说明：
            </v-col>
            <v-col cols="8">
              <div class="d-flex mb-2">
                <v-icon
                  color="primary"
                  class="mr-1"
                >
                  mdi-checkbox-blank-circle mdi-18px
                </v-icon>表示此步骤不允许调整
                <v-icon
                  color="success"
                  class="mr-1 ml-2"
                >
                  mdi-checkbox-blank-circle mdi-18px
                </v-icon>表示已启用此步骤
                <v-icon
                  color="success"
                  class="mr-1 ml-2"
                >
                  mdi-checkbox-blank-circle-outline mdi-18px
                </v-icon>表示已禁用此步骤
              </div>
              <v-item-group
                v-model="actives"
                multiple
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="2"
                  >
                    <v-item v-slot:default="{ active, toggle }">
                      <div class="text-center">
                        <v-card
                          color="primary"
                          dark
                          class="rounded-circle mb-2"
                          elevation="0"
                        >
                          <v-responsive
                            :aspect-ratio="1"
                            class="d-flex align-center text-center"
                          >
                            <v-icon>mdi-inbox-arrow-up mdi-36px</v-icon>
                          </v-responsive>
                        </v-card>
                        提交订单
                      </div>
                    </v-item>
                  </v-col>
                  <v-col
                    v-for="(step, i) in steps"
                    :key="i"
                    cols="12"
                    md="2"
                  >
                    <v-item v-slot:default="{ active, toggle }">
                      <div class="text-center">
                        <v-card
                          class="rounded-circle mb-2"
                          :class="active ? 'success' : ''"
                          style="border: 2px solid #43A047"
                          elevation="0"
                          @click="toggle"
                        >
                          <v-responsive
                            :aspect-ratio="1"
                            class="d-flex align-center text-center"
                          >
                            <v-icon :class="active ? 'white--text' : 'grey--text'">
                              {{ step.icon }} mdi-36px
                            </v-icon>
                          </v-responsive>
                        </v-card>
                        {{ step.text }}
                      </div>
                    </v-item>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                  >
                    <v-item v-slot:default="{ active, toggle }">
                      <div class="text-center">
                        <v-card
                          color="primary"
                          dark
                          class="rounded-circle mb-2"
                          elevation="0"
                        >
                          <v-responsive
                            :aspect-ratio="1"
                            class="d-flex align-center text-center"
                          >
                            <v-icon>mdi-clipboard-check mdi-36px</v-icon>
                          </v-responsive>
                        </v-card>
                        完成
                      </div>
                    </v-item>
                  </v-col>
                </v-row>
              </v-item-group>
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
          @click="addOrEditOrderSequence"
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

const mapIndexed = R.addIndex(R.map);

export default {
  name: 'OrderSequenceSingle',
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
      actives: [],
      sequence: {
        flowType: '1',
        isDefault: '0',
      },
      typeRules: [v => !!v || '请选择订单流程'],
      nameRules: [v => !!v || '请填写流程名称'],
      flowTypes: [
        {
          text: '订货单流程',
          value: '1',
        },
        {
          text: '退货单流程',
          value: '2',
        },
      ],
      defaultOptions: [
        {
          text: '是',
          value: '1',
        },
        {
          text: '否',
          value: '0',
        },
      ],
      steps: [
        {
          text: '确认订单',
          icon: 'mdi-shield-check',
          value: true,
        },
        {
          text: '财务审核',
          icon: 'mdi-square-inc-cash',
          value: true,
        },
        {
          text: '确认发货',
          icon: 'mdi-package-up',
          value: true,
        },
        {
          text: '确认收货',
          icon: 'mdi-package-down',
          value: true,
        },
      ],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.sequence = R.clone(this.target);
      } else {
        this.sequence = {
          flowType: '1',
          isDefault: '0',
        };
      }
    },
    target() {
      let actives = [];
      this.actives = mapIndexed((item, i) => {
        if (item === '1') {
          actives = R.append(i + 1, actives);
        }
      }, R.slice(1, 5, this.target.flowContent));
      this.actives = actives;
    },
  },
  created() {},
  methods: {
    ...mapActions('system', ['addOrEditOrderSequenceAsync']),
    addOrEditOrderSequence() {
      this.submitting = true;
      const postData = this.sequence;
      const flowContent = mapIndexed(
        (item, i) => {
          if (R.includes(i + 1, this.actives)) {
            return 1;
          }
          return 0;
        },
        [0, 0, 0, 0]
      );
      postData.flowContent = R.join('', R.prepend(1, R.append(1, flowContent)));
      this.addOrEditOrderSequenceAsync(postData)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
        })
        .catch((err) => {
          this.checkErr(err, 'addOrEditOrderSequence');
        })
        .finally(() => {
          this.submitting = false;
          this.$emit('close-dialog');
        });
    },
  },
};
</script>
