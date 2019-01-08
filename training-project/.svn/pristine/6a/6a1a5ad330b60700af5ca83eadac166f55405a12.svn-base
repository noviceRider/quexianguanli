/**
 * 根据JSON或url构造单选框
 */
(function(){
	//方法集合
	var methods={
		/**
		 *构造页面控件 根据url或JSON生成一组单选框 
		 *@param data 需要展示的JSON数据
		 *@param name 指定radio的name属性值
		 *@param id 指定插件DIV控件的ID属性值
		 *@param url 获取展示数据的URL地址
		 *@param params 请求数据的参数
		 *@param method 请求数据的方式 get或method
		 *@param async 是否异步请求、
		 *@param onSelect 选中一项时触发的函数
		 *@param valKey 对象作为radio控件value值得属性
		 *@param textKey 对象显示在页面上的属性
		 *@param width 页面控件跨宽度
		 *@param height 页面控件高度
		 */
		radioGroup:function(options){
			//获取调用插件的控件ID属性值作为插件内控件命名标识 保证插件内控件命名唯一性
			var basic=$(this).attr("id");
			
			//设定参数默认值
			var defaults={
				width:"500px",
				url:"",
				method:"post",
				params:null,
				async:true,
				name:basic+"defalutName",
				id:basic+"defalutId",
				valKey:null,
				textKey:null,
				data:{},
				onSelect:null,
				height:"200px"
			};
			
			//获取用户传入的参数并覆盖默认参数
			var settings = $.extend({}, defaults, options);
			
			//获取用户设定的ID属性值作为插件内控件的命名标识
			var basicName=$(this).attr("id");
			
			//返回自身以保证链式调用效果
			return this.each(function(){
				//设置页面控件属性和样式
				
				//设置属性
				//$(this).attr("id",settings.id);
				
				//设置样式
				$(this).css({
					"width":settings.width,
					"height":settings.height
				});
				
				//div的HTML内容，将数据和单选框展示在页面上
				var infoStr="";
				
				//获取用户传入的数据 或根据用户指定URL地址获取数据
				//判断用户设值方式（url或JSON数据）
				if(settings.url!=null){
					$.ajax({
						url:settings.url,
						method:settings.method,
						data:settings.params,
						async:settings.async,
						success:function(data){
							//将用户传入的data中的数据和url获取的数据合并
							if(settings.data!=null){
								for(var i=0;i<settings.data.length;i++){
									data.rows.push(settings.data[i]);
								}
							}
							
							//调用插件的DIV中进行数据展示
							for(var i=0;i<data.rows.length;i++){
								
								infoStr+="<span style='margin-right:10px;display:inline-block;width:100px;font-size:13px'><input representObj='"+JSON.stringify(data.rows[i])+"' id='"+basicName+"Radio"+i+"' style='position:relative;top:2px' type='radio' name='"+settings.name+"' value='"+data.rows[i][settings.valKey]+"'>"+data.rows[i][settings.textKey]+"</span>";
								
							}
							$("#"+basicName).html(infoStr);
							//执行用户传入的onSelect事件函数
							//onSelect函数预传用户点击单选框数据代表的对象
							$("#"+basicName+" input[type=radio]").click(function(){
								if(settings.onSelect!=null){
									for(var i=0;i<data.rows.length;i++){
										if(data.rows[i][settings.valKey]==this.value){
											settings.onSelect(data.rows[i]);
										}
									}
								}
							});
						}
					});
				}else{//若url为空data不为空
					if(settings.data!=null){
						//调用插件的DIV中进行数据展示
						for(var i=0;i<settings.data.length;i++){
							
							infoStr+="<span style='margin-right:10px;display:inline-block;width:100px;font-size:13px'><input style='position:relative;top:2px' type='radio' name='"+settings.name+"' value='"+settings.data[i][settings.valKey]+"'>"+settings.data[i][settings.textKey]+"</span>";
						}
						$("#"+basicName).html(infoStr);
						
						//执行用户传入的onSelect事件函数
						//onSelect函数预传用户点击单选框数据代表的对象
						$("#"+basicName+" input[type=radio]").click(function(){
							if(settings.onSelect!=null){
								for(var i=0;i<data.rows.length;i++){
									if(settings.data[i][settings.valKey]==this.value){
										settings.onSelect(settings.data[i]);
									}
								}
							}
						});
					}
				}
			});
			
		},
		
		/**
		 *获取选中值得对象
		 *@param 无
		 *@result selectObj 选中单选框的对象 
		 */
		getSelectItem:function(){
			var basicName=$(this).attr("id");
			var returnObj=$("#"+basicName+" input[type=radio]:checked").attr("representObj");
			if(returnObj==null || returnObj==""){
				return null;
			}else{
				return JSON.parse(returnObj);
			}
			
		},
		

		/**
		 *根据用户传入的value值选择单选框的的一项 
		 *@param value 需要选中radio的value值
		 */
		selectOneByValue:function(value){
			var basicName=$(this).attr("id");
			if(value==undefined){
				$("#"+basicName+" input[type=radio]").removeAttr("checked");
			}else{
				$("#"+basicName+" input[type=radio][value="+value+"]").prop("checked","checked");
			}
		},
		
		/**
		 *恢复所有单选框到未选择状态 
		 */
		cancelSelect:function(){
			var basicName=$(this).attr("id");
			$("#"+basicName+" input[type=radio]").attr("checked",false);
		}
	};
	
	
	$.fn.radioGroup=function(){
		
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