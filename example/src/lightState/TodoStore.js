import LightState from '../react-light-state'

const TodoStore = new LightState(
  {
    list1: ['My frist todo'],
    list2: [],
    loading: false
  },
  'todos'
)
export default TodoStore
