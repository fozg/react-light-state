import LightState from '../react-light-state'

const TodoStore = new LightState(
  {
    list1: ['My frist todo'],
    list2: []
  },
  'todos'
)
export default TodoStore
