import React, {Component} from 'react';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import styled from 'styled-components';
import SelectPop from 'components/dr/selectPop';
import Up from 'components/antd/img/up.png';
import Down from 'components/antd/img/down.png';
import 'components/antd/style/button.css';
import 'components/antd/style/checkbox.less';
import 'components/antd/style/select.less';

export default class SelectHerb extends Component {
  constructor(props){
    super(props);
    this.state = {
      values: new Set(), //将选中的草药存入该数组
      showResult: false, // 是否展示
      selectedRowKeys: [], // 已选草药
      herbData: [], // 草药数据
    };
    this.showResult = this.showResult.bind(this);
    this.hideResult = this.hideResult.bind(this);
  };
  getTableCol(){
    const columns = [{
      title: '药名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record)=>{
        return <Checkbox onChange={(e)=>this.changeBox(e, record)} className='small' >{text}</Checkbox>;
      }
    }, {
      title: '药量',
      dataIndex: 'dose',
      key: 'dose',
    }, {
      title: '用法',
      dataIndex: 'usage',
      key: 'usage',
      render: (text, record, index)=>{
        let defaultValue = 'none';
        record.usage = defaultValue;
        return(
          <Select defaultValue={defaultValue} onChange={(e)=>{this.changeSelector(e, record)}} className='table_selector'>
            <Option value="none" >无</Option>
            <Option value="first">先煎</Option>
            <Option value="after">后煎</Option>
          </Select>
        )
      }
    }];
    return columns;
  };
  getHerbData(){
    const herbData = [{
      key: '1',
      name: '龙骨',
      dose: '20g',
    }, {
      key: '2',
      name: '生姜',
      dose: '20g',
    }, {
      key: '3',
      name: '薄荷',
      dose: '30g',
    }];
    this.setState({herbData});
  };
  showResult(){
    this.getHerbData();
    this.setState({
      showResult: true
    });
  };
  hideResult(){
    this.setState({
      showResult: false
    });
  };
  cancelResult = () => {
    console.log('取消');
    this.setState({
      showResult: false
    });
  };
  sureResult = () => {
    this.setState({
      showResult: false
    });
    console.log('选择的行', this.state.values);
  };
  changeBox(e, record){ // 改变复选框状态的时候触发的函数
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    let values = this.state.values;
    if(e.target.checked){ // 添加进数组
      values.add(record);
    }else{ // 从数组中删除
      values.delete(record);
    }
    this.setState({values});
  };
  changeSelector(e, record){ // 用法 下拉框改变时触发的函数
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    let values = this.state.values;
    values.forEach((item)=>{ // 遍历出当前行然后更新用法字段
      if(item.key == record.key){
        item.usage = e;
      }
    });
    this.setState({values});
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  render() {
    let { showResult , herbData } = this.state;
    let placeholder = this.props.placeholder;
    let columns = this.getTableCol();
    return (
      <SelectPop  placeholder={placeholder} displayed={this.showResult} showResult={showResult}>
      {
        showResult?
        (
          <Result>
            <div>
              <Table
                columns={columns}
                pagination={false}
                showHeader={false}
                dataSource={herbData} />
            </div>
            <Footer>
              <Button type="primary" className='semicircle small' onClick={this.sureResult}>确定</Button>
              <Button type="primary" className='cancel small' onClick={this.cancelResult}>取消</Button>
            </Footer>
          </Result>
        )
        :null
      }
      </SelectPop>
    );
  }
}
const Result = styled.div`
  position: absolute;
  width: 100%;
  min-height: 20px;
  z-index: 3;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  color: rgba(0,0,0,0.65);
  background: white
`;
const Line = styled.p`
  padding: 5px 12px;
  cursor: pointer;
  &:hover {
    background: #e6f7ff
  }
`;
const Footer = styled.div`
  background: rgba(242, 242, 242, 1);
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around
`;
/*
@作者：姜中希
@日期：2018-07-03
@描述：选择组件组件
*/
