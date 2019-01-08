/**
 *标记新增或修改 1为新增 0为修改
 */
var isNew;

/**
 *记录修改的postId 
 */
var updatePostId=null;

/**
 * 创建数据网格的参数对象(动态计算分页查询数据显示条数)
 * @param bPath 项目路径
 * @param loadUrl 动态加载数据的url 
 * @param headHeight 包含表格前与表格头以及分页部分的高度
 * @param params 分页查询所需要的参数
 * @returns {___anonymous7643_7644}
 */
function createDatagridOptionsParams(bPath, loadUrl, headHeight, params){
	
	var hHeight = (typeof headHeight != "undefined") ? headHeight : 135;
	var rowCount = Math.floor((document.body.clientHeight - hHeight)/25);
	var opts = {};
	opts['url'] = bPath + loadUrl;
	opts['pageList'] = [10, 20, 30, 40, 50];
	opts['pageSize'] = rowCount;
	opts['pageList'].push(rowCount);
	opts['queryParams'] = params;
 	//当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
 	opts['onLoadSuccess'] = function(data){
 		
 		$(".datagrid-body").css("overflow", "hidden");
		if(data.total<=opts.pageSize){
			$(".datagrid-pager").hide();
		}else{
			$(".datagrid-pager").show();
		}
		//加载岗位人数
		setTimeout(showPostEmpNums,50);
	};
	
	/**
	 *行双击弹修改窗 
	 */
	opts["onDblClickRow"]=function(rowIndex, rowData){
		modify();
	};
	return opts;
}


/**
 * 加载岗位信息
 */
$(function(){
	//部门信息显示
	$("#showPostTable").datagrid(createDatagridOptionsParams(basePath, "/dataaccess.json", 135, {accessId:"1101"}));	
	//加载部门树结构
	loadDeptTree();	
	
});

/**
 *是否有效格式化 
 *@param value 格式化的值
 *@param row 对应行
 *@param index 对应行下标
 */
function isUsedFormatter(value,row,index){
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else if (value == 0) {// 无效
		return "—";
	}
}


/**
 *显示岗位人数,获取岗位对应的岗位人数加载到数据表格中
 *
 */
function showPostEmpNums(){
	//获取所有列
	var rows=$("#showPostTable").datagrid("getRows");
	var params={};
	params.accessId="1305";
	var j=0;
	while(j<rows.length){
		//列下标
		var index;
		params.postId=rows[j].postId;
		index=$("#showPostTable").datagrid("getRowIndex",rows[j]);
		
		//获取岗位对应的岗位人数
		$.ajax({
			url:basePath+"/dataaccess.json",
			method:"post",
			async : false,
			data:params,
			success:function(data){
				
				//将获取到的岗位人数添加到岗位人数列并刷新表格
				$("#showPostTable").datagrid("updateRow",{
					index:index,
					row:{
						empNums:data.empNums
					}
				});
				
				$("#showPostTable").datagrid("refreshRow",index);
			}
		});
		j++;
	}
}



/**
 * 查询岗位信息
 */
function searchPost(){
	var params = $("#selectPostForm").serializeObject();
	params.accessId="1101";
	$("#showPostTable").datagrid("load",params);
	
}

/**
 *点击新增弹窗 
 *
 */
function add(){
	isNew=1;
	//隐藏是否有效复选框
	$("#postIsUsedP").hide();
	$("#addAndSubmitForm").form("reset");
	
	//清除部门树结构上一次勾选内容
	var nodes= $("#deptTree").tree("getChecked","checked");
	for(var i=0;i<nodes.length;i++){
		$("#deptTree").tree("uncheck",nodes[i].target);
	}
	
	//设置岗位编号输入框为可用
	$("#postCode").textbox("enable");
	
	$("#addAndSubmitDiv").dialog("setTitle","新增岗位").dialog("open");
	
	
	//验证输入
	validatePostInput();
}

/**
 *修改 
 */
function modify(){
	isNew=0;
	//显示是否有效复选框
	$("#postIsUsedP").show();
	//判断选中项
	var selectRows=$("#showPostTable").datagrid("getChecked");
	if(selectRows.length>1){
		$.messager.alert("提示信息","请勿选中多条记录","info");
	}else if(selectRows.length<1){
		$.messager.alert("提示信息","请选中一条记录","info");
	}else{
		//设置textbox不可修改
		$("#postCode").textbox("disable");
		
		//数据回显
		var row=$("#showPostTable").datagrid("getSelected");
		updatePostId=row.postId;
		$("#postCode").textbox("setValue",row.postCode);
		$("#postName").textbox("setValue",row.postName);
		$("#postDesc").val(row.postDesc);
		$("#postNeed").val(row.postNeed);
		$("#postDuty").val(row.postDuty);
		if(row.isUsed==1){
			$("#postIsUsed").prop("checked",true);
		}else{
			$("#postIsUsed").prop("checked",false);
		}
		//清除部门树结构上一次勾选内容
		var nodes= $("#deptTree").tree("getChecked","checked");
		for(var i=0;i<nodes.length;i++){
			$("#deptTree").tree("uncheck",nodes[i].target);
		}

		//构造查询岗位关联部门的参数
		var getDeptParams={};
		getDeptParams.accessId="1010";
		getDeptParams.postId=updatePostId;
		
		//勾选原有部门
		$.ajax({
			url:basePath+"/dataaccess.json",
			method:"post",
			async:false,  
			data:getDeptParams,
			success:function(data){
				var deptIdList=data.rows;
				
				for(var j=0;j<deptIdList.length;j++){
					var nodeList=$("#deptTree").tree("getChildren");
					for(var k=0;k<nodeList.length;k++){
						
						if(deptIdList[j].deptId==nodeList[k].deptId){
							
							$("#deptTree").tree("check",nodeList[k].target);
						}
					}
				}
			}
		});
		
		
		$("#addAndSubmitDiv").dialog("setTitle","修改岗位").dialog("open");
		
		//验证输入
		validatePostInput();

	}
	
	
}

//关闭修改或添加弹出框
function closePostDialog(){
	$("#addAndSubmitDiv").dialog("close");
}

/**
 *加载部门树结构 
 */
function loadDeptTree(){
	var loadDeptParams={};
	loadDeptParams.logicId="04.01.01";
	loadDeptParams.postId="";
	
	//加载部门树结构
	$("#deptTree").tree({
		url:basePath+"/businesslogic.json",
		method:"post",
		animate:true,//动画效果
		checkbox:true,//节点前勾选框
		queryParams:loadDeptParams,
		loadFilter:function(data1,parent){
			var data = data1.rows;
			for(var i in data){
				data[i].text=data[i].text+"("+data[i].id+")";
			}
				return data;
		},
		onSelect:function(node){
			
		},
		onClick:function(node){
			if(!$("#deptTree").tree("isLeaf",node.target)){
				$("#deptTree").tree("toggle",node.target);
			}
		},
		onLoadSuccess:function(node,data){
			//树结构展开
			$("#deptTree").tree("expandAll");
		}
	});
}

/**
 * 弹出框输入验证
 */
function validatePostInput(){
	//验证编号框新增时输入
	$("#postCode").textbox({
		required:true,
		missingMessage:"该项为必填内容",
		invalidMessage:"编号已存在",
		validType:"remoteValidate['" + basePath + "/businesslogic.json', 'postCode', {logicId: '04.02.02'},'postId',"+updatePostId+",'isNew',"+isNew+"]"
	});
	
	//验证岗位名称新增时输入
	$("#postName").textbox({
		required:true,
		missingMessage:"该项为必填内容",
		invalidMessage:"名称已存在",
		validType:"remoteValidate['" + basePath + "/businesslogic.json', 'postName', {logicId: '04.02.03'},'postId',"+updatePostId+",'isNew',"+isNew+"]"
	});
}

/**
 * 信息验证函数
 */
$.extend($.fn.textbox.defaults.rules, {
    //验证数字输入
	validMath:{
		validator:function(value){
			
			var validateCodes=false;
			if(/^-?\d+\.?\d*$/.test(value)){
				validateCodes=true;
				validateResult=true;
			}else{
				validateResult=false;
			}
			return validateCodes;
		}
	},
	
	//重名验证
	remoteValidate: {
			validator: function(value, param){
				
				var params = {};
				params[param[1]] = value;
				params[param[3]] = param[4];
				params[param[5]] = param[6];
				if($(param[2]) != null) {
					params = $.extend(params, param[2]);
				}
				
				var data = $.ajax({  
					url: param[0],  
					type: 'post',  
					data: params,
					async:false,  
	                cache:false,
					dataType: 'json'
				}).responseJSON;	
				
				if(data.resultCode == 1){
					//通过验证
					return true;
				}
					
				else{
					//未通过验证
					return false;
				}
			},
			message: '请输入合法的内容'
	    }
});

/**
 *确认添加或修改 
 *
 */
function doSave(){
	//设置编号输入框可用以便取值
	$("#postCode").textbox("enable");
	
	//获取用户输入值
	var params = $("#addAndSubmitForm").serializeObject();
	$("#addAndSubmitDiv").dialog("close");
	
	if(params.isUsed==undefined){
		params.isUsed=0;
	}
	//判断添加或修改
	if(isNew==1){
		
		//指定数据访问编号
		params.accessId="1106";
		
		//调用数据访问
		$.ajax({
			url:basePath+"/dataaccess.json",
			method:"post",
			data:params,
			success:function(data){
				if(data.resultCode==1){
					//刷新表格
					$("#showPostTable").datagrid("reload");
					
					//向部门与岗位关联表中添加数据
					var deptArray=$("#deptTree").tree("getChecked","checked");
					
					if(deptArray.length!=0){
						var addRelparams={};
						addRelparams.accessId="1108";
						addRelparams.postCode=params.postCode;
						
						for(var i=0;i<deptArray.length;i++){
							addRelparams.deptId=deptArray[i].deptId;
							
							$.ajax({
								url:basePath+"/dataaccess.json",
								method:"post",
								data:addRelparams
							});
						}
					}
					
				}else{
					$.messager.alert("错误信息","添加过程中出错，请重试或联系系统管理员","error");
				}
			}
		});
	}else if(isNew==0){
		
		//指定数据访问编号
		params.accessId="1109";
		
		//调用数据访问
		$.ajax({
			url:basePath+"/dataaccess.json",
			method:"post",
			data:params,
			success:function(data){
				if(data.resultCode==1){
					//刷新表格
					$("#showPostTable").datagrid("reload");
					
					//删除部门岗位关联表原本有数据
					var deleteRelParam={};
					deleteRelParam.accessId="1011";
					deleteRelParam.postId=updatePostId;
					$.ajax({
						url:basePath+"/dataaccess.json",
						method:"post",
						data:deleteRelParam
					});
					
					//向部门与岗位关联表中添加数据
					var deptArray=$("#deptTree").tree("getChecked","checked");
					if(deptArray.length!=0){
						var addRelparams={};
						addRelparams.accessId="1108";
						addRelparams.postCode=params.postCode;
						
						for(var i=0;i<deptArray.length;i++){
							addRelparams.deptId=deptArray[i].deptId;
							
							$.ajax({
								url:basePath+"/dataaccess.json",
								method:"post",
								data:addRelparams
							});
						}
					}
					
				}else{
					$.messager.alert("错误信息","添加过程中出错，请重试或联系系统管理员","error");
				}
			}
		});
	}
}

/**
 * 删除岗位
 */
function deletePost(){
	var selectRows=$("#showPostTable").datagrid("getChecked");
	if(selectRows.length==0){
		$.messager.alert("提示信息","请至少选择一项进行删除","info");
	}else{
		$.messager.confirm("提示信息","该操作会将所选岗位修改为无效，是否继续操作？",function(r){
			if(r){
				var params={};
				params.logicId="04.02.04";
				for(var i=0;i<selectRows.length;i++){
					params.postCode=selectRows[i].postCode;
					
					$.ajax({
						url:basePath+"/businesslogic.json",
						method:"post",
						data:params,
						success:function(){
							$("#showPostTable").datagrid("reload");
						}
					});
				}
			}
		});
	}
}

/**
 *单击选择一行
 *@param rowIndex 点击行下标
 *@param rowData 点击行数据 
 */
function onClickRow(rowIndex,rowData){
	$("#showPostTable").datagrid("unselectAll");
	$("#showPostTable").datagrid("selectRow",rowIndex);
}

