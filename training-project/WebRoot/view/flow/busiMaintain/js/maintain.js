//form表单弹窗属性
var options={
	width:'80%',
	height:'100%',
	title:'保养确认',
	buttons:'#receiveSc'
};

//当前登录用户信息
var user;

//保养信息
var maintainInfo;

/**
 * 商品保养业务流程
 */
$(function(){
	
});

/**
 * 初始化
 * @param row 典当的商品数据
 */
function initPage(){
	//在流程信息中取出典当业务ID
	var maintainId = _taskData.businessKey;
	console.log(maintainId);
	
	//查询保养信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		method:"post",
		async: false,
		data:{maintainId:maintainId,accessId:"63706"},
		success:function(data){
			maintainInfo = data;
			//回显保养价格信息
			$("#goodsNameType_receive").textbox("setValue",data.goodsName);
			$("#maintainType_receive").textbox("setValue",data.maintainType);
			$("#maintainPrice_receive").textbox("setValue",data.maintainPrice);
			$("#declarationValue_receive").textbox("setValue",data.declarationValue);
		}
	});
	
	//查询客户信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		method:"post",
		data:{memberId:maintainInfo.deliveryEmpId,accessId:"64105"},
		success:function(data){
			//回显客户资料
			$("#memberId_receive").textbox("setValue",data.memberId);
			$("#memberName_receive").textbox("setValue",data.memberName);
			$("#mobile_receive").textbox("setValue",data.mobile);
			$("#certNo_receive").textbox("setValue",data.certNo);
		}
	});
	
	//查询商品信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		method:"post",
		data:{goodsId:maintainInfo.goodsId,accessId:"62510"},
		success:function(data){
			//回显商品资料
			$("#goodsId_receive").textbox("setValue",data.goodsId);
			$("#goodsName_receive").textbox("setValue",data.goodsName);
			$("#officialPrice_receive").textbox("setValue",data.officialPrice);
			$("#firstPrice_receive").textbox("setValue",data.firstPrice);
			$("#valuationPrice_receive").textbox("setValue",data.valuationPrice);
		}
	});
}

/**
 * 保养完成
 */
function doSaveReceive(){
	$.messager.confirm("确认", "是否确认完成保养，进入后续处理？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:{taskId:_taskData.id,logicId:"06.03.07.02",maintainId:maintainInfo.maintainId},
				async:false,
				success:function(data){
					if(data.resultCode==1){
						//成功
						refresh();
						$.messager.alert("提示信息","办理完成","info");
						$("#productsTable").datagrid("reload");
					}else{
						$.messager.alert("错误信息","流程开启失败,请重试或联系管理员","error");
					}
				},
				error:function(){
					$.messager.alert("错误信息","流程开启失败,请联系管理员","error");
				}
			});
		};
	});
}

