import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "@/components/accounts/Signup.vue";
import Login from "@/components/accounts/Login.vue";
import MainPage from "../views/MainPage.vue";
import MovieList from "../views/movies/MovieList";
import MovieDetail from "../views/movies/MovieDetail";
import UserProfile from "../views/profile/UserProfile";

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
    path: "/accounts/profile",
    name: "Profile",
    component: UserProfile,
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
