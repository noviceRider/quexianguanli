var url;//请求url
var isNew;//新增、修改标志

/**
 * 初始化页面，加载数据
 */
$(function(){
	//数据网格加载数据
	$("#module_dg").datagrid(Common.createDatagridOptionsExt(basePath, "/gmodule_dform_moduleconfig_findpage.json",135));
	
	//给数据网格设置属性事件
	$("#module_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有选择行
			$("#module_dg").datagrid("uncheckAll");
			//选中当前行
			$("#module_dg").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消所有选中行
			$("#module_dg").datagrid("uncheckAll");
			//选中当前行
			$("#module_dg").datagrid("checkRow",index);
			
			//修改选中数据
			modifyModule();
		}
	});

	//加载新增、修改页面
	$("#dialog_add_modify").load("moduleconfig_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//选择模板页面 
	$("#dialog_template").load("moduleconfig_apptemplate.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
	//加载详情页面
	$("#dialog_detail").load("moduleconfig_detail.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	loadCombotree("moduleCatIdKeyWord","1002");
	$("#moduleCatIdKeyWord").combotree({
		onSelect:function(record){
			$("#moduleCatIdKeyWord").combotree("setValue",record.id);
			queryModule();
		},
	});
});

/**
 * 查询数据
 */
function queryModule(){
	//获取加载的参数
	var params = {templateCode:$("#templateCodeIdKeyWord").val(),moduleCat:$("#moduleCatIdKeyWord").combotree("getValue"),keyWord:$("#keyWord").textbox("getValue")};
	$("#module_dg").datagrid("reload",params);
}

/**
 * 新增数据
 */
function addModule(){
	//设置新增标识
	isNew = true;
	//设置新增url
	url=basePath+"/gmodule_dform_moduleconfig_addModuleconfig.json";
	
	//启用模板编号输入框
	$("#moduleCodeId").textbox("enable");
	
	//加载模板分类
	moduleCatFormatter();
	
	// 打开新增对话框
	$("#module_add_modify_div").dialog({
		modal : true,
		title : "新增模块配置",
		onClose : function() {
			// 清空数据
			$("#module_add_modify_form").form("reset");
		},
	}).dialog("center");

	//验证
	validateConfig();
	
	//获取焦点
	$("#moduleCodeId").textbox().next("span").find("input").focus();
}

/**
 * 修改数据
 */
function modifyModule(){
	//设置修改标识
	isNew = false;
	//得到要修改的节点
	var rows = $("#module_dg").datagrid("getSelections");
	
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	//设置修改url
	url=basePath+"/gmodule_dform_moduleconfig_modifyModuleconfig.json";
	
	//禁用模板编号输入框
	$("#moduleCodeId").textbox("disable");
	
	//加载模板分类
	moduleCatFormatter();
	
	// 数据回显
	$("#module_add_modify_form").form("load",rows[0]);
	
	// 打开修改对话框
	$("#module_add_modify_div").dialog({
		modal : true,
		title : "修改模块配置",
		onClose : function() {
			// 清空数据
			$("#module_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//验证
	validateConfig();
	
	//获取焦点
	$("#moduleNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSave(){
	// 序列化表单
	var module = $("#module_add_modify_form").serializeObject();
	module.moduleCode = $("#moduleCodeId").textbox("getValue");
	module.ver = $("#verId").textbox("getValue")=="" ? "0" : $("#verId").textbox("getValue");
	// 保存提交数据
	if($("#module_add_modify_form").form("validate")){
		$.ajax({
			url: url,
			type: "post",
			data: module,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$("#module_dg").datagrid("reload");
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
	$("#module_add_modify_div").dialog("close");
	
	//清空数据
	$("#module_add_modify_form").form("reset");
}

/**
 * 删除数据
 */
function removeModule(){
	// 得到要删除的行节点
	var batchModuleCode = Common.getSelectedIds("#module_dg", "moduleCode", "batchModuleCode");
	if (batchModuleCode == null || batchModuleCode.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/gmodule_dform_moduleconfig_removeModuleconfig.json",
				type : "post",
				data : batchModuleCode,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$("#module_dg").datagrid("reload");
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
		$("#moduleCodeId").textbox({
			required:true,
			missingMessage:"模板编号不能为空",
			invalidMessage:"模板编号已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_moduleconfig_validateModuleCode.json','moduleCode']"
		});
		$("#moduleNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_moduleconfig_validateModuleName.json','moduleName']"
		});
	}else{// 修改验证
		$("#moduleNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_moduleconfig_validateModuleName.json','moduleName',{moduleCode:'"+$("#moduleCodeId").textbox("getValue")+"'}]"
		});
	}
}

/**
 * 选择对应模板页面
 */
function addTemplate(param){
	//给数据网格加载数据
	$("#module_template_dg").datagrid(Common.createDatagridOptionsExt(basePath, "/gmodule_dform_apptemplate_findpage.json",135));
	$("#module_template_dg").datagrid({
			//行的单击事件
			onClickRow:function(index,row){
				//取消所有选择行
				$("#module_template_dg").datagrid("uncheckAll");
				//选中当前行
				$("#module_template_dg").datagrid("checkRow",index);
			},
			onDblClickRow:function(index,row){
				//取消所有选中行
				$("#module_template_dg").datagrid("uncheckAll");
				//选中当前行
				$("#module_template_dg").datagrid("checkRow",index);
				
				//选中设置数据
				selectTemplate(param);
			}
	});
	
	if (param == "home") {
		//主页打开显示清除按钮
		$("#clearSelectTemplateBtn").show();
	} else {
		//新增修改打开隐藏清除按钮
		$("#clearSelectTemplateBtn").hide();
	}
	
	//打开窗口
	$("#module_template_div").dialog({
		title:"选择模板",
		modal:true,
		onClose : function() {
			// 清空数据
			$("#templateForm").form("reset");
		},
	}).dialog("open").dialog("center");
}

/**
 * 数据类型查询按钮
 */
function queryTemplate() {
	$("#module_template_dg").datagrid("reload",{keyWord:$("#templateKeyWordId").textbox("getValue")});
}

/**
 * 数据类型选择按钮
 */
function selectTemplate(param) {
	//得到要选择的节点
	var rows = $("#module_template_dg").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择具体的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}

	if (param == "home") {
		//设置访问数据编号输入框
		$("#templateNameIdKeyWord").textbox("setValue",rows[0].templateName);
		$("#templateCodeIdKeyWord").val(rows[0].templateCode);
		//刷新页面
		queryModule();
	} else {
		//设置访问数据编号输入框
		$("#templateNameId").textbox("setValue",rows[0].templateName);
		$("#templateCodeId").val(rows[0].templateCode);
	}
	
	//关闭页面
	cancelSelectTemplate();
}

/**
 * 数据类型选择清除按钮
 */
function clearSelectTemplate() {
	//清空输入框
	$("#templateNameIdKeyWord").textbox("setValue","");
	$("#templateCodeIdKeyWord").val("");
	//刷新页面
	queryModule();
	//关闭页面
	cancelSelectTemplate();
}

/**
 * 数据类型选择取消按钮
 */
function cancelSelectTemplate() {
	//关闭对话框
	$("#module_template_div").dialog("close");
	
	//清空数据
	$("#templateKeyWordId").textbox("setValue","");
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
 * 格式化操作数据列
 */
function operateFormatter(value,row,index) {
	return "<a href='#1' onclick='detail(this)' style='color: blue;' >详情</a> | <a href='#1' onclick='config("+index+")' style='color: blue;' >配置</a> | <a href='#1' onclick='test(this)' style='color: blue;' >测试</a>";
}

/**
 * 格式化模板分类下拉选项
 */
function moduleCatFormatter() {
	loadCombotree("moduleCatId","1002");
}

/**
 * 详情
 */
function detail(dom) {
	//详情查询条件
	var moduleCode =$(dom).parents("tr").find("[field='moduleCode']").text();
	// 打开字段详情页面
	$("#module_detail").dialog({
		modal : true,
		title : "模块配置详情",
		onOpen : function() {
			//加载对应数据
			$.ajax({
				type: 'post',
				url:  basePath + "/gmodule_dform_moduleconfig_findById.json",
				data: {'moduleCode': moduleCode},
				success: function(data){
					// 加载数据
					loadDetail("module_detail",data.rows);
				}
			});
		},
	}).dialog("center");
}

/**
 * 配置
 */
function config(rowIndex) {
	var row = $('#module_dg').datagrid('getData').rows[rowIndex];
	$.ajax({
		url: basePath+"/gmodule_dform_apptemplate_findbyid.json",
		type: "post",
		data: {'templateCode':row.templateCode,'infoType':'1001'},  
		dataType:"json",
		success : function(data) {
			var moduleConfigURL = data.row.moduleConfigURL;
			window.location.href = moduleConfigURL+"?moduleCode="+row.moduleCode; 
		}
	});
	
	//详情查询条件
//	var moduleCode =$(dom).parents("tr");
//	window.location.href = "template_002.html?moduleCode="+moduleCode; 
}

/**
 * 加载详情页面数据
 */
function loadDetail(dialogId,data){
	var $allSpan=$("#"+dialogId+" span");
	for ( var i=0;i<$allSpan.length;i++) {
		var name=$allSpan.eq(i).attr("name");
		for(var j in data){
			if(name==j){
				if (j=="isUsed") {
					$allSpan.eq(i).html(data[j]=="1"?"有效":"无效");
				}else if (j=="configParam") {
					$allSpan.eq(i).html(data[j]==null?"—":data[j].replace(/\r\n/g,"<br/>").replace(/\s/g,"&nbsp;"));
				}else{
					$allSpan.eq(i).html(data[j]==null?"—":data[j]);
				}
			}
		}
	}
}

function test(dom) {
	//详情查询条件
	var moduleCode =$(dom).parents("tr").find("[field='moduleCode']").text();
	location.href="../../module/"+moduleCode+".html";
}