<template>
  <v-app style="background: rgba(0, 0, 0, 0.9);color:white;">
    <v-app-bar app color="teal darken-4" >
      <div class="d-flex align-center">
        <router-link class="my-link mx-2" :to="{ name: 'MainPage' }"
          >
        <v-img
          alt="MovieChain"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="50"
          src="@/assets/movie_chain_no_text.png"
          width="80"
          height="50"
        /></router-link
        >
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

      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
      <div class="my-auto">

      <SearchInput class="my-auto"/>
      </div>
      <router-link v-if="userInfo" :to="{ name: 'Profile' , params: {nickname: userInfo.userNickname}}">
        <v-avatar>
          <img :src="imgUrl" alt="">
        </v-avatar>
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import axios from 'axios'
import { mapState, mapGetters } from "vuex";
import { mapActions } from "vuex";
import SearchInput from './components/SearchInput.vue';

export default {
  name: "App",
  components: {
    SearchInput,
  },
  created: function () {
    if(this.isLogin) {
      this.logIn()
    }
  },
  methods: {
    ...mapActions(["logOut", 'logIn']),
    logout: function () {
      this.logOut();
    },
  },
  computed: {
    ...mapState(["isLogin"]),
    ...mapGetters(['userInfo']),
    imgUrl: function () {
      console.log(this.userInfo)
      if (this.userInfo){

        return `${process.env.VUE_APP_MCS_URL}${this.userInfo.profile_img}`
      }
      else{
        return null
      }
    },
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
