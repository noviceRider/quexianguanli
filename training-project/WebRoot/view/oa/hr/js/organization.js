//新增时候的标识
var addFlag;
//选择的父级部门信息
var selectedpDept;
//新增、修改标识
var flag;

/**
 * 初始加载数据
 */
$(function(){
	//加载部门信息
	loadDept();
	//加载责任人界面
	$("#manager_html").load("selectManager.html",null,function(){
		$.parser.parse(this);
	});
	//加载所有岗位
	loadAllPost();
});

/**
 * 加载部门信息
 */
function loadDept(){
	$("#deptTree").tree({
		url:basePath+"/businesslogic.json",
		method:"post",
		animate:true,
		queryParams:{logicId:"04.01.01"},
		loadFilter:function(data1,parent){
			if(data1.rows){
				var data = data1.rows;
				for(var i in data){
					data[i].text=data[i].text+"("+data[i].code+")";
				}
					return data;
			}else{
				 	return data1;
			}
		},
		onSelect:function(node){
			doSearch(node);
		},
		onClick:function(node){
			if(!$("#deptTree").tree("isLeaf",node.target)){
				$("#deptTree").tree("toggle",node.target);
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
}

/**
 * 查询部门信息
 */
function doSearch(node){
	//隐藏新增、修改页面
	$("#am_html").css("display","none");
	//显示信息页面
	$("#detail_html").css("display","block");
	//加载部门信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:'post',
		data:{accessId:"1203",deptId:node.deptId},
		success:function(data){
			$("#detail_deptCode").html(data.deptCode);
			$("#detail_deptName").html(data.deptName);
			$("#detail_managerName").html(data.managerName);
			if(data.pNu==undefined){
				$("#detail_pNu").html(0);
			}else{
				$("#detail_pNu").html(data.pNu);
			}
			if(data.pDeptName==undefined){
				$("#detail_pDeptName").html("无");
			}else{
				$("#detail_pDeptName").html(data.pDeptName);
			}
			$("#detail_sortNo").html(data.sortNo);
			
			//查询部门下的岗位
			$.ajax({
				url:basePath+"/dataaccess.json",
				type:'post',
				data:{accessId:"1208",deptId:node.deptId},
				success:function(data){
					var rows = data.rows;
					var post = "";
					//给岗位进行回显
					for(var i=0;i<rows.length;i++){
						if(i==rows.length-1){
							post = post+rows[i].postName;
						}else{
							post = post+rows[i].postName+",";
						}
					}
					if(post==""){
						$("#detail_post").html("无");
					}else{
						$("#detail_post").html(post);
					}
				}
			});
		}
	});
}

/**
 * 增加第一级部门
 */
function addFirstDept(){
	flag=true;
	addFlag = "first";
	//显示新增界面
	$("#am_html").css("display","block");
	//隐藏信息页面
	$("#detail_html").css("display","none");
	//清除表单
	$("#am_fm").form("reset");
	//清除选中
	clearPost();
	//验证
	validate();
}

/**
 * 增加下级部门
 */
function addNextDept(){
	//关闭新增修改页面
	$("#am_html").css("display","none");
	//关闭详情页面
	$("#detail_html").css("display","none");
	flag=true;
	addFlag = "next";
	//获取父级部门数据
	var pDept = $("#deptTree").tree("getSelected");
	if(pDept==null){
		$.messager.alert("提示","请选择上级部门","info");
	}else{
		selectedpDept = pDept;
		//显示新增界面
		$("#am_html").css("display","block");
		//隐藏信息页面
		$("#detail_html").css("display","none");
		//清除表单
		$("#am_fm").form("reset");
		//清除选中
		clearPost();
		validate();
	}
}

/**
 * 修改部门信息
 */
function modifyDept(){
	flag=false;
	//获取选择的部门信息
	var dept =$("#deptTree").tree("getSelected");
	if(dept==null){
		$.messager.alert("提示","请选择要修改的部门","info");
	}else{
		//显示修改界面
		$("#am_html").css("display","block");
		//隐藏信息页面
		$("#detail_html").css("display","none");
		//回显数据
//		$.ajax({
//			url:basePath+"/dataaccess.json",
//			type:'post',
//			data:{accessId:"1203",deptId:dept.deptId},
//			async:false,
//			success:function(data){
//				$("#am_fm").form("load",data);
//				validate();
//				loadDeptPost(dept.deptId);
//			}
//		});
		$("#am_fm").form("load",dept);
		validate();
		loadDeptPost(dept.deptId);
	}
}

/**
 * 保存数据
 */
function doSave(){
	if($("#am_fm").form("validate")){
		var data = $("#am_fm").serializeObject();
		//获取所有岗位
		var post = $("input[name=post]:checked");
		var postList = "";
		for(var i=0;i<post.length;i++){
			if(i==post.length-1){
				postList = postList+post[i].value;
			}else{
				postList = postList+post[i].value+",";
			}
		}
		data.postList  = postList;
		if(flag){
			var deptCode = data.deptCode;
			if(addFlag=="first"){
				//编号
				data.pDeptId = "-1";
				data.deptRoute = deptCode;
			}else{
				//获取父级部门数据
				data.pDeptId = selectedpDept.deptId;
				data.deptRoute = selectedpDept.deptRoute+","+deptCode;
			}
			data.logicId="04.01.02";
		}else{
			data.logicId="04.01.03";
		}
		var saveData=data;
		//提交数据
		$.ajax({
			url:basePath + "/businesslogic.json",
			type:'post',
			data:data,
			success:function(data){
				if(data.resultCode==1){
					if(flag){
						var deptInfo = data.dept;
						deptInfo.id = deptInfo.deptId;
						deptInfo.text = deptInfo.deptName +"("+deptInfo.deptCode+")";
						// 新添加/修改的节点
						var node;
						// 保存成功，更新树
						var parentNode = null;
						var idValue = null;
						// 新增：需要分为新增下级和新增第一级，分别做操作
						if (saveData.pDeptId != '-1') {
							parentNode = $('#deptTree').tree('getSelected');
							// 如果有子节点，并且没有展开的情况下，首先将这个节点展开
							if (parentNode.state == 'closed')
								$('#deptTree').tree('expand',parentNode.target);
						}
						idValue = data.deptId;
						// 增加子节点
						$('#deptTree').tree('append',{
							parent: (parentNode ? parentNode.target : null),
							data:deptInfo
						});	
						// 添加成功后，查到这个节点，以便后面选定新添加的节点
						node = $('#deptTree').tree('find', idValue);
						if (node) {
							// 然后选择当前节点，显示详细情况
							$('#deptTree').tree('select', node.target);
						}
						doSearch(node);
						//关闭弹框
						$("#am_html").css("display","none");
						//清空表单
						$("#am_fm").form("reset");
						clearPost();
					}else{
						//修改
						// 更新的节点信息
						var node=$('#deptTree').tree('getSelected');					
						if (node) {
							if(saveData.isUsed=='1'){
								$('#deptTree').tree('update', {
									target : node.target,
									text : saveData.deptName+"("+saveData.deptCode+")"
								});
								// 然后选择当前节点，显示详细情况
								$('#deptTree').tree('select', node.target);
								doSearch(node);
							}else{
								//删除节点
								$("#deptTree").tree("remove",node.target);
								//隐藏信息页面
								$("#detail_html").css("display","none");
							}
						
						}
						//关闭弹框
						$("#am_html").css("display","none");
						//清空表单
						$("#am_fm").form("reset");
						clearPost();
					}
				}else{
					$.messager.alert("error","保存发生错误！请与管理员联系","info");
				}
			}
		});
	}
}

/**
 * 添加责任人
 */
function addManager(){
	//打开责任人弹框
	$("#selectManager_Div").dialog({
		modal:true,
		title:"选择责任人"
	});
	//设置查询参数
	var params = { accessId:"1301"};
	//给数据网格加数据
	$("#mamangerTable").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 135, params));
}

/**
 * 查询责任人
 */
function queryManager(){
	//查询参数
	var params = {accessId:"1301","keyWord":$("#manager_keyWord").textbox("getValue")};
	//刷新数据网格
	$("#mamangerTable").datagrid("reload",params);
}

/**
 * 选择责任人
 */
function selectManger(){
	//得到选择的数据
	var row = $("#mamangerTable").datagrid("getSelected");
	if(row!=null){
		//将选择的值设置到新增页面上
		$("#managerId").val(row.empId);
		$("#managerName").textbox("setValue",row.empName);
		//关闭弹框
		$("#selectManager_Div").dialog("close");
	}
}

/**
 * 取消选择责任人
 */
function cancelSelectManger(){
	//关闭弹框
	$("#selectManager_Div").dialog("close");
}

/**
 * 验证重复性、是否为空
 */
function validate(){
	if(flag){//新增时
		$('#deptCode').textbox({
			required: true,
			missingMessage: '请输入部门编号',
			invalidMessage: '部门编号已经存在',
			//参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
			validType: "remoteValid['" + basePath + "/businesslogic.json','deptCode',{logicId:'04.01.05'}]"
		});
		$('#deptName').textbox({
			required: true,
			missingMessage: '请输入部门名称',
			invalidMessage: '部门名称已经存在',
			//参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
			validType: "remoteValid['" + basePath + "/businesslogic.json','deptName',{logicId:'04.01.06'}]"
		});
	}else{//修改时
		$('#deptCode').textbox({
			required: true,
			missingMessage: '请输入部门名称',
			invalidMessage: '部门名称已经存在',
			//参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
			validType: "remoteValid['" + basePath + "/businesslogic.json','deptCode',{logicId:'04.01.05',deptId:'"+$("#deptId").val()+"'}]"
		});
		$('#deptName').textbox({
			required: true,
			missingMessage: '请输入部门编号',
			invalidMessage: '部门编号已经存在',
			//参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
			validType: "remoteValid['" + basePath + "/businesslogic.json','deptName',{logicId:'04.01.06',deptId:'"+$("#deptId").val()+"'}]"
		});
	}
}

/**
 * 责任人双击事件
 */
function managerDblClickRow(){
	selectManger();
}

/**
 * 删除部门
 */
function removeDept(){
	//获取选择的节点
	var node = $("#deptTree").tree("getSelected");
	if(node==null){
		$.messager.alert("提示","请选择要删除的部门","info");
	}else{
		//判断是否是最低级节点
		if(!$("#deptTree").tree("isLeaf",node.target)){
			$.messager.alert("提示","只能删除最下级部门","info");
		}else{
			$.messager.confirm("提示","是否要删除此部门，删除后无法恢复！",function(r){
				if(r){
					$.ajax({
						url:basePath+"/businesslogic.json",
						type:'post',
						data:{logicId:"04.01.04",deptId:node.deptId},
						success:function(data){
							if(data.resultCode==1){
								//删除节点
								$("#deptTree").tree("remove",node.target);
								//隐藏修改界面
								$("#am_html").css("display","none");
								//隐藏信息页面
								$("#detail_html").css("display","none");
								
							}else{
								$.messager.alert("error","删除失败！请与管理员联系","info");
							}
						}
					});
				}
			});
		}
	}
}

/**
 * 查询所有部门
 */
function loadAllPost(){
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:'post',
		data:{accessId:"1102"},
		success:function(data){
			//所有岗位
			var posts = data.rows;
			//岗位数
			var count = posts.length;
			//设置列数
			var col = 4;
			//计算行数
			var row=0;
			if(count%col==0){
				row = count/4;
			}else{
				row = Math.ceil(count/col);
			}
			//新建页面
			var html="<div><table class=\"btb\" style=\"border-collapse:separate; border-spacing:0px 10px;\">";
			
			for(var i=0;i<row;i++){
				html+= "<tr>";
				if(posts[i*col+0]!=undefined){
					html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+posts[i*col+0].postId+"\">"+posts[i*col+0].postName+"</td>";
				}
				if(posts[i*col+1]!=undefined){
					html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+posts[i*col+1].postId+"\">"+posts[i*col+1].postName+"</td>";
				}
				if(posts[i*col+2]!=undefined){
					html+= "<td style='border:0px'> <input type=\"checkbox\" name=\"post\" value=\""+posts[i*col+2].postId+"\">"+posts[i*col+2].postName+"</td>";
				}
				if(posts[i*col+3]!=undefined){
					html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+posts[i*col+3].postId+"\">"+posts[i*col+3].postName+"</td>";
				}
				html+= "</tr>";
			}
			html+="</table></div>";
			//添加到页面中
			$("#posthtml").html(html);
		}
	});
}

/**
 * 加载部门的岗位
 */
function loadDeptPost(deptId){
	//查询部门下的岗位
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:'post',
		data:{accessId:"1208",deptId:deptId},
		success:function(data){
			var rows = data.rows;
			//获取所有岗位
			var post = $("input[name=post]");
			//给岗位进行回显
			for(var i=0;i<rows.length;i++){
				for(var j=0;j<post.length;j++){
					if(rows[i].postId==post[j].value){
						post.eq(j).prop("checked",true);
					}
				}
			}
		}
	});
}

/**
 * 清除所有岗位选中
 */
function clearPost(){
	//获取所有岗位
	var post = $("input[name=post]");
	//取消全部选中
	for(var j=0;j<post.length;j++){
		post.eq(j).prop("checked",false);
	}
}