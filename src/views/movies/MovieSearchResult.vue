<template>
  <div>
    <h3>영화</h3>
    <movie-card-list
    v-if="movies"
    :movies="movies"
    :maxLength="movies.length">
    </movie-card-list>
    
    <h3>배우</h3>
    <people-card-list
    v-if="actors"
    :people="actors"
    :maxLength="actors.length">
    </people-card-list>

    <h3>감독</h3>
    <people-card-list
    v-if="crews"
    :people="crews"
    :maxLength="crews.length">
    </people-card-list>
  </div>
</template>

<script>
import MovieCardList from "@/components/movies/MovieCardList.vue";
import PeopleCardList from "@/components/people/PeopleCardList.vue";
import { mapActions } from 'vuex'
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
    }
  },
  created: function () {
    this.search(this.query)
    .then( res => {
      console.log(res)
      this.actors = res.actors
      this.crews = res.crews
      this.movies = res.movies
    })
    .catch( err => {
      console.log(err)
    })
  },
  methods: {
    ...mapActions([
      'search'
    ])
  }

};
</script>

<style></style>
