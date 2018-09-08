import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Up from 'components/antd/img/up.png';
import Down from 'components/antd/img/down.png';

export default class SelectPop extends Component {
  constructor(props){
    super(props);
    this.state = {
      values: new Set(), //将选中的草药存入该数组
      showResult: false,
      selectedRowKeys: []
    };
  };
  showResult(e){
    this.props.displayed();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  render() {
    let showResult = this.props.showResult;
    let placeholder = this.props.placeholder;
    return (
      <Container>
        <Input
          type='text'
          showResult={showResult}
          placeholder={placeholder}
          onClick={(e)=>{this.showResult(e)}}
        />
        {
          this.props.children
        }
      </Container>
    );
  }
}
const Container = styled.div`
  width: 100%;
  position: relative;
`;
const Input = styled.input`
  width: 100%;
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  border-top: none;
  border-left: none;
  border-right: none;
  line-height: 25px;
  color: black;
  margin-top: 10px;
  font-size: 12px;
  background: ${props => 'url('+ (props.showResult?Up:Down) +') no-repeat right top'};
  &:focus {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    outline: none
  }
`;
SelectPop.props = {
  showResult: PropTypes.bool.isrequired,
  placeholder: PropTypes.string
};
/*
@作者：姜中希
@日期：2018-07-03
@描述：自定义一个输入框组件，样式定制，点击时会通过下拉框显示一个弹框
使用示例参考：src\container\layout\body\center\content\treatManage\treatment\treatmentList\smartCure\addSmartCure\selectHerb.js
*/
