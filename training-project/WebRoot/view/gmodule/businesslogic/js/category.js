var url;//新增、修改url
var nodeData;//加载的节点数据

/**
 * 初始加载数据
 */
$(function(){
	//初始化tree动态加载数据的url
	$('#tt').tree({
		url:basePath + '/gmodule_businesslogic_findnodes.json', 
		method:'post',
		animate: true,
		loadFilter: function(data, parent) {
			//这里filter做了不同处理主要是为了满足不同的场景
			if(data.nodePoList)
				//这种情况是为了解析dept_loadchild.json异步加载数据的格式
				return data.nodePoList;
			else
				//这种情况是为了满足程序append节点的数据格式要求
				return data;
		},
		onSelect: function(node) {
			if(node) showDept(node.id);
		},
		//在树上右键点击的菜单
		onContextMenu: function(e, node){
			e.preventDefault();
			$(this).tree('select',node.target);
			$('#mm').menu('show',{
				left: e.pageX,
				top: e.pageY
			});
		}
	});
});

/**
 * 增加节点
 * @param type
 */
function doAddNode(type){
	url = basePath +"/gmodule_businesslogic_addbusinesscategory.json";
	//显示输入框页面
	$('#pp1').css('display', 'none');
	$('#pp2').css('display', '');
	//清空表单
	$("#inputForm").form("reset");
	//显示输入框
	$("#input_categoryCode").show();
	$("#show_categoryCode").html("");
	//打开验证
	$('#input_categoryCode').validatebox('enableValidation');
	//给第一个输入框聚焦
	$("#input_categoryCode").focus();
	//新增时设置的参数
	if(type==1){
		$("#input_pCategoryName").html("无");
		//设置父类编号
		$("#input_pCategoryCode").val("%root%");
	}else{
		var node = $('#tt').tree('getSelected');
		if(node==null){
			$.messager.alert('提示','请选择父类','info');
		}else{
			//设置值
			$("#input_pCategoryName").html(node.text);
			$("#input_pCategoryCode").val(node.id);
		}
	}
	//验证编码
	validate();
	//定制未输入数据验证的提示内容
	$('#input_CategoryName').validatebox({required: true, missingMessage: '请输入分类名称'});
	$('#input_sortNo').validatebox({required: true, missingMessage: '请输入排序号'});
}

/**
 * 保存数据
 */
function doSave(){
	if($('#inputForm').form('validate')){
		//获取数据
		var data = $("#inputForm").serializeObject();
		console.log(data);
		//保存
		$.ajax({
			url:url,
			type:'post',
			data:data,
			success:function(data){
				if(data.resultCode==1){
					//添加成功刷新数据
					$("#tt").tree("reload");
					//清空表单
					$("#inputForm").form("reset");
					//隐藏页面
					$('#pp1').css('display', 'none');
					$('#pp2').css('display', 'none');
				}
			}
		});
	}
}

/**
 * 展示节点信息
 * @param id
 */
function showDept(id){
	//保存
	$.ajax({
		url:basePath+"/gmodule_businesslogic_findbyid.json",
		type:'post',
		data:{Id:id},
		success:function(data){
			nodeData = data;
			//打开展示页面
			$('#pp1').css('display', '');
			$('#pp2').css('display', 'none');
			//展示数据
			Common.loadLabelData(data.categoryPo);
		}
	});
}

/**
 * 修好分类信息
 */
function doModify() {
	url = basePath +"/gmodule_businesslogic_modifybusinesscategory.json";
	var node = $("#tt").tree("getSelected");
	if(node==null){
		$.messager.alert('提示','请选择要修改的节点','info');
	}else{
		//打开修改页面
		$('#pp1').css('display', 'none');
		$('#pp2').css('display', '');
		var categoryPo = nodeData.categoryPo;
		//展示数据
		$("#input_CategoryName").val(categoryPo.categoryName);
		//取消验证
		$('#input_categoryCode').validatebox('disableValidation');
		//隐藏编码输入框
		$('#input_categoryCode').hide();
		//显示编码
		$('#show_categoryCode').html(categoryPo.categoryCode);
		//给输入框设置编码
		$('#input_categoryCode').val(categoryPo.categoryCode);
		//去掉*号
		$('#show_limitLen').html("");
		if(categoryPo.pCategoryCode=="%root%"){
			$("#input_pCategoryName").html("无");
		}else{
			$("#input_pCategoryName").html(categoryPo.pCategoryCode);
		}
		$("#input_sortNo").val(categoryPo.sortNo);
		//定制未输入数据验证的提示内容
		$('#input_CategoryName').validatebox({required: true, missingMessage: '请输入分类名称'});
		$('#input_sortNo').validatebox({required: true, missingMessage: '请输入排序号'});
	}
}

/**
* 删除选定分类
**/
function doDelete() {
	var node = $('#tt').tree('getSelected');
	if(node == null) {
		$.messager.alert('提示','请选择要删除的分类!','error');
		return;
	}
	
	$.messager.confirm('确认', '是否将选择的分类从数据库中删除，这一操作是不可逆的，是否继续？', function(r){
		if (r){
			$.ajax({  
				url: basePath + '/gmodule_businesslogic_removebusinesscategory.json',  
				data: {Id: node.id},  
				type: 'post',  
				dataType: 'json',  
				success:function(data) {
					if(data.resultCode==1) {
						//获取相邻节点
						var neighborNode = Common.getNeighborNode($('#tt'), node);
						
						//删除成功，将数据从树上删除
						$('#tt').tree('remove', node.target);

						if(neighborNode) {
							//删除节点之后，选中相邻的节点
							$('#tt').tree('select', neighborNode.target);
						}else{
							//已经删除了所有节点，现在没有任何节点，刷新页面
							doRefresh();
						}
					}else{
						$.messager.alert('错误','删除信息过程中出现问题!','error');
					}
				},  
				error : function() {
					$.messager.alert('错误','服务器内部错误!','error');
				}
			});		
		}
	});
}

/**
* 页面刷新
**/
function doRefresh() {
	$('#tt').tree('reload');
	$('#pp1').css('display', 'none');
	$('#pp2').css('display', 'none');
}

/**
 * 验证编码是否存在
 */
function validate(){
	$('#input_categoryCode').validatebox({
	    required: true,
	    missingMessage: '请输入分类编号',
	    invalidMessage: '分类编号已经存在',
	    //参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
	    validType: "remoteValid['" + basePath + "/gmodule_businesslogic_validatecategorycode.json', 'categoryCode']"
	});	
}