<template>
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
</template>

<script>
export default {
  name: "Page4",
};
</script>

<style></style>
