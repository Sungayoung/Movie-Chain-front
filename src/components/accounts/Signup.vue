<template>
  <div>
    <h1>Signup</h1>
    <!-- 점 페이지네이션 -->
    <v-item-group v-model="onboarding" class="text-center" mandatory>
      <v-item v-for="n in length" :key="`btn-${n}`">
        <v-icon v-if="onboarding === n - 1" color="green">mdi-record</v-icon>
        <v-icon v-else color="white">mdi-record</v-icon>
      </v-item>
    </v-item-group>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>Movie Chain과 연결하기</span>
      </v-card-title>

      <v-window v-model="onboarding">
        <!-- 1 페이지 -->
        <v-window-item :onboarding="1">
          <div class="container p-3">
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="ID"
                type="text"
                id="username"
                v-model="credentials.username"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="Nickname"
                type="text"
                id="nickname"
                v-model="credentials.nickname"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="e-mail"
                type="text"
                id="email"
                v-model="credentials.email"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required]"
                label="Password"
                type="password"
                id="password"
                v-model="credentials.password"
              />
            </div>
            <div>
              <v-text-field
                :rules="[rules.required, rules.notConfirmed]"
                label="Password Confirmation"
                type="password"
                id="passwordConfirmation"
                v-model="credentials.passwordConfirmation"
              />
            </div>
          </div>
        </v-window-item>

        <!-- 2 페이지 -->
        <v-window-item :onboarding="2">
          <v-card-text>
            <v-text-field label="Password" type="password"></v-text-field>
            <v-text-field
              label="Confirm Password"
              type="password"
            ></v-text-field>
            <span class="text-caption grey--text text--darken-1">
              Please enter a password for your account
            </span>
          </v-card-text>
        </v-window-item>

        <!-- 3 페이지 -->
        <v-window-item :onboarding="3">
          <v-card-text>
            <v-text-field label="Password" type="password"></v-text-field>
            <v-text-field
              label="Confirm Password"
              type="password"
            ></v-text-field>
            <span class="text-caption grey--text text--darken-1">
              Please enter a password for your account
            </span>
          </v-card-text>
        </v-window-item>

        <!-- 4 페이지 -->
        <v-window-item :onboarding="4">
          <div class="pa-4 d-flex">
            <h1 class="text-h6 font-weight-light mb-2 align-self-center">
              {{ credentials.nickname }}
            </h1>
            <v-img
              class="mb-4"
              contain
              height="128"
              src="@/assets/movie_chain_no_text.png"
            ></v-img>
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

export default {
  name: "Signup",
  data: function () {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        lengthValid: (value) =>
          (value && value.length >= 5) || "Min 5 characters",
        notConfirmed: (value) => !(value===this.password) || '비밀번호가 일치하지 않습니다.',
      },
      length: 4,
      onboarding: 0,
      credentials: {
        username: null,
        nickname: null,
        email: null,
        password: null,
        passwordConfirmation: null,
      },
    };
  },
  methods: {
    next() {
      this.onboarding =
        this.onboarding + 1 === this.length
          ? this.length - 1
          : this.onboarding + 1;
    },
    prev() {
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
};
</script>

<style></style>
