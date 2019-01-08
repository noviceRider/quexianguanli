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
	
//	//数据单选
//	queryformHtml+="<%if(item.type==\"12\"){%>";
//	queryformHtml+="<%if(item.dataSrc==\"02\"){%>";//数据字典加载数据
//	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input id=\"<%=item.name %>\" class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"dictCode\",textField:\"dictDesc\",panelHeight:true'>";
//	queryformHtml+="<%}else{%>";
//	//枚举添加数据
//	queryformHtml+="<span style=\"margin-left:20px;\"><%=item.label %>&nbsp;</span><input class=\"easyui-combobox\" name=\"<%=item.name %>\" data-options='valueField:\"value\",textField:\"text\",panelHeight:true,data:[<%item.enum.forEach(function(option){%>";
//	queryformHtml+="{value:\"<%=option.value%>\",text:\"<%=option.text%>\"},";
//	queryformHtml+="<%})%>";
//	queryformHtml+="]'>";
//	queryformHtml+="<%}%>";
//	queryformHtml+="<%}%>";
	
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
	var tableHtml="<table id=\"<%=id%>\" class=\"easyui-datagrid\" data-options=\"pagination:true,striped:true,rownumbers:true,queryParams:{accessId:'"+parserParams.searchAccessCode+"'},url:basePath+'/dataaccess.json'\"><thead><tr>";
	tableHtml+="<th data-options=\"field:'ck',checkbox:'true',hidden:true\"></th>";
	tableHtml+="<%dataField.forEach(function(item){%>";
	tableHtml+="<%if(item.isFormatter==\"1\"){%>";//须格式化
	tableHtml+="<th data-options=\"field:'<%=item.field%>',align:'<%=item.align%>',formatter:<%=id%>.<%=item.field%>Formatter\" style=\"width:<%=item.width%>;\"><%=item.title%></th>";
	tableHtml+="<%}else{%>";//不需格式化
	tableHtml+="<th data-options=\"field:'<%=item.field%>',align:'<%=item.align%>'\" style=\"width:<%=item.width%>;\"><%=item.title%></th>";
	tableHtml+="<%}%>";
	tableHtml+="<%})%>";
	tableHtml+="</tr></thead></table>";
	var table = new EJS({ text: tableHtml }).render(parserParams);
	
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
			queryObj.accessId=queryData[i].accessId;
			queryBindData.push(queryObj);
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
	var datagrid={id:parserParams.id,html:table,dictFormat:dictFormat};
	//新增、修改界面参数
	parserParams.queryForm={id:"queryForm",html:queryForm,bindData:queryBindData};
	parserParams.datagrid=datagrid;
	
	return parserParams;
}
