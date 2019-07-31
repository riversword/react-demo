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
