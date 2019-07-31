import React, {Fragment} from 'react';
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
                // return <li key={index} onClick={this.handleItem.bind(this, index)}>{item}</li>
              })
            }
          </ul>
        </Fragment>
    );
};

export default TodoListUI;
