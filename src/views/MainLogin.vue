<template>
   <div
        v-if="!isLogin"
        id="login-page"
        class="d-flex justify-content-center login-page"
      >
        <div class="my-auto">
          <img
            alt="MovieChain Logo"
            class="d-flex justif mx-auto"
            src="@/assets/movie_chain.png"
            width="200"
          />
          <Login />
        </div>
      </div>
</template>

<script>
import { mapState } from 'vuex'
import Login from '../components/accounts/Login.vue'
export default {
namd:"MainLogin",
components: {
  Login,
},
computed: {
  ...mapState(['isLogin'])
}

}
</script>

<style>

</style>