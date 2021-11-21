<template>
  <div class="container justify-content-center">
    <img
      alt="MovieChain Logo"
      class="d-flex justif mx-auto"
      src="@/assets/movie_chain.png"
      width="200"
    />
    <div v-if="isLogin">
      <MovieCard/>
      <SearchInput/>
      
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Login from '../components/accounts/Login.vue';
import MovieCard from '../components/movies/MovieCard.vue';
import SearchInput from '../components/SearchInput.vue';
export default {
  name: "MainPage",
  components: {
    Login,
    SearchInput,
    MovieCard
  },
  computed: {
    ...mapState(["isLogin"]),
  },
};
</script>

<style></style>
