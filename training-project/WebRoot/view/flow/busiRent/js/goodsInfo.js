//form表单弹窗属性
var options={
	width:'800',
	height:'600',
	title:'完善商品信息',
	buttons:'#sc_form'
};
var rentInfoTop;
function initPage(){
	$("#bdaysInput").textbox({
		onChange:function(newValue, oldValue){
			$("#returnDateInput").datebox("setValue",addDay(newValue));
		}
	});
	//从任务信息中取出业务主键作为典当业务id，查询信息
	var rentId = _taskData.businessKey;
	$.ajax({
		url:basePath + "/businesslogic.json",
		type:"post",
		async:false,
		data:{logicId:"06.03.04.01",rentId:rentId},
		success:function(data){
			var memberInfo=data.memberInfo;
//			//租赁信息
			var rentInfo=data.rentInfo;
			rentInfoTop = data.rentInfo;
			//disableForm('rentData','disabled');
			rentInfo.memberId=memberInfo.memberId;
			rentInfo.memberName=memberInfo.memberName;
			rentInfo.mobile=memberInfo.mobile;
			rentInfo.certNo=memberInfo.certNo;
			rentInfo.rentPrice=data.goodsInfo.rentPrice;
			$("#rentData").form("load",rentInfo);
//			
//			//会员信息
//			var memberInfo=data.memberInfo;
//			
//			$("#memberInfo_form").form("load",memberInfo);
//			//去除input边框
//			$("#memberInfo_form input").css({"border":"none",backgroundColor:"#fafafa"});
//			
//			//不可编辑
//			$("#memberInfo_form input").attr("readonly",true);
//			
//			
			//商品信息
			var goodsInfo=data.goodsInfo;
			//页面商品数据回显
			//基本信息回显
			$("#goodsIdP").text(goodsInfo.goodsId);
			$("#shopCodeP").text(goodsInfo.shopCode);
			$("#inputUserP").text(goodsInfo.inputUser);
			$("#catCodeP").text(goodsInfo.goodsCatRoute);
			$("#goodsNameP").text(goodsInfo.goodsName);
			$("#firstPriceP").text(goodsInfo.firstPrice);
			$("#goodsDescP").text(goodsInfo.goodsDesc);
			$("#goodsBrandP").text(goodsInfo.goodsBrand);
			$("#articleNumberP").text(goodsInfo.articleNumber);
			$("#inputDateP").text(goodsInfo.inputDate);
//			
			//查询并回显商品属性
			var getGoodsAttrParams={};
			getGoodsAttrParams.accessId="62504";
			getGoodsAttrParams.goodsId=goodsInfo.goodsId;
			
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
//			
//			//查询商品鉴定图片
			var getImageParams={};
			getImageParams.accessId="62505";
			getImageParams.goodsId=goodsInfo.goodsId;
			getImageParams.infoType="1004";
			
			//设置商品分类参数  （判断商品属于几级分类）
			if(goodsInfo.detailCatCode!=null && goodsInfo.detailCatCode!="" && goodsInfo.detailCatCode!=undefined){
				getImageParams.catCode=goodsInfo.detailCatCode;
			}else{
				if(goodsInfo.subCatCode!=null && goodsInfo.subCatCode!="" && goodsInfo.subCatCode!=undefined){
					getImageParams.catCode=goodsInfo.subCatCode;
				}else{
					if(goodsInfo.catCode!=null && goodsInfo.catCode!="" && goodsInfo.catCode!=undefined){
						getImageParams.catCode=goodsInfo.catCode;
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
		}
	});
}

//****************************客户资料弹框*********************************
/**
 * 点击打开客户资料选择弹框
 */
function doOpenSelectMemberDlg(){
	$('#memberDialog').dialog({closed: false});
	$("#memberSelect_dg").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 430, {accessId:"64104"}));
}

/**
 * 根据名称查询客户
 */
function doQueryMember(){
	$("#memberSelect_dg").datagrid(Common.createDatagridOptionsParams(basePath, "/dataaccess.json", 430, {accessId:"64104",keyword:$("#memberNameQuery").textbox("getValue")}));
}

/**
 * 选择客户资料
 */
function doSelectMember(){
	//获取选中行
	var row = $("#memberSelect_dg").datagrid("getSelected");
	//将选中行数据填入客户资料面板
	$("#memberId_receive").textbox("setValue",row.memberId);
	$("#memberName_receive").textbox("setValue",row.memberName);
	$("#mobile_receive").textbox("setValue",row.mobile);
	$("#certNo_receive").textbox("setValue",row.certNo);
	//设置文本框为不可编辑
	$("#memberName_receive").textbox("disable"); 
	$("#mobile_receive").textbox("disable"); 
	$("#certNo_receive").textbox("disable"); 
	//退出弹框
	$('#memberDialog').dialog({closed: true});
}

/**
 * 关闭客户资料框
 */
function doCloseMemberDialog(){
	$('#memberDialog').dialog({closed: true});
}

/**
 * 
 * @param dayNumber (天数)
 * @param date  （日期，不传则取当前日期）
 * @returns {String}
 */
function addDay(dayNumber, date) {
    date = date ? date : new Date();
    var ms = dayNumber * (1000 * 60 * 60 * 24);
    var newDate = new Date(date.getTime() + ms);
    var year = newDate.getFullYear();
    var month = newDate.getMonth()+1;
    var date = newDate.getDate();
    return (year + "-" + month + "-" + date);;
  }

/**
 * 
 * 修改资料处理
 */
function charge(flag){
	//获取租赁基本信息
	var rentData = $("#rentData").serializeObject();
	rentData.rentId = rentInfoTop.rentId;
	rentData.logicId = '03.05.12';
	rentData.taskId=_taskData.id;
	rentData.flag = flag;
	//开启流程
	$.ajax({
		url:basePath+'/businesslogic.json',
		data:rentData,
		type:'post',
		success:function(data){
			if(data.resultCode==1){
				$.messager.alert("提示信息", "操作成功", "info");
				doSearch();
				$("#formParse").dialog("close");
			}else{
				$.messager.alert("错误信息", "操作失败", "error");
			}
		}
	});
}