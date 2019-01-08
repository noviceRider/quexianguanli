var type;
var isNew = false;//判断是增加还是修改
var paramIsNew = false;//判断是增加还是修改
var backIsNew = false;//判断是增加还是修改
var url;//增加、修改的请求地址
var typeCode;//选中的访问类型
var categoryCode;//选中的访问分类
var javaMethod;//新增时javaMethod
var accessUrl;//新增时accessUrl
var accessCode;
var dbType;
var arrParam=[];
var arrBack=[];
var arrParamC=[];
var arrBackC=[];
/**
 * 功能：初始化，页面加载时执行
 * 参数：无
 */
$(function(){
	
	//加载api访问方式下拉列表
	$("#apiCalltypeQuery").combobox({
	    valueField:'id',
	    textField:'value',
	    data: [{
			id: '0',
			value: '鉴权访问'
		},{
			id: '1',
			value: '匿名访问'
		}]
	});
	//详情弹窗设置
	$('#AccessDetail').dialog({
		resizable:true,
		onResize:function(width,height){
			$(this).find("#content").css("width",width-32);
			$("#showSql").css("width",width-32);
			$("#panelTwo").panel("resize",{width:width-45});
			$("#panelOne").panel("resize",{width:width-45});
		},
		onOpen:function(){
			$(this).dialog("restore");
		}
	});
	//测试弹窗设置
	$('#AccessTest').dialog({
		resizable:false,
		onResize:function(width,height){
			$(this).find("#content_test").css("width",width-32);
			$("#paneltwo_test").panel("resize",{width:width-45});
			$("#panelone_test").panel("resize",{width:width-45});
			$("#inParamsId").textbox("resize",width-45);
		},
		onOpen:function(){
			$(this).dialog("restore");
		}
	});
	 $("#logicScriptId").on(
	            'keydown',
	            function(e) {
	                if (e.keyCode == 9) {
	                    e.preventDefault();
	                    var indent = '    ';
	                    var start = this.selectionStart;
	                    var end = this.selectionEnd;
	                    var selected = window.getSelection().toString();
	                    selected = indent + selected.replace(/\n/g, '\n' + indent);
	                    this.value = this.value.substring(0, start) + selected
	                            + this.value.substring(end);
	                    this.setSelectionRange(start + indent.length, start
	                            + selected.length);
	                }
	            });


	//初始化数据网格
	$("#accessTable").datagrid(createDatagrid(basePath, "/apron_punish_dataaccess_findpage.json",document.body.clientHeight, 135, "",'typeDiv'));
	
	//初始化新增修改页面combobox数据
	$("#dbCombo").combobox({
	    url:basePath+'/gmodule_datadict_findall.json',
	    valueField:'dictCode',
	    textField:'dictDesc',
	    queryParams:{typeCode:'DB_TYPE'},
		loadFilter: function(data){	
			return data.rows;
		}
	});
	
	//初始化新增修改页面combobox数据
	$("#apiCallTypeCombo").combobox({
	    valueField:'id',
	    textField:'value',
	    data: [{
			id: '0',
			value: '鉴权访问'
		},{
			id: '1',
			value: '匿名访问'
		}]
	});
	
	//初始化新增修改页面combobox数据
	$("#dbtype").combobox({
	    url:basePath+'/gmodule_datadict_findall.json',
	    valueField:'dictCode',
	    textField:'dictDesc',
	    queryParams:{typeCode:'DB_TYPE'},
		loadFilter: function(data){	
			data.rows.unshift({
				dictCode : "",
				dictDesc : "全部"
			});
			return data.rows;
		}
	});
	
	//初始左侧化树形菜单
	loadLeftTree();
	$("#accessTable").datagrid('resize');
	//请求combobox数据
	$("#cc").combobox({
		url:basePath+"/apron_punish_accesstype_findall.json",
		loadFilter: function(data){	
			data.rows.unshift({
				typeCode : "",
				typeName : "全部"
			});
			return data.rows;
		}
	});
	//加载选择选择访问类型datagrid
	$("#type_dg").datagrid(createDatagrid(basePath, "/apron_punish_accesstype_findpage.json",550, 135, "",'chooseType'));
	//给数据网格设置双击事件
	$("#type_dg").datagrid({
		onDblClickRow: function(index, row) {
			chooseType(row);
		}
	});
	
	//参数描述新增、修改页面
	$("#dialog_param_add_modify").load("dataaccess_param_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//返回值描述新增、修改页面
	$("#dialog_back_add_modify").load("dataaccess_back_add_modify.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//复制参数页面
	$("#dialog_param_copy").load("param_copy.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});

	//复制参数页面
	$("#dialog_back_copy").load("back_copy.html",null,function(){
		//进行解析
		$.parser.parse(this);
	});
	
});

/**
 *初始化左侧树形菜单
 */
function loadLeftTree() {
	$("#categoryTree").tree({
		url:basePath+"/apron_punish_dataaccess_category_findallleaf.json",
		method:"post",
		animate:true,
		loadFilter:function(data1,parent){
			var data = data1.rows;
			for(var i in data){
				data[i].text=data[i].text+"("+data[i].id+")";
			}
				return data;
		},
		onSelect:function(node){
			doSearch();
		},
		onClick:function(node){
			if(!$("#categoryTree").tree("isLeaf",node.target)){
				$("#categoryTree").tree("toggle",node.target);
			}
		}
	});
}

/**
 * 查询数据访问信息
 */
function doSearch() {
	var id=$("#categoryTree").tree('getSelected')==null?"":$("#categoryTree").tree('getSelected').id;
//	if(node==null){
//		$.messager.alert('错误', '请选择节点查询!', 'error');
//		return;
//	}
	var keyWord=$("#keyWord").val();
	var type=$("#cc").combobox("getValue");
	var dbtype=$("#dbtype").combobox("getValue");
	var apiCallType = $("#apiCalltypeQuery").combobox("getValue");
	var params = {categoryCode:id,keyWord:keyWord,typeCode:type,dbType:dbtype,apiCallType:apiCallType};
	$("#accessTable").datagrid({
		url:basePath + "/apron_punish_dataaccess_findpagebycategorycode.json",
		method:"post",
		dataType:"json",
		queryParams: params
	});
}

/**
 * 查询数据访问信息button
 */
function doSearchButton() {
	var node=$("#categoryTree").tree('getSelected');
	if(node==null){
	}else{
		$('#categoryTree').find('.tree-node-selected').removeClass('tree-node-selected');
	}
	var keyWord=$("#keyWord").val();
	var type=$("#cc").combobox("getValue");
	var dbtype=$("#dbtype").combobox("getValue");
	var apiCallType = $("#apiCalltypeQuery").combobox("getValue");
	var params = {keyWord:keyWord,typeCode:type,dbType:dbtype,apiCallType:apiCallType};
	$("#accessTable").datagrid({
		url:basePath + "/apron_punish_dataaccess_findpagebycategorycode.json",
		method:"post",
		dataType:"json",
		queryParams: params
	});
}

/**
 * 生成当前配置文件
 */
function createXml() {
	var node=$("#categoryTree").tree('getSelected');
	if(node==null){
		$.messager.alert('错误', '请选择节点生成配置!', 'error');
		return;
	}
	 $.ajax({
		url:basePath+"/gmodule_dataaccess_createxml_createxml.json",
		type:"post",
		data:{categoryCode:node.categoryCode},
		success:function(data){
			Common.ajaxLoadEnd();
			if(data.resultCode==1){
				$.messager.alert("提示", "配置文件生成成功！", "info");
			}
		},beforeSend:function(){
    		Common.ajaxLoading();
    	}
	 });
}

/**
 * 生成所有配置文件
 */
function createAllXml() {
	 $.ajax({
		url:basePath+"/gmodule_dataaccess_createxml_createallxml.json",
		type:"post",
		success:function(data){
			Common.ajaxLoadEnd();
			if(data.resultCode==1){
				$.messager.alert("提示", "配置文件生成成功！", "info");
			}
		},beforeSend:function(){
    		Common.ajaxLoading();
    	}
	 });
}

/**
 * 查看配置文件
 */
function queryXml() {
	var node=$("#categoryTree").tree('getSelected');
	if(node==null||!$("#categoryTree").tree("isLeaf",node.target)){
		$.messager.alert('错误', '请选择叶子节点查看配置!', 'error');
		return;
	}
	 var categoryCode=node.id;
	 $.ajax({
		url:basePath+"/gmodule_dataaccess_createxml_queryxml.json",
		type:"post",
		data:{id:categoryCode},
		success:function(data){
			$("#showText").dialog("open");
			$("#text").val(data.text);
		}
	 });
}

/**
 * 功能：单击行事件，当选择一行时，复选框也只能选择这行       l
 * 参数：
 * 	rowIndex:该行的下标
 * 	rowData:该行的数据
 */
function onClickRow(rowIndex, rowData) {
	//设置成不全选
	$("#accessTable").datagrid("uncheckAll");
	//选择当前行
	$("#accessTable").datagrid("checkRow", rowIndex);
}

///**
// * 给是否有效设置图标
// */
//function setIsUsed(value,row,index){
//	if(row.isUsed=="1"){
//		return "<img src='../../../css/themes/icons/ok.png'/>";
//	}else{
//		return "—";
//	}
//}

/**
 * 格式化详情链接操作
 * @param value
 * @param row
 * @param index
 */
function detailFormmater(value, row, index){
	return "<a href='#1' onclick='detail("+index+")' style='color: blue;' >详情</a> |<a href='#1' onclick='test("+index+")' style='color: blue;' >测试</a>";
}

/**
 * 初始化datagrid
 * @param bPath
 * @param loadUrl
 * @param div
 * @param headHeight
 * @param params
 * @returns {___anonymous4375_4376}
 */
function createDatagrid(bPath, loadUrl,divHeight, headHeight, params ,divName){
	var hHeight = (typeof headHeight != "undefined") ? headHeight : 135;
	var rowCount = Math.floor((divHeight - hHeight)/25);
	var opts = {};
	opts['url'] = bPath + loadUrl;
	opts['pageList'] = [5, 10];
	opts['pageSize'] = rowCount;
	opts['pageList'].push(rowCount);
	opts['queryParams'] = params;
	//当数据查询完成时，判断数据是否超过一页，如果少于一页，则不显示分页，否则显示分页
 	if(divName!=""){
 		opts['onLoadSuccess'] = function(data){
 	 		$("#"+divName+" .datagrid-body").css("overflow", "hidden");
 			if(data.total<=opts.pageSize){
 				$("#"+divName+" .datagrid-pager").hide();
 			}else{
 				$("#"+divName+" .datagrid-pager").show();
 			}
 		};
 	}
	return opts;
}

/**
 * 显示详情
 */
function detail(index){
	arrParam = [];
	arrBack = [];
	var row = $("#accessTable").datagrid('getRows')[index];
	row.isUsed = row.isUsed==1?"有效":"无效";
   //row.accessSQL=row.accessSQL.replace(/\r\n/g,"<br/>").replace(/\s/g,"&nbsp;");
	loadDataForDOMByHtml(row,"#AccessDetail","span","name");
	prettyPrint();
	//设置参数描述、返回值描述数组并加载到详情数据中
	setArrParam(row);
	$("#detail_param_table").datagrid("loadData",arrParam);
	setArrBack(row);
	$("#detail_back_table").datagrid("loadData",arrBack);
	$('#AccessDetail').dialog('open');
}

/**
 * 显示测试对话框
 */
function test(index){
	arrParam=[];
	arrBack=[];
	var row = $("#accessTable").datagrid('getRows')[index];
	var categoryCode=row.categoryCode;
	$.ajax({
		url:basePath+"/gmodule_dataaccess_createxml_queryxml.json",
		type:"post",
		data:{id:categoryCode},
		success:function(data){
		if(data.resultCode=="0"){
			$.messager.alert('错误', '此分类配置文件未生成!', 'error');
			return;
		}
		else{
			//$('#backInfo').textbox('textbox').attr('readonly',true);
			row.isUsed = row.isUsed==1?"有效":"无效";
			Common.loadDataForDOM(row,"#AccessTest","span","name");
			//设置参数描述、返回值描述数组并加载到数据中
			setArrParam(row);
			$("#test_param_table").datagrid("loadData",arrParam);
			setArrBack(row);
			$("#test_back_table").datagrid("loadData",arrBack);
			$('#AccessTest').dialog('open');
			$("#inParamsId").textbox().next('span').find('textarea').focus();
		}
		}
	 });
}
/**
*测试
*/
function doTest(){
	var paramsString=$("#inParamsId").textbox("getValue");
	if(paramsString==""){
		params={};
	}else{
		 var params=$.parseJSON(paramsString);
		    if(params==null){
		    	params={};
		    }	
	}
    params.accessId=$("#te_accessCode").html();
    $.ajax({
    	type:'post',
    	url:basePath + "/dataaccess.json",
    	data:params,
    	success:function(data){
    	Common.ajaxLoadEnd();
    	//格式化输出json字符串
        var dataString =JSON.stringify(data, null, "\t");
    	//$("#backInfo").textbox("setValue",dataString);
    	 var content = $.trim(dataString);
    	 var result = '';
    	 if (content!='') {
    	        try{
    	            current_json = jsonlint.parse(content);
    	            current_json_str = JSON.stringify(current_json);
    	            //current_json = JSON.parse(content);
    	            result = new JSONFormat(content,4).toString();
    	        }catch(e){
    	            result = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
    	            current_json_str = result;
    	        }

    	        $('#json-target').html(result);
    	    }else{
    	        $('#json-target').html('');
    	    }
    	 //调整滚动条位置
    	 document.getElementById('AccessTest').scrollTop=$("#testTab").height();
    	},
    	beforeSend:function(){
    		Common.ajaxLoading();
    	}
    });
}
///**
// * 打开遮罩
// */
//function ajaxLoading(){   
//    $("<div class=\"datagrid-mask\"></div>").css({display:"block",width:"100%",height:$("#AccessTest").height()}).appendTo("#AccessTest");   
//    $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候。。。").appendTo("#AccessTest").css({display:"block",left:($("#AccessTest").outerWidth(true) - 190) / 2,top:($("#AccessTest").height() - 45) / 2});   
// }  
///**
// * 请求结束关闭遮罩
// */
// function ajaxLoadEnd(){   
//     $(".datagrid-mask").remove();   
//     $(".datagrid-mask-msg").remove();               
//} 
/**
* 关闭窗口
*/
function closeDialog(){
	$('#AccessTest').dialog('close');
	//清空数据
	$("#inParamsId").textbox("setValue","");
	$("#json-target").html("");
}
/**
 * 清空数据
 */
function BeforeClose(){
	//清空数据
	$("#inParamsId").textbox("setValue","");
	$("#json-target").html("");	
}
/**
*以html形式将数据到指定DOM对象
*/
function loadDataForDOMByHtml(data,selector,label,attribute){
	 var loadobj = $(selector).find(label);
	    $(loadobj).each(function(){
	      var $this = $(this);
	      var attr = $this.attr('name');
	      if(attribute != undefined){
	        attr = $this.attr(attribute);
	      }
	      if(attr != undefined){
	        if(typeof(data) != 'object'){
	        }
	        if(data[attr]){
	        	var text;
	           if(attr=="accessSQL"){
		        	text="<pre id='detailPre' class='prettyprint' style='font-size:16px;margin-left:10px'></pre>";
		        	 $this.html(text);
		        	 $("#detailPre").text(data[attr]);
		       }else{
		    	   text = data[attr]; 
		    	   $this.html(text);
		       }
	        }else{
	          $this.html("");
	        }
	      }
	    });
} 

/**
 * 添加数据访问
 */
function addAccess(){
	var node=$("#categoryTree").tree('getSelected');
	if(node==null||!$("#categoryTree").tree("isLeaf",node.target)){
		$.messager.alert('错误', '请选择叶子节点新增!', 'error');
		return;
	}
	isNew=true;
	//清空数组
	arrParam=[];
	arrBack=[];
	//更新参数描述数据表
	loadParam(arrParam);
	loadBack(arrBack);
	// 关闭panel
	$("#param_panel").panel({
		 collapsed:false
	});
	$("#back_panel").panel({
		collapsed:false
	});
	$('#am_form').form('reset');
	$("#logicScriptIdSpan").html("");
	$("#accessSql").val("");
	$('#amAccess').dialog({title:'增加数据访问'}).dialog('open');
	$("#am_categoryCode").text(node.text);
	url=basePath + "/apron_punish_dataaccess_add.json";
	validate();
	$("#apiCallTypeCombo").combobox("setValue",0);
	//新增默认有效，隐藏显示是否有效
	$('#hide1').hide();
	$('#hide2').hide();
	$('#am_accessCode').textbox({
		'editable':true,
		onChange:function(newValue, oldValue){
			//查询数据
			$.ajax({
				url:basePath+"/apron_punish_dataaccess_findByCode.json",
				data:{accessCode:newValue},
				type:'post',
				dataType:'json',
				async:false,
				success:function(data){
					var row=data.rows;
					if(data.rows==null){

					}else{
						//数据带出
						//清空数组
						arrParam=[];
						arrBack=[];
						//设置参数描述数组
						setArrParam(row);
						setArrBack(row);
						// 更新参数描述表中数据
						loadParam(arrParam);
						loadBack(arrBack);
						//清空数据库类型
						row.dbType="";
						//记录typeCode
						typeCode=row.typeCode;
						$("#am_form").form("load",row);		//回显脚本
						var pre="<pre class='prettyprint' style='font-size:16px;margin-left:20px'></pre>";
						$("#logicScriptIdSpan").html(pre);
						$("#logicScriptIdSpan").find("pre").text(row.accessSQL);
						$("#accessSql").val(row.accessSQL);
						prettyPrint();
					}
				}
			});
		}
	});
	$('#am_accessName').textbox({'editable':true});
	$('#dbCombo').textbox({'readonly':false});
	setTimeout(function(){
		$("#am_accessCode").textbox().next('span').find('input').css('background','#fff');
		$("#am_accessName").textbox().next('span').find('input').css('background','#fff');
		},200);
	//默认焦点时间
	setTimeout(function(){
		$('#am_accessCode').textbox().next("span").find('input').first().focus();
	},300);
}
/**
 *  修改
 */
function modifyAccess(rowObj){
	$('#hide1').show();
	$('#hide2').show();
	var row = rowObj ==null ?$('#accessTable').datagrid('getSelected'):rowObj;
	if(row == null){
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		isNew = false ;
		accessCode = row.accessCode;
		dbType = row.dbType;
		typeCode = "";
		// 关闭panel
		$("#param_panel").panel({
			 collapsed:false
		});
		$("#back_panel").panel({
			collapsed:false
		});
		//清空数组
		arrParam=[];
		arrBack=[];
		//清空数据
		$("#am_form").form("reset");
		$('#am_accessCode').textbox({'editable':false});
		$('#am_accessName').textbox({'editable':false});
		$('#dbCombo').combobox({'readonly':true});
		setTimeout(function(){
			$("#am_accessName").textbox().next('span').find('input').css('background','#ccc');
			$("#am_accessCode").textbox().next('span').find('input').css('background','#ccc');
			//$("#dbCombo").combobox().next('span').find('input').css('background','#ccc');
			},200);
		url=basePath + "/apron_punish_dataaccess_modify.json";
		//设置参数描述数组
		setArrParam(row);
		setArrBack(row);
		// 更新参数描述表中数据
		loadParam(arrParam);
		loadBack(arrBack);
		
		$('#amAccess').dialog({title:'修改数据访问'}).dialog('open');
		validate();
		//默认焦点时间
		setTimeout(function(){
			$('#am_accessDesc').textbox().next("span").find('input').first().focus();
		},300);
		$("#am_form").form("load",row);
		$("#am_categoryCode").text(row.categoryName);
		//回显脚本
		var pre="<pre class='prettyprint' style='font-size:16px;margin-left:20px'></pre>";
		$("#logicScriptIdSpan").html(pre);
		$("#logicScriptIdSpan").find("pre").text(row.accessSQL);
		$("#accessSql").val(row.accessSQL);
		prettyPrint();
	}
}
/**
 *  删除数据访问
 */
function removeAccess(){
	var rows = $('#accessTable').datagrid('getSelections');
	if(rows.length<1){
		$.messager.alert("提示信息", "请选择要删除的数据", "error");
	}else{
		$.messager.confirm("提示信息","你确定要删除选中数据吗？",function(r){
			if(r){
				for (var i = 0; i < rows.length; i++) {
					$.ajax({
						url:basePath+"/apron_punish_dataaccess_delete.json",
						data:{accessCode:rows[i].accessCode,dbType:rows[i].dbType},
						type:'post',
						dataType:'json',
						async:false,
						success:function(data){
							if(data.resultCode=="1"){
								doSearch();
							} else if(data.resultCode=="0"){
								$.messager.alert("提示信息", "第"+(i+1)+"条数据操作失败了，检查该记录是否在数据访问模块使用", "error");
							} else{
								$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
							}
						}
					});
				}
			}
		});
	}
}
/**
 * 格式化参数类型数据列
 */
function paramTypeFormartter(value,row,index){
	if(value=="1"){
		return "数字";
	}else if(value=="0"){
		return "字符";
	}
}

/**
 * 添加验证
 */
function validate(){
	$("#am_accessCode").textbox({
		required:true,
		missingMessage:"访问编号不能为空"
//		validType:"codevalide",
//		invalidMessage:'编码已经存在'
	});
	$("#am_accessName").textbox({
		required:true,
		missingMessage:"访问名称不能为空"
	});
	$("#dbCombo").combobox({
		required:true,
		missingMessage:"访问名称不能为空"
	});
	$("#apiCallTypeCombo").combobox({
		required:true,
		missingMessage:"api访问方式不能为空"
	});
	$("#am_typeCode").textbox({
		required:true,
		missingMessage:"访问类型不能为空"
	});
	$("#am_accessDesc").textbox({
		required:true,
		missingMessage:"访问描述不能为空"
	});
	/*$("#phoneNum").textbox({
		invalidMessage:"请输入正确的电话号码",
		validType:'mobile'
	});*/
}
/**
 * 设置自定义的验证类型
 */
$.extend($.fn.validatebox.defaults.rules, {
	codevalide : {
		validator : function(value, param){
			var check=false;
			if(isNew){
				
			}
			$.ajax({
				url:basePath + "/apron_punish_dataaccess_validate.json",
				type:'post',
				dataType:'json',
				async:false,
				data:{accessCode:value,modifyCode:(isNew==false?accessCode:'')},
				success:function(data){
					if(data.resultCode==1){
						check=true;
					}else{
						check=false;
					}
				}
			});
			return check;
		},
		message : "访问编码已经存在"
	},
});
/**
 * 打开选择访问类型dialog
 */
function openChoose(){
	$('#chooseType').dialog('open');
}
/**
 * 查询访问类型
 */
function doSearchType(){
	var param = {keyWord:$('#type_keyword').textbox('getValue')};
	$('#type_dg').datagrid('reload',param);
}
/**
 * 选中访问类型
 * @param row
 */
function chooseType(rowObj){
	var row = rowObj==null?$('#type_dg').datagrid('getSelected'):rowObj;
	if(row != null){
		$('#chooseType').dialog('close');
		typeCode = row.typeCode;
		javaMethod = row.javaMethod;
		accessUrl = row.accessUrl;
		$('#am_typeCode').textbox('setValue',row.typeName);
	}else{
		$.messager.alert("提示信息", "请选择访问类型", "info");
	}
}
/**
 * 数据访问类型的保存
 */
function doSave(){
	var valid = $("#am_form").form("validate");
	var obj = $("#am_form").serializeObject();
	obj.typeCode = typeCode;
	obj.modifyCode = accessCode;
	obj.modifyDbType = dbType;
	obj.accessUrl = "dataaccess";
	obj.isUsed = "1";
	// 设置参数描述
	var parameterDesc=JSON.stringify(arrParam);
	obj.parameterDesc = parameterDesc;
	// 设置返回值描述
	var returnedDesc=JSON.stringify(arrBack);
	obj.returnedDesc = returnedDesc;
	
	var sql =$("#accessSql").val();
	obj.accessSQL=sql;
	var isSql = sql.trim().length<1?false:true;

	if(isNew){
		//数据访问分类
		var categoryCode=$("#categoryTree").tree('getSelected').id;
		obj.categoryCode=categoryCode;
		obj.javaMethod = javaMethod;
		obj.accessUrl = accessUrl;
		if(valid&&validateForm(obj.accessCode,obj.accessName,obj.dbType)){
			if(!isSql){
				$.messager.alert("提示信息", "sql不能为空", "info");
			}else{
				$.ajax({
					type:'post',
					url: url,
					data:obj,
					dataType:'json',
					async:false,
					success: function(data){
						if(data.resultCode=="1"){
							doSearch();
							doCancel();
						} else{
							$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
						}
					}
				});	
			}
		}
	}else{
		if(!isSql){
			$.messager.alert("提示信息", "sql不能为空", "info");
		}else{
			$.ajax({
				type:'post',
				url: url,
				data:obj,
				dataType:'json',
				async:false,
				success: function(data){
					if(data.resultCode=="1"){
						doSearch();
						doCancel();
					} else{
						$.messager.alert("提示信息", "操作失败，请联系管理员", "error");
					}
				}
			});	
		}
	}
}
function validateForm(accessCode,accessName,dbType){
	var flag=false;
	$.ajax({
		type:'post',
		url: basePath+'/apron_punish_dataaccess_validateform.json',
		data:{accessCode:accessCode,accessName:accessName,dbType:dbType},
		dataType:'json',
		async:false,
		success: function(data){
			if(data.resultCode=="1"){
				flag= true;
			} else{
				$.messager.alert("提示信息", data.msg, "error");
				flag= false;
			}
		}
	});	
	return flag;
}
/**
 * 关闭新增修改对话框
 */
function doCancel(){
	//关闭对话框																			
	$('#amAccess').dialog('close');
	//清空数据
	$("#am_form").form("reset");
	//清空span内容
	$("#logicScriptIdSpan").html("");
}

/**
 * 新增参数
 */
function addParam(){
	paramIsNew = true;
	// 打开新增对话框
	$("#param_add_modify_div").dialog({
		modal : true,
		title : "新增参数",
		onClose : function() {
			// 清空数据
			$("#param_add_modify_form").form("reset");
		},
	}).dialog("center");
	validateParam();
	// 获取焦点
	$("#paramNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改参数
 */
function modifyParam(){
	paramIsNew = false;
	//得到要修改的节点
	var param = $("#param_table").datagrid("getSelected");
	if (param==null) {
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		// 数据回显
		$("#param_add_modify_form").form("load",param);
		// 打开新增对话框
		$("#param_add_modify_div").dialog({
			modal : true,
			title : "修改参数",
			onClose : function() {
				// 清空数据
				$("#param_add_modify_form").form("reset");
			},
		}).dialog("center");
	}
	
	validateParam();
	// 获取焦点
	$("#paramNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改参数保存
 */
function paramSave(){
	// 序列化表单
	var newParam = $("#param_add_modify_form").serializeObject();
	//获取Select选中的索引值
	var row = $("#param_table").datagrid("getSelected");
	var checkIndex = $("#param_table").datagrid("getRowIndex",row);
	//提交数据
	if($("#param_add_modify_form").form("validate")){
		if (paramIsNew) {//新增则直接添加到数组中
			arrParam.push(newParam);
		}else{//修改则替换掉对应的元素
			arrParam[checkIndex]=newParam;
		}
		// 更新参数描述表中数据
		loadParam(arrParam);
		//关闭页面
		paramCancel();
	}
}

/**
 * 新增、修改参数取消
 */
function paramCancel(){
	//关闭对话框
	$("#param_add_modify_div").dialog("close");
	
	//清空数据
	$("#param_add_modify_form").form("reset");
}

/**
 * 删除参数
 */
function removeParam(){
	// 得到要删除的行节点
	var params = $("#param_table").datagrid("getSelections");
	
	if (params == null || params.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 删除选中数据
	$.messager.confirm("确认", "是否删除选中数据，是否继续？", function(r) {
		if (r) {
			// 遍历选中数据数组
			for(var i in params){
				// 同时遍历字段数组
				for ( var j in arrParam) {
					// 满足条件，移除数组中被选中的元素
					if (params[i].paramName == arrParam[j].paramName) {
						arrParam.splice(j, 1);
					}
				}
			}
			// 更新参数描述表中数据
			loadParam(arrParam);
		};
	});
}

//加载参数数据表
function loadParam(arrParam) {
	//给字段数据网格设置属性
	$("#param_table").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#param_table").datagrid("uncheckAll");
			//选中当前行
			$("#param_table").datagrid("checkRow",index);
		},
		//行的双击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#param_table").datagrid("uncheckAll");
			//选中当前行
			$("#param_table").datagrid("checkRow",index);
			//修改
			modifyParam();
		}
	});
	uniqueParam(arrParam);
	// 更新参数表中数据
	$("#param_table").datagrid("loadData",arrParam);
}

/**
 * 设置参数描述数组
 */
function setArrParam(data) {
	//设置参数描述数组
	if (data.parameterDesc != null) {
		var arr1 = JSON.parse(data.parameterDesc);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrParam.push(arr1[i]);
			}
		}
	}
}

/**
 * 设置参数描述数组
 */
function setArrParamC(data) {
	//设置参数描述数组
	if (data.parameterDesc != null) {
		var arr1 = JSON.parse(data.parameterDesc);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrParamC.push(arr1[i]);
			}
		}
	}
}

/**
 * 添加验证
 */
function validateParam(){
	$("#paramNameId").textbox({
		required:true,
		missingMessage:"参数名称不能为空",
	});
}

/**
 * 新增返回值
 */
function addBack(){
	backIsNew = true;
	// 打开新增对话框
	$("#back_add_modify_div").dialog({
		modal : true,
		title : "新增返回值",
		onClose : function() {
			// 清空数据
			$("#back_add_modify_form").form("reset");
		},
	}).dialog("center");
	
	validateBack();
	// 获取焦点
	$("#backNameId").textbox().next("span").find("input").focus();
}

/**
 * 修改返回值
 */
function modifyBack(){
	backIsNew = false;
	//得到要修改的节点
	var back = $("#back_table").datagrid("getSelected");
	if (back==null) {
		$.messager.alert("提示信息", "请选择要修改的数据", "error");
	}else{
		// 数据回显
		$("#back_add_modify_form").form("load",back);
		// 打开新增对话框
		$("#back_add_modify_div").dialog({
			modal : true,
			title : "修改返回值",
			onClose : function() {
				// 清空数据
				$("#back_add_modify_form").form("reset");
			},
		}).dialog("center");
	}
	
	validateBack();
	// 获取焦点
	$("#backNameId").textbox().next("span").find("input").focus();
}

/**
 * 新增、修改返回值保存
 */
function backSave(){
	// 序列化表单
	var newBack = $("#back_add_modify_form").serializeObject();
	//获取Select选中的索引值
	var row = $("#back_table").datagrid("getSelected");
	var checkIndex = $("#back_table").datagrid("getRowIndex",row);
	//提交数据
	if($("#back_add_modify_form").form("validate")){
		if (backIsNew) {//新增则直接添加到数组中
			arrBack.push(newBack);
		}else{//修改则替换掉对应的元素
			arrBack[checkIndex]=newBack;
		}
		// 更新返回值描述表中数据
		loadBack(arrBack);
		//关闭页面
		backCancel();
	}
}

/**
 * 新增、修改返回值取消
 */
function backCancel(){
	//关闭对话框
	$("#back_add_modify_div").dialog("close");
	
	//清空数据
	$("#back_add_modify_form").form("reset");
}

/**
 * 删除返回值
 */
function removeBack(){
	// 得到要删除的行节点
	var backs = $("#back_table").datagrid("getSelections");
	
	if (backs == null || backs.length == 0) {
		// 如果没有选中行弹出提示
		$.messager.alert("提示信息", "请选择要删除的数据！", "info");
		return;
	}
	
	// 删除选中数据
	$.messager.confirm("确认", "是否删除选中数据，是否继续？", function(r) {
		if (r) {
			// 遍历选中数据数组
			for(var i in backs){
				// 同时遍历字段数组
				for ( var j in arrBack) {
					// 满足条件，移除数组中被选中的元素
					if (backs[i].backName == arrBack[j].backName) {
						arrBack.splice(j, 1);
					}
				}
			}
			// 更新返回值描述表中数据
			loadBack(arrBack);
		};
	});
}

//加载返回值数据表
function loadBack(arrBack) {
	//给字段数据网格设置属性
	$("#back_table").datagrid({
		//行的单击事件
		onClickRow:function(index,row){
			//取消所有其他选中行
			$("#back_table").datagrid("uncheckAll");
			//选中当前行
			$("#back_table").datagrid("checkRow",index);
		},
		//行的双击事件
		onDblClickRow:function(index,row){
			//取消其他所有选中行
			$("#back_table").datagrid("uncheckAll");
			//选中当前行
			$("#back_table").datagrid("checkRow",index);
			//修改
			modifyBack();
		}
	});
	uniqueBack(arrBack);
	// 更新返回值表中数据
	$("#back_table").datagrid("loadData",arrBack);
}

/**
 * 设置返回值描述数组
 */
function setArrBack(data) {
	//设置返回值描述数组
	if (data.returnedDesc != null) {
		var arr1 = JSON.parse(data.returnedDesc);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrBack.push(arr1[i]);
			}
		}
	}
}

/**
 * 设置返回值描述数组
 */
function setArrBackC(data) {
	//设置返回值描述数组
	if (data.returnedDesc != null) {
		var arr1 = JSON.parse(data.returnedDesc);
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != "") {
				arrBackC.push(arr1[i]);
			}
		}
	}
}

/**
 * 添加验证
 */
function validateBack(){
	$("#backNameId").textbox({
		required:true,
		missingMessage:"返回值名称不能为空",
	});
}

/**
 * 格式化返回值类型数据列
 */
function backTypeFormartter(value,row,index){
	if(value=="1"){
		return "数字";
	}else if(value=="0"){
		return "字符";
	}
}

/**
 * 打开脚本编辑
 */
function openEdit(){
	$('#editJs').dialog('open');
	var spanText=$("#accessSql").val();
	$("#logicScriptId").val(spanText);
	$("#logicScriptId").focus();
}

/**
 * 把脚本赋值到span
 */
function toSpan(){
	var logicScript=$("#logicScriptId").val();
	var pre="<pre class='prettyprint' style='font-size:16px;margin-left:20px'></pre>";
	$("#logicScriptIdSpan").html(pre);
	$("#logicScriptIdSpan").find("pre").text(logicScript);
	$("#accessSql").val(logicScript);
	$("#editJs").dialog("close");
	prettyPrint();
	$("#logicScriptId").val("");
}


/**
 * 过滤数组重复元素
 */
function uniqueParam(target) {    
    var result = [];    
    loop:   
    for (var i = 0, n = target.length; i < n; i++){    
      for (var x = i + 1; x < n; x++) {    
        if (target[x].paramDesc === target[i].paramDesc)  
          continue loop;     
      }    
      result.push(target[i]);    
    }    
    return result;    
  }  

/**
 * 过滤数组重复元素
 */
function uniqueBack(target) {    
    var result = [];    
    loop:   
    for (var i = 0, n = target.length; i < n; i++){    
      for (var x = i + 1; x < n; x++) {    
        if (target[x].backDesc === target[i].backDesc)  
          continue loop;     
      }    
      result.push(target[i]);    
    }    
    return result;    
  }  

/**
 * 参数复制
 */
function copyParam() {
	var categoryCode;
	if (isNew) {
		var category = $("#categoryTree").tree("getSelected");
		categoryCode = category.id;
	}else{
		var access = $("#accessTable").datagrid("getSelected");
		categoryCode = access.categoryCode;
	}
	$.ajax({
		url:basePath+"/apron_punish_dataaccess_findByCategoryCode.json",
		type:"post",
		data:{"categoryCode":categoryCode},
		success:function(data){
			var access = data.rows;
			for (var i = 0; i < access.length; i++) {
				if (access[i].parameterDesc != null && access[i].parameterDesc != "") {
					setArrParamC(access[i]);
				}
			}
			arrParamC = uniqueParam(arrParamC);
			$("#logic_param_dg").datagrid("loadData",arrParamC);
			
			// 打开新增对话框
			$("#logic_param_div").dialog({
				modal : true,
				title : "复制参数",
			}).dialog("center");
		}
	});
}

/**
 * 复制参数选择按钮
 */
function selectParam() {
	var params = $("#logic_param_dg").datagrid("getSelections");
	if (params.length == 0 || params == null) {
		$.messager.alert("提示信息", "请选择数据", "error");
		return;
	}
	for (var i = 0; i < params.length; i++) {
		arrParam.push(params[i]);
	}
	arrParam = uniqueParam(arrParam);
	$("#param_table").datagrid('loadData',arrParam);
	
	cancelSelectParam();
}

/**
 * 复制参数取消按钮
 */
function cancelSelectParam() {
	// 打开新增对话框
	$("#logic_param_div").dialog("close");
}

//---------------------------------------------------------------------------

/**
 * 返回值复制
 */
function copyBack() {
	var categoryCode;
	if (isNew) {
		var category = $("#categoryTree").tree("getSelected");
		categoryCode = category.id;
	}else{
		var access = $("#accessTable").datagrid("getSelected");
		categoryCode = access.categoryCode;
	}
	$.ajax({
		url:basePath+"/apron_punish_dataaccess_findByCategoryCode.json",
		type:"post",
		data:{'categoryCode':categoryCode},
		success:function(data){
			var access = data.rows;
			for (var i = 0; i < access.length; i++) {
				if (access[i].returnedDesc != null && access[i].returnedDesc != "") {
					setArrBackC(access[i]);
				}
			}
			arrBackC = uniqueBack(arrBackC);
			$("#logic_back_dg").datagrid("loadData",arrBackC);
			
			// 打开新增对话框
			$("#logic_back_div").dialog({
				modal : true,
				title : "复制返回值",
			}).dialog("center");
		}
	});
}

/**
 * 复制返回值选择按钮
 */
function selectBack() {
	var backs = $("#logic_back_dg").datagrid("getSelections");
	if (backs.length == 0 || backs == null) {
		$.messager.alert("提示信息", "请选择数据", "error");
		return;
	}
	for (var i = 0; i < backs.length; i++) {
		arrBack.push(backs[i]);
	}
	arrBack = uniqueBack(arrBack);
	$("#back_table").datagrid('loadData',arrBack);
	
	cancelSelectBack();
}

/**
 * 复制返回值取消按钮
 */
function cancelSelectBack() {
	// 打开新增对话框
	$("#logic_back_div").dialog("close");
}

/**
 * 美化SQL
 */
function beatiSql(){
	$("#logicScriptId").format({method: 'sql'});
}

/**
 * 最小化SQL
 */
function minSql(){
	$("#logicScriptId").format({method: 'sqlmin'});
}


/**
 * 数据表双击事件
 */
function onDblClickRow(index,row){
	//取消素有选择行
	$("#accessTable").datagrid("uncheckAll");
	//选中当前行
	$("#accessTable").datagrid("checkRow",index);
	detail(index);
}

/**
 * 生成参数
 */
function createParam() {
	var param = {};
	for (var i = 0; i < arrParam.length; i++) {
		if (arrParam[i].paramType == "1") {
			if(arrParam[i].paramTestValue==""){
				param[''+arrParam[i].paramName+'']=0;
			}else{
				param[''+arrParam[i].paramName+'']=Number(arrParam[i].paramTestValue);
			}
		}else{
			param[''+arrParam[i].paramName+'']=arrParam[i].paramTestValue;
		}
	}
	var jsonStr=JSON.stringify(param);
	$("#inParamsId").textbox("setValue",jsonStr);
}
/**
 * 跳转到修改
 * @param flag 测试，详情标识
 */
function changeToModify(flag){
	if(flag == "xq"){
		//关闭详情窗口
		$('#AccessDetail').dialog('close');
	}else if(flag == "test"){
		closeDialog();
	}
	modifyAccess();
}
/**
 * 导出
 */
function exportAccess(){
	//查询分类根节点
	 $.ajax({
			url:basePath+"/apron_punish_dataaccess_category_findallleaf.json",
			type:"post",
			async:false,
			success:function(data){
				row = data.rows;
				//新建页面
				var html="<div><table class=\"btb\" style=\"border-collapse:separate; border-spacing:0px 10px;\">";
				for(var i=0;i<row.length;i++){
					if(i%3==0){
						html+= "<tr>";
					}
					if(row[i].categoryCode!=undefined){
						html+= "<td style='border:0px'><input type=\"checkbox\" name=\"post\" value=\""+row[i].categoryCode+"\">"+row[i].categoryName+"("+row[i].categoryCode+")"+"</td>";
					}
					if((i+1)%3==0){
						html+= "</tr>";
					}
				}
				html+="</table></div>";
				//添加到页面中
				$("#posthtml").html(html);
			}
		 });
	 $("#exportDg").dialog("open");
}
/**
 * 根据数据访问分类导出 分类，数据访问 数据
 */
function exportData(){
	var data = [];
	var $allChecked = $("#exportDg").find("input:checked");
	if($allChecked.length>0){
		for(var i=0;i<$allChecked.length;i++){
			data.push($allChecked[i].value);
		}
		var types = data.join(",");
		$("#ff").form("submit",{
			url:basePath+"/apron_punish_dataaccess_export.json?",
			onSubmit:function(params){
				params.types = types;
				$("#exportDg").dialog("close");
			}
		});
	}else{
		$.messager.alert('提示', '请选择分类导出!', 'error');
	}
}
/**
 * 导入数据访问，打开导入对话框
 */
function importAccess(){
	//打开对话框
	$("#dlg_importExcel").show().dialog({
		title : "导入数据访问信息",
		modal : true
	});
}

/**
 * 确认导入信息
 */
function doImportExcel() {
	if ($("[name='file']").val() == null
			|| $("[name='file']").val() == "") {
		$.messager.alert("提示信息", "导入文件不能为空！", "info");
	} else {
		Common.ajaxLoading();
		$("#dlg_importExcel").dialog("close");
		$("#form_import").form("submit", {
			url : basePath + "/apron_punish_dataaccess_import.json",
			success : function(data) {
				Common.ajaxLoadEnd();
				data = JSON.parse(data);
				if (data.resultCode == "1") {
					doSearch();
					$.messager.alert("提示", "导入成功！", "info");
				} else {
					$.messager.alert("提示", "导入数据访问配置信息失败！", "info");
				}
				$("#form_import").form("reset");
			},
		    onSubmit: function(param){
		    }
		});
	}
}
