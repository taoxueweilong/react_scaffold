import React, { Component } from 'react';
import { Table, Form, Tag, Select, Radio } from 'antd';
import getResource from 'commonFunc/ajaxGetResource';
import BasePop from 'components/popout/basePop';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import QuickAddHerb from './quickAddHerb';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import 'components/antd/style/select.less';
import 'components/antd/style/form.less';
import 'components/antd/style/table.css';
import Input from 'components/dr/input';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class Index extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visiblePop: false,  // 控制弹框显示隐藏
      tagData: [],   // 组套名称数组
      dataSource: [], // 组套明细数组
      value: 1,     // 默认选择医保内
    }
  }

  // 弹框显示
  handlePopOpen () {
    this.setState({ visiblePop: true });
  };

  // 弹框关闭
  handlePopClose () {
    this.setState({ visiblePop: false });
  };

  // 缴费状态
  cellStatus (value, record, index) {
    //console.log(value,record,index, "状态OK")
    if (record.statusValue) {
      return <span style={styles.status1}>• 已缴费</span>
    } else {
      return <span style={styles.status0}>• 待缴费</span>
    }
  }

  // 操作
  operationCell (value, index, record) {
    return (
      <div key={index}>
        <i style={styles.operationCell} onClick={() => { this.onDelete(value, index, record) }}>删除</i>
      </div>
    )
  }

  // 添加处方列表
  getQuickData (quickAddData) {
    let dataSource = this.state.dataSource;
    let tagData = this.state.tagData;
    tagData.push(quickAddData)
    tagData.map((item, index) => {
      item.key = index;
      return item;
    })
    let arr = quickAddData.baMedicalDtlList;
    arr.map((item, index) => {
      dataSource.push(item);
    })
    dataSource.map((item, index) => {
      item.key = index;
      return item;
    })
    this.setState({ dataSource, tagData })
  }

  // 删除草药
  onDelete (index) {
    let arr = this.state.dataSource;
    arr.splice(index,1)
    this.setState({
      dataSource: arr
    })
  }

  // 保存
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('herbal values', values)
      let dataSource = this.state.dataSource;
      let nameArr = [];
      let medicineArr = dataSource.map((item, index) => {
        nameArr.push(item.medicalname)
        item.itemname = item.medicinename;
        item.unitprice = item.unitprice;
        item.count = item.defQty;
        item.doseid = item.doseid;
        item.specification = item.specification;
        item.dosename = item.dosename;
        item.baseUnit = item.baseUnit;
        item.useflag = item.useflag;
        return item;
      })
      let prescriptionContent = nameArr.join('、')
      let patientId = window.patientID;
      let patientName = window.patientName;

      let freqname = values.frequency;
      let usagename = values.treatMethods;
      let paramsData = {
        parientid: patientId,  // 患者ID
        registerid: '201832424728142114', // 挂号ID
        parientname: patientName,  // 患者姓名
        ordertype: '2',   // 医嘱类型
        ordercontent: prescriptionContent, // 医嘱内容
        orderstate: '1',  // 缴费状态
        buRecipe: { // 表单数据
          recipetype: 1,
          diagnosename: values.diagnosename,  // 诊断名称
          registerid: '201832424728142114', // 挂号ID
          freqname: values.frequency,   // 频次
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
        getResource(params, success);
      }
    });
  }

  // 序号
  setOrderNo (value, record, index) {
    return <span>{index+1}</span>
  }

  // 隐藏快速添加数据结果
  hidePop () {
    this.quickAddHerb.hideResult();
  };

  // 选择医保内和医保外改变时触发的回调函数
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  // 组套标签删除,同时将在组套明细删除
  log (item, index) {
    console.log('item, index',item, index)
    let tagData = this.state.tagData;
    let dataSource = this.state.dataSource;
    let tagDataArr = this.state.tagData;
    let dataSourceArr = this.state.dataSource;
    let deleteTagData = item;   // obj
    let deleteDataSource = item.baMedicalDtlList;   // array
    tagDataArr.map((item, index) => {
      if (item == deleteTagData) {
        tagData.splice(index, 1)
      }
    })
    dataSourceArr.map((item1, index1) => {
      deleteDataSource.map((item2, index2) => {
        if (item1 == item2) {
          dataSource.splice(index, 1) // (bug)
        }
      })
    })
    this.setState({ tagData, dataSource })
  }

  onHeaderRow (column, index) {

  }

  render () {
    let { visiblePop, dataSource, tagData } = this.state;
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
      <div>
        <BasePop visible={visiblePop} title='新增检查单' onClose={() => this.handlePopClose()}>
          <div style={styles.wrap}>
          <div style={styles.bodyTop} onClick={()=>{this.hidePop()}}>
              <Form className='customForm not-draggable' id='form'>
                <div style={styles.top}>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        {...formItemLayout}
                        colon={true}
                        label="诊断"
                        className='suit'
                      >
                      {getFieldDecorator('giagnosis', {
                        initialValue: '感冒/风热感冒'
                      })(
                        <Input icon='true'/>
                      )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        {...formItemLayout}
                        colon={true}
                        label="检查目的"
                        className='suit'
                      >
                      {getFieldDecorator('prescription', {
                        initialValue: '检查头部是否有损伤'
                      })(
                        <Input />
                      )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <div>
                        <p style={styles.addQuickly}>➕快速添加：</p>
                        <div style={styles.insuranceWrap}>
                          <RadioGroup value={this.state.value} onChange={this.onChange}>
                            <Radio value={1} style={styles.insuranceCheck} >医保内</Radio>
                            <Radio value={2} style={styles.insuranceCheck} >医保外</Radio>
                          </RadioGroup>
                        </div>
                        <div style={styles.line}></div>
                      </div>
                    </Col>
                    <Col span={16}>
                      <FormItem
                        wrapperCol={{span: 24}}
                        className='suit'
                      >
                      {getFieldDecorator('addQuickly')(
                        <QuickAddHerb placeholder='请输入治疗项目首字母快速添加' icon='true' ref={ref => this.quickAddHerb = ref} getQuickData = {this.getQuickData.bind(this)} />
                      )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        {...formItemLayout}
                        colon={true}
                        label="已选项目"
                        className='suit'
                      >
                      {getFieldDecorator('choosedItem', {
                        initialValue: ''
                      })(
                        <div>
                          {
                            tagData.map((item, index) => {
                              return (
                                <Tag closable onClose={this.log.bind(this, item, index)} 
                                style={styles.tag}>{item.orderSuitname}</Tag>
                              )
                            })
                          }
                        </div>
                      )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
                <Table
                  dataSource={dataSource}
                  onHeaderRow={(column) => { this.onHeaderRow() }}
                >
                  <Table.Column title="序号" render={this.setOrderNo.bind(this)} />
                  <Table.Column title="治疗项/治疗明细" dataIndex="medicalname" />
                  <Table.Column title="执行科室" dataIndex="deptname" />
                  <Table.Column title="数量/单位" dataIndex="baseUnit" />
                  <Table.Column title="单价" dataIndex="unitprice" />
                  <Table.Column title="金额" dataIndex="payMent" />
                  <Table.Column title="备注" dataIndex="medinsrem" />
                  <Table.Column title="状态" render={this.cellStatus.bind(this)} />
                  <Table.Column title="操作" render={this.operationCell.bind(this)} />
                </Table>
                <div style={styles.footer}>
                  <Button type="primary" onClick={this.handleSubmit.bind(this)} style={styles.bt} className='semicircle' >保存</Button>
                  <Button type="primary" style={styles.bt} className='cancelBtn' onClick={this.handlePopClose.bind(this)} >取消</Button>
                </div>
              </Form>
            </div>
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
  insuranceWrap: {
    float: 'left',
    fontSize: '12px',
    height: '26px',
    marginTop: '10px',
    borderBottom: '1px solid #e9e9e9'
  },
  insuranceCheck: {
    fontSize: '12px'
  },
  bodyTop: {
    marginBottom: '20px'
  },
  tag: {
    background: '#ffff99',
    height: '18px',
    borderRadius: '9px',
    marginTop: '12px',
    fontSize: '12px',
    lineHeight: '18px',
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
  }
};

const Inspection = Form.create()(Index);

export default Inspection;

/*
@作者：马晓敏
@日期：2018-07-16
@描述：新增检查部分
*/