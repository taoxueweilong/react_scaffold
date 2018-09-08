import React, { Component } from 'react';
import styled from 'styled-components';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import Radio from 'antd/lib/radio';
import 'antd/lib/radio/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Row from 'antd/lib/row';
import 'antd/lib/row/style';
import Col from 'antd/lib/col';
import 'antd/lib/col/style';
import BasePop from 'components/popout/basePop';
import TableShow from './showWay/tableShow';
import ListShow from './showWay/listShow';
import TempAddSubtract from './tempAddSubtract';
import SelectHerb from './selectHerb';
import QuickAddHerb from './quickAddHerb';
import Diagnose from './diagnose';
import Input from 'components/dr/input/input';
import 'components/antd/style/button.css';
import 'components/antd/style/select.less';
import 'components/antd/style/form.less';
import ajaxGetResource from 'commonFunc/ajaxGetResource';
import { getDiagnoseText } from 'commonFunc/transform';
import './index.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visiblePop: false,  // 控制弹框显示隐藏
      orderType: 1,       // 医嘱类型
      frequencyData: [],  // 频次下拉数据
      status: 1,          // 默认显示方式为列表
      value: '0',           // 默认选中医保内
      showResult: false,  // 初始不显示草药列表
      quickAddData: [],   // 快速添加草药列表
      className1: 'onfocus',   // 显示方式图标选中时的样式
      className2: 'onblur',   // 显示方式图标未选中时的样式
      saved: false,          // 是否点击保存按钮
      diagnoseData: [], // 当前患者的诊断数据
      baHerbalMedicines: [],//下列表
    };
  }
  /** [initialData 组件初始化获取加载诊断数据] */
  getDiagnoseData(){
    let self = this;
    let params = {
      url: 'BuDiagnosisInfoController/getList',
      data: {
        registerid: window.registerID
      },
    };
    function callBack(res){
      if(res.result && res.data[0]){ // 获取当前诊断明细数据
        let diagnoseData = res.data[0].buDiagnosisList;
        self.setState({diagnoseData});
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  // 组件初始化获取频次数据下拉列表
  getFrequency () {
    let params = {
      url: 'BaFreqController/getList',
      data: {
        freqtype: 3
      }
    };
    let that = this;
    function success(res) {
      let frequencyData = res.data.map((item, index) => {
        item.key = index;
        return item
      })
      that.setState({ frequencyData })
    };
    ajaxGetResource(params, success);
  }
  // 弹框显示
  handlePopOpen (buOrderDtlList) {
    // 数据初始化
    this.setState({
      baHerbalMedicines: buOrderDtlList
    })
    this.getFrequency();
    this.getDiagnoseData();
    this.setState({ visiblePop: true }, ()=>{
      console.log('引用',this.normalLoginForm);
    });
  };
  // 弹框关闭
  handlePopClose () {
    this.setState({ visiblePop: false });
    this.handleClickTableIcon();
  };
  // 以列表形式显示
  handleClickTableIcon () {
    this.setState({
      status: 1,
      className1: 'onfocus',
      className2: 'onblur',
    })
  }
  // 以表格形式显示
  handleClickProfileIcon () {
    this.setState({
      status: 2,
      className1: 'onblur',
      className2: 'onfocus',
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  // 隐藏下拉框
  hidePop () {
    // this.textInput.hideResult();
    // this.selectHerb.hideResult();
    this.quickAddHerb.hideResult();
  };
  // // 选择医保内和医保外改变时触发的回调函数
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  // 添加草药列表
  getQuickData (quickAddData) {
    if (quickAddData) {
      let arr = this.state.quickAddData;
      arr.push(quickAddData)
      quickAddData.exist = 1
      let data = arr.map((item, index) => {
        item.key = index;
        return item;
      })
      this.setState({
        quickAddData: data
      })
    }
  }
  // 保存
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('herbal values', typeof(values.doseNum))
      let quickAddData = this.state.quickAddData;
      let baHerbalMedicines = this.state.baHerbalMedicines;
      let mergeArray = baHerbalMedicines.concat(quickAddData);//合并数组
      let nameArr = [];
      let price = 0;
      let self = this;
      let medicineArr = mergeArray.filter((item, index) => {
        nameArr.push(item.medicinename)
        price += item.unitprice/item.defQty*item.defQty;
        item.baseUnit = item.baseUnit;
        item.count = item.defQty;
        item.dosage = item.defQty;
        item.freqid = values.frequency.key;
        item.freqname = values.frequency.label;
        item.doseid = item.doseid;
        item.miType = self.state.value;
        item.dosename = item.dosename;
        item.itemcode = item.medicinecode;
        item.itemid = item.medicineid;
        item.itemname = item.medicinename;
        item.itemno = index;
        item.itemtype = 0; // 中药0
        item.unitprice = item.unitprice;
        item.specification = item.specification;
        item.useflag = item.useflag;
        return item.exist==1;
      })
      console.log('medicineArr', medicineArr)
      let prescriptionContent = nameArr.join('、')
      let patientId = window.patientID;
      let patientName = window.patientName;

      let freqname = values.frequency;
      let usagename = values.treatMethods;
      let paramsData = {
        parientid: patientId,  // 患者ID
        registerid: '201832424728142114', // 挂号ID
        parientname: patientName,  // 患者姓名
        orgUserid: window.sessionStorage.getItem('userid'),
        orgid: window.sessionStorage.getItem('orgid'),
        feeall: price * values.doseNum,
        orgUsername: window.sessionStorage.getItem('username'),
        ordertype: '3',   // 医嘱类型
        ordercontent: prescriptionContent, // 医嘱内容
        orderstate: '1',  // 缴费状态
        buRecipe: { // 表单数据
          recipetype: 1,
          diagnosename: values.diagnosename,  // 诊断名称
          registerid: '201832424728142114', // 挂号ID
          freqname: values.frequency.label,   // 频次
          usagename: values.treatMethods,   // 用法
        },
        buOrderDtlList: medicineArr,   // 药品信息
      }
      if (!err) {
        console.log('Received values of form: ', values);
        let params = {
          url: 'BuOrderController/postData',
          type: 'post',
          data: JSON.stringify(paramsData)
        }
        let that = this;
        function success(res) {
          console.log('保存成功')
          that.handlePopClose();
          that.props.reloadList();
        };
        ajaxGetResource(params, success);
      }
    });
  }
  // 删除草药
  onDelete (index) {
    let arr = this.state.quickAddData;
    arr.splice(index,1)
    this.setState({
      quickAddData: arr
    })
  }
  render () {
    let { visiblePop, frequencyData, quickAddData, status, className1, className2, diagnoseData, baHerbalMedicines  } = this.state;
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
      <BasePop visible={visiblePop}  title='新增中药处方' onClose={() => this.handlePopClose()}>
        <Wrap>
          <div onClick={()=>{this.hidePop()}}>
            <Form className='not-draggable'>
              <TopWrap>
                <Row>
                  <Col span={24}>
                    <FormItem
                      {...formItemLayout}
                      colon={false}
                      className='height'
                      label="诊断：">
                      {getFieldDecorator('diagnosename', {
                        initialValue: {originData: diagnoseData, extractionData: getDiagnoseText(diagnoseData)}
                      })(
                        <Diagnose />
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
                      className='height'>
                    {getFieldDecorator('prescription', {
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
                      className='height'>
                    {getFieldDecorator('treatMethods', {
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
                      style={{fontSize: 12}}
                      colon={false}
                      label="付数（付）："
                      className='height'>
                    {getFieldDecorator('doseNum', {
                      initialValue: 3
                    })(
                      <Input style={{marginTop: 8}}/>
                    )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{span: 6}}
                      wrapperCol={{span: 18}}
                      colon={false}
                      label="频次："
                      className='height'>
                    {getFieldDecorator('frequency', {
                      initialValue: (frequencyData.length > 0 ? {key: frequencyData[0].freqcode, label: frequencyData[0].freqname} : {key: '', label: ''})
                    })(
                      <Select className='custom_arrow herbal' labelInValue>
                        {
                          frequencyData.map((item, index)=>{
                            return (
                              <Option key={index} value={item.freqcode}>{item.freqname}</Option>
                            )
                          })
                        }
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
                      className='height'>
                    {getFieldDecorator('substract', {
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
                      className='height'>
                    {getFieldDecorator('illSymbal')(
                      <Select className='custom_arrow herbal' placeholder='选择病侯'>
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
                    className='height'>
                  {getFieldDecorator('herbal')(
                    <SelectHerb ref={(input) => { this.selectHerb = input; }} placeholder='选择草药'/>
                  )}
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={10}>
                    <div style={styles.wrapper}>
                      <div style={styles.tabIconWrap}>
                        <p style={styles.tableIcon} onClick={this.handleClickTableIcon.bind(this)} >
                          <Icon type="table" className={className1}/>
                        </p>
                        <p style={styles.profileIcon} onClick={this.handleClickProfileIcon.bind(this)} >
                          <Icon type="profile" className={className2}/>
                        </p>
                        <div style={styles.line}></div>
                      </div>
                      <div style={styles.addWrap}>
                        <p style={styles.addQuickly}>➕快速添加：</p>
                        <div style={styles.insuranceWrap}>
                          <RadioGroup style={styles.insurance} value={this.state.value} onChange={this.onChange}>
                            <Radio value={'0'} style={styles.insuranceCheck} >医保内</Radio>
                            <Radio value={'1'} style={styles.insuranceCheck} >医保外</Radio>
                          </RadioGroup>
                        </div>
                        <div style={styles.line}></div>
                      </div>
                    </div>
                  </Col>
                  <Col span={14}>
                    <FormItem
                      wrapperCol={{span: 24}}
                      className='herbal'
                    >
                    {getFieldDecorator('addQuickly')(
                      <QuickAddHerb placeholder='请输入中药首字母快速添加' icon='true' ref={ref => this.quickAddHerb = ref} getQuickData = {this.getQuickData.bind(this)}/>
                    )}
                    </FormItem>
                  </Col>
                </Row>
              </TopWrap>
              <div>
              {
                status == 1 ?
                <ListShow baHerbalMedicines={baHerbalMedicines} quickAddData={quickAddData} onDelete={this.onDelete.bind(this)}/>
                :
                <TableShow baHerbalMedicines={baHerbalMedicines} quickAddData={quickAddData} onDelete={this.onDelete.bind(this)}/>
              }
              </div>
              <Footer>
                <Button type="primary" className='semicircle' onClick={this.handleSubmit.bind(this)} >保存</Button>
                <Button type="primary" className='cancel gray' onClick={this.handlePopClose.bind(this)} >取消</Button>
              </Footer>
            </Form>
          </div>
        </Wrap>
      </BasePop>
    )
  }
}
const BorderButton = styled(Button)`
  border: 1px solid rgba(10, 110, 203, 1) !important;
  font-size: 12px;
  height: 30px;
  border-radius: 15px;
`;
const Wrap = styled.div`
  width: 100%;
  height: 548px;
`;
const TopWrap = styled.div`
  padding: 0px 10px;
  paddingTop: 0px;
`;
const Footer = styled.div`
  width: 100%;
  height: 56px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center
`;
const styles = {
  wrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  tabIconWrap: {
    float: 'left',
    overflow: 'hidden',
    color: '#999999',
    fontSize: '20px',
  },
  tableIcon: {
    float: 'left',
    marginTop: '5px'
  },
  profileIcon: {
    float: 'left',
    marginLeft: '5px',
    marginRight: '10px',
    marginTop: '5px'
  },
  addWrap: {
    float: 'left',
  },
  addQuickly: {
    float: 'left',
    fontSize: '12px',
    color: '#333333',
    width: '80px',
    height: '30px',
    lineHeight: '45px',
    marginLeft: '10px'
  },
  line: {
    float: 'left',
    width: '1px',
    height: '20px',
    background: '#999999',
    marginTop: '10px '
  },
  insuranceWrap: {
    float: 'left',
    fontSize: '12px',
    height: '24px',
    marginTop: '6px',
    borderBottom: '1px solid #e9e9e9'
  },
  insuranceCheck: {
    fontSize: '12px'
  },
  bodyTop: {
    marginBottom: '20px'
  },

  bt: {
    margin: 20
  }
};

const ChHerbalMedicineInteligentTreat = Form.create()(Index);

export default ChHerbalMedicineInteligentTreat;

/*
@作者：王崇琨
@日期：2018-08-13
@描述：辨证论治添加中草药处方部分
*/
