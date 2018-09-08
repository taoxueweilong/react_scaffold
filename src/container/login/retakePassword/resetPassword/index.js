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
  render() {
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
          <TipIcon type="check-circle" />
          王琰龙您好，您的身份已经验证通过，请立即为账户设置新密码：
        </Tip>
        <SpecForm>
          <FormItem
            {...formItemLayout}
            label="设置新密码 ：">
            <SpeInput className="direct" placeholder="请输入新密码" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="再输一次 ：">
            <SpeInput className="direct" placeholder="请再输入一次新密码" />
          </FormItem>
        </SpecForm>
        <WarmTip>❤️温馨提示：这是中医馆健康信息平台密码，不是设置HIS系统登录密码，请您知悉；</WarmTip>
        <Footer>
          <Button type="primary" className="semicircle" onClick={()=>{this.props.onToggle(4)}} >下一步</Button>
          <Button className="cancelBtn" type="primary" onClick={()=>{this.props.onToggle(2)}}>上一步</Button>
        </Footer>
      </div>
    );
  }
}
const SpecForm = styled(Form)`
  height: 150px;
  margin-top: 20px;
`;
const Tip = styled.div`
  font-size: 13px;
  color: #333333;
  margin: 20px 0px;
`;
const TipIcon = styled(Icon)`
  color: #33cc00;
  font-weight: 900;
  font-size: 16px;
  margin-right: 9px;
`;
const SpeInput = styled(Input)`
  &&& {
    float: left;
    width: 296px;
    height: 38px;
    margin-left: 10px;
  }
`;
const WarmTip = styled.p`
  font-size: 13px;
  color: #0A6ECB;
  margin-top: 50px;
`;
const Footer = styled.div`
  width: 708px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #FFFFFF;
`;
