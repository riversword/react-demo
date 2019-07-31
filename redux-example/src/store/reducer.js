// reducer接收 旧的state和action，返回新的state

import { change_input_value, add_todo_item, delete_todo_item} from './actionType'

// 默认的state
const defaultState = {
    list: [
        'learn React',
        'learn English'
    ],
    inputValue: ''
};

export default (state = defaultState, action) => {
    console.log('action=', action);
    if (action.type === change_input_value) {
        const newState = JSON.parse(JSON.stringify(state)); // 注意不能直接修改state，要拷贝一份
        newState.inputValue = action.value;
        return newState;
    }

    if (action.type === add_todo_item && state.inputValue.trim()) { // 输入框为空时不添加
        const newState = JSON.parse(JSON.stringify(state));
        newState.list.push(newState.inputValue); // change_input_value时，state的inputValue已经更新
        newState.inputValue = ''; // 清空输入框
        return newState;
    }

    if (action.type === delete_todo_item) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.list.splice(action.index, 1);
        return newState;
    }
    
    return state;
}