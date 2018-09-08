import React, {Component} from 'react';
import styled from 'styled-components';
import Tag from 'antd/lib/tag';
import Input from 'antd/lib/input';
import InputEnterPop from 'components/dr/inputEnterPop';
import 'components/antd/style/tags.less';
import 'components/antd/style/input.less';
import ajaxGetResource from 'commonFunc/ajaxGetResource';

export default class CurePriciple extends Component {
  constructor(props){
    super(props);
    this.state = {
      key: '',
      keys: [], // 关键词列表
      curePrincipleData: [], // 主症列表
      totalLines: 0, // 查询结果总行数
      curLine: 0, // 当前行,从0开始，-1表示未选中任何行
    };
    this.initialData = this.initialData.bind(this);
  };
  initialData(){
    this.getKeysData();
    this.getCurePrinciple('');
  };
  /** [getKeysData 请求关键词列表] */
  getKeysData(){
    console.log('请求关键词');
    let self = this;
    let params = {
      url: 'BaEnteritemKeywordController/getList',
      data: {
        itemFieldname: '治疗原则',
      },
    };
    function callBack(res){
      if(res.result){
        let keys = res.data.map((item)=>{
          return item.keyword
        });
        self.setState({keys});
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  /** [getPrimarySym 请求主症列表] */
  getCurePrinciple(key){
    let self = this;
    let params = {
      url: 'BaEnteritemDictController/getList',
      data: {
        keyword: key,
        itemFieldname: '治疗原则',
      },
    };
    function callBack(res){
      if(res.result){
        let curePrincipleData = res.data.map((item)=>{
          return item.itemcontent
        });
        let totalLines = curePrincipleData.length;
        self.setState({key, curePrincipleData, totalLines});
      }else{
        console.log('异常响应信息', res);
      }
    };
    ajaxGetResource(params, callBack);
  };
  /** [filter 对输入的关键词进行过滤的函数] */
  filter = (value) => {
    this.getCurePrinciple(value);
  }
  /** [selectText 选中某行文本接下来要显示在父组件输入框中] */
  selectText = (text) => { //
    this.props.onSelectLine(text, '治疗原则');
  };
  /** [handleTagInput 选择标签，接下来应该将标签赋值给输入框] */
  handleTagInput(e){
    this.filter(e.target.innerText);
  };
  /** [handleTagInput 选择标签，接下来应该将标签赋值给输入框] */
  handleTagInput(e){
    this.filter(e.target.innerText);
  };
  /** [handleEnterPress 包括enter显示，esc隐藏的判断函数] */
  handleEnterPress = (e) => {
    if(e.keyCode == 27){ // ESC
      this.inputEnterPop.handleClose();
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
        let curePrincipleData = this.state.curePrincipleData;
        this.selectText(curePrincipleData[curLine]);
        break;
      case 39:         // 向右箭头，取消选中当前行
        break;
    };
    this.setState({ curLine });
  };
  render() {
    let formItemProps = this.props;
    let { key, keys, curePrincipleData, curLine } = this.state;
    return (
      <InputEnterPop tabIndex='2' displayed = {this.initialData} formItemProps={formItemProps} ref={ref=>this.inputEnterPop = ref} title='治疗原则' icon='true'>
        <Container>
          <Header>
            <Key>主症：</Key>
            <Input autoFocus='autofocus' onKeyDown={this.handleEnterPress}  className='not-draggable semicircle' onChange={(e)=>{this.filter(e.target.value)}} value={key}/>
          </Header>
          <Result>
          {
            curePrincipleData.map((item, index)=><Line key={index} selected={(index == curLine)?'selected':'unselected'}  onClick={(e)=>{this.selectText(e.target.innerText)}}>{item}</Line>)
          }
          </Result>
          <Footer>
            <p>🏷常用搜索标签</p>
            <KeyList className='semicircle'>
              {
                keys.map((item, index)=>{
                  return <Tag key={index} color="#f50" onClick={(e)=>this.handleTagInput(e)}>{item}</Tag>
                })
              }
            </KeyList>
          </Footer>
        </Container>
      </InputEnterPop>
    );
  }
}
const Container = styled.div`
  font-family: "MicrosoftYaHei Microsoft YaHei";
  background: rgba(242, 242, 242, 1);
  font-size: 13px
`;
const KeyList = styled.div`
  margin-top: 20px;
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
  width: 60px
`;
const Result = styled.div`
  height: 200px;
  background-color: #FFFFFF;
`;
const Line = styled.div`
  background-color: ${props=>(props.selected == 'selected')?'rgb(117, 171, 222)': 'white'};
  color: ${props=>(props.selected == 'selected')?'white': 'rgba(0, 0, 0, 0.65)'};
  padding: 3px 10px;
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    background-color: rgba(10, 110, 203, 1);
  }
`;
const Footer = styled.div`
  display: block;
  width: 400px;
  font-weight: 400;
  color: #666666;
  padding: 10px;
  font-size: 12px
`;
/*
@作者：姜中希
@日期：2018-07-09
@描述：治疗组件，包含主诉输入框和弹框，弹框提供子元素即可
*/
