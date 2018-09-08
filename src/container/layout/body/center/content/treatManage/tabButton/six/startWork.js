import React, {Component} from 'react';
import ReactDom from "react-dom"
import { Button, Input, Radio, Progress, Row, Col } from 'antd'
import TestResults from "./testResults.js"
import "../css/startWork.css";
import tp from "../../images/tipPhoto.png";
import bg from "../../images/background.png";
import ic from "../../images/iconCount.png";
import ScrollArea from 'components/scrollArea';
import getResource from 'commonFunc/ajaxGetResource1';

const bodyHeight = document.body.clientHeight;
const RadioGroup = Radio.Group;

export default class StartWork extends Component {
  constructor(props){
    super(props);
    //this.handClick = this.handClick.bind(this);
    this.state = {
      value: null,
      startQuestion: 1,
      end: '',
      arr:[],
      answer:[],
      index: 0,
      userId: '',
      percent: 0,
      length: ''
    };
  };

  getLogin(){//患者是否存在 0或者1
    let params = {
      type: 'GET',
      url: 'healthcabin/infomanage/zhlogin.zb',
      contentType: '',
      xhrFields:{withCredentials:true},
      crossDoman:true,
      data:{
        CertificatesType: 1,
        CertificatesNumber: '653024198209249589'
      }
    };
    let that = this;
    function success(res){
      that.setState({
        userId: res.userid
      })
    };

    function error(res){
      console.log('失败',res)
    };

    getResource(params, success, error);
  }

  componentDidMount(){//获取题目
    this.getLogin();
    let params = {
            type: 'GET',
            url: 'healthcabin/checkbody/getAllTcmQuestion.zb',
            contentType: '',
            xhrFields:{withCredentials:true},
            crossDoman:true,
            data: {
              qSex: 1
            }
        };
        let that = this;
        function success(res){
          console.log("cheng",res)
          that.setState({
            arr: res,
            end: res.length,
            length: res.length
          })
        };

        function error(res){
            console.log('获取题目失败');
        };

        getResource(params, success, error);
  }

  onChange(e) {
    //console.log('this.state.userId', this.state.userId);
    //console.log('this.state.answer', this.state.answer);
    let userId = this.state.userId;
    let arr = this.state.arr;
    let TYPE_ID = arr[this.state.index].TYPE_ID;
    let TYPE_NAME = arr[this.state.index].TYPE_NAME;
    let Q_ID = arr[this.state.index].Q_ID;
    let OPTIONS_VALUE = e.target.value + '';
    let answerJson = this.state.answer;
    let aj = answerJson.push({typeId: TYPE_ID, typeName: TYPE_NAME, qId: Q_ID, optionsValue: OPTIONS_VALUE});
    let startQuestion = this.state.startQuestion;
    if(startQuestion == arr.length){//当前数量等于题目.length时，点击最后一题的选项，提交存储答案的json
      if('radio checked'){
        let paramsData = JSON.stringify(answerJson);
        //console.log('paramsData',paramsData)
        let params = {
          type: 'GET',
          url: 'healthcabin/checkbody/getCheckResult.zb',
          contentType: '',
          xhrFields:{withCredentials:true},
          crossDoman:true,
          async: false,
          //dataType: 'jsonp',
          data: {
            json: paramsData,
            userId: userId
          }
        };

        function success(res){

        };

        function error(res){
            console.log('提交答案失败');
        };

        getResource(params, success, error);
        this.handClick();
        this.props.letUserId(userId);//调用父组件的方法，把userID传给父组件
      }
    }
    this.setState({
      startQuestion: this.state.startQuestion+1,
      end: this.state.end-1,
      index: this.state.index + 1,
      percent: Math.round(((this.state.index+1)/this.state.length) * 100)
    });
  }

  handClick(){//切换组件，跳转到结果页面testResults.js
    this.props.onToggle();
  }
  render() {
    let mmuu = null;
    if(this.state.arr.length != 0){
      var aa = this.state.arr;
      mmuu =
      <div>
        <Row type="flex" justify="start">
          <Col lg={24} xl={24} xxl={24}>
            <p className="questionStyle">🔘&nbsp;<span>{this.state.arr[this.state.index].TYPE_NAME}</span></p>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col lg={24} xl={24} xxl={24}>
            <div>
              <img src={ic} className="iC"/>
              <p className="questionTip">问题{this.state.startQuestion}</p>
              <div className="house">{this.state.arr[this.state.index].Q_TEXT}</div>
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col lg={24} xl={24} xxl={24}>
            <div className="borderGround">
              <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value} className="radioG">
                <Radio key="a" value={1}>A:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(0,7)}</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio key="b" value={2}>B:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(8,15)}</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio key="c" value={3}>C:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(16,22)}</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio key="d" value={4}>D:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(23,29)}</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio key="e" value={5}>E:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(30,37)}</Radio>
              </RadioGroup>
            </div>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col lg={24} xl={24} xxl={24}>
            <span className="rember">测试进度：本次测试问题共{this.state.arr.length}个，已经回答{this.state.index}个，目前还剩下{this.state.end} 个问题未回答，选择答案后自动转到下一题~</span>
          </Col>
        </Row>
      </div>
    }
    return (
      <div className="all">
        <ScrollArea height={200}>
          <Row type="flex" justify="start">
            <Col lg={24} xl={24} xxl={24}>
              <div>
                <img src={tp} className="tipPhoto"/>
                <p className="tipTitle">患者体质辨析测评</p>
                <p className="tipText">请您通过问答形式协助患者完成“体质辨析测评”
                </p>
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col lg={24} xl={24} xxl={24}>
              <div className="percentLeft">
                <img src={bg} className="bG"/>
                {mmuu}
                <div className="answerProgress" style={{ width: 300 }}>
                  <Progress percent={this.state.percent} size="small" />
                </div>
              </div>
            </Col>
          </Row>
        </ScrollArea>
      </div>
    );
  }
}

/*
@作者：王崇琨
@日期：2018-07-08
@描述：治未病-根据性别获取题目
*/
