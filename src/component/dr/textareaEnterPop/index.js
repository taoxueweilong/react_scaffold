import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Triangle from './triangle';
import Popout from 'components/popout/basePop';
import search from './search.jpg';
export default class TextareaEnterPop extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false, // 弹框是否可见
    };
    this.handleClose = this.handleClose.bind(this);
  };
  /**
   * 键盘enter弹框ESC关闭弹框
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleKeyPress(keyCode, title){
    if(keyCode == 13){ // enter
      this.setState({visible:true});
      this.props.displayed(title); // 通知父组件已显示弹框
    }
    if(keyCode == 27){ // ESC
      this.setState({visible:false});
    }
    let dom = null;
    switch(title+keyCode){ // 37向左箭头 39向右箭头，分别对应不同的下一个或者上一个tab页
      case '现病史38':
        dom = document.getElementById('familyhistory');
        break;
      case '现病史40':
        dom = document.getElementById('allergichistory');
        break;
      case '过敏史38':
        dom = document.getElementById('hpi');
        break;
      case '过敏史40':
        dom = document.getElementById('pasthistory');
        break;
      case '既往史38':
        dom = document.getElementById('allergichistory');
        break;
      case '既往史40':
        dom = document.getElementById('personhistory');
        break;
      case '个人史38':
        dom = document.getElementById('pasthistory');
        break;
      case '个人史40':
        dom = document.getElementById('moHistory');
        break;
      case '月经婚育史38':
        dom = document.getElementById('personhistory');
        break;
      case '月经婚育史40':
        dom = document.getElementById('familyhistory');
        break;
      case '家族史38':
        dom = document.getElementById('moHistory');
        break;
      case '家族史40':
        dom = document.getElementById('hpi');
        break;
      case '现病史9':
        dom = document.getElementById('inspection');
        console.log('dom', dom);
        break;
      case '过敏史9':
        dom = document.getElementById('inspection');
        break;
      case '既往史9':
        dom = document.getElementById('inspection');
        break;
      case '个人史9':
        dom = document.getElementById('inspection');
        break;
      case '月经婚育史9':
        dom = document.getElementById('inspection');
        break;
      case '家族史9':
        dom = document.getElementById('inspection');
        break;
      default:
        console.log('没有绑定这个键事件');
    };
    if(dom){
      console.log(dom);
      dom.click();
    }
  };
  /**
   * [handleClose 弹框关闭事件]
   * @return {[type]} [description]
   */
  handleClose(){
    this.setState({visible: false});
  };
  render() {
    let { left, title } = this.props.formItemProps;
    let { visible } = this.state;
    return (
      <Container>
        <Triangle left={left}/>
        <Textarea onKeyDown={(e) => this.handleKeyPress(e.keyCode, title)} rows="3" {...this.props.formItemProps} >
        </Textarea>
        <Sign src={search}></Sign>
        <Popout visible={visible} title ={title} onClose={this.handleClose}>
          {this.props.children}
        </Popout>
      </Container>
    );
  }
}
const Container = styled.div`
  position: relative;
`;
const Sign = styled.img`
  position: absolute;
  right: 0px;
  top: -12px;
  width: 20px;
  height: 20px;
`;
const Textarea = styled.textarea`
  font-size: 12px;
  width: 100%;
  border: 1px solid #CCCCCC;
  @media (max-height: 768px) {
    height: 50px !important;
  }
  @media (min-height: 768px) {
    height: 100px !important;
  }
  &:focus {
    outline: none
  }
`;
TextareaEnterPop.proptypes = {
  left: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
}
/*
@作者：姜中希
@日期：2018-06-26
@描述：自定义一个文本域组件，使用原生textarea
*/
