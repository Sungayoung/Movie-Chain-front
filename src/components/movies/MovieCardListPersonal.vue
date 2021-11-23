<template>
  <v-item-group v-if="movieList">
    <v-container>
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
                  class="d-flex align-center mx-auto"
                  width="200"
                  height="300"
                  v-bind="attrs"
                  v-on="on"
                  @click="getIdx(idx)"
                >
                  <v-img
                  width="200"
                  height="300"
                  :src="imgURL(movie)"
                  ></v-img>
                  <v-scroll-y-transition>
                    <div
                      v-if="active"
                      class="text-h2 flex-grow-1 text-center"
                    ></div>
                  </v-scroll-y-transition>
                </v-card>
              </v-item>
            </v-col>
            <v-col v-if="movieList.length < 3" cols="4" md="4">
              <v-item v-slot="{ active }">
                <v-card
                  :color="active ? 'primary' : 'grey'"
                  class="d-flex align-center mx-auto"
                  width="200"
                  height="300"
                  v-bind="attrs"
                  v-on="on"
                  @click="getIdx(idx)"
                >
                  <v-img></v-img>
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
                  <div v-for="(movie, idx) in filteredMovies" :key="idx" class="p-0">
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
              <v-btn color="primary" text @click="dialog = false">
                CLOSE
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row v-else>
        <v-col v-for="(movie, idx) in movieList" :key="idx" cols="4" md="4">
          <v-card
            class="d-flex align-center mx-auto"
            width="200"
            height="300"
          >
            <v-img
            width="200"
            height="300"
            :src="imgURL(movie)"
            ></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "MovieCardListPersonal",
  props: {
    movieList: Array,
    isLoginUser: Boolean
  },

  data: function () {
    return {
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
        this.filteredMovies = this.movies
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    ...mapActions(["getMovieList", "search"]),
    getIdx: function (idx) {
      this.cur_idx = idx;
    },
    setPersonalMovie: function (movie) {
      console.log(this.cur_idx)
      console.log(this.movieList[this.cur_idx])
      const token = localStorage.getItem('jwt')
      if (this.cur_idx < this.movieList.length) {
        const data = {
          movieId: movie.id,
          originId: this.movieList[this.cur_idx].pk
        }
        console.log(this.movieList[this.cur_idx].pk)
        axios({
          method: "put",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/set-personal-movie/`,
          headers: { Authorization: `JWT ${token}` },
          data: data,
        }).then((res) => {
          res
          this.dialog = false
          this.$emit('reload-profile')
        });
      }
      else {
        const data = {
          movieId: movie.id,
        };
        console.log(movie);
        axios({
          method: "post",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/set-personal-movie/`,
          headers: { Authorization: `JWT ${token}` },
          data: data,
        }).then((res) => {
          res
          this.dialog = false
          this.$emit('reload-profile')
        });
        movie;
      }
    },
    imgURL: function (movie) {
      if (movie) {
        if (movie.poster_path != null) {
          return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else {
          return "@/assets/no_image.png";
        }
      } else {
        return null;
      }
    },
  },
  watch: {
    query(val) {
      if (val) {
        this.filteredMovies = this.movies.filter( movie => {
           return movie.title.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1
        })
      }
      else {
        this.filteredMovies = this.movies
      }
    }
  }
};
</script>

<style>
.movie-img {
  width: 160px;
  height: 240px;
  object-fit: fill;
}
</style>
