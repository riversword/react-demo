构建 react 项目

```bash
create-react-app redux-example
```



安装 redux

```bash
yarn add redux
```



### store

store 通过 redux 中的 createStore 方法创建，createStore 接受 reducer 作为参数。

```js
// store/index.js

import { createStore } from 'redux';
import reducer from './reducer';

// 通过createStore方法创建store，createStore接受reducer作为参数
const store = createStore(reducer);

export default store;
```



### reducer 

reducer 是一个函数，它接收旧的 state 和 action，返回新的 state。

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



### 在组件中与 store 进行通信。

`store.getState()` 可以获取到 store 中的 state，通过 `store.dispatch(action)` 可以对 store 中的数据进行修改（由 reducer 来做）， `store.subscribe(this.handleStoreChange)` 当 store 发生变化时就会执行 `this.handleStoreChange` 。

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



### UI 组件和容器组件

UI 组件负责展示，容器组件负责将 store 传递给 UI 组件。

上面的 `app.js` 可改为如下形式作为一个容器组件，它通过 `store.getState()` 获取到 store 中的数据，再通过 props 传递给 UI 组件。并且在初始化时订阅了一个方法， `store.subscribe(this.handleStoreChange)` ，每当 store 变化时，就会执行 `this.handleStoreChange`，获取到最新的 store.state 传递给 UI 组件。同时定义了一些封装好的 `dispatch` 方法，也通过 props 传递给 UI 组件，UI 组件就实现了获取 store 和 修改 store。

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



UI 组件 `TodoListUI.js`

```jsx
// TodoListUI.js
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';

class TodoListUI extends Component {

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
            this.props.list.map((item, index) => {
              return (
                <ToDoItem 
                  del={this.props.handleDelete}
                  content={item} key={index}
                  index={index}
                />
              );
            })
          }
        </ul>
      </Fragment>
    );
  }
}

export default TodoListUI;
```



### 无状态组件

上面的 UI 组件 `TodoListUI.js` ，没有用到 state 、生命钩子等，可以改写成无状态组件（无状态组件性能更高）：

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



redux-thunk



上面中使用的是 redux





## React Redux - `connect()` 方法

上例中的 App.js ,  是通过手工实现的容器组件。技术上讲，容器组件就是使用 [`store.subscribe()`](https://cn.redux.js.org/docs/api/Store.html#subscribe) 和 `store.getState()` 订阅读取 Redux state 树中的数据，并通过 props 来把这些数据提供给要渲染的组件。

上面的方式是通过手工来开发容器组件，但更推荐的方式是使用 React Redux 库的 [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。（这样你就不必为了性能而手动实现 [React 性能优化建议](https://doc.react-china.org/docs/optimizing-performance.html) 中的 `shouldComponentUpdate` 方法。）

使用 `connect()` 前，需要先定义 `mapStateToProps` 这个函数来指定如何把当前 Redux store state 映射到展示组件的 props 中。

安装 react-redux

```bash
yarn  react-redux
```



- 通过 `<Provider store={store}>` 来包裹组件

入口文件 `index.js`，`provider` 内的所有组件都可以访问到 store。

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoListContainer from './TodoListContainer';
import * as serviceWorker from './serviceWorker';

import store from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
    // Provider连接了store，Provider内的所有组件都可以获取到store中的内容
    <Provider store={store}>
        <TodoListContainer />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();

```



- 在容器组件中，通过 connect 连接容器组件与 store

connect 方法接收 3 个参数，函数 `mapStateToProps` 返回的是 store.state 中要传递给组件 props 的数据（对象格式），函数 `mapDispatchToProps` 返回的是能修改更新 store 数据的方法集合（对象格式），也是传递给组件的 props，`component` 是关联 store 的目标组件（容器组件）。

```js
connect(mapStateToProps, mapDispatchToProps)(component);
```



```jsx
// TodoListContainer容器组件
import React, { Component } from 'react';
import { change_input_value, add_todo_item, delete_todo_item, init_list_data} from './store/actionType';
import { getInputChangeAction, getAddTodoAction, getIDeleteTodoAction, initListData} from './store/actionCreator';
import TodoListUI from './TodoListUI';
import { connect } from 'react-redux';

class TodoListContainer extends Component {

  // 父组件通过属性向子组件传递参数，子组件通过props接收参数
  render() {
    return (
      <TodoListUI
        inputValue={this.props.inputValue}
        handleInputChange={this.props.handleInputChange}
        handleBtnClick={this.props.handleBtnClick}
        list={this.props.list}
        handleDelete={this.props.handleDelete}
      />
    );
  }
}

// export default TodoListContainer;

// 将store.state内的数据映射到组件的props
const mapStateToProps = (state) => {
  return state;
  // return {
  //   inputValue: state.inputValue,
  //   list: state.list
  // }
}

// 将store.dispatch方法传递给props
const mapDispatchToProps = (dispatch) => {
  return {
    // 输入框变化
    handleInputChange(e) {
      const value = e.target.value; // 输入框的内容
      dispatch(getInputChangeAction(value));
    },

    // 点击按钮
    handleBtnClick() {
      const action = {
        type: add_todo_item // 告诉store需要如何处理
      };
      dispatch(action); // 将信息传递给store

      // store.dispatch(getAddTodoAction) // 报错Error: Actions must be plain objects. Use custom middleware for async actions.
    },

    // 删除
    handleDelete(index) {
      console.log('delete-parent,index=', index);
      dispatch(getIDeleteTodoAction(index));
    }
  }
}

// 连接store和TodoListContainer组件
export default connect(mapStateToProps, mapDispatchToProps)(TodoListContainer);

```



优化，上面的 TodoListContainer 容器组件，并未定义逻辑处理的方法，它的数据和方法都是通过 props 来获取，故完全可以将 TodoListContainer 容器组件，定义为一个无状态的组件，如下

```jsx
// TodoListContainer容器组件
import React, { Component } from 'react';
import { change_input_value, add_todo_item, delete_todo_item, init_list_data} from './store/actionType';
import { getInputChangeAction, getAddTodoAction, getIDeleteTodoAction, initListData} from './store/actionCreator';
import TodoListUI from './TodoListUI';
import { connect } from 'react-redux';

const TodoListContainer = (props) => {

  // class组件通过render方法返回；function组件直接返回
  return (
    <TodoListUI
      inputValue={props.inputValue}
      handleInputChange={props.handleInputChange}
      handleBtnClick={props.handleBtnClick}
      list={props.list}
      handleDelete={props.handleDelete}
    />
  );
}

// export default TodoListContainer;

// 将store.state内的数据映射到组件的props
const mapStateToProps = (state) => {
  return state;
  // return {
  //   inputValue: state.inputValue,
  //   list: state.list
  // }
}

// 将store.dispatch方法传递给props
const mapDispatchToProps = (dispatch) => {
  return {
    // 输入框变化
    handleInputChange(e) {
      const value = e.target.value; // 输入框的内容
      dispatch(getInputChangeAction(value));
    },

    // 点击按钮
    handleBtnClick() {
      const action = {
        type: add_todo_item // 告诉store需要如何处理
      };
      dispatch(action); // 将信息传递给store

      // store.dispatch(getAddTodoAction) // 报错Error: Actions must be plain objects. Use custom middleware for async actions.
    },

    // 删除
    handleDelete(index) {
      console.log('delete-parent,index=', index);
      dispatch(getIDeleteTodoAction(index));
    }
  }
}

// 连接store和TodoListContainer组件
export default connect(mapStateToProps, mapDispatchToProps)(TodoListContainer);

```

connect 方法会把 store 和 UI 组件关联，并返回一个容器组件。

