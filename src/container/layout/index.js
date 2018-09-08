import React, {Component} from 'react';
import Header from './header';
import Body from './body';

export default class Layout extends Component {
  componentWillMount(){
    if(bundleMode == 'CS'){
      this.setUserInfoForClient();
    }
  };
  setUserInfoForClient(){
    let userInfoObj = JSON.parse(window.getLoginState());
    window.sessionStorage.setItem('username', userInfoObj.username); // 用户名
    window.sessionStorage.setItem('deptid', userInfoObj.deptid); // 科室ID
    window.sessionStorage.setItem('orgid', userInfoObj.orgid); // 机构ID
    window.sessionStorage.setItem('userid', userInfoObj.userid); // 用户ID
    window.sessionStorage.setItem('post', userInfoObj.post); // 医生级别
  };
  render() {
    return (
      <div>
        <Header {...this.props}/>
        <Body {...this.props}/>
      </div>
    );
  }
}
/*
@作者：姜中希
@日期：2018-06-05
@描述：布局文件，包含头部导航，以及以下主要内容
*/
