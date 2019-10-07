import LightState from '../../src'

const TodoStore = new LightState(
  {
    list1: ['My frist todo'],
    list2: [],
    loading: false
  },
  'todos',
  { storageName: 'TodoStorage' }
)
export default TodoStore
