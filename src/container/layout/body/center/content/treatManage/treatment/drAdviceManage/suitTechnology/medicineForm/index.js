import React, { Component } from 'react';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import 'antd/lib/table/style';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import Radio from 'antd/lib/radio';
import 'antd/lib/radio/style';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Row from 'antd/lib/row';
import 'antd/lib/row/style';
import Col from 'antd/lib/col';
import 'antd/lib/col/style';
import Diagnose from '../../chHerbalMedicine/herbalForm/diagnose';
import QuickAddMedicine from './quickAddMedicine';
import InputBaseLine from 'components/dr/input/basicInput';
import 'components/antd/style/select.less';
import 'components/antd/style/form.less';
import 'components/antd/style/table.css';
import 'components/antd/style/input.less';
import ajaxGetResource from 'commonFunc/ajaxGetResource';
import TipModal from 'components/dr/modal/tip';
import { getDiagnoseText } from 'commonFunc/transform';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
      buDiagnosisInfo: {}, // 诊断主信息对象
      usageData: [], // 用法下拉框
      buDiagnosisInfo: {}, // 诊断信息主表原始数据，修改时需要使用
      buRecipe: {}, // 原始处方信息
      data: {}, //原始医嘱信息
      // 初始化数据
      buDiagnosisList: [], // 诊断明细信息
      recipename: '', // 处方名称
      miType: 1, // 0 医保外， 1医保内 默认选择医保内
      medicineData: [], // 药品数据
    }
  }
  /** [getSpecialUsage 获取特殊用法下拉数据] */
  getSpecialUsage() {
    let params = {
      url: 'BaUsageController/getList',
      data: {}
    };
    let that = this;
    function success(res) {
      if(res.result){
        let usageData = res.data;
        that.setState({ usageData })
      }
    };
    ajaxGetResource(params, success);
  }
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
  componentWillMount(){
    this.getDiagnoseData();
    this.getSpecialUsage();
    if(this.props.actionType == 'modify' || this.props.actionType == 'view'){ // 修改、查看需要初始化数据
      this.getCHMedicineAdvice(this.props.orderid);
    }
  };
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
          medicineData: buOrderDtlList, // 草药数据
          buRecipe: buRecipe, // 原始处方信息
          data: data, // 原始医嘱信息
        });
      }
    };
    ajaxGetResource(params, callBack);
  };
  /**
   * [onDelete 删除当前药品]
   * @param  {[type]} record [当前药品对象]
   * @return {[type]}        [void]
   */
  onDelete (record) {
    let medicineData = this.state.medicineData;
    medicineData.pop(record);
    this.setState({medicineData})
  }
  /** [handleSubmit 获取表单数据] */
  handleSubmit = (e) => {
    e.preventDefault();
    let formData = new Object();
    let medicineData = this.state.medicineData;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        formData = values;
        console.log('Received values of form: ', values);
      }
    });
    return {formData, medicineData}
  }
  /**
   * [onModifyInputValue 表格输入框值改变后改变数据源的函数]
   * @param  {[type]} newValue   [新值]
   * @param  {[type]} medicineid [药品ID]
   * @param  {[type]} item       [改变的药品项]
   * @return {[type]}            [void]
   */
  onModifyInputValue(newValue, medicineid, item){
    let medicineData = this.state.medicineData;
    medicineData.forEach((Dataitem, index)=>{
      Dataitem[item] = Dataitem.medicineid == medicineid ? newValue : Dataitem[item];
    });
    this.setState({ medicineData });
  };
  /**
   * [onModifySelectValue 表格中下拉框选项改变后触发的函数]
   * @param  {[type]} medicineid [当前药品ID]
   * @param  {[type]} idItem     [当前药品项ID]
   * @param  {[type]} nameItem   [当前药品项名称]
   * @param  {[type]} newID      [新药品项ID]
   * @param  {[type]} newName    [新药品项名称]
   * @return {[type]}            [void]
   */
  onModifySelectValue(medicineid, idItem, nameItem, newID, newName){
    let medicineData = this.state.medicineData;
    medicineData.forEach((Dataitem, index)=>{
      Dataitem[idItem] = Dataitem.medicineid == medicineid ? newID : Dataitem[idItem];
      Dataitem[nameItem] = Dataitem.medicineid == medicineid ? newName : Dataitem[nameItem];
    });
    this.setState({ medicineData });
  };
  /**
   * [addMedicineData 添加药品列表]
   * @param  {[type]} medicineItem [新增项]
   * @return {[type]}              [void]
   */
  addMedicineData (medicineItem) {
    medicineItem.usageid = medicineItem.baUsage ? medicineItem.baUsage.usageid : 9; // 从用法对象转换成字符串用法ID
    medicineItem.usagename = medicineItem.baUsage ? medicineItem.baUsage.usagename : '无'; // 从用法对象转换成字符串用法名称
    let medicineData = this.state.medicineData;
    for(let i=0; i < medicineData.length; i++){
      if(medicineData[i].medicinename == medicineItem.medicinename){
        this.tipModal.showModal();
        return false;
      }
    }
    medicineData.push(medicineItem);
    this.setState({ medicineData });
  }
  /** [getTableColumns 设置表格列] */
  getTableColumns(){
    let usageData = this.state.usageData;
    let columns = [{
      title: "序号",
      dataIndex: 'order',
      key: 'order',
      render: (text, record, index) => index +1
    }, {
      title: "药名",
      dataIndex: 'medicinename',
      key: 'medicinename',
    }, {
      title: "数量/单位",
      dataIndex: 'unitprice',
      key: 'unitprice',
      render: (text, record, index)=>
      <span>
        <InputCount className='input-table' onBlur={(e)=>{ record.defQty != e.target.value ? this.onModifyInputValue(e.target.value, record.medicineid, 'count') : ''}} defaultValue={record.defQty} />
        /{record.baseUnit}
      </span>
    }, {
      title: "单位剂量",
      dataIndex: 'mediUnit',
      key: 'mediUnit',
    }, {
      title: "单次剂量",
      dataIndex: 'defQty',
      key: 'defQty',
    }, {
      title: "频次",
      dataIndex: 'freqname',
      key: 'freqname',
    }, {
      title: "天数",
      dataIndex: 'defTakedays',
      key: 'defTakedays',
      render: (text, record, index)=><InputDays className='input-table' onBlur={(e)=>{ record.defTakedays != e.target.value ? this.onModifyInputValue(e.target.value, record.medicineid, 'defTakedays') : ''}} defaultValue={record.defTakedays}/>
    }, {
      title: "用法",
      dataIndex: 'usagename',
      key: 'usagename',
      render: (text, record)=>(
        <Select
          className='select-table'
          defaultValue={{key: record.usageid, label: record.usagename}}
          labelInValue={true}
          onSelect={(e)=>{this.onModifySelectValue(record.medicineid, 'usageid', 'usagename', e.key, e.label)}}>
          {
            usageData.map((item) => <Option key={item.usageid} value={item.usageid}>{item.usagename}</Option>)
          }
        </Select>
      )
    }, {
      title: "状态≡",
      dataIndex: 'statusValue',
      key: 'statusValue',
      render: (value, record, index)=><Status status={record.statusValue}>{record.statusValue ? '• 已缴费' : '• 待缴费'}</Status>
    }, {
      title: "操作",
      dataIndex: 'operate',
      key: 'operate',
      render: (value, index, record)=> <a onClick={() => { this.onDelete(record) }}>删除</a>
    }];
    return columns;
  };
  render () {
    let { visiblePop, medicineData, buDiagnosisList, miType, recipename } = this.state;
    const { getFieldDecorator } = this.props.form;
    console.log('medicineData' ,medicineData);
    const columns = this.getTableColumns();
    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 21 },
        sm: { span: 21 },
      },
      className: 'height',
      colon: false
    };
    const specFormItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 },
      },
      className: 'height',
      colon: false
    };
    return (
      <Form className='not-draggable' onClick={()=>{this.quickAddMedicine.hideResult()}}>
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
              label="处方名称："
            >
            {getFieldDecorator('recipename', {
              initialValue: recipename
            })(
              <InputBaseLine />
            )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <SpecFormItem
              {...specFormItemLayout}
              label={<span><Add>➕</Add>快速添加：</span>}
              >
                {getFieldDecorator('addQuickly',{
                  initialValue: miType
                })(
                  <SpecRadioGroup>
                    <Radio value={0}>医保内</Radio>
                    <Radio value={1}>医保外</Radio>
                  </SpecRadioGroup>
                )}
              </SpecFormItem>
          </Col>
          <Col span={16}>
            <FormItem
              {...formItemLayout}
              >
                {getFieldDecorator('addQuickly')(
                  <QuickAddMedicine placeholder='请输入中成药或西药首字母快速添加' icon='true' ref={ref => this.quickAddMedicine = ref} getQuickData = {this.addMedicineData.bind(this)}/>
                )}
              </FormItem>
          </Col>
        </Row>
        <SpecTable
          dataSource={medicineData}
          locale={{emptyText: '暂无中成药/西药数据' }}
          columns={columns} >
        </SpecTable>
        <TipModal ref={ref=>{this.tipModal=ref}}>
          <div>
            <span>草药已存在</span>
          </div>
        </TipModal>
      </Form>
    )
  }
}
const SpecFormItem = styled(FormItem)`
  .ant-form-item-children {
    display: flex;
    border-bottom: 1px solid rgba(215,215,215,1);
    height: 35px;
  }
`;
const InputCount = styled(Input)`
  &&& {
    width: 25px;
  }
`;
const InputDays = styled(Input)`
  &&& {
    width: 60px;
    text-align: left;
  }
`;
const Add = styled.span`
  color: #0A6ECB;
`;
const SpecRadioGroup = styled(RadioGroup)`
  &&& {
    float: left;
    font-size: 12px;
    width: 220px;
    height: 25px;
    display: flex;
    align-items: center;
    margin-right: 21px;
    margin-top: 8px;
    border-right: 1px solid #e9e9e9;
  }
`;
const Status = styled.span`
  color: ${props => props.status ? '#009900' : '#0A6ECB'}
`;
const SpecTable = styled(Table)`
  margin-top: 20px;
  .ant-table-thead th {
    color: rgb(102, 102, 102);
  }
`;
const ChPatentMedicineForm = Form.create()(Index);

export default ChPatentMedicineForm;
/*
@作者：姜中希
@日期：2018-08-19
@描述：新增中成药/西药处方表单部分
*/
