<template>
  <div>
    <input type="text" style="color: white" v-model="query" @keyup.enter="search">
    <button @click="search">검색</button>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  data: function () {
    return {
      query: null,
    }
  },
  components: {},
  methods: {
    search: function () {
      this.$router.push({
        name: 'MovieSearchResult',
        params: {
          query: this.query
        }
      })
    }
  }
};
</script>

<style></style>
