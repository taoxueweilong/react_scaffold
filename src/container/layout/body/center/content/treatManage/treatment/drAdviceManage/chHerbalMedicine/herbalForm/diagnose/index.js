import React, {Component} from 'react';
import styled from 'styled-components';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Checkbox from 'antd/lib/checkbox';
import AddIllBySymptom from './addIllBySymptom';
import AddIllByManifestations from './addIllByManifestations';
import AddIllByDiagnose from './addIllByDiagnose';
import InputEnterPop from 'components/dr/input/enterPopInput';
import Pagination_dia from 'components/antd/components/pagination';
import deepClone from 'commonFunc/deepClone';
import ajaxGetResource from 'commonFunc/ajaxGetResource';
import 'antd/lib/button/style/css';
import 'components/antd/style/radio.less';
import 'components/antd/style/checkbox.less';
import { getDiagnoseText, getDiagnoseDataSource, getDiagnoseHisDataSource } from 'commonFunc/transform';

const Pagination_his = deepClone(Pagination_dia);
const RadioGroup = Radio.Group;
export default class Diagnose extends Component {
  constructor(props){
    super(props);
    this.state = {
      curTab: 0, // 当前标签页
      diagnoseHisData: [], //诊断历史数据
      diagnoseFinaleInfo: [], // 诊断最终合成数据（传给后台服务的对象）
      diagnoseData: [], //诊断数据
      symptomId: '', // 病症ID
      repeatDiagnose: 1, // 初步诊断还是确认诊断， 默认是初步诊断
      mainDiagnose: false, //主诊断
      doubleDiagnose: false, //疑似诊断
      diaCurPage: 1, // 诊断数据表格当前页
      hisCurPage: 1, // 历史数据表格当前页
    }
    this.initialData = this.initialData.bind(this);
    this.hideFloatLayer = this.hideFloatLayer.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.addChinaMedicineData = this.addChinaMedicineData.bind(this);
    this.addWestMedicineData = this.addWestMedicineData.bind(this);
    this.onMainDiagnoseChange = this.onMainDiagnoseChange.bind(this);
    this.onDoubleDiagnoseChange = this.onDoubleDiagnoseChange.bind(this);
  }
  componentWillReceiveProps(nextProps){
    let diagnoseData = nextProps.value.originData;
    let diagnoseFinaleInfo = diagnoseData; // 先获取该用户的诊断明细数组
    diagnoseData = getDiagnoseDataSource(diagnoseData); // 初始化诊断表格数据
    this.setState({ diagnoseData, diagnoseFinaleInfo });
  };
  /** [initialData 组件加载获取历史诊断数据] */
  initialData(){
    let self = this;
    let params = {
      url: 'BuDiagnosisInfoController/getList',
      data: {
        cardno: window.cardno
      },
    };
    function callBack(res){
      if(res.result){
        self.setState({
          diagnoseHisData: getDiagnoseHisDataSource(res.data.records)
        });
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  /** [getTableCol 获取诊断和历史诊断的表格项] */
  getTableCol(){
    const columns = [{
      title: '序号',
      dataIndex: 'order',
      align: 'center',
      className: 'height-24',
      key: 'order',
    }, {
      title: '诊断码',
      dataIndex: 'diagnosisCode',
      align: 'center',
      className: 'height-24',
      key: 'diagnosisCode',
    }, {
      title: '诊断内容',
      dataIndex: 'diagnosisName',
      className: 'height-24',
      key: 'diagnosisName',
    }, {
      title: '诊断分类',
      dataIndex: 'diagnosisWay',
      align: 'center',
      className: 'height-24',
      key: 'diagnosisWay',
      render:(text, record, index)=> (text=='0')?'西医':'中医'
    }, {
      title: '诊断类别',
      align: 'center',
      className: 'height-24',
      dataIndex: 'diagnosisType',
      key: 'diagnosisType',
      render:(text, record, index)=> (text=='1')?'初步诊断':'确认诊断'
    }, {
      title: '主诊断',
      dataIndex: 'mainDiaTypeDic',
      align: 'center',
      className: 'height-24',
      key: 'mainDiaTypeDic',
    }, {
      title: '疑似诊断',
      dataIndex: 'doubtDiaTypeDic',
      align: 'center',
      className: 'height-24',
      key: 'doubtDiaTypeDic',
    }, {
      title: '诊断医生',
      align: 'center',
      className: 'height-24',
      dataIndex: 'doctorid',
      key: 'doctorid',
    }, {
      title: '操作',
      align: 'operate',
      className: 'height-24',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record, index)=><a onClick={(e)=>this.delDiagnose(record)}>删除</a>
    }];
    return columns;
  };
  /**
   * [delDiagnose 通过诊断表格删除诊断信息]
   * @param  {[type]} record [当前诊断记录]
   * @return {[type]}        [void]
   */
  delDiagnose(record){
    let diagnoseFinaleInfo = this.state.diagnoseFinaleInfo;
    let diagnoseData =  this.state.diagnoseData;
    diagnoseFinaleInfo.forEach((item, index)=>{
      if(item.diagnosisCode == record.diagnosisCode){
        diagnoseFinaleInfo.pop(item);
        diagnoseData.pop(record);
        return;
      }
    })
    this.setState({ diagnoseFinaleInfo, diagnoseData });
  };
  /** [toggleTabs 中西医tab切换函数] */
  toggleTabs(key) {
    this.setState({
      curTab: key,
    });
  }
  /** [hideFloatLayer 点击诊断的某些部分触发子组件浮层隐藏事件] */
  hideFloatLayer(){
    if(this.addIllBySymptom){
      this.addIllBySymptom.hideResult();
      this.setState({symptomId: ''}); // 重置病症ID
    }
    if(this.addIllByManifestation){
      this.addIllByManifestation.hideResult();
    }
    if(this.addIllByDiagnose){
      this.addIllByDiagnose.hideResult();
    }
  };
  /** [getMessage 病症选择后需要通知病侯组件查所选病症下的病侯] */
  getMessage(symptomId){
    console.log('收获ID');
    this.setState({symptomId});
  };
  /** [addChinaMedicineData 添加中医病症病侯信息到诊断表中] */
  addChinaMedicineData(e){
    let symptom = this.addIllBySymptom.getSelectedData(); // 获取病症信息
    let manifestation = this.addIllByManifestation.getSelectedData(); // 获取病侯信息
    this.addIllBySymptom.hideResult(); // 隐藏病症弹框
    this.addIllByManifestation.hideResult(); // 隐藏病侯弹框
    let manifestationName = ''; // 诊断内容拼接
    manifestation.forEach((item, index)=>{
      manifestationName += (index == 0) ? item.manifname : ('、' + item.manifname)
    });
    let diagnoseDataItem = {
      order: this.state.diagnoseData.length + 1,
      diagnosisCode: symptom.discode,
      diagnosisName: symptom.disname + ((manifestationName == '') ? '' : '/') + manifestationName,
      diagnosisWay: 1,
      diagnosisType: '-',
      mainDiaType: '-',
      doubtDiaType: '-',
      doctorname: window.sessionStorage.getItem('username'),
    };
    this.addIllData(diagnoseDataItem, 0);
    //病症病侯组合
    let diagnoseFinaleInfoItem = deepClone(symptom);
    diagnoseFinaleInfoItem.buDiagnosisDismainfList = manifestation;
    diagnoseFinaleInfoItem.diagnosisName = diagnoseFinaleInfoItem.disname;
    diagnoseFinaleInfoItem.diagnosisCode = diagnoseFinaleInfoItem.discode;
    diagnoseFinaleInfoItem.diaid = '';
    diagnoseFinaleInfoItem.diagnosisWay = 1;
    let diagnoseFinaleInfo = this.state.diagnoseFinaleInfo;
    diagnoseFinaleInfo.push(diagnoseFinaleInfoItem);
    this.setState({ diagnoseFinaleInfo });
  };
  /**
   * [addIllData 添加诊断信息到表格中]
   * @param {[type]} diagnoseDataItem [诊断项]
   * @param {[type]} type          [0代表添加，1删除]
   */
  addIllData(diagnoseDataItem, status){
    let diagnoseData = this.state.diagnoseData;
    if(status == 0){
      diagnoseDataItem.key = diagnoseData.length;
      diagnoseData.push(diagnoseDataItem);
    }else{
      diagnoseData.pop(diagnoseDataItem);
    }
    this.setState({diagnoseData});
  };
  // 历史诊断双击选择
  SelectedLine(record){
    let diagnoseHisData = this.state.diagnoseHisData;
    diagnoseHisData.map((item)=>{ // 将除当前点击行外的所有行均设置为未选中
      if(item.key == record.key){
        this.addIllData(record, item.status);
        let diagnoseFinaleInfoItem = record;
        let diagnoseFinaleInfo = this.state.diagnoseFinaleInfo;
        if(item.status == 1){
          item.status = 0;
          diagnoseFinaleInfo.pop(diagnoseFinaleInfoItem);
        }else{
          item.status = 1;
          diagnoseFinaleInfo.push(diagnoseFinaleInfoItem);
        }
        this.setState({ diagnoseFinaleInfo });
      }
      return item;
    });
    this.setState({ diagnoseHisData });
  };
  /** [onMainDiagnoseChange 是否确认复选框状态改变] */
  onMainDiagnoseChange(e){
    this.setState({
      mainDiagnose: e.target.checked
    });
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  /** [onDoubleDiagnoseChange 怀疑诊断复选框状态改变] */
  onDoubleDiagnoseChange(e){
    this.setState({
      doubleDiagnose: e.target.checked
    });
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  /** [onMainDiagnoseChange 主诊断单选按钮状态改变] */
  changediagnoseType(e){
    this.setState({
      repeatDiagnose: e.target.value
    });
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  /** [addWestMedicineData 添加西医诊断] */
  addWestMedicineData(e){
    let { repeatDiagnose, mainDiagnose, doubleDiagnose } = this.state;
    let addIllByDiagnose = this.addIllByDiagnose.getSelectedData();
    let diagnoseDataItem = {
      order: this.state.diagnoseData.length + 1,
      diagnosisCode: addIllByDiagnose.diacode,
      diagnosisName: addIllByDiagnose.dianame,
      diagnosisWay: 0,
      diagnosisType: repeatDiagnose,
      mainDiaType: mainDiagnose ? '是' : '否', // 01是 02 否
      doubtDiaType: doubleDiagnose? '是' : '否', // 01是 02 否
      doctorname: window.sessionStorage.getItem('username'),
    };
    console.log(diagnoseDataItem);
    this.addIllData(diagnoseDataItem, 0);
    //诊断信息
    let diagnoseFinaleInfoItem = JSON.parse(JSON.stringify(addIllByDiagnose));
    diagnoseFinaleInfoItem.buDiagnosisDismainfList = [];
    diagnoseFinaleInfoItem.diagnosisName = diagnoseFinaleInfoItem.dianame;
    diagnoseFinaleInfoItem.diagnosisCode = diagnoseFinaleInfoItem.diacode;
    diagnoseFinaleInfoItem.diagnosisWay = 0;
    diagnoseFinaleInfoItem.diagnosisType = repeatDiagnose;
    diagnoseFinaleInfoItem.mainDiaType = mainDiagnose ? '01' : '02';
    diagnoseFinaleInfoItem.doubtDiaType = doubleDiagnose  ? '01' : '02';

    let diagnoseFinaleInfo = this.state.diagnoseFinaleInfo;
    diagnoseFinaleInfo.push(diagnoseFinaleInfoItem);
    this.setState({ diagnoseFinaleInfo });
  };
  /** [save 从诊断数据对象提取要展示的文本然后将对象和文本都赋值给输入框] */
  save(diagnoseFinaleInfo){
    let text = getDiagnoseText(diagnoseFinaleInfo);
    console.log('diagnoseFinaleInfo', diagnoseFinaleInfo);
    let formValue = {
      originData: diagnoseFinaleInfo,
      extractionData: text
    };
    this.props.onChange(formValue); // 给输入框赋值，包含两部分，一部分是需要传往后台的对象，一部分是在输入框上显示的文本
    this.inputEnterPop.handleClose(); // 关闭弹窗
  };
  onChange(page, pageSize){
    console.log(page);
  };
  render() {
    let formItemProps = this.props;
    let { curTab , diagnoseHisData, symptomId, diagnoseData, repeatDiagnose, mainDiagnose, doubleDiagnose, diaCurPage, hisCurPage, diagnoseFinaleInfo} = this.state;
    let columns = this.getTableCol();
    Pagination_dia.total = diagnoseData.length;
    Pagination_dia.current = diaCurPage;
    Pagination_dia.onChange = (page, pageSize)=>{
      this.setState({ diaCurPage: page});
    }
    Pagination_his.total = diagnoseHisData.length;
    Pagination_his.current = hisCurPage;
    Pagination_his.onChange = (page, pageSize)=>{
      this.setState({ hisCurPage: page});
    }
    return (
      <InputEnterPop displayed = {this.initialData} formItemProps={formItemProps} ref={ref=>this.inputEnterPop = ref} title='诊断' icon='true'>
        <Container onClick={this.hideFloatLayer}>
          <Tab>
            <TabItem current={curTab} index={0} onClick={()=>{this.toggleTabs(0)}}>✍️中医诊断</TabItem>
            <TabItem current={curTab} index={1} onClick={()=>{this.toggleTabs(1)}}>📿西医诊断</TabItem>
          </Tab>
          <Content>
          {
            (curTab == 0)?
            <ChinaMedicine >
              <AddIllBySymptom  icon='true' ref={ref => this.addIllBySymptom = ref} placeholder='请输入病症中文关键字活拼音简写搜索' notify={this.getMessage}/>
              <AddIllByManifestations addChinaMedicineData={this.addChinaMedicineData} icon='true' ref={ref => this.addIllByManifestation = ref} placeholder='请输入病侯中文关键字货拼音简写搜索' symptomId={symptomId}/>
              <span>
                <Button type="primary" shape="circle" onClick={this.addChinaMedicineData} icon="plus"></Button>
              </span>
            </ChinaMedicine>
            :
            <WestMedicine>
              <RadioGroup value={repeatDiagnose} className='bordered' onChange={(e)=>{this.changediagnoseType(e)}}>
                <Radio value={1}>初步诊断</Radio>
                <Radio value={2}>确认诊断</Radio>
              </RadioGroup>
              <Check_box >
                <Checkbox checked={mainDiagnose} className='small' onChange={this.onMainDiagnoseChange}>&nbsp;主诊断</Checkbox>
                <Checkbox checked={doubleDiagnose} className='small' onChange={this.onDoubleDiagnoseChange}>&nbsp;疑似诊断</Checkbox>
              </Check_box>
              <AddIllByDiagnose ref={ref => this.addIllByDiagnose = ref} placeholder='请输入诊断拼音简码快速添加' addWestMedicineData={this.addWestMedicineData}/>
              <span>
                <Button type="primary" shape="circle" icon="plus" onClick={this.addWestMedicineData}></Button>
              </span>
            </WestMedicine>
          }
          </Content>
          <Middle>
            <Table
              rowClassName='row-height-24'
              dataSource={diagnoseData}
              columns={columns}
              locale={{emptyText: '暂无诊疗数据' }}
              pagination={Pagination_dia}/>
          </Middle>
          <History>
            <Header>
              <Title>
                📅历史诊断
              </Title>
              <Tip>
                💡双击下方历史诊断可加入到当前诊断信息中
              </Tip>
            </Header>
            <Table
              onRow={(record) => {
                return {
                  onDoubleClick: (e) => {
                    this.SelectedLine(record);
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  },       // 点击行
                };
              }}
              rowClassName={(record, index)=>{
                return 'row-height-24 ' + ((record.status) ? 'Selected' : 'unSelected');
              }}
              dataSource={diagnoseHisData}
              columns={columns.slice(0,8)}
              locale={{emptyText: '暂无诊疗数据' }}
              pagination={Pagination_his}/>
          </History>
          <Footer>
            <Button type="primary" className='semicircle' onClick={(e)=>{this.save(diagnoseFinaleInfo)}}>确定</Button>
            <Button type="primary" className='cancel' onClick={()=>{this.inputEnterPop.handleClose()}}>取消</Button>
          </Footer>
        </Container>
      </InputEnterPop>
    );
  }
}
const Container = styled.div`
  font-family: "MicrosoftYaHei Microsoft YaHei";
  background: rgba(242, 242, 242, 1);
  font-size: 13px;
  width: 770px;
`;
const Tab = styled.div`
  font-weight: 400;
  font-style: normal;
  font-family: 'MicrosoftYaHei', '微软雅黑';
  font-size: 12px;
  color: #333333;
  height: 40px;
  padding-top: 10px
`;
const TabItem = styled.span`
  padding: 10px;
  border-bottom: ${props => (props.index == props.current) ? '2px solid #0B6FCB' : '0px solid #0B6FCB'};
  margin: 10px;
  cursor: pointer
`;
const Middle = styled.div`
  height: 171px;
`;
const Content = styled.div`
  margin-top: 2px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  color: white;
  margin-bottom: 5px;
`;
const ChinaMedicine = Content.extend`
  padding: 0px 15px;
`;
const WestMedicine = Content.extend`
  padding: 0px 15px;
  height:
`;
const Check_box = styled.div`
  width: 350px;
  margin-left: 20px;
`;
const History = styled.div`
  margin-top: 10px;
  border-top: 1px solid #0A6ECB;
  height: 181px;
`;
const Header = styled.div`
  height: 25px;
  font-size: 12px;
  display: flex;
  align-items: center;
`;
const Title = styled.div`
  font-family: 'MicrosoftYaHei', '微软雅黑';
  color: #333333;
  margin-left: 15px;
`;
const Tip = styled.div`
  color: #009900;
  margin-left: 30px;
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  padding-bottom: 20px;
`;
/*
@作者：姜中希
@日期：2018-07-06
@描述：主诉组件，包含主诉输入框和弹框，弹框提供子元素即可
*/
