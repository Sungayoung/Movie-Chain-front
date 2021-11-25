<template>
  <div @click="peopleProfile">
    <div>
      <div class="profile-box">
        <v-sheet
          class="text-center fw-bold"
          elevation="12"
          rounded="xl"
          color="grey lighten-5"
        >
          <v-img
            style="border-radius: 25px"
            :src="imgURL"
            alt=""
            class="movie-img"
          ></v-img>
          <div stlye="position:absolute; bottom:0;">
            {{ person.name }}
          </div>
        </v-sheet>
      </div>
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
        params: { personId: String(this.person.id) },
      });
    },
  },
  computed: {
    imgURL: function () {
      if (this.person) {
        if (this.person.profile_path) {
          return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`;
        } else {
          return `${process.env.VUE_APP_MCS_URL}/media/images/profile/person_default.jpg`;
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
  width: 150px;
  height: 250px;
  border: 2px solid white;
  border-radius: 25px;
}
</style>
