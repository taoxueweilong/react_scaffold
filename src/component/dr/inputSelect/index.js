import React, {Component} from 'react';
import styled from 'styled-components';
import icon from '../img/search.jpg';

export default class InputSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
    };
  };
  showResult(e){
    this.props.displayed(e.target.value); // 显示浮窗
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  render() {
    let value = this.state.value;
    let formItem = this.props.formItemProps;
    return (
      <Container>
        <Input type='text' onChange={(e)=>{this.showResult(e)}} placeholder={formItem.placeholder}/>
        {
          this.props.children
        }
      </Container>
    );
  }
}
const Container = styled.div`
  width: 100%;
  position: relative
`;
const Input = styled.input`
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  border-top: none;
  border-left: none;
  border-right: none;
  line-height: 25px;
  width: 100%;
  color: black;
  background: transparent;
  margin-top: 10px;
  font-size: 12px;
  &:focus {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    outline: none
  }
`;
/*
@作者：姜中希
@日期：2018-07-03
@描述：自定义一个输入框组件，样式定制，输入时会自动过滤出来匹配的结果，通过下拉框形式展示
使用参考：src\container\layout\body\center\content\treatManage\treatment\treatmentList\smartCure\addSmartCure\tempAddSubtract.js
*/
