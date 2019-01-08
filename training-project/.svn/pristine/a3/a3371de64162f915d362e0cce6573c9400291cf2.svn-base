/**
 * 功能：初始化,加载初始数据
 */
$(function (){
	loadDatagrid();
});

/**
 * 功能：格式化是否特殊功能数据列
 * @param value
 * @param row
 * @param index
 */
function isSpecFunctionFormatter(value, row, index){
	if(value==1) {
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} 
	else if(value==0){
		return  "—";
	}
}

/**
 * 功能：格式化是否系统菜单数据列
 * @param value
 * @param row
 * @param index
 */
function isSysManageFormatter(value, row, index) {
	if(value==1){
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} 
	else if(value==0){
		return  "—";
	}
}

/**
 * 功能：格式化有效否数据列
 * @param value
 * @param row
 * @param index
 */
function isUsedFormatter(value, row, index){
	if(value==1){
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} else if(value==0){
		return  "—";
	}
}

/**
 * 是否显示无效菜单
 */
function showNoUsed(){
	loadDatagrid();
}

/**
 * 功能:校验菜单编号是否存在
 * 参数：
 * 	formId 表单的id
 * 返回值：无
 */
function menuValid(formId){
	$("#"+formId+"_menuId").textbox({
		required:true,
		missingMessage:"菜单编号不能为空",
		invalidMessage:"菜单编号已经存在",
		validType:"remoteValid['" + logicUrl + "', 'menuId', " + 
		"{logicId:'09.03.01', pMenuId:'" + $("#"+formId+"_pMenuId").text() + "'}]"
	});
}

/**
 * 刷新数据
 */
function doRefresh(){
	loadDatagrid();
}

/**
 * 加载数据网格内容
 */
function loadDatagrid(){
	//设置treegrid初始属性及方法
	$("#menuTreeGrid").treegrid({
		idField: 'menuId',
		treeField: 'menuName',
		parentField : 'pMenuId',
		animate: true,
		striped:true,
		method: 'post',
		singleSelect:true,
		onBeforeExpand: onBeforeExpand,
		onClickCell:function(field,row){
			if(field=="menuName"){
				var children = $("#menuTreeGrid").treegrid("getChildren",row.menuId);
				//alert(children.length);
				if(row.childNum>0||children.length>0){
					$(this).treegrid("toggle",row.menuId);
				}
			}
		},
		onDblClickCell:function(field,row){
			if(field!="menuName"){
				modifyMenu();
			}
		},
		//在树上右键点击的菜单
		onContextMenu: function(e, row){
			e.preventDefault();
			$(this).treegrid('select',row.menuId);
			$('#mm').menu('show',{
				left: e.pageX,
				top: e.pageY
			});
		}
	});
	
	//加载treegrid数据
	$.ajax({  
		url: accessUrl,  
		type: 'post',
		async: false,
		dataType: 'json', 
		data:{"isUsed": $("#searchForm").find(":checkbox").is(':checked')?'':'1', accessId:"9401",pMenuId:"%root%"},
		success:function(data) {
			$("#menuTreeGrid").treegrid('loadData',data);
		},
		error : function() {
			$.messager.alert('错误','服务器内部错误!','error');
		}
	});
}

/**
 * 功能：节点展开之前的事件
 * @param row
 */
function onBeforeExpand(row){
	//判断是否需要加载子节点
	if(row.children==undefined||row.children==[]){
		var memuId = row.menuId;
		var childNodes = reloadChildrenMenu(row);
		$('#menuTreeGrid').treegrid('append',{
			parent: memuId,  
			data: childNodes
		});
	}
}

/**
 * 功能：加载子节点数据
 * @param row
 * @returns
 */
function  reloadChildrenMenu(row){
	var menuChildData = undefined;
	row.isUsed = $("#searchForm").find(":checkbox").is(':checked')?'':'1';
	row.accessId = "9401";
	row.pMenuId = row.menuId;
	//alert(JSON.stringify(row));
	$.ajax({  
		type: 'post',
		async: false,  
		data:row,
		url: accessUrl,  
		success:function(data) {
			menuChildData = data.rows;
		},
		error : function() {
			$.messager.alert('错误','服务器内部错误!','error');
		}
	});
	
	return menuChildData;
}

/**
 * 功能：打开新增第一级菜单对话框
 * 参数：无
 */
function addRootMenu(){
	menuValid("addRootMenuForm");
	$("#addRootMenuForm").find("[name='menuName']").textbox({required:true,missingMessage:"菜单名称不能为空"});
	//设置对话框按钮
	$("#addRootMenu").dialog({
		modal:true,
		buttons: [{
			text:'保存',
			iconCls:'icon-ok',
			handler:function(){
				//console.debug("哈哈哈哈哈哈哈");
				var menu = $("#addRootMenuForm").serializeObject();
				menu.isSpecFunction = $("#addRootMenuForm").find("[name='isSpecFunction']").is(":checked")?"1":"0";
				menu.isSysManage = $("#addRootMenuForm").find("[name='isSysManage']").is(":checked")?"1":"0";
				menu.isUsed = "1";
				menu.pMenuId = "%root%";
				menu.accessId = "9403";
				menu.url = "";
				//alert(JSON.stringify(menu));
				//保存添加第一级菜单
				var isIdValid = false;
				var isNameValid = false;
				if($("#addRootMenuForm_menuId").textbox("isValid")){
					isIdValid = true;
				}else{
					isIdValid = false;
				}
				
				var value = $("#addRootMenuForm").find("[name='menuName']").val();
				if(value==null || value==""){
					isNameValid = false;
				}else{
					isNameValid = true;
				}
				
				if(isNameValid && isIdValid){
					$.ajax({
						 url:accessUrl,
						 method:"post",
						 data:menu,
						 dataType:"json",
						 success:function(data){
							 var nodes = $("#menuTreeGrid").treegrid("getRoots");
							 var node = nodes[nodes.length-1];
							 //alert(JSON.stringify(node));
							 if(data.resultCode==1){
								 //$.messager.alert("提示信息","添加第一级级菜单成功！","info");
								 closeWindow("addRootMenu");
								 //loadDatagrid();
								 $("#menuTreeGrid").treegrid("insert",{
									 after:node.menuId,
									 data:menu
								 });
							 }else{
								 $.messager.alert("提示信息","添加菜单失败！","info");
							 }
						 },
						 error : function() {
								$.messager.alert('错误','服务器内部错误!','error');
						 }
					});
				}
			}
		},{
			text:'取消',
			iconCls:'icon-cancel',
			handler:function(){
				closeWindow("addRootMenu");
			}
		}],
		 onClose:function(){
			 $("#addRootMenuForm").form("reset");
		 }
	});
	//打开对话框
	$(".dialog-button").css("text-align","right");
	$("#addRootMenu").dialog('open');
	
	setTimeout(function(){
		$("#addRootMenuForm_menuId").textbox("textbox").focus();
	}, 300);
}

/**
 * 功能：新增第一级时，菜单编号改变事件
 */
function addRootMenuIdChange(){
	$("#addRootMenuForm #sortNo").textbox("setValue",$("#addRootMenuForm_menuId").textbox("getValue"));
}

/**
 * 功能：新增下级菜单时，排序号自动填写
 */
function addNextMenuSortNoAutoFill(){
	var value = $("#addNextMenuForm_menuId").textbox("getValue");
	$("#addNextMenuForm #sortNo").textbox("setValue",value);
}

/**
 * 功能：打开新增下级菜单对话框
 */
function addNextMenu(){
	//判断是否选择
	var menuIds = Common.getSelectedIds("#menuTreeGrid", "menuId", "menuIds");
	if(menuIds.length != 1){
		 $.messager.alert("提示信息","请选择上级菜单！","info");
	 } else {
		//得到父级id
		var pMenuId = menuIds[0].value;
		$("#addNextMenuForm_pMenuId").html(pMenuId+".");
		menuValid("addNextMenuForm");
		$("#addNextMenuForm").find("[name='menuName']").textbox({required:true,missingMessage:"菜单名称不能为空"});
		//设置对话框按钮
		 $("#addNextMenu").dialog({
			 modal:true,
			 buttons: [{
				 text:'保存',
				 iconCls:'icon-ok',
				 handler:function(){
					var menu = $("#addNextMenuForm").serializeObject();
					menu.isSpecFunction = $("#addNextMenuForm").find("[name='isSpecFunction']").is(":checked")?"1":"0";
					menu.isSysManage = $("#addNextMenuForm").find("[name='isSysManage']").is(":checked")?"1":"0";
					menu.pMenuId = pMenuId;
					menu.menuId = pMenuId + "." + menu.menuId;
					menu.isUsed = "1";
					menu.url = menu.url == null ? "":menu.url;
					menu.accessId = "9403";
					//alert(JSON.stringify(menu));
					 //保存添加下级菜单
					
					var isIdValid = false;
					var isNameValid = false;
					if($("#addNextMenuForm_menuId").textbox("isValid")){
						isIdValid = true;
					}else{
						isIdValid = false;
					}
					
					var value = $("#addNextMenuForm").find("[name='menuName']").val();
					if(value==null || value==""){
						isNameValid = false;
					}else{
						isNameValid = true;
					}
					
					if(isNameValid && isIdValid){
						 $.ajax({
							 url:accessUrl,
							 type:"post",
							 data:menu,
							 dataType:"json",
							 success:function(data){
								 if(data.resultCode==1){
									 //$.messager.alert("提示信息","添加下级菜单成功！","info");
									 closeWindow("addNextMenu");
									 //loadDatagrid();
									 var node = $("#menuTreeGrid").treegrid("getSelected");
									 $("#menuTreeGrid").treegrid("append",{
										 parent:node.menuId,
										 data:[menu]
									 });
								 }else{
									 $.messager.alert("提示信息","添加菜单失败！","info");
								 }
							 },
							 error : function() {
									$.messager.alert('错误','服务器内部错误!','error');
							 }
						 });
					}
				 }
			 },{
				 text:'取消',
				 iconCls:'icon-cancel',
				 handler:function(){
					 closeWindow("addNextMenu");
				 }
			 }],
			 onClose:function(){
				 $("#addNextMenuForm").form("reset");
			 }
		 });
		//打开对话框
		 $(".dialog-button").css("text-align","right");
		 $("#addNextMenu").dialog('open');
		 
		 setTimeout(function(){
			$("#addNextMenuForm_menuId").textbox("textbox").focus();
		}, 300);
	 }
}

/**
 * 功能：打开修改对话框
 */
function modifyMenu(){
	//判断是否选择
	var menuIds = Common.getSelectedIds("#menuTreeGrid", "menuId", "menuIds");
	if(menuIds.length != 1){
		 $.messager.alert("提示信息","请选择您要修改的数据！","info");
	 } else {
		 var menuId = menuIds[0].value;
		 //数据回显
		 $.ajax({
			url:accessUrl,
			type:"post",
			data:{menuId:menuId, accessId:"9402"},
			dataType:"json",
			success:function(data){
				var menu = data;
				$("#modifyMenuForm #menuId").html(menu.menuId);
				$("#modifyMenuForm #menuName").textbox("setValue",menu.menuName);
				$("#modifyMenuForm #url").textbox("setValue",menu.url);
				$("#modifyMenuForm #isSpecFunction").attr("checked",menu.isSpecFunction=="1"?true:false);
				$("#modifyMenuForm #isSysManage").attr("checked",menu.isSysManage=="1"?true:false);
				$("#modifyMenuForm #isUsed").attr("checked",menu.isUsed=="1"?true:false);
				$("#modifyMenuForm #defaultImg").textbox("setValue",menu.defaultImg);
				$("#modifyMenuForm #sortNo").textbox("setValue",menu.sortNo);
			}
		 });
		 $("#modifyMenuForm").find("[name='menuName']").textbox({required:true,missingMessage:"菜单名称不能为空"});
		 $("#addRootMenuForm_menuId").focus();
		 
		 
		 //设置对话框按钮
		 $("#modifyMenu").dialog({
			 modal:true,
			 buttons: [{
				 text:'保存',
				 iconCls:'icon-ok',
				 handler:function(){
					 var menu = $("#modifyMenuForm").serializeObject();
					 menu.menuId = menuId;
					 menu.isSpecFunction = $("#modifyMenuForm").find("[name='isSpecFunction']").is(":checked")?"1":"0";
					 menu.isSysManage = $("#modifyMenuForm").find("[name='isSysManage']").is(":checked")?"1":"0";
					 menu.isUsed = $("#modifyMenuForm").find("[name='isUsed']").is(":checked")?"1":"0";
					 menu.url = menu.url == null ? "":menu.url;
					 menu.accessId = "9404";
					 //menu.pMenuId = pMenuId;
					 //alert(JSON.stringify(menu));
					 //保存修改
					 $("#modifyMenuForm").form("validate");
					 var valid = true;
					 var value = $("#modifyMenuForm").find("[name='menuName']").val();
					 if(value==null || ""==value){
						 valid = false;
					 }else{
						 valid = true;
					 }
					 
					 if(valid){
						 $.ajax({
							 url:accessUrl,
							 type:"post",
							 data:menu,
							 dataType:"json",
							 success:function(data){
								 if(data.resultCode==1){
									 //$.messager.alert("提示信息","菜单修改成功！","info");
									 closeWindow("modifyMenu");
									 //loadDatagrid();
									 $("#menuTreeGrid").treegrid("update",{
										 id:menu.menuId,
										 row:menu
									 });
								 }else{
									 $.messager.alert("提示信息","菜单修改失败！","info");
								 }
							 },
							 error : function() {
									$.messager.alert('错误','服务器内部错误!','error');
							 }
						 });
					 }
				 }
			 },{
				 text:'取消',
				 iconCls:'icon-cancel',
				 handler:function(){
					 closeWindow("modifyMenu");
				 }
			 }],
			 onClose:function(){
				 $("#modifyMenuForm").form("reset");
			 }
		 });
		 
		//打开对话框
		 $(".dialog-button").css("text-align","right");
		 $("#modifyMenu").dialog('open');
		 
		 setTimeout(function(){
			$("#menuName").textbox("textbox").focus();
		}, 300);
		 
	 }
}

/**
 * 功能：根据DOM文档的ID关闭窗口
 * @param ID
 */
function closeWindow(ID){
	$("#"+ID+"Form").form('reset');
	$("#"+ID+"").dialog('close');
}