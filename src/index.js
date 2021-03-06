import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable'; // 加载时进行模块分离
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { injectGlobal } from 'styled-components';

// 全局样式
injectGlobal`
  @font-face {
    font-family: 'MicrosoftYaHei', '微软雅黑';
  }
  div, span, p, a, strong {
    font-weight: 400;
    font-style: normal;
  }
  body,ul,h1,h2,h3,h4,h5,h6,form,input,textarea,button,p{margin:0;padding:0}
  @charset "utf-8";html {
  	color:#000;
  	font-size: 12px;
  }
  h1,h2,h3,h4,h5,h6,b,strong {
  	font-weight:normal
  }
  i,em {
  	font-style: normal;
  }
`;

const loadingComponent = () => (<div>Loading...</div>);

const Login = Loadable({
  loader: () => import('./container/login'),
  loading: loadingComponent,
});

const App = () => (
  	<BrowserRouter>
	    <Switch>
        <Route path='/' render={()=><Redirect to="/login"/>} exact></Route>
	    	<Route path='/login' component={Login}></Route>
	    </Switch>
  	</BrowserRouter>
);
ReactDOM.render(
    <App />,
    document.getElementById('app')
);
if (module.hot) {
  module.hot.accept();
}
/*
@作者：姜中希
@日期：2018-06-05
@描述：入口文件，定义了根路由，引入了根组件
*/
