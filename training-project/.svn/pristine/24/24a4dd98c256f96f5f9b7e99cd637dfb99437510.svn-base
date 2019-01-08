var url;//请求url
var isNew;//新增、修改标志
var picList=new Array();//图片id数组
var picListChange=new Array();
/**
 * 初始化页面，加载数据
 */
$(function(){
	//加载新增修改页面
	$("#uploadPic").load("../commondata/resource_add_modify.html", null, function() {
		//进行解析
		$.parser.parse(this);
	});
	//数据网格加载数据
	$("#template_dg").datagrid(Common.createDatagridOptionsExt(basePath, "/gmodule_dform_apptemplate_findpage.json",135));
	
	//给数据网格设置属性事件
	$("#template_dg").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有选择行
			$("#template_dg").datagrid("uncheckAll");
			//选中当前行
			$("#template_dg").datagrid("checkRow",index);
		},
		onDblClickRow:function(index,row){
			//取消所有选中行
			$("#template_dg").datagrid("uncheckAll");
			//选中当前行
			$("#template_dg").datagrid("checkRow",index);
			
			//修改选中数据
			modifyTemplate();
		}
	});

	//加载新增、修改页面
	$("#dialog_add_modify").load("apptemplate_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

});

/**
 * 查询数据
 */
function queryTemplate(){
	$("#template_dg").datagrid("reload",{keyWord:$("#keyWord").textbox("getValue")});
}

/**
 * 新增数据
 */
function addTemplate(){
	//重置
	picList=[];
	$("#picNum").text("共"+picList.length+"张");
	$("#drivePhoto").attr("src","images/defaultimg.jpg");
	//changeImg(document.getElementById("drivePhoto"));
	//设置新增标识
	isNew = true;
	//设置新增url
	url=basePath+"/gmodule_dform_apptemplate_addApptemplate.json";
	
	//启用模板编号输入框
	$("#templateCodeId").textbox("enable");
	
	//加载模板分类
	templateCatFormatter();
	
	// 打开新增对话框
	$("#apptemplate_add_modify_div").dialog({
		modal : true,
		title : "新增应用模板",
		onClose : function() {
			// 清空数据
			$("#apptemplate_add_modify_form").form("reset");
		},
	}).dialog("center");

	//验证
	validateConfig();
	
	//获取焦点
	$("#templateCodeId").textbox().next("span").find("input").focus();
}

/**
 * 修改数据
 */
function modifyTemplate(){
	//重置数组
	picList=[];
	//设置修改标识
	isNew = false;
	//得到要修改的节点
	var rows = $("#template_dg").datagrid("getSelections");
	
	if (rows == null || rows.length == 0) {
		$.messager.alert("提示信息","请选择要修改的数据！","info");
		return;
	} else if (rows.length > 1) {
		$.messager.alert("提示信息","不能选择多条数据！","info");
		return;
	}
	
	//设置修改url
	url=basePath+"/gmodule_dform_apptemplate_modifyApptemplate.json";
	
	//禁用模板编号输入框
	$("#templateCodeId").textbox("disable");
	
	//加载模板分类
	templateCatFormatter();
	$.ajax({
		url: basePath+"/gmodule_dform_apptemplate_findbyid.json",
		type: "post",
		data: {templateCode:rows[0].templateCode,infoType:'2001'},  
		dataType:"json",
		success : function(data) {
			// 数据回显
			$("#apptemplate_add_modify_form").form("load",data.row);
			
			picList=data.row.resIdArr;
			
			$("#picNum").text("共"+picList.length+"张");
			if(picList.length==0){
				$("#drivePhoto").attr("src","images/defaultimg.jpg");
			}else{
				$("#drivePhoto").attr("src",'/apron_punish/gmodule_resmanage_filedown.json?id='+picList[0]);
			}
		}
	});
	
	// 打开新增对话框
	$("#apptemplate_add_modify_div").dialog({
		modal : true,
		title : "修改应用模板",
		onClose : function() {
			// 清空数据
			$("#apptemplate_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	//验证
	validateConfig(rows[0].templateCode);
	
	//获取焦点
	$("#templateNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改保存
 */
function doSaveApp(){
	console.log(picList);
	// 序列化表单
	var template = $("#apptemplate_add_modify_form").serializeObject();
	template.templateCode = $("#templateCodeId").textbox("getValue");
	template.ver = $("#verId").textbox("getValue")=="" ? "0" : $("#verId").textbox("getValue");
	template.infoType = "2001";
	for (var i = 0; i < picList.length; i++) {
		template['resIdArr['+i+']']=picList[i];
	}
	console.log(template);
	// 保存提交数据
	if($("#apptemplate_add_modify_form").form("validate")){
		$.ajax({
			url: url,
			type: "post",
			data: template,  
			dataType:"json",
			success : function(data) {
				if (data.resultCode == "1") {
					// 更新页面数据
					$("#template_dg").datagrid("reload");
					//关闭对话框
					doCancelApp();
				} else if (data.resultCode == "0") {
					$.messager.alert("提示信息", "操作失败了，请联系管理员1", "error");
				} else {
					$.messager.alert("提示信息", "操作失败，请联系管理员2", "error");
				}
			},
			error : function() {
				$.messager.alert("错误", "服务器内部错误!", "error");
			}
		});
	}
}

/**
 * 新增、修改取消
 */
function doCancelApp(){
	//关闭对话框
	$("#apptemplate_add_modify_div").dialog("close");
	
	//清空数据
	$("#apptemplate_add_modify_form").form("reset");
}

/**
 * 删除数据
 */
function removeTemplate(){
	// 得到要删除的行节点
	var batchTemplateCode = Common.getSelectedIds("#template_dg", "templateCode", "batchTemplateCode");
	if (batchTemplateCode == null || batchTemplateCode.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	// 删除选中数据
	$.messager.confirm("确认", "是否将选择的功能信息从数据库中删除，这一操作是不可逆的，是否继续？", function(r) {
		if (r) {
			$.ajax({
				url : basePath + "/gmodule_dform_apptemplate_removeApptemplate.json",
				type : "post",
				data : batchTemplateCode,
				success : function(data) {
					// 更新表格中的数据
					if (data.resultCode == "1") {
						// 更新页面数据
						$("#template_dg").datagrid("reload");
						$.messager.alert("提示信息", "删除数据成功！");
					} else {
						$.messager.alert("提示信息", "删除数据失败！", "info");
					}
				},
				error : function() {
					$.messager.alert("错误信息", "服务器内部错误!", "error");
				}
			});
		}
		;
	});
}

/**
 * 验证数据
 */
function validateConfig(templateCode) {
	if(isNew){// 新增验证
		$("#templateCodeId").textbox({
			required:true,
			missingMessage:"模板编号不能为空",
			invalidMessage:"模板编号已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_apptemplate_validateTemplateCode.json','templateCode']"
		});
		$("#templateNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_apptemplate_validateTemplateName.json','templateName']"
		});
	}else{// 修改验证
		$("#templateNameId").textbox({
			required:true,
			missingMessage:"模板名称不能为空",
			invalidMessage:"模板名称已经存在",
			validType:"remoteValid['"+basePath+"/gmodule_dform_apptemplate_validateTemplateName.json','templateName',{templateCode:'"+templateCode+"'}]"
		});
	}
}

/**
 * 格式化是否有效数据列
 */
function isUsedFormatter(value,row,index){
	if (value == 1) {// 有效
		return "<img src='../../../css/themes/icons/ok.png'/>";
	} else if (value == 0) {// 无效
		return "—";
	}
}

/**
 * 格式化模板分类下拉选项
 */
function templateCatFormatter() {
	loadCombotree("templateCatId","1001");
}
/**
 * 上传图片按钮
 */
function uploadPic(){
	$("#res_add_modify").dialog({
		modal: true,
		title: "资源管理",
		onClose: function() {
			//清空数据
			$("#res_add_modify_fm").form("reset");
		}
	});
	//验证
	validateProjectRes();
	//设置默认的项目id，分类序号
	var infoType ="2001";
	$("#infoType").textbox('setValue', infoType);
	var typeId = "1080";
	$("#typeId").textbox("setValue", typeId);
	isNew = true; //新增
	saveUrl = basePath + "/gmodule_resmanage_add.json"; //新增请求的url
	//项目名称编辑框获取焦点
	setTimeout(function(){
		$("#resDesc").textbox("textbox").focus();
	}, 300);	
}
/**
 * 验证资源描述，不为空也不重复   l
 */
function validateProjectRes() {
	var data = $("#res_add_modify_fm").serializeObject();
	if(isNew) {
		$("#resDesc").textbox({
			required: true,
			missingMessage: "资源描述不能为空",
			invalidMessage: "资源描述已经存在",
			validType: "remoteValid['" + basePath + "/gmodule_resmanage_validatedesc.json','resDesc']"
		});
	} else {
		$("#resDesc").textbox({
			required: true,
			missingMessage: "资源描述不能为空",
			invalidMessage: "资源描述已经存在",
			validType: "remoteValid['" + basePath + "/gmodule_resmanage_validatedesc.json','resDesc',{resId:'" + data.resId + "'}]"
		});
	}
}
/**
 * 保存操作         l
 */
function doSave() {
	//新增保存
	if(isNew&& $("#res_add_modify_fm").form("validate")) {
		$("#res_add_modify_fm").form("submit", {
			method: "post",
			url: "/apron_punish/gmodule_resmanage_add.json",
			success: function(data) {
				var data1 = JSON.parse(data);
				if(data1.resultCode == "1") {
					//$("#dg").datagrid("reload");
					$('#res_add_modify').dialog('close');
					picList.unshift(data1.resId);
					console.log(picList);
					//上传图片文件赋值显示区域文件input
					$("#drivePhoto").attr("src",'/apron_punish/gmodule_resmanage_filedown.json?id='+picList[0]);
					$("#picNum").text("共"+picList.length+"张");
					
				} else if(data.resultCode == "0") {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				} else {
					$.messager.alert("错误信息", "在保存信息的过程中发生错误，请重新尝试或联系系统管理人员", "error");
				}
			}
		});
	}
}
/**
 * 功能:取消按钮点击事件，重置输入表单，关闭对话框  l
 * 参数：无
 */
function doCancel() {
	//关闭对话框
	$("#res_add_modify").dialog("close");
	//清空数据
	$("#res_add_modify_fm").form("reset");
}
function test(){
	$("#choisePic").dialog({
		modal : true,
		title : "选择快照"
	}).dialog("center");
	var dataList;
    picListChange=arrDeepCopy(picList);
	console.log(picListChange);
	        $.ajax({
	        	url:basePath+'/gmodule_resmanage_findpageforpic.json',
	        	type:"post",
	        	data:{infoType:"2001",typeId:"1080"},
	        	success:function(data){
	        		console.log(data.rows);
	        		console.log(picList);
	        		for(var i in data.rows){
	        		   for(var j in picListChange){
	        			   if(picListChange[j]==data.rows[i].Id){
	        				   data.rows[i].selected=true;
	        				   console.log(i);
	        			   }
	        		   }
	        		}
	        		dataList=data;
	        		console.log(dataList);
	        		 $('#imggrid').imgGrid({
	     	            type: 'POST',//GET|POST
	     	            //data:data,//本地数据
//	     	            url: basePath+'/gmodule_resmanage_findpageforpic.json',//ajax URL
//	     	            params: { infoType:"2001",typeId:"1080"},//url参数
	     	            data:dataList,
	     	            height: '400px',
	     	            width: '850px',
	     	            img: { width: '200px', animate: 'zoomIn' },//图片宽度，及动画效果
	     	            onClick: function (obj, index, item) {//点击图片事件
	     	            if(item.selected==undefined||item.selected==false){
	     	            	console.log(item.Id);
	     	            	  obj.css("position","relative");
	     		              obj.append('<img id="drivePhoto" src="images/ok.png" style="width: 10%;height: 10%;position:absolute;   z-index: 999;top:5px;right:5px;">');
	     		              item.selected=true;
	     		             picListChange.unshift(item.Id);
	     	            }else{
	     	            	 obj.css("position","relative");
	     		              var thisNode= obj.context.getElementsByTagName("img")[1];
	     		              thisNode.parentNode.removeChild(thisNode);
	     		              item.selected=false;
	     		              removeByValue(picListChange,item.Id);
	     		              //console.log(picList);
	     	            }
	     	            },
	     	            render: function (item, index) {//自定义显示图片
	     	            	if(item.selected==undefined||item.selected==false){
	     	            		 var str = '<img src="' + item.ImgUrl + '"  alt="'+item.desc+'">';
	     	 	                return str;
	     	            	}else{
	     	            		 var str='<img src="' + item.ImgUrl + '"  alt="'+item.desc+'"><img id="drivePhoto" src="images/ok.png" style="width: 10%;height: 10%;position:absolute;   z-index: 999;top:5px;right:5px;">';
	     	            		 return str;
	     	            	}  
	     	            }
	     	        });
	        	}       	
	        });
}
/*
 *删除数组指定值 
 */
function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
	    if(arr[i] == val) {
	      arr.splice(i, 1);
	      break;
	    }
	  }
	}
/**
*选择按钮
*/
function selectPic(){
	picList=picListChange;
	$("#picNum").text("共"+picList.length+"张");
	$("#choisePic").dialog("close");
	if(picList.length==0){
		$("#drivePhoto").attr("src","images/defaultimg.jpg");
	}else{
		$("#drivePhoto").attr("src",'/apron_punish/gmodule_resmanage_filedown.json?id='+picList[0]);
	}
}
/**
*
*/
function lookPic(){
	var aaa=[];
	var url;	
	for(var i in picList){
		url={url:'/apron_punish/gmodule_resmanage_filedown.json?id=' + picList[i]};
		aaa.push(url);
	}
	console.log(aaa);
	$("#aaa").picturePreview(aaa,"showPics");
}
/**
 * 数组coppy
 * @param source
 * @returns {Array}
 */
function arrDeepCopy(source){
    var sourceCopy = [];
    for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? arrDeepCopy(source[item]) : source[item];
    return sourceCopy;
}