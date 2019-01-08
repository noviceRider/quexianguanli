/**
 * 页面加载
 * @returns
 */
$(function(){
	//显示数据库信息
	$("#typeTable").datagrid(Common.createDatagridOptionsParams(basePath, "/basicData/getIssuePriority.json",135,null));
	$("#addIssuePriorityPo").load("addPriority.html",null,function(){
		//初始化新增窗口
		
		$("#addPanel").dialog({
			title:"增加优先级",
			width:350,
			height:165,
			closed:true,
		});
		//初始化新增优先级组件
		
		//编号
		$("#addPriorityCode").textbox({
			width:200,
			required:true
		});
		
		//描述
		$("#addPriorityDesc").textbox({
			width:200,
			required:true
		});
		
		//初始化表单组件
		$("#addIssuePriorityPoForm").form({
			url:basePath+"/basicData/addPriorityPo.json",
			success:function(data){
				if(data.rows == 0){
					$.messager.alert("警告","新增用户失败！！");
					return;
				}else{
					$.messager.alert("信息","新增用户成功！！");
				}
				resetAdd();	//清空新增面板
				$("#addPanel").dialog("close");	//关闭新增面板
				reloadDate();	//重新刷新页面
			}
		});
		validateMetamanage();		//验证编号
		//初始化保存按钮
		$("#addFormBtn").linkbutton({
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				$("#addIssuePriorityPoForm").submit();
			}
		});
		
		//初始化关闭按钮
		$("#closeFormBtn").linkbutton({
			text:"关闭",
			iconCls:'icon-cancel',
			onClick:function(){
				$("#addPanel").dialog("close");
				resetAdd();		//清空关闭面板
			}
		});
	});
	
	$("#delIssuePriorityPo").load("delPriority.html",null,function(){
		//初始化修改面板
		$("#delPanel").dialog({
			title:"修改优先级",
			width:350,
			height:165,
			closed:true
		});
		//初始化修改组件
		//修改编号
		$("#delPriorityCode").textbox({width:200});
		
		//修改描述
		$("#delPriorityDesc").textbox({width:200,required:true});
	
		//初始化表单组件
		$("#delIssuePriorityPoForm").form({
			url:basePath+"/basicData/updPriorityPo.json",
			success:function(data){
				if(data.rows == 0){
					$.messager.alert("警告","修改失败！！");
					return;
				}else{
					$.messager.alert("信息","修改成功！！");
				}
				
				$("#delPanel").dialog("close");	//关闭修改面板
				resetDel();	//清空修改面板
				reloadDate();	//重新刷新页面
			}
		});
		
		//初始化修改保存按钮
		$("#delFormBtn").linkbutton({
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				$("#delIssuePriorityPoForm").submit();	
			}
		});
		
		//初始化修改关闭按钮
		$("#delCloseFormBtn").linkbutton({
			text:"关闭",
			iconCls:'icon-cancel',
			onClick:function(){
				resetDel();		//清空修改面板
				$("#delPanel").dialog("close");	//关闭修改面板
			}
		});
	})
})


/**
 * 显示增加优先级信息面板
 * @returns
 */
function addIssuePriorityPo(){
	$("#addPanel").dialog("open");	
}

/**
 * 显示修改优先级信息面板
 */
function modifyIssuePriorityPo(){
	var $typeTable = $("#typeTable").datagrid("getSelections");		//判断用户是否正确选中
		if($typeTable.length == 0){
			$.messager.alert('警告','请先进行选择！！'); 
		}
		else if($typeTable.length == 1){
			$.post(basePath+"/basicData/getIssuePriorityId.json",{"id":$typeTable[0].priorityCode},function(data){
				var $typeTable = data.rows;
				//console.log($typeTable.priorityState);
				if($typeTable.priorityState == "有效"){
					$typeTable.priorityState = "01";
				}else{
					$typeTable.priorityState = "00";
				}
				$("#delPriorityCode").textbox("setValue",$typeTable.priorityCode);	//编号
				$("#delPriorityDesc").textbox("setValue",$typeTable.priorityDesc);	//描述
				$("#delPriorityState").val($typeTable.priorityState);	//状态
			},"json")
			$("#delPanel").dialog("open");
		}else{
			$.messager.alert('警告','请选择一条数据修改！！');
		}
}

/**
 * 清空新增面板
 */
function resetAdd(){
	//console.log("2222")
	$("#addIssuePriorityPoForm").form("clear");
}

/**
 * 清空修改面板
 */
function resetDel(){
	$("#delIssuePriorityPoForm").form("reset");
}

/**
 * 重新刷新页面
 */
function reloadDate(){
	$("#typeTable").datagrid(Common.createDatagridOptionsParams(basePath, "/basicData/getIssuePriority.json",135,null));
}

/**
 * 搜索优先级信息
 * @returns
 */
function queryIssuePriorityPo(){
	var params = $("#form_search").serializeObject();
	$("#typeTable").datagrid(Common.createDatagridOptionsParams(basePath, "/basicData/getIssuePriority.json",135,params));
}

/**
 * 删除
 */
function removeIssuePriorityPo(){
	var rows = $("#typeTable").datagrid("getSelections");
	console.log(rows);
	if(rows.length == 0 ){
		$.messager.alert('警告','请先进行选择！！');   
		return;
	}
	$.messager.confirm('提示', '您是否要删除选中数据？', 
			function(r){
		if (r){
			//2、发送异步请求到服务器完成删除功能
			//2-1：获取要删除优先级的id
			var delIds = [];
			rows.forEach(e=>{
				delIds.push(e.priorityCode);
			});
			$.post(
					basePath+"/basicData/delPriorityPo.json",
				 {"delIds":delIds},
				 function(data){
					 if(data.result==0){
						 $.messager.alert("警告","删除失败！！");return;
					 }
					 $.messager.alert("信息","删除成功！！");
					 reloadDate();//重新加载数据
				 },
				 "json"
		    );
		}else{
			$("#typeTable").datagrid("uncheckAll");
		}
	});
}

/**
 * 禁用，启用状态方法
 */
function forbidden(event){
	var $state = $(event.target).attr("value");		//获取状态的值
	var str1 = $state.slice(0,$state.indexOf(","));		//将一个值通过，号分为几个值，此时为第一个值
	var str2 = $state.slice($state.indexOf(",")+1);		//这为第二个值
	var $stateNuber = $(event.target).attr("id");
	if(str1 == "有效"){
		str1 = "00";
	}else{
		str1 = "01";	
	}
	$.ajax({
		url:basePath+"/basicData/updPriorityPo.json",
		type:"post",
		dataType:"json",
		data:{"priorityCode":$stateNuber,"priorityState":str1,"priorityDesc":str2},
		success:function(data){
			reloadDate();	//重新加载页面
		}
	})
}

/**
*编号验证
*/
function validateMetamanage(){
	$("#addPriorityCode").textbox({
		required:true,
		missingMessage:"编号不能为空",
		invalidMessage:"编号已存在",
		validType:"remoteValid['"+basePath+"/basicData/validatePriorityCode.json','priorityCode']"
	});
}
/**
 * 禁用，启用状态
 * @param value
 * @param row
 * @param index
 * @returns
 */
function sun(value,row,index){
	if(row.priorityState =='有效'){
		return"<a href='#' onClick='forbidden(event)' value="+row.priorityState+","+row.priorityDesc+" id="+row.priorityCode+" style='color:red'>禁用</a>";
	}else{
		return"<a href='#' onClick='forbidden(event)' value="+row.priorityState+","+row.priorityDesc+" id="+row.priorityCode+" style='color:blue'>启用</a>";
	} 
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