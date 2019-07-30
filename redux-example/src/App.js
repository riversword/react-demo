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
            // this.state.list.map((item, index) => {
            //   return (
            //     <ToDoItem 
            //       del={this.handleDelete}
            //       content={item} key={index}
            //       index={index}
            //     />
            //   );
            //   // return <li key={index} onClick={this.handleItem.bind(this, index)}>{item}</li>
            // })
          }
        </ul>
      </Fragment>
    );
  }
}

export default App;
