(function($) {
	// 关键字输入框id
	var keyWordId;
	// 查询表单id
	var searchForm;
	// 房源表格id
	var clientResourceTable;

	var idSeed;

	var methods = {
		/**
		 * 功能：初始化对话框 
		 * 参数：options 
		 *     对话框id 
		 *     onSelect() 选择用户后调用 
		 *     onClose() 关闭窗口调用
		 */
		init : function(options) {
			// 默认参数
			var defaults = {
				onSelect : $.noop,
				onClose : $.noop
			};

			var settings = $(this).data('settings');

			if (!settings) {
				settings = $.extend({
					id : $(this).attr('id')
				}, defaults);

				idSeed = new Date().getTime();
				keyWordId = "keyWordId" + idSeed;
				searchForm = "searchForm" + idSeed;
				clientResourceTable = "clientResourceTable" + idSeed;
			}

			// 使用外部传入的参数更新默认参数
			$.extend(settings, settings, options);
			$(this).data('settings', settings);

			// 初始化对话框
			initSelClientResourceDialog($(this).data('settings'));
		},
		/**
		 * 功能：打开对话框
		 */
		open : function() {
			openClientResourceDialog($(this).data('settings'));
		}
	};

	$.fn.selClientResourceDialog = function(method) {
		// 方法调用
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method
					+ ' does not exist on jQuery.selClientResourceDialog');
		}
	};

	/**
	 * 功能： 初始化对话框
	 * 
	 * @param params
	 *            用户传入的对话框id以及onSelect、onCancel方法 1、根据id创建一个div
	 *            2、定义对话框中的布局、包含关键字、datagrid 3、给双击、选择、取消绑定事件
	 */
	function initSelClientResourceDialog(params) {
		// 定义对话框
		$("#" + params.id).dialog({
			title : "选择客源",
			width : 905,
			height : 425,
			cache : false,
			modal : true,
			closed : true,
			onClose : function() {
				// 关闭按钮时重置查询表单
				$("#" + searchForm).form("reset");
			},
			// 设置对话框按钮
			buttons : [{
				// 设置选择按钮
				text : "选择",
				iconCls : "icon-save",
				handler : function() {
					var row = $("#" + clientResourceTable).datagrid("getSelected");
					// 从数据库中获取数据
				    $.ajax({
				        url: basePath + "/dataaccess.json",
				        type: "post",
				        async: false,
				        data: {clientResourceId: row.clientResourceId, accessId: "201203"},
				        success: function (data) {
				            row=data;
				        }
				    });
					if (row == null) {
						$.messager.alert("提示信息","请选择房源", "info");
					} else {
						params.onSelect&& params.onSelect(row);
						params.onClose&& params.onClose();
						$("#" + params.id).dialog("close");
					}
				}
			}, {
					text : "取消",
					iconCls : "icon-cancel",
					handler : function() {
						params.onClose && params.onClose();
						$("#" + params.id).dialog("close");
				}
			} ]
		});

		// 动态创建查询表单
		var childForm = $("<form id='"+ searchForm+ "'><table class='btbForm'><tr>" +
				"<td>关键字&nbsp;<input id='"+ keyWordId+ "' name='keyWord' class='easyui-textbox' style='width:200px' data-options=\"prompt:'请输入客户进行查询'\"></td>"+
				"<td style='text-align:right;padding-right:5px'><a href='javascript:;' class='easyui-linkbutton searchClientResource' iconCls='icon-search' style='color:#000'>查&nbsp;&nbsp;询</a>" +
				"</td></tr></table></form>");
		$("#" + params.id).append(childForm);
		$.parser.parse(childForm);

		// 动态创建对话框中的table（数据网格）
		var childTable = $("<table id='"+ clientResourceTable+ "' class='easyui-datagrid'></table>");
		$("#" + params.id).append(childTable);

		/**
		 * 关键字查询
		 */
		$("#" + params.id).on('click', 'a.searchClientResource', function() {
			//得到查询表单的数据serializeObject()
			var params = $("#"+searchForm).serializeObject();
			//添加接口标识
			params.accessId = "201201";
			
			$("#" + clientResourceTable).datagrid("load", params);
		});
	}

	/**
	 * 1、加载数据网格 
	 * 2、打开对话框
	 */
	function openClientResourceDialog(params) {
		//加载数据网格
		$("#"+clientResourceTable).datagrid({
			url : basePath + "/dataaccess.json",
			queryParams : {accessId : "201201"},
			pagination:true,
			singleSelect:true,
			striped:true,
			onDblClickRow:function(){
				var row = $("#" + clientResourceTable).datagrid("getSelected");
				// 从数据库中获取数据
			    $.ajax({
			        url: basePath + "/dataaccess.json",
			        type: "post",
			        async: false,
			        data: {clientResourceId: row.clientResourceId, accessId: "201203"},
			        success: function (data) {
			            row=data;
			        }
			    });
				params.onSelect&& params.onSelect(row);
				params.onClose&& params.onClose();
				$("#" + params.id).dialog("close");
			},
			columns:[[
				{field:'clientResourceId',title:'编号',width:60,align:'left',halign:'center'},
				{field:'tradeTypeName',title:'交易',width:40,align:'center',halign:'center'},
				{field:'entrustDate',title:'委托日',width:80,align:'center',halign:'center'},
				{field:'clientName',title:'客户',width:50,align:'left',halign:'center'},
				{field:'areaName',title:'城区',width:50,align:'left',halign:'center'},
				{field:'subAreaName',title:'片区',width:60,align:'left',halign:'center'},
				{field:'houseTypeName',title:'房型',width:50,align:'left',halign:'center'},
				{field:'area',title:'面积',width:77,align:'left',halign:'center',formatter:function(value,row,index){
					return row.minArea + "-" + row.maxArea+"m³";
				}},
				{field:'price',title:'价格',width:77,align:'left',halign:'center',formatter:function(value,row,index){
					return row.minPrice + "-" + row.maxPrice + "万";
				}},
				{field:'decorationName',title:'装修',width:40,align:'center',halign:'center'},
				{field:'propertyUseName',title:'用途',width:50,align:'left',halign:'center'},
				{field:'shopName',title:'门店',width:60,align:'left',halign:'center'},
				{field:'inputBy',title:'员工',width:60,align:'center',halign:'center'},
				{field:'clientResourceTypeName',title:'公私',width:50,align:'center',halign:'center'},
				{field:'lastFollowTime',title:'最后跟进',width:80,align:'center',halign:'center',formatter:function(value,row,index){
					if (value == "" || value == undefined) {
						return "";
					} else {
						var date = new Date(value);
						return date.pattern("yyyy-MM-dd");
					}
				}}
					
			 ]],
		});

		// 打开对话框
		$("#" + params.id + "").dialog("open");
	}
})(jQuery);