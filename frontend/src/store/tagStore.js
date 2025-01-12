const tagStore = {
  state: {
    tags: [
      {
        "_id": "6783aa941b1a5613d7eb143a",
        "title": "aaaaaaa",
        "color": "#ff0000",
        "__v": 0
      },
      {
        "_id": "6783acec1694cf041ecac5a6",
        "title": "Toxic",
        "color": "#54cd13",
        "__v": 0
      },
      {
        "_id": "6783adfa1694cf041ecac5ae",
        "title": "bcxbcxbxc",
        "color": "#f03d3d",
        "__v": 0
      },
      {
        "_id": "6783aef01694cf041ecac5b4",
        "title": "aaa",
        "color": "#14522a",
        "__v": 0
      },
      {
        "_id": "6783c0501694cf041ecac5ba",
        "title": "test",
        "color": "#219764",
        "__v": 0
      }
    ]
  },
  mutations: {
    setTags(state, tags) {
      state.tags = tags
    }
  }
}

module.exports = tagStore