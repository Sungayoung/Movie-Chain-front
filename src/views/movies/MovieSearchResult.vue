<template>
  <div v-if="query" style="z-index: 3">
    <div class="black-curtain"></div>

    <v-sheet
      rounded="xl"
      color="#FFFFFFA3"
      elevation="12"
      class="mx-auto"
      width="65%"
      style="margin-top: 100px; z-index: 3; position: relative"
    >
      <div class="py-3">
        <div>
          <h3 style="text-align: center">
            <strong>" {{ query }} "</strong> 검색결과
          </h3>
        </div>
        <v-divider></v-divider>
        <div v-if="movies.length + actors.length + crews.length">
          <div v-if="movies.length" class="my-5">
            <h4 style="text-align: center">영화</h4>
            <movie-card-list v-if="movies" :movies="movies"> </movie-card-list>
          </div>
          <div v-if="actors.length" class="my-5">
            <h4 style="text-align: center">배우</h4>
            <people-card-list
              style="width: 90%"
              class="mx-auto"
              :people="actors"
            >
            </people-card-list>
          </div>
          <div v-if="crews.length" class="my-5">
            <h4 style="text-align: center">감독</h4>
            <people-card-list
              style="width: 90%"
              class="mx-auto"
              :people="crews"
            >
            </people-card-list>
          </div>
        </div>
        <div
          v-else
          style="height: 600px"
          class="d-flex justify-content-center align-items-center"
        >
          <h4>검색 결과가 없습니다.</h4>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import MovieCardList from "@/components/movies/MovieCardList.vue";
import PeopleCardList from "@/components/people/PeopleCardList.vue";
import { mapActions } from "vuex";
export default {
  name: "MovieSearchResult",
  components: {
    MovieCardList,
    PeopleCardList,
  },
  props: {
    query: String,
  },
  data: function () {
    return {
      actors: null,
      crews: null,
      movies: null,
      genres: null,
      keywords: null,
    };
  },
  created: function () {
    this.search(this.query)
      .then((res) => {
        console.log(res);
        this.actors = res.actors;
        this.crews = res.crews;
        this.movies = res.movies;
        this.genres = res.genres;
        this.keywords = res.keywords;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    ...mapActions(["search"]),
  },
};
</script>

<style scoped>
.black-curtain {
  position: fixed;
  top: 0;
  background: rgb(0, 0, 0, 0.5);
  width: 100%;
  height: 200vh;
  transition-delay: 1s;
  transition-duration: 1.1s;
  z-index: 1;
}
</style>
