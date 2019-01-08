//form表单弹窗属性
var options={
	width:'80%',
	height:'100%',
	title:'取回',
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
	//获取业务状态下拉列表
	getType();
	//在流程信息中取出典当业务ID
	var maintainId = _taskData.businessKey;
	
	//获取当前登录用户信息并赋值给全局变量user
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			//得到用户
			user = data.user;
		}
	});
	
	//查询保养信息
	$.ajax({
		url:basePath+"/dataaccess.json",
		method:"post",
		data:{maintainId:maintainId,accessId:"63706"},
		async: false,
		success:function(data){
			maintainInfo = data;
			//回显保养价格信息
			$("#goodsNameType_receive").textbox("setValue",data.goodsName);
			$("#maintainType_receive").textbox("setValue",data.maintainType);
			$("#maintainPrice_receive").textbox("setValue",data.maintainPrice);
			$("#declarationValue_receive").textbox("setValue",data.declarationValue);
			//金额和付款方式
			$("#amount_receive").textbox("setValue",data.amount);
			$("#payType_receive").combobox("setValue",data.payType);
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
	
	//操作记录
	$("#detail_task_dg").datagrid({
		url:basePath+"/dataaccess.json",
		method:"post",
		fitColumns:true,
		queryParams:{accessId:"63206",busiId:maintainInfo.maintainId,busiType:"03"},
		columns:[[
			         {field:'busiLogId',title:'记录编号',width:'15%',sortable:true,alias:'busi_log_id',halign:'center',align:'left'},
			         {field:'busiId',title:'业务编号',hidden:true},
			         {field:'empName',title:'操作人',width:"20%",sortable:false,halign:'center',align:'left'},
			         {field:'operation',title:'操作类型',width:'20%',sortable:false,alias:'',halign:'center',align:'center'},
			         {field:'operateTime',title:'操作时间',width:'35%',sortable:false,alias:'',halign:'center',align:'center'},
			     ]]
	});
	
}

/**
 * 取回物品
 */
function doSaveReceive(){
	$.messager.confirm("确认", "是否确认取回物品，进入后续处理？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:{taskId:_taskData.id,logicId:"06.03.07.04",maintainId:maintainInfo.maintainId},
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

/**
 * 图片选择实时预览
 */
function previewImage(file, type) { 
	var div = null;
	if(type == 1) {
		fileName=$("#uploadFile").val(); 
		div = document.getElementById('preview'); 
	}else if(type == 2){
		fileName=$("#imgSelect1").val(); 
		div = document.getElementById('preview1'); 
	}else{
		fileName=$("#replyPhoto").val(); 
		div = document.getElementById('preview2');
	}
	
	$("#imgName").attr("value",fileName);  
	var MAXWIDTH  = 80;     //用来显示上传图片的宽度  
	var MAXHEIGHT = 62;     //用来显示上传图片的高度  

		
  
	if (file.files && file.files[0]) {  
		div.innerHTML = '<img id="imghead_'+type+'">';  
		var img = document.getElementById('imghead_'+type);  
		img.onload = function(){  
			var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
			img.width = rect.width;  
			img.height = rect.height;  
			img.style.marginLeft = rect.left+'px';  
			img.style.marginTop = rect.top+'px';  
		};  
		var reader = new FileReader();  
		reader.onload = function(evt){img.src = evt.target.result;};  
		reader.readAsDataURL(file.files[0]);  
	}  
	else {  
		var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';  
		file.select();  
		var src = document.selection.createRange().text;  
		div.innerHTML = '<img id=imghead>';  
		var img = document.getElementById('imghead');  
		img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;  
		var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
		status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);  
		div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;margin-left:"+rect.left+"px;"+sFilter+src+"\"'></div>";  
	}  
}

function clacImgZoomParam( maxWidth, maxHeight, width, height ){  
    var param = {top:0, left:0, width:width, height:height};  
    if( width>maxWidth || height>maxHeight )  
    {  
        rateWidth = width / maxWidth;  
        rateHeight = height / maxHeight;  
        if( rateWidth > rateHeight )  
        {  
            param.width =  maxWidth;  
            param.height = Math.round(height / rateWidth);  
        }else  
        {  
            param.width = Math.round(width / rateHeight);  
            param.height = maxHeight;  
        }  
    }  
    param.left = Math.round((maxWidth - param.width) / 2);  
    param.top = Math.round((maxHeight - param.height) / 2);  
    return param;  
}  

/**
 * 格式化耗时字段
 * @param value
 * @param row
 * @param index
 * @returns {Number}
 */
function secondFormatter(value,row,index){
	
	if(row.endTime){
		var time=row.endTime-row.startTime;
		return formatDuring(time);
	}else{
		return 0;
	}
}

/**
 * 时间格式化
 * @param value
 * @returns
 */
function timeFormatter(value) {
	if(null == value || value == '') {
		return "";
	}
	return new Date(value).pattern("yyyy-MM-dd hh:mm");
}


/**
 * 通过数据字典查询得到状态集合
 */
function getType(){
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:"post",
		data:{
			accessId:"3301",
			typeCode:"PC_BUSI_MAINTAIN_STAT"
		},
		dataType:"json",
		success: function(data){
			
			if(data != null){
				//保存状态集合
				typeArr = data.rows;
				
				//给状态集合添加一个  全部（不区分状态的） 对象
				var newType = {};
				
				//对应显示选项的value值
				newType.dictCode = "";
				
				//对应显示选项的显示text值
				newType.dictDesc = "全部状态";
				
				//添加对象在数组的首位
				typeArr.unshift(newType);
				
				//加载combox数据
				$('#stateCombobox').combobox({
					data:typeArr
				});
				//设置shopcombobox默认显示哪一个选项
				$('#stateCombobox').combobox("setValue","");
			}
		}
	});
	
	$.ajax({
		url:basePath+"/dataaccess.json",
		type:"post",
		data:{
			accessId:"3301",
			typeCode:"PC_PAWN_PAY_TYPE"
		},
		async: false,
		dataType:"json",
		success: function(data){
			if(data != null){
				//加载combox数据
				$('#payType_receive').combobox({
					data:data.rows
				});
			}
		}
	});
}
