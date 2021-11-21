<template>
  <div>
    <h1>Signup</h1>
    <!-- 점 페이지네이션 -->
    <v-item-group v-model="onboarding" class="text-center" mandatory>
      <v-item v-for="n in length" :key="`btn-${n}`">
        <v-icon v-if="onboarding === n - 1" color="teal darken-2"
          >mdi-record</v-icon
        >
        <v-icon v-else color="white">mdi-record</v-icon>
      </v-item>
    </v-item-group>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>Movie Chain과 연결하기</span>
      </v-card-title>

      <v-window v-model="onboarding">
        <!-- 1 페이지: 기본정보 -->
        <v-window-item :onboarding="1">
          <div class="container p-3">
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="ID"
                type="text"
                v-model="credentials.username"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="Nickname"
                type="text"
                v-model="credentials.nickname"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="e-mail"
                type="text"
                v-model="credentials.email"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="Password"
                type="password"
                v-model="credentials.password"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required, rules.notConfirmed]"
                label="Password Confirmation"
                type="password"
                v-model="credentials.passwordConfirmation"
              />
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
                  pill="true"
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
          <v-autocomplete
          color='green'
            hint="몰라욤"
            height="150"
            width='150'
            class="d-flex row"
            :disabled="isUpdating"
            v-model="nowMovie"
            :items="movieList"
            item-text="title"
            return-object
            :change="searchMatrix"
            label="My Movies"
            hide-spin-buttons
          >
            
            <template v-slot:item="data">
              <div style="width:300px">
                <template>
                  <div >
                    <v-list-item-image>
                      <v-img
                        :src="
                          'https://image.tmdb.org/t/p/w500' +
                          data.item.poster_path
                        "
                        width="100"
                      />
                    </v-list-item-image>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </div>
                </template>
              </div>
            </template>
          </v-autocomplete>

          <v-card-text>
            <h1 class="text-h6 font-weight-light mb-2 align-self-center">
              {{ credentials.nickname }}
            </h1>

            <h1
              v-for="movie in credentials.personal_movies"
              :key="movie"
              @click="delMovie"
            >
              {{ movie }}
            </h1>
          </v-card-text>
        </v-window-item>

        <!-- 4 페이지: 회원가입 완료 -->
        <v-window-item :onboarding="4">
            <div class='text-center'>
              MovieChain과 연결되었습니다.
              </div>
          <div class="pa-4 d-flex justify-content-around">
            <div class="text-h6 font-weight-light mb-2 align-self-center" style="width:150px">
              {{ credentials.nickname }} 강동옥
            </div>
            <img
            style='width: 150px;'
              src="@/assets/movie_chain_no_text.png"
            />
          </div>

        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-icon :disabled="onboarding === 0" text @click="prev">
          mdi-chevron-left
        </v-icon>
        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
        <v-icon
          :disabled="onboarding === length"
          color="primary"
          depressed
          @click="next"
        >
          mdi-chevron-right
        </v-icon>
      </v-card-actions>
    </v-card>

    <button @click.stop="signup">Signup</button>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "Signup",
  data: function () {
    return {
      // personal movie 선택창에 필요힌 변수들
      movieList: [],
      nowMovie: null,

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
        required: (value) => !!value || "Required.",
        lengthValid: (value) =>
          (value && value.length >= 5) || "Min 5 characters",
        notConfirmed: (value) =>
          !(value === this.password) || "비밀번호가 일치하지 않습니다.",
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
      },
    };
  },
  created: function () {
    const params = {
      filter_by: "all",
    };
    this.getMovieList(params)
      .then((res) => {
        // console.log(res);
        this.movieList = res;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    ...mapActions(["getMovieList"]),
    searchMatrix: function () {
      document.querySelectorAll(".v-list").classList.add("row");
      document.querySelectorAll(".v-list-item").classList.add("col-3");
    },
    delMovie: function (movieId) {
      const idx = this.credentials.personal_movies.findIndex(
        (item) => item === movieId
      );
      this.credentials.personal_movies.splice(idx, 1);
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
      this.onboarding =
        this.onboarding + 1 === this.length
          ? this.length - 1
          : this.onboarding + 1;
    },
    prev: function () {
      this.onboarding = this.onboarding - 1 < 0 ? 0 : this.onboarding - 1;
    },
    signup: function () {
      axios({
        method: "POST",
        url: "http://127.0.0.1:8000/accounts/signup/",
        data: this.credentials,
      })
        .then(() => {
          axios({
            method: "POST",
            url: "http://127.0.0.1:8000/accounts/api-token-auth/",
            data: this.credentials,
          })
            .then((res) => {
              localStorage.setItem("jwt", res.data.token);
              this.$router.push({ name: "Home" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  watch: {
    nowMovie: function () {
      if (this.credentials.personal_movies.length < 3) {
        this.credentials.personal_movies.push(this.nowMovie.id);
      }
    },
  },
};
</script>

<style></style>
