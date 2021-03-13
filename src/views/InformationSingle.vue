<template>
  <div>
    <v-card
      class="mb-4"
      outlined
    >
      <v-card-title class="title grey lighten-3 pa-4">
        {{ id ? '编辑' : '添加' }}信息
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
              cols="auto"
              class="text-right"
            >
              信息标题：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="info.dnames"
                :rules="nameRules"
                placeholder="请输入信息标题"
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
              cols="auto"
              class="text-right"
            >
              信息类别：
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="info.categoryId"
                :items="infoCategories.data"
                :loading="loadingCategories"
                item-value="id"
                item-text="dnames"
                placeholder="请选择信息类别"
                single-line
                hide-details
                dense
                outlined
                no-data-text="暂无数据"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card
      outlined
      elevation="0"
      class="mb-4"
    >
      <v-card-title class="pa-3 grey lighten-3 title">
        信息描述
      </v-card-title>
      <component
        :is="component"
        :content="info.content"
        @update:html="info.content = $event"
      />
    </v-card>
    <v-btn
      :loading="submitting"
      :disabled="submitting"
      color="primary"
      class="px-12 body-1"
      @click="addOrEditInfo"
    >
      提交
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import WangEditor from '@/components/WangEditor.vue';

export default {
  name: 'InformationSingle',
  props: {
    id: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      component: null,
      loadingCategories: false,
      info: {
        dnames: '',
        content: '',
      },
      valid: true,
      submitting: false,
      nameRules: [v => !!v || '请填写信息标题'],
    };
  },
  computed: {
    ...mapState('information', ['infoCategories', 'infoList']),
  },
  created() {
    this.component = WangEditor;
    if (!this.infoCategories.status) {
      this.getInfoCategories();
    }
    if (!this.infoList.status) {
      this.getInfoListAsync().then(() => {
        if (this.id) {
          this.info = this.infoList.data.find(item => item.id === this.id);
        }
      }).catch((err) => {
        this.checkErr(err, 'getInfoListAsync');
      });
    }
    if (this.id) {
      this.info = this.item;
    }
  },
  methods: {
    ...mapActions('information', ['getInfoListAsync', 'addInfoAsync', 'editInfoAsync', 'getInfoCategoriesAsync']),
    getInfoCategories() {
      if (!this.infoCategories.status) {
        this.loadingCategories = true;
        this.getInfoCategoriesAsync().catch((err) => {
          this.checkErr(err, 'getInfoCategories');
        }).finally(() => {
          this.loadingCategories = false;
        });
      }
    },
    addOrEditInfo() {
      this.submitting = true;
      if (this.id) {
        this.editInfoAsync(this.info).then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，编辑成功!',
          });
          this.$router.back();
        }).catch((err) => {
          this.checkErr(err);
        }).finally(() => {
          this.submitting = false;
        });
      } else {
        this.addInfoAsync(this.info).then(() => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'success',
            text: '恭喜，添加成功!',
          });
          this.$router.back();
        }).catch((err) => {
          this.checkErr(err);
        }).finally(() => {
          this.submitting = false;
        });
      }
    },
  },
};
</script>
