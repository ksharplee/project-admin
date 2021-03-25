<template>
  <v-dialog
    :value="show"
    persistent
    max-width="600"
    @click:outside="$emit('close-dialog')"
  >
    <v-card>
      <v-card-title class="title grey lighten-3 pa-4">
        添加国家
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
              国家名称：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="country.dnames"
                :rules="nameRules"
                placeholder="请输入国家关键字"
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
              国家英文名称：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="country.dnamesEn"
                :rules="nameRules"
                placeholder="请输入国家关键字"
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
              汇率：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="country.rate"
                :rules="rateRules"
                placeholder="请输入汇率"
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
              币种：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="country.currency"
                :rules="currencyRules"
                placeholder="请输入币种"
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
            />
            <v-col cols="5">
              <v-checkbox
                v-model="country.isDefalut"
                color="primary"
                class="mt-0"
                hide-details
                label="设为默认"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          :loading="submitting"
          :disabled="submitting"
          color="primary"
          @click="addOrEditCountry"
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
  name: 'CountrySingle',
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
      country: {
        languageType: '2',
        isDefalut: false,
      },
      languageType: [
        {
          value: '1',
          text: '阿拉伯语',
        },
        {
          value: '2',
          text: '英语',
        },
      ],
      nameRules: [v => !!v || '请填写国家名称'],
      rateRules: [v => !!v || '请填写汇率'],
      currencyRules: [v => !!v || '请填写币种'],
    };
  },
  watch: {
    show() {
      if (this.edit) {
        this.country = R.clone(this.target);
        if (this.country.isDefalut === '1') {
          this.$set(this.country, 'isDefalut', true);
        } else {
          this.$set(this.country, 'isDefalut', false);
        }
      } else {
        this.country = {
          languageType: '2',
          isDefalut: false,
        };
      }
    },
  },
  created() {},
  methods: {
    ...mapActions('system', ['addCountryAsync', 'editCountryAsync']),
    addCountry() {
      this.submitting = true;
      const params = R.clone(this.country);
      if (params.isDefalut) {
        params.isDefalut = '1';
      } else {
        params.isDefalut = '0';
      }
      this.addCountryAsync({ ...params, edit: this.edit })
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.country = {
            languageType: '2',
          };
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
          this.$emit('close-dialog');
        });
    },
    editCountry() {
      this.submitting = true;
      const params = R.clone(this.country);
      if (params.isDefalut) {
        params.isDefalut = '1';
      } else {
        params.isDefalut = '0';
      }
      this.editCountryAsync(params)
        .then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: `恭喜，${this.edit ? '修改' : '添加'}成功!`,
          });
          this.country = {
            languageType: '2',
          };
        })
        .catch((err) => {
          this.checkErr(err);
        })
        .finally(() => {
          this.submitting = false;
          this.$emit('close-dialog');
        });
    },
    addOrEditCountry() {
      if (this.edit) {
        this.editCountry();
      } else {
        this.addCountry();
      }
    },
  },
};
</script>
