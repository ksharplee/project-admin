<template>
  <div class="img-uploader">
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-file-input
        ref="uploader"
        outlined
        :hide-details="hideDetails"
        :single-line="singleLine"
        :rules="required ? requiredRules : []"
        :value="value"
        dense
        prepend-icon=""
        :placeholder="placeholder"
        :disabled="disabled"
        :label="label"
        clearable
        append-icon="mdi-paperclip"
        accept="image/*"
        :truncate-length="truncateLength"
        class="rounded-top-0"
        @change="getImg"
        @click:clear="$emit('update:delete')"
      />
      <div
        style="border:1px solid #ccc !important;width:38px;height:38px;position:absolute;left: 100%;top:0;"
        class="ml-2 rounded"
      >
        <div
          class="popup"
          style="position:absolute;z-index:1000;top:0;right:0;bottom:0;left:0"
          @mouseenter="popupHover = true"
          @mouseleave="popupHover = false"
        />
        <v-img
          :src="image"
          class="grey lighten-5 d-flex align-center text-center "
          style="width:36px;height:36px;"
          contain
        >
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
        <v-card
          v-if="popupHover"
          elevation="1"
          style="position:absolute;z-index:1;left: 120%; top: -65%;max-width:initial"
          :style="`width:${popWidth}px;height:${popHeight}px`"
          @mouseleave="popupHover = false"
        >
          <v-img
            :src="image"
            class="grey lighten-5 d-flex align-center text-center "
            contain
          >
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
        </v-card>
      </div>
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
    </v-form>
  </div>
</template>

<script>
import Compressor from 'compressorjs';
import { mapActions } from 'vuex';

export default {
  name: 'ImgUploadInput',
  props: {
    aspectRatio: {
      type: String,
      default: '1',
    },
    image: {
      type: String,
      default: '',
    },
    popWidth: {
      type: String,
      default: '',
    },
    popHeight: {
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
    label: {
      type: String,
      default: '',
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
    hideDetails: {
      type: Boolean,
      default: true,
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    delIconSize: {
      type: String,
      default: 'default',
    },
    validate: {
      type: Boolean,
      default: false,
    },
    truncateLength: {
      type: Number,
      default: 50,
    },
    // height: {
    //   type: String,
    //   default: '150px',
    // },
  },
  data() {
    return {
      dialog: false,
      popupHover: false,
      valid: true,
      requiredRules: [v => !!v || `请上传${this.label}`],
      value: null,
    };
  },
  watch: {
    validate() {
      this.validateForm();
    },
  },
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
                this.value = file;
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
            this.value = file;
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
    validateForm() {
      this.$emit('update:validate', new Promise((resolve, reject) => {
        if (this.image || this.$refs.form.validate()) {
          resolve(true);
        } else {
          reject(new Error(false));
        }
      }));
      // this.$emit('update:validate', !!(this.image || this.$refs.form.validate()));
    },
  },
};
</script>

<style>
/* .v-text-field__slot {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.v-file-input__text.v-file-input__text--placeholder {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} */

.withPopup .popup {
  display: none;
}

.withPopup:hover .popup {
  display: block;
}
</style>
