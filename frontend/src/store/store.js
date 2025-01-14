const { createStore } = require("vuex");
const tagStore = require("./tagStore");
const todoStore = require('./todoStore')

const store = createStore({
  modules: {
    tag: tagStore,
    todo: todoStore
  }
});

module.exports = store;