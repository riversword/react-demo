import { change_input_value, add_todo_item, delete_todo_item, init_list_data} from './actionType'

export const getInputChangeAction = (value) => ({
    type: change_input_value,
    value
})

export const getAddTodoAction = () => ({
    type: add_todo_item
})

export const getIDeleteTodoAction = (index) => ({
    type: delete_todo_item,
    index
})

export const initListData = (data)=> ({
    type: init_list_data,
    data
})