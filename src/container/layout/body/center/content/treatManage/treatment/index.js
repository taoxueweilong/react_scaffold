import React, {Component} from 'react';
import Tabs from 'antd/lib/tabs';
import TreatmentList from './treatmentList';
import DrAdviceManage from './drAdviceManage';
import 'components/antd/style/tabs.less';

const TabPane = Tabs.TabPane;

export default class Treatment extends Component {
  constructor(props){
    super(props);
  };
  render() {
    return (
      <Tabs defaultActiveKey="2" tabPosition='left' className='tabs' animated={false}>
        <TabPane tab="✍️书写诊疗单" key="1">
          <TreatmentList onChange={this.props.onChange}/>
        </TabPane>
        <TabPane tab="✍️医嘱管理" key="2">
          <DrAdviceManage />
        </TabPane>
      </Tabs>
    );
  }
}
/*
@作者：姜中希
@日期：2018-06-25
@描述：诊疗容器（书写诊疗单、医嘱管理）
*/
