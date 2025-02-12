<template>
    <div class="todo-list">
      <h1>每日行程規劃</h1>
      
      <div class="input-container">
        <input 
          v-model="newTodo" 
          placeholder="待辦事項..."
          type="text"
        >
        <input 
          v-model="startTime" 
          type="time"
          class="time-input"
        >
        <span>到</span>
        <input 
          v-model="endTime" 
          type="time"
          class="time-input"
        >
        <button @click="handleAddTodo">新增</button>
      </div>
  
      <div class="schedule">
        <div class="time-slots">
          <div v-for="hour in 24" :key="hour" class="time-slot">
            {{ (hour - 1).toString().padStart(2, '0') }}:00
          </div>
        </div>
        
        <div class="tasks">
          <div 
            v-for="todo in sortedTodos" 
            :key="todo.id" 
            :class="{ 
              'task-item': true, 
              'completed': todo.completed 
            }"
            :style="getTaskStyle(todo)"
          >
            <div class="task-content">
              <input 
                type="checkbox" 
                :checked="todo.completed"
                @change="handleToggleTodo(todo.id)"
              >
              <span>{{ todo.text }}</span>
              <span class="task-time">
                {{ todo.startTime }} - {{ todo.endTime }}
              </span>
              <button @click="handleDeleteTodo(todo.id)">刪除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { useStore } from '../store'
  import type { Todo } from '../types/todo'
  
  export default defineComponent({
    name: 'TodoList',
    setup() {
      const store = useStore()
      const newTodo = ref('')
      const startTime = ref('09:00')
      const endTime = ref('10:00')
  
      const todos = computed((): Todo[] => store.getters.allTodos)
      
      const sortedTodos = computed(() => {
        return [...todos.value].sort((a, b) => {
          return a.startTime.localeCompare(b.startTime)
        })
      })
  
      const getTaskStyle = (todo: Todo) => {
        const startHour = parseInt(todo.startTime.split(':')[0])
        const endHour = parseInt(todo.endTime.split(':')[0])
        const startMinute = parseInt(todo.startTime.split(':')[1])
        const endMinute = parseInt(todo.endTime.split(':')[1])
        
        const top = (startHour + startMinute / 60) * 60
        const height = ((endHour - startHour) + (endMinute - startMinute) / 60) * 60
  
        return {
          top: `${top}px`,
          height: `${height}px`
        }
      }
  
      const handleAddTodo = () => {
        if (newTodo.value.trim() && startTime.value && endTime.value) {
          store.dispatch('addTodo', {
            text: newTodo.value,
            startTime: startTime.value,
            endTime: endTime.value
          })
          newTodo.value = ''
        }
      }
  
      const handleToggleTodo = (id: number) => {
        store.dispatch('toggleTodo', id)
      }
  
      const handleDeleteTodo = (id: number) => {
        store.dispatch('deleteTodo', id)
      }
  
      return {
        newTodo,
        startTime,
        endTime,
        sortedTodos,
        getTaskStyle,
        handleAddTodo,
        handleToggleTodo,
        handleDeleteTodo
      }
    }
  })
  </script>
  
  <style scoped>
  .todo-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  input[type="text"] {
    flex: 1;
    padding: 8px;
  }
  
  .time-input {
    width: 100px;
    padding: 8px;
  }
  
  .schedule {
    display: flex;
    border: 1px solid #ddd;
    height: 1440px; /* 24小時 * 60px */
    position: relative;
  }
  
  .time-slots {
    width: 60px;
    border-right: 1px solid #ddd;
  }
  
  .time-slot {
    height: 60px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
  }
  
  .tasks {
    flex: 1;
    position: relative;
  }
  
  .task-item {
    position: absolute;
    left: 0;
    right: 0;
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 8px;
    margin: 0 4px;
    border-radius: 4px;
  }
  
  .task-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .task-time {
    font-size: 12px;
    color: #666;
  }
  
  .completed {
    background-color: #e8f5e9;
    border-left-color: #4caf50;
  }
  
  .completed span {
    text-decoration: line-through;
    color: #888;
  }
  
  button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .task-item button {
    margin-left: auto;
    padding: 4px 8px;
    font-size: 12px;
    background-color: #f44336;
  }
  </style>