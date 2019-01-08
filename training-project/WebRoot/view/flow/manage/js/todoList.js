var userName;//当前登录用户名
var procCategory;//流程分类
var _taskData;//点击处理后，把任务信息保存到全局
/**
 * 初始化加载数据
 */
$(function(){
	doSearch();
	//加载所属流程下拉选
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data: {accessId:"8109"},
		async:false,
		success:function(data){
			data.rows.unshift({procName:"全部流程"});
			$("#procNameQuery").combobox("loadData",data.rows);
			//默认选择全部流程
			$("#procNameQuery").combobox("setValue","全部流程");
		}
	});
	
	//详情页面
	$("#dialog_detail").load("showdetail.html",null,function(){
		//进行解析
		$.parser.parse(this);
		//详情弹窗设置
		$('#process_detail_div').dialog({
			closed:true,
			modal : true,
			title : "流程综合信息"
		});
	});
});

/**
 * 查询
 */
function doSearch(){
	var userId;
	var postCode = [];
	//通过当前登录用户查询对应员工信息
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data: {logicId:"04.03.05"},
		async:false,
		success:function(data){
			//员工信息中取出岗位ids
			var postIds = data.empInfo.postId;
			//查询岗位编号信息
			$.ajax({
				url:basePath + "/dataaccess.json",
				type:"post",
				data: {postIds:postIds,accessId:"1114"},
				async:false,
				success:function(data){
					//拼接
					var postData=data.rows;
					for(var i in postData){
						postCode.push("'P_"+postData[i].postCode+"'"); 
					}
				}
			});
		}
	});
	//岗位编号字符串，逗号隔开
	var postCodes = postCode.join(",");
	//查询当前用户角色编号，逗号隔开
	var roleCodeArray=[];
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data: {logicId:'09.01.06'},
		async:false,
		success:function(data){
			//拼接
			var roleData = data.roleInfo.rows;
			userId = data.userId;
			for(var i in roleData){
				roleCodeArray.push("'R_"+roleData[i].roleId+"'"); 
			}
		}
	});
	var roleCodes=roleCodeArray.join(",");
	var keyWord = $("#keyWord").textbox("getValue");
	var procName = $("#procNameQuery").combobox("getValue");
	procName = procName == "全部流程" ? "" : procName;
	//计算datagrid的显示高度
	var tableHeight = $(document).height() - 85;
	//页面datagrid加载数据参数
	var queryParams = Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"8202",postCodes:postCodes,roleCodes:roleCodes,userId:userId,keyWord:keyWord,procName:procName});
	queryParams.height = tableHeight;
	//查询当前登录用户的所有任务信息
	$("#showTaskTable").datagrid(queryParams);
}

//格式化文件上传时间
function TimeFormatter(value) {
	if(null == value || value == '') {
		return "";
	}
	return new Date(value).pattern("yyyy-MM-dd hh:mm");
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
			 	} else if(data.q == "2") {
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
	var returnHtml = "";
	if(row.assignee != null) {
		returnHtml = "<a href=\'#1\' onclick=\'dealTask(\""+index+"\")\' style=\'color: blue;\' >办理</a> | <a href=\'#1\' onclick=\'taskDetail(\""+index+"\")\' style=\'color: blue;\'>查看</a>";
	}else{
		returnHtml = "<a id=\'lockTaskBtn\' href=\'#1\' onclick=\'lockTask(\""+index+"\")\' style=\'color: blue;\' >锁定</a>"
					+"<a id=\'dealTaskBtn\' href=\'#1\' onclick=\'dealTask(\""+index+"\")\' style=\'color: blue;display:none;\' >办理</a> | " 
					+"<a href=\'#1\' onclick=\'taskDetail(\""+index+"\")\' style=\'color: blue;\'>查看</a>";
	}
	
	return returnHtml;
}

/**
 * 当前登录用户锁定任务
 * @param index 点击行下标
 */
function lockTask(index) {
	//提示
	$.messager.confirm("确认", "是否锁定当前任务，锁定后其他用户将不能再进行办理？", function(r){
		if(r){
			//隐藏锁定按钮
			$("#lockTaskBtn").hide();
			//显示办理按钮
			$("#dealTaskBtn").show();
			//获取选择的数据
			var rows=$("#showTaskTable").datagrid("getData").rows;
			_taskData=rows[index];
			//任务声明，分配任务到当前登录用户
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data: {taskId:_taskData.id,logicId:'03.02.03'},
				async:false,
				success:function(data){
				}
			});
			refresh();
		}
	});
}

/**
 * 获取开始节点formKey值
 * @param procDefId
 */
function dealTask(index){
	var rows=$("#showTaskTable").datagrid("getData").rows;
	_taskData=rows[index];
	
	//判断是否存在formKey值
	if(_taskData.formKey){
		//formKey存在，加载form表单，并弹出
		$("#formParse1").load(_taskData.formKey, null, function() {
			$.parser.parse(this);
			//判断初始化表单方法是否存在，存在则执行
			if(initPage&&typeof(initPage)=="function"){ 
				initPage(); 
				}
			//清除按钮，初始化form容器
			$("#formParse1").dialog({
			 	buttons:''
			});	
			$("#formParse1").dialog(options).dialog("open").dialog("center");
		});
	}
}

/**
 * 查询任务详情
 */
function taskDetail(index) {
	var rows=$("#showTaskTable").datagrid("getData").rows;
	_taskData=rows[index];
	//查询历史活动记录
	$.ajax({
		url:basePath + "/app_frame_workflow_gethistory.json",
		type:"post",
		data:{procInstId:_taskData.procInstId},
		async:false,
		success:function(data){
			//重组返回的数据
			var allShowData = [];
			var showData = {};
			for(var i=0;i<data.activitys.length;i++){
				showData=data.activitys[i].historyaActivityInstance;
				if(data.activitys[i].comment.length>0){
					showData.comment=data.activitys[i].comment[0].message;
				}else{
					showData.comment="";
				}
				showData.assigneeEmpName=data.activitys[i].assigneeEmpName;
				allShowData.push(showData);
			}
			allShowData[0].assigneeEmpName=_taskData.empName;
			$("#detail_task_dg").datagrid("loadData",allShowData);
		}
	});
	$("#processpic").attr("src",basePath+"/app_frame_workflow_trackflow.json?procDefId="+_taskData.procDefId+"&procInstId="+_taskData.procInstId+"&t="+new Date().valueOf());
	showFlowInfo(index);
	showBusinessInfo(index);
}

/**
 * 关闭弹出窗
 */
function cancelStartProcess(){
	$("#formParse1").dialog("close");
	//清空弹窗内容
	$("#formParse1").empty();
}

/**
* 关闭弹窗，刷新数据网格
*/
function refresh(){
	$("#formParse1").dialog("close");
	doSearch();
}

/**
 * 显示业务信息
 * @param index
 */
function showBusinessInfo(index){
	var row = $("#showTaskTable").datagrid('getData').rows[index];
	//存在业务信息关键字则显示，业务信息
	if(row.viewFormKey){
		$("#businessInfo").css("display","block");
		$("#formParse").load(row.viewFormKey, null, function() {
			$("#formParse").panel(options);
			$.parser.parse(this);
			//判断初始化表单方法是否存在，存在则执行
			if(initPage&&typeof(initPage)=="function"){ 
				initPage(row.businessKey); 
			}
		});
	}else{
		$("#businessInfo").css("display","none");
	}
}
/**
 * 显示流程概况
 * @param index
 */
function showFlowInfo(index){
	var row = $("#showTaskTable").datagrid('getData').rows[index];
	if(row.endTime){
		row.processState = "已结束";
	}else{
		row.processState = "进行中";
	}
	Common.loadDataForDOM(row,"#process_detail_div","span","name");
	$('#process_detail_div').dialog("open").dialog("center");
}
/**
 * 时间格式化
 * @param value
 * @returns
 */
function timeFormatter(value) {
	if(null == value || value == '') {
		return "";
	}
	return new Date(value).pattern("yyyy-MM-dd hh:mm");
}
/**
 * 格式化耗时字段
 * @param value
 * @param row
 * @param index
 * @returns {Number}
 */
function secondFormatter(value,row,index){
	
	if(row.endTime){
		var time=row.endTime-row.startTime;
		return formatDuring(time);
	}else{
		return 0;
	}
}
/**
 * 格式化时间长度
 * @param mss
 * @returns
 */
function formatDuring(mss) {
    //var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hoursStr = parseInt(mss / (1000 * 60 * 60))?parseInt(mss / (1000 * 60 * 60))+"小时":"";
    var minutesStr = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))?parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))+"分钟":"";
    var secondsStr = (mss % (1000 * 60)) / 1000?(mss % (1000 * 60)) / 1000+"秒":"";
    if(hoursStr==""&&minutesStr==""&&secondsStr==""){
    	return "0秒";
    }else{
    	return  hoursStr + minutesStr + secondsStr;
    }
}