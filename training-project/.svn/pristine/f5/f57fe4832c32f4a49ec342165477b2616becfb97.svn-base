(function ($){
	var methods = {
	    	/**
	    	 * 功能：初始化对话框
	    	 * 参数：options
	    	 * 		id:对话框id
	    	 * 		onSelect():选择某条员工调用的方法
	    	 * 		onCancel():关闭对话框
	    	 */
	        init: function (options) {
	            //创建默认值，拓展任何被提供的选项
	        	var defaults = {};
	        	
	        	//使用外部传入的参数更新默认参数
	        	var settings = $.extend(defaults,options);
	        	
	        	//获取到jquery对象对应的id
	        	settings.id = this.attr("id");
	        	
	        	//初始化选择插件
	        	initSelEmpDialog(settings);
	        },
	        
	        /**
	         * 功能：打开对话框
	         */
	        open: function() {
	        	openSelEmpDialog();
	        }
	};
	 
	$.fn.selEmpDialog = function (method) {
		// 方法调用
		if (methods[method]) {
		     return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else if (typeof method === 'object' || !method) {
		     return methods.init.apply(this, arguments);
		} 
		else {
		     $.error('Method' + method + 'does not exist on jQuery.selEmpDialog');
		}
	};
	
	//外部定义对话框id
	var divId;
	
	/**  
	 *	功能：初始化对话框
	 *	1、定义对话框中的布局、包含关键字、datagrid
	 *	2、给双击、选择、取消绑定事件
	 *	@param: params
	 *	id,对话框id，默认是selEmpDialog
	 *	onSelect(empInfo),选择某个员工，参数是empInfo
	 *	onCancel(),关闭对话框
	 */
	function initSelEmpDialog(params){
		if(params.id==null){  //判断对话框id若为空，则默认等于selEmpDialog
			divId="selEmpDialog";
		}else{ //不为空对话框id则等于页面传入进来的
			divId=params.id;
		}
		
		//设置对话框
		$("#"+divId+"").dialog({
			modal:true,
			title:"选择员工",
			width:680,
			height:425,
			closed:true,
			onClose : function() {  
				//关闭按钮时清空查询表单
				$("#searchForm").form("reset");
			},
			buttons:[ 
				{   //设置选择按钮
					text:"选择",
					iconCls:"icon-save",
					handler:function(){
						//获取选中行的数据
						var row=$("#dictTable").datagrid("getSelected");
						if(row==null){  //如果未选择数据时则提示
							$.messager.alert("提示信息","请选择用户","info");
						}else{
							if(params.onSelect){  //判断是否传入的params参数，onSelect方法是否存在
								params.onSelect(row);
								params.onCancel();
							}
						}
					}
				},
				{
					// 设置关闭按钮
					text:"关闭",
					iconCls:"icon-cancel",
					handler:function() {
						if(params.onCancel){  //判断是否传入的params参数，onCancel方法是否存在
							params.onCancel();
						}
					}
				}
			],
		});
		
		//动态创建查询表单
		var childForm=$("<form id='searchForm'><table class='btbForm'><tr>" +
				"<td>关键字&nbsp;<input name='keyWord' class='easyui-textbox' style='width:200px' data-options=\"prompt:'请输入员工编号或姓名'\"></td>" +
				"<td style='text-align:right;padding-right:5px'><a href='javascript:searchEmp()' class='easyui-linkbutton' iconCls='icon-search' style='color:#000'>查&nbsp;&nbsp;询</a></td></tr></table></form>");
		$("#"+divId+"").append(childForm);
		$.parser.parse(childForm);
		
		//动态创建对话框中的table（数据网格）
		var childTable=$("<table id='dictTable' data-options='rownumbers:true' class='easyui-datagrid'></table>");
		$("#"+divId+"").append(childTable);
		
		$("#dictTable").datagrid({
			//双击行事件
			onDblClickRow:function(){
				//获取选中行的数据
				var row=$("#dictTable").datagrid("getSelected");
				if(params.onSelect){ //判断是否传入的params参数，onSelect方法是否存在
					params.onSelect(row);
					params.onCancel();
				}
			}
		})
	}

	/**
	 * 功能：1、加载数据网格
	 * 		2、打开员工选择对话框
	 */
	function openSelEmpDialog(){ 
		//加载数据网格
		$("#dictTable").datagrid({
			url:basePath + "/dataaccess.json",
			queryParams:{accessId:"1301"}, 
			pagination:true,
			singleSelect:true,
			columns:[[
				{field:'empCode',title:'员工编号',width:110,align:'left',halign:'center'},
				{field:'empName',title:'员工姓名',width:110,align:'left',halign:'center'},
				{field:'gender',title:'性别',width:60,align:'center',halign:'center'},
				{field:'deptName',title:'部门',width:110,align:'left',halign:'center'},
				{field:'jobPosition',title:'职位',width:110,align:'left',halign:'center'},
				{field:'mobile',title:'手机号',width:130,align:'left',halign:'center'}
			 ]],
		});
		
		//打开对话框
		$("#"+divId+"").dialog("open");
	}

	/**
	 * 功能：查询员工信息
	 */
	function searchEmp(){
		var formData = $("#searchForm").serializeObject();
		formData.accessId = "1301";
		$("#dictTable").datagrid("load", formData);
	}
	
})(jQuery);