import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Upload from 'antd/lib/upload';
import 'antd/lib/upload/style';
import message from 'antd/lib/message';
import 'antd/lib/message/style';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import getResource from 'commonFunc/ajaxGetResource';
import 'components/antd/style/input.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 图片转成base64
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
  console.log("ok", img)
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orgUserid: this.props.orgUserid,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let userId = window.sessionStorage.getItem('userid');
        let params = {
          url: 'BaOrguserController/getData',
          type: 'post',
          data: userId
        }
        let that = this;
        function success(res) {
          that.props.onToggle();
        };
        getResource(params, success);
      }
    });
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  render() {
    const props = {
      action: 'http://10.10.200.114:8087/uploadController/photoUpload',
      data: {
        orguserid: this.state.orgUserid,
      },
      name:"fileAttachments",//与后台字段对应
      listType: "picture-card",
      showUploadList: false,
      headers: {'X-Requested-With': null},
      accept: "image/jpg,image/jpeg,image/png,image/bmp",
      onChange: this.handleChange,
      showUploadList: false,
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        if (!isJPG) {
          message.error('头像照片仅支持png或jpg 格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('照片大小不能超过2MB!');
        }
        return isJPG && isLt2M;
      }
    }
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <div className="ant-upload-text upload-tip">点击上传头像</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
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
      <InfoForm onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="头像">
          {getFieldDecorator('file', {
            rules: [{
              required: false,
            }],
          })(
            <AvatarUploader {...props}>
            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </AvatarUploader>
          )}
          <AvatarRequest>
            <RequestTitle>说明：</RequestTitle>
            <p>头像照片支持png 或 jpg 格式均可，每个头像照片大小限2M</p>
          </AvatarRequest>
        </FormItem>
        <SpecFormItem
          {...formItemLayout}
          colon={false}
          label="用户名：">
          {getFieldDecorator('userName', {
            rules: [{
              required: true, message: '请输入用户名',
            }],
          })(
            <SpecInput className='direct' />
          )}
          <NameRequest>只支持长度不超过20个英文字母或数字、减号、下划线符合，
            但不能以数字开头；只能修改一次
          </NameRequest>
        </SpecFormItem>
        <SpecFormItem
          {...formItemLayout}
          label="真实姓名："
          colon={false}>
          {getFieldDecorator('realName', {
            rules: [{
              required: true, message: '请输入真实姓名',
            }],
          })(
            <SpecInput className='direct' />
          )}
        </SpecFormItem>
        <SpecFormItem
          {...formItemLayout}
          colon={false}
          label="当前科室：">
          {getFieldDecorator('section', {
            rules: [{
              required: true, message: '请选择所在科室',
            }],
            initialValue: {key: '1', label: '中医科'}
          })(
            <SpecSelect  labelInValue>
              <Option value="1">中医科</Option>
              <Option value="2">适宜技术服务科</Option>
              <Option value="3">全科</Option>
            </SpecSelect>
          )}
        </SpecFormItem>
        <FormItem>
          <Footer>
            <Button type="primary" className='middle' htmlType="submit">确认并下一步</Button>
            <Link to="/">
              <Button type="primary" className='cancel middle'>取消</Button>
            </Link>
          </Footer>
        </FormItem>
      </InfoForm>
    );
  }
}

const InfoForm = styled(Form)`
  &&& {
    padding: 15px 20px;
  }
`;
const SpecFormItem = styled(FormItem)`
  .ant-form-item-required:before {
    display: none;
  }
  &&& .ant-form-item-required:after {
    display: inline-block;
    content: "*";
    font-family: SimSun;
    font-size: 14px;
    color: #f5222d;
  }
  &.ant-form-item {
    margin-top: -10px;
  }
`;
const SpecInput = styled(Input)`
  &.ant-input {
    width: 248px;
  }
`;
const SpecSelect = styled(Select)`
  .ant-select-selection {
    border-radius: 0px;
    width: 248px;
  }
`;
const NameRequest = styled.div`
  float: right;
  line-height: 20px;
  margin-top: -10px;
  height: 30px;
  width: 185px;
  font-size: 12px;
  color: #999999;
`;
const AvatarUploader = styled(Upload)`
  &&& {
    float: left;
  }
  &&& .ant-upload {
    width: 80px;
    height: 80px;
    margin-left: 20px;
    padding: 0;
  }
`;
const AvatarRequest = styled.div`
  float: left;
  width: 165px;
  font-size: 12px;
  line-height: 20px;
  color: #999999;
`;
const RequestTitle = styled.div`
  color: #333333;
  line-height: 25px;
`;
const Footer = styled.div`
  border-top: 1px solid #FFF;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Information = Form.create()(Index);

export default Information;
/*
@作者：姜中希
@日期：2018-08-09
@描述：初始化设置个人信息设置组件
*/