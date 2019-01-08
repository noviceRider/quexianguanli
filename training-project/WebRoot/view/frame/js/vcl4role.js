//当前登录用户
var user;
/**
 * 功能：初始化，加载角色信息数据
 * 参数：无
 */
$(function(){
	//设置加载信息 
	$("#dg").datagrid(Common.createDatagridOptionsParams(accessUrl, "", 135, {accessId:"9302",isUsed:1}));
});

/**
 * 功能：格式化显示成radiobutton
 * 参数：
 * 	value：某行该列的值
 * 	row：该行的数据
 * 	index：该行的下标
 */
function rbFormatter(value,row,index){
	return "<input type='radio' name='rb' value='"+row.roleId+"'/>";
}

/**
 * 功能：格式化角色成员及描述内容列
 * @param value
 * @param row
 * @param index
 */
function roleContentFormatter(value,row,index){
	if(value) {
		return "<span title='"+value+"'>"+value+"</span>";
	}
}

/**
 * 功能：双击行事件
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onDblClickRow(rowIndex,rowData){
	//doSelectRole();
	doTreeAuth();
}

/**
 * 功能：单击行事件
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onClickRow(rowIndex,rowData){
	var rbs = $(":radio[name='rb']");
	rbs[rowIndex].checked = true;
}

/**
 * 功能：选择角色，进入角色的功能授权页面
 * 参数：无
 */
function doSelectRole(){
	var row = $("#dg").datagrid("getSelected");
	var roleId = row.roleId;
	window.location.replace("vcl4role-auth.html?roleId="+roleId);
}

/**
 * 树形菜单授权
 */
function doTreeAuth() {
	if($("#dg").datagrid("getSelected") == null) {
		$.messager.alert("提示信息","请先选择角色，再进行授权！","info");
		return;
	}else {
		//得到当前角色ID
		var roleId = $("#dg").datagrid("getSelected").roleId;
		
		$("#treeAuth").tree({
			url:accessUrl,
			method:"post",
			animate:true,
			checkbox:true,//显示复选框
			//cascadeCheck:false,//关闭级联检查
			loadFilter:function(data,parent){
				var data1 = data.rows;
				for(var i in data1){
					data1[i].checked = data1[i].checked=="true" ? true:false;
				}
				return data1;
			},
	        onCheck: function (node, checked) {
/*	            if(checked) {
	               //如果选中，则将父节点全部选中
		           var parentNode = $("#treeAuth").tree('getParent', node.target);
		           if(parentNode != null) {
		                $("#treeAuth").tree('check', parentNode.target);
		           }
		           
		        	//当前节点选中前，先展开子节点
		        	$('#treeAuth').tree('expand', node.target); 

	            }else{
		            //如果取消选中，则判断父节点的子节点是否还有被选中
		            //若父节点的子节点有被选中，则父节点选中状态不变
		            //若父节点的子字节都没被选中，则父节点取消选中
			        //若当前节点取消选中，有子节点则需要将子节点全部取消选中
		            var childNode = $("#treeAuth").tree('getChildren', node.target);
		            if(childNode.length > 0) {
		                for(var i = 0; i < childNode.length; i++) {
		                  $("#treeAuth").tree('uncheck', childNode[i].target);
		                }
		            }
	            }*/
	        },
			onBeforeLoad:function(node,param) {
				param.accessId = "9405";
				param.memberId = roleId;
				//加载数据的请求前传入参数
				if(node != null) {
					param.pMenuId = node.id;
				}else{
					param.pMenuId = "%root%";
				}
			},
	        onLoadSuccess:function(node,data){ 
	        	$(this).css("color", "#407EAC");    // 改变tree字体颜色
	/*        	if(data[0].domId == "_easyui_tree_1") {
	            	var node = data[0];
	        		//默认展开第一个节点
	        		$('#treeAuth').tree('expand', node.target); 
	        	}*/
	        	for(var i in data) {
	        		//默认展开所有节点
	        		$('#treeAuth').tree('expand', data[i].target); 
	        	}
	         } 
		});
		
		$("#treeAuthDlg").show().dialog({
			width:"700px",
			height:"550px",
			title:"您正在对【<span style='color:red;'>"+ $("#dg").datagrid("getSelected").roleName+"</span>】进行授权操作",
			modal:true,
			resizable:false,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			buttons:"#btn_dlg",
			onClose:function(){
				$("#addSysRoleForm").form('reset');
			}
		});
	}
}


/**
 * 保存当前角色树形菜单授权信息
 */
function saveTreeAuth() {
	//得到当前角色ID
	var roleId = $("#dg").datagrid("getSelected").roleId;
	//得到当前角色拥有的授权信息
	var roleAuthList = $('#treeAuth').tree('getChecked', ['checked','indeterminate']);
	var menuIds = [];
	//遍历当前角色的授权信息，得到授权菜单ID数据
	for(var i in roleAuthList) {
		menuIds.push(roleAuthList[i].id);
	}
	//创建参数对象
	var formData = {};
	if(menuIds!=null){
		if(typeof roleIds=="string"){
			
		}else if(menuIds){
			//将菜单编号数组以逗号分割的字符串形式存放
			formData.menuIds = menuIds.join(",");
		}
	}
	formData["memberId"] = roleId;
	formData["logicId"] = "09.03.03";
	
	//执行授权信息的保存
	$.ajax({
		type: 'post',
		async: false,
		data: formData,
		url: logicUrl,
		success: function(data){
			if(data.resultCode==1){
				//刷新树
				$('#treeAuth').tree('reload');
				//关闭授权弹窗
				closeTreeAuthDlg();
			} else{
				$.messager.alert("提示信息","授权信息保存失败！","error");
			}
		},
		error: function(){
			$.messager.alert("提示信息","授权信息保存失败！","error");
		}
	});
}

/**
 * 关闭树形菜单授权弹窗
 */
function closeTreeAuthDlg() {
	$("#treeAuthDlg").window("close");
}

/**
 * 功能：点击查询按钮，按条件查询
 * 参数：无
 */
function doSearch(){
	//searchForm输入框失去焦点
	$("#searchForm input").blur();
	var queryParams = $("#searchForm").serializeObject();
	queryParams.isUsed = 1;
	queryParams.accessId = "9302";
	$("#dg").datagrid("load", queryParams);
}