import React, {Component} from 'react';
import Icon from './lock.svg';
import styled from 'styled-components';

export default class Index extends Component {
  render() {
    return (
      <LockIcon />
    );
  }
}
const LockIcon = styled(Icon)`
  fill: #808080;
  width: 13px;
  height: 13px;
`;
/*
@作者：姜中希
@日期：2018-07-31
@描述：密码图标
*/
