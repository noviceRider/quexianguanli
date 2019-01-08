/**
 * <p>title:缺陷管理系统-ProjectManagementPo</p>
 * 
 * <p>Description:缺陷项目管理的js</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
var falg = false ; //用来判断是否是新增还是修改
var falg1 = false ;//用来判断是增加第一级还是下一级
$(function(){
	/**
	 * 	初始化表格数据、调用加载数据的方法
	 */
	loading();
	
	/**
	 * 	初始化新增面板
	 */
	$("#addProjectContainer").load("addProject.html",null,function(){
		$("#addProjectPanel").dialog({
			title:"新增项目",
			iconCls:'icon-save',
			width:280,
			height:245,
			modal:true ,
			buttons:'#abc',
			shadow:true,
			closed:true,
			onClose:function(){cancel()}
		});
		/**
		 * 	设置格式
		 */
		$("#addProjectId").textbox({width:180});
		$("#addProjectName").textbox({width:180});
		$("#addProjectIntro").textbox({width:180});
		$("#addProjectDsc").textbox({width:180});
		
		yanzheng();
		/**
		 * 	将超链接设置为确定按钮
		 */
		$("#addProjectFormBtn").linkbutton({
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				confirm();
			}
		});
		
		/**
		 * 	将超链接设置为取消按钮
		 */
		$("#cancelProjectFormBtn").linkbutton({
			text:"取消",
			iconCls:'icon-clear',
			onClick:function(){
				cancel();
			}
		});
	})
	
	/**
	 * 	初始化加载显示详细信息面板
	 */
	$("#viewTheDetailsContainer").load("viewTheDetails.html",null,function(){
		//设置窗口
		$("#showProjectDialog").dialog({
			title:"项目详细信息",
			width:300,
			height:400,
			modal:true ,
			shadow:true,
			closed:true,
			iconCls:'icon-save',
		});
	})

//括号，注意不要删掉
})

/**
 * 	加载数据网格的方法
 */
function loading(){
	$('#projectTable').treegrid({url:basePath+'/getProjects.json',onLoadSuccess:function(){$('#projectTable').treegrid("collapseAll")}});
	$(":checkbox").attr("checked",false);
}

/**
 *	显示无效 
 */
function showNoProject(){
	if($("#searchForm").find(":checkbox").is(':checked')){
		$('#projectTable').treegrid({url:basePath+'/getProjects1.json'});
	}else{
		$('#projectTable').treegrid({url:basePath+'/getProjects.json'});
	}
}

/**
 * 	刷新的方法
 */
function doRefresh(){
	$(":checkbox").attr("checked",false);
	showNoProject();
}

/**
 * 	增加第一级的方法
 * @returns
 */
function addFirstProject(){
	$("#addProjectId").textbox("enable");
	falg = true ;
	falg1 = true ;
	
	$("#addProjectPanel").dialog("open");
}

/**
 * 	增加下一级的方法
 * @returns
 */
function addNextProject(){
	$("#addProjectId").textbox("enable");
	falg = true ;
	falg1 = false ;
	var rows = $("#projectTable").datagrid("getSelections");
	if(rows.length == 0){
		$.messager.alert('警告','请在上级项目下创建！！');
		return;
	}else if(rows.length == 1){
		$("#addProjectPanel").dialog("open");
	}else{
		$.messager.alert('警告','只能在一个上级项目下创建！！');
		return;
	}
}

/**
 * 	保存的方法
 */
function confirm(){
	if(falg){
		if(falg1){
			var rows = $("#projectTable").datagrid("getSelections");
			var formData = $("#addProjectForm").serializeObject();
			formData['topProjectId']= "-1" ;
		}else{
			var rows = $("#projectTable").datagrid("getSelections");
			var formData = $("#addProjectForm").serializeObject();
			var topProjectId = rows[0].projectId;
			formData['topProjectId']=topProjectId ;
		}
		$.post(basePath+"/addProject.json",formData,function(data){
			if(data.result !=null){
				$.messager.alert("信息","新增项目成功！！");
				cancel();
				loading();
				return;
			}
			$.messager.alert("警告","新增项目失败！！");
		})
	}else{
		$("#addProjectId").textbox("enable");
		var rows = $("#projectTable").datagrid("getSelections");
		var formData = $("#addProjectForm").serializeObject();
		$.post(basePath+"/modifyProject1.json",formData,function(data){
			if(data.result != null){
				$.messager.alert("信息","修改项目成功！！");
				cancel();
				loading();
				return;
			}
			$.messager.alert("信息","修改项目失败！！");
		})
	}
}
/**
 * 取消的方法
 */
function cancel(){
	$("#addProjectForm").form("reset");
	$("#addProjectPanel").dialog({closed:true})
}

/**
 * 	修改的方法
 */
function modifyProject(){
	$("#addProjectId").textbox("disable");
	falg = false ;
	$("#addProjectPanel").dialog({
		title:"修改项目",
		iconCls:'icon-save',
		width:280,
		height:240,
		closed:true,
	});
	var rows = $("#projectTable").datagrid("getSelections");
	if(rows.length == 0){
		$.messager.alert('警告','请选择需要修改的项目！！');
		return;
	}else if(rows.length == 1){
		var projectId = rows[0].projectId ;
		$.post(basePath+"/queryProjectById.json",{"projectId":projectId},function(data){
				var project = data.result ;
				
				$("#addProjectForm").form('load',project);
				})
				$("#addProjectPanel").dialog("open");
		}else{
			$.messager.alert('警告','每次只能修改一个项目！！');
			return;
		}
}

/**
 * 	查看详情的方法
 */
function viewTheDetails(projectId){
	$.post(basePath+"/queryProjectById.json",{"projectId":projectId},function(data){
		var project = data.result;
		for(index in project){
			$("#show"+index).text(project[index]);
		}
		$("#showProjectDialog").dialog("open");
	})
}

/**
 * 	禁用、启用状态方法
 */
function conversion(event){
	var projectState = $(event.target).attr("value");
	var projectId = $(event.target).attr("id");
	if(projectState == "01"){
		projectState = "00" ;
	}else{
		projectState = "01" ;
	}
	$.ajax({
		url:basePath+"/conversion.json",
		type:"post",
		dataType:"json",
		data:{'projectId':projectId,'projectState':projectState},
		success:function(data){
			loading();
		}
	});
}

/**
 * 
 * @param event
 * @returns
 */
function jump(event){
	var projectId = $(event.target).attr("id");
	window.location.href = "member.html?valus="+projectId;
}

/**
 * 格式化是否有效数据列
 */
function isUsedFormatter(value,row,index){
	if (value == "有效") {// 有效
		return "<img src='../../../../css/themes/icons/ok.png'/>";
	} else if (value == "无效") {// 无效
		return "—";
	}
}

/**
 *  验证的方法
 */
function yanzheng(){
	$("#addProjectId").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已存在",
		validType:"remoteValid['"+basePath+"/yanzheng2.json','projectId']"
	});
}