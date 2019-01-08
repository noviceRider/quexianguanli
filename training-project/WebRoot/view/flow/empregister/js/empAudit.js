//form表单弹窗属性
var options={
	width:800,
	height:500,
	title:'员工信息审核',
	buttons:'#sc_form',
};

/**
* 初始化form表单 ，
*/
function initPage(){
	//从任务信息中取出业务主键作为员工id，查询员工信息
	var empId = _taskData.businessKey;
	var infoType='1002';//员工电子资料
	loadDeptTree();
	//通过业务主键查询员工信息
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data:{empId:empId,accessId:'1318'},
		async:false,
		success:function(data){
			data.deptNameStr=data.deptId;
			//加载工作岗位
			loadPostData(data.deptId);
			$("#addAndSubmitForm").form("load",data);
			var postName= $("#postNameEdit").combobox("getText");
			data.postName = postName;
			//将员工信息显示到dialog中;
			Common.loadDataForDOM(data,"#formParse","span","name");
		}
	});
	//头像
	$.ajax({
		type: "post",
		url: basePath+"/dataaccess.json",
		data: {empId:empId,infoType:infoType,accessId:'1316'},
		success: function(data) {
			$("#detailPhoto").attr("src",basePath +"/gmodule_resmanage_filedown.json?id="+data.resId+"");
		}
	});
	// 根据所选员工加载电子材料数据，再将信息显示在数据网格中
	$("#filegrid").datagrid({
		url:basePath+"/dataaccess.json",
		queryParams:{accessId:'1315',empId:empId,infoType:infoType},
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
	//工作经验
	$("#detailWorkTable").datagrid({
		url:basePath+"/dataaccess.json",
		queryParams:{accessId:'1312',empId:empId}
	});
};

/**
*	审核处理
*/
function charge(flag){
	var message;
	if(flag=='1'){
		message = "是否确定通过审核？";
	}else{
		message = "是否确定不通过审核，未通过审核将退回上一处理环节？";
	}
	$.messager.confirm("确认", message, function(r){
		if(r){
			$.ajax({
				type: "post",
				url: basePath+"/businesslogic.json",
				data: {flag:flag,taskId:_taskData.id,procInstId:_taskData.procInstId,logicId:'03.01.03'},
				success: function(data) {
					if(data.resultCode==1){
						//操作成功
						$.messager.alert("提示信息","处理完成！","info");
						refresh();
					}else{
						$.messager.alert("错误信息", "处理失败！", "error");
					}
				}
			});
		};
	});
}

/**
* 	格式化文件大小
*/
function fileSizeFormatter(value) {
	if(null == value || value == '') {
		return "0 Bytes";
	}
	var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
	var index = 0;
	var srcsize = parseFloat(value);
	index = Math.floor(Math.log(srcsize) / Math.log(1024));
	var size = srcsize / Math.pow(1024, index);
	size = size.toFixed(2); //保留的小数位数
	return size + unitArr[index];
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