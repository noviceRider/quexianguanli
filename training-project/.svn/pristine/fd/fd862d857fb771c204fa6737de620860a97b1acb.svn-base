var userName;//当前登录用户名
var procCategory;//流程分类
var _procDefId;//记录全局变量流程定义id

/**
 * 初始化加载数据
 */
$(function(){
	
	//获取当前登录用户
	$.ajax({
		url:basePath + "/api_dataaccess.json",
		type:"post",
		data:{accessId:'1102'},
		async:false,
		success:function(data){
			//console.log(data);
		}
	});
	
	//数据网格加载
	$("#showFlowTable").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"8201",isUsed:""}));
	
	$("#showPics").load("showFlowPic.html",null,function(){
		//进行解析
		$.parser.parse(this);
		//详情弹窗设置
		$('#process_detail_div').dialog({
			closed:true,
			title : "流程图"
		});
	});
	
	//获取当前登录用户
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			userName=data.user.userName;
		}
	});
	
	//加载分类下拉框数据
	$.ajax({
		url:basePath + "/gmodule_datadict_findall.json",
		type:"post",
		data: {typeCode:"PROC_CATEGORY"},
		async:false,
		success:function(data){
			procCategory = data.rows;
		}
	});
	
});

/**
 * 点击查询
 */
function doSearch(){
	var params = $("#selectPostForm").serializeObject();
	params.accessId="8201";
	params.isUsed = $("#isUsed").is(':checked')?"1":"";
	$("#showFlowTable").datagrid("load",params);
}

/**
 * 显示无效流程
 */
function showNoUsedFlow(){
	$("#showFlowTable").datagrid('reload',{accessId:"8201",isUsed:$("#isUsed").is(':checked')?"1":""});
}

/**
 * 设置是否有效初始值
 */
function isUsedFormatter(value,row,index){
	if(value==1){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}

/**
 * 点击发布按钮
 */
function doRelease(){
	$("#addFlowDiv").dialog("setTitle","发布流程").dialog("open");
	$("#createBy").val(userName);
}

/**
 * 点击发布框的保存发布按钮
 */
function doDeployFlowSave(){
	if($("#addFlowForm").form("validate")){
		$("#addFlowForm").form("submit", {
			method: "post",
			url: basePath +  "/app_frame_workflow_uploadAndDeployFlow.json",
			success: function(data) {
				var data1 = JSON.parse(data);
				if(data1.resultCode == "1") {
					$("#addFlowDiv").dialog("close");
					$("#addFlowForm").form("reset");
					$("#showFlowTable").datagrid("reload");
				//成功后执行的操作
			 	} else if(data.resultCode == "2") {
					$.messager.alert("错误信息", "流程文件有误，部署失败", "error");
				} else {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				}
			}
		});
	}
}

/**
 * 关闭发布对话框
 */
function closeFlowDialog(){
	$("#addFlowDiv").dialog("close");
}

/**
 * 点击修改按钮
 */
var modifyId;//修改时的id
function doModify(){
	//获取选中行
	var row = $("#showFlowTable").datagrid("getSelected");
	if(row == null){
		$.messager.alert("提示信息", "请选择修改行", "info");
		return;
	}
	//获得ID
	modifyId = row.procId;
	//打开对话框
	$("#modifyFlowDiv").dialog("setTitle","修改").dialog("open");
	//获取焦点
	$("#procDescM").textbox().next('span').find('input').focus();
	//加载分类下拉框数据
	$("#procCategoryM").combobox({data:procCategory});
	//加载角色信息
	$("#roles").empty();
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:"post",
		data:{accessId:"9301"},
		async:false,
		dataType:"json",
		success:function(data){
			var roles = data.rows;
			if(roles!=null){
				var td = $("#roles");
				var rows = roles.length/4;
				var $table = $("<table id='tb_roles' style='width:100%'></table>").appendTo(td);
				for(var i=0;i<rows;i++){
					$("<tr><td style='width:25%'></td><td style='width:25%'></td><td style='width:25%'></td><td style='width:25%'></td></tr>").appendTo($table);
				}
				
				for(var i in roles){
					var $tds = $("#tb_roles td");
					var checkbox = $("<input type='checkbox' name='roleIds'/>")
					.val(roles[i].roleId)
					.attr("id",roles[i].roleId)
					.appendTo($tds[i]);
					
					var lable = $("<label></label>")
					.attr("for",roles[i].roleId)
					.text(roles[i].roleName)
					.appendTo($tds[i]);
				}
			}else{
				$("#roles").html("<span color='red'>角色信息加载失败</span>");
			}
		},
		error:function(){
			$("#roles").html("<span color='red'>角色信息加载失败</span>");
		}
	});
	//数据回显
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data: {procId:row.procId,accessId:"8103"},
		async:false,
		success:function(data){
			//数据回显
			$("#modifyFlowForm").form("load",data);
		}
	});
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data: {procId:row.procId,accessId:"8107"},
		async:false,
		success:function(data){
			var members = data.rows;
			var memberIds = [];
			for(var i in members){
				memberIds.push(members[i].memberId);
			}
			data.roleIds = memberIds;
			
			//权限数据回显
			$("#modifyFlowForm").form("load",data);
		}
	});
}

/**
 * 点击修改框中的保存按钮
 */
function doDeployFlowModify(){
	//获取权限信息
	var formData = $("#modifyFlowForm").serializeObject();
	var roleIds = formData.roleIds;
	if(roleIds!=null){
		if(typeof roleIds=="string"){
			
		}else if(roleIds){
			formData.roleIds = roleIds.join(",");
		}
	}
	formData.memberIds = formData.roleIds;
	formData.memberType = "1";
	formData.procId = modifyId;
	formData.logicId = "03.02.01";
	
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data: {
				procId:modifyId,
				procDesc:$("#procDescM").val(),
				procCategory:$("#procCategoryM").combobox("getValue"),
				isUsed:$('input:radio[name="isUsed"]:checked').val(),
				accessId:"8102"
			},
		async:false,
		success:function(data){
			$("#modifyFlowDiv").dialog("close");
			$("#modifyFlowForm").form("reset");
			$("#showFlowTable").datagrid("reload");
		}
	});
	
	//权限处理
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data: formData,
		async:false,
		success:function(data){
		}
	});
	
}

/**
 * 关闭修改对话框
 */
function closeModifyFlowDialog(){
	$("#modifyFlowDiv").dialog("close");
	$("#modifyFlowForm").form("reset");
}
/**
 * 操作格式化
 */
function opFormatter(value,row,index){
	return "<a href=\'#1\' onclick=\'openFlow(\""+row.procDefId+"\")\' style=\'color: blue;\' >开启流程</a>｜<a href=\'#1\' onclick=\'lookPic(\""+row.procDefId+"\")\' style=\'color: blue;\' >查看</a>";
}
/**
 * 获取开始节点formKey值
 * @param procDefId
 */
function openFlow(procDefId){
	//初始化表单容器
	$("#formParse").empty();
	
	_procDefId=procDefId;
	//获取开始节点formKey值
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data:{id:procDefId,logicId:'03.02.02'},
		async:false,
		success:function(data){
			//判断是否存在formKey值
			if(data.formKey){
				//formKey存在，加载form表单，并弹出
				$("#formParse").load(data.formKey, null, function() {
					$.parser.parse(this);
					loadALlSelect();
					$("#formParse").dialog(options).dialog("open").dialog("center");
				});
			}else{
				//直接启动流程
				directStartProcess(_procDefId);
			}
		}
	});
}
/**
 * 直接启动流程
 */
function directStartProcess(_procDefId){

}
/**
 * 关闭弹出窗
 */
function cancelStartProcess(){
	$("#formParse").dialog("close");
}
/**
 * 查看流程图
 * @param procDefId
 */
function lookPic(procDefId){
	var url=basePath+'/app_frame_workflow_getflowpic.json?procDefId=' + procDefId;
	$("#processImage img").attr("src",url);
	$("#process_detail_div").dialog("open").dialog("center");
}