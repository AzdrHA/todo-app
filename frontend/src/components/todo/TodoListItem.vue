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

      <div class="flex flex-col">
        <span
          :class="{
            'line-through text-gray-500': todoData.completed,
            'text-gray-900': !todoData.completed
          }"
          class="mx-2"
        > {{ todoData.title }} </span>

        <ul class="mx-2 mt-1 *:rounded-full *:px-2 *:py-0.5 flex flex-wrap text-sm gap-y-1 gap-x-1">
          <li v-for="tag in todoData.tags" :key="tag._id" :style="liStyle(tag.color)" class="border">
            {{ tag.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex items-center">
      <tag-dropdown :todo-id="todo._id" :todo-tags="todo.tags" @tag-added="tagAdded" @tag-removed="removeTag" />
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
    </div>
  </li>
</template>

<script>

import TagDropdown from "../tag/TagDropdown.vue";
import { hexToRgba } from "../../utils/ColorUtil";

export default {
  name: "TodoListItem",
  components: { TagDropdown },
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  emits: ["updateTodo", "deleteTodo"],
  data() {
    return {
      todoData: {}
    };
  },
  mounted() {
    this.todoData = this.todo;
  },
  methods: {
    async updateTodo(todo) {
      this.$emit("updateTodo", todo._id, this.todoData.completed);
    },
    async deleteTodo(id) {
      this.$emit("deleteTodo", id);
    },
    liStyle(color) {
      return {
        backgroundColor: hexToRgba(color, .2),
        borderColor: hexToRgba(color, .1),
        color
      };
    },
    tagAdded(tag) {
      this.todoData.tags.push(tag);
    },
    removeTag(tagE) {
      this.todoData.tags = this.todoData.tags.filter((tag) => tag._id !== tagE._id);
    }
  }
};
</script>