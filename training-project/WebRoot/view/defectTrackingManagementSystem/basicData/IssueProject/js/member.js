/**
 * <p>title:缺陷管理系统-member.js</p>
 * 
 * <p>Description:缺陷成员管理的js</p>
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
	 * 	刷新网格数据
	 */
	loading();
	
	/**
	 * 	初始化加载 新增角色页面
	 */
	$("#addMemberContainer").load("addMember.html",null,function(){
		
		$("#addProjectPanel").dialog({
			title:"新增",
			iconCls:'icon-save',
			width:500,
			height:340,
			modal:true ,
			buttons:'#aa',
			shadow:true,
			closed:true
		});
		
		/**
		 * 	将超链接设置为确定按钮
		 */
		$("#addMemberFormBtn").linkbutton({
			text:"保存",
			iconCls:'icon-save',
			onClick:function(){
				confirm();
			}
		});
		
		/**
		 * 	将超链接设置为取消按钮
		 */
		$("#cancelMemberFormBtn").linkbutton({
			text:"取消",
			iconCls:'icon-clear',
			onClick:function(){
				cancel();
			}
		});
	
	})
	
	/**
	 * 	加载编辑窗口
	 */
	$("#modifyMemberContainer").load("modifyMember.html",null,function(){
		
		$("#modifyMemberPanel").dialog({
			title:"编辑",
			iconCls:'icon-save',
			width:500,
			modal:true ,
			shadow:true,
			height:340,
			closed:true
		});
		
		/**
		 *	将超链接设置为添加按钮 
		 */
		$("#addMemberUserFormBtn").linkbutton({
			text:"添加",
			iconCls:'icon-add',
			onClick:function(){
				addMemberUser();
			}
		})
		
		/**
		 *	将超链接设置为删除按钮 
		 */
		$("#removeMemberUserFormBtn").linkbutton({
			text:"删除",
			iconCls:'icon-remove',
			onClick:function(){
				removeMemberUser();
			}
		})
		
		/**
		 * 	初始化编辑里面的表格
		 */
		$('#showUserTable').datagrid({    
		    autoRowHeight:true,
		    columns:[[
		        {field:'userId',title:'编号',width:'48%'},
		        {field:'userName',title:'姓名',width:'48%'}
		    ]]
		})
	})
	
	/**
	 * 初始化	编辑里面的添加
	 */
	$("#addMemberUserContainer").load("addMemberUser.html",null,function(){
		$.parser.parse(this);
		$("#addMemberUserPanel").dialog({
			title:"新增",
			iconCls:'icon-save',
			modal:true ,
			shadow:true,
			width:500,
			height:340,
			closed:true
		});
		
		/**
		 * 	编辑里面的添加里面的表格
		 */
		$('#addMemberRoleTable').datagrid({  
		    autoRowHeight:true,
		    columns:[[
		        {field:'userId',title:'编号',width:'48%'},
		        {field:'userName',title:'姓名',width:'48%'}
		    ]]
		})
		
		/**
		 * 	编辑里面的添加里面的确定按钮
		 */
		$("#addMemberUserFormBtnaa").linkbutton({
			text:"添加",
			iconCls:'icon-add',
			onClick:function(){
				memberAddUser();
			}
		})
		
		/**
		 * 	编辑里面的添加里面的取消按钮
		 */
		$("#cancelMemberUserFormBtnaa").linkbutton({
			text:"取消",
			iconCls:'icon-clear',
			onClick:function(){
				memberCancelUser();
			}
		})
		
	})

})

/**
 * 	页面初始化加载方法
 * @returns
 */
function loading(){
	$("#memberTable").datagrid(Common.createDatagridOptionsParams(basePath, "/getMember.json", 135, {"pId":oneValues()}));
}

/**
 * 	获取上个页面的方法
 * @returns
 */
function oneValues(){
	var result;
	var url=window.location.search; 
	if(url.indexOf("?")!=-1){
		result = url.substr(url.indexOf("=")+1);
	}
	return result;
}

/**
 * 	加载下拉框
 */
function XLoading(){
	$.ajax({
		url:basePath+'/getRole.json',
		type:'post',
		data:{"pId":oneValues()},
		dataType:'json',
		success:function(data){
			$("#cc").combobox({    
			    valueField:'roleCode', 
			    textField:'roleName',
			    panelHeight:'100px',
			    data:data.rows
			});
			if(data.rows.length>0){
				$("#cc").combobox("select",data.rows[0].roleCode);
			}
		}
	})
}

/**
 * 	打开新增的方法
 */
function addMember(){
	/**
	 * 	加载下拉框
	 */
	XLoading();
	/**
	 * 	新增表格
	 */
	$('#addRoleTable').datagrid({    
	    url:basePath+'/getUser.json',
	    pagination:true,
	    modal:true ,
		shadow:true,
	    autoRowHeight:true,
	    pageList:[4,8,12,16,20],
		pageSize:4,
	    columns:[[
	        {field:'userId',title:'编号',width:'50%'},
	        {field:'userName',title:'姓名',width:'50%'}
	    ]]
	})
	$("#addProjectPanel").dialog("open");
}

/**
 * 	新增角色确定的方法
 */
function confirm(){
	var roleCode = $("#cc").combobox("getValue") ;
	var rows = $("#addRoleTable").datagrid("getSelections");
	if(roleCode == null || roleCode == ''){
		$.messager.alert('警告','没有可选的角色！！');
		$("#addProjectPanel").dialog({closed:true});
		return;
	}
	if(rows.length == 0 ){
		$.messager.alert('警告','没有选择要添加的员工！！');
		return;
	}
	var userIds = [];
	rows.forEach(e=>{
		userIds.push(e.userId);
	});
	userIds = userIds.toString();
	var obj = {"pId":oneValues(),"roleCode":roleCode,"userIds":userIds};
	$.ajax({
		url:basePath+'/addRole.json',
		type:'post',
		dataType:'json',
		data:obj,
		success:function(data){
			if(data.result !=null){
				$.messager.alert("信息","新增角色信息成功！！");
				loading();
				cancel();
			}else{
				$.messager.alert("信息","新增角色信息失败！！");
			}
		}
	})
}

/**
 * 	新增角色取消的方法
 */
function cancel(){
	$("#addRoleTable").datagrid('uncheckAll');
	$("#addProjectPanel").dialog({closed:true});
}

/**
 * 	删除角色的方法
 */
function removeMember(){
	var rows = $("#memberTable").datagrid("getSelections");
	if(rows.length == 0 ){
		$.messager.confirm("信息","请选择需要删除的角色！！");
	}
	$.messager.confirm("信息","是否要删除所选中的角色！！",function(r){
		if (r){
			var delIds = [];
			rows.forEach(e=>{
				delIds.push(e.roleCode);
			});
			$.post(
				basePath+"/removeRole.json",
				 {"delIds":delIds},
				 function(data){
					 if(data.result==0){
						 $.messager.alert("警告","删除失败！！");
						 return;
					 }
					 $.messager.alert("信息","删除成功！！");
					 loading();
				 },
				 "json"
		    );
		}else{
			$("#memberTable").datagrid('uncheckAll');
		}
	})
}

/**
 * 	编辑的方法
 */
function modifyMember(){
	var rows = $("#memberTable").datagrid("getSelections");
	if(rows.length == 0 ){
		 $.messager.alert("信息","请选择要编辑的数据！！");
	}else if(rows.length == 1){
		var roleCode = rows[0].roleCode ;
		$.post(basePath+"/getUserByRoleCode.json",{"roleCode":roleCode,"pId":oneValues()},function(data){
			$("#showUserTable").datagrid("loadData",data);
		})
		$("#modifyMemberPanel").dialog("open");
	}else{
		$.messager.alert("信息","每次只能编辑一条数据！！");
	}
}

/**
 * 	编辑里面的添加按钮
 */
function addMemberUser(){

	var rows = $("#memberTable").datagrid("getSelections");
	var roleCode = rows[0].roleCode;
	console.log(roleCode);
	$.ajax({
		url:basePath+'/getMemberUser.json',
		type:'post',
		data:{"pId":oneValues(),"roleCode":roleCode},
		dataType:'json',
		success:function(data){
			$("#addMemberRoleTable").datagrid("loadData",data);
		}
	});
	$("#addMemberUserPanel").dialog("open");
}

/**
 * 	编辑里面的删除按钮
 */
function removeMemberUser(){
	var rows = $("#showUserTable").datagrid("getSelections");
	var rows1 = $("#memberTable").datagrid("getSelections");
	if(rows1.length == 1){
		var roleCode = rows1[0].roleCode
	}
	
	if(rows.length == 0 ){
		$.messager.alert('警告','没有选择要删除的员工，请先进行选择！！');   
		return;
	}
	$.messager.confirm('提示', '您是否要删除选中员工？', 
		function(r){
			if (r){
				var userIds = [];
				rows.forEach(e=>{
					userIds.push(e.userId);
				});
				userIds = userIds.toString();
				$.post(
					basePath+"/deleteMemberUser.json",
					 {"userIds":userIds,"pId":oneValues(),"roleCode":roleCode},
					 function(data){
						 if(data.result==0){
							 $.messager.alert("警告","删除失败！！");return;
						 }
						 $.messager.alert("信息","删除成功！！");
						 loading();
						 $("#modifyMemberPanel").dialog({closed:true});
						 $("#showUserTable").datagrid({closed:true});
					 },
					 "json"
			    );
			}
		})
}

/**
 * 	编辑面板中的新增面板中添加员工的方法
 */
function memberAddUser(){
	
	var rows1 = $("#memberTable").datagrid("getSelections");
	var roleCode = rows1[0].roleCode ;
	var rows2= $("#addMemberRoleTable").datagrid("getSelections");
	var userIds = [];
	rows2.forEach(e=>{
		userIds.push(e.userId);
	});
	userIds = userIds.toString();
	var obj = {"pId":oneValues(),"roleCode":roleCode,"userIds":userIds};
	$.ajax({
		url:basePath+'/addRole.json',
		type:'post',
		dataType:'json',
		data:obj,
		success:function(data){
			if(data.result !=null){
				$.messager.alert("信息","新增员工信息成功！！");
				loading();
				memberCancelUser();
			}else{
				$.messager.alert("信息","新增员工信息失败！！");
				memberCancelUser();
			}
		}
	})
}

/**
 * 	编辑面板中的新增面板中的取消方法
 */
function memberCancelUser(){
	$("#addMemberRoleTable").datagrid('uncheckAll');
	$("#addMemberUserPanel").dialog({closed:true});
	$("#modifyMemberPanel").dialog({closed:true});
}
