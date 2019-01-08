/**
 * 功能：初始化，加载角色信息数据
 * 参数：无
 */
$(function(){
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
	if(row == null) {
		$.messager.alert("提示信息","请先选择角色，再进行授权！","info");
		return;
	}
	var roleId = row.roleId;
	window.location.replace("vcl4function-func.html?roleId="+roleId);
}

/**
 * 功能：点击查询按钮，按条件查询
 * 参数：无
 */
function doSearch(){
	var params = $("#searchForm").serializeObject();
	params.accessId = "9302";
	params.isUsed = 1;
	$("#dg").datagrid("load", params);
}