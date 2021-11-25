<template>
  <button
    @mouseover="nowHoverMovieId = movie.id, getMBDURL({url:backdropURL,id:movie.id})"
    @mouseleave="nowHoverMovieId = null"
    class="poster-box mx-1 justify-content-center"
    :class="{
      'liked-movie': movie.isLiked * movie.isSaved,
      'not-like-movie': !(movie.isLiked && movie.isSaved),
    }"
  >
    <!-- 영화 이미지 -->
    <span style="position: absolute; z-index: 6; left: 10px">
      <v-icon v-if="movie.isLiked" large color="red" style="z-index: 4">
        mdi-heart</v-icon
      >
      <v-icon v-if="movie.isSaved" large color="blue" style="z-index: 4"
        >mdi-bookmark</v-icon
      >
    </span>
    
    <v-img
      :src="imgURL"
      :alt="movie.poster_path"
      class="my-poster"
    ></v-img>

    <!-- 카드내용 -->
    <transition name="my-movie-card">
      <div
        v-if="nowHoverMovieId === movie.id"
        class="my-content d-flex align-items-center justify-content-center"
      >
        <div class="container p-3">
          <div>
            <p>{{ movie.title }}</p>
            <p>{{ movie.release_date }}</p>
          </div>

          <hr />
          <div>
            <button>
              <v-icon
                @click="likeMovie"
                dark
                right
                size="40"
                v-text="movie.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
              ></v-icon>
            </button>
            <button>
              <v-icon
                dark
                right
                size="40"
                @click="saveMovie"
                v-text="movie.isSaved ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
              ></v-icon>
            </button>
            <button>
              <v-icon @click="moveDetail" dark right size="40">
                mdi-open-in-new
              </v-icon>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </button>
</template>

<script>
import axios from "axios";
import {mapActions} from 'vuex'

export default {
  name: "MovieCard",
  props: {
    movie: Object,
  },
  data: function () {
    return {
      nowHoverMovieId: null,
    };
  },
  methods: {
    ...mapActions(['getMBDURL']),
    saveMovie: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: "post",
        url: `${process.env.VUE_APP_MCS_URL}/movies/bookmark-movie/`,
        headers: { Authorization: `JWT ${token}` },
        data: { movieId: this.movie.id },
      }).then((res) => {
        this.movie.saveCnt = res.data.saveCnt;
        this.movie.isSaved = res.data.isSaved;
      });
    },
    likeMovie: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: "post",
        url: `${process.env.VUE_APP_MCS_URL}/movies/like-movie/`,
        headers: { Authorization: `JWT ${token}` },
        data: { movieId: this.movie.id },
      }).then((res) => {
        this.movie.likeCnt = res.data.likeCnt;
        this.movie.isLiked = res.data.isLiked;
      });
    },
    moveDetail: function () {
      this.$router.push({
        name: "MovieDetail",
        params: {
          movieId: String(this.movie.id),
        },
      });
    },
  },
  computed: {
    imgURL: function () {
      if (this.movie.poster_path) {
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
      } else {
        return `${process.env.VUE_APP_MCS_URL}/media/images/profile/movie_chain_poster.png`;
      }
    },
    backdropURL: function () {
      if (this.movie.backdrop_path) {
        return `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`;
      } else {
        return "#";
      }
    },
  },
};
</script>

<style scoped>
.liked-movie {
  border: 2px solid rgb(246, 252, 170);
}
.not-like-movie {
  border: 2px solid #ffffff96
}
.poster-box {
  position: relative;
  display: inline-flex;
  width: 200px;
  height: 300px;
  object-fit: fill;
  border-radius: 25px;
}
.my-poster {
  position: absolute;
  height: 100%;
  width: 100%;
  transition-duration: 200ms;
  z-index: 5;
  border-radius: 25px;
}
.my-content {
  color: whitesmoke;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 6;
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
