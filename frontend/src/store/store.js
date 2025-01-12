const { createStore } = require("vuex");
const tagStore = require("./tagStore");

const store = createStore({
  modules: {
    tag: tagStore,
  }
})


module.exports = store;