import React, {Component} from 'react';
import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import 'antd/lib/form/style';
import 'antd/lib/input/style';
import 'antd/lib/button/style';
import 'antd/lib/checkbox/style';
import 'components/antd/style/button.css';
import 'components/antd/style/input.less';

const FormItem = Form.Item;

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 120,
      disabled: true,
    };
    this.timer = null;
  }
  componentDidMount () {
    // this.timer = setInterval(
    //   () => {
    //     this.setState({
    //       seconds: this.state.seconds--,
    //     }, () => {
    //     if(this.state.seconds == 0) {
    //       clearInterval(this.timer);
    //     }
    //   });
    // }, 1000)
  }
  render() {
    let that = this;
    let seconds = that.state.seconds;
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
          我们已经向
          <Stress>139****5119</Stress>
          的手机发送了一条验证短信，请输入短信验证码完成身份校验
        </Tip>
        <Content>
          <FormItem
            {...formItemLayout}
            label="短信验证码 ：">
              <SpeInput className="direct" placeholder="请输入短信验证码"/>
              <ReSend disabled={this.state.disabled} >{seconds}秒后可重发</ReSend>
              <Warn>短信验证码有效期
                <ExpireTime>5分钟</ExpireTime>
                ，请在有效期内完成验证
              </Warn>
          </FormItem>
        </Content>
        <Footer>
          <Button type="primary" className="semicircle" onClick={()=>{this.props.onToggle(3)}} >下一步</Button>
          <Button className="cancelBtn" type="primary" onClick={()=>{this.props.onToggle(1)}}>上一步</Button>
        </Footer>
      </div>
    );
  }
}
const Content = styled.div`
  height: 250px;
  display: flex;
  margin-left: -90px;
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
const Stress = styled.span`
  color: #0A6ECB;
`;
const SpeInput = styled(Input)`
  &&& {
    float: left;
    width: 296px;
    height: 38px;
    margin-left: 10px;
  }
`;
const ReSend = styled.div`
  float: left;
  background: #e4e4e4;
  width: 119px;
  height: 38px;
  font-size: 12px;
  line-height: 38px;
  text-align: center;
  color: #666666;
  margin-left: 5px;
  cursor: pointer;
`;
const ExpireTime = styled.span`
  color: #009966;
`;
const Warn = styled.p`
  float: left;
  font-size: 12px;
  color: #999999;
  margin-top: 10px;
  margin-left: 10px;
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
@描述：验证短信验证码
*/
