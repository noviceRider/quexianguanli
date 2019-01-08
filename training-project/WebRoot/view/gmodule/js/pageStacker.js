/**
 * 页面切换插件
 */
(function(){
	//方法集合
	var methods={
		/**
		 *将调用插件的DIV创建为页面所有div管理和显示的容器
		 */
		pageStacker:function(){
			return this.each(function(){
				//将容器DIV充满body
				$(this).css({
					width:"99%",
					height:"98%",
					position:"absolute"
				});
				
				//将容器中所有DIV隐藏并充满容器
				$(this).children("div").css({"display":"none","width":"100%","height":"100%"});
				//显示带有mainPage属性的DIV
				$("div[mainPage=true]").css({"display":"block"});
			});
		},
		
		/**
		 *切换容器中显示的DIV 
		 *@param selector 需要进行显示的DIV选择器
		 */
		openPage:function(selector){

			//显示传入的选择器代表的DIV
			$(this).children("div").css("display","none");
			$(selector).css("display","block");
		}
		
	};
	
	$.fn.pageStacker=function(){
		
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