import React from 'react';

class ToDoItem extends React.Component {
  // 子组件如果想和父组件通信，子组件要调用父组件传递过来的方法

  constructor (props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    console.log('this.props.index=', this.props.index);
    const { del, index } = this.props;
    del(index);
    // this.props.del(this.props.index); // 子组件调用父组件的handleDelete方法
  }

  render () {
    // 父组件通过属性向子组件传递参数，子组件通过props接收参数
    const { content } = this.props; // 等价于 content = this.props.content
    return (
      <div onClick={this.handleDelete}>{content}</div>
    )
  }
}

export default ToDoItem;