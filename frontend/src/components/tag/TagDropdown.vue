<template>
  <div class="relative">
    <button
      class="mt-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <tag-icon/>
    </button>
    <button v-if="isOpen" tabindex="-1" class="fixed inset-0 h-full w-full bg-transparent opacity-50 cursor-default" @click="isOpen = false"></button>
    <div v-if="isOpen" class="absolute right-0 mt-2 p-3 w-72 bg-white shadow-md rounded-lg z-10 border border-gray-200">
      <form class="flex items-center justify-between" @submit.prevent="submit">
        <input
          v-model="tag.title"
          type="text"
          name="title"
          placeholder="Nouveau tag"
          class="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          v-model="tag.color"
          type="color"
          class="mx-2 w-8 h-8 rounded cursor-pointer"
          required
        />

        <button
          class="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Ajouter le tag"
        >
          <add-icon/>
        </button>
      </form>

      <ul class="max-h-64 overflow-auto">
        <li v-for="tag in this.tag.tags" :key="tag._id" @click="actionTag(tag)">
          <a href="#" class="px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white flex">
            {{tag.title}}
            <check-icon v-if="isSelected(tag)"/>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { createTagRequest } from "../../api/tagRequest";
import { mapState } from "vuex";
import axios from "axios";
import TagIcon from '../../icon/tagIcon.vue';
import AddIcon from '../../icon/addIcon.vue';
import CheckIcon from '../../icon/checkIcon.vue';
import { addTagToTodo, removeTagFromTodo } from '../../api/totoRequest';

export default {
  name: "TagDropdown",
  components: { CheckIcon, AddIcon, TagIcon },
  props: {
    todoId: {
      type: String,
      required: true
    },
    todoTags: {
      type: Array,
      required: true
    }
  },
  emits: ['tagAdded', 'tagRemoved'],
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapState(['tag']),
  },
  created() {
    const handleEscape = (e) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.isOpen = false
      }
    }

    document.addEventListener('keydown', handleEscape)
  },
  methods: {
    submit() {
      this.isOpen = false

      createTagRequest(this.tag.title, this.tag.color, this.todoId).then((tag) => {
        this.$emit('tagAdded', tag)
        this.$store.commit('addTag', tag)
      })
    },
    async actionTag(tag) {
      if (this.isSelected(tag)) {
        this.$emit('tagRemoved', tag)
        await removeTagFromTodo(this.todoId, tag._id)
      } else {
        this.$emit('tagAdded', tag)
        await addTagToTodo(this.todoId, tag._id)
      }
    },
    isSelected(tag) {
      return this.todoTags.some(t => t._id === tag._id);
    }
  }
}
</script>