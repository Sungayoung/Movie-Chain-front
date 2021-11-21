<template>
  <v-container style="height: 100vh">
    <transition name="fade" mode="out-in">
      <v-col class="d-flex align-center justify-center" style="height: 80vh">
        <div>
          <img
            alt="MovieChain Logo"
            class="d-flex justif mx-auto"
            src="@/assets/movie_chain.png"
            width="200"
          />

          <div v-if="isLogin">
            <SearchInput />
          </div>
          <div v-else>
            <Login />
          </div>
        </div>
      </v-col>
    </transition>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Login from "../components/accounts/Login.vue";
import SearchInput from "../components/SearchInput.vue";

export default {
  name: "MainPage",
  components: {
    Login,
    SearchInput,
  },
  computed: {
    ...mapState(["isLogin"]),
  },
};
</script>

<style></style>
