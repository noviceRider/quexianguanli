/**
* 页面加载
*/
$(function(){
	projectList();		//调用项目下拉列表方法
	timeVerification();		//调用时间验证方法
	dateFormatter('monthlyTimeStatisticsReportStartTime');		//调用日期格式方法	
	dateFormatter('monthlyTimeStatisticsReportEndTime');		//调用日期格式方法
	$("#monthlyTimeStatisticsReportlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/monthlyTimeStatisticsReport.json",135,null));
})

/**
* 项目下拉列表
*/
function projectList(){
	$.ajax({
		url:basePath+'/queryProjectTwo.json',
		type:'post',
		dataType:'json',
		success:function(data){
			$("#monthlyTimeStatisticsReportProjectId").combobox({
			    valueField:'projectId', 
			    textField:'projectName',
			    panelHeight:'100px',
			    width:120 ,
			    data:data.rows ,
			    loadFilter:function(data){
				  	   data.unshift({projectId:'',projectName:'--请选择--'});
				  	   return data;
				  	}
			});
		}
	})
}

/**
* 搜索
*/
function monthlyTimeStatisticsReport(){
	var verify = $("#monthlyTimeStatisticsReportSearch").form('validate');//判断返回的是true还是false
	if(verify){
		var params = $("#monthlyTimeStatisticsReportSearch").serializeObject();//序列化表单
		$("#monthlyTimeStatisticsReportlistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/monthlyTimeStatisticsReport.json",135,params));	
	}else{
		 $.messager.alert('警告','登记时间不正确');
	}
}

/**
 * 时间
 */
function timeVerification(){
	$("#monthlyTimeStatisticsReportStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//开始时间
	$("#monthlyTimeStatisticsReportEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//完成时间
}

function timevalidate(){
	$("#monthlyTimeStatisticsReportStartTime").datebox('isValid');
	$("#monthlyTimeStatisticsReportEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#monthlyTimeStatisticsReportStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#monthlyTimeStatisticsReportEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
        	var judge;
        	if(!isNaN(time1) && !isNaN(time2)){
        		judge =  time1 <= time2;
        	} else {
        		judge = true;
        	}
            return judge;
        },
        message:'开始时间要小于结束时间'
    }
});

/**
 * 日期格式
 */
function dateFormatter(Id){
	$('#'+Id).datebox({ //初始化设置日期格式，只显示年月，不显示日
		editable:false ,
	     onShowPanel: function () {  //显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层
	          span.trigger('click'); //触发click事件弹出月份层
	          if (!tds)
	            setTimeout(function() {  //延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔
	                tds = p.find('div.calendar-menu-month-inner td');
	                tds.click(function(e) {
	                   e.stopPropagation();  //禁止冒泡执行easyui给月份绑定的事件
	                   var year = /\d{4}/.exec(span.html())[0] , //得到年份
	                   //月份
	                   //之前是这样的month = parseInt($(this).attr('abbr'), 10) + 1; 
	                   month = parseInt($(this).attr('abbr'), 10);  

	           $('#'+Id).datebox('hidePanel')   //隐藏日期对象 
	           .datebox('setValue', year + '-' + month); //设置日期的值
	                        });
	                    }, 0);
	            },
	            parser: function (s) {//配置parser，返回选择的日期
	                if (!s) return new Date();
	                var arr = s.split('-');
	                return new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);
	            },
	            formatter: function (d) { //配置formatter，只返回年月 之前是这样的d.getFullYear() + '-' +(d.getMonth()); 
	                var currentMonth = (d.getMonth()+1);
	                var currentMonthStr = currentMonth < 10 ? ('0' + currentMonth) : (currentMonth + '');
	                return d.getFullYear() + '-' + currentMonthStr; 
	            }
	        });
			var p = $('#'+Id).datebox('panel'), //日期选择对象
	        tds = false, //日期选择对象中月份
	        span = p.find('span.calendar-text'); //显示月份层的触发控件
}

/**
 * 格式化日期
 */
function myformatter(date) {
   var y = date.getFullYear(); //获取年份
    var m = date.getMonth() + 1;//获取月份
    return y + '-' + m;
}

/**
* 月报导出
*/
function exportDataMonth(){
	location.href =basePath + '/exportDataMonth.json';
}

var jdata = [];
/**
 * 开始导出Excel表格
 * @returns
 */
function atPresentExportDataMonth(){
	
	//确认框
	$.messager.confirm('提示','您确认要打印当前月报吗？',function(r){
		if(r){
			
//			开启	 同步请求
			$.ajaxSettings.async=false;
			//	重载日报数据
			$("#monthlyTimeStatisticsReportlistTable").datagrid("reload");
			//	获取当前日报的数据
			var rows = $("#monthlyTimeStatisticsReportlistTable").datagrid("getData").rows;
			console.log(rows);
			jdata = rows;
			//	开启	 异步请求
			$.ajaxSettings.async=true;
			
			//调用导出excel方法
			exportFormMonth();
		}
	})

}

/**
* 月报当前页面导出
*/
function exportFormMonth(){
	
	//列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = "项目名称,缺陷名称,登记工时,登记时间\n";
    
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < jdata.length ; i++ ){
      for(let item in jdata[i]){
    	  if(jdata[i][item] != null && jdata[i][item] != 0){
    		  str += jdata[i][item] +'\t'+',';  
    	  }
      }
      str+='\n';
    }
    //encodeURIComponent解决中文乱码
    //application/ms-excel;charset=UTF-8"
    let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
    //通过创建a标签实现
    var link = document.createElement("a");
    link.href = uri;
    //添加一个时间戳
    var timestamp = new Date().getTime();
    //命名
    var nameFor = timestamp + "工时统计月报.csv";

    //对下载的文件命名
    link.download =  nameFor;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}