<template>
  <div class="container my-auto">
    <div class="ms-5"> 
      <v-text-field
        class="d-inline-flex ms-5"
        v-model="query"
        placeholder="영화, 감독, 인물을 검색하세요."
        solo
        hide-details
        clearable
        filled
        color="grey"
        dense
        background-color="white"
        style="width: 300px"
        @keyup.enter="search"
      ></v-text-field>
      <v-icon large color="white" @click="search" class="align-center ms-3"
        >mdi-magnify</v-icon
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  data: function () {
    return {
      query: null,
    };
  },
  components: {},
  methods: {
    search: function () {
      this.$router.push({
        name: "MovieSearchResult",
        params: {
          query: this.query,
        },
      });
      this.$router.go()
    },
  },
};
</script>

<style></style>
