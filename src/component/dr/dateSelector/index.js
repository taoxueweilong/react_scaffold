import React, {Component} from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import { today } from 'commonFunc/defaultData';
import 'moment/locale/zh-cn';
import 'components/antd/style/datePicker.less';

export default class DateSelector extends Component {
  constructor(props){
    super(props);
    this.state = {
      dateValue: today
    };
  };
  handleChange(dateValue){
    this.setState({
      dateValue: dateValue
    });
  };
  componentWillReceiveProps(nextProps){ // 当待接诊患者和已接诊患者单选按钮切换时将日期选择框恢复缺省值
    if(nextProps.disabled != this.props.disabled){
      this.setState({ dateValue: today });
    }
  };
  render() {
    let disabled = this.props.disabled;
    let dateValue = this.state.dateValue;
    return (
      <Container id='picker'>
        <Date >
          <DatePicker
            disabled={disabled}
            className='DateInputStl'
            dropdownClassName='dateDropDown'
            defaultValue={moment(today, 'YYYY-MM-DD')}
            value={moment(dateValue, 'YYYY-MM-DD')}
            allowClear={false}
            onChange={(value, dateValue)=>{this.handleChange(dateValue)}}
            format='YYYY-MM-DD'
          />
        </Date>
        <Search onClick={()=>{this.props.onSubmit(dateValue)}}>查询</Search>
      </Container>
    );
  }
}
const Container = styled.div`
  background-color: #FFFFFF;
  height: 28px;
  width: 146px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
`;
const Date = styled.div`
  padding: 5px;
  width: 140px;
`;
const Search = styled.div`
  background-color: rgba(102, 204, 0, 1);
  height: 28px;
  line-height: 28px;
  color: #FFFFFF;
  text-align: center;
  cursor: pointer;
  width: 58px;
  border-radius: 16px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
`;
/*
@作者：姜中希
@日期：2018-06-26
@描述：日期选择框， 圆形边框，右侧查询按钮
*/
