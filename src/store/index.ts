import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import type { Todo } from '../types/todo'

export interface State {
  todos: Todo[]
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    todos: []
  },
  mutations: {
    ADD_TODO(state: State, payload: { text: string; startTime: string; endTime: string }) {
      state.todos.push({
        id: Date.now(),
        text: payload.text,
        startTime: payload.startTime,
        endTime: payload.endTime,
        completed: false
      })
    },
    TOGGLE_TODO(state: State, id: number) {
      const todo = state.todos.find((todo: Todo) => todo.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    DELETE_TODO(state: State, id: number) {
      state.todos = state.todos.filter((todo: Todo) => todo.id !== id)
    }
  },
  actions: {
    addTodo({ commit }, payload: { text: string; startTime: string; endTime: string }) {
      commit('ADD_TODO', payload)
    },
    toggleTodo({ commit }, id: number) {
      commit('TOGGLE_TODO', id)
    },
    deleteTodo({ commit }, id: number) {
      commit('DELETE_TODO', id)
    }
  },
  getters: {
    allTodos: (state: State): Todo[] => state.todos
  }
})

export function useStore(): Store<State> {
  return store
}