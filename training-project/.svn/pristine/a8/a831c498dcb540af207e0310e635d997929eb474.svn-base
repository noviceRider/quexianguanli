//form表单弹窗属性
var options={
	width:800,
	height:600,
	title:'商品评估'
};
var newGoodsId = "";
var goodsInfoOld;

//初始化页面
function initPage(){
	//从任务信息中取出业务主键作为商品id，查询商品信息
	var rentId = _taskData.businessKey;
	var goodsId = "";
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			goodsId = data.goodsInfo.goodsId;
			goodsInfoOld = data.goodsInfo;
		}
	});
	
	//从流程中查询新商品的id
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"03.02.07",taskId:_taskData.id,varName:'newGoodsId'},
		success:function(data){
			newGoodsId = data.newGoodsId;
		}
	});
	
	//通过业务主键查询商品信息
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data:{goodsId:goodsId,accessId:'62510'},
		async:false,
		success:function(data){
			//获取鉴定信息
			var getIdentifyItemParams={};
			getIdentifyItemParams.accessId="63104";
			getIdentifyItemParams.goodsId=newGoodsId;
			$.ajax({
				url:basePath+"/dataaccess.json",
				data:getIdentifyItemParams,
				method:"post",
				success:function(data){
					var result="";
					if(data.goodsQuality=="01"){
						result="全新";
					}else if(data.goodsQuality=="02"){
						result="9成";
					}else if(data.goodsQuality=="03"){
						result="8成";
					}
					else if(data.goodsQuality=="04"){
						result="7成";
					}else if(data.goodsQuality=="05"){
						result="6成";
					}
					
					$("#oldOrNewPP").text(result);
					
					$("#identifyDescPP").text(data.identifyDesc);
				}
			});
			
			//获取历史评估记录条数
			var getHistoryAssessCountParams={};
			getHistoryAssessCountParams.goodsId=newGoodsId;
			getHistoryAssessCountParams.accessId="63106";
			
			$.ajax({
				url:basePath+"/dataaccess.json",
				method:"post",
				data:getHistoryAssessCountParams,
				success:function(data){
					$("#historyAssessCount").text(data.rows.length);
				}
			});
			
			showGoodsDetail(data);
			assessValidate();
		}
	});
};
	
/**
 *确认评估 
 */
function doAssess(){
	var zhejiufei = "";
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			var assessParams=$("#assessForm").serializeObject();
			assessParams.goodsId=newGoodsId;
			assessParams.createBy=data.user.userId;
			assessParams.modifyBy=data.user.userId;
			assessParams.assessor=data.user.userId;
			assessParams.goodsStat="20";
			assessParams.logicId="03.03.03";
			assessParams.taskId=_taskData.id;
			$.ajax({
				url:basePath+"/businesslogic.json",
				data:assessParams,
				method:"post",
				success:function(data1){
					if(data1.resultCode==1){
						//评估完成之后。新商品信息中存在评估价值，计算折旧费
						$.ajax({
							url:basePath + "/dataaccess.json",
							type:"post",
							async:false,
							data:{accessId:"62510",goodsId:newGoodsId},
							success:function(data){
								zhejiufei = goodsInfoOld.valuationPrice-data.valuationPrice;
							}
						});
						
						//评估完成，设置商品为可租,记录折旧费
						$.ajax({
							url:basePath+"/businesslogic.json",
							method:"post",
							data:{isRentable:'1',goodsId:newGoodsId,rentId:_taskData.businessKey,zhejiufei:zhejiufei,logicId:'03.05.10'},
							success:function(data){
								$.messager.alert("信息提示","操作成功","info");
								refresh();
							}
						});
					}else{
						$.messager.alert("错误提示","操作失败，请重试或联系系统管理员","error");
					}
				}
			});
		}
	});
}

/**
 *显示商品详细信息 
 */
function showGoodsDetail(row){
	//基本信息回显
	$("#goodsIdP").text(row.goodsId);
	$("#shopCodeP").text(row.shopCode);
	$("#inputUserP").text(row.inputUser);
	$("#catCodeP").text(row.goodsCatRoute);
	$("#goodsNameP").text(row.goodsName);
	$("#firstPriceP").text(row.firstPrice);
	$("#goodsDescP").text(row.goodsDesc);
	$("#goodsBrandP").text(row.goodsBrand);
	$("#articleNumberP").text(row.articleNumber);
	$("#inputDateP").text(row.inputDate);
	
	//查询并回显商品属性
	var getGoodsAttrParams={};
	getGoodsAttrParams.accessId="62504";
	getGoodsAttrParams.goodsId=row.goodsId;
	
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:getGoodsAttrParams,
		method:"post",
		success:function(data){
			//显示商品属性信息
			var goodsAttr={};
			for(var i=0;i<data.rows.length;i++){
				if(data.rows[i].attrName=='产地'){
					goodsAttr.modePlace = data.rows[i].attrValue;
				}else if(data.rows[i].attrName=='年代'){
					goodsAttr.nianDai = data.rows[i].attrValue;
				}else if(data.rows[i].attrName=='适用人群'){
					goodsAttr.fitPeople = data.rows[i].attrValue;
				}else if(data.rows[i].attrName=='颜色'){
					goodsAttr.color = data.rows[i].attrValue;
				}else if(data.rows[i].attrName=='材质'){
					goodsAttr.caiZi = data.rows[i].attrValue;
				}else if(data.rows[i].attrName=='重量'){
					goodsAttr.weight = data.rows[i].attrValue;
				}
			}
			Common.loadDataForDOM(goodsAttr,'#goodsAttrDiv','p','name');
		}
	});
	
	//查询商品鉴定图片
	var getImageParams={};
	getImageParams.accessId="62505";
	getImageParams.goodsId=row.goodsId;
	getImageParams.infoType="1004";
	
	//设置商品分类参数  （判断商品属于几级分类）
	if(row.detailCatCode!=null && row.detailCatCode!="" && row.detailCatCode!=undefined){
		getImageParams.catCode=row.detailCatCode;
	}else{
		if(row.subCatCode!=null && row.subCatCode!="" && row.subCatCode!=undefined){
			getImageParams.catCode=row.subCatCode;
		}else{
			if(row.catCode!=null && row.catCode!="" && row.catCode!=undefined){
				getImageParams.catCode=row.catCode;
			}
		}
	}
	
	//回显商品图片
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:getImageParams,
		method:"post",
		success:function(data){
			
			var ImageStr="";
			var picDesc="";
			for(var i=0;i<data.rows.length;i++){
				if(data.rows[i].evalPicDef!=null && data.rows[i].evalPicDef!='' && data.rows[i].evalPicDef!=undefined){
					var evalPicDef=JSON.parse(data.rows[i].evalPicDef);
					
					for(var j=0;j<evalPicDef.length;j++){
						if(data.rows[i].resDesc.indexOf(evalPicDef[j].picType)!=-1){
							picDesc=evalPicDef[j].picType;
						}
					}
				}

				ImageStr+="<div style='height:151px;width:20%;display:inline-block;margin-right:15px'><span style='display:block;text-align:center;height:30px;width:100%;'>"+picDesc+"</span><img style='height:130px;width:100%;margin-right:15px' src='http://localhost:8080/pcms/gmodule_resmanage_filedown.json?id="+data.rows[i].resId+"'></div>";
			}
			
			$("#goodsImages").html(ImageStr);
		}
	});
	
	getImageParams.goodsId = newGoodsId;
	
	//回显新商品图片
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:getImageParams,
		method:"post",
		success:function(data){
			
			var ImageStr="";
			var picDesc="";
			for(var i=0;i<data.rows.length;i++){
				if(data.rows[i].evalPicDef!=null && data.rows[i].evalPicDef!='' && data.rows[i].evalPicDef!=undefined){
					var evalPicDef=JSON.parse(data.rows[i].evalPicDef);
					
					for(var j=0;j<evalPicDef.length;j++){
						if(data.rows[i].resDesc.indexOf(evalPicDef[j].picType)!=-1){
							picDesc=evalPicDef[j].picType;
						}
					}
				}

				ImageStr+="<div style='height:151px;width:20%;display:inline-block;margin-right:15px'><span style='display:block;text-align:center;height:30px;width:100%;'>"+picDesc+"</span><img style='height:130px;width:100%;margin-right:15px' src='http://localhost:8080/pcms/gmodule_resmanage_filedown.json?id="+data.rows[i].resId+"'></div>";
			}
			
			$("#newGoodsImages").html(ImageStr);
		}
	});
	
	//新旧程度下拉列表
	oldOrNewSelect();
	
	//获取历史鉴定记录条数
	var getIdentifyHistoryParams={};
	getIdentifyHistoryParams.goodsId=newGoodsId;
	getIdentifyHistoryParams.accessId="63103";
	$.ajax({
		url:basePath+"/dataaccess.json",
		data:getIdentifyHistoryParams,
		method:"post",
		success:function(data){
			$("#historyIdentifyCount").text(data.rows.length);
			$("#historyIdentifyCountPP").text(data.rows.length);
		}
	});
}

/**
 *新旧程度下拉列表 
 */
function oldOrNewSelect(){
	var getDataParams={};
	getDataParams.typeCode="PC_GOODS_QUALITY";
	getDataParams.accessId="3301";
	$.ajax({
		url:basePath+"/dataaccess.json",
		method:"post",
		data:getDataParams,
		success:function(data){
			$("#oldOrNewSelect").combobox({
				data:data.rows,
				panelHeight:"auto",
				width:"100px",
				valueField:"dictCode",
				textField:"dictDesc",
				ayscn:false,
				loadFilter:function(data1){
					var aftetFilt=[{dictDesc:"新旧程度",dictCode:""}];
					
					for(var i=0;i<data1.length;i++){
						aftetFilt.push(data1[i]);
					}
					
					return aftetFilt;
				}
			});
		}
	});
}

/**
 *评估验证 
 */
function assessValidate(){
	$("#valuationPrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
	$("#officialPrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
	$("#pawnPrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
	$("#rchasePrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
	$("#sellingPrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
	$("#rentalPrice").textbox({
		required: true,
		missingMessage:"分类名称不能为空",
		invalidMessage:"请填写小于4位小数的数字",
		validType:"number"
	});
	
}
/**
 *点击查看历史鉴定记录 
 */
function queryHistoryIdentify(){
	$("#historyIdentifyDig").dialog({
		title:"历史鉴定记录",
		width:"auto",
		height:"auto",
		modal:true,
	}).dialog("open");
	
	var getIdentifyHistoryParams={};
	getIdentifyHistoryParams.goodsId=newGoodsId;
	getIdentifyHistoryParams.accessId="63103";
	$("#historyIdentifyTable").datagrid({
		url:basePath + "/dataaccess.json",
		queryParams:getIdentifyHistoryParams, 
		method:"post",
		fitColumns:true,
		pagination:true, 
		selectOnCheck:false,
		singleSelect:true,
		pageSize: "10",
		columns:[[
		         {field:'identifyId',title:'序号',width:'8%'},
		         {field:'goodsId',title:'商品编号',width:'12%',sortable:true,alias:'goods_Id',halign:'center',align:'right'},
		         {field:'goodsQuality',title:'新旧程度',width:"19%",halign:'center',align:'left',formatter:goodsQualityFormatter},
		         {field:'identifyResult',title:'鉴定结果',width:"19%",halign:'center',align:'left',formatter:identifyResultFormatter},
		         {field:'createBy',title:'鉴定人',width:'13%',sortable:true,alias:'create_By',halign:'center',align:'left'},
		         {field:'createTime',title:'录入时间',width:'25%',sortable:true,alias:'creat_time',halign:'center',align:'left'}
		     ]]
	});
}
/**
 *点击查看历史鉴定记录 
 */
function queryHistoryAssess(){
	$("#historyAssessDig").dialog({
		title:"历史评估记录",
		width:"auto",
		height:"auto",
		modal:true,
	}).dialog("open");
	
	var getAssessHistoryParams={};
	getAssessHistoryParams.goodsId=$("#goodsIdP").text();
	getAssessHistoryParams.accessId="63106";
	$("#historyAssessTable").datagrid({
		url:basePath + "/dataaccess.json",
		queryParams:getAssessHistoryParams, 
		method:"post",
		fitColumns:true,
		pagination:true, 
		selectOnCheck:false,
		singleSelect:true,
		pageSize: "10",
		columns:[[
		         {field:'appraiseId',title:'序号',width:'8%'},
		         {field:'goodsId',title:'商品编号',width:'12%',sortable:true,alias:'goods_Id',halign:'center',align:'right'},
		         {field:'officialPrice',title:'官方价',width:"19%",halign:'center',align:'right'},
		         {field:'valuationPrice',title:'评估价',width:"19%",halign:'center',align:'right'},
		         {field:'createBy',title:'评估人',width:'13%',sortable:true,alias:'create_By',halign:'center',align:'left'},
		         {field:'createTime',title:'评估时间',width:'25%',sortable:true,alias:'creat_time',halign:'center',align:'left'}
		     ]]
	});
}
/**
 *新旧程度格式化
 *@param value  格式化的值	
 *@param row	对应行
 *@param index  对应行下标
 */
function goodsQualityFormatter(value,row,index){
	var result="";
	if(value=="01"){
		result="全新";
	}else if(value=="02"){
		result="9成";
	}else if(value=="03"){
		result="8成";
	}
	else if(value=="04"){
		result="7成";
	}else if(value=="05"){
		result="6成";
	}
	
	return result;
}
/**
 *鉴定结果格式化
 *@param value  格式化的值	
 *@param row	对应行
 *@param index  对应行下标
 */
function identifyResultFormatter(value,row,index){
	var result="";
	if(value=="01"){
		result="正品";
	}else if(value=="02"){
		result="假货";
	}else if(value=="03"){
		result="资料不全";
	}
	return result;
}
