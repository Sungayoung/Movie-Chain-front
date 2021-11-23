<template>
  <div>
    <v-sheet
      class="mx-auto"
      elevation="8"
      max-width="85%"
      style="background: gray; border-radius:25px"
    >
      <v-slide-group
        show-arrows
        next-icon="mdi-chevron-right"
        prev-icon="mdi-chevron-left"
      >
        <people-card
        v-for="idx in people.length"
        :key="people[idx-1].id"
        :person="people[idx-1]"
        class="ma-4">
        </people-card>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import PeopleCard from "./PeopleCard.vue";
export default {
  name: "PeopleCardList",
  props: {
    people: Array,
  },
  components: {
    PeopleCard,
  },
};
</script>

<style>

</style>