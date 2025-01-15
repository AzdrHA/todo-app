<template>
  <div class="flex items-center justify-center pt-10 lg:px-0 sm:px-6 px-4">
    <div class="w-full flex items-center justify-between border-t border-gray-200">
      <div
        :class="['flex items-center pt-3 text-gray-600 hover:text-indigo-700', {
        'opacity-15': !hasPrevious,
        'cursor-pointer': hasPrevious
      }]" @click="goToPage(currentPage - 1)">
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.1665 4H12.8332" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M1.1665 4L4.49984 7.33333" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M1.1665 4.00002L4.49984 0.666687" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        <p class="text-sm ml-3 font-medium leading-none">Previous</p>
      </div>
      <div class="sm:flex hidden">
        <p
          v-if="currentPage > 1"
          class="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2"
          @click="goToPage(currentPage - 1)">
          {{ currentPage - 1 }}
        </p>

        <p
          class="text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t border-indigo-400 pt-3 mr-4 px-2">
          {{ currentPage }}
        </p>

        <p
          v-if="currentPage < totalPages"
          class="text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2"
          @click="goToPage(currentPage + 1)">
          {{ currentPage + 1 }}
        </p>
      </div>
      <div
        :class="['flex items-center pt-3 text-gray-600 hover:text-indigo-700', {
        'opacity-15': !hasNext,
        'cursor-pointer': hasNext,
      }]" @click="goToPage(currentPage + 1)">
        <p class="text-sm font-medium leading-none mr-3">Next</p>
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.1665 4H12.8332" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M9.5 7.33333L12.8333 4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
          <path d="M9.5 0.666687L12.8333 4.00002" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TodoListPagination',
  computed: {
    ...mapState(['todo']),
    currentPage() {
      return this.todo.filter.page;
    },
    totalPages() {
      return this.todo.filter.totalPages;
    },
    hasPrevious() {
      return this.currentPage > 1;
    },
    hasNext() {
      return this.currentPage < this.totalPages;
    }
  },
  methods: {
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.todo.filter.page = page;
        this.$store.dispatch('fetchTodos', { ...this.todo.filter, page });
      }
    }
  }
};
</script>