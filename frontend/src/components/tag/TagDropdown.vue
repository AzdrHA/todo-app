<template>
  <div class="relative">
    <button
      class="mt-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          d="M7.0498 7.0498H7.0598M10.5118 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10.5118C3 11.2455 3 11.6124 3.08289 11.9577C3.15638 12.2638 3.27759 12.5564 3.44208 12.8249C3.6276 13.1276 3.88703 13.387 4.40589 13.9059L9.10589 18.6059C10.2939 19.7939 10.888 20.388 11.5729 20.6105C12.1755 20.8063 12.8245 20.8063 13.4271 20.6105C14.112 20.388 14.7061 19.7939 15.8941 18.6059L18.6059 15.8941C19.7939 14.7061 20.388 14.112 20.6105 13.4271C20.8063 12.8245 20.8063 12.1755 20.6105 11.5729C20.388 10.888 19.7939 10.2939 18.6059 9.10589L13.9059 4.40589C13.387 3.88703 13.1276 3.6276 12.8249 3.44208C12.5564 3.27759 12.2638 3.15638 11.9577 3.08289C11.6124 3 11.2455 3 10.5118 3ZM7.5498 7.0498C7.5498 7.32595 7.32595 7.5498 7.0498 7.5498C6.77366 7.5498 6.5498 7.32595 6.5498 7.0498C6.5498 6.77366 6.77366 6.5498 7.0498 6.5498C7.32595 6.5498 7.5498 6.77366 7.5498 7.0498Z"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button v-if="isOpen" tabindex="-1" class="fixed inset-0 h-full w-full bg-transparent opacity-50 cursor-default" @click="isOpen = false"></button>
    <div v-if="isOpen" class="absolute right-0 mt-2 p-3 w-72 bg-white shadow-md rounded-lg z-10 border border-gray-200">
      <form class="flex items-center justify-between mb-3" @submit.prevent="submit">
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </form>

      <ul>
        <li v-for="tag in this.tag.tags" :key="tag._id" @click="actionTag(tag)">
          <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white flex">
            {{tag.title}}

            <svg v-if="isSelected(tag)" class="h-5 w-5 ml-2" viewBox="0 0 132.29 105.83" xmlns="http://www.w3.org/2000/svg">
              <path d="m112.84 12.49a8.6128 8.6128 0 0 0-6.0898 2.5215l-53.971 53.971-27.23-27.23a8.6128 8.6128 0 0 0-12.18 0 8.6128 8.6128 0 0 0 0 12.182l39.41 39.41 66.15-66.15a8.6128 8.6128 0 0 0 0-12.182 8.6128 8.6128 0 0 0-6.0898-2.5215z" color="#000000" fill="#0068ac" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            </svg>

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

export default {
  name: "TagDropdown",
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
    actionTag(tag) {
      if (this.isSelected(tag)) {
        this.$emit('tagRemoved', tag)
        axios.delete(`api/todos/${this.todoId}/${tag._id}`)
      } else {
        this.$emit('tagAdded', tag)
        axios.post(`api/todos/${this.todoId}/${tag._id}`)
      }
    },
    isSelected(tag) {
      return this.todoTags.some(t => t._id === tag._id);

    }
  }
}
</script>