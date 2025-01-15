import { makeRequest } from "./request";

export const updateTodoRequest = async (id, completed, priority) => {
  return makeRequest({url: `/api/todos/${id}`, data: {completed, priority}, method: "PATCH"})
}

export const deleteTodoRequest = async (id) => {
  return makeRequest({url: `/api/todos/${id}`, method: 'DELETE'})
}

export const reorderTodoRequest = async (todos) => {
  return makeRequest({url: '/api/todos/reorder', method: 'PUT', data: todos})
}

export const addTodoRequest = async (title) => {
  return makeRequest({url: '/api/todos', method: 'POST', data: {title}})
}

export const searchTodo = async (filter) => {
  return makeRequest({url: `/api/todos/search?title=${filter.title}&completed=${filter.completed}&priority=${filter.priority}&tags=${filter.tags}&page=${filter.page}`, method: 'GET'})
}