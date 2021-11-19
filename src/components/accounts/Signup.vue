<template>
  <div>
    <h1>Signup</h1>
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary lighten-2"
          class="subheading white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="1">
          <div>
            <v-text-field
              label="name"
              type="text"
              id="username"
              v-model="credentials.username"
              @keyup.enter="signup"
            />
          </div>
          <div>
            <v-text-field
              label="nickname"
              type="text"
              id="nickname"
              v-model="credentials.nickname"
              @keyup.enter="signup"
            />
          </div>
          <div>
            <v-text-field
              label="email"
              type="text"
              id="email"
              v-model="credentials.email"
              @keyup.enter="signup"
            />
          </div>
          <div>
            <v-text-field
              label="password"
              type="text"
              id="password"
              v-model="credentials.password"
              @keyup.enter="signup"
            />
          </div>
          <div>
            <v-text-field
              label="passwordConfirmation"
              type="text"
              id="passwordConfirmation"
              v-model="credentials.passwordConfirmation"
              @keyup.enter="signup"
            />
          </div>
        </v-window-item>

        <v-window-item :value="2">
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

        <v-window-item :value="3">
          <div class="pa-4 text-center">
            <v-img
              class="mb-4"
              contain
              height="128"
              src="https://cdn.vuetifyjs.com/images/logos/v.svg"
            ></v-img>
            <h3 class="text-h6 font-weight-light mb-2">Welcome to Vuetify</h3>
            <span class="text-caption grey--text">Thanks for signing up!</span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-icon :disabled="onboarding === 0" text @click="prev">
          mdi-chevron-left
        </v-icon>
        <v-item-group v-model="onboarding" class="text-center" mandatory>
          <v-item
            v-for="n in length"
            :key="`btn-${n}`"
            v-slot="{ active, toggle }"
          >
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>mdi-record</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>
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
      length: 3,
      onboarding: 0,
      credentials: {
        username: null,
        nickname: null,
        email: null,
        password: null,
        paswordConfirmation: null,
      },
    };
  },
  methods: {
    next() {
      this.onboarding =
        this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
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
