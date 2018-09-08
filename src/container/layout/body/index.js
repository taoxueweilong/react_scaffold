import React, {Component} from 'react';
import styled from 'styled-components';
import Center from './center';
import LeftBar from './leftBar';
import RightBar from './rightBar';

export default class Body extends Component {
  constructor(props){
    super(props);
    this.state = {
      leftBarToggle: null, // 左侧栏是否显示内容
    };
  };
  render() {
    let { leftBar , leftBarToggle } = this.state;
    let pathname = this.props.location.pathname; // 只有我的诊疗界面展示左侧浮框
    return (
      <Container>
        {
          (pathname == '/layout/treatManage') ?
          <LeftBar wrappedComponentRef={(ref)=>{ !this.state.leftBarToggle && this.setState({leftBarToggle: ref})}}/>
          : null
        }
        <Center {...this.props} toggle={this.state.leftBarToggle}/>
        <RightBar />
      </Container>
    );
  }
}
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: rgba(228, 228, 228, 1);
  position: absolute;
  top: 40px;
  bottom: 0px;
`;
/*
@作者：姜中希
@日期：2018-07-05
@描述：头部导航栏以下的部分, 分为三部分，左侧展开栏，右侧展开栏，中间主要内容部分
*/
