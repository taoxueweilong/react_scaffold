import React, {Component} from 'react';
import styled from 'styled-components';
import Radio from 'antd/lib/radio';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tabs from 'antd/lib/tabs';
import ScrollArea from 'components/scrollArea';
import ObserveCure from './observeCure';
import FeelCure from './feelCure';
import Tip from './img/u1157.png';
import Down from './img/u1657.png';
import Up from './img/u1676.png';
import LoadingImg from './img/loading.gif';
import 'components/antd/style/form.less';
import 'components/scrollArea/index.less';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import MainSpeech from './mainSpeech';
import CurePrinciple from './curePrinciple';
import IllHistory from './illHistory';
import Input from 'components/dr/input';
import ToElecCasePop from './toElecCasePop';
import CreateScheme from './createScheme';
import Diagnose from './diagnose';
import { getDiagnoseText } from 'commonFunc/transform';
import ajaxGetResource from 'commonFunc/ajaxGetResource';

const bodyHeight = document.body.clientHeight;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleAreaPop: false, //患者主诉文本域弹框是否可见
      visibleCurePrinciple: false, // 治疗原则弹框是否可见
      icons: {}, //tab页是否有消息图标
      title: '', //弹框标题
      seeIsExpand: false, // 望诊是否展开
      fellIsExpand: false, //切诊是否展开
      fuzhujianchaIsExpand: false, //辅助检查是否展开
      saved: 0, //是否点击保存按钮, 0未保存 1 保存中 2 保存成功
      diagnoseData: [], // 诊疗数据
      leftPulse: [], //左脉象数组
      rightPulse: [], //右脉象数组
      tongueNature: [], //舌质
      tongueCoated: [], //舌苔数组
      tabIndex: 0, // 当前tab的定位坐标
    };
    this.inputTextByTab = this.inputTextByTab.bind(this);
    this.inputText = this.inputText.bind(this);
    this.observeTagsClick = this.observeTagsClick.bind(this);
    this.feelTagsClick = this.feelTagsClick.bind(this);
    this.handleElectPopOk = this.handleElectPopOk.bind(this);
    this.handleDiagnosePopOk = this.handleDiagnosePopOk.bind(this);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let { diagnoseData, leftPulse, rightPulse, tongueNature, tongueCoated } = this.state;
        console.log('window.registerId', window.registerId);
        let buDiagnosisInfo = {
          buDiagnosisList: diagnoseData,
          "cardno": "1312",
      		"deptid": window.sessionStorage.getItem('deptid'),
      		"diagnosisDesc": "诊断描述",
      		"doctorid": window.sessionStorage.getItem('userid'),
      		"orgid": window.sessionStorage.getItem('orgid'),
      		"patientid": window.patientID,
      		"patientname": window.patientName,
      		"patientno": "test",
      		"registerid":window.registerID,
      		"registerno": "12312"
        };
        values.buDiagnosisInfo = buDiagnosisInfo;
        values.buPatcasPulconLeftList = leftPulse;
        values.buPatcasPulconRightList = rightPulse;
        values.buPatcasToncoaList = tongueCoated;
        values.buPatcasTonnatList = tongueNature;
        values.registerid = window.registerID;
        values.casetype = 1;
        values.deptid = window.sessionStorage.getItem('deptid');
        values.doctorid = window.sessionStorage.getItem('userid');
        values.doctorname = window.sessionStorage.getItem('username');
        values.orgid = window.sessionStorage.getItem('orgid');
        console.log('values', values);
        let self = this;
        let params = {
          url: 'BuPatientCaseController/postData',
          data: JSON.stringify(values),
          type: 'post',
        };
        function callBack(res){
          if(res.result){
            self.setState({
              saved: 1
            },()=>{
              setTimeout(function(){
                self.setState({
                  saved: 2,
                }, ()=>{
                  setTimeout(function(){
                    self.setState({
                      saved: 0,
                    });
                    self.createScheme.handleOpen(); // 打开是否到智能推方的弹框
                  }, 1000);
                });
              },2000);
            });
          }else{
            console.log('异常响应信息', res);
          }
        };
        ajaxGetResource(params, callBack);

      }
    });
  }
  /*点击弹框确定事件*/
  handleElectPopOk(){ // 复诊弹框点击确定
    this.setState({visibleElecPop:false});
    this.toElecCasePop.handleClose();
    this.props.onChange('2');
  };
  /**
   * [handleDiagnosePopOk 诊断弹框处理函数]
   * @param  {[type]} diagnoseData [获取的诊断数据]
   * @return {[type]}              [void]
   */
  handleDiagnosePopOk(diagnoseData){
    // console.log('diagnoseData',diagnoseData);
    let text = this.getFilterTest(diagnoseData);
    let {id, value} = this.getFieldByTitle('诊断');
    this.props.form.setFieldsValue({[id]:  text + '；'}); // 给对应的formitem项赋值
    this.setState({diagnoseData});
  };
  getFilterTest(data){
    let chinaMedicine = '中医诊断：';
    let westMedicine = '西医诊断：';
    data.forEach((item, index)=>{ // 遍历诊断信息
      let diagnoseChiane = '';
      let diagnoseWest = '';
      if(item.diagnosisWay == 1){ //西医诊断
        diagnoseWest = item.dianame;
      }else{
        diagnoseChiane = item.disname; // 中医病症
        let minifest = ''; // 病侯
        item.buDiagnosisDismainfList.forEach((itemChildChile, indexChildChild) => { // 病侯
          minifest += itemChildChile.manifname + '，'
        });
        if(minifest){
          minifest = '（' + minifest.substr(0, minifest.length - 1) + '）';
          diagnoseChiane += minifest;
        }
      }
      chinaMedicine += (diagnoseChiane?(diagnoseChiane + '，'):diagnoseChiane);
      westMedicine += (diagnoseWest?(diagnoseWest + ','):diagnoseWest);
    });
    let tittle = '';
    if(chinaMedicine.length > 5){
      tittle = chinaMedicine.substr(0, chinaMedicine.length-1);
    }
    if(westMedicine.length > 5){
      tittle += '；';
      tittle += westMedicine.substr(0, westMedicine.length-2);
    }
    return tittle;
  };
  /*输入事件*/
  handleChange(e){ // tab是否显示消息图标
    let obj = this.state.icons;
    obj[e.target.id] = (!!e.target.value);
  };
  inputTextByTab(text, title){ // 将选中行插入输入行
    console.log(text, title);
    let obj = this.state.icons;
    let {id, value} = this.getFieldByTitle(title);
    obj[id] = true; // 只要选中了tab就肯定显示消息图标
    if(!!value && (value.substr(value.length-1) != '；')){
      value = value + '；';
    }
    this.props.form.setFieldsValue({[id]: value + text + '；'});
  };
  inputText(primarySym, time){ // 将选中主诉行插入输入行
    primarySym = !!time?(primarySym + '(持续时间：' + time + '天)'):primarySym;
    let {id, value} = this.getFieldByTitle('患者主诉');
    if(!!value && (value.substr(value.length-1) != '；')){
      value = value + '；';
    }
    this.props.form.setFieldsValue({[id]: value + primarySym + '；'});
  };
  observeTagsClick(tongueCoated, tongueShape){ // 将选中的标签插入输入行
    let tongueCoatedText = [];
    let tongueCoatedId = [];
    tongueCoated.forEach((item, index)=>{
      tongueCoatedText.push(item.name);
      tongueCoatedId.push({ coatingid: item.id });
    });
    let tongueShapeText = [];
    let tongueShapeId = [];
    tongueShape.forEach((item, index)=>{
      tongueShapeText.push(item.name);
      tongueShapeId.push({natureid: item.id});
    });
    this.setState({
      tongueNature: tongueShapeId, //舌质
      tongueCoated: tongueCoatedId, //舌苔
    });

    let {id, value} = this.getFieldByTitle('望诊');
    let text = tongueCoatedText.length?'舌苔（':'';
    text += tongueCoatedText.join('、')
    text += tongueCoatedText.length?'）':'';
    text += (tongueCoatedText.length&&tongueShapeText.length)?'；':'';
    text += tongueShapeText.length?'舌质（':'';
    text += tongueShapeText.join('、')
    text += tongueShapeText.length?'）':'';
    this.props.form.setFieldsValue({[id]: text});
  };
  feelTagsClick(left, right){ // 将选中的标签插入输入行
    let {id, value} = this.getFieldByTitle('切诊');
    let text = left.length?'左脉象（':'';
    let leftText = [];
    let leftId = [];
    left.forEach((item, index)=>{
      leftText.push(item.name);
      leftId.push({conditionid:item.id});
    });
    let rightText = [];
    let rightId = [];
    right.forEach((item, index)=>{
      rightText.push(item.name);
      rightId.push({conditionid: item.id});
    });
    this.setState({
      leftPulse: leftId, //左脉象数组
      rightPulse: rightId, //右脉象数组
    });
    text += leftText.join('、')
    text += leftText.length?'）':'';
    text += (leftText.length&&rightText.length)?'；':'';
    text += rightText.length?'右脉象（':'';
    text += rightText.join('、')
    text += rightText.length?'）':'';
    this.props.form.setFieldsValue({[id]: text});
  };
  getFieldByTitle(title){ // 通过标题获取formItem对象
    let id = '';
    switch(title){
      case '现病史':
        id = 'hpi';
        break;
      case '过敏史':
        id = 'allergichistory';
        break;
      case '既往史':
        id = 'pasthistory';
        break;
      case '个人史':
        id = 'personhistory';
        break;
      case '月经婚育史':
        id = 'moHistory';
        break;
      case '家族史':
        id = 'familyhistory';
        break;
      case '患者主诉':
        id = 'pridepict';
        break;
      case '望诊':
        id = 'inspection';
        break;
      case '切诊':
        id = 'palpation';
        break;
      case '诊断':
       id = 'zhenduan';
       break;
      case '治疗原则':
        id = 'treatprinciple';
        break;
      default: console.log('程序出现bug,请检查');
    }
    let preValue = (this.props.form.getFieldsValue([id]))[id];
    return {id: id, value: preValue}
  };
  expand(e, type, status){
    this.setState({
      [type]: status
    });
  };
  handleKeyPress(keyCode, title){
    let dom = null;
    switch(title+keyCode){ // 37向左箭头 39向右箭头，分别对应不同的下一个或者上一个tab页
      case 'inspection9':
        dom = document.getElementById('palpation');
        break;
      case 'palpation9':
        dom = document.getElementById('smelling');
        break;
      default:
        console.log('没有绑定这个键事件');
    };
    if(dom){
      dom.click();
    }
  }
  handleTabClick = (e) => {
    setTimeout(function(){ // 异步改变输入框焦点
      let dom = document.getElementsByClassName('ant-tabs-tabpane-active')[2].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('span')[0].getElementsByTagName('div')[0].getElementsByTagName('textarea')[0];
      dom.focus();
    }, 500);
  }
  componentDidMount(){
    this.radio.focus(); // 初始化radio获取焦点
    // document.getElementById('mainSpeech').focus();
    // console.log(document.getElementById('mainSpeech'));
  };
  render() {
    let { icons, visibleAreaPop, title, seeIsExpand, fellIsExpand, fuzhujianchaIsExpand, visibleDiagnose, visibleCurePrinciple } = this.state;
    let {saved} = this.state;
    const { getFieldDecorator } = this.props.form;
    console.log('oooo', window.patientID, window.registerID, window.patientName);
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 },
      },
     };
    return (
      <Container>
        <Form onSubmit={this.handleSubmit} id='form'>
          <ScrollArea height={250}>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="初复诊："
                >
                {getFieldDecorator('casetype', {
                  initialValue: 1
                })(
                  <RadioGroup className='height-40'>
                    <Radio value={1} autoFocus={true} ref={(ref)=>{this.radio = ref}} tabIndex='1'>初诊</Radio>
                    <Radio value={2} onClick={(e)=>{this.toElecCasePop.handleOpen()}}>复诊</Radio>
                  </RadioGroup>
                )}
                </FormItem>
                <ToElecCasePop  onOk={this.handleElectPopOk} ref={ref=>this.toElecCasePop = ref}>
                </ToElecCasePop>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="🔊患者主诉："
                >
                {getFieldDecorator('pridepict', {
                  initialValue: ''
                })(
                  <MainSpeech onSelectLine={this.inputText} onKeyDown={(e)=>{alert()}}/>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row className='height' onClick={this.handleTabClick}>
              <Col span={22} offset={2}>
                <Tabs animated={false} defaultActiveKey="1" className='scrollTextarea' onChange={this.handleTabClick}>
                  <TabPane tab={<span id='hpi'>现病史 {!!icons.hpi?<img src={Tip} style={styles.message}/>:null}</span>} key="1">
                    <FormItem
                      colon={false}
                      className='height'
                    >
                    {getFieldDecorator('hpi', {
                      initialValue: '',
                    })(
                      <IllHistory title='现病史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='20px'/>
                    )}
                    </FormItem>
                  </TabPane>
                  <TabPane tab={<span id='allergichistory'>过敏史 {!!icons.allergichistory?<img src={Tip} style={styles.message}/>:null}</span>} key="2">
                    <FormItem
                      colon={false}
                    >
                    {getFieldDecorator('allergichistory', {
                      initialValue: '',
                    })(
                      <IllHistory title='过敏史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='130px'/>
                    )}
                    </FormItem>
                  </TabPane>
                  <TabPane tab={<span id='pasthistory'>既往史 {!!icons.pasthistory?<img src={Tip} style={styles.message}/>:null}</span>} key="3">
                    <FormItem
                      colon={false}
                    >
                    {getFieldDecorator('pasthistory', {
                      initialValue: '',
                    })(
                      <IllHistory title='既往史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='240px'/>
                    )}
                    </FormItem>
                  </TabPane>
                  <TabPane tab={<span id='personhistory'>个人史 {!!icons.personhistory?<img src={Tip} style={styles.message}/>:null}</span>} key="4">
                    <FormItem
                      colon={false}
                    >
                    {getFieldDecorator('personhistory', {
                      initialValue: '',
                    })(
                      <IllHistory title='个人史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='345px'/>
                    )}
                    </FormItem>
                  </TabPane>
                  <TabPane tab={<span id='moHistory'>月经婚育史 {!!icons.moHistory?<img src={Tip} style={styles.message}/>:null}</span>} key="5">
                    <FormItem
                      colon={false}
                    >
                    {getFieldDecorator('moHistory', {
                      initialValue: '',
                    })(
                      <IllHistory title='月经婚育史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='460px'/>
                    )}
                    </FormItem>
                  </TabPane>
                  <TabPane tab={<span id='familyhistory'>家族史 {!!icons.familyhistory?<img src={Tip} style={styles.message}/>:null}</span>} key="6">
                    <FormItem
                      colon={false}
                    >
                    {getFieldDecorator('familyhistory', {
                      initialValue: '',
                    })(
                      <IllHistory title='家族史' onChange={(e)=>this.handleChange(e)} inputTextByTab={this.inputTextByTab} left='585px'/>
                    )}
                    </FormItem>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={<span><img src={seeIsExpand?Up:Down} style={styles.arrow} />望诊：</span>}
                >
                {getFieldDecorator('inspection', {
                  initialValue: ''
                })(
                  <Input onClick={(e)=>this.expand(e, 'seeIsExpand', !seeIsExpand)} onKeyDown={(e)=>this.handleKeyPress(e.keyCode, 'inspection')} icon='true'/>
                )}
                {seeIsExpand?<ObserveCure onClick={this.observeTagsClick}/>:null}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label={<span><img src={fellIsExpand?Up:Down} style={styles.arrow} />切诊：</span>}
                >
                {getFieldDecorator('palpation', {
                  initialValue: ''
                })(
                  <Input onClick={(e)=>this.expand(e, 'fellIsExpand', !fellIsExpand)} icon='true' onKeyDown={(e)=>this.handleKeyPress(e.keyCode, 'palpation')}/>
                )}
                {fellIsExpand?<FeelCure onClick={this.feelTagsClick}/>:null}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="闻诊："
                >
                {getFieldDecorator('smelling', {
                  initialValue: ''
                })(
                  <Input onClick={(e)=>{}}/>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="辩证要点："
                >
                {getFieldDecorator('syndrome', {
                  initialValue: ''
                })(
                  <Input />
                )}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  colon={false}
                  {...formItemLayout}
                  label={<span><img src={fuzhujianchaIsExpand?Up:Down} style={styles.arrow} onClick={(e)=>this.expand(e, 'fuzhujianchaIsExpand', !fuzhujianchaIsExpand)}/>辅助检查：</span>}>
                  <Col span={2} >
                    <FormItem
                      labelCol={{span: 12}}
                      wrapperCol= {{span: 12}}
                      colon={false}
                      label="体温(T)"
                    >
                    {getFieldDecorator('temperature', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={1} style={styles.unit}>℃</Col>
                  <Col span={2}>
                    <FormItem
                      labelCol={{span: 12}}
                      wrapperCol= {{span: 12}}
                      colon={false}
                      label="呼吸(R)"
                    >
                    {getFieldDecorator('breath', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={1} style={styles.unit}> 次/分</Col>
                  <Col span={2}>
                    <FormItem
                      labelCol={{span: 12}}
                      wrapperCol= {{span: 12}}
                      colon={false}
                      label="脉搏(P)"
                    >
                    {getFieldDecorator('pulse', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={1} style={styles.unit}> 次/分</Col>
                  <Col span={3}>
                    <FormItem
                      labelCol={{span: 16}}
                      wrapperCol= {{span: 8}}
                      colon={false}
                      label="收缩压/舒张压"
                    >
                    {getFieldDecorator('systolicPressure', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={1}>
                    <FormItem
                      labelCol={{span: 8}}
                      wrapperCol= {{span: 16}}
                      className='slash'
                      colon={false}
                      label='/'
                    >
                    {getFieldDecorator('diastolicPressure', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={1} style={styles.unit}>mnHg</Col>
                  <Col span={2}>
                    <FormItem
                      labelCol={{span: 12}}
                      wrapperCol= {{span: 12}}
                      colon={false}
                      label="身高"
                    >
                    {getFieldDecorator('heightnum', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>
                  <Col span={2}>
                    <FormItem
                      labelCol={{span: 12}}
                      wrapperCol= {{span: 12}}
                      colon={false}
                      label="体重"
                    >
                    {getFieldDecorator('weightnum', {
                      initialValue: ''
                    })(
                      <Input />
                    )}
                    </FormItem>
                  </Col>

                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              {fuzhujianchaIsExpand?
                (
                  <Col span={20} offset={2}>
                    <FormItem
                      {...formItemLayout}
                      colon={false}
                      label="其它：">
                      {getFieldDecorator('qita', {
                          initialValue: ''
                        })(<Input />)
                      }
                    </FormItem>
                  </Col>
                ):null}
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="诊断："
                >
                {getFieldDecorator('zhenduan', {
                  initialValue: {originData: [], extractionData: getDiagnoseText([])},
                  rules: [{
                     required: true,
                     message: '请输入诊断信息',
                   }],
                })(
                  <Diagnose />
                )}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="治疗原则："
                >
                {getFieldDecorator('treatprinciple', {
                  initialValue: '',
                  rules: [{
                     required: true,
                     message: '请输入治疗原则信息',
                   }],
                })(
                  <CurePrinciple onSelectLine={this.inputTextByTab}/>
                )}
                </FormItem>
              </Col>
            </Row>
            <Row className='height'>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  colon={false}
                  label="医生建议："
                >
                {getFieldDecorator('suggession', {
                  initialValue: ''
                })(
                  <Input id='suggession'/>
                )}
                </FormItem>
              </Col>
            </Row>
          </ScrollArea>
          <Row>
            <Col span={5} style={styles.saving} offset={6}>
            {
              saved == 0 ? null :
              (
                saved == 1 ?
                <SaveTip>
                  <Loading src={LoadingImg} />
                  <span>正在保存诊疗单数据，请稍后 ······</span>
                </SaveTip>
                :
                <SaveTip>
                  <Success type="check-circle"/>
                  <span>诊疗单保存成功</span>
                </SaveTip>
              )
            }
            </Col>
            <Col span={13}>
              <FormItem className='footer'>
                <Button type="primary" htmlType="submit" className='semicircle'>保存</Button>
                <BorderButton type="primary" className='cancel' onClick={this.handleReset}>打印</BorderButton>
                <BorderButton type="primary" className='cancel' onClick={this.handleReset}>另存成模板</BorderButton>
                <BorderButton type="primary" className='cancel' onClick={this.handleReset}>从模板导入</BorderButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div>
          <CreateScheme  title='系统操作提示' ref={ref=>this.createScheme = ref} onOk={this.handleRecommendPopOk}>
          </CreateScheme>
        </div>
      </Container>
    );
  }
}
const SaveTip = styled.div`
  color: #c467da;
  display: flex;
  align-items: center;
`;
const Loading = styled.img`
  height: 20px;
  margin-right: 10px;
`;
const Success = styled(Icon)`
  margin-right: 10px;
  &::before {
    color: #e6981e;
  }
`;
const Container = styled.div`
  width: 100%;
  padding: 0px 20px;
`;
const BorderButton = styled(Button)`
  border: 1px solid rgba(10, 110, 203, 1) !important;
`;
const styles = {
  scroll: {
    height: bodyHeight-220,
  },
  message: {
    position: 'absolute',
    right: 0,
    top: 10
  },
  arrow: {
    cursor: 'pointer',
    marginRight: 5
  },
  unit: { // 计量单位
    height: '39.9999px',
    lineHeight:'39.9999px',
    width: 'fit-content',
    paddingRight: 60,
  },
  saving: {
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

};
/*
@作者：姜中希
@日期：2018-06-25
@描述：书写诊疗单界面, 滚动区域仅限于tabs内容
*/
const TreatmentList = Form.create()(Index);
export default TreatmentList;
