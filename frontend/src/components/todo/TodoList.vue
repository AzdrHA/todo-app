<template>
  <div>
    <form class="flex mb-4" @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Ajouter une tâche"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter
      </button>
    </form>

    <div ref="sortableList" class="space-y-2">
      <transition-group>
        <TodoListItem v-for="todo in todos" :key="todo._id" :todo="todo" @delete-todo="deleteTodo" @update-todo="updateTodo"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import TodoListItem from "./TodoListItem.vue";
import {
  addTodoRequest,
  deleteTodoRequest,
  getAllTodoRequest,
  reorderTodoRequest,
  updateTodoRequest
} from "../../api/totoRequest";

export default {
  name: 'TodoList',
  components: {TodoListItem},
  data() {
    return {
      todos: [],
      newTodo: '',
    };
  },
  mounted() {
    this.fetchTodos();
    // Initialiser Sortable
    Sortable.create(this.$refs.sortableList, {
      handle: '.handle',
      animation: 150,
      onEnd: this.onDragEnd,
    });
  },
  methods: {
    async fetchTodos() {
      try {
        this.todos = await getAllTodoRequest();
      } catch (error) {
        console.error(error);
      }
    },
    async addTodo() {
      if (this.newTodo.trim() === '') return;
      try {
        this.todos.push(await addTodoRequest(this.newTodo));
        this.newTodo = '';
      } catch (error) {
        console.error(error);
      }
    },
    async onDragEnd() {
      try {
        await reorderTodoRequest(this.todos)
      } catch (error) {
        console.error('Error updating order:', error);
      }
    },
    async updateTodo(id, completed) {
      try {
        await updateTodoRequest(id, completed)
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTodo(id) {
      try {
        await deleteTodoRequest(id)
        this.todos = this.todos.filter((todo) => todo._id !== id)
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.handle {
  display: flex;
  align-items: center;
}
</style>
