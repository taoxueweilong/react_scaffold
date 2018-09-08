import React, {Component} from 'react';
import Cure from "../tabButton/six/cure.js"
import StartWork from "../tabButton/six/startWork.js"
import TestResults from "../tabButton/six/testResults.js"

export default class DiseasePreventTreat extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: '1',
      userId: ''
    };
  };
  handleClick(pram){
     this.setState({
       visible: pram
     });
  };
  
  getUserId(userId){
    this.setState({
      userId: userId
    });
  };
  render() {
    console.log('usid',this.state.userId)
    let {visible,userId}  = this.state
    let t  = null;
    if(visible == 1){
      t = <Cure onToggle={()=>this.handleClick(2)} visible={this.state.visible}/>
    } else if(visible == 2) {
      t = <StartWork onToggle={()=>this.handleClick(3)} letUserId={this.getUserId.bind(this)}/>
    } else if(visible == 3) {
      t = <TestResults onToggle={()=>this.handleClick(4)} userId = {userId}/>
    } else if(visible == 4) {
      t = <Cure onToggle={()=>this.handleClick(5)} visible={this.state.visible}/>
    } else {
      t = <StartWork onToggle={()=>this.handleClick(3)} letUserId={this.getUserId.bind(this)}/>//letUserId在子组件调用的方法，相当于属性
    }
    return (
      <div>
       {
        t
       }
      </div>
    );
  }
}
/*
@作者：姜中希
@日期：2018-06-30
@描述：治未病容器
*/
