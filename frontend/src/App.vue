<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-blue-600">Todo App</h1>

      <todo-search />
      <todo-list />
    </div>
  </div>
</template>

<script>
import TodoList from './components/todo/TodoList.vue';
import axios from "axios";
import TodoSearch from './components/todo/TodoSearch.vue';

export default {
  name: 'App',
  components: {
    TodoSearch,
    TodoList
  },
  data() {
    return {
      test: false
    };
  },
  mounted() {
    axios.get('api/tags').then(res => {
      this.$store.commit('setTags', res.data)
      this.test = true
    });
  }
};
</script>
