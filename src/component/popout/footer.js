import React, {Component, PropTypes} from 'react'; // react核心
import Button from 'antd/lib/button';
import 'antd/lib/button/style';

import customBT from '../antd/style/button.css';

export default class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  };
  render() {
    return (
      <div style={styles.footer}>
        <Button type="primary" style={styles.bt} className='semicircle'>确定</Button>
        <Button type="primary" style={styles.bt} className='cancel'>取消</Button>
      </div>
    )
  }
}
const styles = {
  footer: {
    height: 96,
    borderTop: '1px solid #E6E6E6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bt: {
    margin: 20
  }
}
/*
@作者：姜中希
@日期：2018-06-07
@描述：弹框底部动作按钮
*/
