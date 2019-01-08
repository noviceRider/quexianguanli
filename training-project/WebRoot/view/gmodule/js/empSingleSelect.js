/**
 * 根据路径获取并选择员工信息(单条信息选择)
 */
(function(){
	
	
	//方法集合
	var methods={
		/**
		 *创建员工单选页面控件，包括员工信息弹窗显示、员工信息选择（单条）并加载到信息显示控件
		 *@param url 获取数据的URL地址
		 *@param id 用户指定控件ID属性值
		 *@param name 用户指定控件name属性值
		 *@param width 信息显示控件的长度
		 *@param params url请求的参数
		 *@param method url请求方式（post和get）
		 *@param async 是否异步请求
		 *@param onSelect 用户选择一行时触发
		 */
		empSingleSelect:function(options){
			//获取调用插件的控件ID
			
			//存放用户选中的员工
			var selectedRow=null;
			
			var basic=$(this).attr("id");
			
			//设定参数默认值
			var defaults={
					width:"160px",
					url:"",
					method:"post",
					params:{},
					async:true,
					name:basic+"defalutName",
					id:basic+"defalutId",
					onSelect:null
			};
			
			
			//获取用户传入的参数并覆盖默认值
			var settings = $.extend({}, defaults, options);
			var basicName= $(this).attr("id");
			//保证链式调用
			return this.each(function(){
				//设置插件的控件属性及样式
				//属性
				//$(this).attr("id",settings.id);
				$(this).attr("name",settings.name);
				
				//样式
				$(this).css({
					"width":settings.width
				});
				
				//构造html内容 创建页面的textbox及按钮  用于输入和显示信息
				//构造html内容 创建用于弹窗的DIV及显示数据的table
				var infoInputStr="<input id='"+basicName+"infoInput'>&nbsp;<a href='#' id='"+basicName+"GetInfoBtn'></a><div id='"+basicName+"WindowDiv'></div>";
				$(this).html(infoInputStr);
				
				//创建textbox输入框
				$("#"+basicName+"infoInput").textbox({
					width:"70%"
				});
				
				//创建按钮
				$("#"+basicName+"GetInfoBtn").linkbutton({
					iconCls:"icon-add",
					onClick:function(){
						$("#"+basicName+"WindowDiv").html("<div style='height:5px'></div>&nbsp;&nbsp;&nbsp;&nbsp;请输入关键字&nbsp;<input type='text' id='"+basicName+"empKeyWord' style=''><a href='#' id='"+basicName+"searchEmpBtn' style='margin-left:260px'>查询</a><br><div style='height:5px'></div><table id='"+basicName+"InfoTable'></table>");
						
						//创建查询关键字输入框
						$("#"+basicName+"empKeyWord").textbox({
							width:"180px",
							prompt:"请输入员工姓名或编号"
						});
						
						//数据表格
						$("#"+basicName+"InfoTable").datagrid({
							url:settings.url,
							queryParams:settings.params,
							pagination:true,
							pageNumber:1,
							pageSize:10,
							pageList:[10,15,20],
							autoRowHeight:true,
							singleSelect:true,
							columns:[[
					           {field:'empId',title:'员工ID',width:"23%",align:'right',halign:"center",hidden:true},    
					           {field:'empCode',title:'员工编号',width:"110px",align:'left',halign:"center"},    
					           {field:'empName',title:'员工姓名',width:"125px",align:'left',halign:"center"},
					           {field:'empType',title:'员工类型',width:"120px",align:'left',halign:"center"},
					           {field:'mobile',title:'电话',width:"125px",align:'left',halign:"center"},
					           {field:'jobPosition',title:'职位',width:"125px",align:'left',halign:"center"},
							]],
							
							/**
							 *选中一行时将数据添加到数组 且数组中只允许存在一条数据
							 *@param rowIndex 选中行下标
							 *@param rowData 选中航数据（对象） 
							 */
							onCheck:function(rowIndex,rowData){
								
								selectedRow=rowData;
								
							},
							onDblClickRow:function(rowIndex,rowData){
								$("#"+basicName+"infoInput").textbox("setValue",rowData.empName);
								$("#"+basicName+"infoInput").attr("selectemp", JSON.stringify(rowData));
								if(settings.onSelect!=null){
									//调用传进来的方法 
									settings.onSelect(rowData); 
								}
								$("#"+basicName+"WindowDiv").dialog("close");
							},
							/**
							 *翻页时勾选数组中存在的数据 
							 *@param pageSize 页数据条数
							 *@param pageNumber 当前页数
							 */
							onLoadSuccess: function (pageNumber, pageSize){
								if(selectedRow!=null){
									var rows= $("#"+basicName+"InfoTable").datagrid('getRows');
									for(var i=0;i<rows.length;i++){
										if(rows[i].empId==selectedRow.empId){
											$("#"+basicName+"InfoTable").datagrid('selectRow',i);
										}
									}
								}
			                }
						});
						
						//弹出对话框显示数据
						$("#"+basicName+"WindowDiv").dialog({
							title: '选择员工',    
						    width: 640,    
						    height: 420,    
						    cache: false,       
						    modal: true ,
						    buttons:[{
								text:'选择',
								iconCls: 'icon-ok',
								handler:function(){//点击确定按钮触发函数
									var selections=$("#"+basicName+"InfoTable").datagrid("getSelections");
									//获取数据表格选中项
									if(selections.length==0){
										$.messager.alert("提示信息","请选择一条员工信息","info");
									}else if(selections.length==1){
										$("#"+basicName+"infoInput").textbox("setValue",selections[0].empName);
										$("#"+basicName+"infoInput").attr("selectemp", JSON.stringify(selectedRow));
										if(settings.onSelect!=null){
											//调用传进来的方法 
											settings.onSelect(selections[0]); 
										}
										$(this).parent().siblings("#"+basicName+"WindowDiv").dialog("close");
										
									}
								}
							},{
								text:'取消',
								iconCls: 'icon-cancel',
								handler:function(){//点击取消关闭数据表格弹窗
									selectedRow=null;
									$(this).parent().siblings("#"+basicName+"WindowDiv").dialog("close");
								}
							}]
						});
						
						
						//构造查询员工信息按钮
						$("#"+basicName+"searchEmpBtn").linkbutton({    
						    iconCls: 'icon-search',
						    onClick:function(){
						    	$("#"+basicName+"InfoTable").datagrid('reload',{keyWord:$("#"+basicName+"empKeyWord").textbox('getValue'),accessId:'1301'});
						    }
						}); 
						
						$("#"+basicName+"WindowDiv").dialog("open");
					}
				});
			});
		},
		
		/**
		 *获取用户选中的对象 
		 *@param 无
		 *@result selectedRow 用户选择的用工对象
		 */
		getSelectedItem:function(){
			var basicName=$(this).attr("id");
			var selectemp=$("#"+basicName+"infoInput").attr("selectemp");
			if(selectemp!=null){
				return JSON.parse(selectemp);
			}else{
				return null;
			}
		},
		
		/**
		 *清除已选内容
		 */
		clearSelected:function(){
			var basicName=$(this).attr("id");
			$("#"+basicName+"infoInput").textbox("setValue","");
			$("#"+basicName+"infoInput").removeAttr("selectemp");
		},
		
		/**
		 *判断是否选择了员工 
		 *@result isEmpty 是否选择了员工（true不为空、false为空）
		 */
		isEmpty:function(){
			var isEmpty=null;
			var basicName=$(this).attr("id");
			if($("#"+basicName+"infoInput").textbox("getValue")==null || $("#"+basicName+"infoInput").textbox("getValue")==""){
				isEmpty=false;
			}else{
				isEmpty=true;
			}
			return isEmpty;
		}
	};
	
	$.fn.empSingleSelect=function(){
		
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