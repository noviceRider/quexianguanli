/**
 * 功能：初始化，加载角色信息数据
 * 参数：无
 */
$(function(){
	//设置加载参数isUSed为1
	$("#dg").datagrid({
		queryParams: {'isUsed': 1}
	});
	//设置加载信息 
	$("#dg").datagrid(Common.createDatagridOptionsExt(basePath, "/apron_punish_sysrole_list.json"));
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
 * 功能：格式化角色成员描述内容列
 * @param value
 * @param row
 * @param index
 */
function roleContentFormatter(value,row,index){
	return "<span title='"+value+"'>"+value+"</span>";
}

/**
 * 功能：双击行事件
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onDblClickRow(rowIndex,rowData){
	doSelectRole();
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
	window.location.replace("vclresource-auth.html?roleId="+roleId);
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
	$("#dg").datagrid("load",queryParams);
}