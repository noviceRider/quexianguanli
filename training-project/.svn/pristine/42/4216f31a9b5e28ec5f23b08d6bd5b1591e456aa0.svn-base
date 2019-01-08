var opType;// 操作标识
/**
 * 初始加载数据
 */
$(function() {
	validateCategoryCode();
    loadTree();
});

function loadTree(){
	var isUsed=$("#showNoUsedType").is(':checked')?"-1":"1";
	// 初始化tree动态加载数据的url
	$('#tt').tree({
		url : basePath + '/apron_punish_dataaccess_category_listdata.json',
		method : 'post',
		animate : true,
		onBeforeLoad:function(node, param){
			param.isUsed=isUsed;
		},
		loadFilter: function(data, parent) {
			//这里filter做了不同处理主要是为了满足不同的场景
			if(data.rows){
				for(var i in data.rows){
					data.rows[i].text=data.rows[i].text+"("+data.rows[i].id+")";
				}
				//这种情况是为了解析dept_loadchild.json异步加载数据的格式
				return data.rows;
			}
			else
				//这种情况是为了满足程序append节点的数据格式要求
				return data;
		},
		onSelect : function(node) {
			if (node)
				showDept(node.id);
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

/**
 * 显示数据访问分类详细信息
 */
function showDept(deptIdValue) {
	$.ajax({
		url : basePath + '/apron_punish_dataaccess_category_findbycode.json',
		type : 'post',
		data : {
			categoryCode : deptIdValue
		}, // 对应的部门编号
		dataType : 'json',
		success : function(data) {
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
	var pcategoryCode = null;
	var categoryPath = null;
	if (firstLvl)
		//新增根，设置pid为-1
		pcategoryCode = -1;
	else {
		var node = $('#tt').tree('getSelected');
		if (node == null) {
			$.messager.alert('提示', '请选择指定的分类!', 'info');
			return;
		}
		// 新增子节点，设置pid为选中节点id
		pcategoryCode = node.id;
		
		//新增子节点，查询父节点的路径
		$.ajax({
			url : basePath + '/apron_punish_dataaccess_category_findbycode.json',
			type : 'post',
			async : false,
			data : {
				categoryCode : node.id
			},
			dataType : 'json',
			success : function(data) {
				categoryPath = data.row.categoryPath;
			}});
		//console.log(categoryPath);
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
	$('#pid').val(pcategoryCode);
	$('#categoryPath').val(categoryPath);
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
		url : basePath + '/apron_punish_dataaccess_category_findbycode.json',
		type : 'post',
		data : {
			categoryCode : node.id
		},
		dataType : 'json',
		success : function(data) {
			var row = data.row;
			$('#pp1').css('display', 'none');
			$('#pp2').css('display', '');
			// $('#addRootCategoryForm_categoryCode').focus();
			$("#modifyIsUsed").css('display', '');
			$("#addRootCategoryForm_categoryCode").next().hide();
			$("#addRootCategoryForm_categoryCode_span").css('display', '');
			$("#addRootCategoryForm_categoryCode_span").html(row.categoryCode);
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
	$("#addRootCategoryForm_categoryCode").textbox({
		required: true,
		missingMessage: "分类编号不能为空",
		invalidMessage: "分类编号已经存在",
		validType: "remoteValid['" + basePath + "/apron_punish_dataaccess_category_validatecode.json','categoryCode']"
	});
}

/**
 * 新增、修改的保持功能，通过调用保存的业务逻辑，将数据保存到数据库中
 */
function doSave() {
	if (opType == "modify") {
		//修改保存操作
		if ($('#inputForm').form('validate')) {
			var post = $('#inputForm').serializeObject();
			if(post.categoryPath == null || post.categoryPath == ""){
				post.categoryPath = post.categoryCode;
			}
		$.ajax({
			url : basePath + "/apron_punish_dataaccess_category_modify.json",
			data : post,
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
			var post = $('#inputForm').serializeObject();
			if(post.categoryPath == null || post.categoryPath == ""){
				post.categoryPath = post.categoryCode;
			}else{
				post.categoryPath = post.categoryPath + "/" + post.categoryCode;
			}
			$.ajax({
						url : basePath+ '/apron_punish_dataaccess_category_add.json',
						data : post,
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
								if ($('#pid').val() != '-1') {
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
	$('#tt').tree('reload');
	$('#pp1').css('display', 'none');
	$('#pp2').css('display', 'none');
}
