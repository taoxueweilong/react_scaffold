import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import QuickAdd from 'components/dr/quickAdd';
import Table from 'antd/lib/table';
import getResource from 'commonFunc/ajaxGetResource';

export default class QuickAddHerb extends Component {
  constructor(props){
    super(props);
    this.state = {
      showResult: false, // 是否显示浮窗
      listData: [], //草药数据数组
      totalLines: 0, // 查询结果总行数
      curLine: 0, // 当前行,从0开始，-1表示未选中任何行
    };
    this.showResult = this.showResult.bind(this);
    this.hideResult = this.hideResult.bind(this);
  };

  /** [getTableCol 设置列表项] */
  getTableCol () {
    const columns = [{
      title: '检查项目',
      dataIndex: 'orderSuitname',
    }, {
      title: '医保等级',
      dataIndex: 'medinslevelDic',
    }, {
      title: '医保备注',
      dataIndex: 'medicaldesc',
    }, {
      title: '执行科室',
      dataIndex: 'deptname',
    }, {
      title: '单价',
      dataIndex: 'unitprice',
    }, {
      title: '单位',
      dataIndex: 'baseUnit',
    }, {
      title: '是否组套',
      dataIndex: 'manufacturer',
    }];
    return columns;
  };

  /*  获取数据 */
  getData (value) {
    let params = {
      url: 'BaOrderSuitController/getList',
      data: {
        keyword: value,
        ordertype: '1'
      }
    };
    let that = this;
    function success (res) {
      if(res.result){
        let listData = res.data.baOrderSuitList.map((item, index)=>{
          item.key = index; // 加唯一key值
          item.status = (index == 0) ? 1 : 0; // 0表示全部未选中,1表示选择了该行,初始化时默认选中第一行
          return item
        });
        let totalLines = listData.length;
        that.setState({listData, totalLines});
      }
    };
    getResource (params, success);
  };

  /* showResult 展示查询结果 */
  showResult (value) {
    this.setState({
      showResult: true
    });
    this.getData(value);
  };

  /* hideResult 收起查询结果 */
  hideResult () {
    this.setState({
      showResult: false
    });
  };

  /* getValue 获取表格选中行 */
  getValue (record) {
    let quickAddData = record;
    this.setState({
      showResult: false,
    }, function () {
      this.props.getQuickData(quickAddData)
    });
  };

  // 按下Enter键,获取选中行数据
  getEnterValue (curLine) {
    let listData = this.state.listData;
    let quickAddData = listData[curLine];
    this.setState({
      showResult: false,
    }, function () {
      this.props.getQuickData(quickAddData)
    });
  }

  //  checkedLine 选中表格行触发的函数
  checkedLine (record, status) {
    let listData = this.state.listData;
    listData.map((item)=>{ // 改变当前行的选中状态
      if(item.key == record.key){
          item.status = status;
      }else{
        item.status = 0;
      }
      return item;
    });
    this.setState({ listData });
  };

  // 将除当前点击行外的所有行均设置为未选中
  SelectedLine (record) {
    let listData = this.state.listData;
    listData.map((item)=>{ 
      if(item.status != 2){
        if(item.key == record.key){
          if(item.status == 1){
            item.status = 0;
          }else{
            item.status = 1;
          }
        }else{
          item.status = 0;
        }
      }
      return item;
    });
    this.setState({ listData });
  };

  /* [handleEnterPress 包括向上箭头选择上一行，下箭头选择下一行*/
  handleEnterPress = (e) => {
    let listData = this.state.listData;
    let curLine = this.state.curLine;
    let totalLines = this.state.totalLines;
    switch(e.keyCode){
      case 40:         // 向下箭头, 选择下一行
        if(curLine >= totalLines-1){
          curLine = 0;
        }else{
          curLine++;
        }
        this.SelectedLine(listData[curLine]);
        break;
      case 38:         // 向上箭头，选择上一行
        if(curLine <= 0){
          curLine = totalLines-1;
        }else{
          curLine--;
        }
        this.SelectedLine(listData[curLine]);
        break;
      case 13:         // Enter 添加到处方列表
        this.checkedLine(listData[curLine], 2); 
        this.getEnterValue(curLine)
        break;
    };
    this.setState({ curLine });
  };

  render () {
    let { showResult, listData } = this.state;
    let columns = this.getTableCol();
    let dataSource = listData;

    return (
      <QuickAdd {...this.props} displayed={this.showResult} onKeyDown={this.handleEnterPress}>
        {
          showResult?
          (
            <Result>
              <Table
                onRow={(record) => {
                  return {
                    onClick: (e) => {
                      this.checkedLine(record, record.status?0:2);
                      e.stopPropagation();
                      this.getValue(record);
                    },  // 点击行
                  };
                }}
                rowClassName={(record, index)=>{
                  return record.status ? (record.status == 1 ? 'Selected' : 'checked') : 'unSelected';
                }}
                dataSource={dataSource}
                columns={columns}
                pagination={false}/>
            </Result>
          )
          :null
        }
      </QuickAdd>
    );
  }
}
const Result = styled.div`
  position: absolute;
  width: 100%;
  min-height: 20px;
  box-shadow: red;
  color: rgba(0,0,0,0.65);
  z-index: 5;
  background: #fff;
  padding: 0 5px;
  border-left: 1px solid #bebebe;
  border-right: 1px solid #bebebe;
  border-bottom: 1px solid #bebebe;
`;
/*
@作者：马晓敏
@日期：2018-07-10
@描述：快速添加草药处方
*/
