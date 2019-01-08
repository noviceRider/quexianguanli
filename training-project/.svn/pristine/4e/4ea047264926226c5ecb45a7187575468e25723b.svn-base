var accessId;//请求url
var isNew;//新增、修改标志

/**
 * 初始化页面，加载数据
 */
$(function(){
	//数据网格加载数据
	//$("#template_dg").datagrid(Common.createDatagridOptionsExt(basePath, "/gmodule_dform_apptemplate_findpage.json",135));
	$("#template_dg").datagrid({
		url:basePath+"/dataaccess.json",
		queryParams:{
			accessId:"3101"
		}
	});
	
	/**
	 * 自定义远程验证方法，和textBox一起使用
	 */
	$.extend($.fn.textbox.defaults.rules, {
	    myRemoteValid: {
			validator: function(value, param){
				
				var params = {};
				params[param[1]] = value;
				if($(param[2]) != null) {
					params = $.extend(params, param[2]);
				}

				var data = $.ajax({  
					url: param[0],  
					type: 'post',  
					data: params,
					async:false,  
	                cache:false,
					dataType: 'json'
				}).responseJSON;	
				if(data.COUNT ==0)
					//通过验证
					return true;
				else 
					//未通过验证
					return false;
			},
			message: '请输入合法的内容'
	    }
	});
	
	/**
	 * 自定义远程验证方法，和textBox一起使用
	 */
	$.extend($.fn.textbox.defaults.rules, {
	    myModifyRemoteValid: {
			validator: function(value, param){
				
				var params = {};
				var params2={};
				params[param[1]] = value;
				if($(param[2]) != null) {
					params2 = $.extend(params2, param[2]);
				}
				params.accessId="3108";
                //查询名称数量
				var data = $.ajax({  
					url: param[0],  
					type: 'post',  
					data: params,
					async:false,  
	                cache:false,
					dataType: 'json'
				}).responseJSON;
				params2.accessId="3104";
				var datapo = $.ajax({  
					url: param[0],  
					type: 'post',  
					data: params2,
					async:false,  
	                cache:false,
					dataType: 'json'
				}).responseJSON;
				if(data.COUNT ==0)
					//通过验证
					return true;
				else {
					if(data.COUNT ==1){
						if(datapo.templateName==value){
							return true;
						}else{
							return false;
						}
					}else{
						//未通过验证
						return false;
					}
				}
					
			},
			message: '请输入合法的内容'
	    }
	});
	//给数据网格设置属性事件
	$("#template_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有选择行
			$("#template_dg").datagrid("uncheckAll");
			//选中当前行
			$("#template_dg").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消所有选中行
			$("#template_dg").datagrid("uncheckAll");
			//选中当前行
			$("#template_dg").datagrid("checkRow",index);
			
			//修改选中数据
			modifyTemplate();
		}
	});

	//加载新增、修改页面
	$("#dialog_add_modify").load("../dform/apptemplate_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

});

/**
 * 查询数据
 */
function queryTemplate(){
	$("#template_dg").datagrid("reload",{keyWord:$("#keyWord").textbox("getValue"),accessId:"3101"});
}

/**
 * 新增数据
 */
function addTemplate(){
	//设置新增标识
	isNew = true;
	//设置新增url
	accessId="3105";
	
	//启用模板编号输入框
	$("#templateCodeId").textbox("enable");
	
	//加载模板分类
	templateCatFormatter();
	
	// 打开新增对话框
	$("#apptemplate_add_modify_div").dialog({
		modal : true,
		title : "新增应用模板",
		onClose : function() {
			// 清空数据
			$("#apptemplate_add_modify_form").form("reset");
		},
	}).dialog("center");

	//验证
	validateConfig();
	
	//获取焦点
	$("#templateCodeId").textbox().next("span").find("input").focus();
}

/**
 * 修改数据
 */
function modifyTemplate(){
	//设置修改标识
	isNew = false;
	//得到要修改的节点
	var rows = $("#template_dg").datagrid("getSelections");
	
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	//设置修改url
	accessId="3106";
	
	//禁用模板编号输入框
	$("#templateCodeId").textbox("disable");
	
	//加载模板分类
	templateCatFormatter();
	
	// 数据回显
	$("#apptemplate_add_modify_form").form("load",rows[0]);
	
	// 打开新增对话框
	$("#apptemplate_add_modify_div").dialog({
		modal : true,
		title : "修改应用模板",
		onClose : function() {
			// 清空数据
			$("#apptemplate_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//验证
	validateConfig();
	
	//获取焦点
	$("#templateNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSave(){
	// 序列化表单
	var template = $("#apptemplate_add_modify_form").serializeObject();
	template.templateCode = $("#templateCodeId").textbox("getValue");
	template.ver = $("#verId").textbox("getValue")=="" ? "0" : $("#verId").textbox("getValue");
	template.accessId=accessId;
	// 保存提交数据
	if($("#apptemplate_add_modify_form").form("validate")){
		$.ajax({
			url: basePath+"/dataaccess.json",
			type: "post",
			data: template,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$("#template_dg").datagrid("reload");
					//关闭对话框
					doCancel();
				} else if (data.resultCode == "0") {
					$.messager.alert("提示信息", "操作失败了，请联系管理员1", "error");
				} else {
					$.messager.alert("提示信息", "操作失败，请联系管理员2", "error");
				}
			},
			error : function() {
				$.messager.alert("错误", "服务器内部错误!", "error");
			}
		});
	}
}

/**
 * 新增、修改取消
 */
function doCancel(){
	//关闭对话框
	$("#apptemplate_add_modify_div").dialog("close");
	
	//清空数据
	$("#apptemplate_add_modify_form").form("reset");
}

/**
 * 删除数据
 */
function removeTemplate(){
	// 得到要删除的行节点
	var batchTemplateCode = Common.getSelectedIds("#template_dg", "templateCode", "batchTemplateCode");
	if (batchTemplateCode == null || batchTemplateCode.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	var params={};
	params["accessId"]="3107";
	params["templateCode"]=$("#template_dg").datagrid("getSelected").templateCode;
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/dataaccess.json",
				type : "post",
				data : params,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$("#template_dg").datagrid("reload");
						$.messager.alert("提示信息", "删除数据成功！");
					} else {
						$.messager.alert("提示信息", "删除数据失败！", "info");
					}
				},
				error : function() {
					$.messager.alert("错误信息", "服务器内部错误!", "error");
				}
			});
		}
		;
	});
}

/**
 * 验证数据
 */
function validateConfig() {
	if(isNew){// 新增验证
		$("#templateCodeId").textbox({
			required:true,
			missingMessage:"模板编号不能为空",
			invalidMessage:"模板编号已经存在",
			validType:"myRemoteValid['"+basePath+"/dataaccess.json','templateCode',{accessId:'3109'}]"
		});
		$("#templateNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"myRemoteValid['"+basePath+"/dataaccess.json','templateName',{accessId:'3108'}]"
		});
	}else{// 修改验证
		$("#templateNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"myModifyRemoteValid['"+basePath+"/dataaccess.json','templateName',{templateCode:'"+$("#templateCodeId").textbox("getValue")+"'}]"
		});
	}
}

/**
 * 格式化是否有效数据列
 */
function isUsedFormatter(value,row,index){
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else if (value == 0) {// 无效
		return "—";
	}
}

/**
 * 格式化模板分类下拉选项
 */
function templateCatFormatter() {
	loadCombotree("templateCatId","1001");
}

