<template>
  <div @click="peopleProfile">
    <img :src="imgURL" alt="" class="movie-img">
  </div>
</template>

<script>
export default {
  name: "PeopleCard",
  props: {
    person: Object
  },
  methods: {
    peopleProfile: function () {
      this.$router.push({
        name: 'PeopleProfile',
      })
    }
  },
  computed: {
    imgURL: function () {
      if (this.person){
        if (this.person.profile_path) {
          return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`
        }
        else {
          return require("@/assets/no_image.png")
        }
      }
      else {
        return null
      }
    }
  }
}
</script>

<style>

</style>