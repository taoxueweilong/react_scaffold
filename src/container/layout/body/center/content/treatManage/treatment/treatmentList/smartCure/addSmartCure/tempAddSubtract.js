import React, {Component} from 'react';
import styled from 'styled-components';
import InputSelect from 'components/dr/inputSelect';

export default class TempAddSubtract extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      showResult: false,
    };
    this.showResult = this.showResult.bind(this);
    this.hideResult = this.hideResult.bind(this);
  };
  showResult(value){
    console.log('value', value);
    this.setState({
      showResult: true
    });
  };
  hideResult(){
    this.setState({
      showResult: false
    });
  };
  getValue(e){
    console.log(e.target.innerText);
    this.setState({
      showResult: false,
      value: e.target.innerText
    });
  };
  render() {
    let showResult = this.state.showResult;
    let value = this.state.value;
    let formItemProps = this.props;
    return (
      <InputSelect  formItemProps={formItemProps} displayed={this.showResult}>
      {
        showResult?
        (
          <Result>
            <Line key='1' onClick={(e)=>{this.getValue(e)}}>临症加减oo</Line>
            <Line key='2' onClick={(e)=>{this.getValue(e)}}>oo</Line>
            <Line key='3' onClick={(e)=>{this.getValue(e)}}>oo</Line>
          </Result>
        )
        :null
      }
      </InputSelect>
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
/*
@作者：姜中希
@日期：2018-07-03
@描述：临症加减组件
*/
