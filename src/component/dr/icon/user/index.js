import React, {Component} from 'react';
import Icon from './user.svg';
import styled from 'styled-components';

export default class Index extends Component {
  render() {
    return (
      <UserIcon />
    );
  }
}
const UserIcon = styled(Icon)`
  fill: #808080;
  width: 13px;
  height: 13px;
`;
/*
@作者：姜中希
@日期：2018-07-31
@描述：用户名称图标
*/
