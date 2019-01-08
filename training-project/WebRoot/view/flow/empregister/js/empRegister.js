//form表单弹窗属性
var options={
	width:600,
	height:280,
	title:'录入员工基本信息'
};
//启动流程
function startProcess(){ 
	var empInfo = $("#addAndSubmitForm").serializeObject();
	empInfo.id = _procDefId;
	empInfo.logicId = '03.01.01';
	var postIdArray = empInfo.postId;
	var postId = '';
	if(postIdArray){
		if(postIdArray instanceof Array){
			postId = postIdArray.join(",");
		}else{
			postId = postIdArray;
		}	
	}
	empInfo.postId = postId;
	empInfo.empState = '入职办理中';
	//获取开始节点formKey值
	if($("#addAndSubmitForm").form("validate")){
		$.messager.confirm("确认", "是否开启流程，进入后续处理？", function(r){
			if(r){
				$.ajax({
					url:basePath + "/businesslogic.json",
					type:"post",
					data:empInfo,
					async:false,
					success:function(data){
						if(data.resultCode){
							//成功
							cancelStartProcess();
							$.messager.alert("提示信息","入职流程开启成功","info");
						}else{
							//失败
							$.messager.alert("错误信息","入职流程开启失败","error");
						}
					}
				});
			};
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
			$("#deptDesc").val(node.text);
			loadPostData(node.deptId);
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

/**
*	选择员工类型
*/
function selectEmpType(record){
	$("#empTypeDes").val(record.dictDesc);
}

/**
*	选择职位
*/
function selectJob(record){
	$("#jobPositionDesc").val(record.dictDesc);
}

/**
*	选择岗位
*/
function selectPost(record){
	$("#postDesc").val($(this).combobox("getText"));
}