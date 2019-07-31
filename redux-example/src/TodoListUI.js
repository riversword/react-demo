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
