<template>
  <div @click="peopleProfile">
    <div>
      <button
        @mouseover="nowPersonId = person.id"
        @mouseleave="nowPersonId = null"
      >
        <div class="profile-box">
          <v-sheet
            class="text-center fw-bold"
            elevation="12"
            rounded="xl"
            color="grey lighten-5"
          >
            <v-img class="my-profile" :src="imgURL" alt=""></v-img>
            <transition name="my-movie-card">
              <div
                v-if="nowPersonId === person.id"
                class="
                  my-content
                  d-flex
                  align-items-center
                  justify-content-center
                "
              >
                <div class="container p-3 d- justify-content-center">
                  <div style="flex-wrap: wrap; position:relative">
                    <p v-if="person.job">{{ person.job}}</p>
                    <p v-if="person.character" class="text-wrap">{{ person.character }} 역</p>
                  </div>
                  <hr />
                  <button class="text-center">
                    <v-icon @click="moveDetail" dark right size="40">
                      mdi-open-in-new
                    </v-icon>
                  </button>
                </div>
              </div>
            </transition>
            <div stlye="position:absolute; bottom:0;">
              {{ person.name }}
            </div>
          </v-sheet>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PeopleCard",
  data: function () {
    return {
      nowPersonId: null,
    };
  },
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
.my-profile {
  height: 225px;
  width: 150px;
  transition-duration: 200ms;
  z-index: 5;
  border-radius: 25px;
}
.my-content {
  color: whitesmoke;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 0;
  width: 146px;
  height: 225px;
  z-index: 6;
  transition-duration: 200ms;
  border-radius: 25px;
}
.my-movie-card-enter-active {
  transition-duration: 0.2s;
}
.my-movie-card-leave-active {
  transition-duration: 0.5s;
  transition-delay: 0.5s;
}

.my-movie-card-enter,
.my-movie-card-leave-to {
  opacity: 0;
  
}
</style>
