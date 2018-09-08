import React, {Component} from 'react';
import styled from 'styled-components';
import Popout from 'components/popout/basePop';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import AddSmartCure from './addSmartCure';
import Pagination_CHM from 'components/antd/components/pagination';
import Pagination_CPM from 'components/antd/components/pagination';
import Pagination_ProTech from 'components/antd/components/pagination';
import 'antd/lib/button/style';
import 'components/antd/style/button.css';
import Lightning from '../img/lightning.png';
import getResource from 'commonFunc/ajaxGetResource';

class SmartCure extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      curTab: 0, // 当前标签页
      visibleAddPop: false,
      data_CHM: [], // 中草药表格数据项
      data_CPM: [], //中成药表格数据项
      data_ProTech: [], // 适宜技术表格数据项
      total_CHM: 0, // 中草药数据总数量
      total_CPM: 0, // 中成药数据总数量
      total_ProTech: 0, // 适宜技术数据总数量
      current__CHM: 0, // 中草药数据当前页码
      current__CPM: 0, // 中成药数据当前页码
      current__ProTech: 0, // 适宜技术数据当前页码
    }
    this.closeAddPop = this.closeAddPop.bind(this);
    this.sureAddPop = this.sureAddPop.bind(this);
  };
  componentWillMount(){
    this.getServiceData();
  };
  toggleTabs(key) {
    this.setState({
      curTab: key
    });
  }
  addCase(e){
    console.log(0);
    this.setState({
      visibleAddPop: true
    });
  };
  closeAddPop(){
    this.setState({
      visibleAddPop: false
    });
  };
  sureAddPop(){
    this.setState({
      visibleAddPop: false
    });
    console.log('确定添加');
  };
  getColumns(){ // 定义各个表格的表头项
    let columns_CHM = [{ // 中草药表格的表头项
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      className: 'custom'
    }, {
      title: '疾病/病侯',
      dataIndex: 'ill',
      key: 'ill',
      align: 'left',
      className: 'custom'
    }, {
      title: '代表处方',
      dataIndex: 'recipe',
      key: 'recipe',
      align: 'left',
      className: 'custom'
    }, {
      title: '药单',
      dataIndex: 'drugBill',
      key: 'drugBill',
      align: 'left',
      className: 'custom'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      className: 'custom',
      render: ()=>{
        return <Button type="primary" className='semicircle small' onClick={()=>{this.addCase()}}>+添加</Button>
      }
    }];
    const columns_CPM = [{ // 中成药表格的表头项
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      className: 'custom'
    }, {
      title: '疾病/病侯',
      dataIndex: 'ill',
      key: 'ill',
      align: 'left',
      className: 'custom'
    }, {
      title: '代表处方',
      dataIndex: 'recipe',
      key: 'recipe',
      align: 'left',
      className: 'custom'
    }, {
      title: '药单/治疗方法',
      dataIndex: 'drugBill',
      key: 'drugBill',
      align: 'left',
      className: 'custom'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      className: 'custom',
      render: ()=>{
        return <Button type="primary" className='semicircle small' onClick={()=>{this.addCase()}}>+添加</Button>
      }
    }];
    const columns_ProTech = [{ // 适宜技术表格的表头项
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      className: 'custom'
    }, {
      title: '疾病/病侯',
      dataIndex: 'ill',
      key: 'ill',
      align: 'left',
      className: 'custom'
    }, {
      title: '特色治疗项目',
      dataIndex: 'recipe',
      key: 'recipe',
      align: 'left',
      className: 'custom'
    }, {
      title: '治疗方法',
      dataIndex: 'drugBill',
      key: 'drugBill',
      align: 'left',
      className: 'custom'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      className: 'custom',
      render: ()=>{
        return <Button type="primary" className='semicircle small' onClick={()=>{this.addCase()}}>+添加</Button>
      }
    }];
    return {'columns_CHM':columns_CHM, 'columns_CPM':columns_CPM, 'columns_ProTech':columns_ProTech};
  };
  getServiceData(){
    const data_CHM = [{
      key: '1',
      order: '1',
      ill: '感冒/风热感冒',
      recipe: '金银花主方',
      drugBill: '金银花、连翘、薄荷、荆芥、淡豆鼓、牛蒡厂、桔梗、淡竹叶、甘草'
    }, {
      key: '2',
      order: '2',
      ill: '感冒/风热感冒',
      recipe: '银翘散',
      drugBill: '连翘、银花、桔梗、薄荷、竹叶、生甘草、荆芥穗、淡豆豉、牛蒡子'
    }, {
      key: '3',
      order: '3',
      ill: '高血压/原发性高血压',
      recipe: '黄精秘法',
      drugBill: '黄精、夏菇草、益母草、车前草、狶签草'
    }
    , {
      key: '4',
      order: '4',
      ill: '高血压/原发性高血压',
      recipe: '黄精秘法',
      drugBill: '黄精、夏菇草、益母草、车前草、狶签草'
    }
    , {
      key: '5',
      order: '5',
      ill: '高血压/原发性高血压',
      recipe: '黄精秘法',
      drugBill: '黄精、夏菇草、益母草、车前草、狶签草'
    }];
    const data_CPM = [{
      key: '1',
      order: '1',
      ill: '感冒/风热感冒',
      recipe: '感冒灵冲剂',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }, {
      key: '2',
      order: '2',
      ill: '感冒/风热感冒',
      recipe: '感冒灵冲剂',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }, {
      key: '3',
      order: '3',
      ill: '高血压/原发性高血压',
      recipe: '感冒灵冲剂',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }
    , {
      key: '4',
      order: '4',
      ill: '高血压/原发性高血压',
      recipe: '感冒灵冲剂',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }
    , {
      key: '5',
      order: '5',
      ill: '高血压/原发性高血压',
      recipe: '感冒灵冲剂',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }];
    const data_ProTech = [{
      key: '1',
      order: '1',
      ill: '感冒/风热感冒',
      recipe: '拔罐',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }, {
      key: '2',
      order: '2',
      ill: '感冒/风热感冒',
      recipe: '拔罐',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }, {
      key: '3',
      order: '3',
      ill: '高血压/原发性高血压',
      recipe: '拔罐',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }
    , {
      key: '4',
      order: '4',
      ill: '高血压/原发性高血压',
      recipe: '拔罐',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }
    , {
      key: '5',
      order: '5',
      ill: '高血压/原发性高血压',
      recipe: '拔罐',
      drugBill: '感冒灵冲剂、甘草片 / 口服'
    }];
    this.setState({data_CHM, data_CPM, data_ProTech});
  };
  handleClose(){
    this.setState({visible: false});
  };
  handleOk(){
    this.setState({visible: false});
  };
  handleOpen(){
    this.setState({visible: true});
  };
  render() {
    let { visible , visibleAddPop } =  this.state;
    let {curTab, data_CHM, data_CPM, data_ProTech} = this.state;
    let {columns_CHM, columns_CPM, columns_ProTech} = this.getColumns(); // 获取中草药表格的列
    let {total_CHM, total_CPM, total_ProTech, current__CHM, current__CPM, current__ProTech} = this.state;

    Pagination_CHM.total = total_CHM;
    Pagination_CPM.total = total_CPM;
    Pagination_ProTech.total = total_ProTech;

    return (
      <Popout visible={visible} title='智能诊疗' onClose={()=>{this.handleClose()}}>
        <Body>
          <div>
            <Tab>
              <TabItem current={curTab} index={0} onClick={()=>{this.toggleTabs(0)}}>🔍中草药（12）</TabItem>
              <TabItem current={curTab} index={1} onClick={()=>{this.toggleTabs(1)}}>🔍中成药（14）</TabItem>
              <TabItem current={curTab} index={2} onClick={()=>{this.toggleTabs(2)}}>🔍适宜技术（4）<img src={Lightning} /></TabItem>
            </Tab>
            <Content>
            {
              (curTab == 0)?
              <Table columns={columns_CHM} dataSource={data_CHM} pagination={Pagination_CHM}/>
              :
              ((curTab == 1)?
              <Table columns={columns_CPM} dataSource={data_CPM} pagination={Pagination_CPM}/>
              :
              <Table columns={columns_ProTech} dataSource={data_ProTech} pagination={total_ProTech}/>
            )
            }
            </Content>
          </div>
          <div>
            <Case>
              <TabItem current={0} index={0} onClick={()=>{this.toggleTabs(0)}}>🔘我的诊疗方案</TabItem>
            </Case>
            <Content>
               <Table columns={columns_ProTech} dataSource={data_ProTech} pagination={Pagination_CPM}/>
            </Content>
            <AddSmartCure visible={visibleAddPop} onClose={this.closeAddPop} onOk={this.sureAddPop} title='智能推方/添加到我的处方'>
            </AddSmartCure>
          </div>
          <Footer>
            <Button type="primary" className='semicircle' >生成医嘱</Button>
            <Button type="primary" className='cancel' onClick={()=>{this.handleClose()}}>取消</Button>
          </Footer>
        </Body>
      </Popout>
    );
  }
}
const Body = styled.div`
  width: 910px;
  ${'' /* height: 610px; */}
  color: #0A6ECB;
  background: rgba(242, 242, 242, 1);
`;
const Tab = styled.div`
  font-weight: 400;
  height: 40px;
  font-size: 12px;
  padding-top: 10px
`;
const Case = Tab.extend`
  margin-top: -20px;
  color: #333333
`;
const TabItem = styled.span`
  padding: 10px;
  border-bottom: ${props => (props.index == props.current) ? '1px solid #0B6FCB' : '0px solid #0B6FCB'};
  margin: 10px;
  cursor: pointer
`;
const Content = styled.div`
  margin-top: 10px;
  border-top: 1px solid #D7D7D7
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  padding-bottom: 20px;
`;
/*
@作者：姜中希
@日期：2018-07-02
@描述：只能诊疗弹框
*/
export default SmartCure;
