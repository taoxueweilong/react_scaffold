import { Modal } from 'antd';
import jQuery from 'jquery';

function getResource(params , success, error ){
  const { type = 'get', dataType = 'JSON',contentType = 'application/json;charset=UTF-8', async = true} = params;
  jQuery.ajax({
    type: type,
    url: config_InteLigenTreat_url + params.url,
    dataType: dataType,
    contentType: contentType,
    traditional: true, // 可以传递数组参数
    data : params.data,
    async : async,
    success: success,
    error : error
  });
}

export default getResource;
/*
@作者：姜中希
@日期：2018-06-06
@描述：ajax函数的封装，在需要的地方引入即可,提供部分默认值
*/
