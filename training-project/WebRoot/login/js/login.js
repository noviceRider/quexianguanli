/*==========登录方式的切换=============*/
//登录切换元素的父元素
var regTop=document.getElementById('reg-top');
//获取普通登录元素
var normal=document.getElementById('normal');
//alert(normal);
//获取无密码登录元素
var nopw=document.getElementById('nopw');
//获取扫码登录元素
var saoma=document.getElementById('qrcode');
//获取PC登录元素
var screen=document.getElementById('screen');

//获取普通登录对应的div
var rc=document.getElementById('rc');
//获取无密码登录对应的div
var lc=document.getElementById('lc');
//获取扫码登录对应的div
var sm=document.getElementById('sm');

//登录状态标识位
var rcFlag=true;
var lcFlag=false;

//实现登录方式的切换
normal.onclick=function(){
	rc.style.display="block";
	lc.style.display="none";
	sm.style.display="none";
	regTop.style.display="block";
	nopw.style.borderBottom="none";
	normal.style.borderBottom="2px solid #49d4fb";
	rcFlag=true;
	lcFlag=false;

};

nopw.onclick=function(){
	rc.style.display="none";
	lc.style.display="block";
	sm.style.display="none";
	regTop.style.display="block";
	nopw.style.borderBottom="2px solid #49d4fb";
	normal.style.borderBottom="none";
	rcFlag=false;
	lcFlag=true;
};

saoma.onclick=function(){
	rc.style.display="none";
	lc.style.display="none";
	sm.style.display="block";
	regTop.style.display="none";
};

screen.onclick=function(){
	regTop.style.display="block";
	sm.style.display="none";
	if(rcFlag){
		rc.style.display="block";
		return;
	}else{
		rc.style.display="none";
	}
	if(lcFlag){
		lc.style.display="block";
		return;
	}else{
		lc.style.display="none";
	}
};

/*=========普通登录表单验证============*/
//获取提示框元素
var rcInnerNum=document.getElementById('rc-inner-num');
var rcinnerText=rcInnerNum.getElementsByTagName('span')[0];


var rcInnerVirity=document.getElementById('rc-inner-virity');
var rcInnerVirityText=rcInnerVirity.getElementsByTagName('span')[0];

//手机号码输入框
var inputPhone=document.getElementsByName('phone-num')[0];
//alert(inputPhone);
//密码输入框
var inputPassword=document.getElementsByName('password')[0];
//获取登录按钮
var loginBtn=document.getElementById('login-btn');


//用户名输入框验证
//手机输入正确标识位
var nFlag=false;
inputPhone.onblur=function(){
	//手机号码的正则验证
	var reg=/^(1([358][0-9]|(47)|[7][0178]))[0-9]{8}$/;
	//邮箱的正则验证
	var reg1=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	//昵称的正则验证
	var reg2=/^[\u4e00-\u9fa5_a-zA-Z0-9_]{4,10}$/i;
	//console.log(this.value);
	if(this.value==""){
		rcInnerNum.style.display="block";
		rcInnerVirity.style.display="none";
		return;
	}
	if(reg.test(this.value)||reg1.test(this.value)||reg2.test(this.value)){
		
		var value=$(this).val();
		//console.log(value);
		$.post('./js/login.php',{phone:value},function(data){
			//console.log(data);
			if(data=='0'){
				$('#rc-inner-num').show().text();
				$('#rc-inner-virity').hide();
				$('#rc-inner-num > span').text('用户名不存在，请重新输入！');
			}else{
				$('.success').show();
				nFlag=true;
			}
		});
		return;
	}else{
		rcInnerNum.style.display="block";
		rcInnerVirity.style.display="none";
	}
};

inputPhone.onfocus=function(){
	rcInnerNum.style.display="none";
	$('.success').hide();
	$('#rc-innerError').eq(0).hide();
};

//密码输入框验证
var passFlag=false;
inputPassword.onblur=function(){
	if(this.value==""){
		if(nFlag){
			rcInnerVirity.style.display="block";
			rcInnerNum.style.display="none";
			rcInnerVirityText.innerText="请输入密码";
		}
		return;
	}
	var reg=/((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-z\d#@!~%^&*]{8,16}/i;  
	//*密码必须为8-16位<br/>*必须有字母、数字或特殊字符其中两种
	if(!reg.test(this.value)){
		rcInnerVirity.style.display="block";
		rcInnerVirityText.innerText="密码为8-16位的字母或数字或特殊字符的结合";
		rcInnerNum.style.display="none";
	}else{
		passFlag=true;
		return;
	}
};

inputPassword.onfocus=function(){
	rcInnerVirity.style.display="none";
	$('#rc-innerError').eq(0).hide();
};

//按钮验证
loginBtn.onclick=function(e){
	alert(e);
	stopDefault(e);
	if(inputPhone.value==""){
		rcInnerNum.style.display="block";
		rcinnerText.innerText="请输入昵称/邮箱/手机号码";
		rcInnerVirity.style.display="none";
		return;
	}
	if(inputPassword.value==""){
		if(nFlag){
			rcInnerVirity.style.display="block";
			rcInnerNum.style.display="none";
		}
		return;
	}
	if(passFlag&&nFlag){
		var phone = inputPhone.value;
		var pass = inputPassword.value;
		/*console.log(phone);
		console.log(pass);*/
		$.post('./js/validate.php',{phone:phone,pass:pass},function(data){
			if(data=='0'){
				$('#rc-innerError').eq(0).show();
			}else{
				window.location.href='../main/index.html';
			}
		});
	}
};


/*=========手机无密码登录=============*/
//获取手机号码提示框元素
var innerNum=document.getElementById('inner-num');
var innerNumText=innerNum.getElementsByTagName('span')[0];
//获取密码提示框元素
var innerVirity=document.getElementById('inner-virity');
var innerVirityText=innerVirity.getElementsByTagName('span')[0];


//获取下拉列表元素
var selectList=document.getElementById('country');
//获取手机号码输入框
var noPhoneNum=document.getElementsByName('phone-num')[1];
//console.log(noPhoneNum);
//获取密码输入框
var otp=document.getElementsByName('password')[1];
//获取手机动态密码按钮
var getcodeBtn=document.getElementById('getcode');
//登录按钮
var loginBtn1=document.getElementById('login-btn1');

var country=[
		'喀麦隆',
		'贝宁',
		'马达加斯加',
		'卢旺达',
		'塞舌尔',
		'科特迪瓦',
		'埃及',
		'毛里求斯',
		'布基纳法索',
		'厄立特里亚',
		'圣多美和普林西比',
		'安哥拉',
		'利比亚',

		'塞卜泰',
		'津巴布韦',
		'几内亚',
		'塞拉利昂',
		'留尼汪',
		'加蓬',
		'加纳',
		'坦桑尼亚',
		'马里',
		'索马里',,
		'毛里塔尼亚',
		'乌干达',
		'乍得',
		'马约特岛',
		'科摩罗',
		'博茨瓦那',
		'塞内加尔',
		'斯威士兰',
		'几内亚(比绍)',
		'民主刚果',
		'中非共和国',
		'莱索托',
		'刚果',
		'南非',
		'利比里亚',
		'突尼斯',
		'赞比亚',
		'尼日尔',
		'西撒哈拉',
		'多哥',
		'纳米比亚',
		'莫桑比克',
		'梅利利亚',
		'埃塞俄比亚',
		'摩洛哥',
		'马拉维',
		'尼日利亚',
		'佛得角',
		'布隆迪',
		'阿尔及利亚',
		'吉布提',
		'加那利群岛',
		'冈比亚',
		'赤道几内亚',
		'苏丹',
		'肯尼亚',
		'新加坡',
		'韩国',
		'叙利亚',
		'乌兹别克斯坦',
		'巴林',
		'日本',
		'约旦',
		'越南',
		'吉尔吉斯斯坦',
		'泰国',
		'斯里兰卡',
		'阿联酋',
		'老挝',
		'阿富汗',
		'中国澳门',
		'塔吉克斯坦',
		'朝鲜',
		'巴勒斯坦',
		'中国香港',
		'伊拉克',
		'黎巴嫩',
		'科威特',
		'文莱',,
		'马尔代夫',
		'印度尼西亚',
		'以色列',
		'蒙古',

		'阿曼',
		'印度',
		'缅甸',
		'马来西亚',
		'东帝汶',
		'也门共和国',
		'不丹',
		'柬埔寨',
		'巴基斯坦',
		'孟加拉国',
		'沙特阿拉伯',
		'土库曼斯坦',
		'卡塔尔',
		'尼泊尔',
		'哈萨克斯坦',
		'菲律宾',
		'台湾',
		'伊朗',
		'哥斯达黎加',
		'古巴',
		'多米尼加共和国',
		'墨西哥',
		'尼加拉瓜',
		'巴拿马',
		'荷属安地列斯群岛',
		'萨尔瓦多',
		'英属维尔京群岛',
		'波多黎各',
		'美属维尔京群岛',
		'安圭拉(英)',
		'圣卢西亚',
		'圣文森特和格纳丁斯',
		'荷属安德列斯',
		'瓜德罗普',
		'洪都拉斯',
		'危地马拉',
		'格鲁吉亚',
		'亚美尼亚',
		'阿塞拜疆',
		'白俄罗斯',
		'俄罗斯联邦',
		'乌克兰',

		'匈牙利',
		'冰岛',
		'马耳他',
		'摩纳哥',
		'挪威',
		'罗马尼亚',
		'圣马力诺',
		'瑞典',
		'瑞士',
		'爱沙尼亚',
		'拉脱维亚',
		'立陶宛',
		'摩尔多瓦',
		'土耳其',
		'斯洛文尼亚',
		'捷克共和国',
		'斯洛伐克',
		'马其顿',
		'波斯尼亚-黑塞哥维那共和',
		'梵蒂冈城国',
		'荷兰',
		'克罗地亚',
		'希腊',
		'爱尔兰',
		'比利时',
		'塞浦路斯',
		'丹麦',
		'英国',
		'德国',
		'法国',
		'意大利',
		'卢森堡',
		'葡萄牙',
		'波兰',
		'西班牙',
		'阿尔巴尼亚',
		'安道尔',
		'列支敦士登',
		'塞黑',
		'奥地利',
		'保加利亚',
		'芬兰',
		'直布罗陀',
		'多米尼克',
		'百慕大',
		'加拿大',
		'美国',
		'格陵兰',
		
		'汤加',
		'澳大利亚',
		'库克群岛',
		'瑙鲁',
		'新喀里多尼亚',
		'瓦努阿图',
		'所罗门群岛',
		'萨摩亚',
		'图瓦卢',
		'密克罗尼西亚联邦',
		'马绍尔群岛',
		'基里巴斯',
		'法属玻利尼西亚',
		'新西兰',
		'斐济',
		'巴布亚新几内亚',
		'帕劳共和国',
		'土阿莫土群岛',
		'土布艾群岛',
		'社会群岛',
		'马克萨斯群岛',
		'瓦利斯和浮图纳',
		'盖比群岛',
		'诺福克岛',

		'智利',
		'哥伦比亚',
		'法属圭亚那',
		'圭亚那',
		'库腊索岛',
		'巴拉圭',
		'秘鲁',
		'苏里南',
		'委内瑞拉',
		'乌拉圭',
		'厄瓜多尔',
		'安提瓜和巴布达',
		'阿鲁巴岛',
		'巴哈马',
		'巴巴多斯',
		'开曼群岛',
		'格林纳达',
		'萨巴',
		'海地',
		'牙买加',
		'马提尼克',
		'蒙特塞拉特',
		'圣文森特和格林纳丁斯',
		'特立尼达和多巴哥',
		'特克斯和凯科斯群岛',
		'英属维尔京群岛',
		'圣其茨-尼维斯',
		'圣马丁岛',

		'圣皮埃尔和密克隆',
		'阿根廷',
		'伯利兹',
		'玻利维亚',
		'巴西',
		'博内尔',
		'圣卢西亚'
	];

//循环创建下拉列表项
for(var i=0;i<country.length;i++){
	var option=document.createElement('option');
	option.innerText=country[i];
	selectList.appendChild(option);
}

//手机号码验证
var npnFlag=false;
noPhoneNum.onblur=function(){
	var reg=/^(1([358][0-9]|(47)|[7][0178]))[0-9]{8}$/;
	if(this.value==""){
		innerNum.style.display="block";
		innerNumText.innerText="请输入手机号码";
		innerVirity.style.display="none";
		return;
	}
	if(!reg.test(this.value)){
		innerNum.style.display="block";
		innerNumText.innerText="请输入正确的手机号码";
		innerVirity.style.display="none";
		return;
	}else{
		var value=$(this).val();
		$.post('./js/login.php',{phone:value},function(data){
			//console.log(data);
			if(data=='0'){
				$('#inner-num').show().text();
				$('#inner-virity').hide();
				$('#inner-num > span').text('手机号码不存在,请重新输入！');
			}else{
				$('.success').show();
				npnFlag=true;
			}
		});
		return;
	}
};

noPhoneNum.onfocus=function(){
	innerNum.style.display="none";
	$('.success').hide();
};

//动态密码验证
var otpFlag=false;
otp.onblur=function(){
	var reg=/^\d{6}$/;
	if(this.value==""){
		if(npnFlag){
			innerVirity.style.display="block";
			innerVirityText.innerText="请输入验证码";
			innerNum.style.display="none";
		}
		return;
	}
	if(!reg.test(this.value)){
		if(npnFlag){
			innerVirity.style.display="block";
			innerVirityText.innerText="验证码为6位数字";
			innerNum.style.display="none";
		}
	}else{
		otpFlag=true;
		return;
	}
};

otp.onfocus=function(){
	innerVirity.style.display="none";
};

//获取动态密码按钮验证
getcodeBtn.onclick=function(e){
	stopDefault(e);
	if(npnFlag){
		//动态获取验证码
	}else{
		innerNum.style.display="block";
		innerNumText.innerText="请输入手机号码";
		innerVirity.style.display="none";
		return;
	}
};

//登录按钮验证
loginBtn1.onclick=function(e){
	stopDefault(e);
	if(noPhoneNum.value==""){
		innerNum.style.display="block";
		innerNumText.innerText="请输入手机号码";
		innerVirity.style.display="none";
		return;
	}
	if(otp.value==""){
		if(npnFlag){
			innerVirity.style.display="block";
			innerVirityText.innerText="请输入验证码";
			innerNum.style.display="none";
		}
		return;
	}
	if(npnFlag&&otpFlag){
		//数据提交，及登录跳转
		window.location.href='../main/index.html';
	}

};


//阻止按钮默认提交的行为函数
function stopDefault(e)
{
	console.log(e);
    if (e&&e.preventDefault)
    {
        e.preventDefault();//非IE
    }
    else
    {
        window.event.returnValue = false;//IE
        return false;
    }
}