<template>
  <div class="img-uploader">
    <v-btn
      v-if="image && !disabled"
      color="dark"
      outlined
      icon
      x-small
      class="close elevation-0"
      @click="$emit('update:delete')"
    >
      <v-icon>mdi-close-circle mdi-24px</v-icon>
    </v-btn>
    <v-img
      :src="image"
      :aspect-ratio="aspectRatio"
      class="grey lighten-1 white--text d-flex align-center text-center rounded"
      :class="showInput ? 'rounded-bottom-0' : ''"
      style="`border:1px solid #ccc !important`"
      @click="getImgClick"
    >
      <template v-if="!image">
        <v-icon class="white--text">
          mdi-plus {{ `mdi-${iconSize}` }}
        </v-icon>
        <div
          v-if="bestSize"
          class="text-center"
        >
          图片最佳尺寸：{{ bestSize }}
        </div>
      </template>
      <template v-slot:placeholder>
        <v-row
          v-if="image"
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
    <v-file-input
      ref="uploader"
      outlined
      hide-details
      single-line
      dense
      prepend-icon=""
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
      append-icon="mdi-camera"
      accept="image/*"
      truncate-length="10"
      class="rounded-top-0"
      :class="showInput ? '' : 'input-hidden'"
      @change="getImg"
      @click:clear="$emit('update:delete')"
    />
    <v-dialog
      v-if="dialog"
      :value="true"
      persistent
      width="300"
    >
      <v-card
        dark
        color="white"
      >
        <v-progress-linear indeterminate />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Compressor from 'compressorjs';
import { mapActions } from 'vuex';

export default {
  name: 'ImgUpload',
  props: {
    aspectRatio: {
      type: String,
      default: '1',
    },
    image: {
      type: String,
      default: '',
    },
    bestSize: {
      type: String,
      default: '',
    },
    dir: {
      type: String,
      default: 'product',
    },
    iconSize: {
      type: String,
      default: '24px',
    },
    placeholder: {
      type: String,
      default: '选择图片',
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // height: {
    //   type: String,
    //   default: '150px',
    // },
  },
  data() {
    return {
      dialog: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(['uploadImgSync']),
    getImgClick() {
      this.$refs.uploader.$refs.input.click();
    },
    getImg(file) {
      if (!file) {
        return;
      }
      this.dialog = true;
      if (file.size > 4 * 1024 * 1024) {
        const that = this;
        // eslint-disable-next-line no-new
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            const postData = new FormData();
            postData.append('file', result);
            postData.append('dir', that.dir);
            that
              .uploadImgSync(postData)
              .then((res) => {
                that.$emit('update:src', res);
              })
              .catch((err) => {
                this.checkErr(err);
              })
              .finally(() => {
                that.dialog = false;
              });
          },
          error() {
            that.$store.commit('TOGGLE_SNACKBAR', {
              type: 'error',
              text: '请上传图片文件',
            });
            that.dialog = false;
          },
        });
      } else {
        const postData = new FormData();
        postData.append('file', file);
        postData.append('dir', this.dir);
        this.uploadImgSync(postData)
          .then((res) => {
            this.$emit('update:src', res);
            // this.$store.commit('TOGGLE_SNACKBAR', {
            //   type: 'success',
            //   text: '图片上传成功!',
            // });
          })
          .catch((err) => {
            this.checkErr(err);
          })
          .finally(() => {
            this.dialog = false;
          });
      }
    },
  },
};
</script>
