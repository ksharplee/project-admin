<template>
  <v-container
    fill-height
    fluid
    style="background-color:#fff"
  >
    <v-btn
      color="dark"
      icon
      large
      style="position: absolute;top:15px;left:15px"
      @click="$router.back()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
        lg="2"
        class="text-center display-1"
      >
        <v-img
          aspect-ratio="1"
          :src="src"
          class="mb-4"
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
        <p class="text-truncate">
          {{ dnames }}
        </p>
        <p>{{ dno }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Print',
  props: {
    src: {
      type: String,
      default: '',
    },
    dnames: {
      type: String,
      default: '',
    },
    dno: {
      type: String,
      default: '',
    },
  },
};
</script>
