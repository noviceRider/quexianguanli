//form表单弹窗属性
var options={
	width:'100%',
	height:'100%',
	title:'完善商品信息',
	buttons:'#sc_form'
};

//状态集合
var typeArr = [];

//最后一集分类编号
var subCode = '';

//保存上传图片容器id不重复
var uploadImgNum = 0;

//判断是否是更换图片 "add"上传  "replace"更新 'delete'删除
var replace = "add";

//资源编号 分类编号
var typeId = '1164';

//所属商品类型
var infoType = '1004';

//上传的图片信息
var imgArr = [];

//修改图片时的资源按编号
var resId = '';

//当前加载的图片原定于
var evalPicDefArr = [];

//得到当前用户
var user  = {};

//是否修改商品分类
var isUpdateGoodscat;

//当前修改的商品的信息
var updateGoodsInfo=null;

//修改或新增
var isNew=false;

var catCode;

/**
 * 初始化
 */
function initPage(){
	//构造商品来源下拉
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:{typeCode:"PC_GOODS_SOURCE_TYPE",accessId:3301},
		method:"post",
		async:false,
		success:function(data){
			$("#sourceType").combobox({
				data:data.rows,
				onSelect:function(Item){
					if(Item.dictCode=="01" || Item.dictCode=="05"){//收货或租赁收回
						//显示可租可售复选框
						$("#rentOrSaleSpan").show();
						$("#isRentableSpan").show();
						$("#isSalableSpan").show();
					}else if(Item.dictCode=="02" || Item.dictCode=="04"){//典当或保养
						//隐藏可租可售复选框
						$("#rentOrSaleSpan").hide();
						$("#isRentableSpan").hide();
						$("#isSalableSpan").hide();
					}else if(Item.dictCode=="03"){//寄卖
						//显示可售复选框，隐藏可租复选框
						$("#rentOrSaleSpan").show();
						$("#isRentableSpan").hide();
						$("#isSalableSpan").show();
					}
				}
			});
		}
	});
	
	//隐藏可租可售复选框
	$("#rentOrSaleSpan").hide();
	$("#isRentableSpan").hide();
	$("#isSalableSpan").hide();
	
	if("undefined"==typeof _taskData){//判断流程是否已经开启
		//修改新增与修改商品标识
		isNew=true;
		$("#nextStepStraight").hide();
		$("#goodsCatDescSpan").text("您当前选择的商品类别是:");
		
		//切换到新增页面
		$("#mainDivPageStacker").pageStacker("openPage","#addPage");
		$("#addDivPageStacker").pageStacker("openPage","#addOne");
		
		//隐藏 保存和提交按钮
		$("#aaaa").hide();
		
		
		//构造商品分类选择框
		getClassification();
	}else{
		//显示保存和提交按钮
		$("#aaaa").show();
		//从任务信息中取出业务主键作为商品id，查询商品信息
		var goodsId = _taskData.businessKey;
		
		//通过业务主键查询商品信息
		$.ajax({
			url:basePath + "/dataaccess.json",
			type:"post",
			data:{goodsId:goodsId,accessId:'62510'},
			async:false,
			success:function(data){
				updateGoodsInfo=data;
				
				perfectOprate(data);
			}
		});
	}
	
	
};

/**
 * 打开添加页面 获取到分类数据
 */
function getClassification(){
	//大类的数据加载
	$("#1_select_3").html("");
	$("#1_select_2").html("");
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{accessId:"62108"},
		success:function(data){
			if(data != null){
				var rows = data.rows;
				if(rows != null && rows != '' && rows.length != 0){
					$("#1_select_1").html(getSelectHtml(rows,"shop"));
//					subCode = $("#1_select_1").val();
					getTwoClass($("#1_select_1").val(),'1');
				}
			}			
		},
		error:function(){
			$.messager.alert("错误","服务器内部错误","error");
		}
	});
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			//得到用户
			user = data.user;
		}
	});
}

/**
 * 通过上级分类得到下级分类
 * @param supCatCode 上级编号
 * @param successCallback 成功回掉
 * @param errorCallback 失败回掉
 */
function getTwoClassification(supCatCode,successCallback,errorCallback){
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{pCatCode:supCatCode,accessId:"62202"},
		success:successCallback,
		error:errorCallback
	});
}


/**
 * 当一级分类选中项改变时
 * @param supCatCode 选中的一级分类编号
 */
function OneClassSelectChange(supCatCode){
	
}

/**
 * 通过上级分类得到下级分类
 * @param supCatCode 上级编号
 * @param successCallback 成功回掉
 * @param errorCallback 失败回掉
 */
function getTwoClassification(supCatCode,successCallback,errorCallback){
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{pCatCode:supCatCode,accessId:"62202"},
		success:successCallback,
		error:errorCallback
	});
}

/**
 * 关闭其余部分 回到表格板块
 */
function closePage(){
	//清空基本信息显示列表
	$("#goodsIdP").text("");
	$("#shopCodeP").text("");
	$("#inputUserP").text("");
	$("#catCodeP").text("");
	$("#goodsNameP").text("");
	$("#firstPriceP").text("");
	$("#goodsDescP").text("");
	$("#goodsBrandP").text("");
	$("#articleNumberP").text("");
	$("#inputDateP").text("");
	$("#historyIdentifyCount").text("");
	//清空属性DIV
	$("#goodsAttrDiv").html("");
	
	//清空图片显示DIV
	$("#goodsImages").html("");
	
	//清空鉴定表单
	$("#identifyForm").form("reset");
	
	evalPicDefArr = [];
	$("#evalPicDefDiv").html('');
	imgArr = [];
	uploadImgNum = 0;
	$("#goodsCat_form").form("reset");
	$("#goodsAttribute_table").html('');
	
	$("#four").removeClass("complete-bg");
	$("#four").addClass("uncomplete-bg");
	$("#three").removeClass("complete-bg");
	$("#three").addClass("uncomplete-bg");
	$("#two").removeClass("complete-bg");
	$("#two").addClass("uncomplete-bg");
	
	//步骤图片中间连线样式
	$("#first_line").removeClass("line-bg1");
	$("#first_line").addClass("line-bg");
	
	$("#mainDivPageStacker").pageStacker("openPage","#tablePage");
}

/**
 * 点击下一步
 * @param index 当前步骤数
 * @returns
 */
function toNextPage(index){
	if(index == 1){
		
		isUpdateGoodscat=true;
		stepToGoodsInfo($("#1_select_1").val());
		
		toNextPageAfterCat();
		
	}else if(index == 4){//完成
		$.messager.confirm("确认信息","是否完成办理,重新提交鉴定?",function(r){
			//得到商品信息表单数据
			var formData = $("#goodsCat_form").serializeObject();
			
			//判断新增或修改
			if(isNew==true){
				formData.catCode = $("#1_select_1").val();
				formData.subCatCode = $("#1_select_2").val();
				formData.detailCatCode = $("#1_select_3").val();
			}else{
				//判断是否修改商品品牌
				if(isUpdateGoodscat==false){
					formData.catCode=updateGoodsInfo.catCode;
					formData.subCatCode = updateGoodsInfo.subCatCode;
					formData.detailCatCode = updateGoodsInfo.detailCatCode;
				}else{
					formData.catCode = $("#1_select_1").val();
					formData.subCatCode = $("#1_select_2").val();
					formData.detailCatCode = $("#1_select_3").val();
				}
			}
			
			
			//创建信息
			formData.createBy = user.userId;
			formData.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
			
			//修改信息
			formData.modifyBy = user.userId;
			formData.modifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
			formData.goodsStat = "01";
			formData.logicId = "03.03.04";
			formData.submitType=1;
			formData.taskId=_taskData.id;
			console.log(_taskData);
			for(var i = 0; i < evalPicDefArr.length;i++){
				
				if(evalPicDefArr[i].flat == 1){
					if(imgArr.length == 0){
						$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
						return;
					}
					for(var j = 0; j < imgArr.length;j++){
						if(imgArr[j].resDesc == evalPicDefArr[i].picType){
							break;
						}else if(j == imgArr.length - 1 && imgArr[j].resDesc != evalPicDefArr[i].picType){
							$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
							return;
						}
					}
				}
			}
			formData.resIds ='';
			for(var i = 0; i < imgArr.length;i++){
				if(i == 0){
					formData.resIds = imgArr[i].resId;
				}else{
					formData.resIds +=','+ imgArr[i].resId;
				}
			}
			
			formData.isNew=isNew;
			if(isNew==false){
				formData.goodsId=updateGoodsInfo.goodsId;
			}
			
			
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				dataType:"json",
				data:formData,
				success:function(data){
					
					if(data.resultCode == 1){
						saveGoodsPr(data.goodsId);
						$.messager.alert("提示信息","办理完成","info");
						refresh();
						
						//关闭弹框
						closePage();
					}else {
						$.messager.alert("错误信息","办理失败","error");
					}
				},
				error:function(){
					$.messager.alert("错误","服务器内部错误","error");
				}
			});
		});
	}	
}

/**
 * 将时间格式化
 * dateValue easyui控件得到的时间
 */
function getNeedTime(dateValue){
	dateStr = dateValue.replace(/\//g,"-");
	return dateStr.substring(6,10)+"-"+dateStr.substring(0,5)+dateStr.substring(10);
}

function changWr(){
	
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{shopCode:$('#shopCode').combobox("getValue"),accessId:"61106"},
		success:function(data){
			if(data != null){
				var rows = data.rows;
				
				if(rows != null && rows != '' && rows.length != 0){
					//加载combox数据
					$('#whCode').combobox("loadData", rows);
					$('#whCode').combobox("setValue",rows[0].whCode);
				}else{
					$('#whCode').combobox("loadData", [{whCode:"1",whName:" "}]);
				}
			}else{ 
				$('#whCode').combobox("loadData", [{whCode:" ",whName:" "}]);
			}			
		},
		error:function(){
			$.messager.alert("错误","服务器内部错误","error");
		}
	});	
}


/**
 * 时间格式化
 * @param fmt
 * @returns
 */
Date.prototype.Format = function (fmt) { //author: meizz 
	 var o = {
	     "M+": this.getMonth() + 1, //月份 
		 "d+": this.getDate(), //日 
		 "h+": this.getHours(), //小时 
		 "m+": this.getMinutes(), //分 
		 "s+": this.getSeconds(), //秒 
		 "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		 "S": this.getMilliseconds() //毫秒 
	 };
	 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	 for (var k in o)
		 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	 return fmt;
};
/**
 * 商品添加成功后添加属性
 * @param goodsId
 */
function saveGoodsPr(goodsId){
	//得到商品属性表单数据
	var attributeFormData = $("#goodsAttribute_form").serializeObject();
	
	for(x in attributeFormData){
		item = attributeFormData[x];
		var params = {};
		if(item instanceof Array){	
			params ={attrCode:x,goodsId:goodsId,attrValue:attributeFormData[x].join(','),accessId:"62415"};
		}else{
			params ={attrCode:x,goodsId:goodsId,attrValue:attributeFormData[x],accessId:"62415"};
		}
		
		$.ajax({
			url:basePath + "/dataaccess.json",
			type:"post",
			dataType:"json",
			data:params,
			success:function(data){
						
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误","error");
			}
		});	
	}
}

/**
 * 添加一条属性
 * @param attributeData 属性对象
 */
function addOneAttribute(attributeData,attributeData1){
	var indexId = attributeData.attrCode.replace(".", '');
	
	var newAttributeDiv = '<tr>';
	
	//判断属性  01 唯一属性 02 单选属性  03 多选属性
	if(attributeData.attrType == '01'){
		newAttributeDiv+= '<td style="width: 25%; text-align: right;">'
			+attributeData.attrName
			+'&nbsp;</td><td><input type="text" class="easyui-textbox" id='
			+indexId
			+' name='
			+attributeData.attrCode
			+' style="width:240px;"/></td>';
	}else if(attributeData.attrType == '02'){
		newAttributeDiv +='<td style="width: 25%; text-align: right;">'
			+attributeData.attrName
			+'&nbsp;</td><td><select id='
			+indexId
			+' name='
			+attributeData.attrCode
			+' class="easyui-combobox" data-options="panelHeight'
			+":'auto'"
			+',editable:false,valueField: '
			+"'valueText'"
			+',textField: '
			+"'valueText' "
			+'" value="" style="width:240px;"></select></td>';
	}else if(attributeData.attrType == '03'){
		newAttributeDiv += '<td style="width: 25%; text-align: right;">'
			+attributeData.attrName
			+'&nbsp;</td><td id='
			+indexId
			+'>';	
		var optionsArr = attributeData.options.split(',');
		for(var i = 0; i < optionsArr.length; i++){
			newAttributeDiv += '<input type="checkbox" name='+attributeData.attrCode+' value ="'+optionsArr[i]+'"/>'+optionsArr[i]+'&nbsp;';
		}
		newAttributeDiv += '</td>';
	}
	
	if(attributeData1!=null){
		
		var indexId1 = attributeData1.attrCode.replace(".", '');
		
		if(attributeData1.attrType == '01'){
			newAttributeDiv += '<td style="width: 25%; text-align: right;">'
				+attributeData1.attrName
				+'&nbsp;</td><td ><input type="text" class="easyui-textbox" id='
				+indexId1
				+' name='
				+attributeData1.attrCode
				+' style="width:240px;"/></td>';
		}else if(attributeData1.attrType == '02'){
			newAttributeDiv +='<td style="width: 25%; text-align: right;">'
				+attributeData1.attrName
				+'&nbsp;</td><td ><select id='
				+indexId1
				+' name='
				+attributeData1.attrCode
				+' class="easyui-combobox" data-options="panelHeight'
				+":'auto'"
				+',editable:false,valueField: '
				+"'valueText'"
				+',textField: '
				+"'valueText' "
				+'" value="" style="width:240px;"></select></td>';
		}else if(attributeData1.attrType == '03'){
			newAttributeDiv += '<td style="width: 25%; text-align: right;">'
				+attributeData1.attrName
				+'&nbsp;</td><td  id='
				+indexId1
				+'>';	
			var optionsArr = attributeData1.options.split(',');
			for(var i = 0; i < optionsArr.length; i++){
				newAttributeDiv += '<input type="checkbox" name='+attributeData1.attrCode+' value ="'+optionsArr[i]+'"/>'+optionsArr[i]+'&nbsp;';
			}
			newAttributeDiv += '</td>';
		}
	}
	
	$("#goodsAttribute_table").append(newAttributeDiv+"</tr>");
	//赋值
	if(attributeData.attrType == '01'){
		
		$("#"+indexId).textbox({});
	}else if(attributeData.attrType == '02'){		
		$("#"+indexId).combobox({});
		var optionsArr = attributeData.options.split(',');
		var showArr = [];
		
		for(var i = 0; i < optionsArr.length; i++){
			showArr.push({valueText:optionsArr[i]});
		}
		//加载combox数据
		$("#"+indexId).combobox("loadData", showArr);
		$("#"+indexId).combobox("setValue",showArr[0].valueText);
	}
	

	if(attributeData1!=null){
		var indexId1 = attributeData1.attrCode.replace(".", '');
		
		if(attributeData1.attrType == '01'){
			
			$("#"+indexId1).textbox({});
		}else if(attributeData1.attrType == '02'){		
			$("#"+indexId1).combobox({});
			var optionsArr = attributeData1.options.split(',');
			var showArr = [];
			
			for(var i = 0; i < optionsArr.length; i++){
				showArr.push({valueText:optionsArr[i]});
			}
			//加载combox数据
			$("#"+indexId1).combobox("loadData", showArr);
			$("#"+indexId1).combobox("setValue",showArr[0].valueText);
		}
	}
}

/**
 * 根据商品鉴定图片定义  添加图片容器
 * @param evalPicDef 鉴定图片定义字段值
 */
function addHtmlByEvalPicDef(evalPicDef){
	if(evalPicDef != null && evalPicDef != ''){
		var arr = JSON.parse(evalPicDef);
		if(arr.length != 0){
			for(var i = 0;i < arr.length;i++){
				evalPicDefArr.push(arr[i]);
				addOneImgDiv(arr[i]);
			}
		}
	}
}

/**
 *查看图片 
 */
function lookImg(index){
	
	var aaa=[];
	var url={url:$("#showImg"+index).attr("src")};
	aaa.push(url);
	$("#showPics").picturePreview(aaa,"showPics");
}

/**
 * 添加一个图片容器
 * @param evalPicDefItem 鉴定图片定义中的一项
 */
function addOneImgDiv(evalPicDefItem){
	var requiredFlg = evalPicDefItem.picType;
	console.log(evalPicDefItem);
	if(evalPicDefItem.flat == 1){
		requiredFlg = requiredFlg + '</span><span style="color:red">*';
	}
	var divItem = '<form id="form_addImg'+uploadImgNum+'" style="width:20%;float:left;"  class="easyui-form" enctype="multipart/form-data" method="POST"><div style="width:100%;height:100%;">'
		+'<div style="width:100%;text-align: center;margin-bottom:5px"><span id="evalPicDesc'+uploadImgNum+'">'+requiredFlg+'</span></div>'
		+'<div style="width:70%;height:130px;text-align: center;margin:auto" onclick="lookImg('+uploadImgNum+')">'	
		+'<img id="showImg'+uploadImgNum+'" alt="'+evalPicDefItem.picType+'" src="../busiIdentifyAppraise/images/def.png" style="width:100%;height:100%;margin-bottom:0;padding-bottom:0;">'
		+'</div><div id="evalPicImg'+uploadImgNum+'" style="width:70%;height:30px;margin-top:0;padding-top:10px;text-align: center;margin:auto;background:#ffffff">'
		+'<input type="file" id="picLogo'+uploadImgNum+'" name="uploadFile" onchange="upLoad('+uploadImgNum+')" style="display:none"/><div id="repairButtonDiv'+uploadImgNum+'" style="width:100%;height:100%;display:none">'
		+'<a id="replaceButton" href="javascript:replaceEvalPicDef('+uploadImgNum+')" style="color:black;margin-right:10%">更换图片</a>'
		+'<a id="deleteButton" href="javascript:deleteEvalPicDef('+uploadImgNum+')" style="color:black;">删除图片</a>'
		+'</div><div id="addButtonDiv'+uploadImgNum+'" style="width:100%;height:100%;">'
		+'<a id="upButton" href="javascript:upEvalPicDef('+uploadImgNum+')" style="color:black;">上传图片</a></div></div></div></form>';
		
	$("#evalPicDefDiv").append(divItem);
	uploadImgNum++;
}

/***
 * 上传图片
 */
function upLoad(index){
	//得到表单数据
	var formData = $("#form_addImg"+index).serializeObject();

	$("#form_addImg"+index).form("submit", {
		url:basePath + "/businesslogic_upload.json",
		type:"post",
		onSubmit:function(formData){
			formData.infoType = infoType;
			formData.typeId = typeId;
			formData.resDesc = $("#evalPicDesc"+index).text();
			formData.replace = replace;
			formData.resId = resId;
			formData.logicId = "06.02.05.02";
		},
		success:function(data){
			var data1 = JSON.parse(data);
			
			if(data1.resultCode == 1){
				if(replace == 'add'){
					imgArr.push(data1.resPo);
					$("#repairButtonDiv"+index).show();
					$("#addButtonDiv"+index).hide();
					$("#showImg"+index).attr({"src":basePath+'/gmodule_resmanage_filedown.json?id='+data1.resPo.resId+ "&t=" + new Date().valueOf()});
				}else if(replace == 'replace'){
					//循环查找替换已经存在的图片资源
//					for(var i = 0; i < imgArr.length; i++){
//						if(imgArr[i].resId == resId){
//							imgArr.splice(i, 1);
//							imgArr.push(data1.resPo);
//						}
//					}
					$("#showImg"+index).attr({"src":basePath+'/gmodule_resmanage_filedown.json?id='+resId+"&t=" + new Date().valueOf()});
				}else if(replace == 'delete'){
					
				}
				
			}else{
				$.messager.alert("错误信息","保存失败,请重试或联系管理员","error");
			}
		},
		error:function(){
			$.messager.alert("错误","服务器内部错误","error");
		}
		});
}

/**
 * 点击上传图片
 * @param index 图片位置
 */
function upEvalPicDef(index){
	resId = "";
	replace =  "add";
	$("#picLogo"+index).click();
}

/**
 * 点击删除图片
 * @param index 图片位置
 */
function deleteEvalPicDef(index){
	for(var i = 0; i < imgArr.length; i++){
		if(imgArr[i].resDesc == $("#evalPicDesc"+index).text()){
			resId = imgArr[i].resId;
			imgArr.splice(i, 1);
		}
	}
	replace = "delete";
	$("#repairButtonDiv"+index).hide();
	$("#addButtonDiv"+index).show();
	$("#showImg"+index).attr({"src":"../busiIdentifyAppraise/images/def.png"});
}

/**
 * 点击更换图片
 * @param index 图片位置
 */
function replaceEvalPicDef(index){
	for(var i = 0; i < imgArr.length; i++){
		if(imgArr[i].resDesc == $("#evalPicDesc"+index).text()){
			resId = imgArr[i].resId;
		}
	}
	replace = "replace";
	$("#picLogo"+index).click();
}

/**
 * 点击上一步
 * @param index 当前步骤数
 */
function backPage(index){
	if(index == 2){
		imgArr = [];
		$("#addDivPageStacker").pageStacker("openPage","#addOne");
		$("#two").removeClass("complete-bg");
		$("#two").addClass("uncomplete-bg");
		
		//步骤图片中间连线样式
		$("#first_line").removeClass("line-bg1");
		$("#first_line").addClass("line-bg");
		
		$("#goodsBrand").combobox("clear");
		if(isNew==true){
			$("#goodsCat_form").form("reset");
		}
		
	}else if(index == 3){
		$("#addDivPageStacker").pageStacker("openPage","#addTwo");
		$("#three").removeClass("complete-bg");
		$("#three").addClass("uncomplete-bg");
	}else if(index == 4){
		$("#addDivPageStacker").pageStacker("openPage","#addThree");
		$("#four").removeClass("complete-bg");
		$("#four").addClass("uncomplete-bg");
	}
}

/**
 * 得到分类的级次数据格式化
 */
function getShowClassStr(){
	if(findSelectText('1') == ''){
		return '';
	}else if(findSelectText('2') == ''){
		subCode = $("#1_select_1").val();
		return findSelectText('1');
	}else if(findSelectText('3') == ''){
		subCode = $("#1_select_2").val();
		return findSelectText('1')+'>'+findSelectText('2');
	}else{
		subCode = $("#1_select_3").val();
		return findSelectText('1')+'>'+findSelectText('2')+'>'+findSelectText('3');
	}
	return '';
}

/**
 * 找到选中的文本
 * @param type 分类标准 1 一级  2二级 3 三级
 */
function findSelectText(type){
	if(type == '1'){
		return $("#1_select_1").children('[value="'+$("#1_select_1").val()+'"]').text();
	}else if(type == '2'){
		return $("#1_select_2").children('[value="'+$("#1_select_2").val()+'"]').text();
	}else if(type == '3'){
		return $("#1_select_3").children('[value="'+$("#1_select_3").val()+'"]').text();
	}
	return '';
}

/**
 * 三各分类的onchange事件
 * @param type 分类标准 1 一级  2二级 3 三级
 * @param pCatCode 选中的商品编号
 */
function selectClass(type,pCatCode){
	$("#evalPicDefDiv").html('');
	if(type == '1' || type == '2'){
		getTwoClass(pCatCode,type);
	}else if(type == '3'){
		$("#showAllCatName").html(getShowClassStr());
	}
}

/**
 * 通过已经分类编号得到二级分类
 * @param supCatCode 选中的一级分类编号
 * @param type 分类标准 1 一级  2二级 3 三级
 */
function getTwoClass(supCatCode,type){
	//显示目前选择级别控件
	if(type == '1'){
		$("#1_select_3").html("");
		$("#1_select_2").html("");
	}else if(type == '2'){
		$("#1_select_3").html("");
	}
	getTwoClassification(supCatCode,
			function(data){
				if(data != null){
					var rows = data.rows;
					if(rows != null && rows != '' && rows.length != 0){
						if(type == '1'){
							if($("#1_select_1").val() == supCatCode){
								$("#1_select_2").html(getSelectHtml(rows,"shop"));
//								subCode = $("#1_select_2").val();
								getTwoClass($("#1_select_2").val(),'2');
							}
						}else if(type == '2'){
							if($("#1_select_2").val() == supCatCode){
								$("#1_select_3").html(getSelectHtml(rows,"shop"));
							}
//							subCode = $("#1_select_3").val();
						}
					}
					$("#showAllCatName").html(getShowClassStr());
				}		
			},
			function(error){
				$("#showAllCatName").html(getShowClassStr());
				$.messager.alert("错误","服务器内部错误","error");
			});
}

/**
 * 通过数据得到select选项html
 * @param rows 子项数据集合
 * @param type 类型  商品分类shop 商品品牌brand
 * @returns {String}
 */
function getSelectHtml(rows,type){
	//拼接select下选项的字符串
	var html = "";
	if(type == "shop"){
		for (var i = 0; i < rows.length; i++) {
			if(i == 0){
				html += "<option value=\""+rows[i].catCode+"\"  style=\"height:20px;padding:6px 0 0 8px;\" selected='selected'>"+rows[i].catName+"</option>";
			}else{
				html += "<option value=\""+rows[i].catCode+"\"  style=\"height:20px;padding:6px 0 0 8px;\">"+rows[i].catName+"</option>";
			}
		}
	}else if(type == "brand"){
		for (var i = 0; i < rows.length; i++) {
			if(i == 0){
				html += "<option value='"+rows[i].brandCode+"' selected='selected'>"+rows[i].brandName+"</option>";
			}else{
				html += "<option value='"+rows[i].brandCode+"'>"+rows[i].brandName+"</option>";
			}
		}
	}
	
	return html;
}

/**
 * 输入校验，新增时输入的商品名称是否存在
 */
function goodsValid(){	
	$("#goodsName").textbox({
		required: true,
		missingMessage:"商品名称不能为空",
		invalidMessage:"商品名称已经存在",
		validType:"remoteValid['" + basePath + "/businesslogic.json', 'goodsName', {logicId: '06.02.05.06',detailCatCode:'"+catCode+"',isNew:"+isNew+",'goodsId':"+updateGoodsInfo.goodsId+"}]"
	});
	$("#goodsName").textbox("enableValidation");
	$("#firstPrice").textbox({required:true,missingMessage:"客户购买价不能为空"});
	$("#sourceType").textbox({
		required: true,
		missingMessage:"该项不能为空",
	});
}


/**
 *商品修改完善 
 */
function perfectOprate(row){
	
	isNew=false;
	updateGoodsInfo=row;
	$("#nextStepStraight").show();
	$("#goodsCatDescSpan").text("(原分类:"+classifyFormatter(updateGoodsInfo.goodsCatRoute)+")您将修改该商品类型为:");
	$("#mainDivPageStacker").pageStacker("openPage","#addPage");
	$("#addDivPageStacker").pageStacker("openPage","#addOne");
	getClassification();
	
	//基本信息回显
	$("#goodsName").textbox("setValue",row.goodsName);
	$("#goodsBrand").combobox("select",row.goodsBrand);
	$("#articleNumber").textbox("setValue",row.articleNumber);
	$("#firstPrice").textbox("setValue",row.firstPrice);
	$("#goodsDesc").textbox("setValue",row.goodsDesc);
	
	//租售信息
	if(row.isRentable==1){
		$("#isRentable").prop("checked",true);
	}
	
	if(row.isSalable==1){
		$("#isSalable").prop("checked",true);
	}
	
	
	if(row.sourceType=="01" || row.sourceType=="05"){//收货或租赁收回
		//显示可租可售复选框
		$("#rentOrSaleSpan").show();
		$("#isRentableSpan").show();
		$("#isSalableSpan").show();
	}else if(row.sourceType=="02" || row.sourceType=="04"){//典当或保养
		//隐藏可租可售复选框
		$("#rentOrSaleSpan").hide();
		$("#isRentableSpan").hide();
		$("#isSalableSpan").hide();
	}else if(row.sourceType=="03"){//寄卖
		//显示可售复选框，隐藏可租复选框
		$("#rentOrSaleSpan").show();
		$("#isRentableSpan").hide();
		$("#isSalableSpan").show();
	}
	
	
}

/**
 * 
 *不修改商品分类直接到下一步
 */
function nextStepStraight(){
	//设定不修改商品分类
	isUpdateGoodscat=false;
	
	//转跳到下一步
	stepToGoodsInfo(updateGoodsInfo.catCode);
	toNextPageAfterCat();
	
	$("#goodsClass").text(classifyFormatter(updateGoodsInfo.goodsCatRoute));
}

/**
 *点击下一步，转跳至填写商品信息界面
 *@param goodsCatCode 商品品牌
 */
function stepToGoodsInfo(goodsCatCode){
	
	//判断是否修改商品分类，确定相应的鉴定图定义
	
	if(isUpdateGoodscat==false){
		
		//不修改商品分类则取原有分类  （判断商品属于几级分类）
		if(updateGoodsInfo.detailCatCode!=null && updateGoodsInfo.detailCatCode!="" && updateGoodsInfo.detailCatCode!=undefined){
			catCode=updateGoodsInfo.detailCatCode;
		}else{
			if(updateGoodsInfo.subCatCode!=null && updateGoodsInfo.subCatCode!="" && updateGoodsInfo.subCatCode!=undefined){
				catCode=updateGoodsInfo.subCatCode;
			}else{
				if(updateGoodsInfo.catCode!=null && updateGoodsInfo.catCode!="" && updateGoodsInfo.catCode!=undefined){
					catCode=updateGoodsInfo.catCode;
				}
			}
		}
	}else{
		//若修改商品分类，则取页面值
		catCode=subCode;
	}
	
	goodsValid();
	$("#addDivPageStacker").pageStacker("openPage","#addTwo");
	
	$("#two").removeClass("uncomplete-bg");
	$("#two").addClass("complete-bg");
	

	$("#first_line").addClass("line-bg1");
	$("#first_line").removeClass("line-bg");
	
	$("#goodsClass").text(getShowClassStr());

	
	//构造商品品牌下拉
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{catCode:goodsCatCode,accessId:"62309"},
		success:function(data){
			if(data != null){
				var rows = data.rows;
				$('#goodsBrand').combobox("loadData", rows);
			}	
			
			if(isNew==false){
				$('#goodsBrand').combobox("setValue", updateGoodsInfo.brandCode);
			}
		},
		error:function(){
			$.messager.alert("错误","服务器内部错误","error");
		}
	});	
	
	
	
	if(isNew==false){
		$("#sourceType").combobox("select",updateGoodsInfo.sourceType);
	}
	
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		data:{shopStat:"01",accessId:"61102"},
		success:function(data){
			if(data != null){
				var rows = data.rows;
				if(rows != null && rows != '' && rows.length != 0){
					$('#shopCode').combobox("loadData", rows);
					$('#shopCode').combobox({  
					    onChange:function(newValue,oldValue){  
					    	changWr();
					    }  
					});
					$('#shopCode').combobox("setValue",rows[0].shopCode);
//					changWr();
				}
			}			
		},
		error:function(){
			$.messager.alert("错误","服务器内部错误","error");
		}
	});	

}

/**
 * 跳转至商品属性页面
 * @param goodsCatCode 商品品牌
 */
function stepToGoodsAttr(goodsCatCode){

	//if($("#goodsCat_form").form("validate")){
		//$("#addDivPageStacker").pageStacker("openPage","#addThree");
		
		//$("#three").removeClass("uncomplete-bg");
		//$("#three").addClass("complete-bg");
		$.ajax({
			url:basePath + "/dataaccess.json",
			type:"post",
			dataType:"json",
			async:false,
			data:{catCode:goodsCatCode,accessId:"62414"},
			success:function(data){
				if(data != null){
					
					var rows = data.rows;
					if(rows != null && rows != '' && rows.length != 0){
						$("#goodsAttribute_table").html('');
						for(var i = 0; i < rows.length; i++){
							for(var i = 0; i < rows.length; i++){
								if(typeof(rows[i+1])!="undefined"){
									addOneAttribute(rows[i],rows[i+1]);
									i=i+1;
								}else{
									addOneAttribute(rows[i],null);
								}
							}
						}
						if(isNew==false){
							//属性回显
							var getGoodsAttrParams={};
							getGoodsAttrParams.accessId="62504";
							getGoodsAttrParams.goodsId=updateGoodsInfo.goodsId;
							
							$.ajax({
								url:basePath+"/dataaccess.json",
								data:getGoodsAttrParams,
								method:"post",
								success:function(data){
									//基本属性回显
									var formdata={};
									for(var k=0;k<data.rows.length;k++){
										formdata[data.rows[k].attrCode]=data.rows[k].attrValue;
									
									}
									$("#goodsAttribute_form").form("load",formdata);
									
									//勾选复选框
									for(var k=0;k<data.rows.length;k++){
										formdata[data.rows[k].attrCode]=data.rows[k].attrValue;
										
										for(var o=0;o<data.rows[k].attrValue.split(",").length;o++){
											
											$("input[type='checkbox'][name='"+data.rows[k].attrCode+"'][value='"+data.rows[k].attrValue.split(",")[o]+"']").prop("checked",true);
										}
									
									}
									
								}
							});
						}
					}else{
						$("#noAttrTip").html("<span style='font-size:20px'>该类商品无需填写属性</span>");
					}
				}			
			},
			error:function(){
				$.messager.alert("错误","服务器内部错误","error");
			}
		});
	//}	
}

//启动流程
function perfectGoodsInfo(addGoodsInfo){ 
	
	addGoodsInfo.processId = _procDefId;
	addGoodsInfo.logicId = '03.03.01';

	//获取开始节点formKey值

	$.messager.confirm("确认", "是否开启流程，进入后续处理？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:addGoodsInfo,
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

/**
 * 列表商品分类字段格式化
 *  @param value  格式化值
 *  @param row	对应行	
 *  @param index 	对应行下标
 */
function classifyFormatter(value,row,index){
	if(value.substring(value.length-1) == ">"){
		value = value.substring(0,value.length-2);
		if(value.substring(value.length-1) == ">"){
			value = value.substring(0,value.length-2);
		}
	}
	return value;
}

/**
 *保存商品信息（不开启流程） 
 */
function saveGoodsInfo(){
	
	$.messager.confirm("确认信息","是否保存商品信息(暂不完成办理)?",function(r){
		if(r){
			//得到商品信息表单数据
			var formData = $("#goodsCat_form").serializeObject();
			
			//判断新增或修改
			if(isNew==true){
				formData.catCode = $("#1_select_1").val();
				formData.subCatCode = $("#1_select_2").val();
				formData.detailCatCode = $("#1_select_3").val();
			}else{
				
				//判断是否修改商品品牌
				if(isUpdateGoodscat==false){
					formData.catCode=updateGoodsInfo.catCode;
					formData.subCatCode = updateGoodsInfo.subCatCode;
					formData.detailCatCode = updateGoodsInfo.detailCatCode;
				}else{
					formData.catCode = $("#1_select_1").val();
					formData.subCatCode = $("#1_select_2").val();
					formData.detailCatCode = $("#1_select_3").val();
				}
			}
			
			
			//创建信息
			formData.isNew=isNew;
			formData.createBy = user.userId;
			formData.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
			
			//修改信息
			formData.modifyBy = user.userId;
			formData.modifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
			formData.goodsStat = "19";
			formData.logicId = "06.02.05.05";
			
			for(var i = 0; i < evalPicDefArr.length;i++){
				
				if(evalPicDefArr[i].flat == 1){
					if(imgArr.length == 0){
						$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
						return;
					}
					for(var j = 0; j < imgArr.length;j++){
						if(imgArr[j].resDesc == evalPicDefArr[i].picType){
							break;
						}else if(j == imgArr.length - 1 && imgArr[j].resDesc != evalPicDefArr[i].picType){
							$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
							return;
						}
					}
				}
			}
			
			formData.resIds ='';
			for(var i = 0; i < imgArr.length;i++){
				if(i == 0){
					formData.resIds = imgArr[i].resId;
				}else{
					formData.resIds +=','+ imgArr[i].resId;
				}
			}
			
			if(updateGoodsInfo!=null){
				formData.goodsId=updateGoodsInfo.goodsId;
			}
			
			//租售信息 (根据商品来源)
			if(formData.sourceType=="01" || formData.sourceType=="05"){
				//收货、租赁收回均启用
				if($("#isRentable").prop("checked")==true){
					formData.isRentable=1;
				}else{
					formData.isRentable=0;
				}
				
				if($("#isSalable").prop("checked")==true){
					formData.isSalable=1;
				}else{
					formData.isSalable=0;
				}
			}else if(formData.sourceType=="02" || formData.sourceType=="04"){
				//典当、保养均禁用
				formData.isSalable=0;
				formData.isRentable=0;
			}else if(formData.sourceType=="03"){
				//寄卖可售启用，可租禁用
				formData.isRentable=0;
				
				if($("#isSalable").prop("checked")==true){
					formData.isSalable=1;
				}else{
					formData.isSalable=0;
				}
			}
			
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:formData,
				async:false,
				success:function(data){
					if(data.resultCode==1){
						
						saveGoodsPr(data.goodsId);
						//成功
						refresh();
						$.messager.alert("提示信息","商品信息保存成功","info");
					}else{
						//失败
						$.messager.alert("错误信息","商品信息保存失败","error");
					}
				}
			});
		}
	});
	
	
}

function loadALlSelect(){
	
}



//启动流程
function startProcess(){
	//得到商品信息表单数据
	var formData = $("#goodsCat_form").serializeObject();
	
	//判断新增或修改
	if(isNew==true){
		formData.catCode = $("#1_select_1").val();
		formData.subCatCode = $("#1_select_2").val();
		formData.detailCatCode = $("#1_select_3").val();
	}else{
		//判断是否修改商品品牌
		if(isUpdateGoodscat==false){
			formData.catCode=isUpdateGoodscat.catCode;
			formData.subCatCode = isUpdateGoodscat.subCatCode;
			formData.detailCatCode = isUpdateGoodscat.detailCatCode;
		}else{
			formData.catCode = $("#1_select_1").val();
			formData.subCatCode = $("#1_select_2").val();
			formData.detailCatCode = $("#1_select_3").val();
		}
	}
	
	
	//创建信息
	formData.createBy = user.userId;
	formData.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
	
	//修改信息
	formData.modifyBy = user.userId;
	formData.modifyTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
	formData.goodsStat = "01";
	//formData.logicId = "";
	
	for(var i = 0; i < evalPicDefArr.length;i++){
		
		if(evalPicDefArr[i].flat == 1){
			if(imgArr.length == 0){
				$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
				return;
			}
			for(var j = 0; j < imgArr.length;j++){
				if(imgArr[j].resDesc == evalPicDefArr[i].picType){
					break;
				}else if(j == imgArr.length - 1 && imgArr[j].resDesc != evalPicDefArr[i].picType){
					$.messager.alert("提示信息",evalPicDefArr[i].picType+"图片必须上传，请上传了在提交！","info");
					return;
				}
			}
		}
	}
	formData.resIds ='';
	for(var i = 0; i < imgArr.length;i++){
		if(i == 0){
			formData.resIds = imgArr[i].resId;
		}else{
			formData.resIds +=','+ imgArr[i].resId;
		}
	}
	
	formData.isNew=isNew;
	if(isNew==false){
		formData.goodsId=updateGoodsInfo.goodsId;
	}
	
	//租售信息 (根据商品来源)
	if(formData.sourceType=="01" || formData.sourceType=="05"){
		//收货、租赁收回均启用
		if($("#isRentable").prop("checked")==true){
			formData.isRentable=1;
		}else{
			formData.isRentable=0;
		}
		
		if($("#isSalable").prop("checked")==true){
			formData.isSalable=1;
		}else{
			formData.isSalable=0;
		}
	}else if(formData.sourceType=="02" || formData.sourceType=="04"){
		//典当、保养均禁用
		formData.isSalable=0;
		formData.isRentable=0;
	}else if(formData.sourceType=="03"){
		//寄卖可售启用，可租禁用
		formData.isRentable=0;
		
		if($("#isSalable").prop("checked")==true){
			formData.isSalable=1;
		}else{
			formData.isSalable=0;
		}
	}
	
	
	var addGoodsInfo=formData;
	
	addGoodsInfo.taskId = _procDefId;
	addGoodsInfo.logicId = '03.03.01';

	//获取开始节点formKey值

	$.messager.confirm("确认", "是否开启流程，进入后续处理？", function(r){
		if(r){
			$.ajax({
				url:basePath + "/businesslogic.json",
				type:"post",
				data:addGoodsInfo,
				async:false,
				success:function(data){
					if(data.resultCode==1){
						
						//成功
						
						cancelStartProcess();
						$.messager.alert("提示信息","流程开启成功","info");
						saveGoodsPr(addGoodsInfo.goodsId);
					}else{
						//失败
						$.messager.alert("错误信息","流程开启失败","error");
					}
				}
			});
		};
	});
}


/**
 * 选择分类后下一步
 */
function toNextPageAfterCat(){
	//打开面板
	$("#addTwoPanel").panel("open",false);
	
	//panel resize
	$("#addTwoPanel").panel("resize",{
		width:"99%",
		height:"auto"
	});
	
	//打开面板
	$("#addThreePanel").panel("open",false);
	
	//panel resize
	$("#addThreePanel").panel("resize",{
		width:"99%",
		height:"auto"
	});
	
	
	//打开面板
	$("#addFourPanel").panel("open",false);
	
	//panel resize
	$("#addFourPanel").panel("resize",{
		width:"99%",
		height:"auto"
	});
	
	
	//加载商品属性
	if(isUpdateGoodscat==false){
		stepToGoodsAttr(updateGoodsInfo.catCode);
	}else{
		stepToGoodsAttr($("#1_select_1").val());
	}
	
	//根据分类加载商品图片
	$("#evalPicDefDiv").html("");
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		dataType:"json",
		async:false,
		data:{catCode:catCode,accessId:"62106"},
		success:function(data){
			console.log(data+"11");
			if(data != null && data != ''){
				if(data.evalPicDef!="[]" && data.evalPicDef!=""){
					addHtmlByEvalPicDef(data.evalPicDef);
				}else{
					$("#evalPicDefDiv").html("<span style='font-size:20px'>该类商品无需上传图片</span>");
				}
			}			
		},
		error:function(){
			$.messager.alert("错误","保存过程中发生错误，请重试或联系管理员","error");
		}
	});	
	
	if(isNew==false){
		//商品图图片回显
		var getImageParams={};
		getImageParams.accessId="62505";
		getImageParams.goodsId=updateGoodsInfo.goodsId;
		getImageParams.infoType="1004";
		
		//设置商品分类参数  （判断商品属于几级分类）
		if(updateGoodsInfo.detailCatCode!=null && updateGoodsInfo.detailCatCode!="" && updateGoodsInfo.detailCatCode!=undefined){
			getImageParams.catCode=updateGoodsInfo.detailCatCode;
		}else{
			if(updateGoodsInfo.subCatCode!=null && updateGoodsInfo.subCatCode!="" && updateGoodsInfo.subCatCode!=undefined){
				getImageParams.catCode=updateGoodsInfo.subCatCode;
			}else{
				if(updateGoodsInfo.catCode!=null && updateGoodsInfo.catCode!="" && updateGoodsInfo.catCode!=undefined){
					getImageParams.catCode=updateGoodsInfo.catCode;
				}
			}
		}
		
		//回显商品图片
		$.ajax({
			url:basePath+"/dataaccess.json",
			data:getImageParams,
			method:"post",
			async:false,
			success:function(data){
				
				for(var i=0;i<data.rows.length;i++){
					var picType="";
					var evalPicDef=JSON.parse(data.rows[i].evalPicDef);
					
					//图片信息全局变量赋值
					imgArr.push(data.rows[i]);
					
					for(var m=0;m<evalPicDef.length;m++){
						if(data.rows[i].resDesc.indexOf(evalPicDef[m].picType)!=-1){
							picType=evalPicDef[m].picType;
						}
					}
					
					$("form[id^='form_addImg'] img[alt='"+picType+"']").attr("src",basePath+"/gmodule_resmanage_filedown.json?id="+data.rows[i].resId);
					
					var imgList=$("form[id^='form_addImg'] img[src^='"+basePath+"/gmodule_resmanage_filedown.json?id=']");
					var indexList=[];
					if(imgList!=0){
						for(var l=0;l<imgList.length;l++){
							indexList.push($(imgList[l]).attr("id").charAt($(imgList[l]).attr("id").length-1));
						}
						
						for(var l=0;l<indexList.length;l++){
							$("#repairButtonDiv"+indexList[l]).show();
							$("#addButtonDiv"+indexList[l]).hide();
						}
					}
				}
			}
		});
	}
}