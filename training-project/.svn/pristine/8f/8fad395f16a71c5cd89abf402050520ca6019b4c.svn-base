//当前登录用户
var user;
var procCategory;//流程分类

/**
 * 初始化加载数据
 */
$(function(){
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
	//查找当前登录用户
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			user=data.user;
			$("#userName").text(user.userName);
			$("#deptName").text(user.deptName);
			//$("#roleNameList").text(user.deptName+"/"+user.roleNameList);
		}
	});
	//计算datagrid的显示高度
	var tableHeight = $(document).height() - 85;
	//页面datagrid加载数据参数
	var queryParams = Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"8206",userId:user.userId});
	queryParams.height = tableHeight;
	//数据网格加载
	$("#showTaskTable").datagrid(queryParams);
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
	
	//加载分类查询下拉框数据
	procCategory.unshift({dictCode:"",dictDesc:"请选择"});
	$("#procCategoryQuery").combobox({data:procCategory});
});

/**
 * 点击查询
 */
function doSearch(){
	var params = $("#selectPostForm").serializeObject();
	params.accessId="8206";
	params.userId = user.userId;
	if(params.procName == "全部流程") {
		params.procName = "";
	}
	$("#showTaskTable").datagrid("load",params);
}
/**
 * 结束时间字段格式化
 * @param value
 * @param row
 * @param index
 * @returns
 */
function endFormatter(value,row,index){
	if(value){
		return value;
	}else{
		return "进行中";
	}
}
/**
 * 查看格式化
 * @param value
 * @param row
 * @param index
 * @returns {String}
 */
function opFormatter(value,row,index){
	return "<a href=\'#1\' onclick=\'trackFlow(\""+row.procDefId+"\",\""+index+"\",\""+row.procInstId+"\")\' style=\'color: blue;\' >查看</a>";
}
/**
 * 
 * @param pefId 流程定义id
 */
function trackFlow(procDefId,index,procInstId){
	//查询历史活动记录
	$.ajax({
		url:basePath + "/app_frame_workflow_gethistory.json",
		type:"post",
		data:{procInstId:procInstId},
		async:false,
		success:function(data){
			console.log(data);
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
			allShowData[0].assigneeEmpName=$("#showTaskTable").datagrid('getRows')[index].empName;
			$("#detail_task_dg").datagrid("loadData",allShowData);
		}
	});
	$("#processpic").attr("src",basePath+"/app_frame_workflow_trackflow.json?procDefId="+procDefId+"&procInstId="+procInstId);
	showFlowInfo(index);
	showBusinessInfo(index);
}
/**
 * 显示业务信息
 * @param index
 */
function showBusinessInfo(index){
	var row = $("#showTaskTable").datagrid('getRows')[index];
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
	var row = $("#showTaskTable").datagrid('getRows')[index];
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
    	return "0秒"
    }else{
    	return  hoursStr + minutesStr + secondsStr;
    }
}