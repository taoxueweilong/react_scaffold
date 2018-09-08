import React, {Component} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import 'antd/lib/form/style';
import 'antd/lib/input/style';
import 'antd/lib/button/style';
import 'antd/lib/checkbox/style';
import getResource from 'commonFunc/ajaxGetResource';
import 'components/antd/style/button.css';
import 'components/antd/style/input.less';

const FormItem = Form.Item;

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '', // 验证码base64图片
      code: '', // 验证码
    };
  }
  componentWillMount(){
    this.getVerificationCode();
  };
  //获取验证码
  getVerificationCode() {
    let that = this;
    let params = {
      type: 'GET',
      url: 'verificationCodeController/getVerificationCode',
      data: {}
    };
    function callBack(res) {
      that.setState({
        verificationCode: res.data.verificationCode,
        code: res.data.code
      })
    };
    getResource(params, callBack);
  }
  render() {
    let { verificationCode, code} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Tip>
          <TipIcon type="info-circle" />
          请输入您留存的手机号快速进行身份验证
        </Tip>
        <Content>
          <FormItem
            {...formItemLayout}
            label="手机号 ：">
              <SpeInput className="direct" placeholder="请输入预留的手机号" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="验证码 ：">
            <SpeInput className="direct" placeholder="请输入右侧验证码"/>
            <ValidateCode>
              <CodeImg src={verificationCode} />
              <Action>
                <span> ▏</span>
                <Refresh onClick={()=>{this.getVerificationCode()}}>刷新</Refresh>
              </Action>
            </ValidateCode>
          </FormItem>
        </Content>
        <Footer>
          <Button type="primary" className="semicircle" onClick={()=>{this.props.onToggle(2)}} >下一步</Button>
          <Link to="/">
            <Button className="cancelBtn" type="primary" >取消</Button>
          </Link>
        </Footer>
      </div>
    );
  }
}
const Content = styled.div`
  height: 248px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Tip = styled.div`
  margin-top: 26px;
  font-size: 13px;
  color: #333333;
`;
const TipIcon = styled(Icon)`
  color: #0A6ECB;
  font-size: 16px;
  margin-right: 5px;
`;
const SpeInput = styled(Input)`
  &&& {
    float: left;
    width: 296px;
    height: 38px;
    margin-left: 10px;
  }
`;
const ValidateCode = styled.span`
  position: absolute;
  right: 0px;
  width: 150px;
  color: #FFFFFF;
  background-color: #0A6ECB;
  height: 38px;
  display: flex;
  align-items: center;
`;
const CodeImg = styled.img`
  width: 90px;
  height: 100%;
`;
const Action = styled.div`
  position: absolute;
  right: 0px;
  margin: 0px 10px;
`;
const Refresh = styled.i`
  right: 0px;
  color: #FFFF99;
  font-size: 14px;
  cursor: pointer;
`;
const Footer = styled.div`
  width: 708px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #fff;
`;
/*
@作者：姜中希
@日期：2018-08-06
@描述：验证手机号
*/
