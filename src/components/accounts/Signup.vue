<template>
  <transition
    name="router-transition"
    enter-active-class="animated animate__fadeInDown"
    leave-active-class="animated animated animate__fadeOutUp"
  >
    <div class="text-center">
      <div class="alert-box">
        <div class="d-flex justify-content-center">
          <transition
            name="custom-classes-transition"
            enter-active-class="animated animate__fadeInDown"
            leave-active-class="animated animated animate__fadeOutUp"
          >
            <v-alert v-if="validAlert" type="error" class="alert d-flex">
              형식이 맞지않습니다.
            </v-alert>
            <v-alert v-if="movieAlert" type="error" class="alert d-flex">
              {{ movieAlertText }}
            </v-alert>
          </transition>
        </div>
      </div>
      <!-- 점 페이지네이션 -->
      <v-item-group v-model="onboarding" class="text-center" mandatory>
        <v-item v-for="n in length" :key="`btn-${n}`">
          <v-icon v-if="onboarding === n - 1" color="teal darken-2"
            >mdi-record</v-icon
          >
          <v-icon v-else color="white">mdi-record</v-icon>
        </v-item>
      </v-item-group>

      <!-- 회원가입 폼 -->
      <v-card class="mx-auto" max-width="800">
        <v-card-title
          class="text-h6 d-flex justify-content-center font-weight-regular"
        >
          <span class="text-center">Movie Chain과 연결하기</span>
        </v-card-title>

        <v-window v-model="onboarding">
          <!-- 1 페이지: 기본정보 -->
          <v-window-item :onboarding="1">
            <div class="container p-3">
              <!-- 아이디 -->
              <div>
                <v-text-field
                  :rules="rules.usernameRule"
                  label="ID"
                  type="text"
                  v-model="credentials.username"
                />
              </div>
              <!-- 비밀번호 -->
              <div>
                <v-text-field
                  :rules="rules.passwordRule"
                  label="Password"
                  type="password"
                  v-model="credentials.password"
                />
              </div>
              <!-- 비밀번호 확인 -->
              <div>
                <v-text-field
                  :rules="rules.passwordConfirmationRule"
                  label="Password Confirmation"
                  type="password"
                  v-model="credentials.passwordConfirmation"
                />
              </div>
              <hr />
              <!-- 닉네임 -->
              <div>
                <v-text-field
                  :rules="rules.nicknameRule"
                  label="Nickname"
                  type="text"
                  v-model="credentials.nickname"
                />
              </div>
              <!-- 이메일 -->
              <div>
                <v-text-field
                  :rules="rules.emailRule"
                  label="e-mail"
                  type="text"
                  v-model="credentials.email"
                />
              </div>
              <!-- 생년월일 -->
              <div>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="credentials.birth"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="credentials.birth"
                      readonly
                      label="생년월일을 선택해주세요"
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="credentials.birth"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(credentials.birth)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>
          </v-window-item>

          <!-- 2 페이지: 선호장르 -->
          <v-window-item :onboarding="2">
            <v-card-text>
              <div class="d-flex row">
                <div
                  class="col-3 text-center p-1"
                  v-for="(genre, idx) in genreList"
                  :key="idx"
                >
                  <v-chip
                    @click="addOrDelGenre(genre.id)"
                    v-if="credentials.like_genres.includes(genre.id)"
                    color="teal darken-2 "
                    text-color="white"
                    :pill="true"
                    :ripple="{ class: 'red--text' }"
                    >{{ genre.name }}</v-chip
                  >

                  <v-chip v-else @click="addOrDelGenre(genre.id)">
                    {{ genre.name }}</v-chip
                  >
                </div>
              </div>
              <hr />
              <div>
                {{ credentials.like_genres }}
              </div>
            </v-card-text>
          </v-window-item>

          <!-- 3 페이지: 나만의 영화 3개 -->
          <v-window-item :onboarding="3">
            <!-- 등록된 영화를 보여주는 부분 -->
            <div class="img-box d-flex">
              <div
                class="d-flex col-3 justify-content-center align-items-center"
              >
                <h3 class="d-flex">{{ credentials.nickname }}강동옥 님</h3>
              </div>
              <div class="col-9 d-flex">
                <div
                  class="container d-flex"
                  style="position: absolute; z-index: 4"
                >
                  <div
                    v-for="n in 3"
                    :key="n"
                    class="d-flex col-3"
                    @click.stop="delMovie(n)"
                     @mouseover="nowHoverMyMovieNum = n - 1"
                        @mouseleave="nowHoverMyMovieNum = null"
                  ><button>

                    <div class="movie-img d-flex">
                      <transition name="my-movie-card">
                        <div
                          v-if="nowHoverMyMovieNum === n - 1 && tempPersonalMovies[n - 1]"
                          class="del-movie-curtain"
                        ></div>
                      </transition>

                      <v-img
                       
                        :src="imgURL(tempPersonalMovies[n - 1])"
                      ></v-img>
                    </div>
                  </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 영화등록하는 부분 -->
            <v-card class="grey m-3">
              <div class="mx-auto p-3">
                <v-autocomplete
                  class="d-inline-flex ms-5"
                  solo
                  hide-details
                  clearable
                  open-on-clear
                  filled
                  dense
                  background-color="white"
                  style="width: 300px"
                  :items="movies"
                  item-text="title"
                  item-value="id"
                  :search-input.sync="query"
                  placeholder="여기를 눌러서 영화를 지정하세요."
                ></v-autocomplete>
              </div>
              <div>
                <v-card-text style="overflow-y: scroll">
                  <div
                    class="row row-cols-5 g-3 m-0 mx-auto"
                    style="height: 500px; background=grey"
                  >
                    <button
                      :id="'my-img-' + movie.id"
                      @mouseover="nowHoverMovieId = movie.id"
                      @mouseleave="nowHoverMovieId = null"
                      @click="addMovie(movie)"
                      v-for="(movie, idx) in filteredMovies"
                      :key="idx"
                      class="p-0"
                      style="position: relative"
                    >
                      <transition name="movie-card-transition">
                        <div
                          v-if="nowHoverMovieId === movie.id"
                          class="add-movie-curtain"
                        ></div>
                      </transition>
                      <v-img class="movie-img" :src="imgURL(movie)" />
                    </button>
                  </div>
                </v-card-text>
              </div>
              <v-divider></v-divider>
            </v-card>
            <!-- <v-card-text>
              <h1 class="text-h6 font-weight-light mb-2 align-self-center">
                {{ credentials.nickname }}
              </h1>

              <h1
                v-for="movie in tempPersonalMovies"
                :key="movie"
                @click="delMovie"
              >
                {{ movie }}
              </h1>
            </v-card-text> -->
          </v-window-item>

          <!-- 4 페이지: 회원가입 완료 -->
          <v-window-item :onboarding="4">
            <div class="text-center">MovieChain과 연결되었습니다.</div>
            <div class="pa-4 d-flex justify-content-around">
              <div
                class="text-h6 font-weight-light mb-2 align-self-center"
                style="width: 150px"
              >
                {{ credentials.nickname }}
              </div>
              <img
                style="width: 150px"
                src="@/assets/movie_chain_no_text.png"
              />
            </div>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <!-- 페이지별 이전버튼 구성 -->
          <v-icon v-if="0 < onboarding && onboarding < 3" @click="prev">
            mdi-chevron-left
          </v-icon>

          <v-spacer></v-spacer>
          <!-- 페이지별 다음버튼 구성 -->
          <v-icon
            v-if="onboarding === 0"
            :disabled="onboarding === length"
            color="primary"
            depressed
            @click="signup(false)"
          >
            mdi-chevron-right
          </v-icon>
          <v-icon
            v-if="onboarding === 1"
            color="primary"
            depressed
            @click="next"
          >
            mdi-chevron-right
          </v-icon>
          <v-icon
            v-if="onboarding === 2"
            :disabled="onboarding === length"
            color="primary"
            depressed
            @click="signup(true)"
          >
            mdi-check
          </v-icon>
        </v-card-actions>
      </v-card>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "Signup",
  data: function () {
    return {
      // personal movie 선택창에 필요힌 변수들
      movies: [],
      filteredMovies: [],
      tempPersonalMovies: [],
      nowHoverMovieId: null,
      nowHoverMyMovieNum: null,

      query: null,
      dialog: false,

      // 선호장르 종류
      genreList: [
        { id: 12, name: "모험" },
        { id: 14, name: "판타지" },
        { id: 16, name: "애니메이션" },
        { id: 18, name: "드라마" },
        { id: 27, name: "공포" },
        { id: 28, name: "액션" },
        { id: 35, name: "코미디" },
        { id: 36, name: "역사" },
        { id: 37, name: "서부" },
        { id: 53, name: "스릴러" },
        { id: 80, name: "범죄" },
        { id: 99, name: "다큐멘터리" },
        { id: 878, name: "SF" },
        { id: 9648, name: "미스터리" },
        { id: 10402, name: "음악" },
        { id: 10749, name: "로맨스" },
        { id: 10751, name: "가족" },
        { id: 10752, name: "전쟁" },
        { id: 10770, name: "TV 영화" },
      ],

      // 유효성 검증
      rules: {
        usernameRule: [
          (v) => !!v || " 아이디를 입력해주세요.",
          (v) =>
            /^[a-zA-Z0-9]*$/.test(v) || "아이디는 영문+숫자만 입력 가능합니다.",
          (v) =>
            !(v && v.length >= 15) || "아이디는 15자 이상 입력할 수 없습니다.",
        ],
        nicknameRule: [
          (v) => !!v || " 닉네임을 입력해주세요.",
          (v) =>
            !(v && v.length >= 30) || "닉네임은 30자 이상 입력할 수 없습니다.",
          (v) =>
            !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
            "닉네임에는 특수문자를 사용할 수 없습니다.",
        ],
        emailRule: [
          (v) => !!v || " 이메일을 입력해주세요.",
          (v) =>
            /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+).(.[0-9a-zA-Z_-]+){1,2}$/.test(
              v
            ) || "이메일 형식에 맞지 않습니다.",
        ],
        passwordRule: [(v) => !!v || " 비밀번호를 입력해주세요."],
        passwordConfirmationRule: [
          (v) => !!v || " 비밀번호 확인을 입력해주세요.",
          (v) =>
            !(v && v.length >= 30) ||
            "패스워드는 30자 이상 입력할 수 없습니다.",
          (v) =>
            v === this.credentials.password || "패스워드가 일치하지 않습니다.",
        ],
      },

      // 회원가입 절차 페이지네이션
      length: 4,
      onboarding: 2,

      // 회원가입에 필요한 정보들
      credentials: {
        username: null,
        nickname: null,
        email: null,
        password: null,
        passwordConfirmation: null,
        like_genres: [],
        personal_movies: [],
        valid_check: true,
      },

      //  에러표시 위한 변수
      validAlert: false,
      movieAlert: false,

      // 생일 메뉴창을 위한 변수
      menu: false,
    };
  },
  created: function () {
    if (this.isLogin) {
      this.$router.push({ name: "MainPage" });
    } else {
      const params = {
        filter_by: "all",
      };
      this.getMovieList(params)
        .then((res) => {
          // console.log(res);
          this.movies = res;
          this.filteredMovies = this.movies.slice(0, 102);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    ...mapActions(["getMovieList"]),
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

    imgURL: function (movie) {
      if (movie && movie.poster_path != null) {
        return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      } else {
        return `${process.env.VUE_APP_MCS_URL}/media/images/profile/person_default.jpg`;
      }
    },
    addMovie: function (mov) {
      if (this.tempPersonalMovies.indexOf(mov) > -1) {
        this.movieAlertText = "이미 담은 영화입니다.";
        this.movieAlert = true;
        setTimeout(() => (this.movieAlert = false), 2000);
      } else if (this.tempPersonalMovies.length >= 3) {
        this.movieAlertText = "Personal Movie는 3개까지 담을 수 있습니다.";
        this.movieAlert = true;
        setTimeout(() => (this.movieAlert = false), 2000);
      } else {
        this.tempPersonalMovies.push(mov);
      }
    },
    delMovie: function (inListNum) {
      this.tempPersonalMovies.splice(inListNum - 1, 1);
    },
    addOrDelGenre: function (genreId) {
      if (this.credentials.like_genres.includes(genreId)) {
        const idx = this.credentials.like_genres.findIndex(
          (item) => item === genreId
        );
        this.credentials.like_genres.splice(idx, 1);
      } else {
        this.credentials.like_genres.push(genreId);
      }
    },
    next: function () {
      this.onboarding++;
    },
    prev: function () {
      this.onboarding--;
    },
    signup: function (validCheck) {
      this.credentials.valid_check = validCheck;
      if (validCheck) {
        this.tempPersonalMovies.forEach((mov) =>
          this.credentials.personal_movies.push(mov.id)
        );
      }
      axios({
        method: "POST",
        url: "http://127.0.0.1:8000/accounts/signup/",
        data: this.credentials,
      })
        .then(() => {
          this.onboarding++;
          if (validCheck) {
            this.$router.push({ name: "MainPage" });
          }
        })
        .catch((err) => {
          this.validAlert = true;
          setTimeout(() => (this.validAlert = false), 2000);
          console.log(err);
        });
    },
  },
  computed: {
    ...mapState(["isLogin"]),
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
        this.filteredMovies = this.movies.slice(0, 102);
      }
    },
  },
};
</script>

<style scoped>
.del-movie-curtain {
  position: absolute;
  background-color: red;
  z-index: 100;
}

.add-movie-curtain {
  position: absolute;
  background-color: red;
  z-index: 100;
}
.del-movie-curtain,
.add-movie-curtain,
.movie-img {
  width: 150px;
  height: 225px;
  object-fit: fill;
}
.img-box {
  width: 100%;
  height: 300px;
  object-fit: fill;
}
* ::-webkit-scrollbar {
  display: none;
}

.my-movie-card-enter-active,
.my-movie-card-leave-active {
  transition-duration: 500ms;
}
.my-movie-card-enter,
.my-movie-card-leave-to {
  opacity: 0;
}

.movie-card-transition-enter-active,
.movie-card-transition-leave-active {
  transition-duration: 0.5s;
  transition-property: all;
}
.movie-card-transition-enter,
.movie-card-transition-leave-to {
  opacity: 0;
}

.alert-box {
  position: fixed;
  top: 0;
  height: 5vh;
  width: 100%;
  z-index: 10;
}
.alert {
  position: relative;
  max-width: 30vw;
  top: 0;
}
</style>
