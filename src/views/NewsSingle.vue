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
              新闻大图：
            </v-col>
            <v-col cols="5">
              <img-upload-input
                :image="news.image"
                @update:src="$set(news, 'image', $event)"
                @update:delete="$set(news, 'image', '')"
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
              新闻标题：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="news.dnames"
                :rules="nameRules"
                placeholder="请输入新闻标题"
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
              英文标题：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="news.dnamesEn"
                :rules="nameRules"
                placeholder="请输入新闻英文标题"
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
              新闻简述：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="news.summary"
                placeholder="请输入新闻简述"
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
              英文简述：
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="news.summaryEn"
                placeholder="请输入新闻英文简述"
                dense
                outlined
                clearable
                required
                single-line
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
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
            :content="news.content"
            @update:html="news.content = $event"
          />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          outlined
          elevation="0"
          class="mb-4"
        >
          <v-card-title class="pa-3 grey lighten-3 title">
            信息英文描述
          </v-card-title>
          <component
            :is="componentEn"
            :content="news.contentEn"
            @update:html="news.contentEn = $event"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      :loading="submitting"
      :disabled="submitting"
      large
      color="primary"
      class="px-12 body-1"
      @click="addOrEditInfo"
    >
      提交
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import WangEditor from '@/components/WangEditor.vue';
import ImgUploadInput from '@/components/ImgUploadInput.vue';

export default {
  name: 'NewsSingle',
  components: {
    ImgUploadInput,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      component: null,
      componentEn: null,
      loadingCategories: false,
      news: {
        dnames: '',
        dnamesEn: '',
        content: '',
        contentEn: '',
      },
      valid: true,
      submitting: false,
      nameRules: [v => !!v || '请填写信息标题'],
    };
  },
  created() {
    if (this.id) {
      this.getNewsDetail();
    }
  },
  methods: {
    ...mapActions('information', ['getNewsListAsync', 'getNewsDetailAsync', 'addNewsAsync', 'editNewsAsync']),
    getNewsDetail() {
      this.getNewsDetailAsync({ id: this.id }).then((res) => {
        this.news = res;
        this.component = WangEditor;
        this.componentEn = WangEditor;
      }).catch((err) => {
        this.checkErr(err);
      });
    },
    addOrEditInfo() {
      this.submitting = true;
      if (this.id) {
        this.editNewsAsync(this.news).then(() => {
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
        this.addNewsAsync(this.news).then(() => {
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
