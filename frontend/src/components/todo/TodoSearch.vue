

<template>
  <div class="flex mb-4">
    <input
      v-model="todo.filter.title"
      type="text"
      placeholder="Rechercher par titre"
      class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <select
      v-model="todo.filter.completed"
      class="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    >
      <option value="all">Tous</option>
      <option value="true">Terminés</option>
      <option value="false">Non terminés</option>
    </select>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TodoSearch',
  data() {
    return {
      debounceTimeout: null
    };
  },
  computed: {
    ...mapState(['todo'])
  },
  watch: {
    'todo.filter': {
      handler() {
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
          this.$store.dispatch('fetchTodos', this.todo.filter);
        }, 500);
      },
      deep: true
    }
  }
}

</script>