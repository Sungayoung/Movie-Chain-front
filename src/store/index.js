import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: localStorage.getItem("jwt") ? true : false,
    profile_img: null,
    nickname: null,
    lastHoverMBDURL: null,
    lastHoverMovieId: null,

    // 뒤로가기시 필터가 빠지지 않게 만드는 변수
    Spage: 1,
    SmovieCnt: 18,
    SorderBy: null,
    SfilterBy: "all",
    SfilterId: null,
    SfilterIdList: [],
  },
  mutations: {
    SET_MBDURL: function (state, movie) {
      state.lastHoverMBDURL = movie.url;
      state.lastHoverMovieId = movie.id;
      localStorage.setItem("lastHoverMBDURL", movie.url);
      localStorage.setItem("lastHoverMovieId", movie.id);
    },
    LOG_IN: function (state) {
      state.lastHoverMBDURL = null;
      state.lastHoverMovieId = null;
      state.isLogin = true;
      const token = localStorage.getItem("jwt");
      axios({
        method: "get",
        url: `${process.env.VUE_APP_MCS_URL}/accounts/profile/`,
        headers: { Authorization: `JWT ${token}` },
      }).then((res) => {
        this.commit("SET_PROFILE", res.data);
      });
    },
    LOG_OUT: function (state) {
      state.profile_img = null;
      state.nickname = null;
      state.isLogin = false;
      localStorage.removeItem("jwt");
    },
    SET_PROFILE: function (state, res) {
      state.profile_img = `${res.profile_img}?_=${new Date().getTime()}`;
      state.nickname = res.nickname;
    },
    UPDATE_INFO: function (state, info) {
      state.Spage = info.page;
      state.SmovieCnt = info.movieCnt;
      state.SorderBy = info.orderBy;
      state.SfilterBy = info.filterBy;
      state.SfilterId = info.filterId;
      state.SfilterIdList = info.filterIdList;
    },
  },
  actions: {
    setMBDURL: function ({ commit }, url) {
      commit("SET_MBDURL", url);
    },
    logIn: function ({ commit }) {
      commit("LOG_IN");
    },
    logOut: function ({ commit }) {
      commit("LOG_OUT");
    },
    getRecommendMovie: function ({ commit }) {
      commit;
      const token = localStorage.getItem("jwt");

      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/movies/recommend/`,
          headers: { Authorization: `JWT ${token}` },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
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
            resolve(res.data);
          })
          .catch((err) => {
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
            resolve(res.data);
          })
          .catch((err) => {
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
    getProfile: function ({ commit }, nickname) {
      commit;
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/profile/`,
          headers: { Authorization: `JWT ${token}` },
          params: { nickname },
        })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    setProfileImg: function ({ commit }, data) {
      const token = localStorage.getItem("jwt");
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: `${process.env.VUE_APP_MCS_URL}/accounts/profile/`,
          data: data,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `JWT ${token}`,
          },
        })
          .then((res) => {
            commit("SET_PROFILE", res.data);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.data);
          });
      });
    },
    updateInfo: function ({ commit }, info) {
      commit("UPDATE_INFO", info);
    },
  },
  modules: {},
});
