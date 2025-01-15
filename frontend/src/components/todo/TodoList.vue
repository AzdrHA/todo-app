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

    <div v-if="todo.todos.length === 0" class="text-center text-gray-500">Aucune tâche à afficher</div>
    <div ref="sortableList" class="space-y-2">
      <transition-group>
        <todo-list-item v-for="todo in todo.todos" :key="todo._id" :todo="todo"/>
      </transition-group>
    </div>

    <todo-list-pagination/>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import TodoListItem from "./TodoListItem.vue";
import {
  addTodoRequest, reorderTodoRequest,
} from '../../api/totoRequest';
import { mapState } from 'vuex';
import TodoListPagination from './TodoListPagination.vue';

export default {
  name: 'TodoList',
  components: { TodoListPagination, TodoListItem },
  data() {
    return {
      newTodo: '',
    };
  },
  computed: {
    ...mapState(['todo'])
  },
  mounted() {
    this.$store.dispatch('fetchTodos', this.todo.filter);
    Sortable.create(this.$refs.sortableList, {
      handle: '.handle',
      animation: 150,
      onEnd: this.onDragEnd,
    });
  },
  methods: {
    async addTodo() {
      if (this.newTodo.trim() === '') return;
      try {
        const todos = await addTodoRequest(this.newTodo);
        this.$store.commit('setTodos', todos);
        this.todo.filter.page = 1;
        this.newTodo = '';
      } catch (error) {
        console.error(error);
      }
    },
    async onDragEnd(event) {
      try {
        const movedItem = this.todo.todos[event.oldIndex];
        this.todo.todos.splice(event.oldIndex, 1);
        this.todo.todos.splice(event.newIndex, 0, movedItem);
        await reorderTodoRequest(this.todo.todos)
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }
};
</script>
