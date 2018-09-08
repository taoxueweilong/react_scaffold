import React, {Component} from 'react';
import styled from 'styled-components';
import Popout from 'components/popout/basePop';
import ElctImg from './img/add_case.png';
import Button from 'antd/lib/button';
import 'components/antd/style/button.css';

export default class ToElecCasePop extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false
    };
  };
  /** [handleClose 弹框关闭事件] */
  handleClose(){
    this.setState({visible: false});
  };
  /** [handleOk 点击确定关闭本弹框并跳转到电子病历页] */
  handleOk(){ //
    this.props.onOk();
  };
  handleOpen(){
    this.setState({visible: true});
  };
  /** [handleEnterPress 包括enter显示，esc隐藏的判断函数] */
  handleEnterPress = (e) => {
    if(e.keyCode == 27){ // ESC
      this.handleClose(e);
      e.preventDefault();// 阻止冒泡
      return false;
    }
  };
  render() {
    let { visible } =  this.state;
    return (
      <Popout visible={visible} title='系统操作提示' onClose={()=>{this.handleClose()}}>
        <Body onKeyDown={this.handleEnterPress}>
          <Tip>
            <img src={ElctImg} />
            <span>是否查看该患者电子病历？</span>
          </Tip>
          <div>
            <Button type="primary" className='semicircle' autoFocus='autofocus' onClick={()=>{this.handleOk()}}>确定</Button>
            <Button type="primary" className='cancel' onClick={()=>{this.handleClose()}}>取消</Button>
          </div>
        </Body>
      </Popout>
    );
  }
}
const Body = styled.div`
  width: 500px;
  height: 256px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: #F2F2F2;
`;
const Tip = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 70%;
  font-size: 20px;
  font-weight: 400
`;
/*
@作者：姜中希
@日期：2018-06-29
@描述：诊疗点击复诊按钮时弹框询问是否转到电子病历，
要想打开这个弹框可以为组件提供ref然后通过调用handleOpen函数打开
实例参考src\container\layout\body\center\content\treatManage\treatment\treatmentList\index.js
*/
