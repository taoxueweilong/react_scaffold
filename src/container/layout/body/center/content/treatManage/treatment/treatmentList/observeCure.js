import React, {Component, PropTypes} from 'react'; // react核心
import CheckableTag from 'components/antd/components/checkableTag';
import styled from 'styled-components';
import ajaxGetResource from 'commonFunc/ajaxGetResource';

export default class ObserveCure extends Component {
  constructor(props){
    super(props);
    this.state = {
      tongueCoatedSelected: [], //已选舌苔
      tongueNatureSelected: [], // 已选舌质
      tongueCoatedList: [], //舌苔列表
      tongueNatureList: [], //舌质列表
    };
    this.coatedTagClick = this.coatedTagClick.bind(this);
    this.natureTagClick = this.natureTagClick.bind(this);
  };
  componentWillMount(){
    this.getTongueCoatedData();
    this.getTongueNatureData();
  };
  /** [getTongueCoatedData 获取舌苔列表] */
  getTongueCoatedData(){
    let self = this;
    let params = {
      url: 'BuTongueCoatingController/getList',
      data: {},
    };
    function callBack(res){
      if(res.result){
        let tongueCoatedList = res.data.map((item)=>{
          return {id: item.coatingid, name: item.coaTypename, color: item.coaTypedesc}
        });
        self.setState({tongueCoatedList});
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  /** [coatedTagClick description] */
  getTongueNatureData(){
    let self = this;
    let params = {
      url: 'BuTongueNatureController/getList',
      data: {},
    };
    function callBack(res){
      if(res.result){
        let tongueNatureList = res.data.map((item)=>{
          return {id: item.natureid, name: item.natTypename, color: item.natTypedesc}
        });
        self.setState({tongueNatureList});
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  /** [coatedTagClick 舌苔标签被选择] */
  coatedTagClick(text, checkable, id){
    let tongueCoatedSelected = this.state.tongueCoatedSelected;
    this.traverseArr(text, checkable, tongueCoatedSelected, id);
  };
  /** [natureTagClick 舌质标签被选择] */
  natureTagClick(text, checkable, id){
    let tongueNatureSelected = this.state.tongueNatureSelected;
    this.traverseArr(text, checkable, tongueNatureSelected, id);
  };
  /** [traverseArr 将已经选择的通知父组件显示] */
  traverseArr(text, checkable, arr, id){
    if(checkable){ // 选中
      arr.push({id: id, name: text});
    }else{ // 取消
      arr.pop({id: id, name: text});
    }
    let {tongueCoatedSelected, tongueNatureSelected} = this.state;
    this.props.onClick(tongueCoatedSelected, tongueNatureSelected);
  };
  render() {
    let { tongueCoatedList, tongueNatureList } = this.state;
    return (
      <Container>
        <Row className='semicircle'>
          舌质：
          {
            tongueNatureList.map((item, index) => {
              return <CheckableTag key={index} id={item.id} color={item.color} onClick={this.coatedTagClick} text={item.name}></CheckableTag>
            })
          }
        </Row>
        <Row className='semicircle'>
          舌胎：
          {
            tongueCoatedList.map((item, index) => {
              return <CheckableTag key={index} id={item.id} color={item.color} onClick={this.natureTagClick} text={item.name}></CheckableTag>
            })
          }
        </Row>
      </Container>
    )
  }
}
const Container = styled.div`
  padding: 10px 0px
`;
const Row = styled.div`
  margin-top: 0px;
`;
/*
@作者：姜中希
@日期：2018-06-28
@描述：望诊组件
*/
