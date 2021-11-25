<template>
  <div style="height: 100vh">
    <!-- 커텐 -->
    <div class="curtain-left" :class="{ 'curtain-open': isLogin }"></div>
    <div class="curtain-right" :class="{ 'curtain-open': isLogin }"></div>
    
    <!-- 메인화면(로그인) -->
    <transition name="fade">
      <div
        v-if="!isLogin"
        id="login-page"
        class="d-flex justify-content-center login-page"
        style="z-index: 100; margin-top: 72px"
      >
        <div class="my-auto" style="z-index: 50">
          <img
            style="z-index: 100"
            alt="MovieChain Logo"
            class="d-flex mx-auto"
            src="@/assets/movie_chain.png"
            width="200"
          />
          <Login />
        </div>
      </div>
    </transition>
    <div v-if="nowLoading">
      <v-overlay :value="nowLoading">
        <v-progress-circular
          :size="150"
          :width="15"
          color="white"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
    </div>
    <!-- 메인화면(검색) -->
    <transition name="fade">
      <div v-if="isLogin" style="z-index: 50; margin-top: 72px">
        <div style="height: 80vh; z-index: 50;" id="search-page">
          <v-col
            class="d-flex align-center justify-center"
            style="height: 80vh; z-index: 50"
          >
            <div style="z-index: 50">
              <div
                v-if="isLogin"
                class="justify-content-center d-flex"
                style="z-index: 50"
              >
                <div style="z-index: 50">
                  <img
                    style="z-index: 50"
                    alt="MovieChain Logo"
                    class="d-flex justif mx-auto"
                    src="@/assets/movie_chain.png"
                    width="200"
                  />

                  <div style="z-index: 50">
                    <SearchInput />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <!-- 추천페이지 -->
          <div
            id="more-text"
            class="text-center"
            style="height: 20vh; z-index: 1"
          >
            <v-icon class="more-text" size="48">mdi-chevron-double-down</v-icon>
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.7)">
            <div class="d-flex p-5 justify-content-center align-items-center">
              <div
                class="pt-5 pb-2 d-flex"
                style="border-bottom: solid 1px white"
              >
                <span class="text-center px-3 fs-3" style="color: white"
                  >추천 영화</span
                >
                <button>
                  <v-icon class="reload-icon" dark @click="reloadRecommend"
                    >mdi-reload</v-icon
                  >
                </button>
              </div>
            </div>
            <img
              v-if="!(hoveringPosterURL === null)"
              :src="hoveringPosterURL"
              alt=""
            />
            <MovieCardMatrix :movieList="recommendMovies" />
          </div>
          <div style="background-color: rgba(0, 0, 0, 0.7)">
            <div class="d-flex p-5 justify-content-center align-items-center">
              <div
                class="pt-5 pb-2 d-flex"
                style="border-bottom: solid 1px white"
              >
                <span class="text-center pt-5 px-3 fs-3" style="color: white"
                  >더 많은 영화</span
                >
              </div>
            </div>
            <img
              v-if="!(hoveringPosterURL === null)"
              :src="hoveringPosterURL"
              alt=""
            />
            <MovieCardMatrix :movieList="movies" />
          </div>
        </div>
      </div>
    </transition>
    <div>
      <a
        class="to-top-button"
        href="#"
        title="맨 위로"
        :class="{ 'display-button': !isTop }"
      >
        <v-icon color="white" size="36">mdi-arrow-up</v-icon>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Login from "../components/accounts/Login.vue";
import MovieCardMatrix from "../components/movies/MovieCardMatrix.vue";
import SearchInput from "../components/SearchInput.vue";

export default {
  name: "MainPage",
  data: function () {
    return {
      nowHoverMovieId: null,
      isTop: true,
      nowPage: 1,
      nowLoading: false,
      recommendMovies: null,
      movies: [],
    };
  },
  components: {
    Login,
    SearchInput,
    MovieCardMatrix,
  },
  // 스크롤 인식
  created() {
    window.addEventListener("scroll", this.handleScroll);

    if (this.isLogin) {
      if (this.nowpage == 1) {
        this.getRecommendMovie().then((res) => {
          this.recommendMovies = res;
          this.nowPage++;
        });
      } else {
        const params = {
          filter_by: "all",
          page: this.nowPage - 1,
        };
        this.getMovieListPage(params)
          .then((res) => {
            res.forEach((mov) => {
              this.movies.push(mov);
            });
            this.nowPage++;
            console.log(this.movies);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions(["getMovieListPage", "search", "getRecommendMovie"]),
    hoverMovieCard: function () {
      document
        .querySelector(`#my-img-${this.movie.id}`)
        .classList.add("card-on-mouse");
    },
    leaveMovieCard: function () {
      document
        .querySelector(`#my-img-${this.movie.id}`)
        .classList.remove("card-on-mouse");
    },
    reloadRecommend: function () {
      this.nowLoading = true;
      this.getRecommendMovie()
        .then((res) => {
          this.recommendMovies = res;
          this.nowLoading = false;
        })
        .catch(() => {
          this.nowLoading = false;
        });
    },
    handleScroll() {
      const { clientHeight, scrollHeight, scrollTop } =
        document.documentElement;
      if (!this.nowLoading) {
        // 페이지 전환용
        if (scrollTop > 50 && this.isTop) {
          document.querySelector("#search-page").classList.add("not-top");
          document.querySelector("#search-page").classList.remove("is-top");
          document.querySelector("#more-text").classList.add("color-change");
          document
            .querySelector("#more-text")
            .classList.remove("color-change-return");
          this.isTop = !this.isTop;
        }
        if (scrollTop < 50 && !this.isTop) {
          document.querySelector("#search-page").classList.add("is-top");
          document.querySelector("#search-page").classList.remove("not-top");
          document
            .querySelector("#more-text")
            .classList.add("color-change-return");
          document.querySelector("#more-text").classList.remove("color-change");
          this.isTop = !this.isTop;
        }
      }

      // 인피니티 스크롤용
      if (scrollHeight - scrollTop === clientHeight && !this.nowLoading) {
        this.nowLoading = true;
        if (this.nowPage == 1) {
          this.getRecommendMovie()
            .then((res) => {
              this.recommendMovies = res;
              this.nowLoading = false;
              this.nowPage++;
            })
            .catch(() => {
              this.nowLoading = false;
            });
        } else {
          const params = {
            filter_by: "all",
            page: this.nowPage - 1,
          };
          this.getMovieListPage(params)
            .then((res) => {
              res.serialized_data.forEach((mov) => {
                this.movies.push(mov);
              });
              this.nowPage++;
              this.nowLoading = false;
              console.log(this.movies);
            })
            .catch((err) => {
              this.nowLoading = false;
              console.log(err);
            });
        }
      }
    },
  },
  computed: {
    ...mapState(["isLogin", "hoveringPosterURL"]),
    hoveringPosterURL: function () {
      return localStorage.getItem("hoveringPosterURL");
    },
  },
  watch: {
    isLogin: function () {
      if (this.isLogin) {
        this.nowLoading = true;
        const params = {
          filter_by: "all",
          page: this.nowPage,
        };
        this.getMovieListPage(params)
          .then((res) => {
            res.forEach((mov) => {
              this.movies.push(mov);
            });
            this.nowPage++;
            console.log(this.movies);
            this.nowLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.nowLoading = false;
          });
        this.nowLoading = true;

        this.getRecommendMovie().then((res) => {
          console.log(res);
          this.recommendMovies = res;
        });
        this.nowLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.to-top-button {
  display: scroll;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  color: rgba(104, 240, 217, 0.473);
  transition-duration: 1s;
  transform: translateY(100px);
}
.display-button {
  transition-duration: 1s;
  transform: none;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 1s;
}
.fade-enter-active {
  transition-delay: 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.login-page {
  height: 80vh;
}
.curtain-left,
.curtain-right {
  position: fixed;
  top: 0;
  background: rgb(78, 19, 19);
  width: 50%;
  height: 200vh;
  transition-delay: 1s;
  transition-duration: 1.1s;
  z-index: 0;
}
.curtain-right {
  right: 0;
}
.curtain-open {
  position: fixed;
  top: 0;
  background: rgb(19, 139, 99);
  width: 0;
  height: 200vh;
  transition-duration: 1.1s;
  z-index: 0;
}
.not-top {
  transition-duration: 1s;
  transform: translateY(-90vh);
  background-color: rgba(0, 0, 0, 0.7);
}
.is-top {
  transition-duration: 1s;
  transform: none;
}
.color-change {
  transition-duration: 1s;
  background-color: rgba(0, 0, 0, 0.7);
}
.color-change-return {
  transition-duration: 1s;
  background-color: none;
}
.more-text {
  animation-name: sparkle;
  animation-duration: 1.5s;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}
.reload-icon {
  transform: rotateZ(0);
  transition-duration: 1s;
}
.reload-icon:hover {
  transform: rotateZ(360deg);
  transition-duration: 1s;
}

@keyframes sparkle {
  from {
    color: rgb(255, 255, 255);
  }
  to {
    color: rgb(87, 87, 87);
  }
}
</style>
