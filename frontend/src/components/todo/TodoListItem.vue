<template>
  <li class="flex items-center justify-between p-2 bg-gray-50 rounded-md shadow-sm">
    <div class="flex items-center">
            <span class="handle cursor-move mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 8h16M4 16h16" />
              </svg>
            </span>
      <input
        v-model="todoData.completed"
        type="checkbox"
        class="form-checkbox min-w-4 min-h-4 text-blue-600"
        width="20"
        height="20"
        @change="updateTodo(todo)"
      />
      <span
        :class="{
            'line-through text-gray-500': todoData.completed,
            'text-gray-900': !todoData.completed
          }"
        class="ml-2"
      > {{ todoData.title }} </span>
    </div>
    <button
      class="text-red-500 hover:text-red-700 focus:outline-none"
      @click="deleteTodo(todo._id)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </li>
</template>

<script>
export default {
  name: "TodoListItem",
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      todoData: {
        title: "test",
        completed: false
      }
    };
  },
  mounted() {
    this.todoData = this.todo;
  },
  methods: {
    async updateTodo(todo) {
      this.$emit("updateTodo", todo._id, todo.completed);
    },
    async deleteTodo(id) {
      this.$emit("deleteTodo", id);
    }
  }
};
</script>