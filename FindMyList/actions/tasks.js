import * as types from '../constants/actionTypes'

export const addTask = (todo) => {
  return {
    type: types.ADD_TASK,
    payload: todo
  }
}

export const removeTask = (id) => {
  return {
    type: types.REMOVE_TASK,
    payload: { id }
  }
}

export const completeTask = (id) => {
  return {
    type: types.COMPLETE_TASK,
    payload: { id }
  }
}