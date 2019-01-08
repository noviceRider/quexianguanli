var opType;// 操作标识
/**
 * 初始加载数据
 */
$(function() {
	// 加载项目信息页面
	$("#detaile").load("selectinfotype.html", null, function() {
		// 进行解析
		$.parser.parse(this);
	});
});

function loadTree(){
	var dictCode=$("#searchresForm_dictCode").val();
	// 获取"选择显示无效分类"框状态
	var isUsed=$("#showNoUsedType").is(':checked')?"-1":"1";
	// 载入数据
//	$("#typeTreeGrid").treegrid('loadData', showdata);
	$.ajax({
		url:basePath + '/gmodule_multilevel_findall.json',
		type:'post',
		data:{isUsed:isUsed,infoType:dictCode},
		success:function(data){
			console.log(data.rows);
			$('#tt').tree("loadData",data.rows);
			$('#tt').tree({
				onSelect : function(node) {
					if (node)
						showDept(node);
				},
				// 在树上右键点击的菜单
				onContextMenu : function(e, node) {
					e.preventDefault();
					$(this).tree('select', node.target);
					$('#mm').menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				}
			});
			$('#pp1').css('display', 'none');
			$('#pp2').css('display', 'none');
		}
	});
	validateCategoryCode();
}

/**
 * 显示数据访问分类详细信息
 */
function showDept(node) {
	console.log(node);
	$.ajax({
		url : basePath + '/gmodule_multilevel_findbyid.json',
		type : 'post',
		data : {
			typeId : node.id,
			infoType:$("#searchresForm_dictCode").val()
		}, // 对应的部门编号
		dataType : 'json',
		success : function(data) {
			console.log(data.row);
			var isUsed=data.row.isUsed==1?"<img src='../../../css/themes/icons/ok.png'/>":"—";
			data.row.isUsed=isUsed;
			Common.loadLabelData(data.row);
			$('#pp1').css('display', '');
			$('#pp2').css('display', 'none');
		},
		error : function() {
			$.messager.alert('错误', '服务器内部错误!', 'error');
		}
	});
}

/**
 * 增加节点,firstLvl       新增根还是新增子节点
 */
function doAddNode(firstLvl) {
	opType="add";
    if($("#searchresForm_dictCode").val()==""){
    	$.messager.alert('提示', '请选择所属分类信息!', 'info');
    	return;
    }
	var pTypeId = null;
	if (firstLvl)
		//新增根，设置pid为-1
		pTypeId ="%root%";
	else {
		var node = $('#tt').tree('getSelected');
		if (node == null) {
			$.messager.alert('提示', '请选择指定的分类!', 'info');
			return;
		}
		// 新增子节点，设置pid为选中节点id
		pTypeId = node.id;
	}
	$('#pp1').css('display', 'none');
	$('#pp2').css('display', '');
	//新增时隐藏有效否单选框
	$("#modifyIsUsed").css('display', 'none');
	$("#addRootCategoryForm_categoryCode").next().show();
	//启用验证
	$("#addRootCategoryForm_categoryCode").textbox("enableValidation");
	$("#addRootCategoryForm_categoryCode_span").css('display', 'none');
	$('#inputForm').form('clear');
	//设置默认上级id和所属信息类型
	$('#pid').val(pTypeId);
	$("#addRootCategoryForm_packageName").textbox("setValue",$("#searchresForm_dictCode").val());
}

/**
 * 修改当前节点
 */
function doModify() {
	opType = "modify";
	var node = $('#tt').tree('getSelected');
	if (node == null) {
		$.messager.alert('提示', '请选择要修改的分类!', 'error');
		return;
	}

	$.ajax({
		url : basePath + '/gmodule_multilevel_findbyid.json',
		type : 'post',
		data : {
			typeId : node.id,
			infoType:$("#searchresForm_dictCode").val()
		},
		dataType : 'json',
		success : function(data) {
			var row = data.row;
			$('#pp1').css('display', 'none');
			$('#pp2').css('display', '');
			$('#addRootCategoryForm_categoryName').textbox().next('span').find('input').focus();
			//$('#addRootCategoryForm_categoryCode').focus();
			$("#modifyIsUsed").css('display', '');
			$("#addRootCategoryForm_categoryCode").next().hide();
			$("#addRootCategoryForm_categoryCode_span").css('display', '');
			$("#addRootCategoryForm_categoryCode_span").html(row.typeId);
            //数据回显
			$("#inputForm").form("load", row);
			// 初始化部门编号后台验证
			//deptValid();
		},
		error : function() {
			$.messager.alert('错误', '服务器内部错误!', 'error');
		}
	});
	//禁用验证
	$("#addRootCategoryForm_categoryCode").textbox("disableValidation");
}
/**
 * 验证资源描述，不为空也不重复
 */
function validateCategoryCode() {
	var infoType=$("#searchresForm_dictCode").val();
	console.log(infoType);
	$("#addRootCategoryForm_categoryCode").textbox({
		required: true,
		missingMessage: "分类序号不能为空",
		invalidMessage: "分类序号已经存在",
		validType: "remoteValid['" + basePath + "/gmodule_multilevel_validatetypeid.json','typeId',{infoType:'"+infoType+"'}]"
	});
}

/**
 * 新增、修改的保持功能，通过调用保存的业务逻辑，将数据保存到数据库中
 */
function doSave() {
	if (opType == "modify") {
		//修改保存操作
		if ($('#inputForm').form('validate')) {
		//	console.log($('#inputForm').serializeObject());
		$.ajax({
			url : basePath + "/gmodule_multilevel_modifymultilevel.json",
			data : $('#inputForm').serializeObject(),
			type : 'post',
			dataType : 'json',
			success : function(data) {
				if (data.resultCode) {
					// 更新的节点信息
					var node=$('#tt').tree('getSelected');;		     
					if (node) {
						$('#tt').tree('update', {
							target : node.target,
							text : $('#addRootCategoryForm_categoryName').textbox("getValue")+"("+node.id+")"
						});
					}
					// 然后选择当前节点，显示详细情况
					$('#tt').tree('select', node.target);
					$.messager.alert('提示', '数据访问分类修改保存成功!', 'info');
				}
			}
		});
		}
	} else {
		if ($('#inputForm').form('validate')) {
			// 将数据保存
			$.ajax({
						url : basePath+ '/gmodule_multilevel_addmultilevel.json',
						data : $('#inputForm').serializeObject(),
						type : 'post',
						dataType : 'json',
						success : function(data) {
							if (data.resultCode) {
								// 新添加/修改的节点
								var node;
								// 保存成功，更新树
								var parentNode = null;
								var idValue = null;
								// 新增：需要分为新增下级和新增第一级，分别做操作
								if ($('#pid').val() != '%root%') {
									parentNode = $('#tt').tree('getSelected');
									// 如果有子节点，并且没有展开的情况下，首先将这个节点展开
									if (parentNode.state == 'closed')
										$('#tt').tree('expand',parentNode.target);
								}
								idValue = $('#addRootCategoryForm_categoryCode').textbox("getValue");
								// 增加子节点
								$('#tt').tree('append', {
									parent: (parentNode ? parentNode.target : null),
									data: [{
										id: idValue,
										text: $("#addRootCategoryForm_categoryName").textbox("getValue")+"("+idValue+")"
									}]
								});		
								// 添加成功后，查到这个节点，以便后面选定新添加的节点
								node = $('#tt').tree('find', idValue);
								if (node) {
									// 然后选择当前节点，显示详细情况
									$('#tt').tree('select', node.target);
								}
								$.messager.alert('提示', '数据访问分类保存成功!', 'info');
							}
						}
					});
		}
	}
}

///**
// * 删除选定的数据访问分类(逻辑删除)
// */
//function doDelete() {
//	var node = $('#tt').tree('getSelected');
//	if (node == null) {
//		$.messager.alert('提示', '请选择要删除的部门!', 'error');
//		return;
//	}
//
//	$.messager
//			.confirm(
//					'确认',
//					'是否将选择的数据访问分类从数据库中删除，这一操作是不可逆的，是否继续？',
//					function(r) {
//						if (r) {
//							$
//									.ajax({
//										url : basePath + '/dept_delete.json',
//										data : {
//											deptId : node.id
//										},
//										type : 'post',
//										dataType : 'json',
//										success : function(data) {
//											if (data.resultCode) {
//												var neighborNode = Common
//														.getNeighborNode(
//																$('#tt'), node);
//
//												// 删除成功，将数据从树上删除
//												$('#tt').tree('remove',
//														node.target);
//
//												if (neighborNode)
//													// 删除节点之后，选中相邻的节点
//													$('#tt')
//															.tree(
//																	'select',
//																	neighborNode.target);
//												else
//													// 已经删除了所有节点，现在没有任何节点，刷新页面
//													doRefresh();
//											} else
//												$.messager.alert('错误',
//														'删除数据访问分类过程中出现问题!',
//														'error');
//										},
//										error : function() {
//											$.messager.alert('错误', '服务器内部错误!',
//													'error');
//										}
//									});
//						}
//					});
//}

/**
 * 页面刷新
 **/
function doRefresh() {
	loadTree();
	$('#pp1').css('display', 'none');
	$('#pp2').css('display', 'none');
}

/**
 * 弹出项目信息数据
 * 选择项目后，查询出该项目下的任务    l
 */
function selectPro(){
	showPro(function(data){
		//给项目输入框设置值
		$("#searchresForm_dictDesc").textbox("setValue",data.dictDesc);
		$("#searchresForm_dictCode").val(data.dictCode);	
		//加载该项目下的任务数据
		//loadDatagrid();
	});
}
//   l
function showPro(callbackfun){ 
	
	//将回调函数赋给全局变量
	callback=callbackfun;
	//获取加载的参数
	var params={typeCode:'MLVL_INFO_TYPE',keyWord:$("#keyWord").val()};
	console.log(params);
	//给数据网格加载数据
	$("#dictTable").datagrid({
		method:"post",
		url:basePath+"/gmodule_datadict_findpage.json",
		queryParams:params,
		onDblClickRow:function(index,row){
			selectInfoType();
		}
	});
	//打开窗口
	$("#infotype_Div").show().dialog({
		title:"选择信息类型",
		modal:true,
		buttons : '#select_btns',
		resizable : true,
	});
		
} 

/**
*设置是否有效初始值       l
*/
function setUsed(value,row,index){
	if(value==1){
		return "<img src='../../../css/themes/icons/ok.png'/>";
	}else{
		return "—";
	}
}

/**
 * 选择所属项目对话框确认按钮     l
 */
function selectInfoType() {
	if ($("#dictTable").datagrid("getSelected") == null) {
		$.messager.alert("错误信息", "请选择具体信息类型", "error");
		return;
	}
	// 获取选中行数据
	var row = $('#dictTable').datagrid('getSelected');
	// 将选择的项目Id显示在选择项目文本框中（隐藏状态）
	$("#searchresForm_dictCode").attr("value", row.dictCode);
	// 将选择的项目名称显示在选择项目文本框中
	$("#searchresForm_dictDesc").textbox("setValue", row.dictDesc);
	$(".tree-tile").css("font-size",'13px');
	// 关闭选择所属项目对话框
	$("#detaile").dialog('close');
	$("#infotype_Div").dialog("close");
	loadTree();
}
