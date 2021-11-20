<template>
  <v-app style="background: rgba(0, 0, 0, 0.9)">
    <v-app-bar app color="teal darken-4" >
      <div class="d-flex align-center">
        <v-img
          alt="MovieChain"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="50"
          src="@/assets/movie_chain_no_text.png"
          width="80"
          height="50"
        />
        <router-link class="my-link mx-2" :to="{ name: 'MainPage' }"
          >
          Main</router-link
        >
        
        <div v-if="isLogin">
          <router-link class="my-link mx-2" @click.native="logout" to="#"
            >Logout</router-link
          >
        
          <router-link class="my-link mx-2" :to="{ name: 'MovieList' }"
            >MovieList</router-link
          >
        </div>
        <div v-else>
          <router-link class="my-link mx-2" :to="{ name: 'Signup' }"
            >Signup</router-link
          >
        
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
export default {
  name: "App",
  methods: {
    ...mapActions(["logOut"]),
    logout: function () {
      this.logOut();
    },
  },
  computed: {
    ...mapState(["isLogin"]),
  },
};
</script>

<style>
html {
  background-color: black;
}
.bg {
  background-color: rgba(0, 0, 0, 0.5);
}
.my-link {
  text-decoration: none;
  color: white !important;
}
</style>
