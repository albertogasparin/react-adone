// @flow
import React, { Component } from 'react';
import { Yield } from 'react-adone';

import userBasket from '../baskets/user';
import todoBasket from '../baskets/todo';

type Todo = { title: string };

type TodoItemProps = {
  todo: Todo,
};

const TodoItem = ({ todo }: TodoItemProps) => (
  <li className="TodoItem">{todo.title}</li>
);

type TodoListProps = {
  selectedUser: ?string,
  todos: Todo[],
  loading: boolean,
  onLoad: (uid: string) => any,
};

class TodoList extends Component<TodoListProps> {
  componentDidUpdate(prevProps) {
    const { selectedUser, onLoad } = this.props;
    if (selectedUser && selectedUser !== prevProps.selectedUser) {
      onLoad(selectedUser);
    }
  }
  render() {
    const { todos, loading, selectedUser } = this.props;

    if (!selectedUser || loading) {
      return (
        <div className="TodoList">
          {loading ? 'Loading...' : 'Select a user first'}
        </div>
      );
    }

    return (
      <ul className="TodoList">
        {todos.map(todo => (
          <TodoItem key={todo.title} todo={todo} />
        ))}
      </ul>
    );
  }
}

const YieldedTodoList = () => (
  <Yield from={userBasket} pick={userBasket.selectors.getSelected}>
    {({ selected }) => (
      <Yield from={todoBasket}>
        {({ data, loading, load }) => (
          <TodoList
            todos={data || []}
            loading={loading}
            onLoad={load}
            selectedUser={selected}
          />
        )}
      </Yield>
    )}
  </Yield>
);

export default YieldedTodoList;
