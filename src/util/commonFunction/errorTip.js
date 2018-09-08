/**
 * [lackFuncProp 当组件需要一个函数props但是没有给组件提供时调用这个函数，提示开发人员]
 * @param  {[string]} componentName [当前组件名称]
 * @return {[void]}               [description]
 */
function lackFuncProp(componentName='组件'){
  console.log(componentName,'缺少函数props，请提供');
};

export default lackFuncProp;
