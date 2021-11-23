<template>
  <div @click="peopleProfile">
    <div>
      <div class="profile-box" >
        <v-img style="border-radius:25px" :src="imgURL" alt="" class="movie-img"></v-img>
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
        name: "PeopleProfile", params: { 'personId': String(this.person.id) }
      });
    },
  },
  computed: {
    imgURL: function () {
      if (this.person) {
        if (this.person.profile_path) {
          return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`;
        } else {
          return `${process.env.VUE_APP_MCS_URL}/media/images/profile/person_default.jpg`
        }
      } else {
        return null;
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
