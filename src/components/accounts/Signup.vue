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
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
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
import Page1 from "@components/accounts/signuppages/Page1.vue";
import Page2 from "@components/accounts/signuppages/Page2.vue";
import Page3 from "@components/accounts/signuppages/Page3.vue";
import Page4 from "@components/accounts/signuppages/Page4.vue";

export default {
  name: "Signup",
  components: {
    Page1,
    Page2,
    Page3,
    Page4,
  },
  data: function () {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        lengthValid: (value) =>
          (value && value.length >= 5) || "Min 5 characters",
        notConfirmed: (value) =>
          !(value === this.password) || "비밀번호가 일치하지 않습니다.",
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
