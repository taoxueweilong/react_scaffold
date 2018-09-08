import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import Loading from 'components/dr/loading';
import bind from './bind.png';

class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      bindStatus: false, // 是否显示正在绑定
    };
    this.bindImmediately = this.bindImmediately.bind(this);
  };
  /** [bindImmediately 立即绑定] */
  bindImmediately(){
    let self = this;
    self.setState({
      bindStatus: true
    }, ()=>{
      setTimeout(()=>{
        self.setState({
          bindStatus: false
        });
        self.props.history.push('/initialSetting'); // 跳转到初始化设置组件
      },1000);
    });
    let userId = window.sessionStorage.getItem('userid');
    let params = {
      url: 'sysBindController/bindHisSys',
      data: {
        userId: userId
      },
    };
    function success(res) {
      self.props.history.push('/initialSetting'); // 跳转到初始化设置组件
    };
    function error(res) {
      console.log('身份验证失败');
    };
    // getResource(params, success, error);
  };
  render() {
    let bindStatus = this.state.bindStatus;
    return (
      <div>
        <PassTip>
          <PassTipIcon type="check-circle" />
          您的身份验证已通过
        </PassTip>
        <BindWrap>
          <BindLeft>中科软社区HIS</BindLeft>
          <BindSign>
            <BindWrite>绑定</BindWrite>
            <dd><img alt="" src={bind} /></dd>
          </BindSign>
          <BindRight >中医馆健康信息平台</BindRight>
        </BindWrap>
        <Footer>
          <Button type="primary" className='middle' onClick={this.bindImmediately}>立即绑定</Button>
          <Link to="/login/initialSetting">
            <Button type="primary" className='cancel middle'>取消</Button>
          </Link>
        </Footer>
        <Loading loading={bindStatus}>
          <div>
            正在绑定
            <Stress>中科软社区HIS</Stress>
            ，请稍后
          </div>
        </Loading>
      </div>
    );
  }
}
const PassTip = styled.div`
  font-size: 14px;
  text-align: left;
  color: #333333;
  margin-left: 20px;
  margin-top: 25px;
`;
const PassTipIcon = styled(Icon)`
  color: #33cc00;
  font-size: 16px;
  margin-right: 9px;
`;
const BindWrap = styled.div`
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BindLeft = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 20px;
  text-align: center;
  font-size: 16px;
  border-radius: 10px;
  background: #33cc00;
	color: #ffffff;
	padding: 0 20px;
	padding-top: 25px;
`;
const BindRight = BindLeft.extend`
  background: #ffffff;
  border: 1px solid #0a6ecb;
  color: #0a6ecb;
  padding: 0 5px;
  padding-top: 25px;
`;
const BindSign = styled.dl`
  padding: 0 20px;
  margin-top: 10px;
`;
const BindWrite = styled.dt`
  font-size: 14px;
  text-align: center;
  color: #0a6ecb;
`;
const Footer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Stress = styled.span`
  color: #5555e2;
`;
/*
@作者：姜中希
@日期：2018-08-09
@描述：绑定HIS系统——立即绑定
*/
export default withRouter(Index);