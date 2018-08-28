import {Toast} from 'antd-mobile-rn';
function start(config){
  config = config || {};
  let content = "Loading..." || config.content;
  let mask = config.mask || true;
  let {duration,onClose} = config;
  duration = duration || 100000;
  Toast.loading(content,duration,onClose,mask);
}

function stop(){
  Toast.hide()
}

export default {
  start,
  stop
}
