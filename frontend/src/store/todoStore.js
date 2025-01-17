const { deleteTodoRequest, searchTodo } = require('../api/totoRequest');
const todoStore = {
  state: {
    todos: [],
    totalCount: 0,
    filter: {
      title: '',
      completed: 'all',
      priority: 'all',
      tags: [],
      loading: false,
      page: 1,
      totalPages: 1
    },
  },
  mutations: {
    setTodos(state, searchTodo) {
      state.todos = searchTodo.results;
      state.totalCount = searchTodo.totalCount
      state.filter.totalPages = searchTodo.totalPages
    },
    changeLoadingStatus(state, status) {
      state.filter.loading = status;
    }
  },
  actions: {
    async fetchTodos({ commit }, filter) {
      commit('setTodos', await searchTodo(filter));
    },
    async removeTodoById({ commit, state }, id) {
      await deleteTodoRequest(id)
      commit('setTodos', await searchTodo(state.filter));
    }
  },
}

module.exports = todoStore;