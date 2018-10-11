// @flow
import React, { Component } from 'react';
import { Yield } from 'react-adone';

import userBasket from '../baskets/user';

type User = { id: string, name: string };

type UserItemProps = {
  user: User,
  isSelected: boolean,
  onClick: () => any,
};

const UserItem = ({ user, isSelected, onClick }: UserItemProps) => (
  <li
    className={'UserItem ' + (isSelected ? 'isSelected' : '')}
    onClick={onClick}
  >
    {user.name}
  </li>
);

type UserListProps = {
  users: User[],
  loading: boolean,
  selected: string | null,
  onLoad: () => any,
  onSelect: (id: string) => any,
};

class UserList extends Component<UserListProps> {
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    const { users, selected, loading, onSelect } = this.props;
    if (loading) return <div className="UserList">Loading...</div>;
    return (
      <ul className="UserList">
        {users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            isSelected={user.id === selected}
            onClick={() => onSelect(user.id)}
          />
        ))}
      </ul>
    );
  }
}

const YieldedUserList = () => (
  <Yield from={userBasket}>
    {({ data, loading, selected, select, load }) => {
      return (
        <UserList
          users={data || []}
          loading={loading}
          selected={selected}
          onSelect={select}
          onLoad={load}
        />
      );
    }}
  </Yield>
);

export default YieldedUserList;
