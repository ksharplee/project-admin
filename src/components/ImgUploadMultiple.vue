<template>
  <span>
    <v-btn
      color="primary"
      outlined
      :disabled="disabled"
      @click="getImgClick"
    >
      <v-icon left>
        mdi-plus
      </v-icon>
      批量添加
    </v-btn>
    <v-file-input
      ref="uploader"
      :disabled="disabled"
      outlined
      hide-details
      single-line
      multiple
      prepend-icon=""
      clearable
      dense
      append-icon="mdi-camera"
      accept="image/*"
      truncate-length="10"
      style="position:absolute;clip:rect(0px,0px,0px,0px);"
      @change="getImgs"
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
  </span>
</template>

<script>
import Compressor from 'compressorjs';
import * as R from 'ramda';
import { mapActions } from 'vuex';

export default {
  name: 'ImgUpload',
  props: {
    dir: {
      type: String,
      default: 'product',
    },
    counter: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      imgs: [],
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(['uploadImgSync', 'uploadImgMultipleSync']),
    getImgClick() {
      this.$refs.uploader.$refs.input.click();
    },
    getImgs(files) {
      if (!files.length) {
        return;
      }
      if (files.length > this.counter) {
        this.$store.commit('TOGGLE_SNACKBAR', {
          type: 'error',
          text: `请不要上传大于${this.counter}张图片`,
        });
        return;
      }
      this.dialog = true;
      const compressImgs = R.map((file) => {
        if (file.size > 4 * 1024 * 1024) {
          return this.compressImg(file);
        }
        return file;
      }, files);
      Promise.all(compressImgs)
        .then((results) => {
          const postData = new FormData();
          for (let i = 0; i < results.length; i += 1) {
            const file = results[i];
            postData.append('file[]', file);
          }
          postData.append('dir', this.dir);
          this.uploadImgMultipleSync(postData)
            .then((pics) => {
              this.$emit('update:pics', pics);
            })
            .catch((err) => {
              this.checkErr(err);
            })
            .finally(() => {
              this.dialog = false;
            });
        })
        .catch((err) => {
          this.$store.commit('TOGGLE_SNACKBAR', {
            type: 'error',
            text: err.message,
          });
        });
      // const postData = new FormData();
      // for (let i = 0; i < files.length; i += 1) {
      //   const file = files[i];
      //   postData.append('file[]', file);
      // }
      // postData.append('dir', this.dir);
      // this.uploadImgMultipleSync(postData)
      //   .then((pics) => {
      //     this.$emit('update:pics', pics);
      //   })
      //   .catch((err) => {
      //     this.checkErr(err);
      //   })
      //   .finally(() => {
      //     this.dialog = false;
      //   });
    },
    async compressImg(file) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          quality: 0.6,
          success(result) {
            return resolve(result);
          },
          error(err) {
            return reject(err);
          },
        });
      });
    },
  },
};
</script>
