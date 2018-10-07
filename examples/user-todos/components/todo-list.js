// @flow
import React, { Component } from 'react';

import { Yield } from '../../../src';

import * as usersBasket from '../baskets/users';
import * as todosBasket from '../baskets/todos';

type Todo = { title: string };

type TodoItemProps = {
  todo: Todo,
};

const TodoItem = ({ todo }: TodoItemProps) => (
  <li className="TodoItem">{todo.title}</li>
);

type TodoListProps = {
  selectedUser: number,
  todos: Todo[],
  loading: boolean,
  onLoad: (uid: number) => void,
};

class TodoList extends Component<TodoListProps> {
  componentDidUpdate(prevProps) {
    const { selectedUser, onLoad } = this.props;
    if (selectedUser !== prevProps.selectedUser) {
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
  <Yield from={usersBasket} pick={usersBasket.selectors.selected}>
    {({ selected }) => (
      <Yield from={todosBasket}>
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
