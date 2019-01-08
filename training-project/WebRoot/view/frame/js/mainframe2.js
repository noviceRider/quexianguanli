//当前登录用户
var user;
var count=0;//我的任务条数
var eventCount = 0;//未处理的风险事件的条数
var notpassCount = 0;//未审批的设备申请条数
var flag = false;//判断用户是否是能通知审批记录的角色
var recordCount = 0;//违章条数
/**
 * 功能:动态加载树形菜单
 * 参数：无
 */
$(function(){
	$.ajax({
		url:basePath + "/frame_sysrole_finduser.json",
		type:"post",
		async:false,
		success:function(data){
			user=data.user;
			$("#userName1").text(user.userName);
			$("#roleNameList").text(user.deptName+"/"+user.roleNameList);
		}
	});
	//动态添加根目录 
	$.ajax({
		url:basePath + "/frame_menu_findusermenu.json",
		type:"post",
		async:false,
		data:{roleList:user.roleList},
		success:function(data){
			for(var i in data.rows) {
				$("<div class='divNav_every'>&nbsp;&nbsp;&nbsp;<a>"+ data.rows[i].text+"</a></div>")
				.attr("id",data.rows[i].id)
				.mouseover(function(){
					this.className = "divNav_everyHover";
				})
				.mouseout(function(){
					this.className = "divNav_every";
				})
				.appendTo($(".divNav_inner"));
			};
		}
	});
	//给根目录添加点击事件
	$(".divNav_every").click(function() {
		changeModule($(this).attr("id"));
		//若导航菜单隐藏，则打开
		if($("#left").css("display") == "none") {
			$(".easyui-layout").layout("expand","west");
		}
	});
	//默认加载系统维护菜单
	changeModule($(".divNav_every:first").attr("id"));
	//默认显示图片
	$("#centerHtml").attr("src","img.html");
	//设置欢迎标语
	$.ajax({
		url:basePath + "/frame_mainframe_welcome.json",
		type:"post",
		success:function(data){
			$("#welcome").text(data.welcome);
		}
	});
	
	//主题列表
	$.ajax({
		url:basePath+"/frame_mainframe_findthemes.json",
		type:"post",
		dataType:"json",
		success:function(data){
			var themes = data.themeList;
			for(var i = 0;i<themes.length;i++){
				$('#menuStyle').menu('appendItem', {
					id:themes[i].themeName,
					text:themes[i].themeDesc,
					href:basePath+"/"+themes[i].mainFrameUrl,
					onclick: function(){
						//将主题名称保存到cookie
						cookie('ezframe.theme', this.id, {expires: 7,path:basePath});
					}
				});
			}
		}
	});
	
	//设置版权信息
	$("#frameTitle").text(copyright('frame.title'));
	$("#frameCopyright").text(copyright('frame.copyright'));
	$(".divHead_title").css("background-image","url("+basePath+"/"+getIcons('03.jpg')+")");
	
	//每隔60秒自动调用updateLastAccessTime函数,让服务端更新最近访问时间
	window.setInterval(updateLastAccessTime, 60 * 1000);
	
});


/**
 * 每隔60秒钟调用一下这个函数，去向服务器发送一个请求，让服务端更新最近访问时间
 */
function updateLastAccessTime(){
	try{
		$.ajax({
			url:basePath + "/frame_mainframe_updateLastAccessTime.json",
			type:"post",
			success:function(data){
				
			}
		});
   	}catch(e){
   		
   	}
}

/**
* 功能：进行模块的切换，调用此方法后该模块的功能菜单区会随之变化
* 参数：moduleId 需要切换的模块编号
**/
changeModule = function(moduleId) {
	$("#tt").tree({
		url:basePath + "/frame_menu_findusermenu.json",
		method:"post",
		animate:true,
		loadFilter:function(data,parent){
			//console.log(data.rows);
			return data.rows;
		},
		onClick:function(node) {
			$.ajax({
				url:basePath + "/frame_menu_findbyid.json",
				type:"post",
				data:{menuId:node.id},
				success:function(data){
					if(node.state == "closed") {
						$('#tt').tree('expand', node.target); 
					}else{
						if(data.menu.url != " " && data.menu.url != null) {
							var url;
							if(data.menu.url.startWith("/")){
								url = data.menu.url.trim();
							}else{
								url = basePath +"/"+data.menu.url.trim();
							}
							$("#centerHtml").attr("src",url);
							//添加操作日志
							addOperationLog(data.menu.menuId,data.menu.menuName);
						}
						//切换节点的展开/折叠状态
						$("#tt").tree("toggle",node.target);
					}
				}
			});

		},
		onBeforeLoad:function(node,param) {
			param.roleList = user.roleList;
			//加载数据的请求前传入参数
			if(node != null) {
				param.menuId = node.id;
			}else{
				param.menuId = moduleId;
			}
		},
        onLoadSuccess:function(node,data){ 
/*        	console.log(node);
        	console.log(data);*/
			$(this).css("color", "#407EAC");    // 改变tree字体颜色
        	//var node = $('#tt').tree('find', data[0].id);
    		//默认展开第一个节点
    		//$('#tt').tree('expand', node.target); 
         }
	});
};

/**
 * 修改密码弹窗
 */
function modifyPwd() {
	$("#userName_form").text(user.userName);
	$("[name='userId']").val(user.userId);
	pwdValid();
	$("#changePwd").show().dialog({
		title:"修改密码",
		modal: true,
		buttons:"#btns_dlg",
		iconCls:"icon-edit",
		onClose:function(){
			$("#form_changePwd").form('reset');
		}
	});
};

/**
 * 保存
 */
function doSave(){
	if($("#form_changePwd").form('validate')) {
		var formData = $("#form_changePwd").serializeObject();
		formData.logicId = "09.01.05";
		$.ajax({
			url: logicUrl,
			type: "post",
			data: formData,
			dataType: "json",
			success: function(data){
				if(data.resultCode==1){
					doClose();
				}else if(data.resultCode==2){
					$.messager.alert("提示信息","密码输入错误！","info");
				}else{
					$.messager.alert("提示信息","密码修改失败！","info");
				}
			}
		});
	}
}

/**
 * 密码输入验证
 */
function pwdValid(){
	$("[name='oldPassword']").validatebox({
		required:true,
		missingMessage:"请输入原密码"
	});
	$("[name='password']").validatebox({
		required:true,
		missingMessage:"请输入新密码",
		invalidMessage:"密码的最小长度不能小于6位",
		validType:"minLength[6]"
	});
	$("[name='surePassword']").validatebox({
		required:true,
		missingMessage:"请再次输入新密码",
		invalidMessage:"两次密码不一致",
		validType:"equals['#password']"
	});
}

/**
 * 关闭密码修改对话框
 */
function doClose(){
	$("#changePwd").dialog("close");
}

/**
 * 添加操作日志
 * @param userId 当前登录用户编号
 * @param moduleId 模块编号
 */
function addOperationLog(moduleId, moduleName) {
	$.ajax({
		url:logicUrl,
		type:"post",
		data:{moduleName:moduleName,moduleId:moduleId,logicId:"09.05.01"},
		dataType:"json"
	});
}

$.extend($.fn.validatebox.defaults.rules, {
	minLength:{
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    equals: {
		validator: function(value,param){
			return value == $(param[0]).val();
		},
		message: 'Field do not match.'
    }
});

/**
 * 退出系统
 */
function logout1(){
	if(window.confirm("请确认是否现在就退出系统？")){
		$.ajax({  
			url:basePath + "/frame_mainframe_logout.json",
			type:"post",
			dataType:"json",  
			success:function(data) {
				if(data.resultCode==1) {
					window.location = basePath;
				}
				else
					$.messager.alert("错误","退出过程中出现问题!","error");
			},  
			error : function() {
				$.messager.alert("错误","服务器内部错误!","error");
			}
		});
	}
}

/**
 * 查询版权信息
 * @param paramId 系统参数
 */
function copyright(paramId) {
	var param = "";
	$.ajax({
		url:basePath + "/apron_punish_sysparam_findbyid.json",
		type:"post",
		async:false,
		data:{paramId:paramId},
		success:function(data){
			param = data.param.paramValue;
		}
	});
	return param;
}


/**
 * 转换日期格式的日期时间显示
 * 以yyyy-MM-dd HH:mm格式
 */
function timeformatter(value){
	if(Date.parse(value)){
		return new Date(Date.parse(value)).pattern("yyyy-MM-dd HH:mm ");
	}
}

/**
 * 获取icon
 * @param iconId
 * @returns {String}
 */
function getIcons(iconId){
	var iconPath = '';
	//获取icon
	$.ajax({
		url:basePath+"/frame_mainframe_findicons.json",
		type:"post",
		data:{iconsId:iconId},
		dataType:"json",
		async:false,
		success:function(data){
			iconPath = data.icons.rows.userFilePath;
		}
	});
	return iconPath;
}

