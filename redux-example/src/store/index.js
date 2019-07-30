import { createStore } from 'redux';
import reducer from './reducer';

// 通过createStore方法创建store，createStore接受reducer作为参数
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // redux调试
);

export default store;