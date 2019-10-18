<template>
  <div id="app">
    <v-app id="inspire">
      <router-view />
      <v-snackbar
        v-if="snackbarShow"
        :value="snackbarShow"
        :color="snackbarColor"
        :timeout="3000"
        top
      >
        {{ snackbarText }}
        <v-icon dark>
          {{ snackbarIcon }}
        </v-icon>
      </v-snackbar>
      <div
        v-show="$store.state.loading"
        style="position: absolute;top:0;right:0;left:0;z-index:100"
      >
        <v-progress-linear
          indeterminate
          height="5"
          striped
          color="yellow accent-2"
        />
      </div>
    </v-app>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    ...mapState([
      'snackbarColor',
      'snackbarShow',
      'snackbarText',
      'snackbarIcon',
      'loading',
    ]),
  },
  watch: {
    snackbarShow() {
      if (this.snackbarShow) {
        setTimeout(() => this.$store.commit('TOGGLE_SNACKBAR', {}), 3000);
      }
    },
  },
};
</script>
