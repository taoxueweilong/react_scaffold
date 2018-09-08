// 全屏函数 注：该函数需要在用户触发函数的1S内执行否则user gesture被当作普通函数
// 参数是需要全屏的元素
function fullScreen(full){
  let isFullscreen = document.webkitIsFullScreen;
  // 全屏
  if(full.webkitRequestFullscreen && !isFullscreen){
    full.webkitRequestFullscreen();            //谷歌浏览器
  }
  else if(full.requestFullscreen && !isFullscreen) {
    full.requestFullscreen();
  }else if (full.msRequestFullscreen && !isFullscreen) {
    full.msRequestFullscreen();      //IE浏览器
  }else if (full.mozRequestFullScreen && !isFullscreen) {
    full.mozRequestFullScreen();           //火狐浏览器
  }
  // 退出全屏
  if(isFullscreen){
    // full.style.display = 'none';
    if(document.exitFullscreen){
      document.exitFullscreen();
    }else if(document.mozCancelFullScreen){
      document.mozCancelFullScreen();
    }else if(document.webkitExitFullscreen){
      document.webkitExitFullscreen();
    }
  }
};
export default fullScreen;
