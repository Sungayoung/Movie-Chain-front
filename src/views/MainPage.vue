<template>
  <div class="container justify-content-center">
    <v-app-bar background-color="white" height='500' min-height='100' shrink-on-scroll='true'></v-app-bar>
    <v-img
      alt="Vuetify Logo"
      class="shrink mt-1 mx-auto"
      contain
      src="@/assets/movie_chain.png"
      transition="scale-transition"
      width="200"
    />
    <div v-if="isLogin">
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";
import { mapState } from "vuex";
export default {
  name: "MainPage",
  components: {
    Login,
  },
  computed: {
    ...mapState(["isLogin"]),
  },
};
</script>

<style></style>
