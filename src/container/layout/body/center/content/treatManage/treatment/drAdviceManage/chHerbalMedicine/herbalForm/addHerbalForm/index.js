import React, { Component } from 'react';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import styled from 'styled-components';
import BasePop from 'components/popout/basePop';
import QuickAddHerb from './quickAddHerb';
import getResource from 'commonFunc/ajaxGetResource';
import 'components/antd/style/table.css';
import 'components/antd/style/select.less';
import 'components/antd/style/input.less';

const Option = Select.Option;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visiblePop: false,
    };
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handlePopClose = this.handlePopClose.bind(this);
  }
  // 点击加号添加草药
  handleAddClick () {
    this.setState({
      visiblePop: true
    })
  }
  // 关闭添加草药弹框
  handlePopClose () {
    this.setState({
      visiblePop: false
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let { visiblePop } = this.state;
    return (
      <BasePop visible={visiblePop} title='' onClose={() => this.handlePopClose()}>
        <PopWrap>
          <QuickAddHerb placeholder='请输入中药首字母快速添加' ref={ref => this.quickAddHerb = ref} getQuickData = {()=>{this.addHerbalData.bind(this)}}/>
          <SpecForm className='not-draggable'>
            <FormItem className="add-herbal-pop"
              {...formItemLayout}
              label="草药">
              {getFieldDecorator('section', {
              })(
                <Select initialValue="1" >
                  <Option value="1">金银花</Option>
                  <Option value="2">连翘</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className="add-herbal-pop"
              {...formItemLayout}
              label="剂量"
            >
              {getFieldDecorator('realName', {
              })(
                <Input type="user" />
              )}
            </FormItem>
            <FormItem className="add-herbal-pop"
              {...formItemLayout}
              label="特殊用法"
            >
            {getFieldDecorator('section', {
            })(
              <Select initialValue="1" >
                <Option value="1">先煎</Option>
                <Option value="2">泡服</Option>
              </Select>
            )}
            </FormItem>
            <Footer>
              <Button type="primary" className='middle'>确认</Button>
              <Button className='cancel middle' type="primary" onClick={this.handlePopClose}>取消</Button>
            </Footer>
          </SpecForm>
        </PopWrap>
      </BasePop>
    )
  }
}
const PopWrap = styled.div`
  overflow: hidden;
  width: 100%;
  height: 280px;
  background: #f2f2f2;
`;
const SpecForm = styled(Form)`
  &&& {
    width: 590px;
    background: #f2f2f2;
    margin: 30px 0;
  }
`;
const Footer = styled.div`
  width: 558px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AddHerbalForm = Form.create()(Index);
export default AddHerbalForm;

/*
@作者：马晓敏
@日期：2018-07-05
@描述：显示方式——方块儿排列
*/
