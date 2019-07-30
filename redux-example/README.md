构建 react 项目

```bash
create-react-app redux-example
```



安装 redux

```bash
yarn add redux
```



创建 store：

store 通过 redux 中的 createStore 方法创建，createStore 接受reducer 作为参数。

```js
// store/index.js

import { createStore } from 'redux';
import reducer from './reducer';

// 通过createStore方法创建store，createStore接受reducer作为参数
const store = createStore(reducer);

export default store;
```



reducer 是一个函数，它接收旧的state和action，返回新的state。

```js
// store/reducer.js

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
    if (action.type === 'change_input_value') {
        const newState = JSON.parse(JSON.stringify(state)); // 注意不能直接修改state，要拷贝一份
        newState.inputValue = action.value;
        return newState;
    }

    if (action.type === 'add_todo_item' && state.inputValue.trim()) { // 输入框为空时不添加
        const newState = JSON.parse(JSON.stringify(state));
        newState.list.push(newState.inputValue); // change_input_value时，state的inputValue已经更新
        newState.inputValue = ''; // 清空输入框
        return newState;
    }

    if (action.type === 'delete_todo_item') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.list.splice(action.index, 1);
        return newState;
    }
    
    return state;
}
```



在组件中与 store 进行通信。`store.getState()` 可以获取到 store 中的 state，通过 `store.dispatch(action)` 可以对 store 中的数据进行修改（由 reducer 来做）， `store.subscribe(this.handleStoreChange)` 当 store 发生变化时就会执行 `this.handleStoreChange` 。

```jsx
// app.js
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';
import store from './store';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('store.getState()=', store.getState());
    this.state = store.getState();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);

    store.subscribe(this.handleStoreChange); // 当store发生变化时
  }

  // store发生变化
  handleStoreChange() {
    this.setState(store.getState()); // 把store中的state，赋值给组件的state
  }

  // 点击按钮
  handleBtnClick() {
    const action = {
      type: 'add_todo_item' // 告诉store需要如何处理
    };
    store.dispatch(action); // 将信息传递给store
  }

  // 输入框变化
  handleInputChange(e) {
    const action = {
      type: 'change_input_value',
      value: e.target.value // 输入框的内容
    };
    store.dispatch(action);
  }

  handleDelete(index) {
    console.log('delete-parent,index=', index);

    const action = {
      type: 'delete_todo_item',
      index
    };
    store.dispatch(action);
  }

  getTodoItems() {
    return (
      this.state.list.map((item, index) => {
        return (
          <ToDoItem 
            del={this.handleDelete}
            content={item} key={index}
            index={index}
          />
        );
      })
    )
  }

  // 父组件通过属性向子组件传递参数，子组件通过props接收参数
  render() {
    return (
      <Fragment>
        <div>
          <input className='red-border' value={this.state.inputValue} onChange={this.handleInputChange}/>
          <button style={{background: 'green'}} onClick={this.handleBtnClick}>add</button>
        </div>
        <ul>
          {
            this.getTodoItems()
          }
        </ul>
      </Fragment>
    );
  }
}

export default App;

```



安装 redux 调试工具

<https://github.com/zalmoxisus/redux-devtools-extension>

```js
// store/index.js

import { createStore } from 'redux';
import reducer from './reducer';

// 通过createStore方法创建store，createStore接受reducer作为参数
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // redux调试
);

export default store;
```



