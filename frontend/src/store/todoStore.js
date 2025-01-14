const { deleteTodoRequest, searchTodo } = require('../api/totoRequest');
const todoStore = {
  state: {
    todos: [],
    filter: {
      title: '',
      completed: 'all',
      loading: false
    }
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
    async fetchTodos({ commit }, filter) {
      const todos = await searchTodo(filter)
      commit('setTodos', todos);
    },
    async removeTodoById({ commit, state }, id) {
      await deleteTodoRequest(id)
      const todos = state.todos.filter(todo => todo._id !== id);
      commit('setTodos', todos);
    }
  },
}

module.exports = todoStore;