/**
 * 将数据解析成html界面
 * @param parserParams 解析的参数
 */
function parseHtml(parserParams){
	//查询条件
	var queryformHtml="";
	queryformHtml+="<%if(queryData.length>0){%>";
	//获取查询条件的数据
	queryformHtml+="<form id=\"queryForm\">";
	queryformHtml+="<table class=\"btbForm\">";
	queryformHtml+="<tr><td>";
	queryformHtml+="<%queryData.forEach(function(item){%>";
	//单行文本
	queryformHtml+="<%if(item.type==\"10\"){%>";
	queryformHtml+= "<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-textbox\" name=\"<%=item.name %>\">";
	queryformHtml+="<%}%>";
	//多行文本
	queryformHtml+="<%if(item.type==\"11\"){%>";
	queryformHtml+= "<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-textbox\" name=\"<%=item.name %>\" style=\"height:60px;\" data-options=\"multiline:true\">";
	queryformHtml+="<%}%>";
	
	//下拉列表
	queryformHtml+="<%if(item.type==\"12\"){%>";
	queryformHtml+="<%if(item.dataSrc==\"02\"){%>";//数据字典加载数据
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input id=\"<%=item.name %>\" class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'>";
	queryformHtml+="<%}else{%>";
	//枚举添加数据
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%item.enum.forEach(function(option){%>";
	queryformHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	queryformHtml+="<%})%>";
	queryformHtml+="]'>";
	queryformHtml+="<%}%>";
	queryformHtml+="<%}%>";
	
	//下拉树
	queryformHtml+="<%if(item.type==\"13\"){%>";
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-combobox\" name=\"<%=item.name %>\">";
	queryformHtml+="<%}%>";
	
	//数据单选
	queryformHtml+="<%if(item.type==\"12\"){%>";
	queryformHtml+="<%if(item.dataSrc==\"02\"){%>";//数据字典加载数据
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input id=\"<%=item.name %>\" class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'>";
	queryformHtml+="<%}else{%>";
	//枚举添加数据
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%item.enum.forEach(function(option){%>";
	queryformHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	queryformHtml+="<%})%>";
	queryformHtml+="]'>";
	queryformHtml+="<%}%>";
	queryformHtml+="<%}%>";
	
	//数据复选
	queryformHtml+="<%if(item.type==\"15\"){%>";
	queryformHtml+="<%if(item.dataSrc==\"02\"){%>";//数据字典数据
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><span id=\"<=item.name>\"></span>";
	queryformHtml+="<select style=\"width:200px;\" class=\"easyui-combobox\" id=\"<%=item.name %>\" name=\"<%=item.name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=item.title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	queryformHtml+="<%}else{%>";//枚举
	queryformHtml+="<%if(item.enum.length>0){%>";
	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><select style=\"width:30%;\" class=\"easyui-combobox\" name=\"<%=item.name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%item.enum.forEach(function(option){%>";
	queryformHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	queryformHtml+="<%})%>";
	queryformHtml+="]'></select>";
	queryformHtml+="<%}%>";
	queryformHtml+="<%}%>";
	queryformHtml+="<%}%>";
	
	queryformHtml+="<%})%>";
	queryformHtml+="</td></tr>";
	queryformHtml+="</table>";
	queryformHtml+="</form>";
	queryformHtml+="<%}%>";
	var queryForm = new EJS({ text: queryformHtml }).render(parserParams);
	//数据网格
	var tableHtml="<table id=\"<%=id%>\" class=\"easyui-datagrid\" data-options=\"pagination:true,striped:true,singleSelect:true,url:basePath+'/<%=searchUrl%>.json'\"><thead><tr>";
	tableHtml+="<%dataField.forEach(function(item){%>";
	tableHtml+="<%if(item.isFormatter==\"1\"){%>";//须格式化
	tableHtml+="<th data-options=\"field:'<%=item.field%>',align:'<%=item.align%>',formatter:<%=id%>.<%=item.field%>Formatter\" style=\"width:<%=item.width%>;\"><%=item.title%></th>";
	tableHtml+="<%}else{%>";//不需格式化
	tableHtml+="<th data-options=\"field:'<%=item.field%>',align:'<%=item.align%>'\" style=\"width:<%=item.width%>;\"><%=item.title%></th>";
	tableHtml+="<%}%>";
	tableHtml+="<%})%>";
	tableHtml+="</tr></thead></table>";
	var table = new EJS({ text: tableHtml }).render(parserParams);
	
	//新增、修改弹框
	editHtml="<form id=\"edit_fm\"><table style=\"width: 100%;border-collapse:separate; border-spacing:0px 10px;\">";
	//单行
	editHtml+="<%for(var i=0;i<singleLine.length;i++){%>";
	editHtml+="<tr>";
	editHtml+="<td style=\"text-align:right;width:15%;\"><%=singleLine[i].title%>：</td>";
	
	editHtml+="<%if(singleLine[i].type==\"10\"){%>";//单行文本
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td colspan=\"3\"><input class=\"easyui-textbox\" style=\"width:92%;\" id=\"<%=singleLine[i].name%>\" name=\"<%=singleLine[i].name%>\" data-options=\"required: true, missingMessage: '请输入<%=singleLine[i].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\"><input class=\"easyui-textbox\" style=\"width:92%;\" id=\"<%=singleLine[i].name%>\" name=\"<%=singleLine[i].name%>\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(singleLine[i].type==\"11\"){%>";//多行文本
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td colspan=\"3\"><input class=\"easyui-textbox\" style=\"width:92%;height:60px;\" id=\"<%=singleLine[i].name%>\" name=\"<%=singleLine[i].name%>\" data-options=\"multiline:true,required: true, missingMessage: '请输入<%=singleLine[i].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\"><input class=\"easyui-textbox\" style=\"width:92%;height:60px;\" id=\"<%=singleLine[i].name%>\" name=\"<%=singleLine[i].name%>\" data-options=\"multiline:true\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(singleLine[i].type==\"12\"||singleLine[i].type==\"13\"||singleLine[i].type==\"14\"){%>";//下拉列表、下拉树、数据单选
	editHtml+="<%if(singleLine[i].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td colspan=\"3\"><input style=\"width:92%;\" id=\"<%=singleLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" data-options='required: true, missingMessage: \"请输入<%=singleLine[i].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\"><input style=\"width:92%;\" id=\"<%=singleLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td colspan=\"3\"><input style=\"width:92%;\" id=\"<%=singleLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" data-options='required: true, missingMessage:\"请输入<%=singleLine[i].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:'<%=option.value%>',text:'<%=option.text%>'},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\"><input style=\"width:92%;\" id=\"<%=singleLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(singleLine[i].type==\"15\"){%>";//数据复选
	editHtml+="<%if(singleLine[i].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td colspan=\"3\">";
	editHtml+="<select style=\"width:92%;\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=singleLine[i].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\">";
	editHtml+="<select style=\"width:92%;\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(singleLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td colspan=\"3\">";
	editHtml+="<select style=\"width:92%;\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=singleLine[i].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td colspan=\"3\">";
	editHtml+="<select style=\"width:92%;\" class=\"easyui-combobox\" name=\"<%=singleLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	
	editHtml+="</tr>";
	editHtml+="<%}%>";
	
	//非单行
	editHtml+="<%for(var i=0;i<multiLine.length;i++){%>";
	editHtml+="<%if(i%2==1){%>";
	editHtml+="<tr>";
	editHtml+="<td style=\"text-align:right;width:15%;\"><%=multiLine[i-1].title%>：</td>";
	//第一个
	editHtml+="<%if(multiLine[i-1].type==\"10\"){%>";//单行文本
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;\" id=\"<%=multiLine[i-1].name%>\" name=\"<%=multiLine[i-1].name%>\" data-options=\"required: true, missingMessage: '请输入<%=multiLine[i-1].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;\" id=\"<%=multiLine[i-1].name%>\" name=\"<%=multiLine[i-1].name%>\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i-1].type==\"11\"){%>";//多行文本
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;height:60px;\" id=\"<%=multiLine[i-1].name%>\" name=\"<%=multiLine[i-1].name%>\" data-options=\"multiline:true,required: true, missingMessage: '请输入<%=multiLine[i-1].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;height:60px;\" id=\"<%=multiLine[i-1].name%>\" name=\"<%=multiLine[i-1].name%>\" data-options=\"multiline:true\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i-1].type==\"12\"||multiLine[i-1].type==\"13\"||multiLine[i-1].type==\"14\"){%>";//下拉列表、下拉树、数据单选
	editHtml+="<%if(multiLine[i-1].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i-1].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" data-options='required: true, missingMessage: \"请输入<%=multiLine[i-1].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i-1].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i-1].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i-1].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i-1].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i-1].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i-1].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i-1].type==\"15\"){%>";//数据复选
	editHtml+="<%if(multiLine[i-1].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" id=\"<%=multiLine[i-1].name %>\" name=\"<%=multiLine[i-1].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i-1].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" id=\"<%=multiLine[i-1].name %>\" name=\"<%=multiLine[i-1].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(multiLine[i-1].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i-1].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i-1].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" name=\"<%=multiLine[i-1].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<td style=\"text-align:right;width:15%;\"><%=multiLine[i].title%>：</td>";
	//第二个
	editHtml+=getEditHtml();
	
	editHtml+="</tr>";
	editHtml+="<%}else if(i==multiLine.length-1){%>";
	editHtml+="<tr>";
	editHtml+="<td style=\"text-align:right;width:15%;\"><%=multiLine[i].title%>：</td>";
	editHtml+=getEditHtml();
	editHtml+="<td style=\"text-align:right;width:15%;\"></td>";
	editHtml+="<td style=\"text-align:right;width:30%;\"></td>";
	editHtml+="</tr>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	
	editHtml+="</table></form>";
	var edit = new EJS({ text: editHtml }).render(parserParams);
	//查询条件数据
	var queryData = parserParams.queryData;
	//新建数组
	var queryBindData = new Array();
	//循环添加数据
	for(var i=0;i<queryData.length;i++){
		if(queryData[i].dataSrc!=undefined&&queryData[i].dataSrc=="02"){
			var queryObj ={};
			queryObj.type=queryData[i].type;
			queryObj.id=queryData[i].name;
			queryObj.typeCode=queryData[i].typeCode;
			queryBindData.push(queryObj);
		}
	}
	
	//编辑页面数据
	var amData = parserParams.amData;
	//新建生成控件数组
	var editBindData = new Array();
	//新建验证数组
	var editValidate = new Array();
	//循环添加数据
	for(var j=0;j<amData.length;j++){
		if(amData[j].dataSrc!=undefined&&amData[j].dataSrc=="02"){//数据字典加载数据
			var editObj ={};
			editObj.type=amData[j].type;
			editObj.id=amData[j].name;
			editObj.typeCode=amData[j].typeCode;
			editBindData.push(editObj);
		}
		if(amData[j].repeatUrl!=""){
			var editValideObj={};
			editValideObj.id=amData[j].name;
			editValideObj.inputType=amData[j].type;
			editValideObj.validType="repeatValid";
			editValideObj.repeatUrl=amData[j].repeatUrl;
			editValideObj.repeatLogicId=amData[j].repeatLogicId;
			editValidate.push(editValideObj);
		}
	}
	//数据网格格式化字段数据
	var dataField = parserParams.dataField;
	//新建数组
	var dictFormat = new Array();
	//循环添加数据
	for(var k=0;k<dataField.length;k++){
		if(dataField[k].isFormatter=="1"){
			var obj ={};
			obj.fun=dataField[k].field+"Formatter";
			obj.typeCode=dataField[k].typeCode;
			dictFormat.push(obj);
		}
	}
	//数据网格参数
	var datagrid={id:parserParams.id,html:table,deleteUrl:parserParams.deleteUrl,dictFormat:dictFormat};
	//新增、修改界面参数
	var  editPanel={id:"edit_fm",html:edit,title:parserParams.amTitle,width:parserParams.width,height:parserParams.height,addUrl:parserParams.addUrl,modifyUrl:parserParams.modifyUrl,bindData:editBindData,validate:editValidate,keyId:parserParams.keyId};
	parserParams.queryForm={id:"queryForm",html:queryForm,bindData:queryBindData};
	parserParams.datagrid=datagrid;
	parserParams.editPanel=editPanel;
	
	return parserParams;
}

/**
 * 返回编辑页面列
 */
function getEditHtml(){
	var editHtml ="<%if(multiLine[i].type==\"10\"){%>";//单行文本
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;\" id=\"<%=multiLine[i].name%>\" name=\"<%=multiLine[i].name%>\" data-options=\"required: true, missingMessage: '请输入<%=multiLine[i].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;\" id=\"<%=multiLine[i].name%>\" name=\"<%=multiLine[i].name%>\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i].type==\"11\"){%>";//多行文本
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//空验证
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;height:60px;\" id=\"<%=multiLine[i].name%>\" name=\"<%=multiLine[i].name%>\" data-options=\"multiline:true,required: true, missingMessage: '请输入<%=multiLine[i].title%>'\"></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input class=\"easyui-textbox\" style=\"width:80%;height:60px;\" id=\"<%=multiLine[i].name%>\" name=\"<%=multiLine[i].name%>\" data-options=\"multiline:true\"></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i].type==\"12\"||multiLine[i].type==\"13\"||multiLine[i].type==\"14\"){%>";//下拉列表、下拉树、数据单选
	editHtml+="<%if(multiLine[i].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" data-options='required: true, missingMessage: \"请输入<%=multiLine[i].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\"><input style=\"width:80%;\" id=\"<%=multiLine[i].name %>\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%if(multiLine[i].type==\"15\"){%>";//数据复选
	editHtml+="<%if(multiLine[i].dataSrc==\"02\"){%>";//数据字典加载数据
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" id=\"<%=multiLine[i].name %>\" name=\"<%=multiLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i].title%>\",valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" id=\"<%=multiLine[i].name %>\" name=\"<%=multiLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}else{%>";//枚举加载数据
	editHtml+="<%if(multiLine[i].validEmpty==\"1\"){%>";//非空验证
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='required: true, missingMessage:\"请输入<%=multiLine[i].title%>\",valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%multiLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}else{%>";
	editHtml+="<td style=\"width:30%;\">";
	editHtml+="<select style=\"width:80%;\" class=\"easyui-combobox\" name=\"<%=multiLine[i].name %>\" multiple=\"true\" multiline=\"true\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%singleLine[i].enum.forEach(function(option){%>";
	editHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
	editHtml+="<%})%>";
	editHtml+="]'></select>";
	editHtml+="</td>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	editHtml+="<%}%>";
	return editHtml;
}