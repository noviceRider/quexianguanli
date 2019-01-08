var divId;// 对话框id
var gender;// 用户性别

(function ($) {
	 
    var methods = {
    	/**
    	 * 功能：初始化对话框
    	 * 参数：options
    	 *      id 对话框id
    	 *      onSelect() 选择用户后调用
    	 *      onCancel() 关闭窗口调用
    	 */
        init: function (options) {
            //默认参数
        	var defaults = {};
        	
        	var settings = $.extend(defaults,options);
        	// 设置id
        	settings.id = this.attr("id");
        	
        	// 初始化对话框
        	initSelUserDialog(settings);
        },
        /**
         * 功能：打开对话框
         */
        open: function() {
        	openSelUserDialog();
        }
    };
 
    $.fn.selUserDialog = function (method) {
    	
        // 方法调用
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.selUserDialog');
        }
 
    };
 
})(jQuery);

/**
 * 功能： 初始化对话框
 * @param params 用户传入的对话框id以及onSelect、onCancel方法
 * 1、根据id创建一个div
 * 2、定义对话框中的布局、包含关键字、datagrid
 * 3、给双击、选择、取消绑定事件
 */
function initSelUserDialog(params) {
	
	// 获取用户性别
	$.ajax({
		url: basePath+"/dataaccess.json",
		data: {accessId:"9111"},
		type:"post",
		success:function(data){
			gender = data.rows;
		}
	});
	
	// 如果params.id不为空，就将divId改为params.id
	if(params.id == null) {
		divId = "selUserId";
	}
	else {
		divId = params.id;
	}
	
	// 定义对话框
	$("#" + divId + "").dialog({
	    title: "选择用户",
	    width: 640,
	    height: 416,
	    cache: false,
	    modal: true,
	    closed: true,
	    onClose:function(){
	    	$("#form").form("clear");
	    },
	    // 设置对话框按钮
		buttons : [{
			//设置选择按钮
			text : "选择",
			iconCls : "icon-save",
			handler:function(){
				var row = $("#userDataTab").datagrid("getSelected");
				if(row == null){
					$.messager.alert("提示信息","请选择用户","info");
				} 
				else {
					if(params.onSelect) {
						params.onSelect(row);
						params.onCancel();
					}
				}
			}
		},
		{
			text:"取消",
			iconCls: "icon-cancel",
			handler:function(){
				if(params.onCancel) params.onCancel();
			}
		}]
	});
	
	var form = $("<form id='form' style='padding:6px;'></form>");
	form.append($("<span>&nbsp;关键字&nbsp;</span>"));
	
	// 创建Input输入框
	var input = $("<input type='text' id='keyWord' class='easyui-textbox' data-options=\"prompt:'输入用户姓名或编号'\" style='width:180px'/>");

	// 创建查询按钮 
	var aBtn = $("<a href='javascript:doSearch();' class='easyui-linkbutton' iconCls='icon-search' style='float:right'>查询</a>")
	
	form.append(input).append(aBtn);
	$("#" + divId + "").append(form);
	
	// 渲染表单组件样式
	$.parser.parse(form);
	
	// 创建表
	var dataTable = $("<table id='userDataTab' class='easyui-datagrid' data-options='pagination:true,singleSelect:true,rownumbers:true'></table>");

	$("#" + divId + "").append(dataTable);
	
	/**
	 * 双击
	 */
	$("#userDataTab").datagrid({
		onDblClickRow:function(){
			// 获取选中行
			var row = $("#userDataTab").datagrid("getSelected");
			if(params.onSelect) {
				params.onSelect(row);
				params.onCancel();
			}
		}
	});
	
}

/**
 * 1、加载所有登录用户的数据
 * 2、打开对话框
 * */
function openSelUserDialog(){
	
	$("#userDataTab").datagrid({
		url: basePath+"/dataaccess.json",
		queryParams: {accessId:"9101"},
		method:"post",
		columns:[[
			{field:"userId",title:"用户编号",width:120,align:"left",halign:"center"},
			{field:"userName",title:"用户姓名",width:120,align:"left",halign:"center"},
			{field:"genderId",title:"性别",width:120,formatter:genderFormatter,align:"left",halign:"center"},
			{field:"officeTel",title:"工作电话",width:120,align:"left",halign:"center"},
			{field:"mobile",title:"移动电话",width:100,align:"left",halign:"center"}
		]]
	});
	
	$("#" + divId + "").dialog("open");
}

/**
 * 关键字查询
 * */
function doSearch(){
	// 获取关键字的值
	var keyword = $("#keyWord").textbox("getValue");
	
	$("#userDataTab").datagrid("load",{keyWord:keyword,accessId:"9101"});
}

/**
 * 性别格式化 
 *@param value 格式化的值
 *@param row 对应行
 *@param index 对应行下标
 */
function genderFormatter(value,row,index){
	
	for(var i = 0;i<gender.length;i++) {
		
		if(value == gender[i].genderId) {
			
			return gender[i].genderDesc; // 返回 男或女或保密
		}
	}

}
