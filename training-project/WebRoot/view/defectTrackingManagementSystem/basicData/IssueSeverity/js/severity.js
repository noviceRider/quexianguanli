/**
 * <p>title:缺陷管理系统-serverity.js</p>
 * 
 * <p>Description:缺陷严重程度的js</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
$(function(){
	/**
	 * 初始化数据网格加载数据
	 */
	$("#severityTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getSeverity.json", 135, null));
	
	/**
	 * 	初始化增加面板
	 * @returns
	 */
	$("#addSeverityContainer").load("addSeverity.html",null,function(){
		//初始化新增窗口
	//	$.parser.parse(this);
		$("#addSeverityPanel").dialog({
			title:"新增",
			iconCls:'icon-man',
			width:300,
			height:160,
			modal:true ,
			required:true ,
			closed:true
		});
		
		$("#addSeverityCode").textbox({width:180,validType:'ckSeverityCode'});
		$("#addSeverityDesc").textbox({width:180});
		
		/**
		 * 
		 */
		yanzheng();
		$("#addFormBtn").linkbutton({
			text:"确定",
			iconCls:'icon-save',
			onClick:function(){
				$("#addSeverityForm").submit();
			}
		});
		
		$("#guanbiFormBtn").linkbutton({
			text:"取消",
			iconCls:'icon-clear',
			onClick:guanbi
		});
	
	/**
	 * 
	 */
	$("#addSeverityForm").form({
			url:basePath+"/addSeverity.json",
			success:function(data){
				data = JSON.parse(data);
				if(data.result !=null){
					$.messager.alert("信息","新增用户成功！！");
					renovate();
					$("#addSeverityForm").form("reset");
					$("#addSeverityPanel").dialog({closed:true})
					return;
				}
				$.messager.alert("警告","新增用户失败！！");
			}
		});
		
	});
	
	
	/**
	 * 	初始化修改面板
	 * @returns
	 */
	$("#updSeverityContainer").load("updSeverity.html",null,function(){
		//初始化新增窗口
		$.parser.parse(this);
		$("#updSeverityPanel").dialog({
			title:"修改",
			iconCls:'icon-man',
			width:300,
			height:160,
			required:true,
			buttons:'#sc_mod',
			modal:true ,
			closed:true
		});
		
		$("#updSeverityCode").textbox({
			width:200
		})
		$("#updSeverityDesc").textbox({
			width:200
		})
		
		/**
		 * 
		 */
		$("#updFormBtn").linkbutton({
			text:"确定",
			iconCls:'icon-save',
			onClick: function(){
				$("#updSeverityForm").submit();
			}
		});
		
		$("#guanbiupdFormBtn").linkbutton({
			text:"确定",
			iconCls:'icon-clear',
			onClick: guanbiupdFormBtn
		});
		
		/**
		 * 
		 */
		$("#updSeverityForm").form({
			url:basePath+"/updateSeverity.json",
			success:function(data){
				data = JSON.parse(data);
				if(data.result != 0){
					$.messager.alert("信息","修改成功！！");
					renovate();
					$("#updSeverityForm").form("reset");
					$("#updSeverityPanel").dialog({closed:true})
					return;
				}
				$.messager.alert("警告","修改失败！！");
			}
		})
	});
	
})
/**
 *  打开增加的面板
 * @returns
 */
function addSeverity(){
	$("#addSeverityPanel").dialog("open");
}

/**
 * 	删除的方法
 */
function delSeverity(){
	//获取datagrid选中的行
	var rows = $("#severityTable").datagrid("getSelections");
	//判断是否有选中一行
	if(rows.length == 0 ){
		$.messager.alert('警告','没有选择要删除的缺陷严重程度，请先进行选择！！');   
		return;
	}
	
	$.messager.confirm('提示', '您是否要删除选中缺陷严重程度？', 
			function(r){
				if (r){
					var delIds = [];
					rows.forEach(e=>{
						delIds.push(e.severityCode);
					});
			$.post(
					basePath+"/deleteSeverity.json",
				 {"delIds":delIds},
				 function(data){
					 if(data.result==0){
						 $.messager.alert("警告","删除失败！！");return;
					 }
					 $.messager.alert("信息","删除成功！！");
					 renovate();
				 },
				 "json"
		    );
		}else{
			$("#severityTable").datagrid("uncheckAll");
		}
	});
}

/**
 * 重新加载页面的方法
 * @returns
 */
function renovate(){
	$("#severityTable").datagrid("reload");
}

/**
 * 	禁用、启用状态方法
 */
function operation(event){
	var s = $(event.target).attr("value");
	var s1 = $(event.target).attr("id");
	if(s == "01"){
		s = "00" ;
	}else{
		s = "01" ;
	}
	$.ajax({
		url:basePath+"/operation.json",
		type:"post",
		dataType:"json",
		data:{'severityCode':s1,'moduleState':s},
		success:function(data){
			renovate();
		}
	});
}

/**
 * 关键字查询并重新加载页面的方法
 * @returns
 */
function querySeverity(){
	$("#severityTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getSeverity.json", 135, {"keyWord":$("#keyWord").val()}));
	renovate();
}

/**
 * 	打开修改的面板
 * @returns
 */
function updSeverity(){
	var rows = $("#severityTable").datagrid("getSelections");
	if(rows.length == 0 ){
		$.messager.alert('警告','没有选择要修改的数据，请先进行选择！！');   
		return;
	}else if(rows.length > 1){
		$.messager.alert('警告','每次只能修改一条数据') ;
	}else{
		$("#updSeverityPanel").dialog("open");
		var severityCode = rows[0].severityCode ;
		$.post(basePath+"/getSeverityByCode.json",{"severityCode":severityCode},function(data){
			var severity = data.result;
			$("#updSeverityCode").textbox("setValue",severity.severityCode);
			$("#updSeverityDesc").textbox("setValue",severity.severityDesc);
			$("#updSeverityDesc").validatebox({
				required:true
			});
		})
	}
}

/**
 *  验证的方法
 */
function yanzheng(){
	$("#addSeverityCode").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已存在",
		validType:"remoteValid['"+basePath+"/yanzheng.json','severityCode']"
	});
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

function guanbi(){
	$("#addSeverityForm").form("reset");
	$("#addSeverityPanel").dialog({closed:true});
}

function guanbiupdFormBtn(){
	$("#updSeverityForm").form("reset");
	$("#updSeverityPanel").dialog({closed:true});
}