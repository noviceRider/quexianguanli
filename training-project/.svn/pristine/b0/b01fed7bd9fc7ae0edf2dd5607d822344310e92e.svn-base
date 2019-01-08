/**
 * 根据传入的数据和模板渲染页面
 */
(function(){
	//方法列表
	var methods={
		/**
		 *在调用插件的DIV中根据模板文件进行数据展示 
		 *@param tempOptions ejs文件属性，包括路径(url)、是否缓存(cache)等
		 *@param data  展示的数据
		 *@param clickEvt 模板中所有有点击事件的控件的点击事件函数集合
		 */
		cardList:function(options){
			//构造默认参数
			var defaults={
				data:null,
				tempOptions:null,
				clickEvt:null
			};
			
			//用户参数覆盖默认参数 
			var settings = $.extend({}, defaults, options);
			
			//保证链式调用
			return this.each(function(){
				//构造script放入data，渲染页面是将jsvascript及函数加入到页面当中
				var script="<script>";
				for(var fn in settings.clickEvt){
					script+=settings.clickEvt[fn];
				}
				script+="</script>";
				settings.data.script=script;
				
				//通过数据生成HTML字符串
				var htmlStr=new EJS(settings.tempOptions).render(settings.data);
				//将html字符串加入调用插件的div中
				
				$(this).html(htmlStr);
			});
		}
	};
	
	$.fn.cardList=function(){
		
		var method = arguments[0];
		  
	    if(methods[method]) {
	        method = methods[method];
	
	        // 我们的方法是作为参数传入的，把它从参数列表中删除，因为调用方法时并不需要它
	        arguments = Array.prototype.slice.call(arguments, 1);
	    } else if( typeof(method) == 'object' || !method ) {
	        method = methods.init;
	    } else {
	        $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
	        return this;
	    }
	
	    // 用apply方法来调用我们的方法并传入参数
	    return method.apply(this, arguments);		
	};
	
})(jQuery);