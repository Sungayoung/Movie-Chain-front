<template>
  <v-app style="background: rgba(0, 0, 0, 0.9); color: white">
    <v-main>
      <div
        class="my-navbar sticky-top"
        :class="{ 'not-login': !isLogin, login: isLogin }"
      >
        <div class="d-flex justify-content-between">
          <div class="d-flex align-center">
            <router-link class="my-link mx-2" :to="{ name: 'MainPage' }">
              <v-img
                alt="MovieChain"
                class="shrink mt-1 hidden-sm-and-down"
                contain
                min-width="50"
                src="@/assets/movie_chain_no_text.png"
                width="80"
                height="50"
            /></router-link>
            <router-link class="my-link mx-2" :to="{ name: 'MainPage' }">
              Main</router-link
            >

            <router-link
              class="my-link mx-2"
              @click.native="logout()"
              :to="{ name: 'MainPage' }"
              >Logout</router-link
            >

            <router-link class="my-link mx-2" :to="{ name: 'MovieList' }"
              >MovieList</router-link
            >
          </div>

          <div class="my-auto d-flex mx-5">
            <div class="d-flex">
              <SearchInput />
            </div>
            <div class="d-flex">
              <div class="container">
                <v-avatar @click="goToProfile">
                  <img :src="imgUrl" alt="" />
                </v-avatar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  data: function () {
    return {
      show: true,
    };
  },
  components: {
    SearchInput,
  },
  created: function () {
    if (this.isLogin) {
      this.logIn();
    }
  },
  methods: {
    ...mapActions(["logOut", "logIn"]),
    logout: function () {
      this.logOut();
    },
    goToProfile: function () {
      this.$router.push({ name: 'Profile' , params: {'nickname': this.nickname}})
      this.$router.go()
    },
  },
  computed: {
    ...mapState(["isLogin", 'profile_img', 'nickname']),
    imgUrl: function () {
      if(this.profile_img) {
        return `${process.env.VUE_APP_MCS_URL}${this.profile_img}`;
      } else {
        return null;
      }
    },
  },
};
</script>

<style>
html {
  transition-duration: 1s;
  background-color: black;
}
.bg {
  background-color: rgba(0, 0, 0);
}
.my-link {
  text-decoration: none;
  color: white !important;
}
.my-navbar {
  background-color: rgb(30, 104, 114);
  position: fixed;
}
/* 트랜지션 용 스타일 */
.login {
  transform: none;
  transition-property: all;
  transition-delay: 1s;
  transition-duration: 1s;
}
.not-login {
  transform: translateY(-100px);
  transition-duration: 1s;
}

/* 스크롤 바 설정 */
html {
  -ms-overflow-style: none; /* IE and Edge */
}
html::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  height:5%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 25px;
}
::-webkit-scrollbar-track {
  position: absolute;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}
</style>
