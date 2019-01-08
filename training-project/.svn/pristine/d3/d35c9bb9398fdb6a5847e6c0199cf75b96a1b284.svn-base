//保存按钮的业务逻辑编号全局变量
var saveLogicId;
//用户判断新增和修改窗口的标志
var isWindow;

/**
*初始化datagrid动态加载数据的url
*/
window.onload=function(){
	$("#sr").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"9302"}));
};

/**
*当选择一行时，复选框也只能选择这行
*/
function onClickRow(rowIndex,rowData){
	//设置成不全选
	$("#sr").datagrid("uncheckAll");
	//选择当前行
	$("#sr").datagrid("checkRow",rowIndex);
}

/**
*当双击单元格时，修改当前行
*/
function onDblClickRow(rowIndex,rowData){
	modifySysRole();
}

/**
*分类列数据格式
*/
function isUsedFormatter(value, row, index){
	if(value==1) {
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} 
	else if(value==0){
		return  "—";
	}
}

function roleDescFormatter(value, row, index){
	if(value != null && value != "") {
		return '<span title='+value.replace(/\s+/g,"")+'>'+value+'</span>' ;
	}
}

/**
*根据输入的查询条件执行查询操作
*/
function doSearch(){
	//关键字输入框失去焦点
	$("#searchForm #keyword").blur();
	var params = $("#searchForm").serializeObject();
	params.accessId = "9302";
	//条件查询
	$("#sr").datagrid("load", params);
}


/**
 * 查询用户列表
 */
function queryRoleLists() { 
	if(isWindow == "add") {
		//获取当前选择的角色信息数组
		$("#canSelectUser").empty();
		//新增时获取已选成员的用户编号
        var userIds = $("#selectedUser option").map(function(){return "'"+$(this).val()+"'";}).get().join(",");
		$.ajax({
			type:"post",
			data:{"keyWord":$('#addSysRoleForm [name="keyWord"]').val(),selectedUser:userIds, accessId:"9304"},
			url:basePath + "/dataaccess.json",
			success:function(data){
				transfer();		
				//将查询结果循环添加到可选成员选择框中
				for(var i in data.rows) {
					$("#canSelectUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
				}
			}
		});
	}else{
		//当修改的时候查询除了已选成员以外的用户
		$("#canSelectUser").empty();
		//修改时获取已选成员的用户编号
        var userIds = $("#selectedUser option").map(function(){return "'"+$(this).val()+"'";}).get().join(",");
		$.ajax({
			type: "post",
			url: basePath + "/dataaccess.json",
			data: {"keyWord":$('#addSysRoleForm [name="keyWord"]').val(),selectedUser:userIds, accessId:"9304"},
			success: function(data){
				//加载选择框的操作函数
				transfer();
				for(var i in data.rows) {
					$("#canSelectUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
				}
			}
		});
	}

}

/**
* 两个Select之间进行数据转移的函数
**/
transfer = function() {
	//获取左右选择框对象 
	var leftSel  = $("#canSelectUser");
	var rightSel  = $("#selectedUser");
	//可选用户上面双击就右移
	$('#canSelectUser').dblclick(function() {	
	    leftSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(rightSel); 
	    });
	});

	//已选用户上面双击就左移
	$('#selectedUser').dblclick(function() {
		rightSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(leftSel); 
	    });
	});
	
	//全部从左边移到右边
	$('#allToRight').click(function() {
		$('#canSelectUser option').each(function(){ 
			 $(this).remove().appendTo(rightSel); 
		});
	});
	
	//将选中的项从左边移到右边
	$('#toRight').click(function() {
	    leftSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(rightSel); 
	    }); 
	});

	//全部从右边移到左边
	$('#allToLeft').click(function() {
		$('#selectedUser option').each(function(){ 
			 $(this).remove().appendTo(leftSel); 
		});
	});
	
	//将选中的项从右边移到左边
	$('#toLeft').click(function() {
	    rightSel.find("option:selected").each(function(){ 
	        $(this).remove().appendTo(leftSel); 
	    });
	});
};

/**
*角色新增弹窗
*/
function addSysRole(){
	saveLogicId = "09.02.01";
	isWindow = "add";
	//设置新增窗口角色编号为可编辑
	$("#addRoleId").textbox("enable");
	//重新加载新增窗口
	$("#addSysRoleForm").form('reset');
	//初始化选择框
	$("#selectedUser").empty(); 
	$("#canSelectUser").empty();
	//验证输入的角色编号是否存在
	typeNameValid("#addRoleId");
	//跳出弹窗
	$("#addSysRole").show().dialog({
		width:"700px",
		height:"550px",
		title:"新增角色",
		modal:true,
		resizable:false,
		collapsible:false,
		minimizable:false,
		maximizable:false,
		buttons:"#btn_dlg",
		onClose:function(){
			$("#addSysRoleForm").form('reset');
		}
	});
	setTimeout(function() {
		$("#addRoleId").textbox('textbox').focus();
	},300);
}

/**
 * 保存
 */
function saveAddSysRole() {
	//非空判断
	if($("#addRoleId").textbox('getValue')==null || $("#addRoleId").textbox('getValue')==""){ $("#addRoleId").textbox().next('span').find('input').focus(); return false;}
	if($("#addRoleName").textbox('getValue')==null || $("#addRoleName").textbox('getValue')==""){ $("#addRoleName").textbox().next('span').find('input').focus(); return false;}
    var userIds = $("#selectedUser option").map(function(){return $(this).val();}).get().join(",");
	var formData = $("#addSysRoleForm").serializeObject();
	formData.selectedUser = userIds;
	formData.roleId = $("#addRoleId").val();
	
	formData.logicId = saveLogicId;
	if($("#addSysRoleForm").form("validate")) {
		//表单数据传入数据库
		$.ajax({
			type: "post",
			url: basePath + "/businesslogic.json",
			data: formData,
			success: function(data){				
				if(data.resultCode == 1){
					$("#sr").datagrid('reload');																					
					closeAddRoleWindow();					
				} else{
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				}
			}
		});
	}	
}

/**
 * 关闭窗口
 */
function closeAddRoleWindow(){
	 $("#addSysRole").window("close");
 }

/**
*角色修改弹窗
*/
function modifySysRole(){
	saveLogicId =  "09.02.02";
	isWindow = "modify";
	//获取当前选择的角色信息数组
	$("#addRoleId").textbox("disable");
	var rows = $("#sr").datagrid("getChecked");
	if(rows.length>1){$.messager.alert("提示信息", "一次只能选择一条数据进行修改！", "info");}
	else if(rows.length==0){$.messager.alert("提示信息", "请选择您要修改的数据！", "info");}
	else{
		var row = rows[0];
		$("#addSysRoleForm").form("load",row);
		//初始化选择框
		$("#selectedUser").empty(); 
		$("#canSelectUser").empty();
		if(row.roleMember != "" && row.roleMember  != null) {
		}
		$.ajax({
			type: "post",
			url: basePath + "/dataaccess.json",
			data: {roleId:row.roleId,accessId:"9304"},
			success: function(data){
				//加载选择框的操作函数
				transfer();
				for(var i in data.rows) {
					$("#selectedUser").append("<option value="+data.rows[i].userId+">"+data.rows[i].userName+"</option>");
				}
			}
		});
	
		
		//跳出弹窗
		$("#addSysRole").show().dialog({
			width:"700px",
			height:"550px",
			title:"修改角色",
			modal:true,
			resizable:false,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			buttons:"#btn_dlg",
			onClose:function(){
				$("#addSysRoleForm").form('reset');
			}
		});
	}
}

/**
 * 删除选中的角色信息
 */
function deleteSysRole() {
	//获取当前选择的角色信息数组
	var ids = Common.getSelectedIds("#sr", "roleId", "roleId");
	if(ids.length==0){
		$.messager.alert("提示信息","请选择你要删除的数据！","info");
	}else{
		 if($.messager.confirm("提示信息","是否删除所选的角色信息，这一操作是不可逆的，是否继续？", function(r){
			 if(r){
				var roleIds = [];
				for(var i in ids){
					roleIds.push(ids[i].value);
				}
				
				 $.ajax({
					 type: "post",
					 url: basePath +"/businesslogic.json",
					 data: {roleIds: roleIds.join(","),logicId:"09.02.04"},
				 	 success:function(data){
				 		 if(data.resultCode == 1){
				 			$("#sr").datagrid('reload');
				 		 } else{
				 			 $.messager.alert("错误信息","在删除的过程中发生错误，请重新尝试或联系系统管理人员","error");
				 		 }
				 	 }
				 });
			 }
		 }));
	}
}

	
/**
 * 远程校验角色编号是否存在
 * @param id
 */
function typeNameValid(id){
	$(id).textbox({
		invalidMessage:"该角色编号已存在",
		validType:"remoteValid['" + basePath + "/businesslogic.json', 'roleId', {logicId: '09.02.03'}]"
	});
}
