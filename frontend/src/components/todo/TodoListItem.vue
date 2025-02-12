<template>
  <li
    class="flex items-center justify-between p-2 bg-gray-50 rounded-md shadow-sm"
    :class="{
    'border-l-4 border-red-500': priority === 'high',
    'border-l-4 border-yellow-500': priority === 'medium',
    'border-l-4 border-green-500': priority === 'low'
  }"
  >
    <div class="flex items-center">
      <span class="handle cursor-move mr-2">
        <handle-icon/>
      </span>
      <input
        v-model="completed"
        type="checkbox"
        class="form-checkbox min-w-4 min-h-4 text-blue-600"
        width="20"
        height="20"
        @change="updateTodo"
      />

      <div class="flex flex-col">
        <span
          :class="{
            'line-through text-gray-500': completed,
            'text-gray-900': !completed
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
    <div class="flex items-center flex-col">
      <div class="mt-2 relative flex flex-col ml-auto">
        <span
          class="text-xs font-semibold px-2 py-1 rounded-md self-start cursor-pointer"
          :class="{
            'bg-red-100 text-red-600': priority === 'high',
            'bg-yellow-100 text-yellow-600': priority === 'medium',
            'bg-green-100 text-green-600': priority === 'low'
          }"
          @click="openPrioritySelect"
        >
          {{ transformPriority }}
        </span>

        <select
          v-if="showPrioritySelect"
          ref="prioritySelect"
          v-model="priority"
          class="absolute top-0 left-0 mt-7 h-12 w-36 text-sm border rounded px-2 py-1 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
          @change="updateTodo"
          @blur="closePrioritySelect"
        >
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
      </div>

      <div class="flex items-center">
        <tag-dropdown :todo-id="todo._id" :todo-tags="todo.tags" @tag-added="tagAdded" @tag-removed="removeTag" />
        <button
          class="text-red-500 hover:text-red-700 focus:outline-none"
          @click="deleteTodo(todo._id)"
        >
          <cross-icon/>
        </button>
      </div>
    </div>
  </li>
</template>

<script>

import TagDropdown from '../tag/TagDropdown.vue';
import { hexToRgba } from '../../utils/ColorUtil';
import { updateTodoRequest } from '../../api/totoRequest';
import HandleIcon from '../../icon/handleIcon.vue';
import CrossIcon from '../../icon/crossIcon.vue';
import { translatePriority } from '../../utils/StrUtil';

export default {
  name: 'TodoListItem',
  components: { CrossIcon, HandleIcon, TagDropdown },
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      todoData: {},
      completed: this.todo.completed,
      priority: this.todo.priority,
      showPrioritySelect: false
    };
  },
  computed: {
    transformPriority () {
      const translate = translatePriority(this.priority)
      return translate.charAt(0).toUpperCase() + translate.slice(1)
    }
  },
  mounted() {
    this.todoData = this.todo;
  },
  methods: {
    translatePriority,
    async updateTodo() {
      await updateTodoRequest(this.todo._id, this.todo.title, this.completed, this.priority);
    },
    async deleteTodo() {
      this.$store.dispatch('removeTodoById', this.todo._id);
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
    },
    openPrioritySelect() {
      this.showPrioritySelect = true;
      this.$nextTick(() => {
        this.$refs.prioritySelect?.focus();
      });
    },
    closePrioritySelect() {
      this.showPrioritySelect = false;
    }
  }
};
</script>