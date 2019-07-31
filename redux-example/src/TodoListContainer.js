// TodoListContainer容器组件
import React, { Component, Fragment} from 'react';
import ToDoItem from './ToDoItem';
import store from './store';
import { change_input_value, add_todo_item, delete_todo_item, init_list_data} from './store/actionType';
import TodoListUI from './TodoListUI';
// import axios from 'axios';

// function axios() {
//   setTimeout(function() {

//   }, 2000);
// }

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

  componentDidMount() {
    setTimeout(function() {
      let data = [1, 2, 3];
      const action = {
        type: init_list_data,
        data
      };
      store.dispatch(action);
    }, 2000);
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
