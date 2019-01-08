//form表单弹窗属性
var options={
		width:650,
		height:500,
		title:'完善员工信息',
		buttons:'#sc_form'
};
var empId = _taskData.businessKey;
var infoType='1002';//员工电子资料
var typeId='1142';//其他电子资料
var picTypeId='1141';//员工照片
var opType;//电子资料操作类型

//初始化页面
function initPage(){
	//从任务信息中取出业务主键作为员工id，查询员工信息
	var empId = _taskData.businessKey;
	//通过业务主键查询员工信息
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data:{empId:empId,accessId:'1318'},
		async:false,
		success:function(data){
		    data.deptName=data.deptId;
			loadALlSelect();
			//加载工作岗位
			loadPostData(data.deptId);
			//加载工作经验
			loadWork(empId);
			//加载电子资料
			loadEleRecord();
			$("#addAndSubmitForm").form("load",data);
		}
	});
	//验证编号
	validateCode(empId,0);
}

//******************************************* 工作经验 ***************************************************
function loadWork(empId){
	//修改时在table后面添加工作经验
	$("#addAndSubmitDiv #workExp").append($("#workContent").show());
	$("#workTable").datagrid({
		url:basePath+"/dataaccess.json",
		queryParams:{accessId:'1312',empId:empId},
		onDblClickRow: function(index, row) {
			modifyWork();
		}
	});
}

/**
 * 添加工作经历
 */
function addWork(){
	workIsNew = true;
	saveWorkUrl = basePath+"/dataaccess.json";
	$("#work_am").form('reset');
	//打开添加对话框
	$("#work_dialog").dialog('setTitle','添加工作经历').dialog('open').dialog('center');
	$(".dialog-button").css("text-align","right");
	//添加验证
	validateWork();
	setTimeout($("#unitNameWork").textbox().next("span").find("input").focus(),500);
}

/**
 * 工作经历修改代码管理
 */
function modifyWork(){
	//修改标志
	workIsNew=false;
	//设置修改url
	saveWorkUrl=basePath+"/dataaccess.json";
	//获取选择的数据
	var rows=$("#workTable").datagrid("getSelections");
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要修改的数据");
	}else{
		//主键
		worklistId=rows[0].listId;
		//打开对话框
		$("#work_dialog").dialog({
			modal:true,
			title:"修改工作经历",
			onClose:function(){
				//清空数据
				$("#work_am").form("reset");
			}
		}).dialog('open').dialog("center");
		//数据回显
		$("#work_am").form("load",rows[0]);
		//进行验证
		validateWork();
		setTimeout($("#unitNameWork").textbox().next("span").find("input").focus(),500);
	}
}

/**
 * 工作经历删除
 */
function removeWork(){
	//获取修改的数据
	var rows=$("#workTable").datagrid("getSelections");
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要删除的数据");
	}else{
		$.messager.confirm("提示信息","你确定要删除这条数据吗？删除后将无法恢复！",function(r){
			if(r){
				$.ajax({
					url:basePath+"/dataaccess.json",
					type:'post',
					data:{listId:rows[0].listId,accessId:'1314'},
					success:function(data){
						if(data.resultCode==1){
							//刷新数据网格
							$("#workTable").datagrid("reload");
						}else{
							$.messager.alert("提示信息","删除失败！","info");
						}
					}
				});
			}
		});
	}
}

/**
 * 验证工作经历各项不能为空，且开始时间不能大于结束时间
 */
function validateWork() {
	$("#unitNameWork").textbox({
		required:true,
		missingMessage:"公司名称不能为空"
	});
	$("#jobPositionWork").textbox({
		required:true,
		missingMessage:"工作岗位不能为空"
	});
	$("#workScopeWork").textbox({
		required:true,
		missingMessage:"工作职责不能为空"
	});
	$("#startTimeWork").textbox({
		required:true,
		missingMessage:"开始时间不能为空"
	});
	$("#endTimeWork").textbox({
		required:true,
		missingMessage:"结束时间不能为空",
		invalidMessage:"结束时间不能小于开始时间",
		validType : 'projectTime["startTimeWork"]'
	});
}

/**
 * 工作经历新增、修改保存
 */
function doWorkSave(){
	//提交数据
	if($("#work_am").form("validate")){
		$("#work_am").form("submit",{
		method: "post",
		url: saveWorkUrl,
		onSubmit: function(param){
			param.empId = empId;
			//param.accessId='1311';
			if(!workIsNew){
				param.listId=worklistId;
				param.accessId='1313';
			}else{
				param.accessId='1311';
			}
	    },
		success: function(data){
			var data1=JSON.parse(data);
			if(data1.resultCode=="1"){
				//刷新数据网格
				$("#workTable").datagrid("reload");
				//关闭对话框																			
				$('#work_dialog').dialog('close');
				//清空数据
				$("#work_am").form("reset");
			} else if(data1.resultCode=="0"){
				$.messager.alert("提示信息", "操作失败了，请联系管理员", "error");
			} else{
				$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
			}
		}
	});
	}
}

//******************************************* 电子资料 ***************************************************
function loadEleRecord(){
	//修改时在table后面添加工作经验
	$("#addAndSubmitDiv #eleRecord").append($("#eleRecordContent").show());
	$("#resTable").datagrid({
		url:basePath+"/dataaccess.json",
		queryParams:{accessId:'1315',empId:empId,infoType:infoType},
		onDblClickRow: function(index, row) {
			modifyEleRes();
		},	
		loadFilter: function(data){
			var filterData=[];
			var showData={};
			for(var i=0;i<data.rows.length;i++){
				if(data.rows[i].fileSize!=0){
					filterData.push(data.rows[i]);
				}
			}
			showData.rows=filterData;
			return showData;
		}
	});
}

/**
 * 预览
 */
function lookPic(id){
	var aaa = [];
	var url = {url:''+basePath+'/gmodule_resmanage_filedown.json?id=' + id};
	aaa.push(url);
	$("#aaa").picturePreview(aaa,"showPics");
}

/**
 * 上传电子资料
 */
function uploadEleRes(){
	//新增操作类型
	opType='add';
	//设置默认的项目id，分类序号
	$("#techlvl_dlg_am").dialog({
		modal: true,
		title: "电子资料管理",
		onClose: function() {
			//清空数据
			$("#techlvl_fm_am").form("reset");
		}
	});
	//验证
	validateEleRes();
	//项目名称编辑框获取焦点
	setTimeout(function(){
		$("#resDesc").textbox("textbox").focus();
	}, 300);
}

/**
 * 修改电子资料
 */
function modifyEleRes(){
	//获取选择的数据
	var rows=$("#resTable").datagrid("getSelections");
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要修改的数据");
	}else{
		//修改操作类型
		opType='modify';
		//打开对话框
		$("#techlvl_dlg_am").dialog({
			modal: true,
			title: "项目资源管理",
			onClose: function() {
				//清空数据
				$("#techlvl_fm_am").form("reset");
			}
		});
		//数据回显
		$("#techlvl_fm_am").form("load",rows[0]);
		//进行验证
		validateEleRes();
		//项目名称编辑框获取焦点
		setTimeout(function(){
			$("#resDesc").textbox("textbox").focus();
		}, 300);
	}
}

/**
 * 删除电子资料
 */
function deleteEleRes(){
	//获取修改的数据
	var rows=$("#resTable").datagrid("getSelections");
	if(rows.length!=1){
		$.messager.alert("提示信息","请选择要删除的数据");
	}else{
		$.messager.confirm("提示信息","你确定要删除这条数据吗？删除后将无法恢复！",function(r){
			if(r){
				//删除资源
				$.ajax({
					type: "post",
					url: basePath+"/businesslogic.json",
					data: {resId:rows[0].resId,infoType:infoType,infoId:empId,opType:'delete',logicId:'04.03.04'},
					success: function(data) {
					if(data.resultCode == "1") {
						//刷新数据网格
						$("#resTable").datagrid("reload");
				 	}else {
						$.messager.alert("错误信息", "操作失败！", "error");
						}
					}
				});
			}
		});
	}
}

/**
 * 新增修改保存
 */
function doSaveResource() {
	//var formData = $("#addAndSubmitForm").serializeObject();
	var form = new FormData(document.getElementById("techlvl_fm_am"));
	form.append("infoType", infoType);
	form.append("typeId", typeId);
	form.append("deptId", $("#deptIdEdit").val());
	form.append("logicId", '04.03.04');
	form.append("empId", empId);
	form.append("opType", opType);
	//文件上传，保存数据
	if($("#techlvl_fm_am").form("validate")){
	$.ajax({
		type: "post",
		url: basePath+"/businesslogic_upload.json",
		data: form,
		processData : false,
		contentType : false,
		success: function(data) {
		if(data.resultCode == "1") {
			$("#resTable").datagrid("reload");
			$('#techlvl_dlg_am').dialog('close');
	 	}else {
			$.messager.alert("错误信息", "操作失败！", "error");
			}
		}
	});
	}
}

/**
 * 关闭窗口
 */
function doCloseResource(){
	$('#techlvl_dlg_am').dialog('close');
}

/**
 * 验证资源描述，不为空
 */
function validateEleRes() {
		$("#resDesc").textbox({
			required: true,
			missingMessage: "资源描述不能为空"
		});
}

//提交完善员工信息
function perfectEmpInfo(flag){
   	var formData = $("#addAndSubmitForm").serializeObject();
	var form = new FormData(document.getElementById("addAndSubmitForm"));
	form.append("infoType", infoType);
	form.append("typeId", picTypeId);
	form.append("resDesc", "员工"+formData.empName+"的照片");
	form.append("deptId", $("#deptIdEdit").val());
	form.append("logicId", '04.03.02');
	form.append("empId", _taskData.businessKey);
	//拼接岗位id字符串
	var postIdArray=form.getAll("postId");
	var postId=postIdArray.join(",");
	form.set("postId",postId);
	//文件上传，保存数据
	if($("#addAndSubmitForm").form("validate")){
		var message;
		if(flag=='submit'){
			message = "提交后将进入下一处理环节，是否继续？";
		}else{
			message = "保存后将修改员工信息，是否继续？";
		}
		$.messager.confirm("确认", message , function(r){
			if(r){
				$.ajax({
					type: "post",
					url: basePath+"/businesslogic_upload.json",
					data: form,
					processData : false,
					contentType : false,
					success: function(data) {
					if(data.resultCode == "1") {
						//提交操作
						if(flag=='submit'){
							//完成任务
							$.ajax({
								url:basePath + "/businesslogic.json",
								type:"post",
								data: {taskId:_taskData.id,logicId:'03.01.02',empId:empId,empState:'入职审核中'},
								async:false,
								success:function(data){
									if(data.resultCode==1){
										//提交成功
										$.messager.alert("提示信息","提交成功","info");
									}else{
										$.messager.alert("错误信息", "提交失败！", "error");
									}
								}
							});
						}else{
							//提示员工信息保存成功
							$.messager.alert("提示信息","保存成功","info");
						}
						//关闭弹窗
						refresh();
				 	}else {
						$.messager.alert("错误信息", "员工信息保存失败！", "error");
						}
					}
				});
			}
		});
	}
};
/**
*  加载所有下列列表数据
*/
function loadALlSelect(){
	//加载职位下拉选
	$("#jobPositionEdit").combobox("loadData",queryDictData("HR_JOB_POSITION"));
	//加载员工类型下拉选
	$("#empTypeEdit").combobox("loadData",queryDictData("HR_EMP_TYPE"));
	//加载性别下拉选
	$("#genderEdit").combobox("loadData",queryDictData("GENDER"));
	var queryData = queryDictData("HR_EMP_TYPE");
	queryData.unshift({dictDesc:"全部类型"});
	$("#empTypeQuery").combobox("loadData",queryData);
	//加载名族下拉选
	$("#nationalEdit").combobox("loadData",queryDictData("HR_NATIONAL"));
	//加载员工状态下拉选
	$("#empStateEdit").combobox("loadData",queryDictData("HR_EMP_STATUS"));
	var queryData1 = queryDictData("HR_EMP_STATUS");
	queryData1.unshift({dictDesc:"全部状态"});
	$("#empStateQuery").combobox("loadData",queryData1);
	//加载最高学历下拉选
	$("#eduQualificationEdit").combobox("loadData",queryDictData("HR_EDU_QUALIFICATION"));
	//加载院校级别下拉选
	$("#collegeLvlEdit").combobox("loadData",queryDictData("HR_COLLEGE_LVL"));
	//加载英语能力下拉选
	$("#engAbilityEdit").combobox("loadData",queryDictData("HR_ENG_ABILITY"));
	var queryData2 = queryDictData("HR_JOB_POSITION");
	queryData2.unshift({dictDesc:"全部职位"});
	$("#jobPositionQuery").combobox("loadData",queryData2);
	loadDeptTree();
}
	
 /**
 * 根据类型编码查询数字典信息
 * @param typeCode 类型编码
 */
function queryDictData(typeCode) {
	var returnData = null;
	$.ajax({
		url : basePath + "/gmodule_datadict_findall.json",
		type : 'post',
		async:false,
		data : {"typeCode" : typeCode},
		dataType : "json",
		success : function(data) {
			// 获取数据字典中的字段类型的数据
			returnData = data.rows;
		}
	});
	return returnData;
}

/**
 * 加载部门树结构 
 */
function loadDeptTree(){
	var loadDeptParams={};
	loadDeptParams.logicId="04.01.01";
	loadDeptParams.postId="";
	//加载部门树结构
	$("#deptNameEdit").combotree({
		url:basePath+"/businesslogic.json",
		method:"post",
		animate:true,//动画效果
		checkbox:true,//节点前勾选框
		async:false,
		queryParams:loadDeptParams,
		loadFilter:function(data1,parent){
			var data = data1.rows;
			for(var i in data){
				data[i].text=data[i].text;
			}
			return data;
		},
		onSelect:function(node){
			//设值
			$("#deptIdEdit").val(node.deptId);
			 loadPostData(node.deptId);
			//
		}
	});
}

/**
 * 加载岗位数据
 */
function loadPostData(deptId){
	//初始化
	$("#postNameEdit").combobox('loadData',[]);
	$("#postNameEdit").combobox('clear');
	var postData;
	$.ajax({
		type: "post",
		url: basePath+"/dataaccess.json",
		data: {deptId:deptId,accessId:'1113'},
		async:false,
		success: function(data) {
			postData=data.rows;
		}
	});	
	$("#postNameEdit").combobox('loadData',postData);
}
//格式化文件上传时间
function uploadTimeFormatter(value) {
	if(null == value || value == '') {
		return "";
	}
	return new Date(value).pattern("yyyy-MM-dd");
}

/**
 * 设置下载链接
 */
function downFormatter(value, row, index) {
	if (row.isPic == "1") {
		return "<a href='"+basePath+"/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;' >下载</a> | <a href='#'  style='color: blue;' onclick=lookPic(" + row.resId + ")>预览</a>";
	} else {
		return "<a href='"+basePath+"/gmodule_resmanage_filedown.json?id=" + row.resId + "'  style='color: blue;' >下载</a>";
	}
}

/**
 * 验证编号不重复
 */
function validateCode(empId,isNew){
	$('#empCodeEdit').textbox({
		required: true,
		missingMessage: '请输入员工编号',
		invalidMessage: '部门编号已经存在',
		//参数说明：第一个,URL;第二个是表单中要验证的输入项id;第三个是额外的参数(JSON)
		validType: "remoteValid['" + basePath + "/businesslogic.json','empCode',{logicId:'04.03.06',empId:'"+empId+"',isNew:'"+isNew+"'}]"
	});
}