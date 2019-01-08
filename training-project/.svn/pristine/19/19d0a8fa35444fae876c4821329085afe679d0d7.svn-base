(function($) {    
    $.extend( {    
        frameTooltip:{    
            load : function(options) {    
                //自动设置属性    
                for(var item in options){    
                    AutoLoad[item]=options[item];    
                }    
                AutoLoad.load();    
            }
        }    
    });   
})(jQuery);  

//是否已经注册事件
var auto_sign = false;    

//自动加载数据    
var AutoLoad={    
  open: false,         //默认关闭 
  title: null,         //消息框标题
  data: null,          //要加载的数据
  load: function(){    //执行    
	  if(!AutoLoad.open) return;
	  if(auto_sign) return;//不允许重复注册事件
	  auto_sign = true;   
	  //创建显示内容
	  var msg = "";
	  //提示框距离页面底部的高度
	  var bottomHeight = 20;
	  for(var i in AutoLoad.data) {
		  if(AutoLoad.data[i].time) {
			  msg = "[" + AutoLoad.data[i].time + "] 有<a style='color:red;' onclick='AutoLoad.jump(this);' url='"+AutoLoad.data[i].linkUrl+"'>" + AutoLoad.data[i].linkName + "</a>需要处理";
		  }else{
			  msg = "有<a style='color:red;' onclick='AutoLoad.jump(this);' url='"+AutoLoad.data[i].linkUrl+"'>" + AutoLoad.data[i].linkName + "</a>需要处理";
		  }
		  
		  //打开并定义消息框
		  messager = $.messager.show({
				title:AutoLoad.title,
				msg: msg,
				height: 80,
				width:280,
				showType:'show',
				style:{
					left:'',
					right:0,
					top:'',
					bottom:bottomHeight
				}
		  });
		  
		  bottomHeight += 85;
	  }
	  
	  //消息框关闭后将注册事件设置为false
	  setTimeout("AutoLoad.unRegister();",4000);
  },
  
  //页面url跳转
  jump: function(dom) {
	  $("#centerHtml").attr("src",$(dom).attr("url"));
  },
  
  //将是否注册标志设置false
  unRegister : function () {
	  auto_sign = false; 
  }
};  