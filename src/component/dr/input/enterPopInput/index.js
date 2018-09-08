import React, {Component} from 'react'; // react核心
import styled from 'styled-components';
import PropTypes from 'prop-types';
import search from '../../img/search.jpg';
import Popout from 'components/popout/basePop';

export default class InputSelect extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: '', // 选中或者输入的值
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  };
  /** [handleEnterPress 包括enter显示，esc隐藏的判断函数] */
  handleEnterPress = (e) => {
    let dom = null;
    if(e.keyCode == 9 && this.props.title == '患者主诉'){ // 强制切换到现病史框
      dom = document.getElementById('hpi');
      dom.click()
    }
    if(e.keyCode == 13){ // enter
      this.setState({visible:true});
      this.props.displayed(); // 通知父组件已显示弹框
    }
    if(e.keyCode == 27){ // ESC
      this.setState({visible:false});
    }
  };
  /** [handleClose 弹框关闭事件] */
  handleClose(){
    this.setState({visible: false});
  };
  /** [handleOpen 弹框打开事件] */
  handleOpen(){
    this.setState({visible: true});
  };
  render() {
    let { visible } = this.state;
    let { icon , placeholder = '', title = '标题', id } = this.props;
    let { value, ...other } = this.props.formItemProps; // 表单属性
    return (
      <div>
        <Input {...other} value={value.extractionData} id={id} onKeyDown={this.handleEnterPress}/>
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
  cursor: pointer;
`;
const Input = styled.input.attrs({
  type: 'text',
  icon: 0,
  placeholder: props => props.placeholder
})`
  border-bottom: 1px solid rgba(215, 215, 215);
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
@日期：2018-08-10
@描述：
1.一个输入框组件，键入enter时会有弹框，ESC弹框关闭
2.根据提供的属性来判断是否提供弹框，具体属性请看proptypes
3.使用时结合antd form表单,src\container\layout\body\center\content\treatManage\treatment\drAdviceManage\chHerbalMedicine\diagnose\index.js
*/
