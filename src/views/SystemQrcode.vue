<template>
  <div>
    <div class="title d-flex flex-wrap align-center">
      小程序二维码
    </div>
    <v-divider class="my-4" />
    <v-card elevation="1">
      <v-row class="pt-5">
        <v-col
          cols="12"
          md="4"
          lg="2"
          offset-md="4"
          offset-lg="5"
        >
          <v-img
            :src="image"
            aspect-ratio="1"
            class="grey lighten-2 mx-auto"
          >
            <template v-slot:placeholder>
              <v-row
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
        </v-col>
      </v-row>
      <v-row class="py-4">
        <v-col
          cols="12"
          md="4"
          lg="2"
          offset-md="4"
          offset-lg="5"
        >
          <v-btn
            color="secondary"
            block
            download="小程序二维码"
            :href="image"
          >
            点击下载
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "SystemQrCode",
  data() {
    return {
      image: "",
      loadingQrcode: false
    };
  },
  computed: {
    ...mapState(["user"])
  },
  created() {
    this.$store.commit("SET_BREADCRUMBS", [
      {
        text: "首页",
        disabled: false,
        to: { name: "home" },
        exact: true
      },
      {
        text: "小程序二维码",
        disabled: true,
        exact: true
      }
    ]);
    this.getQrcode();
  },
  methods: {
    ...mapActions("system", ["getQrcodeAsync"]),
    getQrcode() {
      this.loadingQrcode = true;
      this.getQrcodeAsync({ sellerId: this.user.sellerId })
        .then(res => {
          this.image = res;
        })
        .catch(err => this.checkErr(err))
        .finally(() => {
          this.loadingQrcode = false;
        });
    }
  }
};
</script>
