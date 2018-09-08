import React, { Component } from 'react';
import styled from 'styled-components';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import down_arrow from './down.png';
import up_arrow from './up.png';
import getResource from 'commonFunc/ajaxGetResource';

const Option = Select.Option;

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: [], // 用法下拉框
      openstatus: false, // 下拉列表是否展开
    };
  }
  componentWillMount () {
    this.getSpecialUsage()
  }
  /**
   * [handleEnterPress 按下Enter键,光标定位到选择特殊用法上]
   * @param  {[type]} keyCode [键码]
   * @param  {[type]} name    [源组件名称]
   * @return {[type]}         [void]
   */
  handleEnterPress(keyCode, name) {
    console.log('keyCode', keyCode);
    switch(keyCode+name){
      case '13numberInput':
        this.specialUsage.focus();
        break;
      case '13select':
        this.setState({
          openstatus: false
        },()=>{ // enter切换到快速输入
          document.getElementById('quickAddInput').click();
          document.getElementById('quickAddInput').focus();
        })
        break;
      case '40select':
        this.setState({
          openstatus: true
        });
        break;
    };

  }
  /**
   * [dosageChange 修改草药剂量]
   * @param  {[type]} value     [原来的草药项]
   * @param  {[type]} e         [源DOM]
   * @param  {[type]} oldDosage [原来的剂量]
   * @return {[type]}           [void]
   */
  dosageChange(value, e, oldDosage) {
    if(!(oldDosage == e.target.value)){ // 只有值改变了才去触发改变原数组的函数
      this.props.dosageChange(value.medicinename, e.target.value)
    }
  }
  usageChange(value, e, oldUsage){
    if(e.key != oldUsage){
        this.props.onUsageChange(value.medicineid, e)
    }
  };
  // 获取特殊用法下拉数据
  getSpecialUsage() {
    let params = {
      url: 'BaUsageController/getList',
      data: {}
    };
    let that = this;
    function success(res) {
      if(res.result){
        let selectData = res.data;
        that.setState({ selectData })
      }
    };
    getResource(params, success);
  }
  render() {
    let { selectData, openstatus } = this.state;
    let { value, autofocus } = this.props;
    let { usageid, usagename } = value;
    console.log('openstatus', openstatus);
    return (
      <Container>
        <CloseIcon type="close" onClick={()=>{this.props.onDelete(value)}} />
        <DataWrapper >
          <CenterWrapper>
            <NumberInput
              type="text"
              onBlur={(e)=>{this.dosageChange(value,e,value.defQty)}}
              defaultValue={value.defQty}
              autoFocus={autofocus}
              onKeyDown={(e) => {this.handleEnterPress(e.keyCode, 'numberInput')}}
               />
            <HerBalName innerRef={ref=>{this.test=ref}}>{value.medicinename}</HerBalName>
            <span>{value.baseUnitDic}</span>
          </CenterWrapper>
        </DataWrapper>
        <div
          onKeyDown = {(e)=>{this.handleEnterPress(e.keyCode, 'select')}}
          onClick={()=>{this.setState({openstatus: !openstatus})}}>
          <SpecSelect
            open={openstatus}
            labelInValue={true}
            defaultValue={{key: usageid, label: usagename}}
            onChange={(e)=>{this.usageChange(value, e, usageid)}}
            onSelect={(e)=>{this.handleEnterPress(13, 'select')}}
            onBlur={()=>{this.setState({openstatus: false})}}
            innerRef={ref=>this.specialUsage = ref} >
            {
              selectData.map((value, index) => {
                return(
                  <Option key={value.usageid} value={value.usageid}>{value.usagename}</Option>
                )
              })
            }
          </SpecSelect>
        </div>
      </Container>
    )
  }
}

const Container = styled.li`
  margin: 0px;
  position: relative;
  list-style: none;
  width: 210px;
  height: 75px;
  float: left;
  font-size: 12px;
  text-align: center;
  background: #f2f2f2;
  margin:0px 0px 4px 3px;
  color: #cccccc;
  &:hover {
    background-color: #fff;
    border: 1px solid #0a6ecb;
    color: #0a6ecb;
  }
  &:nth-child(4n): {
    margin-right: 0;
  }
`;
const CloseIcon = styled(Icon)`
  font-size: 14px;
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer
`;
const DataWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0a6ecb;
  font-size: 12px;
  line-height: 66px;
`;
const CenterWrapper = styled.div`
  position: relative;
`;
const NumberInput = styled.input`
  width: 20px;
  max-width: 20px;
  height: 20px;
  background: none;
  outline: none;
  border: none;
  text-align: center;
  & + span:after{
    content: '('
  }
  & + span + span:before{
    content: ')'
  }
  ${Container}:hover & {
    width: 40px;
    max-width: 40px;
    border-bottom: 1px solid #0a6ecb;
  }
  &:focus {
    width: 40px;
    max-width: 40px;
    border-bottom: 1px solid #0a6ecb;
  }
  &:focus + span:after{
    content: ''
  }
  &:focus + span + span:before{
    content: ''
  }
  ${Container}:hover & + span:after{
    content: ''
  }
  ${Container}:hover & + span + span:before{
    content: ''
  }
`;
const HerBalName = styled.span`
  float: left;
`;
const SpecSelect = styled(Select)`
  .ant-select-arrow::before {
    content: url(${props=>down_arrow})
  }
  .ant-select-selection {
    background-color: transparent;
    border: none;
  }
  .ant-select-selection:focus {
    background-color: transparent;
    border: none;
    box-shadow: none
    border: 1px solid red;
  }
  .ant-input:focus {
    background-color: transparent;
    border: none;
    box-shadow: none
  }
  .ant-select-selection:focus .ant-select-selection-selected-value {
    display: block !important;
  }
  .ant-select-selection-selected-value {
    display: ${props=>props.defaultValue.label == '无' ? 'none !important' : 'block'};
  }
  top: -25px;
  ${Container}:hover & {
    display: block;
  }
`;
/*
@作者：姜中希
@日期：2018-08-14
@描述：表格项目
*/
