import { createStore } from 'vuex';
import log from './modules/log';

export default createStore({
  modules: {
    log,
  },
});