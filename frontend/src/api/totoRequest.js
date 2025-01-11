import { makeRequest } from "./request";

export const updateTodoRequest = async (id, completed) => {
  return makeRequest({url: `/api/todos/${id}`, data: {completed}, method: "PATCH"})
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

export const getAllTodoRequest = async () => {
  return makeRequest({url: '/api/todos', method: 'GET'})
}