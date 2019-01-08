/**
* 加载页面
*/
$(function(){
	projectList();		//调用项目下拉列表方法
	timeVerification();		//调用时间验证方法
	$("#feedbacklistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadFeedback.json",135,null));	//加载数据网格
})
	
/**
* 项目下拉列表
*/
function projectList(){
	$.ajax({
		url:basePath+'/queryProjectTwo.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#feedbackProjectId").combobox({
			    valueField:'projectId', 
			    textField:'projectName',
			    panelHeight:'100px',
			    width:120 ,
			    data:data.rows ,
			    loadFilter:function(data){
				  	   data.unshift({projectId:'',projectName:'--请选择--'});
				  	   return data;
				  	}
			});
		}
	})
}

/**
* 搜索
*/
function feedbackQueryIssueBaseInfoPo(){
	var	verify = $("#feedbackSearch").form('validate');//判断返回的时true还是false
	if(verify){
		var params = $("#feedbackSearch").serializeObject();	//将表单序列化为对象
		$("#feedbacklistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadFeedback.json",135,params));		//发送数据到后端
	}else{
		$.messager.alert('警告','登记时间不正确');
	}
}

/**
* 操作反馈
*/
function feedbackFormatter(value,row,index){
	return "<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='feedbackDealWith(event)' style='color:blue'>反馈</a>"
}

/**
* 点击反馈超链接
*/
function feedbackDealWith(event){
	var issueId = $(event.target).attr("id");		//获取被选中行的缺陷编号
	$.post(basePath+"/dealWith.json",{"issueId":issueId},function(data){
		var $result = data.rows;
		$("#showissueId").val($result[0].issueId);//将缺陷编号回填到对应的位置
		var a = $result[0] ;
		if(a.doneRatio == null){
			a.doneRatio = '0';
		}
		for(index in a){		
			$("#show"+index).text(a[index]);//通过for循环把数据回填到反馈面板上
		}
	})
	$("#feedbacklistTableOne").datagrid(Common.createDatagridOptionsParams(basePath, "/loadingDefectFeedback.json",135,{"issueId":issueId}));		//加载缺陷反馈的数据
	$("#feedbackContainer").dialog("open");		//打开反馈面板
}

/**
* 反馈界面的保存按钮
*/
function feedbackOfPreservation(){
	$("#feedbackForm").form({
		url:basePath+"/feedbackOfPreservation.json",
		success:function(data){
			if(data.rows == 0){
				$.messager.alert("警告","反馈失败！");
				return;
			}else{
				$.messager.alert("信息","反馈成功！");
			}
			$("#feedbacklistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadFeedback.json",135,null));	//刷新页面
			$("#feedbackContainer").dialog("close");	//关闭反馈界面
			$("#feedbackForm").form("reset");	//清空反馈界面
		}
	})
	$("#feedbackForm").submit();	//提交反馈界面表单
}

/**
 * 反馈界面的关闭按钮
 */
function feedbackSave(){
	$("#feedbackContainer").dialog("close");		//关闭反馈界面
	$("#feedbackForm").form("reset");		//清空反馈界面
}

/**
 * 时间验证
 */
function timeVerification(){
	$("#feedbackPlanStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//开始时间
	$("#feedbackPlanEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//完成时间
}

function timevalidate(){
	$("#feedbackPlanStartTime").datebox('isValid');
	$("#feedbackPlanEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#feedbackPlanStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#feedbackPlanEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
        	var judge;
        	if(!isNaN(time1) && !isNaN(time2)){
        		judge =  time1 <= time2;
        	} else {
        		judge = true;
        	}
            return judge;
        },
        message:'开始时间要小于结束时间'
    }
});