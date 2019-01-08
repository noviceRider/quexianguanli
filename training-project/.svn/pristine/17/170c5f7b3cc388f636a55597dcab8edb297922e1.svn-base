var saveUrl; //新增或修改保存时请求的url
var isNew = true; //是否为新增，true:新增，false：修改
var infoType;

/**
 * 功能:加载新增修改页面
 * 参数：无
 */
$(function() {
	//显示tree
	$("#tt").tree({
		url:basePath+"/businesslogic.json",
		method:"post",
		animate:true,
		queryParams:{logicId:"09.03.04"},
		loadFilter:function(data1,parent){
			var data = data1.rows;
			for(var i in data){
				data[i].text=data[i].text+"("+data[i].id+")";
			}
				return data;
		},
		onSelect:function(node){
			//doSearch(node);
		},
		onClick:function(node){
			if(!$("#deptTree").tree("isLeaf",node.target)){
				$("#deptTree").tree("toggle",node.target);
			}
		},
		onDblClick:function(node){
			if($("#tt").tree("isLeaf",node.target)){
				addMenu();
			}
		},
		onContextMenu:function(e, node){
			e.preventDefault();
			$('#tt').tree('select', node.target);
			$('#mm').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		}
	});
	//设置查询参数
	var params = { logicId:"09.03.05"};
	//给数据网格加数据
	$("#dg").datagrid(Common.createDatagridOptionsParams(basePath, "/businesslogic.json", 135, params));
});  

/**
 * 添加菜单
 * 
 */
function addMenu(){
	var node=$("#tt").tree('getSelected');
	if(node==null||!$("#tt").tree("isLeaf",node.target)){
		$.messager.alert('错误', '请选择叶子节点新增!', 'error');
		return;
	}
	var length=$("#dg").datagrid("getData").rows.length;
	if(length<12){
		//新增快捷菜单数据
		$.ajax({
			url:basePath+"/businesslogic.json",
			data:{menuId:node.id,logicId:"09.03.06"},
			type:'post',
			success:function(data){
				if(data.validateCode==0){
					$.messager.alert('提示', '已经存在该菜单!', 'error');
				}else{
					if(data.resultCode==0){
						$.messager.alert('错误', '请选择叶子节点新增!', 'error');
					}else{
						//刷新数据
						$("#dg").datagrid("reload");
					}
				}
			}
		});
	}else{
		$.messager.alert('错误', '快捷菜单最大允许12个!', 'error');
	}
}

/**
 * 功能：格式化操作列 xx
 * @param value
 * @param row
 * @param index
 */
function opFormatter(value, row, index){
	var data=$("#dg").datagrid("getData");
	if(index==0){
		return "<a href='#1' onclick='down("+index+")' style='color: blue;' >下移</a>｜<a href='#1' onclick='deleteMenu("+index+")' style='color: blue;' >移除</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	}else if(index==data.rows.length-1){
		return "<a href='#1' onclick='up("+index+")' style='color: blue;' >上移</a>｜<a href='#1' onclick='deleteMenu("+index+")' style='color: blue;' >移除</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	}else{
		return "<a href='#1' onclick='up("+index+")' style='color: blue;' >上移</a>｜<a href='#1' onclick='down("+index+")' style='color: blue;' >下移</a>｜<a href='#1' onclick='deleteMenu("+index+")' style='color: blue;' >移除</a>";
	}
}
/**
 * 删除
 * @param index
 */
function deleteMenu(index){
	var data=$("#dg").datagrid("getData");
	var sortNo=index+1;
	var menuId=data.rows[index].menuId;
	//移除快捷菜单数据
	$.ajax({
		url:basePath+"/businesslogic.json",
		data:{menuId:menuId,sortNo:sortNo,logicId:"09.03.08"},
		type:'post',
		success:function(data){
				if(data.resultCode==0){
					$.messager.alert('错误', '服务器错误!', 'error');
				}else{
					//刷新数据
					$("#dg").datagrid("reload");
				}
		}
	});
}
/**
 * 下移
 * @param index
 */
function down(index){
	var data=$("#dg").datagrid("getData");
	var addMenuId=data.rows[index].menuId;
	var deMenuId=data.rows[index+1].menuId;
	//下移快捷菜单数据
	$.ajax({
		url:basePath+"/businesslogic.json",
		data:{addMenuId:addMenuId,deMenuId:deMenuId,logicId:"09.03.07"},
		type:'post',
		success:function(data){
				if(data.resultCode==0){
					$.messager.alert('错误', '服务器错误!', 'error');
				}else{
					//刷新数据
					$("#dg").datagrid("reload");
					$("#dg").datagrid({
						onLoadSuccess:function(){
							$("#dg").datagrid("selectRow",index+1);
						}
					});
				}
		}
	});
}
/**
 * 上移
 * @param index
 */
function up(index){
	var data=$("#dg").datagrid("getData");
	var deMenuId=data.rows[index].menuId;
	var addMenuId=data.rows[index-1].menuId;
	//下移快捷菜单数据
	$.ajax({
		url:basePath+"/businesslogic.json",
		data:{addMenuId:addMenuId,deMenuId:deMenuId,logicId:"09.03.07"},
		type:'post',
		success:function(data){
				if(data.resultCode==0){
					$.messager.alert('错误', '服务器错误!', 'error');
				}else{
					//刷新数据
					$("#dg").datagrid("reload");
					$("#dg").datagrid({
						onLoadSuccess:function(){
							$("#dg").datagrid("selectRow",index-1);
						}
					});
				}
		}
	});
}