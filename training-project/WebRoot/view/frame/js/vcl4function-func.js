var roleId;//需要授权的角色Id

/**
 * 功能：初始化，页面加载时执行
 * 参数：无
 */
$(function(){
	//获取参数
	roleId = GetQueryString("roleId");
	if(roleId!=null){
		$("#roleName").html("您正在对【<font color='#f00'>"+roleId+"</font>】进行授权操作");
	}
	
	//初始化树形菜单
	$("#tt").tree({
		url:logicUrl,
		method:"post",
		animate:true,
		queryParams: {logicId:"09.03.02",isUsed:1},
		loadFilter:function(data1,parent){
			var data = data1.rows;
				return data;
		},
		onSelect:function(node){
			if($("#tt").tree("isLeaf",node.target)){
				var params = {menuId:node.id,memberId:roleId,accessId:"9506"};
				$("#dg").datagrid({
					url:accessUrl,
					method:"post",
					dataType:"json",
					queryParams: params
				});
				//alert(JSON.stringify(params));
			}
		},
		onClick:function(node){
			if(!$("#tt").tree("isLeaf",node.target)){
				$("#tt").tree("toggle",node.target);
			}
		}
	});
});

/**
 * 功能：格式化isVcl列的显示效果
 * 参数：
 * 	value：某行该列的值
 * 	row：该行的数据
 * 	index：该行的下标
 */
function isVclFormatter(value, row, index){
	if(value==1){
		return  "<img src='../../css/themes/icons/ok.png'/>";
	} else if(value==0){
		return  "—";
	}
}

/**
 * 功能：根据参数名获取url内的参数值
 * 参数：name 参数名
 * return：该参数名对应的参数值
 */
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 功能：单击行事件
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onClickRow(rowIndex,rowData){
	$("#dg").datagrid("uncheckAll");//设置成全不选中
	$("#dg").datagrid("selectRow",rowIndex);//选中当前行
}

/**
 * 功能：条件查询
 * 参数：无
 */
function doSearch(){
	$("#dg").datagrid({
		url:accessUrl,
		method:"post",
		dataType:"json",
		queryParams: {
			memberId:roleId,
			keyWord:$("[name='keyWord']").val(),
			accessId:"9506"
		}
	});
}

/**
 * 功能：取消选中功能的授权
 * 参数：无
 */
function doCancel(){
	var rows = Common.getSelectedIds("#dg", "funcId", "funcId");
	if(rows==null||rows.length==0){
		$.messager.alert("提示信息","请选择功能！","info");
		return;
	}
	
	for(var i=0;i<rows.length;i++){
		var funcId = rows[i].value;
		$.ajax({
			url:accessUrl,
			type:"post",
			data:{memberId:roleId,funcId:funcId,accessId:"9508"},
			dataType:"json",
			success:function(data){
				if(data.resultCode==1){
					$("#dg").datagrid("reload");
				}else{
					$.messager.alert("提示信息","功能【<font color='red'>"+rows[i].funcName+"</font>】取消授权失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
	
	$("#dg").datagrid("reload");
}

/**
 * 功能：授权操作
 * 参数：无
 */
function doVcl(){
	var rows = $("#dg").datagrid("getChecked");
	if(rows==null||rows.length==0){
		$.messager.alert("提示信息","请选择功能！","info");
		return;
	}
	
	for(var i=0;i<rows.length;i++){
		var funcId = rows[i].funcId;
		$.ajax({
			url:logicUrl,
			type:"post",
			data:{memberId:roleId,funcId:funcId,logicId:"09.04.02"},
			dataType:"json",
			success:function(data){
				if(data.resultCode==1){
					$("#dg").datagrid("reload");
				}else{
					$.messager.alert("提示信息","功能【<font color='red'>"+rows[i].funcName+"</font>】授权失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
}