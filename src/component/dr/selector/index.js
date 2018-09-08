import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import icon_down from './img/down.png';
import icon_up from './img/up.png';

export default class Index extends Component {
  constructor(props){
    super(props);
    this.showResult = this.showResult.bind(this);
  };
  showResult(e){
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  render() {
    let {placeholder, value, className} = this.props;
    return (
      <Container className={className}>
        <div />
      </Container>
    );
  }
}
const Container = styled.div`
  width: 100%;
  height: 25px;
  position: relative;
  z-index: 5px;
  background: url(${icon_up}) no-repeat right;
`;
const Input = styled.input`
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  border-top: none;
  border-left: none;
  border-right: none;
  line-height: 25px;
  width: 100%;
  color: black;
  cu
  background: transparent;
  font-size: 12px;
  &:focus {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    outline: none
  }
`;
const Sign = styled.img.attrs({
  src: icon_up
})`
  z-index: 6;
  position: absolute;
  margin-left: -25px;
  cursor: pointer;
`;
Index.proptypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string
};
/*
@作者：姜中希
@日期：2018-07-03
@描述：自定义一个输入框组件，输入时会自动过滤出来匹配的结果，通过下拉框形式展示，选择后输入框内展示选择结果
使用参考：src\container\layout\body\center\content\treatManage\treatment\treatmentList\smartCure\addSmartCure\tempAddSubtract.js
*/
