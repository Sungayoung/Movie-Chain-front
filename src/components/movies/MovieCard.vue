<template>
  <button
    @mouseover="posterRotate"
    @mouseleave="posterRerotate"
    class="poster-box mx-1 justify-content-center"
    :class="{ 'liked-movie': movie.isLiked, 'not-like-movie': !movie.isLiked }"
  >
    <!-- 영화 이미지 -->
    <v-img
      v-if="noImage"
      src="@/assets/no_image.png"
      alt="포스터가 없는 영화"
      :id="'my-img-' + movie.id"
      class="my-poster"
    ></v-img>
    <v-img
      v-else
      :src="imgURL"
      :alt="movie.poster_path"
      :id="'my-img-' + movie.id"
      class="my-poster"
    ></v-img>

    <!-- 줄거리를 가릴 커튼 -->
    <div
      :id="'curtain-box-' + movie.id"
      class="my-curtain-box d-flex justify-content-between"
    >
      <div :id="'my-curtain1-' + movie.id" class="my-curtain d-flex"></div>
      <div :id="'my-curtain2-' + movie.id" class="my-curtain d-flex"></div>
    </div>

    <!-- 카드내용 -->
    <div
      :id="'my-content-' + movie.id"
      class="my-content d-flex align-items-center justify-content-center"
    >
      <div class="container">
        <div>
          <p>{{ movie.title }}</p>
          <p>{{ movie.release_date }}</p>
        </div>
        <hr />
        <div>
          <div class="my-5 py-5"></div>
        </div>
        <hr />
        <div>
          <button>
            <v-icon
              @click="moveDetail"
              dark
              right
            >
            mdi-arrow-right-bold-outline
            </v-icon>
          </button>
          <button>
            <v-icon
              @click="likeMovie"
              dark
              right
              v-text="movie.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
            ></v-icon>
          </button>
          <button>
            <v-icon
              dark
              right
              v-text="
                movie.isSaved ? 'mdi-bookmark-check' : 'mdi-bookmark-outline'
              "
            ></v-icon>
          </button>
        </div>
      </div>
    </div>
  </button>
</template>

<script>
import axios from "axios";

export default {
  name: "MovieCard",
  props: {
    movie: Object,
  },
  methods: {
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
    posterRotate: function () {
      document.querySelector("#bg-img").setAttribute("src", this.backdropURL);

      document
        .querySelector(`#my-img-${this.movie.id}`)
        .classList.add("poster-on-mouse");
      document
        .querySelector(`#my-content-${this.movie.id}`)
        .classList.add("content-on-mouse");
      document
        .querySelector(`#my-curtain1-${this.movie.id}`)
        .classList.add("curtain-on-mouse");
      document
        .querySelector(`#my-curtain2-${this.movie.id}`)
        .classList.add("curtain-on-mouse");
    },
    posterRerotate: function () {
      // document
      //   .querySelector('#bg-img')
      //   .setAttribute('src','#');
      document
        .querySelector(`#my-img-${this.movie.id}`)
        .classList.remove("poster-on-mouse");
      document
        .querySelector(`#my-content-${this.movie.id}`)
        .classList.remove("content-on-mouse");
      document
        .querySelector(`#my-curtain1-${this.movie.id}`)
        .classList.remove("curtain-on-mouse");
      document
        .querySelector(`#my-curtain2-${this.movie.id}`)
        .classList.remove("curtain-on-mouse");
    },
  },
  computed: {
    imgURL: function () {
      if (this.movie) {
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
      } else {
        return "@/assets/no_image.png";
      }
    },
    backdropURL: function () {
      if (this.movie) {
        return `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`;
      } else {
        return "@/assets/no_image.png";
      }
    },
    noImage: function () {
      if (this.movie.poster_path) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.liked-movie {
  border: 3px solid rgb(246, 252, 170);
}

.not-like-movie {
  border: 3px solid #000c0c00;
}

.poster-box {
  position: relative;
  display: inline-flex;
  width: 200px;
  height: 300px;
  object-fit: fill;
}

.my-poster {
  position: absolute;
  height: 100%;
  width: 100%;
  transition-duration: 200ms;
  z-index: 10;
}
.poster-on-mouse {
  height: 100%;
  width: 0;
  transition-duration: 200ms;
}

.my-curtain-box {
  position: absolute;
  height: 100%;
  width: 100%;
}
.my-curtain {
  z-index: 5;
  background: #000c0c;
  height: 100%;
  width: 50%;
  transition-duration: 200ms;
}
.curtain-on-mouse {
  height: 100%;
  width: 0;
  transition-delay: 180ms;
  transition-duration: 200ms;
}

.my-content {
  color: whitesmoke;
  background: rgba(114, 133, 134, 0.815);
  position: absolute;
  width: 100%;
  height: 100%;
  transition-duration: 200ms;
}

.content-on-mouse {
  width: 100%;
  transition-delay: 180ms;
  transition-duration: 200ms;
  background: rgba(0, 0, 0, 0.815);
}
</style>
