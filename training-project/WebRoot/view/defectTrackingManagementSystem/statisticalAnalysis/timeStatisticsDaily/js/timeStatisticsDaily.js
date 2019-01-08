
var jdata = [];
/**
 * 加载页面
 */
$(function(){
	projectList();		//调用项目下拉列表方法
	timeVerification();		//调用时间验证
	$("#timeStatisticsDailylistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/timeStatisticsDaily.json",135,null));	
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
			$("#timeStatisticsDailyProjectId").combobox({
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
function timeStatisticsDaily(){
	var verify = $("#timeStatisticsDailySearch").form('validate');//判断返回的是true还是flase
	if(verify){
		var params = $("#timeStatisticsDailySearch").serializeObject();//序列化表单
		$("#timeStatisticsDailylistTable").datagrid(Common.createDatagridOptionsParams(basePath, "/timeStatisticsDaily.json",135,params));	
	}else{
		 $.messager.alert('警告','登记时间不正确');
	}
}

/**
 * 时间
 */
function timeVerification(){
	$("#timeStatisticsDailyStartTime").datebox({validType:'end',onSelect:function(){timevalidate()}});	//开始时间
	$("#timeStatisticsDailyEndTime").datebox({validType:'end',onSelect:function(){timevalidate()}});//完成时间
}

function timevalidate(){
	$("#timeStatisticsDailyStartTime").datebox('isValid');
	$("#timeStatisticsDailyEndTime").datebox('isValid');
}

/**
 * 自定义时间验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	//时间验证
	end:{
        validator: function (value, param) {
        	var time1 = new Date($("#timeStatisticsDailyStartTime").datebox('getText')).valueOf();//开始时间转化为毫秒数
        	var time2 = new Date($("#timeStatisticsDailyEndTime").datebox('getText')).valueOf();//结束时间转化为毫秒数
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
 * 日报全导出
 * @returns
 */
function exportData(){
	location.href =basePath + '/exportData.json';
}


/**
 * 开始导出Excel表格
 * @returns
 */
function tableToExcel(){
	
	//确认框
	$.messager.confirm('提示','您确认要打印当前日报吗？',function(r){
		if(r){
			
//			开启	 同步请求
			$.ajaxSettings.async=false;
			//	重载日报数据
			$("#timeStatisticsDailylistTable").datagrid("reload");
			//	获取当前日报的数据
			var rows = $("#timeStatisticsDailylistTable").datagrid("getData").rows;
			console.log(rows);
			jdata = rows;
			//	开启	 异步请求
			$.ajaxSettings.async=true;
			
			//调用导出excel方法
			exportForm();
		}
	})

}

/**
* 日报当前页面导出
*/
function exportForm(){
	
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
    var nameFor = timestamp + "工时统计日报.csv";

    //对下载的文件命名
    link.download =  nameFor;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
