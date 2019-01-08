/**
 * 初始化方法
 */
$(function(){
	DYNAMIC_FORM.parser(getUIJson(1001));
});

function getUIJson(uiId){
	var result = {
			1002:{
				id:	"1002",
				name:"元数据新增界面",
				type: "form",
				desc:"根据JSON对象搭建对应UI界面",
				containers:[{
					id: "1002_1",
					name: "containers",
					title: "",
					items: [
					        {
					        	id: "100211",
					        	title: "元数据新增信息",
					        	type: "InputForm2Column",
					        	items:[
					        	       {
					        	    	   id: "1002111",
					        	    	   label: "表名",
					        	    	   labelVAlign: "top",
					        	    	   labelAlign: "right",
					        	    	   name: "tableName",
					        	    	   type: "singleLineInput",
					        	       },
					        	       {
					        	    	   id: "1002112",
					        	    	   label: "实体名",
					        	    	   labelVAlign: "top",
					        	    	   labelAlign: "right",
					        	    	   name: "entityName",
					        	    	   type: "singleLineInput",
					        	       },
					        	       {
					        	    	   id: "1002113",
					        	    	   label: "表描述",
					        	    	   labelVAlign: "top",
					        	    	   labelAlign: "right",
					        	    	   name: "tableDesc",
					        	    	   type: "multiLineInput",
					        	    	   colspan: 3,
					        	    	   height: "100px",
					        	       },
					        	       {
					        	    	   id: "1002114",
					        	    	   label: "实体描述",
					        	    	   labelVAlign: "top",
					        	    	   labelAlign: "right",
					        	    	   name: "entityDesc",
					        	    	   type: "multiLineInput",
					        	    	   height: "100px",
					        	       },
					        	       {
					        	    	   id: "1002115",
					        	    	   label: "备注",
					        	    	   labelVAlign: "top",
					        	    	   labelAlign: "right",
					        	    	   name: "remark",
					        	    	   type: "singleLineInput",
					        	       },
					        	       ]
					        }
					        ]
				}]	
			},
			1001:{
				id:	"1001",
				name:"元数据管理界面",
				desc:"根据JSON对象搭建对应UI界面",
				containers:[{	//容器是不可见的
					id: "1001_1",
					name: "containers1",
					title: "导航栏容器",
					items:[{			//容器下面的控件
						id: "1001_1_1",
						name: "navigate",
						title: "元数据管理",
						type: "navigate", //控件类型，以下为navigate类型的控件的属性
						icon: basePath + "/themes/default/images/common/title.gif",		  //导航栏的图标
						items:[
						    {
						    	id: "1001_1_1_1",
						    	name: "query",
						    	type: "button",
						    	text:"查询",
						    	icon: "icon-search",	//查询按钮的图标
						    	action: {
						    		actionId: "1000",	//后台动作识别码
						    		queryFormId: "1001_2_1", //查询编码
						    		datagridId: "1001_3_1", //影响内容编码
						    		dataAccessId: "1001", //数据访问Id
						    		
						    	}
							},
							{
						    	id: "1001_1_1_2",
						    	name: "add",
						    	type: "button",
						    	text:"新增",
						    	icon: "icon-add",		//查询按钮的图标
						    	action: {
						    		actionId: "1001",	//后台动作识别码
						    		popupWindowId: "1003",	//后台动作识别码
						    	}
							},
							{
								id: "1001_1_1_3",
								name: "edit",
								type: "button",
								text: "修改",		//虽然也是一个button，但是作为容器中的一个控件，而前面的button则是导航控件中的一个元素
								icon: "icon-edit",		//查询按钮的图标
							},
							{
								id: "1001_1_1_4",
								name: "delete",
								type: "button",
								text: "删除",		//虽然也是一个button，但是作为容器中的一个控件，而前面的button则是导航控件中的一个元素
								icon: "icon-remove",		//查询按钮的图标
							},
							]
						},
						]
					},
					{	//查询条件
						id: "1001_2",
						name: "containers1",
						title: "查询栏容器",
						items:[{			
							id: "1001_2_1",
							name: "queryForm",
							title: "页面查询条件",
							type: "queryForm", //控件类型，以下为form类型的控件的属性
							items:[
								    {
								    	id: "1001_2_1_1",
								    	name: "keywordLabel",
								    	type: "label",
								    	text:"关键字",
								    	items:[
								    	       {
								    	    	   id: "1001_2_1_1_2",
								    	    	   name: "keyWord",
								    	    	   type: "singleLineInput",
								    	       }
								    	       ]
									},
									]
	
							
						}]
					},
					{	//数据网格
						id: "1001_3",
						name: "containers3",
						title: "数据网格容器",
						items:[
						       {	//数据网格
								id: "1001_3_1",
								name: "datagrid",
								type: "datagrid", //控件类型，以下为form类型的控件的属性
								dataAccessId: "1001",
								columns:[[
								          {field:'tableName',title:'表名 ',alias:'table_name',align:'left',width:"10%",halign:'center',sortable:true},
								          {field:'tableDesc',title:'表描述',alias:'table_desc',width:"10%",align:'left',halign:'center',sortable:true},
								          {field:'entityName',title:'实体名',alias:'entity_name',width:"25%",align:'left',halign:'center',sortable:true},
								          {field:'entityDesc',title:'实体描述',alias:'entity_desc',width:"15%",align:'left',halign:'center',sortable:true},
								          {field:'isUsed',title:'是否有效',alias:'is_used',align:'center',width:"15%",halign:'center',sortable:true},
								          {field:'sortNo',title:'顺序号',alias:'sort_no',align:'center',width:"15%",halign:'center',sortable:true},
								          {field:'detail',title:'操作',align:'center',halign:'center',width:"10%"},
								      ]]
					       },
						]
					},
					],	
			},
		};
	return result[uiId];
}

function getPopupWindow(id){
	var popupWindow = {
			1003:{
				id: "1003",
				title: "元数据新增信息",
				type: "popwin",
				position: "center",
				uiId: "1002",
				buttons:[
				         {
				        	 id: "1031",
				        	 name: "save",
				        	 text: "保存",
				        	 type: "button",
					    	 icon: "icon-add",		//查询按钮的图标
					    	 action: {
					    		actionId: "10311",	//后台动作识别码
					    		formId: "100211", //查询编码
					    		dataAccessId: "1002", //数据访问Id
					    	 }
				        	 
				         },
				         {
				        	 id: "1032",
				        	 name: "close",
				        	 text: "关闭",
				        	 type: "button",
				        	 icon: "icon-cancel",		//查询按钮的图标
				        	 action: {
				        		 actionId: "10312",	//后台动作识别码
				        	 }
				         
				         },
				         ]
				}
		};
	return popupWindow[id];
}