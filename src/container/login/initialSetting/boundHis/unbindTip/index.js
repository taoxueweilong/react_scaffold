import React, {Component} from 'react';
import styled from 'styled-components';
import getResource from 'commonFunc/ajaxGetResource';
import Popout from 'components/popout/basePop';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';

export default class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false
    };
  };
  /** [handleOk 确定解绑, 返回his展示组件] */
  handleOk(){
    let userId = window.sessionStorage.getItem('userid'); // 用户ID
    let paramsData = {
      userId: userId
    };
    let params = {
      type: 'post',
      url: 'sysBindController/unBindHisSys',
      data: JSON.stringify(paramsData)
    };
    let that = this;
    function success(res) {
      if(res.result){
        that.handleClose();
        that.props.handleOk(); // 通知父组件刷新数据
      }
    };
    getResource(params, success);
  };
  /** [handleClose 关闭本弹框] */
  handleClose(){ // 关闭本弹框
    this.setState({visible: false});
  };
  /** [handleOpen 打开本弹框] */
  handleOpen(){
    this.setState({visible: true});
  };
  render() {
    let { visible } =  this.state;
    return (
      <div>
        <Popout visible={visible} title='系统提示' onClose={()=>{this.handleClose()}}>
          <Body>
            <Tip>
              <Search>
                💔
              </Search>
              <span>使用本系统前必须绑定HIS，您确定要和中科软社区HIS解除绑定吗？
              </span>
            </Tip>
            <div>
              <Button type="primary" className='middle' onClick={()=>{this.handleOk()}}>确定解绑</Button>
              <Button type="primary" className='cancel middle' onClick={()=>{this.handleClose()}}>返回</Button>
            </div>
          </Body>
        </Popout>
      </div>
    );
  }
}
const Body = styled.div`
  background-color: #F2F2F2;
  width: 510px;
  height: 256px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center
`;
const Tip = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  font-size: 16px;
  font-weight: 400
  color: black;
`;
const Search = styled.span`
  font-size: 50px;
  margin-right: 20px;
`;
/*
@作者：姜中希
@日期：2018-08-08
@描述：解除绑定提示
*/
