<template>
  <div @click="peopleProfile">
    <div>
      <div class="profile-box" >
        <v-img style="border-radius:25px" v-if="noImage" src="@/assets/no_image.png"></v-img>
        <v-img style="border-radius:25px" v-else :src="imgURL" alt="" class="movie-img"></v-img>
      </div>
      <div class="text-center">{{ person.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PeopleCard",
  props: {
    person: Object,
  },
  methods: {
    peopleProfile: function () {
      this.$router.push({
        name: "PeopleProfile",
      });
    },
  },
  computed: {
    imgURL: function () {
      if (this.person) {
        if (this.person.profile_path) {
          return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`;
        } else {
          return require("@/assets/no_image.png");
        }
      } else {
        return null;
      }
    },
    noImage: function () {
      if (this.person.profile_path) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.profile-box {
  position: relative;
  display: inline-flex;
  width: 150px;
  height: 225px;
  object-fit: fill;
}
</style>
