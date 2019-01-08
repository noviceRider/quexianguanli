(function ($){
	//外部对话框id
	var divId;
	//动态创建的搜索框id
	var searchForm;
	//动态创建的表格id
	var dictTable;
	//输入框关键字id
	var keyWord;
	//动态创建的已选标签id
	var selectedTagId;
	
	var idSeed;
	
	//定义一个数组装标签id
	var tagIdArray = [];
	//定义一个数组装标签名字
	var tagNameArray = [];

	//外部定义房源、客源、置业顾问
	var forHouseResourceInner;
	var forClientResourceInner;
	var forAgentInner;
	
	var methods = {
	    	/**
	    	 * 功能：初始化对话框
	    	 * 参数：options
	    	 * 		id:对话框id
	    	 * 		onSelect():选择某条标签调用的方法
	    	 * 		onCancel():关闭对话框
	    	 */
	        init: function (options) {
	            //创建默认值，拓展任何被提供的选项
	        	var defaults = {
	        		onSelect: $.noop,
	                onClose: $.noop
	        	};
	        	
	        	 var settings = $(this).data('settings');

	             if (!settings) {
	                 settings = $.extend({
	                     id: $(this).attr('id')
	                 }, defaults);
	          
	                idSeed = new Date().getTime();
	                divId = "divId" + idSeed;
	                searchForm = "searchForm"+idSeed;
	                dictTable = "dictTable"+idSeed;
	                keyWord = "keyWord"+idSeed;
	                selectedTagId = "selectedTagId"+idSeed;
	             }
	        	
	           //使用外部传入的参数更新默认参数
	             $.extend(settings, settings, options);
	             $(this).data('settings', settings);


	             // 初始化对话框
	             initSelTagDialog($(this).data('settings'));
	        },
	   
	        /**
	         * 功能：打开对话框
	         */
	        open: function () {
	        	openSelTagDialog($(this).data('settings'));
	        	//openSelTagDialog();
	        }
	};
	$.fn.selTagDialog = function (method) {
		// 方法调用
		if (methods[method]) {
		     return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else if (typeof method === 'object' || !method) {
		     return methods.init.apply(this, arguments);
		} 
		else {
		     $.error('Method' + method + 'does not exist on jQuery.selTagDialog');
		}
	};
	
	
	/**  
	 *  功能：初始化对话框
	 *	1、定义对话框中的布局、包含关键字、datagrid
	 *	2、给双击、选择、取消绑定事件
	 *	@param: params
	 *	id,对话框id，默认是selTagDialog
	 *	onSelect(tagInfo),选择某个标签，参数是tagInfo
	 *	onCancel(),关闭对话框
	*/
	function initSelTagDialog(params){
		if(params.id==null){  //判断对话框id若为空，则默认等于selTagDialog
			divId="selTagDialog";
		}else{ //不为空对话框id则等于页面传入进来的
			divId=params.id;
		}
	
		//设置对话框
		$("#"+divId+"").dialog({
			modal:true,
			title:"选择标签",
			width:480,
			height:500,
			closed:true,
			onClose : function() {  
				//关闭按钮时重置查询表单
				$("#"+searchForm).form("reset");
			},
			buttons:[ 
				{   //设置选择按钮
					text:"选择",
					iconCls:"icon-save",
					handler:function(){
						//获取已选标签中的数据（包括标签name和id）
						var rows={tagNameArray,tagIdArray};
						params.onSelect && params.onSelect(rows);
		                params.onCancel && params.onCancel();
		                $("#" + divId).dialog("close");
					}
				},
				{
					// 设置关闭按钮
					text:"取消",
					iconCls:"icon-cancel",
					handler:function() {
						 params.onCancel && params.onCancel();
		                 $("#" + divId).dialog("close");
					}
				}
			],
		}).dialog("center");
		
		//动态创建查询表单
		var childForm=$("<form id='" +searchForm+ "'><table class='btbForm'><tr>" +
				"<td>关键字&nbsp;<input name='keyWord' id='" +keyWord+"' class='easyui-textbox' style='width:200px' data-options=\"prompt:'请输入标签名称'\"></td>" +
				"</tr></table></form>");
		$("#"+divId).append(childForm);
		$.parser.parse(childForm);
		
		//获取焦点，查询
		$("#"+keyWord).textbox().next("span").find("input").keyup(function(){
			searchTag(this.value);
		});
		
		//动态创建对话框中的table（数据网格）
		var childTable=$("<table id='" +dictTable+ "' class='easyui-datagrid'></table>");
		$("#"+divId).append(childTable);
		
		$("#"+dictTable).datagrid({
			//双击行事件
			onDblClickRow:function(){
				//获取选中行的数据
				var row=$("#"+dictTable).datagrid("getSelected");
				if(params.onSelect){ //判断是否传入的params参数，onSelect方法是否存在
					params.onSelect(row);
					params.onCancel();
				}
			}
		});
		
		//动态创建已选标签
		var selectedTag=$("<div id='" +selectedTagId+"' style='margin-left:20px;margin-top:10px;display:inline-block'><span style='font-size:14px;color:#000'>已选标签：</span></div>");
		$("#"+divId).append(selectedTag);
		
		
		/**
		 * 点击一个已选标签就删除它
		 */
		 $("#" + divId).on("click", "a.a_tagId", function () {
			//找到a标签
			 var  aAttr =  $(this);
			 removeTagById(aAttr.data('id'));
			 
			 aAttr.remove();
		 });
	}
	
	/**
	 * 删除标签
	 */
	function removeTagById(deleteId){
		//调用存选择标签的数组,得到存放已选标签的id和name
		storeTag();

		//装除去删除之外的其它标签id，name
		var newIdArray=[];
		var newNameArray=[];
		for (var i = 0; i < tagIdArray.length; i++) {
	        if (tagIdArray[i] != deleteId) {
	            newIdArray.push(tagIdArray[i]);
	            newNameArray.push(tagNameArray[i]);
	        }
	    }
		tagIdArray = newIdArray;
	    tagNameArray = newNameArray;

	}
	
	/**
	 * 存选择标签的数据
	 */
	function storeTag(){
		//得到被选中的那一行数据
	    var selectRows = $("#"+dictTable).datagrid("getSelections");
	    
	    for(var i in selectRows){
	    	//不存在时才push
	    	if(tagNameArray.indexOf(selectRows[i].tagName)==-1){
	    		//将选中数据的标签名称放在数组中
	    		tagNameArray.push(selectRows[i].tagName);
	    	}
	    	if(tagIdArray.indexOf(selectRows[i].tagId)==-1){
	    		//将选中数据的标签id放在数组中
	    		tagIdArray.push(selectRows[i].tagId);
	    	}
		}
	}
	

	/**
	 * 功能：1、加载数据网格
	 * 		2、打开标签选择对话框
	 */
	function openSelTagDialog(){ 
		//调用加载数据网格函数
		initData();
		
		//打开对话框
		$("#"+divId).dialog("open");
	}

	/**
	 * 功能：加载数据网格数据
	 */
	function initData(){
		//加载数据网格
		$("#"+dictTable).datagrid({
			url:basePath + "/dataaccess.json",
			queryParams:{
				accessId:"201801",
				sort:"refCount",
				order:"DESC",
				forHouseResource:forHouseResourceInner,
				forClientResource:forClientResourceInner,
				forAgent:forAgentInner,
			}, 
			pagination:true,
			columns:[[
				{field:'tagName',title:'标签名称',width:'98%',align:'left',halign:'center'},
			]],
			onClickRow:onClickRow,
		});
		
	}

	/**
	 * 功能：查询员工信息
	 */
	function searchTag(value){
		var params={};
		params.keyWord = value;
		params.accessId = "201801";
		$("#"+dictTable).datagrid("load", params);
	}
	
	/**
	 * 单击行事件 点击选中标签就将这条记录显示在已选标签
	 * @param rowIndex:该行的下标
	 * @param rowData:该行的数据
	 */
	function onClickRow(rowIndex,rowData){
		//调用存选择标签的数组
		storeTag(rowIndex,rowData);
		var tag=$("#"+dictTable).datagrid("getSelections")[0];
		
		//动态创建a标签
		var a_selectedTag=$("<a href='javascript:;' class='a_tagId' style='color:#000;margin-left:10px;text-decoration:none' data-id='"+tag.tagId+"'></a>");
		$("#"+selectedTagId).append(a_selectedTag);
	    
		//找到a标签
		var  aAttr = $("#"+selectedTagId).find('a.a_tagId');
		
		//为a标签的内容赋值
		for(var i in tagNameArray){
			$(aAttr).eq(i).html(tagNameArray[i]);
		}
		
		//设置表格复选框为全不选
	 	$("#"+dictTable).datagrid("unselectAll");
	}
	
	
})(jQuery);
