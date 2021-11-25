<template>
  <div class="d-flex justify-center">
    <div class="alert-box">
        <div class="d-flex justify-content-center">
          <transition
            name="custom-classes-transition"
            enter-active-class="animated animate__fadeInDown"
            leave-active-class="animated animate__fadeOutUp"
          >
            <v-alert v-if="validAlert" type="error" class="alert d-flex">
              아이디와 비밀번호를 다시 확인해주세요.
            </v-alert>
            <v-alert v-if="movieAlert" type="error" class="alert d-flex">
              {{ movieAlertText }}
            </v-alert>
          </transition>
        </div>
      </div>
    <div>
      <div class="login-box rounded-lg p-3">
        <div class="px-5 my-2">
          <v-text-field
            autofocus
            label="ID"
            type="text"
            id="username"
            color="cyan darken-4"
            v-model="credentials.username"
            :rules="[rules.required]"
            class="rounded-lg"
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
        <div class="d-flex justify-content-between mx-3">
          <v-btn text class="mx-2" @click.stop="isSignup=true" dense
            >Signup</v-btn>
          <v-btn text class="mx-2" @click.stop="login">
          <v-icon readonly>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-model="isSignup" width="45%">
      <Signup/>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import Signup from './Signup.vue';

export default {
  name: "Login",
  data: function () {
    return {
      validAlert: false,
      isSignup:false,
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
  components: {
    Signup
  },
  methods: {
    ...mapActions(["logIn"]),
    moveSignup: function () {
      this.$router.push({ name: "Signup" });
    },
    login: function () {
      axios({
        method: "POST",
        url: `${process.env.VUE_APP_MCS_URL}/accounts/api-token-auth/`,
        data: this.credentials,
      })
        .then((res) => {
          localStorage.setItem("jwt", res.data.token);
          this.logIn();
        })
        .catch(() => {
           this.validAlert = true;
          setTimeout(() => (this.validAlert = false), 2000);
        });
    },
  },
};
</script>

<style scoped>
.login-box {
  width: 300px;
  background: rgba(245, 245, 245, 0.8);
}

html::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  height: 12%;
  background-color: rgba(255, 255, 255,0.5) !important;
  border-radius: 25px;
}
::-webkit-scrollbar-track {
  position: scroll;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
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
