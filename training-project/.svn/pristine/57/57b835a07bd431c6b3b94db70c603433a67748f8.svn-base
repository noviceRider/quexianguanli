var DYNAMIC_FORM = {
	/**
	 * 解析
	 * @param json
	 */
	parser: function(json,pjqObj){
		if(typeof(json) == "string"){
			JSON.stringify(json);
		}else if(typeof(json) == "object"){
			$("#"+json.id).remove();
			
			var pjqObj1 = pjqObj?pjqObj:$("body");
			
			//根节点
			var rootDiv  = $("<div></div>").attr({
				id: json.id,
				name: json.name,
				desc: json.desc
			})
			.css({
				"width": "100%",
				"overflow-y": "auto",
				"overflow-x": "hidden"
			})
			.appendTo(pjqObj1);
			
			//容器
			$(json.containers).each(function(index){
				var container = this;
				var containerDiv = $("<div></div>")
				.attr({
					id: container.id,
					name: container.name,
				})
				.css({
					width: "100%",
					"margin-top": "5px",
				})
				.appendTo(rootDiv);
			
				//控件
				$(container.items).each(function(){
					DYNAMIC_FORM.controlManage(containerDiv,this);
				});
			});
		}else{
			console.error("参数异常");
		}
	},
	
	/**
	 * 功能：页面弹窗解析
	 */
	popWindowParser: function(popupWindowId){
		var json = getPopupWindow(popupWindowId);
		if(typeof(json) == "string"){
			JSON.stringify(json);
		}else if(typeof(json) == "object"){
			$("#"+json.id).remove();

			//根节点
			var window  = $("<div></div>").attr({
				id: json.id,
				title: json.title,
			})
			.css({
				"width": "600px",
			})
			.appendTo("body");
			
			DYNAMIC_FORM.parser(getUIJson(json.uiId),window);
			
			var buttons = [];
			$(json.buttons).each(function(){
				var button = {};
				button.text = this.text;
				button.iconCls = this.icon;
				buttons.push(button);
			});
			
			window.show().dialog({
				closed: false,
				modal : true,
				title : json.title,
				buttons: buttons
			});
		}else{
			console.error("参数异常");
		}
		
	},
	
	/**
	 *  功能：控件管理
	 * @param pjqObj
	 * @param items
	 */
	controlManage: function(pjqObj,item){
		if(item.type == "navigate"){
			DYNAMIC_FORM.controls.navigate(pjqObj,item);
		} else if(item.type == "queryForm"){
			DYNAMIC_FORM.controls.queryForm(pjqObj,item);
		} else if(item.type == "label"){
			DYNAMIC_FORM.controls.label(pjqObj,item);
		} else if(item.type == "button"){
			DYNAMIC_FORM.controls.button(pjqObj,item);
		} else if(item.type == "singleLineInput"){
			DYNAMIC_FORM.controls.singleLineInput(pjqObj,item);
		} else if(item.type == "multiLineInput"){
			DYNAMIC_FORM.controls.multiLineInput(pjqObj,item);
		} else if(item.type == "datagrid"){
			DYNAMIC_FORM.controls.datagrid(pjqObj,item);
		} else if(item.type == "InputForm2Column"){
			DYNAMIC_FORM.controls.InputForm2Column(pjqObj,item);
		}
	},
	/**
	 * 控件存放位置
	 */
	controls: {
		/**
		 * 功能：导航栏插件
		 * @param pjqObj
		 * @param params
		 */
		navigate: function (pjqObj,params){
			var table =$("<table></table>")
			.attr({
				id: params.id
			})
			.css({
				"width": "100%",
				"padding": "5px"
			})
			.appendTo(pjqObj);
			
			var tr = $("<tr></tr>")
			.appendTo(table);
			
			var td =  $("<td></td>")
			.css({
				"width": "25%"
			})
			.appendTo(tr);

			$("<img/>")
			.attr({
				"src": params.icon
			})
			.css({
				"vertical-align": "middle"
			})
			.appendTo(td);
			
			$("<label></label>")
			.text(params.title)
			.appendTo(td);

			var btnTd =  $("<td></td>")
			.css({
				"text-align": "right"
			})
			.appendTo(tr);
			$(params.items).each(function(){
				DYNAMIC_FORM.controlManage(btnTd,this);
			});
		},

		/**
		 * 功能：查询表单对应控件
		 * @param pjqObj
		 * @param params
		 */
		queryForm: function (pjqObj,params){
			var form = $("<form></form>")
			.attr({
				id: params.id
			})
			.appendTo(pjqObj);
			
			var table = $("<table></table>")
			.attr({
				"class":"btbForm"
			})
			.appendTo(form);
			
			var tr = $("<tr></tr>")
			.appendTo(table);
			
			var td =  $("<td></td>")
			.appendTo(tr);
			
			$(params.items).each(function(){
				DYNAMIC_FORM.controlManage(td,this);
			});
		},
		
		/**
		 * 功能：普通文本框对应控件
		 * @param pjqObj
		 * @param params
		 * @returns
		 */
		label: function (pjqObj,params){
			$("<label></label>")
			.attr({
				id: params.id,
			})
			.css({
				"margin-right": "10px"
			})
			.text(params.text)
			.appendTo(pjqObj);
			
			$(params.items).each(function(){
				DYNAMIC_FORM.controlManage(pjqObj,this);
			});
		},

		/**
		 * 功能：单行文本输入框对应控件
		 * @param pjqObj
		 * @param params
		 * @returns
		 */
		singleLineInput: function (pjqObj,params){
			
			if(params.colspan){
				//文本单元格
				var td1 = $("<td></td>")
				.css({
					"vertical-align": params.labelVAlign,
					"text-align": params.labelAlign,
					"width": "80px",
				})
				.appendTo(pjqObj);
			    
				$("<label></label>")
				.text(params.label+"：")
				.appendTo(td1);
				
				//输入框单元格
				var td2 = $("<td></td>")
				.appendTo(pjqObj);
				
				var textbox = $("<input/>")
				.attr({
					id: params.id,
					name: params.name,
				})
				.css({
				})
				.appendTo(td2);
				textbox.textbox();
			} else{
				var textbox = $("<input/>")
				.attr({
					id: params.id,
					name: params.name,
				})
				.appendTo(pjqObj);
				textbox.textbox();
			}
		},
		
		/**
		 * 功能：多行文本输入框对应控件
		 * @param pjqObj
		 * @param params
		 * @returns
		 */
		multiLineInput: function (pjqObj,params){
			if(params.colspan){
				//文本单元格
				var td1 = $("<td></td>")
				.css({
					"vertical-align": params.labelVAlign,
					"text-align": params.labelAlign,
					"width": "80px",
				})
				.appendTo(pjqObj);
			    
				$("<label></label>")
				.text(params.label+"：")
				.appendTo(td1);
				
				//输入框单元格
				var td2 = $("<td></td>")
				.attr({
					colspan: params.colspan
				})
				.appendTo(pjqObj);
				
				var textbox = $("<input/>")
				.attr({
					id: params.id,
					name: params.name,
					"data-options": "multiline:true",
				})
				.css({
					height: params.height,
					width: td2.width(),
				})
				.appendTo(td2);
				textbox.textbox();
			} else{
				var textbox = $("<input/>")
				.attr({
					id: params.id,
					name: params.name,
					"data-options": "multiline:true",
				})
				.css({
					height: params.height,
				})
				.appendTo(pjqObj);
				textbox.textbox();
			}
		},
		
		/**
		 * 功能：数据网格控件
		 * @param pjqObj
		 * @param item
		 */
		datagrid: function (pjqObj,params){
			var datagrid = $("<table/></table>")
			.attr({
				id: params.id,
				name: params.name,
			})
			.css({
				"width": "100%",
				"height": "700px",
			})
			.appendTo(pjqObj);
			
			datagrid.datagrid({
				pagination:true,
				pageSize:20,
				striped:true,
				autoRowHeight:true,
				url: getDataAccessUrl(params.dataAccessId),
				columns: params.columns,
			});
		},
		
		/**
		 * 功能：按钮对应控件
		 * @param pjqObj
		 * @param params
		 * @returns
		 */
		button: function (pjqObj,params){
			var linkbutton = $("<a></a>")
			.attr({
				id: params.id,
		    	name: params.name,
		    	"data-options": "iconCls:'"+params.icon+"'"
			})
			.css({
				"margin-left":"10px",
				"padding": "0px 10px"
			})
			.text(params.text)
			.appendTo(pjqObj)
			.click(function(){
				if(params.action){
					if(params.action.actionId){
						eval(getScriptByAction(params.action));
					}
				}
			});
			linkbutton.linkbutton();
			
			return linkbutton;
		},
		
		/**
		 * 功能：输入两列表单对应控件
		 * @param pjqObj
		 * @param params
		 */
		InputForm2Column: function (pjqObj,params){
			var form = $("<form></form>")
			.attr({
				id: params.id
			})
			.appendTo(pjqObj);
			
			var table = $("<table></table>")
			.css({
				width: "100%"
			})
			.appendTo(form);
			
			var usableColumn = 2;
			var occupyColumn = 0;
			var tr = "";
			$(params.items).each(function(index){
				var colspan = this.colspan?this.colspan:1;
				var elementColumn = (colspan+1)/2;
					this.colspan = colspan;
					occupyColumn += elementColumn;
				if(elementColumn <= usableColumn){
					if(occupyColumn == elementColumn){
						tr = $("<tr></tr>")
						.appendTo(table);
						DYNAMIC_FORM.controlManage(tr,this);
					} else if(occupyColumn <= usableColumn){
						DYNAMIC_FORM.controlManage(tr,this);
					}
					
					if(occupyColumn == usableColumn){
						occupyColumn = 0; 
					}
				}
			});
		},
	},
};

/**
 * 获取模板及生成JS信息
 * @param action
 * @returns
 */
function getScriptByAction(action) {
	//下面这些将来都是后台操作，js只需要传入action对应的json
	//前端调用非常简单，只需要访问一个url，传入action对应的json，就可以得到js
	//1、获取actionId
	var actionId = action.actionId;
	//2、根据actionId到服务器端获取对应的模板数据，如下(目前是用的embedded js template，将来用的是freemaker)：
	var template = "";
	var js = "";
	if(actionId == "1000"){
		template = "var queryParams = $(\"#<%= queryFormId%>\").serializeObject();" +
		"$(\"#<%= datagridId%>\").datagrid(\"load\",queryParams);";
		
		js = new EJS({ text: template }).render(action);  
	} else if(actionId == "1001"){
		template = "DYNAMIC_FORM.popWindowParser(<%= popupWindowId%>);";
		js = new EJS({ text: template }).render(action);
	}
	//3、从action中取得queryFormId以及datagridId
	//4、将模板中的id用action中对应的id进行替换
	return js;
}

/**
 * 获取完整数据访问路径
 * @param accessId
 */
function getDataAccessUrl(accessId){
	var  url = basePath + "/gmodule_commondata_metamanage_findpage.json";
	
	return url;
}
