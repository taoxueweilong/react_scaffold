import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';
import TextareaEnterPop from 'components/dr/textareaEnterPop';
import Loading from 'components/dr/loading';
import ajaxGetResource from 'commonFunc/ajaxGetResource';

export default class IllHistory extends Component{
  constructor(props){
    super(props);
    this.state = {
      key: '', //关键词
      illHistoryList: [] , // 病史列表
      loaded: false, // 数据是否加载
      totalLines: 0, // 查询结果总行数
      curLine: 0, // 当前行,从0开始，-1表示未选中任何行
    };
    this.initialData = this.initialData.bind(this);
  };
  initialData(title){
    this.getillHistory('', title);
  };
  /** [getPrimarySym 请求主症列表] */
  getillHistory(key, title){
    let self = this;
    let params = {
      url: 'BaEnteritemDictController/getList',
      data: {
        keyword: key,
        itemFieldname: title,
      },
    };
    function callBack(res){
      if(res.result){
        let illHistoryList = res.data.map((item)=>{
          return item.itemcontent
        });
        let loaded = true;
        let totalLines = illHistoryList.length;
        self.setState({key, illHistoryList, loaded, totalLines});
      }else{
        console.log('异常响应信息', res);
      }
    };
    this.setState({loaded: false}); // 状态重置
    ajaxGetResource(params, callBack);
  };
  /** [filter 对输入的关键词过滤然后更新结果显示] */
  filter = (e, title) => {
    this.getillHistory(e.target.value, title);
  }
  /** [selectText 选中结果显示的某行后将选中结果传给formitem] */
  selectText = (e) => { // 选中某行
    this.props.inputTextByTab(e, this.props.title);
  };
  /** [handleEnterPress 包括enter显示，esc隐藏的判断函数] */
  handleEnterPress = (e) => {
    if(e.keyCode == 27){ // ESC
      this.textareaEnterPop.handleClose();
      e.preventDefault();// 阻止冒泡
      return false;
    }
    let curLine = this.state.curLine;
    let totalLines = this.state.totalLines;
    switch(e.keyCode){
      case 40:         // 向下箭头, 选择下一行
        if(curLine >= totalLines-1){
          curLine = 0;
        }else{
          curLine++;
        }
        break;
      case 38:         // 向上箭头，选择上一行
        if(curLine <= 0){
          curLine = totalLines-1;
        }else{
          curLine--;
        }
        break;
      case 13:         // enter，选中当前行
        let illHistoryList = this.state.illHistoryList;
        this.selectText(illHistoryList[curLine]);
        break;
      case 39:         // 向右箭头，取消选中当前行
        break;
    };
    this.setState({ curLine });
  };
  render(){
    let formItemProps = this.props;
    let { illHistoryList, key, loaded, curLine } = this.state;
    return(
      <TextareaEnterPop formItemProps={formItemProps} displayed={this.initialData} ref={ref=>this.textareaEnterPop = ref}>
        <Container>
          <Header>
            <Key>关键词：</Key>
            <InputKeyWord className='not-draggable' autoFocus='autofocus' onKeyDown={this.handleEnterPress} value={key} onChange={(e)=>{this.filter(e, formItemProps.title)}}/>
          </Header>
          <Linelist innerRef={ref => this.result = ref} onKeyDown={this.handleEnterPress}>
          {
            (loaded == 1) ?
            illHistoryList.map((item, index)=>{
                return <Line key={index} selected={(index == curLine)?'selected':'unselected'} onClick={(e)=>{this.selectText(e.target.innerText)}}>{item}</Line>
            })
            :
            <Loading />
          }
          </Linelist>
        </Container>
      </TextareaEnterPop>
    )
  }
}
const Container = styled.div`
  font-family: 'MicrosoftYaHei', 'Microsoft YaHei';
  background: rgba(242, 242, 242, 1);
  font-size: 13px
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 400px;
  padding: 0px 20px
`;
const Key = styled.div`
  width: 75px
`;
/** @type {[type]} [圆角输入框] */
const InputKeyWord = styled(Input)`
  border-radius: 15px !important;
  outline: none
`;
const Linelist = styled.div`
  &{...props};
  padding-bottom: 20px;
  background-color: white;
  height: 200px;
`;
const Line = styled.div`
  background-color: ${props=>(props.selected == 'selected')?'rgb(117, 171, 222)': 'white'};
  color: ${props=>(props.selected == 'selected')?'white': 'rgba(0, 0, 0, 0.65)'};
  padding: 3px 5px;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    background-color: rgb(117, 171, 222);
    color: white;
  }
`;
