// store/modules/log.js
export default {
    namespaced: true,
    state: {
      entries: [],
      totalLines: 0,
    },
    mutations: {
      setEntries(state, entries) {
        state.entries = entries;
      },
      setTotalLines(state, totalLines) {
        state.totalLines = totalLines;
      },
    },
    actions: {
      updateLogData({ commit }, { entries, totalLines }) {
        commit('setEntries', entries);
        commit('setTotalLines', totalLines);
      },
    },
  };
  