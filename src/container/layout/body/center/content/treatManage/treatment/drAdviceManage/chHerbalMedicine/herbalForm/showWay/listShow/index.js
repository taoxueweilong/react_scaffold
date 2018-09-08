import React, { Component } from 'react';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import 'antd/lib/table/style';
import getResource from 'commonFunc/ajaxGetResource';
export default class Index extends Component {
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
  /** [getTableColumns 设置表格列] */
  getTableColumns(){
    let columns = [
      {
        title: '序号',
        dataIndex: 'order',
        key: 'order',
        render: (text, record, index)=> (index+1)
      },{
        title: '草药名称',
        dataIndex: 'medicinename',
        key: 'medicinename',
      },{
        title: '剂量/单位',
        dataIndex: 'baseUnit',
        key: 'baseUnit',
      },{
        title: '特殊用法',
        dataIndex: 'usagename',
        key: 'usagename',
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, idnex)=> <a onClick={()=>{this.props.delHerbal(record)}}>删除</a>
      }
    ];
    return columns;
  };
  render() {
    let herbalData = this.props.herbalData;
    let columns = this.getTableColumns();
    return (
      <ListWrap
        rowKey={record => record.id}
        dataSource={herbalData}
        columns={columns}
        locale={{emptyText: '暂无草药数据' }}
      >
      </ListWrap>
    )
  }
}
const ListWrap = styled(Table)`
  & {
    position: relative;
    width: 857px;
    min-height: 300px;
  }
`;

/*
@作者：姜中希
@日期：2018-08-15
@描述：显示方式——列表
*/
