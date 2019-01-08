/**
 * 加载页面
 */
$(function(){
	projectList();		//调用项目下拉列表方法
	timeVerification();		//调用时间验证
	$("#distributionlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadDistribution.json",135,null));	//加载数据网格
})

/**
* 操作分配
*/
function distribution(value,row,index){
	return "<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='allot(event)' style='color:blue'>分配</a>"
}

/**
* 点击操作分配超链接
*/
function allot(event){
	var issueId = $(event.target).attr("id");		//获取被选中行的缺陷编号
	$.post(basePath+"/ifAdministrator.json",{"issueId":issueId},function(data){//判断是否为项目管理员操作
		var $result = data.rows;
		if($result == 1){
			$.post(basePath+"/designate.json",{"issueId":issueId},function(data){//指派给的下拉列表，只能指派给本项目的参与人员
				$("#showassigneeName").combobox({
					    valueField:'assignee', 
					    textField:'assigneeName',
					    panelHeight:'100px',
					    width:120 ,
					    data:data.rows ,
					    loadFilter:function(data){
						  	   return data;
						  	}
					});
			})
			
			/**
			 * 查询数据回填到分配面板上
			 */
			$.post(basePath+"/allot.json",{"issueId":issueId},function(data){
				var $result = data.rows;
				$("#showissueId").val($result[0].issueId);
				var a = $result[0] ;
				console.log(a.doneRatio);
				if(a.doneRatio == null){
					a.doneRatio = '0';
				}
				for(index in a){		//通过for循环把数据回填到缺陷分配面板上
					$("#show"+index).text(a[index]);
				}
			});
			$("#distributionContainer").dialog("open");		//打开界面
		}
		else{
			$.messager.alert("警告","你不是这个项目的管理员，只有管理员才能分配！");
		}
	});
}

/**
 * 分配界面保存按钮
 */
function DistributionOfPreservation(){
	$("#distributionForm").form({
		url:basePath+"/DistributionOfPreservation.json",
		success:function(data){
			if(data.rows == 0){
				$.messager.alert("警告","分配失败！");
				return;
			}else{
				$.messager.alert("信息","分配成功！");
			}
			$("#distributionForm").form("reset");	//清空分配界面
			dataLoading();		//刷新页面
		}
	});
	$("#distributionForm").submit();		//提交分配缺陷任务表单
	$("#distributionContainer").dialog("close");//关闭分配界面
}

/**
 * 分配界面取消按钮
 */
function distributionSave(){
	$("#distributionContainer").dialog("close");//关闭分配界面
	$("#distributionForm").form("reset");	//清空分配界面
}

/**
* 加载数据网格方法
*/
function dataLoading(){
	$("#distributionlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadDistribution.json",135,null));	//加载数据网格
}

/**
* 搜索
*/
function distributionQueryIssueBaseInfoPo(){
	var verify = $("#distributionSearch").form('validate');//判断返回时true还是false
	if(verify){
		var params = $("#distributionSearch").serializeObject();	//将表单序列化为对象
		$("#distributionlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/loadDistribution.json",135,params));		//发送数据到后端
	}else{
		 $.messager.alert('警告','登记时间不正确');
	}
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
			$("#distributionProjectId").combobox({
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
 * 时间
 */
function timeVerification(){
	//实际开始时间
	$("#distributionPlanStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});
	//实际完成时间
	$("#distributionPlanEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});
}

function timevalidate(){
	$("#distributionPlanStartTime").datebox('isValid');
	$("#distributionPlanEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#distributionPlanStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#distributionPlanEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
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