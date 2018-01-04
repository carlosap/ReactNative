import * as types from '../constants/actionTypes'

const generateId = () =>  Math.random().toString(36).substr(2, 5)

const initialState = [
  // {
  //   id: 1,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Morning yoha'
  // },
  // {
  //   id: 2,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Meeting with client'
  // },
  // {
  //   id: 3,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Duolingo daily goal'
  // },
  // {
  //   id: 4,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Email to client'
  // },
  // {
  //   id: 5,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Evening run'
  // },
  // {
  //   id: 6,
  //   createdAt: new Date(),
  //   completedAt: null,
  //   completed: false,
  //   text: 'Burger festival'
  // }
]

const reducer = (state = initialState, action) => {
  const { type, payload } = action

  switch(type) {
    case types.ADD_TASK: {
      return [
        ...state,
        {
          id: generateId(),
          createdAt: new Date(),
          completedAt: null,
          completed: false,
          text: payload.trim()
        }
      ]
    }

    case types.REMOVE_TASK: {
      return state.filter(task => task.id !== payload.id)
    }

    case types.COMPLETE_TASK: {
      return state.map(task => {
        const isCompleted = !task.complete

        return (task.id === payload.id)
          ? {
              ...task,
              completed: isCompleted,
              completedAt: isCompleted ? new Date() : null
            }
          : task
      })
    }

    default: {
      return state
    }
  }
}

export default reducer