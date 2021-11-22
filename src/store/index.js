import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: localStorage.getItem('jwt') ? true : false,
  },
  mutations: {
    LOG_IN: function (state) {
      state.isLogin = true;
    },
    LOG_OUT: function (state) {
      state.isLogin = false;
      localStorage.removeItem("jwt")
    },
  },
  actions: {
    logIn: function ({ commit }) {
      commit("LOG_IN");
    },
    logOut: function ({ commit }) {
      commit("LOG_OUT");
    },
    getMovieList: function ({ commit }, params) {
      /**
       * params: {
       *  filter_by : all, actor, crew, keyword, genre
       *  filter_id : actor/crew/keyword/genre's id
       *  order_by : release_date, vote_average, title, -release_date, -vote_average, -title
       * }
       */
      commit;
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/`,
          params,
        })
          .then((res) => {
            // console.log(res.data)
            resolve(res.data);
          })
          .catch((err) => {
            // console.log(err.data)
            reject(err.data);
          });
      });
    },
    getMovieListPage: function ({ commit }, params) {
      /**
       * params: {
       *  filter_by : all, actor, crew, keyword, genre
       *  filter_id : actor/crew/keyword/genre's id
       *  order_by : release_date, vote_average, title, -release_date, -vote_average, -title
       * }
       */
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/page/`,
          headers: { Authorization: `JWT ${token}` },
          params,
        })
          .then((res) => {
            // console.log(res.data)
            resolve(res.data);
          })
          .catch((err) => {
            // console.log(err.data)
            reject(err.data);
          });
      });
    },
    search: function ({ commit }, query) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/search/`,
          headers: { Authorization: `JWT ${token}` },
          params: {
            query: query,
          },
        })
          .then((res) => {
            // console.log(res.data);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    getMovieDetail: function ({ commit }, movieId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/${movieId}/`,
          headers: { Authorization: `JWT ${token}` },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    getActorList: function ({ commit }, movieId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/${movieId}/actors/`,
          headers: { Authorization: `JWT ${token}` },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    getCrewList: function ({ commit }, movieId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/${movieId}/crews/`,
          headers: { Authorization: `JWT ${token}` },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    getReview: function ({ commit }, movieId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/${movieId}/reviews/`,
          headers: { Authorization: `JWT ${token}` },
          method: "get",
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    createReview: function ({ commit }, data) {
      commit;
      console.log(data);
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/${data.movieId}/reviews/`,
          headers: { Authorization: `JWT ${token}` },
          method: "post",
          data: data.params,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    updateReview: function ({ commit }, data) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/reviews/${data.reviewId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "put",
          data: data.params,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    deleteReview: function ({ commit }, reviewId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/reviews/${reviewId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "delete",
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    getComment: function ({ commit }, reviewId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/reviews/${reviewId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "get",
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    createComment: function ({ commit }, data) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/reviews/${data.reviewId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "post",
          data: data.params,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    updateComment: function ({ commit }, data) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/comments/${data.commentId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "put",
          data: data.params,
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    deleteComment: function ({ commit }, commentId) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          url: `${process.env.VUE_APP_MCS_URL}/movies/comments/${commentId}/`,
          headers: { Authorization: `JWT ${token}` },
          method: "delete",
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
  },
  modules: {},
});
