import { makeRequest } from "./request";

export const createTagRequest = async (title, color, todoId) => {
  return makeRequest({url: '/api/tags', method: 'POST', data: { title, color, todoId }})
}

// export const addTagToTodoRequest = async () => {
//
// }