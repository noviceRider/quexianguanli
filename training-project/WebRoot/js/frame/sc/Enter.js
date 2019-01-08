var basePath = getWebAppRootPath();

/**
* 功能：页面加载完毕后执行的函数，相当于window.onload的作用
* 参数：无
**/
$(function() {
	//如果cookie中的theme为空，则根据action中的themeName设置cookie，让cookie和session中的theme始终保持一致
	//cookie('ezframe.companyId', $F('companyId'), {expires: 7});
	//cookie('ezframe.theme', $F('themeName'), {expires: 7});
	
	//将当前风格从cookie中取出来，写入到隐藏域中，这样做是为了和以前的逻辑保持一致
	if(cookie('ezframe.theme')==null){
		cookie('ezframe.theme', 'default', {expires: 7});
	}
	$('#themeName').val(cookie('ezframe.theme'));
	
	//如果上次登录选择了记住用户名和密码，则直接从cookie中读出用户名和密码
	if(cookie('ezframe.rememberFlag') == '1') {
		$('#userId').val(cookie('ezframe.userId'));
		$('#password').val(cookie('ezframe.password'));
		$("#rememberLoginInfo")[0].checked = true;
	}
	else 
		$("#rememberLoginInfo")[0].checked = false;

	
	//将焦点设置到用户名上面
	setTimeout(function() {	$('#userId').focus(); }, 500);
	
	//增加主题切换处理方法
	$('#themeName').change(function() {
		//将所选择的主题名称存入到cookie中，使得关闭浏览器后所选择的主题下次任然生效
		//在cookie中保存的时间为10天
		cookie('ezframe.theme', $('#themeName').val(), {expires: 7});
			
		//向后台发送action请求,将新切换的主题保存到session中，使得页面刷新，通过head标签使得页面使用主题相关的js、css
		$('#form1').submit();
	});
			
	//给登录按钮增加事件处理
	$('#password').keypress(function(event) {
		//如果在密码输入域敲了回车，就触发一个登陆的动作
		if(event.keyCode==13) {
			//阻止时间的默认行为
			Event.stop(event);
			
			loginSystem();
		}
	});
	
	//切换到扫码界面
	$("#qrcode").click(function(){
		$("#rc").css("display","none");
		$("#lc").css("display","none");
		$("#sm").css("display","block");
		$("#reg-top").css("display","none");
	});
	//切换到登录界面
	$("#screen").click(function(){
		$("#reg-top").css("display","block");
		$("#sm").css("display","none");
		$("#rc").css("display","block");
	});
	
	
	//给登录按钮增加事件处理，登录进入系统
	$('#loginBtn').click(loginSystem);
	$('#login-btn').click(loginSystem);
});

/**
* 功能：登录进入系统
**/
loginSystem = function() { 
	// 验证用户名
	if (vlidateInputValue()) {
		return;
	}
	
	//登录鉴权接口
	$.ajax({
		type:"post",
		url:basePath + "/sc_auth.json",
		data:{userId:$('#userId').val(),password:$('#password').val()},
		dataType: "json",
		success:function(data) {

			//根据是否记住密码决定将用户名密码保存到cookie中
			if($("#rememberLoginInfo")[0].checked){
				//缓存账户和密码,公司编号。保留7天
				cookie('ezframe.userId',$('#userId').val(), {expires: 7});
				cookie('ezframe.password',$('#password').val(), {expires: 7});
				cookie('ezframe.rememberFlag','1',{expires: 7});
			}
			else {
				//不缓存账户和密码，公司编号。保留7天
				cookie('ezframe.userId','', {expires: 7});
				cookie('ezframe.password','', {expires: 7});
				cookie('ezframe.rememberFlag','0', {expires: 7});
			}

			//验证返回结果处理
			if(data.resultCode == 0) {
				//是合法用户，进一步取得该主题对应的主框架url
				window.location = basePath + "/view/frame/newframe.html";
			}
			else if(data.resultCode == 4) {
				//首次登陆成功，强制修改密码
				window.location = 'user.action?forceModify=1&forceType=0';
			}
			else if(data.resultCode == 5) {
				//密码已经过期，强制修改密码
				window.location = 'user.action?forceModify=1&forceType=1';
			}
			else if(data.resultCode == 6) {
				//已经有人使用该帐号登录系统
				alert("已经有人使用该帐号成功登录系统，同一帐号不能在两个地方同时使用，请与管理员联系！");
			}
			else if(data.resultCode == 7) {
				alert("没有加密狗或者不是合法的license");
			}
			else if(data.resultCode == 8) {
				alert("授权信息已过期，请与管理员联系！");
			}
			else if(data.resultCode == 9) {
				alert("未开通授权，请与管理员联系！");
			}
			else {
				alert("用户名或者密码错误，请重试！");
				//jAlert("用户名或者密码错误，请与管理员联系！","提示");
				$('userId').focus();
				$('userId').select();
			}	
		}
	});
	
	/*login.auth($F('userId'), $F('password'), $F('companyId'),
		function(data) {

			var mainFrameUrl = "";
		
			if(data == 0) {
				if($("#rememberLoginInfo").attr("checked")){
					//缓存账户和密码,公司编号
					cookie('ezframe.userId',$F('userId'), {expires: 90});
					cookie('ezframe.password',$F('password'), {expires: 90});
					cookie('ezframe.rememberFlag','1',{expires: 90});
					cookie('ezframe.companyId', $F('companyId'), {expires : 90});
				}
				else {
					//缓存账户和密码，公司编号
					cookie('ezframe.userId','', {expires: 90});
					cookie('ezframe.password','', {expires: 90});
					cookie('ezframe.rememberFlag','0', {expires: 90});
					cookie('ezframe.companyId', $F('companyId'), {expires : 90});
				}
				
				
				//是合法用户，进一步取得该主题对应的主框架url
				login.getMainFrameUrl($F('themeName'), $F('companyId'), function(data){
						//跳转到对应的页面，和下面这句作用一样，只不过下面是跳转到某个固定的风格
						//window.location = "themes.default.index.action";
						//window.location = data;
						window.location = "view/frame/mainframe2.html";
					});
			}
			else if(data == 4) {
				//首次登陆成功，强制修改密码
				window.location = 'user.action?forceModify=1&forceType=0';
			}
			else if(data == 5) {
				//密码已经过期，强制修改密码
				window.location = 'user.action?forceModify=1&forceType=1';
			}
			else if(data == 6) {
				//已经有人使用该帐号登录系统
				alert('已经有人使用该帐号成功登录系统，同一帐号不能在两个地方同时使用，请与管理员联系！');
			}
			else if(data == 7) {
				alert('没有加密狗或者不是合法的license');
			}
			else if(data == 8) {
				alert('授权信息已过期，请与管理员联系！');
			}
			else if(data == 9) {
				alert('未开通授权，请与管理员联系！');
			}
			else {
				alert('用户名或者密码错误，请与管理员联系！');
				$('userId').focus();
				$('userId').select();
			}				
		});*/
};

/**
 * 验证用户名和密码不能为空
 */
vlidateInputValue = function() {
	// 获取用户输入的值
	var userId = $("#userId").val();
	var flag = false;
	
	if (null == userId || "" == userId) {
		alert("用户名不能为空，请输入！");
		flag = true;
		$("#userId").focus();
	}
	
	return flag;
};

/**
 * 获取web应用程序根路径
 */
function getWebAppRootPath(){
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	if (webName == "") {
	  return window.location.protocol + '//' + window.location.host;
	} else {
	  return window.location.protocol + '//' + window.location.host + '/' + webName;
	}
}
