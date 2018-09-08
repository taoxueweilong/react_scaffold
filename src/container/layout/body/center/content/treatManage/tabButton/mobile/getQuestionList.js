import React, {Component} from 'react';
import ReactDom from "react-dom"
import { Radio, Progress, Row, Col } from 'antd';
import bg from "../../images/background.png";
import ic from "../../images/iconCount.png";
import testObjectives from "../../images/testObjectives.png";
import back from "../../images/back.png";
import testProgress from "../../images/testProgress.png";
import getResource from 'commonFunc/ajaxGetResource1';

const RadioGroup = Radio.Group;

export default class GetQuestionList extends Component {
  constructor(props){
    super(props);
    this.state = {
        value: null,
        startQuestion: 1,
        end: '',
        arr:[],         
        answer:[],
        index: 0,
        percent: 0,
        length: ''
        };
  };

  componentDidMount(){//获取题目
    let qSex = this.props.sex;
    let params = {
            type: 'GET',
            url: 'healthcabin/checkbody/getAllTcmQuestion.zb',
            contentType: '',
            xhrFields:{withCredentials:true},
            crossDoman:true,
            data: {
              qSex: qSex
            }
        };
        let that = this;
        function success(res){
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
    let userId = this.props.userId;
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
        this.lastEndClick();
      }
    }
    this.setState({
      startQuestion: this.state.startQuestion+1,
      end: this.state.end-1,
      index: this.state.index + 1,
      percent: Math.round(((this.state.index+1)/this.state.length) * 100)
    });
  }

  lastEndClick () {//点最后一道题提交跳转
    let pram = 6;
    this.props.onToggle(pram);
  }

  handClickBack () {//跳到不同页面实现组件切换
    let pram = 3;
    this.props.onToggle(pram);
  }

  render() { 
    let startQuestion = this.state.startQuestion;
    let mmuu = null;
    if(this.state.arr.length != 0){
      var aa = this.state.arr;
      mmuu = 
      <div>
        <div style={styles.nextDiv}>
            <Row type="flex" justify="start">
                <Col xs={24} sm={24}>   
                    <div>  
                        <img src={bg} style={styles.bg}/>
                        <img src={testObjectives} style={styles.testObjectives}/>
                        <p style={styles.questionStyle}><span>{this.state.arr[this.state.index].TYPE_NAME}</span></p>
                    </div>
                </Col>
            </Row>
            <br/>
            <Row type="flex" justify="start">
                <Col xs={5} sm={5}> 
                    <div>         
                        <img src={ic} style={styles.iC}/>
                        <p style={styles.questionTip}>问题{startQuestion}</p>  
                    </div>    
                </Col>
                <Col xs={18} sm={18}>       
                    <div style={styles.house}>{this.state.arr[this.state.index].Q_TEXT}</div>  
                </Col>
                <Col xs={1} sm={2}>       
                     
                </Col>
            </Row>
            <br/>
            <Row type="flex" justify="start">
                <Col xs={22} sm={22}>    
                    <div style={styles.borderGround}>
                        <RadioGroup size="large" onChange={this.onChange.bind(this)} value={this.state.value} style={styles.radioG}>
                            <Radio key="a" value={1}><span style={styles.radioFontSize}>A:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(0,7)}</span></Radio><br/><br/><br/>
                            <Radio key="b" value={2}><span style={styles.radioFontSize}>B:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(8,15)}</span></Radio><br/><br/><br/>
                            <Radio key="c" value={3}><span style={styles.radioFontSize}>C:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(16,22)}</span></Radio><br/><br/><br/>
                            <Radio key="d" value={4}><span style={styles.radioFontSize}>D:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(23,29)}</span></Radio><br/><br/><br/>
                            <Radio key="e" value={5}><span style={styles.radioFontSize}>E:{this.state.arr[this.state.index].OPTIONS_TEXT.substring(30,37)}</span></Radio><br/><br/><br/>
                        </RadioGroup> 
                    </div>
                </Col>
                <Col xs={2} sm={1}>    

                </Col>
            </Row>        
        </div>
        <div style={styles.footer}>
            <Row type="flex" justify="start">
                <Col xs={10} sm={10}>   
                    <div>  
                        <img src={testProgress} style={styles.testProgress}/>
                        <p style={styles.testProP}>测试进度</p>
                    </div>
                </Col>
                <Col xs={12} sm={12}>   
                    <div style={styles.answerProgress} style={{ width: '14rem' }}>
                        <Progress percent={this.state.percent} size="small" />
                    </div> 
                </Col>
                <Col xs={2} sm={2}>   

                </Col>
            </Row>
            <Row type="flex" justify="start">
                <Col xs={22} sm={22} offset={1}>   
                    <div>  
                        <span style={styles.rember}>测试进度：本次测试问题共{this.state.arr.length}个，已经回答{this.state.index}个，目前还剩下{this.state.end} 个问题未回答，选择答案后自动转到下一题~</span> 
                    </div>
                </Col>
            </Row>
        </div>
      </div>
    }
    return (
      <div style={styles.borderHeight}>
        <div>
          <Row type="flex" justify="start">
              <Col xs={24} sm={24}> 
                <div style={styles.titleTip}>
                  <img src={back} style={styles.back} onClick={this.handClickBack.bind(this)}/>
                  <h2 style={styles.syso}>测评问答</h2>
                </div>       
              </Col>
          </Row>
        </div>
        {mmuu}
        
      </div> 
    );
  }
}

const styles = {
    borderHeight: {
        backgroundColor: 'white'
    },
    titleTip: {
        width: '100%',
        height: '6rem',
        backgroundColor: 'rgb(26, 118, 209)',
        marginTop: '-2rem'
    },
    back: {
        height: '2rem',
        marginTop: '8.7%'
    },
    syso: {
        color: 'white',
        fontSize: '22px',
        textAlign: 'center',
        marginTop: '-7.8%'
    },
    nextDiv: {
        marginTop: '4%'
    },
    bg: {
        width: '59%'
    },
    testObjectives: {
        marginLeft: '-56%'
    },
    questionStyle: {
        zIndex: '999',
        marginLeft: '14%',
        marginTop: '-9.5%',
        color: '#1974d0',
        fontSize: '17px'
    },
    iC: {
        height: '3rem',
        zIndex: '1',
        marginTop: '2.5%',
        marginLeft: '1rem',
        width: '6rem'
    },
    questionTip: {
        zIndex: '2',
        fontSize: '16px',
        textDecoration: 'none',
        color: '#FFFFFF',
        marginTop: '-42.5%',
        marginLeft: '34.4%'
    },
    house: {
        marginLeft: '3rem',
        fontSize: '17px',
        color: 'black'
    },
    borderGround: {
        width: '100%',
        height: '22rem',
        background: 'inherit',
        boxSizing: 'border-box',
        border: '1px solid #1a76d1',
        borderRadius: '0px',
        overflow: 'hidden',
        marginTop: '2%',
        marginLeft: '1rem'
    },
    radioG: {
        marginLeft: '10%',
        marginTop: '7%'
    },
    radioFontSize: {
        fontSize:'17px',
        color: '#333333'
    },
    answerProgress: {
        float: 'right',
        marginRight: '5.8%',
        marginTop: '-1.5%'
    },
    testProgress: {
        marginLeft: '1rem'
    },
    testProP: {
        fontSize: '17px',
        marginLeft: '3rem',
        marginTop: '-1.8rem',
        color: '#333333'
    },
    rember: {
        fontSize: '16px',
        color: '#333333'
    },
    footer: {
        marginTop: '3%'
    }
};