<template>
  <div class="flex flex-col">
    <div class="flex mb-4">
      <input
        v-model="todo.filter.title"
        type="text"
        placeholder="Rechercher par titre"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="updateFilter"

      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="showFilter = !showFilter"
      >
        Filtre
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="showFilter" class="filter flex flex-col gap-2 mb-5">
        <div class="w-full px-3 mb-6 md:mb-0 w-100">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Status
          </label>
          <Multiselect
            v-model="todo.filter.completed"
            :options="completedOptions"
            :can-clear="false"
            label="label"            @change="updateFilter"

          />
        </div>

        <div class="w-full px-3 mb-6 md:mb-0 w-100 mt-2">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Priorité
          </label>
          <Multiselect
            v-model="todo.filter.priority"
            :options="priorityOptions"
            :can-clear="false"
            label="label"
            @change="updateFilter"

          />
        </div>

        <div class="w-full px-3 mb-6 md:mb-0 w-100 mt-2">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
            Tags
          </label>
          <Multiselect
            v-model="todo.filter.tags"
            mode="multiple"
            :options="tagsFormated"
            label="label"
            @change="updateFilter"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from '@vueform/multiselect'

export default {
  name: 'TodoSearch',
  components: {
    Multiselect,
  },
  data() {
    return {
      debounceTimeout: null,
      showFilter: false,
      value: null,
      priorityOptions: [{
        value: 'all',
        label: 'Toutes les priorités'
      },{
        value: 'high',
        label: 'Haute'
      },{
        value: 'medium',
        label: 'Moyenne'
      },{
        value: 'low',
        label: 'Basse'
      }],
      completedOptions: [{
        value: 'all',
        label: 'Tous les status',
      },{
        value: 'true',
        label: 'Terminés',
      },{
        value: 'false',
        label: 'Non terminés',
      }]
    };
  },
  computed: {
    ...mapState(['todo', 'tag']),
    tagsFormated() {
      return this.tag.tags.map(tag => {
        return {
          value: tag._id,
          label: tag.title
        }
      });
    }
  },
  methods: {
    updateFilter() {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(() => {
        this.$store.dispatch('fetchTodos', this.todo.filter);
      }, 200);
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}
</style>