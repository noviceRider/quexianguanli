var url;// 请求URL
var isNew;// 新增、修改标志
var newStr;	// 新增或修改序列化的拼接的字符串

$(function(){
	
	// 加载新增、修改页面
	$("#role_add_modify_div").load("projectRole_add_modify.html", null,
			function() {
				// 进行解析
				$.parser.parse(this);
			});
	// 初始化数据网格
	$("#projectRoleTable").datagrid(
			Common.createDatagridOptionsParams(basePath,
					"/queryProjectRole.json", null, null));
});

/**
 * 查询
 * 刷新表格
 * @returns
 */
function queryProjectRole() {
	$("#projectRoleTable").datagrid("reload", $("#queryForm").serializeObject());
}

/**
* 新增按钮
*/
function addProjectRole() {
	isNew = true;
	url = basePath + "/addProjectRole.json";
	//打开角色ID为可编辑状态
	$("#roleCodeId").textbox("enable");
	
	// 打开新增对话框//
	$("#role_am").dialog({
		modal : true,
		title : "新增项目角色",
		iconCls : "icon-save",
		onClose : function() {
			// 清空数据
			$("#role_form").form("reset");
		},
	}).dialog("center");
	//编号、角色名字验证
	validateMetamanage();
}

/**
* 保存按钮
*/
function saveProjectRole(){
	
	//序列化表单
	serializeAddModefiyForm();
	
	if(isNew == true){
		
		url = basePath + "/addProjectRole.json";
		var formData = $("#role_form").serializeObject();
		//表单验证通过
		if($("#role_form").form("validate")){
		$.post(url,
				{"dataStr":newStr},
				function(data){
					if(data.resultCode==1){
						$.messager.alert("信息","	新增项目角色成功！");
						//刷新表格
						queryProjectRole();
					}else{
						$.messager.alert("警告","新增项目角色失败！");
					}
					//重置表单
					cancelProjectRole();
				},"json")
		}else{
			$.messager.alert('错误', '必填内容填写错误，保存失败', 'error');
		}
		
		/*else{
			$.messager.alert(
 					"警告","新增失败，原因可能是:"+"<br/>"
 					+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
 					+"1、角色编号已经存在；"+"<br/>"
 					+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
 					+"2、角色编号未输入。","error");
			cancelProjectRole();
		}*/
	}else{
		// 提交修改数据
		if($("#role_form").form("validate")){
			$.ajax({
				type:'post',
				url:basePath +"/modifyProjectRole.json",
				data:{"dataStr":newStr},
				dataType:'json',
				success:function(data){
					console.log(data);
					if(data.result==1){
						$.messager.alert("信息","修改项目角色成功！");
						queryProjectRole();
					}else{
						$.messager.alert("警告","修改项目角色失败！","error");
						
					}
					cancelProjectRole();
					//	取消网格中的被选中行
					$("#projectRoleTable").datagrid("unselectAll");
					
				},
				error:function(data){
					$.messager.alert("警告","新增失败！","error");
					cancelProjectRole();
				}
			});
		}
	};
	//刷新表格
	queryProjectRole();
}

/**
* 取消按钮
*/
function cancelProjectRole() {
	//关闭新增修改
	$("#role_am").dialog("close");
	// 清空数据
	$("#role_form").form("reset");
	//取消选中行
	$("#projectRoleTable").datagrid("unselectAll");
}
/**
 * 格式化操作数据列
 */
function formatterDo(value,row,index){
	if(row.moduleState == '有效'){
		return '<a style="color: blue;" href=# onClick=switchRo(event) value='+row.moduleState+' id='+row.roleCode+'>禁用</a>';
	}else{
		return '<a style="color: blue;" href=# onClick=switchRo(event) value='+row.moduleState+' id='+row.roleCode+'>启用</a>';
	}
}

/**
 * 禁用、启用转换
 */
function switchRo(event){
	var i = $(event.target).attr("value");
	var m = $(event.target).attr("id");

	if(i == "有效"){
		i = "00";
	}else{
		i = "01";
	}
	$.ajax({
		url:basePath+"/switchRo.json",
		type:"post",
		dataType:"json",
		data:{
			'roleCode':m,'moduleState':i
		},
		success:function(){
			queryProjectRole();
		}
	});
}




/**
 * 修改按钮
 */
function modifyProjectRole() {
	isNew = false;
	url = basePath + "/modifyProjectRole.json";

	//非空
	$("#roleNameId").textbox({
		required:true,
		missingMessage:"项目角色名不能为空"
	});
	
	// 得到要修改的节点
	var rows = $("#projectRoleTable").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要修改的数据！", "info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息", "不能选择多条数据！", "info");
		$("#projectRoleTable").datagrid("unselectAll");
		return;
	}
	//重置表单
	$("#addRoleForm").form("reset");
	//编号不可修改
	$("#roleCodeId").textbox("disable");
	var	getUpdId =rows[0].roleCode;
	
	$.post(
			basePath +"/queryProjectRoleById.json",
			{"roleCode":getUpdId},
			function(data){
				var issueCode = [];
				var issueCode = data.result[0].stateCode;
				issueCode = issueCode.split(",");
				console.log(issueCode);
				$("#roleCodeId").textbox("setValue",data.result[0].roleCode);
				$("#roleNameId").textbox("setValue",data.result[0].roleName);
				for (var i = 0; i < issueCode.length; i++) {
					$("#issue" + issueCode[i].slice(2)).prop("checked",true); 
				}
			},
		"json");
	
	// 打开新增修改对话框
	$("#role_am").dialog({
		modal : true,
		title : "修改缺陷状态",
		iconCls : "icon-save",
		onClose : function() {
			// 清空数据
			$("#role_form").form("reset");
		},
	}).dialog("center");
}

/**
 * 删除
 */
function removeProjectRole(){
	// 得到要删除的节点
	var rows = $("#projectRoleTable").datagrid("getSelections");
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 得到要删除的行节点
	var roleCodes = [];
	for (var i = 0; i < rows.length; i++) {
		roleCodes.push(rows[i].roleCode);
	}
	console.log(roleCodes);
	var a = "'"+roleCodes.join("','")+"'";
	//console.log(a);
	// 删除
	$.messager.confirm('提示','您确认要删除吗？',function(r){
		if (r){
			$.ajax({
				url : basePath + "/removeProjectRoleById.json",
				type : 'post',
				data : {"roleCodes":a},
				dataType : "json",
				async : false,
				success : function(data) {
					// 更新页面数据
					$('#projectRoleTable').datagrid('reload');
				}
			});
		}else{
			$("#projectRoleTable").datagrid('uncheckAll');
		}
	});
	
}


/**
 * 单条查询
 * 
 * @param roleCode
 * @returns
 */
function queryProjectRoleById(roleCode) {
	var row = {};
	// 获取需要修改的这条数据
	$.ajax({
		url : basePath + "/queryProjectRoleById.json",
		type : 'post',
		data : {
			"roleCode" : roleCode
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
 * 验证表名和实体名，不能为空也不能重复
 */
function validateMetamanage() {
	//非空
	$("#roleNameId").textbox({
		required:true,
		missingMessage:"项目角色不能为空"
	});
	console.log($("#roleNameId").val());
	//非空且不能重复
	$("#roleCodeId").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已经存在",
		validType:"remoteValid['"+basePath+"/validateRole.json','roleCode']"
	});
	
}



/**
 * 序列化新增修改表单
 */
 function serializeAddModefiyForm(){
	 
	 if($("#roleNameId").val() == null && $("#roleNameId").val() == ''){
		 return false;
	 }
	 else{
		 if($("input[name='roleStateRel']").val() == null && $("input[name='roleStateRel']").val() == ''){
			 return false;
		 }
		 else{
			 $("#hideCode").val($("#roleCodeId").val());
				var formData1 = $("#role_form").serializeObject();
				var formData2 = $("#role_form").serialize();
				var roleState = "";
				var arr = [];
			 	arr.push(formData1.roleStateRel);
					for (var i = 0; i < arr.length; i++) {
						roleState += arr[i]+',';
					}
				var str = formData1.roleCode+','+formData1.roleName+','+roleState;
				newStr = str.substring(0,str.lastIndexOf(","));
		 }
	 }
 }