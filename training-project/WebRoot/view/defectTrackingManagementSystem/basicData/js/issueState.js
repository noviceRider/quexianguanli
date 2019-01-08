var url;// 请求URL
var isNew;// 新增、修改标志

/**
 * 初始加载数据
 */
$(function() {

	// 加载新增、修改页面
	$("#state_add_modify_div").load("issueState_add_modify.html", null,
			function() {
				// 进行解析
				$.parser.parse(this);
			});

	// 初始化数据网格
	$("#issueStateTable").datagrid(
			Common.createDatagridOptionsParams(basePath,
					"/queryIssueState.json", null, null));
	/*// 给数据网格设置双击事件
	$("#issueStateTable").datagrid({
		// 行的单击事件
		onClickRow : function(index, row) {
			// 取消所有有选择行
			$("#issueStateTable").datagrid("uncheckAll");
			// 选中当前行
			$("#issueStateTable").datagrid("checkRow", index);
		},
		onDblClickRow : function(index, row) {
			// 取消素有选择行
			$("#issueStateTable").datagrid("uncheckAll");
			// 选中当前行
			$("#issueStateTable").datagrid("checkRow", index);
		}
	});*/
});

/**
 * 查询
 * 
 * @returns
 */
function queryIssueState() {
	//重新加载表格，并序列化表单
	$("#issueStateTable").datagrid("reload", $("#queryForm").serializeObject());
}

/**
 * 禁用 启用转化
 */
function swiIssueState(){
	
}

/**
 * 格式化操作数据列
 */
function formatterDo (value,row,index){
	if(row.moduleState == "有效"){
		return '<a style="color: blue;" href=# onClick="switchM(\''+row.stateCode+'\',\''+row.moduleState+'\')">禁用</a>';
	}else{
		return '<a style="color: blue;" href=# onClick="switchM(\''+row.stateCode+'\',\''+row.moduleState+'\')">启用</a>';
	}
}

/**
 * 禁用、启用转换
 */
function switchM(stateCode,moduleState){
	
	if(moduleState == "有效"){
		moduleState = "00";
	}else{
		moduleState = "01";
	}
	$.post(
			basePath+"/switchM.json",
			{"stateCode":stateCode,"moduleState":moduleState},
			function(data) {
				console.log(data);
				if(data.result == 1){
					if(moduleState=="00"){
						$.messager.alert("警告","禁用成功！");
					}else{
						$.messager.alert("警告","启用成功！");
					}
				}else{
					if(moduleState=="00"){
						$.messager.alert("警告","禁用失败！");
					}else{
						$.messager.alert("警告","启用失败！");
					}
				}
				//刷新页面
				queryIssueState();
			},
			"json"
		);
}

/**
 * 新增按钮
 */
function addIssueState() {
	isNew = true;
	url = basePath + "/addIssueState.json";
	//隐藏有效、无效按钮区域
	$("#state_isUsedRow").hide();
	//打开编号编辑框为可编辑状态
	$("#stateCode").textbox("enable");

	// 打开新增对话框
	$("#state_am").dialog({
		modal : true,
		title : "新增缺陷状态",
		iconCls : "icon-save",
		onClose : function() {
			// 清空数据
			$("#state_form").form("reset");
		},
	}).dialog("center");
	//调用验证方法
	validateMetamanage();
}

/**
 * 修改按钮
 */
function modifyIssueState() {
	isNew = false;
	url = basePath + "/modifyIssueState.json";
	//打开状态编辑框为可编辑状态
	$("#state_isUsedRow").show();
	
	//描述非空即可
	$("#stateDescid").textbox({
		required:true,
		missingMessage:"描述不能为空"
	});
	
	// 得到要修改的节点
	var rows = $("#issueStateTable").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要修改的数据！", "info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息", "不能选择多条数据！", "info");
		return;
	}
	//获取修改行的id
	var row = queryStateById(rows[0].stateCode);
	$("#state_form").form("load", row);
	//打开编号框为可编辑状态
	$("#stateCode").textbox("disable");
	// 打开新增修改对话框
	$("#state_am").dialog({
		modal : true,
		title : "修改缺陷状态",
		iconCls : "icon-save",
		onClose : function() {
			// 清空数据
			$("#state_form").form("reset");
		},
	}).dialog("center");
}

/**
 * 保存按钮
 */
function saveState(){
	//序列化表单
	var formData = $("#state_form").serializeObject();
	//获得ID
	formData.stateCode = $("#stateCode").textbox("getValue");
	//判断验证
	if($("#state_form").form("validate")){
		$.ajax({
			url : url,
			type : 'post',
			data : formData,
			dataType : "json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$('#issueStateTable').datagrid('reload');
					$.messager.alert("提示信息", "保存成功", "success!!");
					//重置表单数据，为下次操作做准备
					cancelState();
				} else if (data.resultCode == "0") {
					$.messager.alert("提示信息", "操作失败了", "error");
				}
			},
			error : function() {
				$.messager.alert('错误', '服务器内部错误!', 'error');
			}
		});
	}else{
		$.messager.alert('错误', '必填内容未填写，保存失败', 'error');
	}
	//重置表单数据，为下次操作做准备
	cancelState();
}

/**
 * 取消按钮
 */
function cancelState() {
	//关闭窗口
	$("#state_am").dialog("close");
	// 清空数据
	$("#state_form").form("reset");
}

/**
 * 单条查询
 * 
 * @param stateCode
 * @returns
 */
function queryStateById(stateCode) {
	var row = {};
	// 获取需要修改的这条数据
	$.ajax({
		url : basePath + "/queryStateById.json",
		type : 'post',
		data : {
			"stateCode" : stateCode
		},
		dataType : "json",
		async : false,
		success : function(data) {
			row = data.row;
		}
	});
	return row;
}

/**
 * 删除
 */
function removeIssueState(){
	// 得到要修改的节点
	var rows = $("#issueStateTable").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 得到要删除的行节点
	var stateCodes = [];
	//拼接字符串
	for (var i = 0; i < rows.length; i++) {
		stateCodes.push(rows[i].stateCode);
	}
	var a = "'"+stateCodes.join("','")+"'";
	$.messager.confirm('提示','您确认要删除吗？',function(r){
		if (r){
			$.ajax({
				url : basePath + "/romoveStateById.json",
				type : 'post',
				data : {"stateCodes":a},
				dataType : "json",
				async : false,
				success : function(data) {
					// 更新页面数据
					$('#issueStateTable').datagrid('reload');
				}
			});
		}else{
			$("#issueStateTable").datagrid('uncheckAll');
		}
	});
}

/**
 * 验证表名和实体名，不能为空也不能重复
 */
function validateMetamanage() {
	$.ajaxSettings.async=false;
	//描述非空
	$("#stateDescid").textbox({
		required:true,
		missingMessage:"描述不能为空"
	});
	//编号非空且不能重复
	$("#stateCode").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已经存在",
		validType:"remoteValid['"+basePath+"/validateState.json','stateCode']"
	});
	$.ajaxSettings.async=true;
}
