import React, {Component, PropTypes} from 'react'; // react核心
import Tag from 'antd/lib/tag';
import Right from '../img/u1674.png';
import 'components/antd/style/tags.less';
import 'antd/lib/tag/style';
export default class CheckableTag extends Component {
  constructor(props){
    super(props);
    this.state = {
      checkable: false
    };
  };
  handleTagClick(e, checkable){
    let { id = '' } = this.props;
    this.setState({
      checkable: !checkable
    });
    this.props.onClick(e.target.innerText, !checkable, id);
  };
  render() {
    let checkable = this.state.checkable;
    let text = this.props.text;
    let color = this.props.color;
    return (
      <Tag color={color} className={color} onClick={(e)=>this.handleTagClick(e, checkable)}>
      {text}
      {checkable?<img src={Right} style={styles.clickable}/>:null}
      </Tag>
    )
  }
}
const styles  = {
  clickable: {
    position: 'absolute'
  }
}
/*
@作者：姜中希
@日期：2018-06-28
@描述：自定义一个可选中的tag
*/
