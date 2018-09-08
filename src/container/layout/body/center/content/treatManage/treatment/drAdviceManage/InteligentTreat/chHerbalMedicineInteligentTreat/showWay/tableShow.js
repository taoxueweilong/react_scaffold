import React, { Component } from 'react';
import { Table } from 'antd';
import 'components/antd/style/table.css';
import getResource from 'commonFunc/ajaxGetResource';
import '../index.less';
export default class TableShow extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 获取特殊用法下拉数据
  getSpecialUsage() {
    let params = {
      url: 'BaUsageController/getList',
      data: {}
    };
    let that = this;
    function success(res) {
      that.setState({
        selectData: res.data
      })
    };
    getResource(params, success);
  }

  // 删除
  handleDelete = (value, index) => {
    console.log('value, index',value, index)
    this.props.onDelete(index)
  }

  numberCell(value, index, record) {
    console.log(value, 'ok')
  }

  // 操作
  operationCell(value, index, record) {
    return (
      <div key={index}>
        <i style={styles.operationCell} onClick={() => { this.handleDelete(value, index, record) }}>删除</i>
      </div>
    )
  }

  // 序号
  setOrderNo (value, record, index) {
    return <span>{index+1}</span>
  }

  onHeaderRow(column, index) {

  }

  render() {
    let dataSource = this.props.quickAddData;
    return (
      <div style={styles.listWrap}>
        <Table
          rowKey={record => record.id}
          dataSource={dataSource}
          onHeaderRow={(column) => { this.onHeaderRow() }}
        >
          <Table.Column title="序号" render={this.setOrderNo.bind(this)} />
          <Table.Column title="草药名称" dataIndex="medicinename" />
          <Table.Column title="剂量/单位" dataIndex="baseUnit" />
          <Table.Column title="特殊用法" dataIndex="specialUsageid" />
          <Table.Column title="操作" render={this.operationCell.bind(this)} />
        </Table>
      </div>
    )
  }
}

const styles = {
  listWrap: {
    position: 'relative',
    width: '857px',
    minHeight: '300px',
    overflow: 'hidden',
  },
  operationCell: {
    color: '#0a6ecb',
    cursor: 'pointer',
  }
};

/*
@作者：马晓敏
@日期：2018-07-05
@描述：显示方式——列表
*/
