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



`subscribe()` 返回一个函数用来注销监听器：

```js
// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() => console.log(store.getState()))

// 停止监听 state 更新
unsubscribe()
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





UI 组件负责展示，容器组件负责将 store 传递给 UI 组件。

上面的 `app.js` 可改为如下形式作为一个容器组件，它获取到 store 中的数据后，通过 props 传递给 UI 组件。

```jsx
// TodoListContainer.js 容器组件
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';
import store from './store';
import { change_input_value, add_todo_item, delete_todo_item} from './store/actionType';

import TodoListUI from './TodoListUI';

class TodoListContainer extends Component {
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
      type: add_todo_item // 告诉store需要如何处理
    };
    store.dispatch(action); // 将信息传递给store
  }

  // 输入框变化
  handleInputChange(e) {
    const action = {
      type: change_input_value,
      value: e.target.value // 输入框的内容
    };
    store.dispatch(action);
  }

  handleDelete(index) {
    console.log('delete-parent,index=', index);

    const action = {
      type: delete_todo_item,
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
      <TodoListUI
        inputValue={this.state.inputValue}
        handleInputChange={this.handleInputChange}
        handleBtnClick={this.handleBtnClick}
        list={this.state.list}
        handleDelete={this.handleDelete}
      />
    );
  }
}

export default TodoListContainer;
```





```jsx
// TodoListUI.js
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';

class TodoListUI extends Component {

  getTodoItems() {
    return (
      this.props.list.map((item, index) => {
        return (
          <ToDoItem 
            del={this.props.handleDelete(index)}
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
          <input className='red-border' value={this.props.inputValue} onChange={this.props.handleInputChange}/>
          <button style={{background: 'green'}} onClick={this.props.handleBtnClick}>add</button>
        </div>
        <ul>
          {
            // this.getTodoItems()
            this.props.list.map((item, index) => {
              return (
                <ToDoItem 
                  del={this.props.handleDelete}
                  content={item} key={index}
                  index={index}
                />
              );
              // return <li key={index} onClick={this.handleItem.bind(this, index)}>{item}</li>
            })
          }
        </ul>
      </Fragment>
    );
  }
}

export default TodoListUI;
```



无状态组件

上面的 UI 组件 TodoListUI.js ，没有用到 state 、生命钩子等，可以改写成无状态组件（无状态组件性能更高）：

```jsx
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';

const TodoListUI = (props)=> {
    // props即父组件传递过来的数据
    return (
        <Fragment>
          <div>
            <input className='red-border' value={props.inputValue} onChange={props.handleInputChange}/>
            <button style={{background: 'green'}} onClick={props.handleBtnClick}>add</button>
          </div>
          <ul>
            {
              props.list.map((item, index) => {
                return (
                  <ToDoItem 
                    del={props.handleDelete}
                    content={item} key={index}
                    index={index}
                  />
                );
              })
            }
          </ul>
        </Fragment>
    );
};

export default TodoListUI;

```

一个组件仅有 render 时，适合作为无状态组件。



React Redux - `connect()` 方法

上例中的 App.js ,  是通过手工实现的容器组件。技术上讲，容器组件就是使用 [`store.subscribe()`](https://cn.redux.js.org/docs/api/Store.html#subscribe) 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。

你可以手工来开发容器组件，但建议使用 React Redux 库的 [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。（这样你就不必为了性能而手动实现 [React 性能优化建议](https://doc.react-china.org/docs/optimizing-performance.html) 中的 `shouldComponentUpdate` 方法。）

使用 `connect()` 前，需要先定义 `mapStateToProps` 这个函数来指定如何把当前 Redux store state 映射到展示组件的 props 中。

