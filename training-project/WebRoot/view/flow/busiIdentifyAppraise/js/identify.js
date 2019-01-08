//form表单弹窗属性
var options={
	width:"80%",
	height:"90%",
	title:'商品鉴定',
	//buttons:'#sc_form'
};

//当前用户对应员工
var empInfo;

//当前登录用户信息
var user;

//初始化页面
function initPage(){
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
	
	//获取当前用户员工信息
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		data: {logicId:"04.06.02"},
		async:false,
		success:function(data){
			//得到用户
			empInfo = data.empInfo;
		}
	});
	
	//从任务信息中取出业务主键作为商品id，查询商品信息
	var goodsId = _taskData.businessKey;
	
	//通过业务主键查询商品信息
	$.ajax({
		url:basePath + "/dataaccess.json",
		type:"post",
		data:{goodsId:goodsId,accessId:'62510'},
		async:false,
		success:function(data){
			showGoodsDetail(data);
		}
	});
};
	
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
 * 鉴定操作
 */
/**
 *修改商品业务状态为待估价
 *@param goodsId
 *@param goodsStat
 */
function identifyOprate(identifyResult){
	var updateGoodsStatParams=$("#identifyForm").serializeObject();
	
	if(updateGoodsStatParams.goodsQuality=="" || updateGoodsStatParams.goodsQuality==null){
		$.messager.alert("提示信息","请先选择商品新旧程度","info");
	} else if(identifyResult=="03" && (updateGoodsStatParams.identifyDesc=="" || updateGoodsStatParams.identifyDesc==null)){
		$.messager.alert("提示信息","请填写备注信息！！","info");
	}else{
		//点击后的确认信息内容
		var tipText="";
		if(identifyResult=="01"){//正品
			tipText="是否确定鉴定为正品,同时进入商品评估流程节点?";
		}else if(identifyResult=="02"){//假货
			tipText="是否确定鉴定为假货,同时结束商品鉴定评估流程?";
		}else if(identifyResult=="03"){
			tipText="是否确定鉴定为资料不全?商品将完善资料后再次提交鉴定.";
		}
		$.messager.confirm("确认信息",tipText,function(r){
			if(r){
				var goodsId=$("#goodsIdP").text();
				
				//构造参数
				updateGoodsStatParams.taskId=_taskData.id;
				updateGoodsStatParams.goodsId=goodsId;
				updateGoodsStatParams.identifyResult=identifyResult;
				updateGoodsStatParams.logicId="03.03.02";
				updateGoodsStatParams.createBy=user.userId;
				updateGoodsStatParams.modifyBy=user.userId;
				
				//鉴定结果
				if(identifyResult=="01"){//正品
					updateGoodsStatParams.goodsStat="02";
				}else if(identifyResult=="03"){//资料不全
					updateGoodsStatParams.goodsStat="19";
				}else if(identifyResult=="02"){//假货
					updateGoodsStatParams.goodsStat="00";
				}
				
				//鉴定人
				updateGoodsStatParams.surveyor=empInfo.empId;
				
				$.ajax({
					url:basePath+"/businesslogic.json",
					method:"post",
					data:updateGoodsStatParams,
					success:function(data){
						if(data.resultCode==1){
							//操作成功
							$.messager.alert("提示信息","办理完成！","info");
							refresh();
						}else{
							$.messager.alert("错误信息", "办理失败！", "error");
						}

					}
				});
			}
		});
		
		
	}
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
	$("#firstPriceP").text(priceFormatter(row.firstPrice));
	$("#goodsDescP").text(row.goodsDesc);
	$("#goodsBrandP").text(row.brandCode);
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
			var attrStr="<table style='width:100%;margin-top:5px;border:0px solid red'>";
			for(var i=0;i<data.rows.length;i++){
				//非空判断
				if(typeof(data.rows[i+1])!="undefined"){
					attrStr+="<tr><td style='text-align:right;width:25%'>"+data.rows[i].attrName+":</td><td style='text-align:left;width:25%'>"+data.rows[i].attrValue+"</td>" +
					"<td style='text-align:right;width:25%'>"+data.rows[i+1].attrName+":</td><td style='text-align:left;width:25%'>"+data.rows[i+1].attrValue+"</td></tr>";
					i=i+1;
				}else{
					attrStr+="<tr><td style='text-align:right;width:25%'>"+data.rows[i].attrName+":</td><td style='text-align:left;width:25%'>"+data.rows[i].attrValue+"</td>"
				}
			}
			
			attrStr+="</table>";
			$("#goodsAttrDiv").html(attrStr);
			
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
			if(data.rows.length!=0){
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

					ImageStr+="<div style='height:151px;width:20%;display:inline-block;margin-right:15px'><span style='display:block;text-align:center;height:30px;width:100%;'>"+picDesc+"</span><img style='height:130px;width:100%;margin-right:15px' onclick=lookImg(this) src='"+basePath+"/gmodule_resmanage_filedown.json?id="+data.rows[i].resId+"'></div>";
				}
				
				$("#goodsImages").html(ImageStr);
			}else{
				$("#goodsImages").html("<span style='font-size:20px'>该商品无展示图片</span>");
			}
			
		}
	});
	
	//新旧程度下拉列表
	oldOrNewSelect();
	
	//获取历史鉴定记录条数
	var getIdentifyHistoryParams={};
	getIdentifyHistoryParams.goodsId=$("#goodsIdP").text();
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
	getIdentifyHistoryParams.goodsId=$("#goodsIdP").text();
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
		         {field:'identifyId',title:'序号',width:'8%',align:'right'},
		         {field:'goodsId',title:'商品编号',width:'12%',sortable:true,alias:'goods_Id',halign:'center',align:'left'},
		         {field:'goodsQuality',title:'新旧程度',width:"19%",halign:'center',align:'left',formatter:goodsQualityFormatter},
		         {field:'identifyResult',title:'鉴定结果',width:"19%",halign:'center',align:'left',formatter:identifyResultFormatter},
		         {field:'createBy',title:'鉴定人',width:'18%',sortable:true,alias:'create_By',halign:'center',align:'left'},
		         {field:'createTime',title:'录入时间',width:'25%',sortable:true,alias:'creat_time',halign:'center',align:'center'}
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

/**
 *查看图片 
 */
function lookImg(img){
	
	var aaa=[];
	var url={url:$(img).attr("src")};
	aaa.push(url);
	$("#showPics").picturePreview(aaa,"showPics");
}

/**
 *价格格式化
 */
function priceFormatter(value,row,index){
	value=""+value;
	if(value.split(".")[1]=="" || value.split(".")[1]==null ||value.split(".")[1]==undefined){
		value=value+".00";
	}
	return value;
}