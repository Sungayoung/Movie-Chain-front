<template>
  <div>
    <div class="justify-content-center">
      <div class="alert-box">
        <div class="d-flex justify-content-center">
          <transition
            name="custom-classes-transition"
            enter-active-class="animated animate__fadeInDown"
            leave-active-class="animated animate__fadeOutUp"
          >
            <v-alert v-if="movieAlert" type="error" class="alert d-flex">
              {{ movieAlertText }}
            </v-alert>
          </transition>
        </div>
      </div>
      <!-- 페이지네이션 버튼 -->

      <!-- 회원가입 폼 -->
      <v-card class="mx-auto" style="margin-top: px" rounded="xl">
        <v-card-title
          style="background-color: grey"
          class="text-h6 d-flex justify-content-center font-weight-regular"
        >
          <span
            v-if="onboarding === 0"
            class="fs-3 text-center"
            style="color: white"
            >Movie Chain과 연결하기</span
          >
          <span
            v-if="onboarding === 1"
            class="fs-3 text-center"
            style="color: white"
            >좋아하는 장르를 선택해주세요</span
          >
          <span
            v-if="onboarding === 2"
            class="fs-3 text-center"
            style="color: white"
            >나를 상징하는 영화를 선택해주세요</span
          >
          <span
            v-if="onboarding === 3"
            class="fs-3 text-center"
            style="color: white"
            >Movie Chain과 연결 성공!</span
          >
        </v-card-title>

        <v-window v-model="onboarding">
          <!-- 1 페이지: 기본정보 -->
          <v-window-item :onboarding="1">
            <div class="container p-3">
              <!-- 아이디 -->
              <div>
                <v-text-field
                  maxlength="20"
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
                  maxlength="20"
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
              <div class="d-flex row p-5">
                <div
                  class="col-3 text-center p-1"
                  v-for="(genre, idx) in genreList"
                  :key="idx"
                >
                  <v-chip
                    @click="addOrDelGenre(genre.id)"
                    v-if="credentials.like_genres.includes(genre.id)"
                    color="grey darken-3"
                    text-color="white"
                    :pill="true"
                    :ripple="{ class: 'red--text' }"
                  >
                    <v-icon left> mdi-movie-open-outline </v-icon>

                    {{ genre.name }}</v-chip
                  >

                  <v-chip v-else @click="addOrDelGenre(genre.id)">
                    <v-icon left> mdi-movie-open-outline </v-icon>
                    {{ genre.name }}</v-chip
                  >
                </div>
              </div>
              <div></div>
            </v-card-text>
          </v-window-item>

          <!-- 3 페이지: 나만의 영화 3개 -->
          <v-window-item :onboarding="3">
            <!-- 등록된 영화를 보여주는 부분 -->
            <div class="img-box d-flex">
              <div
                class="d-flex col-3 justify-content-center align-items-center"
              >
                <h3 class="d-flex">{{ credentials.nickname }} 님</h3>
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
                  >
                    <button>
                      <div class="movie-img d-flex">
                        <transition name="my-movie-card">
                          <div
                            v-if="
                              nowHoverMyMovieNum === n - 1 &&
                              tempPersonalMovies[n - 1]
                            "
                            class="
                              del-movie-curtain
                              d-flex
                              justify-content-center
                              align-items-center
                            "
                          >
                            <v-icon color="white" size="64" class="my-auto"
                              >mdi-minus-circle-outline</v-icon
                            >
                          </div>
                        </transition>

                        <div
                          class="movie-img"
                          style="background-color: rgb(214, 226, 223)"
                        >
                          <v-img
                            class="movie-img"
                            :src="imgURL(tempPersonalMovies[n - 1])"
                          ></v-img>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 영화등록하는 부분 -->
            <v-card class="grey m-3" rounded="xl">
              <div class="mx-auto p-3">
                <v-autocomplete
                  class="d-flex mx-auto mt-5"
                  hide-details
                  rounded
                  filled
                  clearable
                  open-on-clear
                  color="black"
                  background-color="white"
                  style="width: 400px"
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
                    style="max-height: 500px;"
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
                          class="
                            add-movie-curtain
                            d-flex
                            justify-content-center
                            align-items-center
                          "
                        >
                          <v-icon color="white" size="64" class="my-auto"
                            >mdi-plus-circle-outline</v-icon
                          >
                        </div>
                      </transition>

                      <v-img class="movie-img" :src="imgURL(movie)" />
                    </button>
                  </div>
                </v-card-text>
              </div>
              <v-divider></v-divider>
            </v-card>
          </v-window-item>

          <!-- 4 페이지: 회원가입 완료 -->
          <v-window-item :onboarding="4">
            <div class="pa-4 d-flex justify-content-around">
              <div
                class="fs-3 fw-bold m-5 align-self-center"
                style="width: 150px"
              >
                {{ credentials.nickname }}
              </div>

              <!-- 체인 -->
              <div class="d-flex align-items-center">
                <div stlye="position:relative">
                  <transition name="chain-fade">
                    v-if="onboarding === 3"
                    <div class="d-flex chain" style="top: 40%; left: 40%"></div>
                  </transition>
                  <transition name="chain-fade">
                    <div
                      v-if="onboarding === 3"
                      class="d-flex chain"
                      style="top: 40%; left: 50%"
                    ></div>
                  </transition>
                  <transition name="chain-fade-two">
                    <div
                      v-if="onboarding === 3"
                      class="d-flex chain2"
                      style="top: 45%; left: 45%"
                    ></div>
                  </transition>
                </div>
              </div>

              <img
                style="width: 150px"
                src="@/assets/movie_chain_no_text.png"
              />
            </div>
            <div class="text-center">MovieChain과 연결되었습니다.</div>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <!-- 페이지별 이전버튼 구성 -->
          <v-icon v-if="onboarding === 0" color="white" depressed size="50">
            mdi-chevron-left
          </v-icon>
          <v-icon
            v-if="0 < onboarding && onboarding < 3"
            @click="prev"
            size="50"
          >
            mdi-chevron-left
          </v-icon>
          <v-icon v-if="onboarding === 3" color="white" depressed size="50">
            mdi-chevron-left
          </v-icon>

          <v-spacer></v-spacer>
          <div class="d-flex justify-content-center text-center">
            <div class="justify-content-evenly d-flex" style="width: auto">
              <span v-for="n in 4" :key="`btn-${n}`" class="d-flex m-2">
                <v-icon v-if="onboarding === n - 1" color="primary"
                  >mdi-record</v-icon
                >
                <v-icon v-else color="grey">mdi-record</v-icon>
              </span>
            </div>
          </div>
          <v-spacer></v-spacer>
          <!-- 페이지별 다음버튼 구성 -->
          <v-icon
            v-if="onboarding === 0"
            :disabled="onboarding === length"
            color="primary"
            depressed
            size="50"
            @click="signup(false)"
          >
            mdi-chevron-right
          </v-icon>
          <v-icon
            v-if="onboarding === 1"
            color="primary"
            depressed
            size="50"
            @click="next"
          >
            mdi-chevron-right
          </v-icon>
          <v-icon
            v-if="onboarding === 2"
            color="primary"
            depressed
            size="50"
            @click="signup(true)"
          >
            mdi-check
          </v-icon>
          <v-icon v-if="onboarding === 3" color="white" depressed size="50">
            mdi-close
          </v-icon>
        </v-card-actions>
      </v-card>
    </div>
  </div>
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
            !(v && v.length > 20) || "아이디는 20자 이상 입력할 수 없습니다.",
        ],
        nicknameRule: [
          (v) => !!v || " 닉네임을 입력해주세요.",
          (v) =>
            !(v && v.length > 20) || "닉네임은 20자 이상 입력할 수 없습니다.",
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
      onboarding: 0,

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
      movieAlert: false,
      movieAlertText: null,

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
          this.filteredMovies = this.movies.slice(0, 100);
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
        return `${process.env.VUE_APP_MCS_URL}/media/images/profile/movie_chain_poster.png`;
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
      console.log(this.credentials);
      axios({
        method: "POST",
        url: `${process.env.VUE_APP_MCS_URL}/accounts/signup/`,
        data: this.credentials,
      })
        .then(() => {
          this.onboarding++;
        })
        .catch((err) => {
          console.log(err.response.data);
          if (err.response.data.error) {
            this.movieAlertText = err.response.data.error;
          } else if (err.response.data.username &&
            err.response.data.username[0] ===
            "해당 사용자 이름은 이미 존재합니다."
          ) {
            this.movieAlertText = "이미 등록된 ID 입니다.";
          } else if (err.response.data.nickname &&
            err.response.data.nickname[0] ===
            "사용자의 nickname은/는 이미 존재합니다."
          ) {
            this.movieAlertText = "이미 등록된 닉네임입니다.";
          } else if (err.response.data.email &&
            err.response.data.email[0] ===
            "사용자의 email은/는 이미 존재합니다."
          ) {
            this.movieAlertText = "이미 등록된 이메일입니다.";
          } else {
            this.movieAlertText = "형식이 맞지 않습니다.";
          }
          this.movieAlert = true;
          setTimeout(() => (this.movieAlert = false), 2000);
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
  background-color: rgba(255, 0, 0, 0.3);
  z-index: 100;
}

.add-movie-curtain {
  position: absolute;
  background-color: rgba(72, 117, 72, 0.5);
  z-index: 100;
}
.del-movie-curtain,
.add-movie-curtain,
.movie-img {
  width: 150px;
  height: 225px;
  object-fit: fill;
  border-radius: 25px;
  border: 2px solid #ffffff96;
}
.img-box {
  width: 100%;
  height: 300px;
  object-fit: fill;
  border-radius: 25px;
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

.chain-fade-enter-active,
.chain-fade-leave-active {
  transition-duration: 1s;
}
.chain-fade-enter-active {
  transition-delay: 0.5s;
}
.chain-fade-enter,
.chain-fade-leave-to {
  opacity: 0;
}
.chain-fade-two-enter-active,
.chain-fade-two-leave-active {
  transition-duration: 1s;
}
.chain-fade-two-enter-active {
  transition-delay: 1s;
}
.chain-fade-two-enter,
.chain-fade-two-leave-to {
  opacity: 0;
}
.chain {
  border: 5px rgb(222, 223, 197) solid;
  border-radius: 30px;
  height: 17%;
  width: 8%;
  position: absolute;
}
.chain2 {
  border: 5px white solid;
  background: rgb(222, 223, 197);
  border-radius: 30px;
  height: 15px;
  width: 8%;
  position: absolute;
}
.alert-box {
  position: fixed;
  top: 0;
  width: 45%;
  z-index: 10;
}
.alert {
  position: absolute;
  top: 0;
}
</style>
