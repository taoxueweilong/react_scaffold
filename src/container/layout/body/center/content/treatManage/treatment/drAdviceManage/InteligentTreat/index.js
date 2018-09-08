import React, { Component } from 'react';
import { Tabs, Table, Menu, Dropdown, Icon, Row, Col } from 'antd';
import BasePop from 'components/popout/basePop';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import 'components/antd/style/select.less';
import 'components/antd/style/table.css';
import daibiao from "../imgs/daibiao.png";
import './index.less'
import getResource from 'commonFunc/ajaxGetResource2';

const TabPane = Tabs.TabPane;

export default class InteligentTreat extends Component {
  constructor(props) {
    super(props);
    // console.log('1',this.props)
    this.state = {
      dataSource6: [
        {
          key: 1,
          id: 1,
          ill: '感冒/风热感冒',
          prescription: '金银花处方',
          single: '金银花、连翘、薄荷、荆芥、淡豆鼓、牛蒡厂、桔梗、淡竹叶、甘草',
          treatment: 1
        },
        {
          key: 2,
          id: 2,
          ill: '感冒/风热感冒',
          prescription: '银翘散',
          single: '连翘、银花、桔梗、薄荷、竹叶、生甘草、荆芥穗、淡豆豉、牛蒡子',
          treatment: 1
        },
        {
          key: 3,
          id: 3,
          ill: '高血压/原发性高血压',
          prescription: '黄精秘法',
          single: '黄精、夏菇草、益母草、车前草、狶签草',
          treatment: 1
        },
        {
          key: 4,
          id: 4,
          ill: '高血压/原发性高血压',
          prescription: '菊花秘法',
          single: '菊花、白芍、炒黄芩、玄参、怀牛漆、石决明、葛根、龙胆草、草决明、甘草',
          treatment: 0
        },
        {
          key: 5,
          id: 5,
          ill: '高血压/原发性高血压',
          prescription: '天麻秘法',
          single: '天麻、钩藤、木瓜、萆薢、当归、白芍、黄芩、牛膝、僵蚕、松节、威灵仙',
          treatment : 0
        }
      ],
      dataSourceAlert: [
        {
          key: 1,
          ill: '头晕、呕吐',
          project: '龙骨（+）、薄荷（+）'
        },
        {
          key: 2,
          ill: '扁桃体发炎',
          project: '连翘（-）'
        },
        {
          key: 3,
          ill: '头晕、呕吐',
          project: '龙骨（+）、薄荷（+）'
        },
        {
          key: 4,
          ill: '扁桃体发炎',
          project: '连翘（-）'
        },
        {
          key: 5,
          ill: '头晕、呕吐',
          project: '龙骨（+）、薄荷（+）'
        }
      ],
      dataSource: [],//中草药表格
      clistLength: '',
      diagnosename: '',//诊断
      buOrderDtlList: [],//点击添加弹框列表
      proprietaryChineseMedicine: [],
      appropriateTechnologies: [],
      visiblePop: false,  // 控制弹框显示隐藏
      statusValue: 1,
      addDeleteData: [],
      dataSourceChineseMedicine: [],//中成药表格
      plistLength: '',
      chineseMedicineAdd: [],//中成药的“添加”
      type: '',//医嘱类型 1：中草药 2：中成药 3：适宜技术
      dataSourceAppropriateTechnologies: [],//适宜技术表格
      slistLength: '',
      appropriateTechnologiesAdd: [],//适宜技术的“添加”
    }
  }

  getStatusValue(statusValue){
    this.setState({
      statusValue: statusValue
    });
  };

  // 序号
  setOrderNo (value, record, index) {
    return <span>{index+1}</span>
  }

  // 序号
  setOrderNo1 (value, record, index) {
    return <span>{index+1}</span>
  }

  // 序号
  setOrderNo2 (value, record, index) {
    return <span>{index+1}</span>
  }

  // 临症加减
  cellStatus (value, record, index) {
    if (record.priors == 1) {
      return <span>是</span>
    } else {
      return <span>否</span>
    }
  }

  // 弹框显示
  handlePopOpen (t) {
    window.t = t;
    console.log('bu',window.t)
    let tc = JSON.stringify(t);
    this.setState({
      visiblePop: true
    }, function(){
      let params = {
        type: 'GET',
        async : true,
        url: 'TCMAE/api/Imtreatprelist/GetImtreatList',
        contentType: '',
        data: {
          bu: tc
        }
      };
      let that = this;
      function success(res){
        let dataSource = res.data.clist.map((item, index)=>{
          item.key = index; // 加唯一key值
          return item
        });
        let dataSourceChineseMedicine = res.data.plist.map((item, index)=>{
          item.key = index; // 加唯一key值
          return item
        });
        let dataSourceAppropriateTechnologies = res.data.slist.map((item, index)=>{
          item.key = index; // 加唯一key值
          return item
        });
        that.setState({dataSource});
        that.setState({dataSourceChineseMedicine});
        that.setState({dataSourceAppropriateTechnologies});
        that.setState({
          clistLength: res.data.clist.length,
          plistLength: res.data.plist.length,
          slistLength: res.data.slist.length
        })
      };

      function error(res){
          console.log('中草药获取失败');
      };
      getResource(params, success, error);
    });
  };

  // 弹框关闭
  handlePopClose () {
    this.setState({
      visiblePop: false,
      statusValue: 1
     });
  };

  // 生成医嘱
  handleSureClick () {

  }

//操作-添加
operationCell(value, record, index) {
  //console.log('caozuo',value,record,index)
  let priors = record.priors;
  let preName = record.preName;
  let drugName = record.drugName;
  //console.log('priors',record.priors)
  let dataSourceAlert = this.state.dataSourceAlert;
  const menu = (
    <div style={styles.AlertTableWrap}>
      <div className="gutter-example">
        <Row gutter={16}>
          <Col className="gutter-row" span={1}>
            <div className="gutter-box"><img className="jiantou" src={daibiao}/></div>
          </Col>
          <Col className="gutter-row" span={5}>
            <div className="gutter-box">{preName}</div>
          </Col>
          <Col className="gutter-row" span={15}>
            <div className="gutter-box">{drugName}</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="gutter-box"><Button onClick={() => { this.handleAddDropdown(value, index, record) }}  style={styles.operationCellAlert}>+添加</Button></div>
          </Col>
        </Row>
      </div>
      <Table style={styles.tableWrap}
      dataSource={this.state.addDeleteData}
      onHeaderRow={(column) => { this.onHeaderRow() }}
    >
        <Table.Column title="病情" dataIndex="severity" align='center' />
        <Table.Column title="临症加减项目" dataIndex="drugNamesList" align='center'/>
        <Table.Column title="操作" render={this.operationCellAlert.bind(this)} align='center'/>
      </Table>
  </div>
  );
  if (priors == 1) {
    return (
      <Dropdown onClick={() => { this.onClickDropdown(value, index, record) }} className="dropDown" overlay={menu} trigger={['click']}>
        <Button style={styles.operationCell}>+添加</Button>
      </Dropdown>
    )
  } else {
    return (
      <div key={index}>
        <Button onClick={() => { this.handleAdd(value, index, record) }} style={styles.operationCell}>+添加</Button>
      </div>
    )
  }
}

//添加-根据"是"临症加减跳转不同页面
onClickDropdown(value, record, index) {
  window.index = index;
  var ilId = index.itId;
  console.log('IlIdshi',index.itId)
  let params = {
    type: 'GET',
    async : true,
    url: 'TCMAE/api/Impluslist/GetImpluslist',
    contentType: '',
    data: {
      IlId: ilId
    }
  };
  let that = this;
  function success(res){
    console.log('临症加减',res)
    let addDeleteData = res.data.map((item, index)=>{
      item.key = index; // 加唯一key值
      return item
    });
    that.setState({addDeleteData});
  };

  function error(res){
      console.log('临症加减获取失败');
  };
  getResource(params, success, error);
}

//添加-根据"否"临症加减跳转不同页面
handleAdd(value, record, index) {
  window.index = index;
  var bu = JSON.stringify(window.t);
  var IlId = index.ilId;
  var type = index.type;
  var imtreatprelist = JSON.stringify(window.index);
  console.log('window.index###',window.index)
  let params = {
    type: 'GET',
    async : true,
    url: 'TCMAE/api/scheme/getcmdrugs',
    contentType: '',
    data: {
      bu: bu,
      IlId: IlId,
      imtreatprelist: imtreatprelist
    }
  };
  let that = this;
  function success(res){
    console.log('添加成功',res)
    that.setState({
      buOrderDtlList: res.data.baHerbalMedicines ,//添加列表
    }, function(){
      console.log('buOrderDtlListbuOrderDtlList',this.state.buOrderDtlList)
      var buOrderDtlList = this.state.buOrderDtlList;
      this.handlePopClose();
      this.props.loadClick(buOrderDtlList,type);
    })
  };

  function error(res){
      console.log('添加失败');
  };
  getResource(params, success, error);
}

//下拉框数据临症加减“是”的添加操作
operationCellAlert(value, index, record) {
  return (
    <div key={index}>
      <Button style={styles.operationCellAlert} onClick={() => { this.handleAddDropdown(value, record, index) }}>+添加</Button>
    </div>
  )
}

handleAddDropdown(value, record, index){
  var bu = JSON.stringify(window.t);
  var IlId = index.ilId;
  var type = index.type;
  var imtreatprelist = JSON.stringify(window.index);
  console.log('value',index)
  let params = {
    type: 'GET',
    async : true,
    url: 'TCMAE/api/scheme/getcmdrugs',
    contentType: '',
    data: {
      bu: bu,
      IlId: IlId,
      imtreatprelist: imtreatprelist
    }
  };
  let that = this;
  function success(res){
    console.log('添加成功',res)
    that.setState({
      buOrderDtlList: res.data.baHerbalMedicines ,//添加列表
    }, function(){
      console.log('buOrderDtlListbuOrderDtlList',this.state.buOrderDtlList)
      var buOrderDtlList = this.state.buOrderDtlList;
      this.handlePopClose();
      this.props.loadClick(buOrderDtlList,type);
    })
  };

  function error(res){
      console.log('添加失败');
  };
  getResource(params, success, error);
}

// 操作
operationCellSecond(value, record, index) {
  return (
    <div key={index}>
      <i style={styles.operationCellSecond} onClick={() => { this.handleAdd(value, record, index) }}>修改</i> &nbsp;| &nbsp;
      <i style={styles.operationCellSecond} onClick={() => { this.onDelete(value, record, index) }}>删除</i>
    </div>
  )
}

//中成药-操作
operationCellChineseMedicine(value, record, index){
  return (
    <div key={index}>
      <Button onClick={() => { this.handleAddChineseMedicine(value, index, record) }} style={styles.operationCell}>+添加</Button>
    </div>
  )
}

//中成药-操作-添加
handleAddChineseMedicine(value, index, record) {
  this.setState({
    chineseMedicineAdd: record
  }, function(){
    var bu = JSON.stringify(window.t);
    var imtreatprelist = JSON.stringify(this.state.chineseMedicineAdd);
    var type = record.type;
    let params = {
      type: 'GET',
      async : true,
      url: 'TCMAE/api/scheme/getCpm',
      contentType: '',
      data: {
        bu: bu,
        imtreatprelist: imtreatprelist
      }
    };
    let that = this;
    function success(res){
      console.log('添加成功',res)
      that.setState({
        buOrderDtlList: res.data.medicines ,//添加列表
      }, function(){
        console.log('buOrderDtlListbuOrderDtlList',this.state.buOrderDtlList)
        var buOrderDtlList = this.state.buOrderDtlList;
        this.handlePopClose();
        this.props.loadClick(buOrderDtlList,type);
      })
    };

    function error(res){
        console.log('添加失败');
    };
    getResource(params, success, error);
  })
  
}

//适宜技术-操作
operationCellAppropriateTechnologies(value, index, record){
  return (
    <div key={index}>
      <Button onClick={() => { this.handleAddAppropriateTechnologies(value, index, record) }} style={styles.operationCell}>+添加</Button>
    </div>
  )
}

handleAddAppropriateTechnologies(value, index, record){
  this.setState({
    appropriateTechnologiesAdd: index
  }, function(){
    var bu = JSON.stringify(window.t);
    var imtreatprelist = JSON.stringify(this.state.appropriateTechnologiesAdd);
    var type = index.type;
    let params = {
      type: 'GET',
      async : true,
      url: 'TCMAE/api/scheme/getSt',
      contentType: '',
      data: {
        bu: bu,
        imtreatprelist: imtreatprelist
      }
    };
    //let that = this;
    function success(res){
      console.log('添加成功',res)
      // that.setState({
      //   buOrderDtlList: res.data.medicines ,//添加列表
      // }, function(){
      //   console.log('buOrderDtlListbuOrderDtlList',this.state.buOrderDtlList)
      //   var buOrderDtlList = this.state.buOrderDtlList;
      //   this.handlePopClose();
      //   this.props.loadClick(buOrderDtlList,type);
      // })
    };

    function error(res){
        console.log('添加失败');
    };
    getResource(params, success, error);
  })
}

onHeaderRow(column, index) {

}

callback(key) {
  //console.log(key);
}

eachday(value, record, index) {
  console.log('value, record, index',value, record, index)
}

  render() {
    let { visiblePop, dataSource, dataSourceChineseMedicine, dataSourceAppropriateTechnologies, dataSourceTable, dataSource6 } = this.state;
    var cLength = this.state.clistLength;
    var cName = "中草药"+cLength;
    return (
      <div>
        <BasePop visible={visiblePop} title="智能诊疗" onClose={() => this.handlePopClose()}>
          <div style={styles.wrap}>
            <div>
              <div style={styles.regulars}>
              <p style={styles.pFont}>患者姓名：<span style={styles.spanFont}>刘德华</span>&nbsp;&nbsp;&nbsp;&nbsp; 性别：<span style={styles.spanFont}>男</span>&nbsp;&nbsp;&nbsp;&nbsp; 年龄：38&nbsp;&nbsp;&nbsp;&nbsp; 移动电话：<span style={styles.spanFont}>1396959789</span>
              </p>
              </div>
              <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} style={styles.tabStyle}>
                <TabPane tab={cName} key="1">
                  <div style={styles.tabLine}></div>
                  <Table style={styles.tableWrap}
                    dataSource={dataSource}
                    onHeaderRow={(column) => { this.onHeaderRow() }}
                  >
                    <Table.Column key="ill" title="序号" dataIndex="ill" render={this.setOrderNo.bind(this)} />
                    <Table.Column key="treatname" title="疾病/病候" dataIndex="treatname" />
                    <Table.Column key="preName" title="代表处方" dataIndex="preName" />
                    <Table.Column key="drugName" title="药单" dataIndex="drugName" />
                    <Table.Column key="priors" title="临症加减" dataIndex="priors" render={this.cellStatus.bind(this)} />
                    <Table.Column title="操作" render={this.operationCell.bind(this)} />
                  </Table>
                </TabPane>
                <TabPane tab="中成药（12）" key="2">
                  <Table style={styles.tableWrap}
                      dataSource={dataSourceChineseMedicine}
                      onHeaderRow={(column) => { this.onHeaderRow() }}
                    >
                    <Table.Column key="ill" title="序号" render={this.setOrderNo1.bind(this)} />
                    <Table.Column key="treatname" title="疾病/病候" dataIndex="treatname" />
                    <Table.Column key="cpmName" title="代表处方" dataIndex="cpmName" />
                    <Table.Column key="eachday" title="药单/治疗方法" dataIndex="freqname" />
                    <Table.Column title="操作" render={this.operationCellChineseMedicine.bind(this)} />
                  </Table>
                </TabPane>
                <TabPane tab="适宜技术（5）" key="3">
                  <Table style={styles.tableWrap}
                      dataSource={dataSourceAppropriateTechnologies}
                      onHeaderRow={(column) => { this.onHeaderRow() }}
                    >
                    <Table.Column title="序号" render={this.setOrderNo1.bind(this)} />
                    <Table.Column key="treatname" title="疾病/病候" dataIndex="treatname" />
                    <Table.Column key="stName" title="特色治疗项目" dataIndex="stName" />
                    <Table.Column key="position" title="治疗方法" dataIndex="position" />
                    <Table.Column title="操作" render={this.operationCellAppropriateTechnologies.bind(this)} />
                  </Table>
                </TabPane>
              </Tabs>
            </div>
            {/* <div>
              <p style={styles.zhenliaofangan}><span>🔘</span>我的诊疗方案</p>
              <div style={styles.wodezhenliao}></div>
              <Table style={styles.tableWrap}
                      dataSource={dataSourceTable}
                      onHeaderRow={(column) => { this.onHeaderRow() }}
                    >
                    <Table.Column title="序号" dataIndex="id" />
                    <Table.Column title="诊疗方案类型" dataIndex="treatmentType" />
                    <Table.Column title="诊疗方案名称" dataIndex="treatmentName" />
                    <Table.Column title="药单/治疗方法" dataIndex="single" />
                    <Table.Column title="医生" dataIndex="doctor" />
                    <Table.Column title="开立日期" dataIndex="startTime" />
                    <Table.Column title="操作" render={this.operationCellSecond.bind(this)} />
                  </Table>
            </div> */}
          </div>
          <div style={styles.footer}>
            <Button type="primary" style={styles.bt} className='semicircle' onClick={this.handleSureClick.bind(this)} >生成医嘱</Button>
            <Button type="primary" style={styles.bt} className='cancelBtn' onClick={this.handlePopClose.bind(this)} >取消</Button>
          </div>
        </BasePop>
      </div>
    )
  }
}

const styles = {
  wrap: {
    width: '857px',
    height: '548px',
    overflow: 'hidden',
    padding: '10px'
  },
  operationCell: {
    color: '#0a6ecb',
    cursor: 'pointer',
  },
  status1: {
    color: '#009900'
  },
  status0: {
    color: '#0A6ECB'
  },
  addQuickly: {
    float: 'left',
    fontSize: '12px',
    color: '#333333',
    width: '80px',
    height: '30px',
    lineHeight: '42px'
  },
  line: {
    float: 'left',
    width: '1px',
    height: '20px',
    background: '#999999',
    marginTop: '14px '
  },
  tableWrap: {
    marginTop: '20px',
  },
  footer: {
    width: '100%',
    position: 'absolute',
    height: '56px',
    bottom: '0',
    borderTop: '1px solid #E6E6E6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bt: {
    margin: 20
  },
  wrap: {
    width: '870px',
    overflow: 'hidden',
    padding: '10px'
  },
  tabStyle: {
    //backgroundColor:'#d7d7d7'
  },
  operationCell: {
    backgroundColor: '#0a6ecb',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '16px'
  },
  operationCellSecond: {
    color: '#0a6ecb',
    cursor: 'pointer',
  },
  operationCellAlert: {
    backgroundColor: '#66cc00',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '16px'
  },
  status1: {
    color: '#009900'
  },
  status0: {
    color: '#0A6ECB'
  },
  addQuickly: {
    float: 'left',
    fontSize: '12px',
    color: '#333333',
    width: '80px',
    height: '30px',
    lineHeight: '42px'
  },
  line: {
    float: 'left',
    width: '1px',
    height: '20px',
    background: '#999999',
    marginTop: '14px '
  },
  tabLine:{
    backgroundColor: '#d7d7d7',
    border: '1px inset'
  },
  // zhenliaofangan: {
  //   color: 'black'
  // },
  // wodezhenliao: {
  //   border:'1px solid',
  //   width:'10em',
  //   color:'#0A6ECB'
  // },
  regulars: {
    width: '432px',
    height: '38px',
    backgroundColor:'rgb(249, 249, 249)',
    border: '1px solid rgba(228, 228, 228, 1)',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    zIndex: '1',
    zIndex: '1',
    marginBottom: '-4%',
    marginLeft: '51%',
    display: 'flex'
  },
  pFont: {
    fontSize: '12px',
    color: '#666666',
    alignSelf: 'center',
    marginLeft: '7%'
  },
  spanFont: {
    color: '#0A6ECB'
  },
  AlertTableWrap: {
    backgroundColor: '#f2f2f2'
  }
}


/*
@作者：王崇琨
@日期：2018-07-22
@描述：辨证论治父容器
*/
