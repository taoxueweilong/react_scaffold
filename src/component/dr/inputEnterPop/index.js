 import React, {Component} from 'react'; // react核心
import styled from 'styled-components';
import PropTypes from 'prop-types';
import search from '../img/search.jpg';
import Popout from 'components/popout/basePop';

export default class InputSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: '', // 选中或者输入的值
    };
    this.handleClose = this.handleClose.bind(this);
  };
  /** [handleEnterPress 包括enter显示，esc隐藏的判断函数] */
  handleEnterPress = (e) => {
    let dom = null;
    if(e.keyCode == 9 && this.props.title == '患者主诉'){ // enter
      dom = document.getElementById('hpi');
      dom.click()
    }
    if(e.keyCode == 9 && this.props.title == '治疗原则'){ // enter
      dom = document.getElementById('suggession');
      console.log(dom);
      dom.click()
    }
    if(e.keyCode == 13){ // enter
      this.setState({visible:true});
      this.props.displayed(); // 通知父组件已显示弹框
    }
    if(e.keyCode == 27){ // ESC
      this.setState({visible:false});
    }
    // e.preventDefault();// 阻止冒泡
    // return false;
  };
  handleClose(){
    this.setState({visible: false});
  };
  handleOpen(){
    this.setState({visible: true});
  };
  render() {
    let {visible, value} = this.state;
    let {icon , placeholder = '', title, id} = this.props;
    return (
      <div>
        <Input {...this.props.formItemProps} id={id} onKeyDown={this.handleEnterPress}/>
        <Sign onClick={()=>{this.handleOpen()}}/>
        <Popout visible={visible} title ={title} onClose={this.handleClose}>
          {this.props.children}
        </Popout>
      </div>
    )
  }
}
const Sign = styled.img.attrs({
  src: search
})`
  width: 20px;
  height: 20px;
  position: absolute;
  margin-top: 11px;
  margin-left: -25px;
  width: 20px;
  margin-top: 10px;
`;
const Input = styled.input.attrs({
  type: 'text',
  icon: 0,
  autoComplete: "off",
  placeholder: props => props.placeholder
})`
  border-bottom: : 1px solid rgba(215, 215, 215, 1);
  border-top: none;
  border-left: none;
  border-right: none;
  line-height: 25px;
  color: black;
  width: 100%;
  background: transparent;
  margin-top: 10px;
  font-size: 12px;
  &:focus {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    outline: none
  }
`;
InputSelect.propTypes = {
  icon: PropTypes.string,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  displayed: PropTypes.func,
  formItemProps: PropTypes.object
};
/*
@作者：姜中希
@日期：2018-06-07
@描述：
1.一个输入框组件，键入enter时会有弹框，ESC弹框关闭
2.根据提供的属性来判断是否提供弹框，具体属性请看proptypes
3.使用时结合antd form表单, 使用参考src\container\layout\body\center\content\treatManage\treatment\treatmentList\index.js
*/
