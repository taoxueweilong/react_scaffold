import React, { Component } from 'react';
import { Form, Icon, Input, Select } from 'antd';
import styled from 'styled-components';
import BasePop from 'components/popout/basePop';
import getResource from 'commonFunc/ajaxGetResource';
import 'components/antd/style/table.css';
import 'components/antd/style/select.less';
import '../index.less';
import Addtip from '../../../imgs/addtip.png';

const Option = Select.Option;
const FormItem = Form.Item;

class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: [],
      visiblePop: false,
      focusIndex: '',
    };
  }
  componentDidMount () {
    this.getSpecialUsage()
  }
  // 输入框聚焦时，获取当前的下标index
  handleFocus (value, index) {
    //console.log('handleFocus',value, index)
    // this.setState({
    //   focusIndex: index
    // })
  }
  // 按下Enter键,光标定位到选择特殊用法上
  handleEnterPress = (e) => {
    let focusIndex = this.state.focusIndex;
    e.stopPropagation();
    if (e.keyCode == 13) {
      this.specialUsage.focus();
      // let dom = document.getElementsByClassName('specialUsage')[focusIndex];
      // dom.focus();
    }
  }
  // 选择特殊用法后，自动聚焦到快速搜索输入框
  selectChange () {
    let dom = document.getElementById('quickAddInput');
    dom.focus();
  }
  // 删除
  handleDelete = (value, index) => {
    this.props.onDelete(index)
  }
  // 修改草药剂量
  numberChange(value, index) {
    console.log('value, index', value, index)
  }
  // 获取特殊用法下拉数据
  getSpecialUsage() {
    let params = {
      url: 'BaUsageController/getList',
      data: {}
    };
    let that = this;
    function success(res) {
      let selectData = res.data.map((item, index)=>{
        item.key = index;
        return item;
      })
      that.setState({ selectData })
    };
    getResource(params, success);
  }
  // 点击加号添加草药
  handleAddClick () {
    this.setState({
      visiblePop: true
    })
  }

  // 关闭添加草药弹框
  handlePopClose () {
    this.setState({
      visiblePop: false
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let {selectData, visiblePop} = this.state;
    let dataSource = this.props.quickAddData;
    let baHerbalMedicines = this.props.baHerbalMedicines;
    let mergeArray = baHerbalMedicines.concat(dataSource);
    console.log('合并数组',mergeArray)
    return (
      <div>
        <ul style={styles.listWrap} className="listWrap">
          {
            mergeArray.map((value, index) => {
              console.log('%%%',value)
              if(value.exist == 0){
                return (
                  <ListItem key={index} className="listItem">
                    <p style={styles.closeIcon} className="closeIcon">
                      <Icon type="close" onClick={this.handleDelete.bind(this,index,value)} />
                    </p>
                    <div style={styles.conWrap}>
                      <h5 style={styles.name}>{value.medicinename}</h5>
                      <input type="text"  defaultValue={value.defQty}  autoFocus={index==dataSource.length?'autofocus':'none'}  onKeyDown={this.handleEnterPress}  onChange={this.numberChange.bind(this,value,index)} style={styles.numberInput} />
                      <p style={styles.unit}>{value.baseUnit==1 ? 'g':'g'}</p>
                    </div>
                    <Select className='listShow specialUsage'  ref={ref=>{ this.specialUsage = ref}} style={styles.select} onChange={this.selectChange.bind(this)} >
                      {
                        selectData.map((value, index) => {
                          return(
                            <Option key={index} value={index}>{value.usagename}</Option>
                          )
                        })
                      }
                    </Select>
                  </ListItem>
                )
              }else{
                return (
                  <ListItem key={index} className="listItem">
                    <p style={styles.closeIcon} className="closeIcon">
                      <Icon type="close" onClick={this.handleDelete.bind(this,index,value)} />
                    </p>
                    <div style={styles.conWrap}>
                      <h5 style={styles.name}>{value.medicinename}</h5>
                      <input type="text"  defaultValue={value.defQty}  autoFocus={index==dataSource.length?'autofocus':'none'}  onKeyDown={this.handleEnterPress}  onChange={this.numberChange.bind(this,value,index)} style={styles.numberInput} />
                      <p style={styles.unit}>{value.baseUnit==1 ? 'g':'g'}</p>
                    </div>
                    <Select className='listShow specialUsage'  ref={ref=>{ this.specialUsage = ref}} style={styles.select} onChange={this.selectChange.bind(this)} >
                      {
                        selectData.map((value, index) => {
                          return(
                            <Option key={index} value={index}>{value.usagename}</Option>
                          )
                        })
                      }
                    </Select>
                  </ListItem>
                )
              }
            })
          }
          <Add onClick = {this.handleAddClick.bind(this)}>+</Add>
          {
            mergeArray.length == 0 ? <TipWrap>
            <TipImg src={Addtip} />
            <TipTitle>处方中还没有添加草药</TipTitle>
            <TipText>请点击左侧➕号添加或者<br />通过<TipTextBlue>草药搜索框</TipTextBlue>快速添加</TipText>
          </TipWrap> : null
          }
        </ul>
        <BasePop visible={visiblePop} title='' onClose={() => this.handlePopClose()}>
          <PopWrap>
            <FormWrap>
              <Form>
                <FormItem className="add-herbal-pop"
                  {...formItemLayout}
                  label="草药"
                >
                    {getFieldDecorator('section', {
                    })(
                      <Select initialValue="1" >
                        <Option value="1">金银花</Option>
                        <Option value="2">连翘</Option>
                      </Select>
                    )}

                </FormItem>
                <FormItem className="add-herbal-pop not-draggable"
                  {...formItemLayout}
                  label="剂量"
                >
                  {getFieldDecorator('realName', {
                  })(
                    <Input type="user" />
                  )}
                </FormItem>
                <FormItem className="add-herbal-pop"
                  {...formItemLayout}
                  label="特殊用法"
                >
                    {getFieldDecorator('section', {
                    })(
                      <Select initialValue="1" >
                        <Option value="1">先煎</Option>
                        <Option value="2">泡服</Option>
                      </Select>
                    )}
                </FormItem>
              </Form>
            </FormWrap>
          </PopWrap>
        </BasePop>
      </div>
    )
  }
}

const ListItem = styled.li`
  margin: 0px;
  position: relative;
  list-style: none;
  width: 210px;
  height: 75px;
  float: left;
  color: #0a6ecb !important;
  font-size: 12px;
  text-align: center;
  background: #f2f2f2;
  margin-right: 5px;
  margin-bottom: 5px;
  &:hover {
    ${'' /* background-color: #fff;
    border: 1px solid #0a6ecb; */}
  }
  &:nth-child(4n): {
    margin-right: 0;
  }
`;
const Add = styled.p`
  font-size: 48px;
  line-height: 64px;
  color: #000;
  cursor: pointer;
  text-align: center;
  background: #f2f2f2;
  width: 210px;
  height: 75px;
  float: left;
`;
const PopWrap = styled.div`
  overflow: hidden;
  width: 100%;
  height: 280px;
  background: #f2f2f2;
`;
const FormWrap = styled.div`
  width: 590px;
  background: #f2f2f2;
  margin: 30px 0;
`;
const TipWrap = styled.div`
  width: 100%;
  position: absolute;
  top: 60px;
`;
const TipImg = styled.img`
  width: 109px;
  height: 130px;
  margin-left: 44%;
`;
const TipTitle = styled.div`
  font-size: 16px;
  color: #666666;
  text-align: center;
  line-height: 24px;
`;
const TipText = styled.p`
  font-size: 12px;
  color: #999999;
  text-align: center;
`;
const TipTextBlue = styled.i`
  color: #0A6ECB;
`;
const styles = {
  listWrap: {
    position: 'relative',
    top: '-5px',
    width: '857px',
    height: '320px',
    overflow: 'auto',
    scrollY: 'hidden',
    padding: 0,
    border: '1px solid #0a6ecb',
    background: '#fff',
  },
  closeIcon: {
    fontSize: '14px',
    color: '#cccccc',
    position: 'absolute',
    right: '5px',
    cursor: 'pointer'
  },
  conWrap: {
    overflow: 'hidden',
    marginLeft: '65px'
  },
  name: {
    float: 'left',
    color: '#0a6ecb',
    fontSize: '12px',
    lineHeight: '66px',
  },
  numberInput: {
    float: 'left',
    width: '40px',
    height: '20px',
    fontSize: '12px',
    background: 'none',
    outline: 'none',
    border: 'none',
    marginTop: '24px',
    marginLeft: '5px',
    textAlign: 'center',
    borderBottom: '1px solid #0a6ecb',
  },
  unit: {
    float: 'left',
    fontSize: '12px',
    color: '#0a6ecb',
    lineHeight: '66px',
  },
  select: {
    position: 'absolute',
    left: '0',
    bottom: '0',
  }
};

const ListShow = Form.create()(NormalLoginForm);
export default ListShow;

/*
@作者：马晓敏
@日期：2018-07-05
@描述：显示方式——方块儿排列
*/
