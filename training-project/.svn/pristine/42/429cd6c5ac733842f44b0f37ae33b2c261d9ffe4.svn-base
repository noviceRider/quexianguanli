/**
 * 功能：初始化datagrid，加载数据
 */
$(function(){
	$("#dg").datagrid(Common.createDatagridOptionsParams(accessUrl, "", 135, {accessId:"9701"}));
});

/**
 * 功能：条件查询
 * 参数：无
 */
function doSearch(){
	//关键字输入框失去焦点
	$("#searchForm #keyword").blur();
	var params = $("#form_search").serializeObject();
	params.accessId = "9701";
	//条件查询
	$("#dg").datagrid("load", params);
}

/**
 * 功能：打开新增对话框
 * 参数：无
 */
function doAdd(){
	versionValid();
	$("#dlg_add").show().dialog({
		title:"新增",
		buttons:"#btns_add",
		
		modal:true,
		onClose:function(){
			$("#form_add").form("reset");
		}
	});
}

/**
 * 功能：打开修改对话框
 * 参数：无
 */
function doModify(){
	var row = $("#dg").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要修改的版本！","info");
		return;
	}
	
	$("#form_modify").form("load",row);
	$("#installFile").text(row.installFile);
	
	$("[name='versionId'").validatebox({required: true, missingMessage: "版本号不能为空"});
	$("[name='updateContent']").validatebox({required: true, missingMessage: "更新内容不能为空"});
	
	$("#dlg_modify").show().dialog({
		title:"修改",
		buttons:"#btns_modify",
		modal:true,
		onClose:function(){
			$("#form_modify").form("reset");
		}
	});
}

/**
 * 功能：显示最新版本安装包二维码
 * 参数：无
 */
function istallPackageDownload(){
	//下载路径
	var istallFileURL = null;
	//3202
	//获取最新安装文件路径
	$.ajax({
		url:logicUrl,
		type:"post",
		data: {logicId: "09.06.03",basePath:basePath},
		dataType:"json",
		async: false,
		success:function(data){
			//var resId = data.resId;
			istallFileURL = basePath + "/gmodule_resmanage_filedown.json?id=" + data.resId;
		}
	});
	if(istallFileURL==null){
		$.messager.alert("提示", "当前已发布的最新版本找不到对应安装文件！", "info");
		return;
	}
	$("#dlg_qrcode #APKDownloadURL").linkbutton().attr({
		href:istallFileURL
	});
	$("#dlg_qrcode #qrcode").children().remove();

	$("#dlg_qrcode #qrcode").qrcode({ 
	    render: "canvas", //canvas方式 
	    width: 300, //宽度 
	    height:300, //高度 
	    text: istallFileURL //任意内容 
	}); 
	$("#dlg_qrcode").show().dialog({
		title:"扫码安装",
		modal:true,
		onClose:function(){
			$("#form_qrcode").form("reset");
		}
	});
}

/**
 * 功能：发布选中且未发布的apk版本
 * 参数：无
 */
function doPublish(){
	//TODO 发布
	var row = $("#dg").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要发布的版本！","info");
		return;
	}
	$.messager.confirm('发布版本', '版本发布后手持终端才能够进行下载和升级，发布后的版本数据将不能修改和删除。是否发布当前版本', function(r){
		if(r){
			$.ajax({
				url:accessUrl,
				type:"post",
				data:{versionId:row.versionId,accessId:"9705"},
				dataType:"json",
				success:function(data){
					if(data.resultCode==1){
						$("#dg").datagrid("reload");
					}else if(data.resultCode==2){
						$.messager.alert("提示信息","发布失败，有更新的版本已发布！","info");
					}else{
						$.messager.alert("提示信息","发布失败！","info");
					}
				},
				error:function(){
					$.messager.alert("错误","服务器内部错误！","error");
				}
			});
		}
	});
	
}

/**
 * 功能：删除选中且未发布的apk
 * 参数：无
 */
function doDelete(){
	//TODO 删除
	var row = $("#dg").datagrid("getSelected");
	if(row==null){
		$.messager.alert("提示信息","请选择需要删除的版本！","info");
		return;
	}
	$.messager.confirm('删除版本', '是否删除当前的版本数据，包含版本的基本信息和安装包？', function(r){
		if(r){
			$.ajax({
				url: logicUrl,
				type:"post",
				data:{logicId:"09.06.04",versionId:row.versionId},
				dataType:"json",
				success:function(data){
					if(data.resultCode==1){
						$("#dg").datagrid("reload");
					}else{
						$.messager.alert("提示信息","删除失败！","info");
					}
				},
				error:function(){
					$.messager.alert("错误","服务器内部错误！","error");
				}
			});
		}
	});
}

/**
 * 功能：保存新增
 * 参数：无
 */
function saveAdd(versionState){
	var formData = $("#form_add").serializeObject();
	//保存apk
	$("#form_add").form("submit", {
		method: "post",
		url: basePath + "/gmodule_resmanage_add.json",
		onSubmit: function(param){
			param.infoType = "2002";
			param.typeId = "1121";
			param.resDesc = formData.versionDesc;
			return $("#form_add").form("validate");
		},
		success: function(data) {
			var data1 = JSON.parse(data);
			if(data1.resultCode == "1") {
				//成功后执行的操作，保存版本信息
				formData.logicId = "09.06.01";
				formData.mimeType = data1.data.mimeType;
				formData.installFile = data1.data.resFile;
				formData.versionState = versionState;
				formData.resId = data1.resId;
				$.ajax({
					url: logicUrl,
					type: "post",
					data: formData,
					dataType: "json",
					success: function(data2){
						if(data2.resultCode == 1){
							$("#dlg_add").dialog("close");
							$("#dg").datagrid("reload");
						}else{
							$.messager.alert("错误信息", "APP版本上传失败！", "error");
						}
					},
					error: function(){
						$.messager.alert("错误信息", "服务器内部错误！", "error");
					}
				});
			} else if(data.resultCode == "0") {
				$.messager.alert("错误信息", "APP版本上传失败！", "error");
			} else {
				$.messager.alert("错误信息", "APP版本上传失败", "error");
			}
		},
		error: function(){
			$.messager.alert("错误信息", "服务器内部错误！", "error");
		}
	});
}

/**
 * 功能：保存修改
 * 参数：无
 */
function saveModify(){
	//TODO 保存修改
	if($("#form_modify").form("validate")){
		var data = $("#form_modify").serializeObject();
		data.accessId = "9704";
		$.ajax({
			url:accessUrl,
			type:"post",
			data:data,
			dataType:"json",
			success:function(data){
				if(data.resultCode==1){
					$("#dg").datagrid("reload");
					$("#dlg_modify").dialog("close");
				}else{
					$.messager.alert("提示信息","保存修改失败！","info");
				}
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误！","error");
			}
		});
	}
}

/**
 * 功能：下载apk
 * 参数：无
 */
function downloadApk(num){
	var infoId = undefined;
	if(num == 1){
		infoId = $("#dlg_modify [name='versionId']").val();
	} else if(num == 2){
		infoId = $("#dlg_detail #versionId").text();
	} 
	
	if(infoId == undefined){
		return;
	}
	$.ajax({
		url: accessUrl,
		type: "post",
		data: {accessId:"3202",infoId:infoId,infoType:"2002"},
		dataType: "json",
		async: false,
		success:function(data){
			var resId = data.resId;
			if(resId!=null){
				
				location.href = basePath + "/gmodule_resmanage_filedown.json?id=" + resId;
			}
		}
	});
}

/**
 * 功能：取消或关闭对话框
 * 参数：无
 */
function doCancel(dialogId){
	$(dialogId).dialog("close");
}

/**
 * 功能：当双击一行时触发事件
 * 参数： rowIndex 该行的索引
 * 		rowData 该行的数据
 */
function onDblClickRow(rowIndex,rowData){
	$("#dlg_detail #versionId").text(rowData.versionId);
	$("#dlg_detail #versionDesc").text(rowData.versionDesc);
	$("#dlg_detail #updateContent").html(rowData.updateContent.replace(/\n/g,"<br>"));
	$("#dlg_detail #installFile").text(rowData.installFile);
	$("#dlg_detail").show().dialog({
		title:"APP版本详情",
		modal:true,
		onClose:function(){
			$("#form_detail").form("reset");
		}
	});
}

/**
 * 功能：当选择一行时触发事件，设置按钮是否可用
 * @param rowIndex
 * @param rowData
 */
function onSelect(rowIndex,rowData){
	var isUsed = false;
	if(rowData.versionState==1){
		isUsed = true;
	}else{
		isUsed = false;
	}
	$("#modifyBtn").linkbutton({disabled:isUsed});
	$("#publishBtn").linkbutton({disabled:isUsed});
	$("#deleteBtn").linkbutton({disabled:isUsed});
}

/**
 * 功能：格式化数据网格发布状态列
 */
function stateFormatter(value, row, index){
	return value==1?"已发布":"未发布";
}

/**
 * 功能：格式化网格更新内容列
 * @param value
 * @param row
 * @param index
 */
function updateContentFormatter(value,row,index){
	return "<span title='"+value+"'>"+value+"</span>";
}

/**
 * 功能：服务器校验，新增时输入的版本序号是否可用
 * 参数：无
 */
function versionValid(){
	$("[name='versionId']").validatebox({
		required:true,
		missingMessage:"版本号不能为空",
		invalidMessage:"版本号过低",
		validType:"remoteValid['" + logicUrl + "', 'versionId', {logicId:'09.06.02'}]"
	});
}

