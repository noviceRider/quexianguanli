
/**
 * 加载树形菜单&初始化页面
 * @returns
 */
$(function(){
	$("#listTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getDefectListOne.json",135,null));	//加载数据网格
	pullDownProject();		//调用项目下拉列表
	pullDownState();		//调用状态下拉列表
	timeVerification();		//调用时间验证
	/**
	 * 初始化新增任务页面 
	 */
	$("#addIssueBaseInfoPo").load("addIssueBaseInfo.html",null,function(){
		$("#addPanel").dialog({		//初始化新增任务窗口
			title:"新增任务",
			width:420,
			height:470,
			closed:true,
			onClose:cleanTask		//调用清空新增任务面板
		});
		
		/**
		 * 初始化新增任务组件
		 */
		$("#addIssueId").textbox({width:280,required:true});		//缺陷编号
		//$("#addProjectId").textbox({width:0});	//项目编号
		$("#addProjectName").textbox({width:280,required:true});	//项目名称
		$("#addParentIssueId").textbox({width:280});	//上级缺陷
		$("#addIssueName").textbox({width:280,required:true,});	//缺陷名称
		$("#addIssueDesc").textbox({width:280,height:70,required:true,multiline:true});	//缺陷描述
		$("#addDoneCondition").textbox({width:280,height:70,required:true,multiline:true});		//完成要求
		$("#addTypeDesc").combobox({width:100,panelHeight:'100px'});		//缺陷分类
		$("#addIssueSeverity").combobox({width:100,panelHeight:'100px'});		//严重程度
		$("#addIssuePriority").combobox({width:100,panelHeight:'100px'});		//优先级
		$("#addPlanWorkHours").textbox({width:100,required:true});		//预计工时
		$("#addPlanStartTime").datebox({width:100,required:true});	//计划开始时间
		$("#addPlanEndTime").datebox({width:100,required:true});		//计划完成时间
		$('#addDefectListattachFile').filebox({   	//上传附件 
		    buttonText: '选择文件', 
		    width:200,
		    buttonAlign: 'right' 
		})
		
		/**
		 * 初始化新增表单组件
		 */
		$("#addIssueBaseInfoPoForm").form({
			url:basePath+"/addPostAssignment.json",
			success:function(data){
				if(data.rows == 0){
					$.messager.alert("警告","新增任务失败！");
					return;
				}else{
					$.messager.alert("信息","新增任务成功！");
				}
				
				closeTask();		//关闭新增任务面板
				cleanTask();		//清空新增任务面板
				loadPage();			//刷新页面
			}
		});
		
		notRepeat();		//调用新增缺陷编号严重非重复方法
		
		$("#addFormBtn").linkbutton({		//初始化新增保存按钮
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				$("#addIssueBaseInfoPoForm").submit();		//提交新增表单
			}
		});	
		
		$("#closeFormBtn").linkbutton({		//初始化新增关闭按钮
			text:"关闭",
			iconCls:'icon-cancel',
			onClick:function(){
				closeTask();		//关闭新增任务面板
				cleanTask();		//清空新增任务面板
			}
		});	
	})
	
	/**
	 * 初始化操作修改面板
	 */
	$("#modifyContainer").load("modifyForbidden.html",null,function(){
		$("#updPanelOne").dialog({		//初始化操作修改窗口
			title:"修改任务",
			width:420,
			height:470,
			closed:true
		});
		
		/**
		 * 初始化修改任务组件
		 */
		$("#updIssueId").textbox({width:280});		//缺陷编号
		$("#updProjectName").textbox({width:280});		//项目名称
		$("#updParentIssueId").textbox({width:280});		//上级缺陷
		$("#updIssueName").textbox({width:280,required:true,});		//缺陷名称
		$("#updIssueDesc").textbox({width:280,height:70,required:true,multiline:true});		//缺陷描述
		$("#updDoneCondition").textbox({width:280,height:70,required:true,multiline:true});		//完成要求
		$("#updTypeDesc").combobox({width:100,panelHeight:'100px'});		//缺陷分类
		$("#updIssueSeverity").combobox({width:100,panelHeight:'100px'});		//严重程度
		$("#updIssuePriority").combobox({width:100,panelHeight:'100px'});		//优先级
		$("#updPlanWorkHours").textbox({width:100,required:true});		//预计工时
		$("#updPlanStartTime").datetimebox({width:100,required:true});		//计划开始时间
		$("#updPlanEndTime").datetimebox({width:100,required:true});		//计划完成时间
		$('#updDefectListattachFile').filebox({   	//上传附件 
		    buttonText: '选择文件', 
		    width:200,
		    /*required:true,*/
		    buttonAlign: 'right' 
		})
		/**
		 * 初始化修改表单组件
		 */
		$("#updIssueBaseInfoPoForm").form({
			url:basePath+"/modification.json",
			success:function(data){
				if(data.rows == 0){
					$.messager.alert("警告","修改任务失败！");
					return;
				}else{
					$.messager.alert("信息","修改任务成功！");
				}
				closeModifyTask();		//关闭修改任务面板
				modifyTask();		//清空修改任务面板
				loadPage();		//刷新页面
			}
		});
		
		$("#updFormBtn").linkbutton({		//初始化修改保存按钮
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				$("#updIssueBaseInfoPoForm").submit();		//提交修改表单
			}
		});
		
		$("#closeFormBtnOne").linkbutton({		//初始化修改关闭按钮
			text:"关闭",
			iconCls:'icon-cancel',
			onClick:function(){
				closeModifyTask();		//关闭修改任务面板
				modifyTask();		//清空修改任务面板
			}
		});
	})
	
	/**
	 * 初始化查看详细信息面板
	 */
	$("#RequirementsContainer").load("Requirements.html",null,function(){
		$("#showRequirements").dialog({		//初始化查看详细信息窗口
			title:"查看任务",
			width:400,
			height:440,
			closed:true
		})
		
		$("#closeRequirementsBtn").linkbutton({		//初始化查看详细信息关闭按钮
			text:"关闭",
			iconCls:'icon-cancel',
			onClick:function(){
				$("#showRequirements").dialog("close");		//关闭详情的面板
			}
		});
	})
	
	/**
	 * 初始化新增任务中的查询项目面板
	 */
	$("#searchProjectContainer").load("searchProject.html",null,function(){
		$("#searchProjectPanel").dialog({		//初始化新增任务中的查询项目窗口
			title:"选择项目",
			width:615,
			height:340,
			closed:true
		});
		
		/**
		 * 初始化新增任务中的查询项目面板中的查询按钮
		 */
		$("#formsearchProjectAbutton").linkbutton({
			text:"查询",
			iconCls:'icon-search'
		})
		
		/**
		 * 初始化新增任务中的查询项目组件
		 */
		$("#searchProjectId").textbox({width:120});	//项目

		$("#searehFormBtn").linkbutton({		//初始化新增任务中的查询项目中的确定按钮
			text:"确定",
			iconCls:'icon-save',
			onClick:function(){
				var getSelected = $("#searchlistTable").datagrid("getSelections");		//获取选中项目的数据
				console.log(getSelected[0].projectId);
				$("#addProjectName").textbox("setValue",getSelected[0].projectName);	//将选中的项目名回填到新增面板的对应位置
				$("#addProjectId").val(getSelected[0].projectId);
				$("#updProjectName").textbox("setValue",getSelected[0].projectName);	//将选中的项目名回填到修改面板的对应位置
				$("#updProjectId").val(getSelected[0].projectId)
				$("#searchProjectPanel").dialog("close");		//关闭查询项目面板
			}
		});
	})
	
	/**
	 * 初始化新增任务中查询缺陷面板
	 */
	$("#searchDefectContainer").load("SearchDefect.html",null,function(){
		$("#searchDefectPanel").dialog({		//初始化新增任务中查询缺陷窗口
			title:"选择缺陷",
			width:615,
			height:340,
			closed:true
		});
		
		/**
		 * 初始化新增任务中查询缺陷面板中的查询按钮
		 */
		$("#formsearchDefectAbutton").linkbutton({
			text:"查询",
			iconCls:'icon-search'
		})
		
		$("#searchDefectId").textbox({width:120})		//缺陷名称
		
		$("#searehDefectFormBtn").linkbutton({		//初始化新增任务中查询缺陷的确定按钮
			text:"确定",
			iconCls:'icon-save',
			onClick:function(){
				var getSelectedOne = $("#searchDefectlistTable").datagrid("getSelections");		//获取选中缺陷的数据
				$("#addParentIssueId").textbox("setValue",getSelectedOne[0].issueId);		//将获取的缺陷数据回填到新增任务面板的对应位置
				$("#updParentIssueId").textbox("setValue",getSelectedOne[0].issueId);		//将获取的缺陷数据回填到修改任务面板的对应位置
				$("#searchDefectPanel").dialog("close");		//关闭查询缺陷面板
			}
		});
	})
})

/**
 * 搜索
 */
function queryIssueBaseInfoPo(){
	var verify = $("#formsearch").form('validate');		//判断时间验证返回时true还是false
	if(verify){
		var params = $("#formsearch").serializeObject();	//将表单序列化为对象
		$("#listTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getDefectListOne.json",135,params));		//发送数据到后端
	}else{
		$.messager.alert('警告','登记时间不正确');
	}
}

/**
 * 加载页面
 */
function loadPage(){
	$("#listTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getDefectListOne.json",135,null));
}

/**
 * 清空新增任务面板
 */
function cleanTask(){
	$("#addIssueBaseInfoPoForm").form("reset");
}

/**
 * 清空修改任务面板
 */
function modifyTask(){
	$("#updIssueBaseInfoPoForm").form("reset");
}

/**
 * 打开新增任务面板
 */
function addIssueBaseInfoPo(){
	$("#addPanel").dialog("open");
}

/**
 * 打开查看任务面板
 */
function Requirements(){
	$("#showRequirements").dialog("open");
}
/**
 * 关闭新增任务面板
 */
function closeTask(){
	$("#addPanel").dialog("close");
}

/**
 * 关闭修改任务面板
 */
function closeModifyTask(){
	$("#updPanelOne").dialog("close");
}

/**
 * 操作方法
 */
function operation(value,row,index){
	if(row.issueStateName == "新建"){		//如果状态为新建，则返回修改和删除的超链接，否则返回查看的超链接
		return "<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='modifyForbidden(event)' style='color:blue'>修改</a>"
		+" | "+"<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='removeForbidden(event)' style='color:blue'>删除</a>"
	}
	else{
		return "<a href='#' id="+row.issueId+" value="+row.issueStateName+" onClick='examine(event)' style='color:blue'>查看</a>"
	}
}

/**
*	操作查看
*/
function examine(event){
	var issueId = $(event.target).attr("id");		//获取被选中行的缺陷编号
	$.post(basePath+"/examine.json",{"issueId":issueId},function(data){
		var $result = data.rows;
		if($result[0].doneRatio == null){
			$result[0].doneRatio = '0';
		}
		console.log($result[0].doneRatio);
		var a = $result[0] ;
		for(index in a){		//通过for循环把数据回填到查看面板上
			$("#show"+index).text(a[index]);
		}
	})
	$("#showRequirements").dialog("open");		//打开详情的面板
	
}

/**
* 操作删除
*/
function removeForbidden(event){
	//alert("1111")
	var issueId = $(event.target).attr("id");//获取选中行的缺陷编号
	$.post(basePath+"/removeForbiddenOne.json",{"issueId":issueId},function(data){	//发送请求判断是否为创建者本人的操作
			if(data.result == '1'){		
				$.post(basePath+"/removeForbidden.json",{"issueId":issueId},function(data){
					loadPage();		
				})
			}else{
				$.messager.alert("警告","只有创建者才能删除！");
			}	
	})
}

/**
 * 操作修改
 */
function modifyForbidden(event){
	var issueId = $(event.target).attr("id");//获取选中行的id
	$.post(basePath+"/removeForbiddenOne.json",{"issueId":issueId},function(data){
		if(data.result == '1'){//判断是否为创建者操作
			$.post(basePath+"/examine.json",{"issueId":issueId},function(data){
				var result = data.rows;
				console.log(result[0].projectId);
				/**
				 * 修改面板的回填
				 */
				$("#updIssueId").textbox("setValue",result[0].issueId);		//回填缺陷编号
				$("#updProjectName").textbox("setValue",result[0].projectName);		//回填项目名称
				$("#updProjectId").val(result[0].projectId);		//回填项目编号
				$("#updParentIssueId").textbox("setValue",result[0].parentIssueId);		//回填上级缺陷编号
				$("#updIssueName").textbox("setValue",result[0].issueName);		//回填缺陷名称
				$("#updIssueDesc").textbox("setValue",result[0].issueDesc);		//回填缺陷描述
				$("#updDoneCondition").textbox("setValue",result[0].doneCondition);	//回填完成要求	
				$("#updTypeDesc").combobox("setValue",result[0].issueType);		//回填缺陷分类
				$("#updIssueSeverity").combobox("setValue",result[0].issueSeverity);		//回填严重程度
				$("#updIssuePriority").combobox("setValue",result[0].issuePriority);		//回填优先级
				$("#updPlanWorkHours").textbox("setValue",result[0].planWorkHours);		//回填预计工时
				$("#updPlanStartTime").datebox("setValue",result[0].planStartTime);		//回填计划开始时间
				$("#updPlanEndTime").datebox("setValue",result[0].planEndTime);		//回填计划结束时间
			})
			$("#updPanelOne").dialog("open");		//打开修改面板	
		}else{
			$.messager.alert("警告","只有创建者才能修改！");
		}
	})
	
}

/**
* 项目下拉列表
*/
function pullDownProject(){
	$.ajax({
		url:basePath+'/getProject.json',//查询全部项目
		type:'post',
		dataType:'json',
		success:function(data){
			$("#projectId").combobox({
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
 * 新增和修改任务中项目下拉列表
 */
function searchProjectId(){
	$.ajax({
		url:basePath+'/getProject.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#searchProjectId").combobox({
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
 * 新增和修改任务中缺陷名称下拉列表
 */
function searchDefectId(){
	$.ajax({
		url:basePath+'/drawback.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#searchDefectId").combobox({
			    valueField:'issueId', 
			    textField:'issueName',
			    panelHeight:'100px',
			    width:120 ,
			    data:data.rows ,
			    loadFilter:function(data){
				  	   data.unshift({issueId:'',issueName:'--请选择--'});
				  	   return data;
				  	}
			});
		}
	})
}

/**
* 状态下拉列表
*/
function pullDownState(){
	$.ajax({
		url:basePath+'/getState.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#stateId").combobox({
			    valueField:'issueState', 
			    textField:'issueStateName',
			    panelHeight:'100px',
			    width:120 ,
			    data:data.rows ,
			    loadFilter:function(data){
				  	   data.unshift({issueState:'',issueStateName:'--请选择--'});
				  	   return data;
				  	}
			});
		}
	})
}

/**
* 新增任务中的查询项目面板
*/
function searchProject(){
	$("#searchlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getProjectOne.json",135,null));	//全查
	//searchProjectId();		//调用新增任务中项目下拉列表
	$("#searchProjectPanel").dialog("open");		//打开查询项目面板
}

/**
 * 新增和修改任务中的查询项目中的查询
 */
function searchProjectAbutton(){
	var params = $("#formsearchProject").serializeObject();		//序列化表单
	$("#searchlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/queryProject.json",135,params));
}

/**
 * 新增和修改任务中的查询缺陷中的查询
 */
function searchDefectAbutton(){
	var params = $("#formsearchDefect").serializeObject();		//序列化表单
	$("#searchDefectlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/queryDefect.json",135,params));
}

/**
 * 新增任务中的查询缺陷面板
 */
function searchDefect(){
	$("#searchDefectlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/drawbackOne.json",135,null));	//全查
	//searchDefectId();		//调用新增和修改任务中缺陷名称下拉列表方法
	$("#searchDefectPanel").dialog("open");
}

/**
 * 新增缺陷编号严重非重复
 */
function notRepeat(){
	$("#addIssueId").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已存在",
		validType:"remoteValid['"+basePath+"/notRepeat.json','issueId']"
	});
}

/**
 * 时间验证
 */
function timeVerification(){
	$("#planStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});		//开始时间
	$("#planEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});		//完成时间
}

function timevalidate(){
	$("#planStartTime").datebox('isValid');
	$("#planEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#planStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#planEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
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