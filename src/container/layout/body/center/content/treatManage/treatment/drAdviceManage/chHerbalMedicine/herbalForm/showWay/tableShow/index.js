import React, { Component } from 'react';
import styled from 'styled-components';
import TableItem from './tableItem';
import Addtip from './addtip.png';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      herbalData: [], // 草药数据集
    };
    this.dosageChange = this.dosageChange.bind(this);
    this.usageChange = this.usageChange.bind(this);
  }
  /**
   * [dosageChange 修改草药剂量]
   * @param  {[type]} medicinename [草药名称]
   * @param  {[type]} newDosage    [新剂量]
   * @return {[type]}              [void]
   */
  dosageChange(medicinename, newDosage) {
    this.props.dosageChange(medicinename, newDosage);
  }
  usageChange(medicineid, newUsage){
    this.props.usageChange(medicineid, newUsage);
  };
  render() {
    let herbalData = this.props.herbalData;
    return (
      <TableWrap >
      {
        herbalData.map((value, index) => {
          return (
            <TableItem
              onDelete={()=>{this.props.delHerbal(value)}}
              onUsageChange = {this.usageChange}
              dosageChange={this.dosageChange}
              autofocus={(herbalData.length == index + 1) ? 'autofocus' : 'none'}
              key={index}
              value={value} >
            </TableItem>
          )
        })
      }
      <Add onClick = { () => { this.props.addHerbal() }}>+</Add>
      {
        herbalData.length == 0 ? <TipWrap>
        <TipImg src={Addtip} />
        <TipTitle>处方中还没有添加草药</TipTitle>
        <TipText>请点击左侧➕号添加或者<br />通过<TipTextBlue>草药搜索框</TipTextBlue>快速添加</TipText>
      </TipWrap> : null
      }
      </TableWrap>
    )
  }
}
const TableWrap = styled.ul`
  position: relative;
  top: -18px;
  width: 857px;
  height: 320px;
  overflow-y: scroll;
  padding: 4px 3px 0px 0px;
  border: 1px solid #85B6E5;
  background: #fff;
  &::-webkit-scrollbar {
    display: none;
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
  margin-left: 3px;
  float: left;
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
/*
@作者：马晓敏
@日期：2018-07-05
@描述：显示方式——方块儿排列
*/
