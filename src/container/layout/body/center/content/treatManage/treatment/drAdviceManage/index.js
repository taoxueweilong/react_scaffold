import React, { Component } from 'react';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import getResource from 'commonFunc/ajaxGetResource';
import ChHerbalMedicine from './chHerbalMedicine';
// import ChHerbalMedicineInteligentTreat from './InteligentTreat/chHerbalMedicineInteligentTreat';
import ChPatentMedicine from './chPatentMedicine';
import SuitTechnology from './suitTechnology';
import Examination from './Examination';
import Inspection from './Inspection';
import WesternMedicine from './WesternMedicine';
import Material from './Material';
import InteligentTreat from './InteligentTreat';
import herbalIcon from './imgs/herbalIcon.png';
import 'components/antd/style/table.css';
import './InteligentTreat/chHerbalMedicineInteligentTreat/index.less';
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: [], // 医嘱类型
      dataSource: [], // 表格数据源
      treatcode: {}, // 挂号编号
      selectedRowKeys: [], // 已选中行的数据
      tatalRecords: 0, // 医嘱分页总条数
      currentPage: 1, // 当前页
      actionType: '', // modify、view、add
      orderid: '', // 当前医嘱ID
    };
    this.private = {
      pageSize: 10,
      current: 1,
    };
    this.getData = this.getData.bind(this);
  }
  componentWillMount(){
    this.getData();
  }
  componentReceiveProps(){
    this.getData();
  };
  /**
   * [getData 获取医嘱列表信息]
   * @param  {Number} [nextPage=1] [下一页默认值1]
   * @return {[type]}              [description]
   */
  getData (nextPage = 1){
    let registerid = window.registerID;
    let params = {
      url: 'BuOrderController/getList',
      data: {
        registerid: window.registerID,
        page: nextPage,
        pageSize: pageSize
      }
    };
    let that = this;
    function success(res) {
      if(res.result && res.data){
        let dataSource = res.data.records.map((item, index)=>{
          item.key = index; // 加唯一key值
          return item
        });
        let tatalRecords = res.data.total;
        let currentPage = nextPage;
        that.setState({dataSource, tatalRecords, currentPage});
      }else{
        that.setState({dataSource: [], tatalRecords: 0});
      }
    };
    getResource(params, success);
  }
  /**
   * [onDelete 删除医嘱信息]
   * @param  {[type]} orderid [医嘱ID]
   * @return {[type]}        [void]
   */
  onDelete (orderid) {
    let params = {
      url: 'BuOrderController/delData',
      type: 'delete',
      data: orderid,
    };
    let that = this;
    function success(res) {
      that.getData();
    };
    getResource(params, success);
  }
  // 查看医嘱信息
  onLook (record) {
    let orderid = record.orderid;
    let ordertype = record.ordertype;
    let params = {
      url: 'BuOrderController/getData',
      data: {
        orderid: orderid
      }
    };
    let that = this;
    function success(res) {
      let data = res.data.ordercontent;
      let listData = data.split('、');
      if (ordertype == 1) {             // 检验
        that.handleExaminationClick()
      } else if (ordertype == 2) {      // 检查
        that.handleInspectionClick()
      } else if (ordertype == 3) {      // 中药
        that.handleChHerbalMedClick()
      } else if (ordertype == 4) {      // 中成药/西药
        that.handleChPatentMedClick()
      } else if (ordertype == 5) {      // 中医适宜技术
        that.handleSuitTechClick()
      } else if (ordertype == 6) {      // 西医
        that.handleWesternMedClick()
      } else if (ordertype == 7) {      // 材料
        that.handleMaterialClick()
      }
    };
    getResource(params, success);
  }
  onView(orderid, ordertype){
    console.log('医嘱ref' , this.chHerbalMedicine);
    this.setState({
      actionType: 'view',
      orderid: orderid
    },()=>{
      switch(ordertype){ // 根据不同的医嘱类型进入不同的修改界面
        case 3:
          this.chHerbalMedicine.handlePopOpen();
          break;
        default :
        console.log('没有想匹配的医嘱类型');
      }
    });
  };
  // 打印
  onType (record) {

  }
  // 中药弹框显示
  handleChHerbalMedClick = () => {
    this.chHerbalMedicine.handlePopOpen()
  };
  // 中药弹框关闭
  visiblePopHerbal () {
    this.chHerbalMedicine.handlePopClose()
  }
  // 中成药/西药弹框显示
  handleChPatentMedClick() {
    this.chPatentMedicine.handlePopOpen()
  };
  // 中成药/西药弹框关闭
  visiblePopPatent () {
    this.chPatentMedicine.handlePopClose()
  }
  // 中医适宜技术弹框显示
  handleSuitTechClick = () => {
    this.suitTechnology.handlePopOpen()
  }
  // 中医适宜技术弹框关闭
  visiblePopSuit () {
    this.suitTechnology.handlePopClose()
  }
  // 检验弹框显示
  handleExaminationClick = () => {
    this.examination.handlePopOpen()
  }
  // 检验弹框关闭
  visiblePopExamination () {
    this.examination.handlePopClose()
  }
  // 检查弹框显示
  handleInspectionClick = () => {
    this.inspection.handlePopOpen()
  }
  // 检查弹框关闭
  visiblePopInspection () {
    this.inspection.handlePopClose()
  }
  // 西医治疗弹框显示
  handleWesternMedClick = () => {
    this.westernMedicine.handlePopOpen()
  }
  // 西医治疗弹框关闭
  visiblePopWestern () {
    this.westernMedicine.handlePopClose()
  }
  // 材料弹框显示
  handleMaterialClick = () => {
    this.material.handlePopOpen()
  }
  // 材料弹框关闭
  visiblePopMaterial () {
    this.material.handlePopClose()
  }
  // 中医辨证论治弹框显示
  handleInteligenceClick = () => {
    let params = {
      type: 'GET',
      async : true,
      url: 'BuDiagnosisInfoController/getData',
      contentType: '',
      data:{
        registerid:window.registerID
      }
    };
    let that = this;
    function success(res){
      console.log('挂号****',res)
      that.setState({
        treatcode: res.data
      },function(){
        let t = this.state.treatcode;
        if(t != ""){
          this.inteligentTreat.handlePopOpen(t)
        } else {
          alert('d')
        }
      })
    };
    function error(res){
        console.log('获取挂号Id失败');
    };
    getResource(params, success, error);
  }
  // 中医辨证论治弹框关闭
  visiblePopInteligence () {
    this.inteligentTreat.handlePopClose()
  }
  //辨证论治组件“添加医嘱”按钮显示中药
  loadClick (buOrderDtlList,type) {
    console.log('弹出中草药',buOrderDtlList,type)
    if (type == 1) {
      this.chHerbalMedicineInteligentTreat.handlePopOpen(buOrderDtlList,type)
    } else if (type == 2) {
      this.chPatentMedicine.handlePopOpen(buOrderDtlList,type)
    } else if (type == 3) {
      this.suitTechnology.handlePopOpen(buOrderDtlList,type)
    }

  }
  /** [getColumn 设置表格项目] */
  getColumn(){
    let columns = [{
        title: "序号",
        dataIndex: 'order',
        key: 'order',
        render: (text, record, index) => index
      },
      {
        title: "医嘱类型",
        dataIndex: 'ordertypeDic',
        key: 'ordertypeDic',
      },
      {
        title: "医嘱内容（药单 / 治疗方法 / 检验、检查项目）",
        dataIndex: 'ordercontent',
        key: 'ordercontent',
      },
      {
        title: "价格（元）",
        dataIndex: 'feeall',
        key: 'feeall',
      },
      {
        title: "医生",
        dataIndex: 'orgUsername',
        key: 'orgUsername',
      },
      {
        title: "开立日期",
        dataIndex: 'utstamp',
        key: 'utstamp',
      },
      {
        title: "状态",
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => record.orderstate == 1 ? <DonePay>• 待缴费</DonePay> : <ToPay>• 已缴费</ToPay>
      },
      {
        title: "打印状态",
        dataIndex: 'printstateDic',
        key: 'printstateDic',
      },
      {
        title: "操作",
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => (
          <div key={index}>
            <OperationCell onClick={() => { this.onType(text, index, record) }}>打印</OperationCell> &nbsp;| &nbsp;
            <OperationCell onClick={() => { this.actionManager('view', record) }}>查看</OperationCell> &nbsp;| &nbsp;
            <OperationCell onClick={() => { this.actionManager('modify', record) }}>修改</OperationCell> &nbsp;| &nbsp;
            <OperationCell onClick={() => { this.actionManager('delete', record) }}>删除</OperationCell>
          </div>
        )
      }
    ];
    return columns;
  };
  /**
   * [actionManager 动作管理函数，添加、删除、修改、查看]
   * @param  {[type]} actionType [动作类型，添加、删除、修改、查看]
   * @param  {[type]} orderid    [携带数据(包含操作目标)]
   * @return {[type]}            [void]
   */
  actionManager(actionType, record){
    let that = this;
    if(actionType == 'delete'){ // 删除操作
      that.onDelete(record.orderid)
      return;
    }
    else{ // 添加、修改、查看操作
      that.setState({
        actionType: actionType, // modify、view、add
        orderid: record.orderid, // 当前医嘱ID
      }, ()=>{
        // console.log('医嘱对象', record.ordertype);
        switch (record.ordertype) {
          case 3: // 草药
            that.chHerbalMedicine.handlePopOpen();
          break;
          case 4: // 中成药、西药
            that.chPatentMedicine.handlePopOpen();
          break;
          case 5: // 中医适宜技术
            that.suitTechnology.handlePopOpen();
          break;
          default:
            console.log('未找到该类型医嘱');
        }
      });
    }
  };
  testPagination(){
    let currentPage = this.state.currentPage;
    currentPage++;
    // this.setState({ currentPage });
  };
  render() {
    let { dataSource, selectedRowKeys, tatalRecords, currentPage, actionType, orderid  } = this.state;
    let columns = this.getColumn();
    let that = this;
    let rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        that.setState({
          selectedRowKeys
        });
      }
    };
    let pagination = {
      total: tatalRecords, // 总的记录数
      defaultCurrent: currentPage, // 当前页
      current: currentPage, // 当前页
      pageSize: pageSize, // 每页记录数
      onChange:(nextPage, pageSize) => {
        that.getData(nextPage);
      },
    };
    let openProps = {
      actionType: actionType,
      orderid: orderid ,
      reloadList: this.getData
    };
    return (
      <div>
        <AddHeader>
          <AddQuickly>➕快速添加：</AddQuickly>
          <AddList>
            <ListItem onClick={()=>{this.testPagination()}} >🔬检验</ListItem>
            <Line>|</Line>
            <ListItem onClick={this.handleInspectionClick} >📷检查</ListItem>
            <Line>|</Line>
            <ListItem onClick={() => {this.actionManager('add', {orderid: '', ordertype: 3})}} >
              <ListItemIcon src={herbalIcon} />中药
            </ListItem>
            <Line style={styles.line} >|</Line>
            <ListItem onClick={() => {this.actionManager('add', {orderid: '', ordertype: 4})}} > 💊中成药/西药</ListItem>
            <Line>|</Line>
            <ListItem onClick={() => {this.actionManager('add', {orderid: '', ordertype: 5})}} > 🍯中医适宜技术</ListItem>
            <Line>|</Line>
            <ListItem onClick={this.handleWesternMedClick} > 💉西医治疗</ListItem>
            <Line>|</Line>
            <ListItem onClick={this.handleMaterialClick} >  🏮材料</ListItem>
          </AddList>
          <AddRight>
            <AutoTreat onClick={this.handleInteligenceClick}>👁中医辨证论治</AutoTreat>
          </AddRight>
        </AddHeader>
        <SpecTable
          locale={{emptyText: '暂无医嘱数据' }}
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}>
        </SpecTable>
        <ChHerbalMedicine {...openProps} ref={ref => {this.chHerbalMedicine = ref}} />
        <ChPatentMedicine {...openProps} ref={ref => {this.chPatentMedicine = ref}} />
        <SuitTechnology {...openProps} ref={ref => {this.suitTechnology = ref}} />
        {
          // <ChHerbalMedicineInteligentTreat wrappedComponentRef={ref => {this.chHerbalMedicineInteligentTreat = ref}} reloadList = {this.getData} />
        }
        <Examination visiblePopExamination={this.visiblePopExamination} wrappedComponentRef={ref => this.examination = ref} reloadList = {this.getData} />
        <Inspection visiblePopInspection={this.visiblePopInspection} wrappedComponentRef={ref => this.inspection = ref} reloadList = {this.getData} />
        <WesternMedicine visiblePopWestern={this.visiblePopWestern} wrappedComponentRef={ref => this.westernMedicine = ref} reloadList = {this.getData} />
        <Material visiblePopMaterial={this.visiblePopMaterial} wrappedComponentRef={ref => this.material = ref} reloadList = {this.getData} />
        <InteligentTreat loadClick={this.loadClick.bind(this)} visiblePopInteligence={this.visiblePopInteligence} ref={ref => this.inteligentTreat = ref} />
      </div>
    )
  }
}
const AddHeader = styled.div`
  overflow: hidden;
  margin-top: 7px;
  padding-left: 24px;
`;
const AddQuickly = styled.p`
  float: left;
  font-size: 12px;
  margin-bottom: 10px;
  margin-right: 16px;
`;
const AddList = styled.ul`
  float: left;
  overflow: hidden;
  font-size: 12px;
  color: #999999;
`;
const ListItem = styled.li`
  float: left;
  list-style: none;
  color: #333;
  cursor: pointer;
`;
const Line = styled.i`
  display: inline-block;
  float: left;
  margin: 0px 10px;
  color: #999999
`;
const ListItemIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-top: -2px;
`;
const AddRight = styled.div`
  float: right;
  font-size: 12px;
`;
const AutoTreat = styled.p`
  float: left;
  color: #FF0000;
  cursor: pointer
`;
const OperationCell = styled.i`
  color: #0a6ecb;
  cursor: pointer;
`;
const ToPay = styled.span`
  color: #009900
`;
const DonePay = styled.span`
  color: #0A6ECB
`;
const SpecTable = styled(Table)`
  /*  表格头部样式  */
  .ant-table-thead tr th {
    background: #f2f2f2;
    border-top: 1px solid #dddddd;
  }
`;
const styles = {
  status0: {
    color: '#009900'
  },
  status1: {
    color: '#0A6ECB'
  },
  autoTreat: {

  },
};

/*
@作者：马晓敏
@日期：2018-06-26
@描述：医嘱管理页面
*/
