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
    setTodos(state, todos) {
      state.todos = todos;
    },
    changeLoadingStatus(state, status) {
      state.filter.loading = status;
    }
  },
  actions: {
    async fetchTodos({ commit, state }, filter) {
      const response = await searchTodo(filter)
      commit('setTodos', response.results);
      state.totalCount = response.totalCount
      state.filter.totalPages = response.totalPages
    },
    async removeTodoById({ commit, state }, id) {
      await deleteTodoRequest(id)
      const todos = state.todos.filter(todo => todo._id !== id);
      commit('setTodos', todos);
    }
  },
}

module.exports = todoStore;