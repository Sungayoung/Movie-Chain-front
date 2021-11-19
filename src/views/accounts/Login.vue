<template>
  <div>
    <div class="p-3">
      <h1 style="color: white">Login</h1>
      <div class="login-box container rounded-lg">
        <div class="px-5 my-2">
          <v-text-field
            autofocus
            label="ID"
            type="text"
            id="username"
            color="cyan darken-4"
            v-model="credentials.username"
            :rules="[rules.required]"
            hide-details="auto"
            @keyup.enter="login"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            color="cyan darken-4"
            id="password"
            :rules="[rules.required]"
            v-model="credentials.password"
            @keyup.enter="login"
          ></v-text-field>
        </div>
        <div class="d-flex justify-end mx-3">
          <v-icon @click.stop="login">mdi-chevron-right</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "Login",
  data: function () {
    return {
      credentials: {
        username: null,
        password: null,
      },
      rules: {
        required: (value) => !!value || "Required.",
        lengthValid: (value) =>
          (value && value.length >= 5) || "Min 5 characters",
      },
    };
  },
  methods: {
    ...mapActions(["logIn"]),
    login: function () {
      axios({
        method: "POST",
        url: "http://127.0.0.1:8000/accounts/api-token-auth/",
        data: this.credentials,
      })
        .then((res) => {
          console.log(res);
          localStorage.setItem("jwt", res.data.token);
          this.$router.push({ name: "Home" });
          this.logIn();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.login-box {
  background: rgba(245, 245, 245, 0.8);
}
</style>
