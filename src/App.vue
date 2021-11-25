<template>
  <v-app style="background: rgba(0, 0, 0, 0.5 ); color: black">
    <!-- 체인 -->

    <!-- <div class="d-flex align-items-center">
      <div class="d-flex chain" style="top: 100px; left: 30px"></div>
      <div class="d-flex chain" style="top: 100px; left: 130px"></div>
      <div class="d-flex chain2" style="top: 115px; left: 80px"></div>
    </div> -->

    <v-main>
      <!-- 네비바 -->
      <transition name="fade">
      <div id="navbar" v-if="isLogin">
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
      </transition>

      <img class="bg-img" :src='lastHoverMBDURL' />
      
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
      this.$router.push({
        name: "Profile",
        params: { nickname: this.nickname },
      });
      this.$router.go();
    },
  },
  computed: {
    ...mapState(["isLogin", "profile_img", "nickname",'lastHoverMBDURL']),
    imgUrl: function () {
      if (this.profile_img) {
        return `${process.env.VUE_APP_MCS_URL}${this.profile_img}`;
      } else {
        return null;
      }
    },
  },
};

var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0px";
  } else {
    document.getElementById("navbar").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 1s;
}
.fade-enter-active {
  transition-delay: 1.5s;
}
.fade-enter{
  opacity: 1;

}
.fade-leave-to {
  opacity: 0;
}

.bg-img {
  transition-duration: 1s;
  position: fixed;
  top: 0;
  width: 100%;
  object-fit: cover;
  z-index: 0;
}

html {
  transition-duration: 1s;
  background-color: rgba(0, 0, 0, 0.3) !important;
}
.bg {
  background-color: rgba(0, 0, 0,0.3);
}
.my-link {
  text-decoration: none;
  color: white !important;
}

/* 스크롤 바 설정 */
html {
  -ms-overflow-style: none; /* IE and Edge */
}
html::-webkit-scrollbar {
  width: 6px;
}
* ::-webkit-scrollbar-thumb {
  height: 17%;
  background-color: rgba(255, 255, 255)!important;
  border-radius: 25px;
}
* ::-webkit-scrollbar-track {
  position: absolute;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}
.chain {
  border: 5px white solid;
  border-radius: 30px;
  height: 50px;
  width: 80px;
  position: absolute;
}
.chain2 {
  border: 5px black solid;
  background: white;
  border-radius: 30px;
  height: 15px;
  width: 80px;
  position: absolute;
}
#navbar {
  background-color: rgba(30, 104, 114, 0.5);
  position: fixed;
  top: 0;
  width: 100%;
  transition: top 0.3s;
  z-index: 100;
}

/* Style the navbar links */
</style>
