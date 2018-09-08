import React, { Component } from 'react';
import styled from 'styled-components';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Row from 'antd/lib/row';
import 'antd/lib/row/style';
import Col from 'antd/lib/col';
import 'antd/lib/col/style';
import Table from 'components/dr/icon/table';
import List from 'components/dr/icon/list';
import TableShow from './showWay/tableShow';
import ListShow from './showWay/listShow';
import TempAddSubtract from './tempAddSubtract';
import SelectHerb from './selectHerb';
import QuickAddHerb from './quickAddHerb';
import Diagnose from './diagnose';
import AddHerbalForm from './addHerbalForm';
import Input from 'components/dr/input/basicInput';
import TipModal from 'components/dr/modal/tip';
import 'components/antd/style/button.css';
import 'components/antd/style/select.less';
import 'components/antd/style/form.less';
import ajaxGetResource from 'commonFunc/ajaxGetResource';
import { getDiagnoseText } from 'commonFunc/transform';

const FormItem = Form.Item;
const Option = Select.Option;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frequencyData: [],  // 频次下拉数据
      showWay: 'table',   // 默认显示方式为格格
      showResult: false,  // 初始不显示草药列表
      buDiagnosisInfo: {}, // 诊断信息主表原始数据，修改时需要使用
      buRecipe: {}, // 原始处方信息
      data: {}, //原始医嘱信息
      // 初始化数据
      buDiagnosisList: [], // 当前患者的诊断数据
      recipename: '', // 处方名称
      usagename: '', // 治疗方法
      remark: 3, // 付数
      freq: null, // 频次
      herbalData: [], // 草药数据
    };
    this.delHerbal = this.delHerbal.bind(this);
    this.dosageChange = this.dosageChange.bind(this);
    this.usageChange = this.usageChange.bind(this);
  }
  componentWillMount(){
    this.getDiagnoseData();
    this.getFrequency();
    if(this.props.initData){ // 修改、查看需要初始化数据
      this.getCHMedicineAdvice(this.props.orderid);
    }
  };
  /** [getDiagnoseData 组件初始化获取加载诊断数据] */
  getDiagnoseData(){
    let self = this;
    let params = {
      url: 'BuDiagnosisInfoController/getData',
      data: {
        registerid: window.registerID
      },
    };
    function callBack(res){
      if(res.result && res.data){ // 获取当前诊断明细数据
        let { buDiagnosisList, ...buDiagnosisInfo } = res.data;
        self.setState({
          buDiagnosisList: buDiagnosisList,
          buDiagnosisInfo: buDiagnosisInfo
        });
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
        freqtype: 1
      }
    };
    let that = this;
    function success(res) {
      if(res.result){
        let frequencyData = res.data;
        that.setState({ frequencyData })
      }
    };
    ajaxGetResource(params, success);
  }
  getCHMedicineAdvice(orderid){
    let params = {
      url: 'BuOrderController/getData',
      data: {
        orderid: orderid
      }
    };
    let that = this;
    function callBack(res) {
      if(res.result){
        let { buRecipe, buOrderDtlList, ...data } = res.data;
        buOrderDtlList.forEach((item)=>{
          item.medicinename = item.itemname;
          item.defQty = item.dosage;
        });
        that.setState({
          recipename: buRecipe.recipename, // 处方名称
          usagename: buRecipe.usagename, // 治疗方法
          remark: buRecipe.remark, // 付数
          freq: {key: buRecipe.freqid, label: buRecipe.freqname}, // 频次
          herbalData: buOrderDtlList, // 草药数据
          buRecipe: buRecipe, // 原始处方信息
          data: data, // 原始医嘱信息
        });
      }
    };
    ajaxGetResource(params, callBack);
  };
  clearData(){
    this.setState({
      recipename: '', // 处方名称
      usagename: '', // 治疗方法
      remark: '', // 付数
      freq: null, // 频次
      herbalData: [], // 草药数据
    });
  };
  /** [toggleShowWay 切换草药展示形式] */
  toggleShowWay (index) {
    this.setState({
      showWay: index,
    })
  }
  /**
   * [addHerbalData 添加草药列表]
   * @param  {[type]} quickAddData [新增项]
   * @return {[type]}              [void]
   */
  addHerbalData (herbalItem) {
    herbalItem.usageid = herbalItem.baUsage ? herbalItem.baUsage.usageid : 9; // 从用法对象转换成字符串用法ID
    herbalItem.usagename = herbalItem.baUsage ? herbalItem.baUsage.usagename : '无'; // 从用法对象转换成字符串用法名称
    let { herbalData , showWay } = this.state;
    for(let i=0; i < herbalData.length; i++){
      if(herbalData[i].medicinename == herbalItem.medicinename){
        this.tipModal.showModal();
        return false;
      }
    }
    if(showWay == 'table'){
      this.addTableData.scrollTop = this.addTableData.scrollHeight; // 自动滚动到滚动区域的最底部
    }
    herbalData.push(herbalItem);
    this.setState({ herbalData });
  }
  /**
   * [delHerbal 删除某个草药]
   * @param  {[type]} herbalItem [草药数据对象]
   * @return {[type]}            [void]
   */
  delHerbal(herbalItem){
    let herbalData = this.state.herbalData;
    herbalData.pop(herbalItem);
    this.setState({ herbalData });
  };
  /**
   * [dosageChange 修改草药剂量]
   * @param  {[type]} medicinename [草药名称]
   * @param  {[type]} newDosage    [新剂量]
   * @return {[type]}              [void]
   */
  dosageChange(medicinename, newDosage) {
    let herbalData = this.state.herbalData;
    herbalData.forEach((item)=>{
      if(item.medicinename == medicinename){
        item.count = newDosage;
      }
    })
    console.log('herbalData数据' ,herbalData);
    this.setState({herbalData});
  }
  /**
   * [usageChange 某药的用法进行修改]
   * @param  {[type]} medicineid [该药ID]
   * @param  {[type]} newUsage [该药用法对象（包含名称、ID）]
   * @return {[type]}            [void]
   */
  usageChange(medicineid, newUsage) {
    let herbalData = this.state.herbalData;
    herbalData.forEach((item)=>{
      if(item.medicineid == medicineid){
        item.usageid = newUsage.key;
        item.usagename = newUsage.label;
      }
    })
    this.setState({herbalData});
  }
  // 保存
  handleSubmit(e){
    e.preventDefault();
    let formData = new Object();
    let herbalData = this.state.herbalData;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        formData = values;
      }
    });
    return { formData, herbalData }
  }
  render () {
    let { recipename, usagename, remark, freq, herbalData, buDiagnosisList, frequencyData, showWay} = this.state;
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
      className: 'height',
      colon: false
    };
    const separateFormItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
      className: 'height',
      colon: false
    };
    return (
      <SpecForm className='not-draggable' onClick={()=>{this.quickAddHerb.hideResult()}}>
        <Row>
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              label="诊断：">
              {getFieldDecorator('diagnose', {
                initialValue: {originData: buDiagnosisList, extractionData: getDiagnoseText(buDiagnosisList)}
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
              label="处方名称：">
              {getFieldDecorator('recipename', {
                initialValue: recipename
              })(
                <Input />
              )}
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...separateFormItemLayout}
              label="治疗方法：">
              {getFieldDecorator('treatMethods', {
                initialValue: usagename
              })(
                <Input />
              )}
              </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...separateFormItemLayout}
              label="付数（付）：">
              {getFieldDecorator('doseNum', {
                initialValue: remark,
              })(
                <Input style={{marginTop: 8}}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...separateFormItemLayout}
              label="频次：">
              {getFieldDecorator('frequency', {
                initialValue: (frequencyData.length > 0 ? (freq ? freq : {key: frequencyData[0].freqcode, label: frequencyData[0].freqname}) : {key: '', label: ''})
              })(
                <Select className='custom_arrow' labelInValue>
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
              {...separateFormItemLayout}
              label="临症加减：">
            {getFieldDecorator('substract', {
              initialValue: ''
            })(
              <TempAddSubtract ref={(input) => { this.textInput = input; }}/>
            )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...separateFormItemLayout}
              label=" ">
              {getFieldDecorator('illSymbal')(
                <Select className='custom_arrow' placeholder='选择病侯'>
                  <Option value="风热感冒">风热感冒</Option>
                  <Option value="风寒感冒">风寒感冒</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
          <FormItem
            {...separateFormItemLayout}
            label=" ">
            {getFieldDecorator('herbal')(
              <SelectHerb ref={(input) => { this.selectHerb = input; }} />
            )}
          </FormItem>
          </Col>
        </Row>
        <Row>
          <SpecCol span={8}>
            <TableIcon showWay={showWay} onClick={this.toggleShowWay.bind(this, 'table')}/>
            <ListIcon showWay={showWay} onClick={this.toggleShowWay.bind(this, 'list')}/>
            <AddHerbal onClick = {()=>{this.addHerbalForm.handleAddClick()}}>🌿添加中药</AddHerbal>
            <QuickAdd>快速添加：</QuickAdd>
          </SpecCol>
          <Col span={16}>
            <FormItem
              wrapperCol={{span: 24}}
            >
            {getFieldDecorator('addQuickly')(
              <QuickAddHerb placeholder='请输入中药首字母快速添加' icon='true' ref={ref => this.quickAddHerb = ref} getQuickData = {this.addHerbalData.bind(this)}/>
            )}
            </FormItem>
          </Col>
        </Row>
        {
          showWay == 'list' ?
          <ListShow herbalData={ herbalData } delHerbal={this.delHerbal} ref={ref => this.addListData = ref}/>
          :
          <TableShow
            herbalData={ herbalData }
            delHerbal={this.delHerbal}
            dosageChange={this.dosageChange}
            usageChange={this.usageChange}
            addHerbal={ () => { this.addHerbalForm.handleAddClick() }}
            ref={ref => this.addTableData = ref} />
        }
        <AddHerbalForm wrappedComponentRef={ref=>{this.addHerbalForm = ref}}></AddHerbalForm>
        <TipModal ref={ref=>{this.tipModal=ref}}>
          <div>
            <span>草药已存在</span>
          </div>
        </TipModal>
      </SpecForm>
    )
  }
}
const SpecForm = styled(Form)`
  &&& {
    width: 100%;
    height: 540px;
    padding: 0px 10px;
    font-size: 12px;
  }
  &&& label{
    color: #666666;
  }
`;
const SpecCol = styled(Col)`
  margin: 15px 0px 15px 0px;
`;
const TableIcon = styled(Table)`
  background: ${props => props.showWay == 'table' ? 'rgba(10, 110, 203, 1)' : '#999999'};
`;
const ListIcon = styled(List)`
  > div{
    background-color: ${props => props.showWay == 'list' ? 'rgba(10, 110, 203, 1)' : '#999999'};
  }
  border-color: ${props => props.showWay == 'list' ? 'rgba(10, 110, 203, 1)' : '#999999'};
  margin:0px 10px;
`;
const AddHerbal = styled.div`
  float: left;
  height: 20px;
  color: #0A6ECB;
  padding: 0px 13px;
  border-left: 1px solid #999999;
  border-right: 1px solid #999999;
  cursor: pointer;
`;
const QuickAdd = styled.span`
  margin-left: 13px;
  color: #666666;
`;
const Footer = styled.div`
  width: 100%;
  height: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center
`;
const HerbalForm = Form.create()(Index);
export default HerbalForm;

/*
@作者：马晓敏
@日期：2018-06-29
@描述：新增中草药处方部分
*/
