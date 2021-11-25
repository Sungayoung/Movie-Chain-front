<template>
  <div>
    <v-sheet 
      class="mx-auto py-5" 
      elevation="8" 
      style="background: grey lighten-2; border-radius:25px">
      <people-list-detail-pop
       :people="people">
      </people-list-detail-pop>
      <v-slide-group
        show-arrows
        next-icon="mdi-chevron-right"
        prev-icon="mdi-chevron-left"
      >
        <people-card
          v-for="idx in people.length"
          :key="people[idx - 1].id"
          :person="people[idx - 1]"
          class="ma-4"
        >
        </people-card>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import PeopleCard from "./PeopleCard.vue";
import PeopleListDetailPop from '@/components/popups/PeopleListDetailPop.vue'
export default {
  name: "PeopleCardList",
  props: {
    people: Array,
  },
  components: {
    PeopleCard,
    PeopleListDetailPop,
  },
};
</script>

<style></style>
