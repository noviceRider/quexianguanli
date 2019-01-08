/**
* 加载页面
*/
$(function(){
	projectList();		//调用项目下拉列表方法
	timeVerification();		//调用时间验证
	$("#handlelistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadHandle.json",135,null));//加载数据网格	
})

/**
* 操作处理
*/
function handleFormatter(value,row,index){
	return "<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='dealWith(event)' style='color:blue'>处理</a>"
}

/**
 * 附件操作
 */
function enclosureFormatter(value,row,index){
	if(row.isPic == '1'){//判断附件是否为图片，如果是图片返回预览和下载超链接，否则返回下载超链接
		return '<a onClick=preview(\''+row.attachId+'\',\''+row.attachFile+'\'); style="color:blue">预览</a>'+ " | "
		+ '<a href='+basePath+'/previewPictures.json?attachId='+row.attachId+'&&attachFile='+row.attachFile+' style="color:blue">下载</a>';
	}else{
		return '<a href='+basePath+'/previewPictures.json?attachId='+row.attachId+'&&attachFile='+row.attachFile+' style="color:blue">下载</a>';
	}
}

/**
 * 图片预览
 */
function preview(attachId,attachFile){
	var arr = [];
	var url = {url:basePath+"/previewPictures.json?attachId="+attachId+"&&attachFile="+attachFile};
	arr.push(url);
	$("#preview").picturePreview(arr,"showPicture");
}

/**
 * 点击处理超链接
 */
function dealWith(event){
	var issueId = $(event.target).attr("id");		//获取被选中行的缺陷编号
	$.post(basePath+"/dealWith.json",{"issueId":issueId},function(data){
		var $result = data.rows;
		$("#showissueId").val($result[0].issueId);
		var a = $result[0] ;
		if(a.doneRatio == null){
			a.doneRatio = '0';
		}
		for(index in a){		
			$("#show"+index).text(a[index]);//通过for循环把数据回填到处理面板上
		}
	})
	$("#accessorylistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/queryAccessory.json",135,{"issueId":issueId}));//加载附件反馈的数据
	$("#handlelistTableOne").datagrid(Common.createDatagridOptionsParams(basePath, "/loadingDefectFeedback.json",135,{"issueId":issueId}));//加载缺陷反馈的数据
	$("#handleContainer").dialog("open");		//打开处理面板	
}

/**
 * 处理界面保存
 */
function handleOfPreservation(){
	$("#handleForm").form({
		url:basePath+"/handleOfPreservation.json",
		success:function(data){
			if(data.rows == 0){
				$.messager.alert("警告","处理失败！");
				return;
			}else{
				$.messager.alert("信息","处理成功！");
			}
			$("#handlelistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadHandle.json",135,null));	//刷新页面
			$("#handleForm").form("reset");	//清空处理界面
		}
	})
	$("#handleForm").submit();
	$("#handleContainer").dialog("close");		//关闭处理界面
}

/**
 * 处理界面关闭
 */
function handleSave(){
	$("#handleForm").form("reset");//清空表单
	$("#handleContainer").dialog("close");//关闭处理界面
}

/**
* 项目下拉列表
*/
function projectList(){
	$.ajax({
		url:basePath+'/queryProjectTwo.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#handleProjectId").combobox({
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
 * 搜索方法
 */
function handleQueryIssueBaseInfoPo(){
	var verify = $("#handleSearch").form('validate');//判断返回时true还是false
	if(verify){
		var params = $("#handleSearch").serializeObject();	//将表单序列化为对象
		console.log(params);
		$("#handlelistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadHandle.json",135,params));		//发送数据到后端
	}else{
		$.messager.alert('警告','登记时间不正确');
	}
}

/**
 * 时间
 */
function timeVerification(){
	//实际开始时间
	$("#handlePlanStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});
	//实际完成时间
	$("#handlePlanEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});
}

function timevalidate(){
	$("#handlePlanStartTime").datebox('isValid');
	$("#handlePlanEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#handlePlanStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#handlePlanEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
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