import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "@/components/accounts/Signup.vue";
import Login from "@/components/accounts/Login.vue";
import MainPage from "../views/MainPage.vue";
import MovieList from "../views/movies/MovieList";
import MovieDetail from "../views/movies/MovieDetail";
import UserProfile from "../views/profile/UserProfile";
import PeopleProfile from "../views/profile/PeopleProfile";
import MovieSearchResult from "@/views/movies/MovieSearchResult";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/accounts/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/accounts/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/movielist",
    name: "MovieList",
    component: MovieList,
  },
  {
    path: "/moviedetail/:movieId",
    name: "MovieDetail",
    component: MovieDetail,
    props: true,
  },
  {
    path: "/accounts/peopleProfile",
    name: "peopleProfile",
    component: PeopleProfile
  },
  {
    path: "/search/:query",
    name: 'MovieSearchResult',
    component: MovieSearchResult,
    props: true,
  },
  {
    path: "/accounts/profile/:nickname",
    name: "Profile",
    component: UserProfile,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
