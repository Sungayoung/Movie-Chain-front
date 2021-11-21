<template>
  <div>
    <v-sheet
      class="mx-auto"
      elevation="8"
      max-width="85%"
      style="background: gray;"
    >
      <v-slide-group
        class="pa-4"
        show-arrows
      >
        <people-card
        v-for="idx in maxLength"
        :key="idx"
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
    maxLength: Number,
  },
  components: {
    PeopleCard,
  },
};
</script>

<style>

</style>