<template>
  <v-item-group v-if="movieList">
    <v-container>
      <!-- 내 프로필 -->
      <v-row v-if="isLoginUser">
        <v-dialog
          color="grey"
          scrollable
          v-model="dialog"
          width="700px"
          height="700px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col v-for="(movie, idx) in movieList" :key="idx" cols="4" md="4">
              <v-item v-slot="{ active }">
                <v-card
                  :color="active ? 'primary' : 'grey'"
                  class="d-flex align-center mx-auto movie-img"
                  width="200"
                  height="300"
                  v-bind="attrs"
                  rounded="xl"
                  v-on="on"
                  @click="getIdx(idx)"
                  @mouseover="
                    (nowHoverMovieId = movie.id),
                      setMBDURL({ url: backdropURL(movie.backdrop_path), id: movie.id })
                  "
                  @mouseleave="nowHoverMovieId = null"
                >
                  <v-img
                    rounded="xl"
                    class="movie-img"
                    width="200"
                    height="300"
                    :src="imgURL(movie)"
                  ></v-img>
                  <transition name="my-movie-card">
                    <div
                      v-if="nowHoverMovieId === movie.id"
                      class="
                        my-content
                        d-flex
                        align-items-center
                        justify-content-center
                      "
                    >
                      <button class="d-flex">
                        <v-icon dark right size="64">
                        mdi-pencil-box-outline
                        </v-icon>
                      </button>
                    </div>
                  </transition>
                  <v-scroll-y-transition>
                    <div
                      v-if="active"
                      class="text-h2 flex-grow-1 text-center"
                    ></div>
                  </v-scroll-y-transition>
                </v-card>
              </v-item>
              <v-row justify="center">
                <user-list-pop :movieId="movie.id"> </user-list-pop>
              </v-row>
            </v-col>
            <!-- 빈슬롯 -->
            <v-col v-if="movieList.length < 3" cols="4" md="4">
              <v-item v-slot="{ active }">
                <v-card
                  :color="active ? 'primary' : 'grey'"
                  class="d-flex align-center mx-auto"
                  width="200"
                  height="300"
                  v-bind="attrs"
                  v-on="on"
                  rounded="xl"
                  @click="getIdx(idx)"
                  @mouseover="onBoard = true"
                  @mouseleave="onBoard = false"
                >
                  <v-img
                    rounded="xl"
                    class="movie-img"
                    width="200"
                    height="300"
                    :src="imgURL(movie)"
                  ></v-img>
                  <transition name="my-movie-card">
                    <div
                      v-if="onBoard"
                      class="
                        my-content
                        d-flex
                        align-items-center
                        justify-content-center
                      "
                    >
                      <button>
                        <v-icon dark right size="64">
                          mdi-plus-circle-outline
                        </v-icon>
                      </button>
                    </div>
                  </transition>
                  <v-scroll-y-transition>
                    <div
                      v-if="active"
                      class="text-h2 flex-grow-1 text-center"
                    ></div>
                  </v-scroll-y-transition>
                </v-card>
              </v-item>
            </v-col>
          </template>

          <v-card class="grey">
            <v-card-title class="text-h5 grey lighten-2">
              영화 선택
            </v-card-title>
            <div class="mx-auto">
              <v-autocomplete
                class="d-inline-flex ms-5"
                solo
                hide-details
                clearable
                filled
                color="grey"
                dense
                background-color="white"
                style="width: 300px"
                :items="movies"
                item-text="title"
                item-value="id"
                :search-input.sync="query"
              ></v-autocomplete>
            </div>
            <v-card-text>
              <div>
                <div
                  class="row row-cols-4 g-3 m-0 mx-auto"
                  style="height: 500px; background=grey"
                >
                  <div
                    v-for="(movie, idx) in filteredMovies"
                    :key="idx"
                    class="p-0"
                  >
                    <img
                      class="movie-img"
                      :src="imgURL(movie)"
                      @click="setPersonalMovie(movie)"
                    />
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" text @click="dialog = false"> CLOSE </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <!-- 다른사람 프로필 -->
      <v-row v-else>
        <v-col v-for="(movie, idx) in movieList" :key="idx" cols="4" md="4">
          <v-card
            @mouseover="
              (nowHoverMovieId = movie.id),
                setMBDURL({ url: backdropURL(movie.backdrop_path), id: movie.id })
            "
            @mouseleave="nowHoverMovieId = null"
            class="d-flex align-center mx-auto"
            width="200"
            height="300"
            elevation="12"
            rounded="xl"
          >
            <v-img
              class="movie-img"
              rounded="xl"
              width="200"
              height="300"
              :src="imgURL(movie)"
            />
            <transition name="my-movie-card">
              <div
                v-if="nowHoverMovieId === movie.id"
                class="
                  my-content
                  d-flex
                  align-items-center
                  justify-content-center
                "
              >
                <button>
                  <v-icon @click="moveDetail(movie.id)" dark right size="40">
                    mdi-open-in-new
                  </v-icon>
                </button>
              </div>
            </transition>
          </v-card>
          <v-row justify="center">
            <user-list-pop :movieId="movie.id"> </user-list-pop>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
import axios from "axios";
import UserListPop from "../popups/UserListPop.vue";
import { mapActions } from "vuex";

export default {
  name: "MovieCardListPersonal",
  props: {
    movieList: Array,
    isLoginUser: Boolean,
    background_color: String,
  },
  components: {
    UserListPop,
  },
  data: function () {
    return {
      onBoard:false,
      nowHoverMovieId: null,
      query: null,
      dialog: false,
      cur_idx: 1,
      movies: [],
      filteredMovies: [],
    };
  },
  mounted: function () {
    const params = {
      filter_by: "all",
    };
    this.getMovieList(params)
      .then((res) => {
        this.movies = res;
        this.filteredMovies = this.movies;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    ...mapActions(["getMovieList", "search", "setMBDURL"]),
    moveDetail: function (movieId) {
      this.$router.push({
        name: "MovieDetail",
        params: {
          movieId: String(movieId),
        },
      });
    },
    getIdx: function (idx) {
      this.cur_idx = idx;
    },
    setPersonalMovie: function (movie) {
      console.log(this.cur_idx);
      console.log(this.movieList[this.cur_idx]);
      const token = localStorage.getItem("jwt");
      if (this.cur_idx < this.movieList.length) {
        const data = {
          movieId: movie.id,
          originId: this.movieList[this.cur_idx].id,
        };
        console.log(this.movieList[this.cur_idx].id);
        axios({
          method: "put",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/personal-movie/`,
          headers: { Authorization: `JWT ${token}` },
          data: data,
        }).then((res) => {
          res;
          this.dialog = false;
          this.$emit("reload-profile");
        });
      } else {
        const data = {
          movieId: movie.id,
        };
        console.log(movie);
        axios({
          method: "post",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/personal-movie/`,
          headers: { Authorization: `JWT ${token}` },
          data: data,
        }).then((res) => {
          res;
          this.dialog = false;
          this.$emit("reload-profile");
        });
        movie;
      }
    },
    imgURL: function (movie) {
      if (movie) {
        if (movie.poster_path != null) {
          return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else {
          return `${process.env.VUE_APP_MCS_URL}/media/images/profile/movie_chain_poster.png`;
        }
      } else {
        return null;
      }
    },
     backdropURL: function (backdrop_path) {
      if (backdrop_path) {
        return `https://image.tmdb.org/t/p/original${backdrop_path}`;
      } else {
        return "#";
      }
    },
    calBgColor: function () {},
  },
  watch: {
    query(val) {
      if (val) {
        this.filteredMovies = this.movies.filter((movie) => {
          return (
            movie.title.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >
            -1
          );
        });
      } else {
        this.filteredMovies = this.movies;
      }
    },
  },
};
</script>

<style scoped>
.movie-img {
  width: 160px;
  height: 240px;
  object-fit: fill;
  border-radius: 25px;
  border: 2px solid #ffffff96;
  transition-duration: 200ms;
  z-index: 0;
}
* ::-webkit-scrollbar {
  display: none;
}

.my-content {
  color: whitesmoke;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition-duration: 200ms;
  border-radius: 25px;
}
.my-movie-card-enter-active {
  transition-duration: 0.2s;
}
.my-movie-card-leave-active {
  transition-duration: 0.5s;
  transition-delay: 0.5s;
}

.my-movie-card-enter,
.my-movie-card-leave-to {
  opacity: 0;
}
</style>
