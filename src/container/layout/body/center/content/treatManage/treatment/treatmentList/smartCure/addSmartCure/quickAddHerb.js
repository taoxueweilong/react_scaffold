import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import QuickAdd from 'components/dr/quickAdd';
import Table from 'antd/lib/table';

export default class QuickAddHerb extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedLine: [], // 选中的行
      showResult: false, // 是否显示浮窗
      herbData: [], //草药数据数组
    };
    this.showResult = this.showResult.bind(this);
    this.hideResult = this.hideResult.bind(this);
  };
  /** [getHerbData 获取草药数据] */
  getHerbData(){
    const herbData = [{
      key: '1',
      order: '1',
      name: '金银花',
      alias: '无',
      level: '无自付',
      size: '1.0g',
      unitDose: '1/g',
      unit: 'g',
      unitPrice: '0.25',
      place: '中草药房'
    }];
    this.setState({ herbData });
  };
  /** [getTableCol 设置列表项] */
  getTableCol(){
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      key: 'order',
    }, {
      title: '草药名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
    }, {
      title: '医保等级',
      dataIndex: 'level',
      key: 'level',
    }, {
      title: '规格',
      dataIndex: 'size',
      key: 'size',
    }, {
      title: '单位剂量',
      dataIndex: 'unitDose',
      key: 'unitDose',
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    }, {
      title: '药房',
      dataIndex: 'place',
      key: 'place',
    }];
    return columns;
  };
  /** [showResult 展示查询结果] */
  showResult(value){
    console.log('value', value);
    this.setState({
      showResult: true
    });
    this.getHerbData();
  };
  /** [hideResult 收起查询结果] */
  hideResult(){
    this.setState({
      showResult: false
    });
  };
  /** [getValue 获取表格选中行] */
  getValue(record){
    console.log(record);
    this.setState({
      showResult: false,
      selectedLine: record
    });
  };
  render() {
    let { showResult, value, herbData } = this.state;
    let columns = this.getTableCol();
    let dataSource = herbData;

    return (
      <QuickAdd {...this.props} displayed={this.showResult}>
        {
          showResult?
          (
            <Result>
              <Table
                onRow={(record) => {
                  return {
                    onClick: () => {
                      this.getValue(record);
                    },       // 点击行
                  };
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
`;
/*
@作者：姜中希
@日期：2018-07-03
@描述：快速添加草药组件
*/
