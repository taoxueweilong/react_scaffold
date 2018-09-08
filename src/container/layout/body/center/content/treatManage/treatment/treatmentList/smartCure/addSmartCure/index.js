import React, {Component} from 'react';
import Popout from './baseSimplePop';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import 'components/antd/style/select.less';
import 'components/antd/style/form.less';
import Input from 'components/dr/input';
import TempAddSubtract from './tempAddSubtract';
import SelectHerb from './selectHerb';
import QuickAddHerb from './quickAddHerb';
const Option = Select.Option;
const FormItem = Form.Item;

class Index extends Component {
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onOk();
      }
    });
  }
  hidePop(e){
    // this.textInput.hideResult();
    // this.selectHerb.hideResult();
    // this.quickAddHerb.hideResult();

  };
  render() {
    let { visible } =  this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 },
      },
     };

    return (
      <Popout visible={visible} title='智能推方/添加到我的处方' onClose={()=>{this.props.onClose()}}>
        <div style={styles.body} onClick={(e)=>{this.hidePop(e)}}>
          <Form onSubmit={this.handleSubmit} className='customForm not-draggable' id='form'>
            <div style={styles.top}>
              <Row>
                <Col span={24}>
                  <FormItem
                    {...formItemLayout}
                    colon={false}
                    label="诊断："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('zhenduan', {
                    initialValue: '感冒/风热感冒'
                  })(
                    <Input />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    {...formItemLayout}
                    colon={false}
                    label="处方名称："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('chufang', {
                    initialValue: '风热感冒处方'
                  })(
                    <Input />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    colon={false}
                    label="治疗方法："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('zhiliaofangfa', {
                    initialValue: '煎服'
                  })(
                    <Input />
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    colon={false}
                    label="付数："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('fushu', {
                    initialValue: '3付'
                  })(
                    <Input />
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    colon={false}
                    label="频次："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('pinci', {
                    initialValue: '每日1次'
                  })(
                    <Select className='custom_arrow'>
                      <Option value="每日1次">每日1次</Option>
                      <Option value="每日2次">每日2次</Option>
                      <Option value="每日3次">每日3次</Option>
                    </Select>
                  )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    colon={false}
                    label="临症加减："
                    className='addSmartCure'
                  >
                  {getFieldDecorator('linzhengjiajian', {
                    initialValue: ''
                  })(
                    <TempAddSubtract ref={(input) => { this.textInput = input; }} placeholder='输入疾病首字母'/>
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    colon={false}
                    label=" "
                    className='addSmartCure'
                  >
                  {getFieldDecorator('zhenghou')(
                    <Select className='custom_arrow' placeholder='选择病侯'>
                      <Option value="风热感冒">风热感冒</Option>
                      <Option value="风寒感冒">风寒感冒</Option>
                    </Select>
                  )}
                  </FormItem>
                </Col>
                <Col span={8}>
                <FormItem
                  labelCol={{span: 6}}
                  wrapperCol={{span: 18}}
                  colon={false}
                  label=" "
                  className='addSmartCure'
                >
                {getFieldDecorator('caoyao')(
                  <SelectHerb ref={(input) => { this.selectHerb = input; }} placeholder='选择草药'/>
                )}
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                <FormItem
                  labelCol={{span: 6}}
                  wrapperCol={{span: 18}}
                  colon={false}
                  label="快速添加："
                  className='addSmartCure'
                >
                {getFieldDecorator('kuaisutianjia')(
                  <QuickAddHerb placeholder='请输入草药首字母快速添加' icon='true' ref={ref => this.quickAddHerb = ref}/>
                )}
                </FormItem>
                </Col>
              </Row>
            </div>
            <div style={styles.footer}>
              <Button type="primary" style={styles.bt} className='semicircle' htmlType="submit" >确定</Button>
              <Button type="primary" style={styles.bt} className='cancel' onClick={this.handleReset}>取消</Button>
            </div>
          </Form>
        </div>
      </Popout>
    );
  }
}
const styles = {
  body: {
    width: 910,
    height: 510,
    padding: 10
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
    height: 117
  },
  bt: {
    marginRight: 20,
  }
}
/*
@作者：姜中希
@日期：2018-07-02
@描述：添加诊断信息
*/
const AddSmartCure = Form.create()(Index);
export default AddSmartCure;
