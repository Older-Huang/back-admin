import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    adminInfo: {}
  },
  mutations: {
    changeAdminInfo(state, newAdminInfo) {
      state.adminInfo = newAdminInfo;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
