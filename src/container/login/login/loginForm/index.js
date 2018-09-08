import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import {Form, Input} from 'antd';
import getResource from 'commonFunc/ajaxGetResource';
import User from 'components/dr/icon/user';
import Lock from 'components/dr/icon/lock';
import EMI from 'components/dr/icon/emi';
import TipModal from 'components/dr/modal/tip';
import verification from './verification.png';
import refresh from './refresh.png';
import 'components/antd/style/checkbox.less';
import 'components/antd/style/button.css';

const FormItem = Form.Item;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '', // 验证码base64图片
      code: '', // 验证码
      rememberPass: window.localStorage.getItem('rememberPass'), // 记住密码，需要从本地读取上次保存状态，没有为字符串false
      autoLogin: window.localStorage.getItem('autoLogin'), // 自动登录，需要从本地读取上次保存状态，没有为字符串false
      username: '', // 用户名
      password: '', // 密码
    };
  }
  componentWillMount() {
    this.verifyAutoLogin();
    this.getVerificationCode()
  }
  // 校验是否进行自动登陆 和 初始化用户名、密码
  verifyAutoLogin(){
    let autoLogin = window.localStorage.getItem('autoLogin');
    let rememberPass = window.localStorage.getItem('rememberPass');
    let username = window.localStorage.getItem('username');
    let password = window.localStorage.getItem('password');
    if(autoLogin == 'true'){ // 自动登陆
      let paramsData = {
        username: username,
        password: password,
        code: 1,
        verificationCode: '',
      };
      // this.loginAction(paramsData);
    }
    if(rememberPass == 'true'){ // 记住密码，初始化输入框
      this.setState({
        username: username,
        password: password,
      });
    };
  };
  //获取验证码
  getVerificationCode() {
    let that = this;
    let params = {
      type: 'GET',
      url: 'verificationCodeController/getVerificationCode',
      data: {}
    };
    function success(res) {
      that.setState({
        verificationCode: res.data.verificationCode,
        code: res.data.code
      })
    };
    getResource(params, success);
  }
  // 点击登录，校验输入项，获取输入项
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let paramsData = {
          username: values.userName,
          password: values.password,
          code: 1,
          verificationCode: values.verificationCode,
        };
        this.loginAction(paramsData);
      }
    });
  }
  /** [loginAction 调用登录服务] */
  loginAction(paramsData){
    let that = this;
    let params = {
      url: 'loginController/login',
      type: 'post',
      data: JSON.stringify(paramsData)
    }
    function success(res) {
      if (res.data != null) {
        window.orgUserid = res.data.baOrguserUnion[0].orgUserid; // 保存为全局变量
        let { rememberPass, autoLogin } = that.state;
        if(rememberPass || autoLogin){ // 记住密码和自动登陆都需要保存用户名、密码
          window.localStorage.setItem('username', paramsData.username);
          window.localStorage.setItem('password', paramsData.password);
        }
        window.localStorage.setItem('rememberPass', rememberPass);
        window.localStorage.setItem('autoLogin', autoLogin);
        let id = res.data.baOrguserUnion[0].orgUserid;
        let path = {
          pathname:'/login/initialSetting',
          state: {
            orgUserid: id
          }
        }
        that.props.history.push(path); // 跳转到初始化设置组件
      } else {
        that.tipModal.showModal();
      }
    };
    getResource(params, success);
  };
  /* 记住密码 */
  rememberPass(checked) {
    this.setState({ rememberPass: '' + checked });
  }
  /* 自动登录 */
  autoLogin(checked){
    this.setState({ autoLogin: '' + checked });
  };
  render() {
    const { username, password, verificationCode, rememberPass, autoLogin} = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <FormLogin onSubmit={this.handleSubmit} className='login-form' ref={ref=>{this.testForm=ref}}>
          <FormItem
            hasFeedback >
            {getFieldDecorator('userName', {
              initialValue: username,
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <CustomInput autoFocus = 'autofocus' id='loginPre' prefix={<Prefix><User/><Bread>|</Bread></Prefix>} placeholder="请输入用户名" />
            )}
          </FormItem>
          <FormItem
            hasFeedback>
            {getFieldDecorator('password', {
              initialValue: password,
              rules: [{ required: true, message: '请输入登录密码!' }],
            })(
              <CustomInput prefix={<Prefix><Lock/><Bread>|</Bread></Prefix>} type="password" placeholder="请输入登录密码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('verificationCode', {
              rules: [{ required: false, message: '请输入右侧验证码!' }],
            })(
              <CustomInput prefix={<Prefix><EMI/><Bread>|</Bread></Prefix>} placeholder="请输入右侧验证码"/>
            )}
            <ValidateCode className="validate-code" alt="" src={verificationCode} />
            <IconReload className="icon-reload" onClick={this.getVerificationCode.bind(this)} >
              <img alt="" src={refresh} />
            </IconReload>
          </FormItem>
          <FormItem>

            <RetakeLink to="/login/getPassword">🔑找回密码</RetakeLink>

          </FormItem>
        </FormLogin>
        <TipModal ref={ref=>{this.tipModal=ref}}>
          <div>
            <span>用户不存在，</span>
              请核对输入是否正确，如果重试问题依然存在，请跟系统管理员联系~
          </div>
        </TipModal>
      </div>
    );
  }
}
const FormLogin = styled(Form)`
  &&& {
    float: right;
    margin-top: 5px;
    width: 350px;
    height: 373px;
    border: 1px solid #cccccc;
    padding: 25px;
  }
  &&& .ant-input-affix-wrapper {
    height: 38px;
  }
  &&& .ant-form-item-control {
    line-height: normal;
  }
`;
const Prefix = styled.div`
  display: flex;
  align-items: center;
`;
const Bread = styled.div`
  margin: 10px;
  padding-bottom: 4px;
  font-size: 13px;
  color: #99B2D8;
`;
/* 将输入框的输入开始位置往后调*/
const CustomInput = styled(Input)`
  &&& > .ant-input {
    padding-left: 50px;
    border-radius: 0px;
    color: #000000;
  }
`;
const ValidateCode = styled.img`
  position: absolute;
  top: -9px;
  right: 30px;
  width: 82px;
  height: 37px;
`;
const IconReload = styled.i`
  position: absolute;
  top: 0;
  right: 3px;
  cursor: pointer;
`;

const CheckboxText = styled.span`
  color: #999999;
`;
const RetakeLink = styled(Link)`
  float: right;
  color: #0A6ECB;
  font-size: 13px;
  margin-bottom: 10px;
`;
const LoginForm = Form.create()(Index);
export default withRouter(LoginForm);
/*
@作者：马晓敏
@日期：2018-07-31
@描述：登录表单页面
*/
/*
@作者：姜中希
@日期：2018-08-06
@描述：登录表单页面代码重构
*/
