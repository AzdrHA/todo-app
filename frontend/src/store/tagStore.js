const tagStore = {
  state: {
    tags: [],
    title: '',
    color: '#000000',
  },
  mutations: {
    setTags(state, tags) {
      state.tags = tags
    },
    addTag(state, tag) {
      state.tags.push(tag)
      state.title = ''
      state.color = '#000000'
    }
  }
}

module.exports = tagStore