import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Draggable from 'react-draggable'; // The default
import Radium from 'radium';

import 'components/antd/style/button.css';

class PopoutContainer extends Component {
  constructor(props){
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.cancelHandle = this.cancelHandle.bind(this);
    this.handleOK = this.handleOK.bind(this);
  };
  handleClose(e){
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.onClose();
  };
  handleOK(){
    this.props.onOk();
  };
  cancelHandle(e){
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  render() {
    let {visible, children, onOk, title} = this.props;
    // let scrollBar = document.body;
    // scrollBar.style.overflow = (visible)?'hidden':'scroll';
    // scrollBar.style.overflowX = 'hidden';
    return (
      <div>
      {
        !!!visible?null:
        (
          <div style={styles.container} onClick={this.handleClose} className='basePop'>
          <div style={styles.pannel} className="handle" onClick={this.cancelHandle}>
            <div style={styles.header} className='header'>
              <span>{title}</span>
              <div className='close' onClick={this.handleClose} >
              ╳
              </div>
            </div>
            <div>
                {children}
            </div>
            {
              !!!onOk?null:
              (
                <div style={styles.footer} className='footer'>
                  <Button type="primary" style={styles.bt} className='semicircle' onClick={this.handleOK}>确定</Button>
                  <Button type="primary" style={styles.bt} className='cancel' onClick={this.handleClose}>取消</Button>
                </div>
              )
            }
          </div>
          </div>
        )
      }
      </div>
    );
  }
}
const styles = {
  container:{
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 2,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pannel: {
    backgroundColor: '#FFFFFF',
    minWidth: '20%',
    borderRadius: '16px 16px 0px 0px'
  },
  header: {
    borderRadius: '12px 12px 0px 0px',
    height: 35,
    fontWeight: 400,
    backgroundColor: '#0A6ECB',
    display: 'flex',
    paddingLeft: 12,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white'
  },
  footer: {
    height: 96,
    borderTop: '1px solid #E6E6E6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}
/*
@作者：姜中希
@日期：2018-06-06
@描述：自定义一个弹框组件， 只包含基础功能包括半透明背景，头部标题，关闭按钮，显示、隐藏的回调函数，
如果组件定义了onOk属性那么底部会有动作按钮，否则动作按钮是null
*/
const Popout = Radium(PopoutContainer);
export default Popout;
