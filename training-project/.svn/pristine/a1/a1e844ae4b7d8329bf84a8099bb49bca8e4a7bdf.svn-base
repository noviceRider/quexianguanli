/**
 * 根据路径获取并选择员工信息
 */




var num=0;

(function($){
	var methods={
			/**
			 *创建页面控件，根据路径获取员工信息并弹窗显示 
			 *@param width 插件div宽度
			 *@param height 插件DIV高度
			 *@param url 获取员工信息的路径
			 *@param method 访问方式
			 *@param params 获取远程信息时传递的参数
			 *@param async 是否异步 true为异步
			 */
			empMultiSelect:function(options){
				var defaults={
						width:"160px",
						height:"21px",
						url:"",
						method:"post",
						params:{},
						async:true
				};
				//获取用户传入的参数
				var settings = $.extend({}, defaults, options);
				
				
				
				return this.each(function(){
					//获取调用插件的控件ID作为插件内控件的命名标识
					var basicName=$(this).attr("id");
					
					//保存用户选择的列
					var selectedRows=[];
					
					//构造html内容，在调用插件的控件DIV中创建插件内所需的控件
					var str="<div style='border:1px solid skyblue;border-radius:5px' class='"+basicName+"getInfoDiv'><div id='"+basicName+"getInfoInput'  style='width:20%;height:14%;overflow:auto;position:absolute;text-align:left;border:0px solid red;'></div><table style='width:100%'><tr><td  style='width:75%;height:90%;text-align:left;'></td><td style='width:6%;height:90%'><a href='#' id='"+basicName+"removeAll' onclick='removeAll(this)' style='color:red;text-decoration:none;'  >×</a></td><td style='width:15%;height:90%;'><input  class='"+basicName+"getInfoBtn' style='border:none;background-color:skyblue;border-radius:3px;z-index:1000000' type='button' value='•••'></td></tr></table></div><div id='"+basicName+"windowDiv'></div>";
					$(this).html(str);
					
					//为控件设置宽和高
					$("."+basicName+"getInfoDiv").css("height",settings.height);
					$("."+basicName+"getInfoDiv").css("width",settings.width);
					
					//点击插件内按钮弹窗显示远程获取的员工信息
					$("."+basicName+"getInfoBtn").click(function(){
						
						if(settings.url!="" && settings.url!=null){
							
							//创建datagrid数据表格
							var tableStr="<div style='height:5px'></div>&nbsp;&nbsp;&nbsp;&nbsp;请输入关键字&nbsp;<input type='text' id='"+basicName+"empKeyWord' style=''><a href='#' id='"+basicName+"searchEmpBtn' style='margin-left:260px'>查询</a><br><div style='height:5px'></div><table id='"+basicName+"showRemoteInfo' style='width:100%;margin-top:10px'></table>";
							$("#"+basicName+"windowDiv").html(tableStr);
							
							 
							//创建查询关键字输入框
							$("#"+basicName+"empKeyWord").textbox({
								width:"180px",
								prompt:"请输入员工姓名或编号"
							});
							
							
							//表格加载远程数据并分页
							$("#"+basicName+"showRemoteInfo").datagrid({
								url:settings.url,
								queryParams:settings.params,
								pagination:true,
								pageNumber:1,
								pageSize:6,
								pageList:[6,10,15,20],
								autoRowHeight:true,
								columns:[[
								   {field:'cb',checkbox:true},
						           {field:'empId',title:'员工ID',width:"23%",align:'right',halign:"center",hidden:true},    
						           {field:'empCode',title:'员工编号',width:"100px",align:'left',halign:"center"},    
						           {field:'empName',title:'员工姓名',width:"120px",align:'left',halign:"center"},
						           {field:'empType',title:'员工类型',width:"120px",align:'left',halign:"center"},
						           {field:'mobile',title:'电话',width:"120px",align:'left',halign:"center"},
						           {field:'jobPosition',title:'职位',width:"120px",align:'left',halign:"center"},
								]],
								
								/**
								 *选中一行时将数据添加到数组，不添加重复数据
								 *@param rowIndex 选中行下标
								 *@param rowData 选中航数据（对象） 
								 */
								onCheck:function(rowIndex,rowData){
									var IsExist=0;
									for(var i=0;i<selectedRows.length;i++){
										
										if(selectedRows[i].empId==rowData.empId){
											IsExist=1;
											break;
										}
									}
									if(IsExist==0){
										selectedRows.push(rowData);
									}
								},
								
								/**
								 *取消选中一行时将数据从数组移除
								 *@param rowIndex 选中行下标
								 *@param rowData 选中航数据（对象） 
								 */
								onUncheck:function(rowIndex,rowData){
									removeFromObjArray(selectedRows,rowData);
								},
								
								/**
								 *选中所有行时将数据添加到数组，不添加重复数据
								 *@param rows 选择的行数组
								 */
								onCheckAll:function(rows){
									for(var i=0;i<rows.length;i++){
										var IsExist=0;
										for(var j=0;j<selectedRows.length;j++){
											if(rows[i].empId==selectedRows[j].empId){
												IsExist=1;
												break;
											}
										}
										if(IsExist==0){
											selectedRows.push(rows[i]);
										}
									}
								},
								
								/**
								 *取消选择所有行时将所有数据从数组移除
								 *@param rows 取消选择的行数组 
								 */
								onUncheckAll:function(rows){
									for(var i=0;i<rows.length;i++){
										removeFromObjArray(selectedRows,rows[i]);
									}
								},
								
								/**
								 *翻页时勾选数组中存在的数据 
								 *@param pageSize 页数据条数
								 *@param pageNumber 当前页数
								 */
								onLoadSuccess: function (pageNumber, pageSize) {
									var rows= $("#"+basicName+"showRemoteInfo").datagrid('getRows');
									for(var i=0;i<rows.length;i++){
										for(var j=0;j<selectedRows.length;j++){
											if(rows[i].empId==selectedRows[j].empId){
												$("#"+basicName+"showRemoteInfo").datagrid('selectRow',i);
											}
										}
									}
				                }
							});
							
							
							var infoStr="";
							
							//弹出对话框显示数据
							$("#"+basicName+"windowDiv").dialog({
								title: '选择员工',    
							    width: 640,    
							    height: 320,    
							    cache: false,       
							    modal: true ,
							    buttons:[{
									text:'确定',
									 iconCls: 'icon-ok',
									handler:function(){//点击确定按钮触发函数
										
										//获取数据表格选中项
										
										if(selectedRows.length==0){
											$.messager.alert("提示信息","请先选择需要添加的数据","info");
										}else if(selectedRows.length>0){
											//根据选中项构造用户选中的信息，并以标签的形式显示在插件的信息显示区域，在显示选中信息的<span>标签属性内绑定员工关键信息
											for(var i=0;i<selectedRows.length;i++){
												
												infoStr+='<span style="border:0px #ccc solid;border-radius:3px;background-color:#ddd;margin-left:2px;display:block;float: left;" class="'+basicName+'InfoSpan" id="'+selectedRows[i].empCode+','+selectedRows[i].empId+','+selectedRows[i].empName+','+basicName+'">'+selectedRows[i].empName+'<a href="#" onclick="cancelSelect(this)" style="color:blue;text-decoration:none;">×</a></span>';
												
											}
											
											$("#"+basicName+"getInfoInput").html("");
											//选中信息加载到信息显示控件中
											$("#"+basicName+"getInfoInput").html(infoStr);
											$(this).parent().siblings("#"+basicName+"windowDiv").html("");
											$(this).parent().siblings("#"+basicName+"windowDiv").dialog("close");
											
											//点击删除信息时同时删除员工对象数组中的值
											$("#"+basicName+"getInfoInput a").click(function(){
												var empObj={};
												empObj.empId=$(this).parent().attr("id").split(",")[1];
												removeFromObjArray(selectedRows,empObj);
											});
											
										}
									}
								},{
									text:'取消',
									iconCls: 'icon-cancel',
									handler:function(){//点击取消关闭数据表格弹窗
										$(this).parent().siblings("#"+basicName+"windowDiv").html("");
										$(this).parent().siblings("#"+basicName+"windowDiv").dialog("close");
									}
								}]
							});	
							
							//查询员工信息按钮
							$("#"+basicName+"searchEmpBtn").linkbutton({    
							    iconCls: 'icon-search',
							    onClick:function(){
							    	$("#"+basicName+"showRemoteInfo").datagrid('reload',{keyWord:$("#"+basicName+"empKeyWord").textbox('getValue'),accessId:'1301'});
							    }
							}); 
						}else{
							$.messager.alert("提示信息","请先指定获取远程数据URL","info");
						}
					});

					
					$("#"+basicName+"removeAll").click(function(){
						selectedRows.splice(0, selectedRows.length);
					});
					
				});
			},
			
			
			/**
			 *获取用户添加到员工信息显示控件内的员工信息
			 *@param 无
			 *@result JSON 员工对象数组JSON 
			 */
			getSelectedEmp:function(){
				//获取命名标识
				var basicName=$(this).attr("id");
				var infoSpanList= $("."+basicName+"InfoSpan");
				
				//标记信息显示控件内容是否为空，即用户是否选择了员工信息
				var isNull=0;
				for(var n=0;n<infoSpanList.length;n++){
					if($(infoSpanList[n]).text()!=null && $(infoSpanList[n]).text()!=""){
						isNull=1;
						break;
					}
					
				}
				
				//若用户选择不为空，则返回用户所选的员工对象数组JSON串，否则返回null
				if(infoSpanList.length!=0 && isNull==1){
					var infoList=[];
					for(var n=0;n<infoSpanList.length;n++){
						if($(infoSpanList[n]).text()!=null && $(infoSpanList[n]).text()!=""){
							var map={};
							map.empId=$(infoSpanList[n]).attr("id").split(",")[1];
							map.empCode=$(infoSpanList[n]).attr("id").split(",")[0];
							map.empName=$(infoSpanList[n]).attr("id").split(",")[2];
							infoList.push(map);
						}
						
					}
					
					return JSON.stringify(infoList);
				}else{
					return null;
				}
				
			},
			
			
			/**
			 *根据用户调用方法是传入的对象数组，在插件信息显示控件中加载用户传入的员工信息，用于数据回显
			 *@param objList 员工信息数组 
			 */
			setValue:function(objList){
				var basicName=$(this).attr("id");
				var selectedRows= objList;
				if(selectedRows.length==0){
					
				}else if(selectedRows.length>0){
					var infoStr="";
					for(var i=0;i<selectedRows.length;i++){
						 infoStr+="<span style='border:0px #ccc solid;border-radius:3px;background-color:#ddd;margin-left:2px;display:block;float: left;' class="+basicName+"InfoSpan id="+selectedRows[i].empCode+","+selectedRows[i].empId+","+selectedRows[i].empName+">"+selectedRows[i].empName+"<a href='#' onclick=cancelSelect(this) style='color:blue;text-decoration:none;'  class="+selectedRows[i].empCode+">×</a></span>";
					}
					$("#"+basicName+"getInfoInput").html(infoStr);

				}	
			}
	};
	
	
	$.fn.empMultiSelect=function(){
		
		var method = arguments[0];
		  
	    if(methods[method]) {
	        method = methods[method];
	
	        // 我们的方法是作为参数传入的，把它从参数列表中删除，因为调用方法时并不需要它
	        arguments = Array.prototype.slice.call(arguments, 1);
	    } else if( typeof(method) == 'object' || !method ) {
	        method = methods.init;
	    } else {
	        $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
	        return this;
	    }
	
	    // 用apply方法来调用我们的方法并传入参数
	    return method.apply(this, arguments);		
	};
})(jQuery);

/**
 * 去除所选信息
 * @param span对象
 */
function cancelSelect(a){

	$(a).parent().hide();

	
}

/**
 * 去除所有所选信息
 * @param span对象
 */
function removeAll(a){

	$(a).parent().parent().parent().parent().siblings().html("");
}

/**
 * 删除对象数组中某个对象
 * @param ObjArray 对象数组
 * @param Obj 删除的对象
 */
function removeFromObjArray(objArray,obj){
	if(objArray.length>0){
		for(var i=0;i<objArray.length;i++){
			if(objArray[i].empId==obj.empId){
				objArray.splice(i,1);
			}
		}
	}
}