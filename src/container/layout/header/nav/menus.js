import React, {Component} from 'react';
import styled from 'styled-components';
import NavItems from 'components/navItems';

export default class Menus extends Component {
  render() {
    return (
      <Container>
        <NavItems
          to={`${this.props.match.path}/treatManage`}>
          诊疗管理
        </NavItems>
        <NavItems
          to={`${this.props.match.path}/myTreat`}>
          我的诊疗
        </NavItems>
      </Container>
    );
  }
}
const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

/*
@作者：姜中希
@日期：2018-07-05
@描述：头部导航
*/
