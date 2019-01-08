	//获取年份数组
	var years = undefined;
	//当前年份下标
	var yearIndex = undefined;
	//获取周数组
	var weeks = undefined;
	//获取月份数组 
	var monthes = undefined;
	//当前月份编号下标 
	var monthCodeIndex = undefined;
	//获取季度数组
	var quarters = undefined;
	//当前季度编号下标
	var quarterCodeIndex = undefined;
	
	/**
	 * 当页面所有元素加载完成之后显示当前周热度地图
	 */
	function loadWeek() {
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		//获取周数组
		monthes = searchMonths(years[yearIndex]);
		selectWeek = monthes[0].weekCode;
		//显示当前月份的热度地图
		//drawChartWeekView(years[yearIndex],monthes[0].weekCode);
	};
	
	/**
	 * 当页面所有元素加载完成之后显示当前月份热度地图
	 */
	function loadMonth() {
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		//获取月份数组
		monthes = searchMonths(years[yearIndex]);
		//设置初始当前月份编号下标为最近月份
		monthCodeIndex = 0;	
		//显示当前月份的热度地图
		drawChartMonthView(years[yearIndex],monthes[monthCodeIndex].monthCode);
	};
	
	/**
	 * 功能：获取年份数组并定义years
	 * 参数：null
	 * 返回值：年份数组
	 */
	function searchYears(){
		//定义年份数组变量
		var years = [];
		$.ajax({
			type: 'post',
			async: false,
			url: apronPunishBasePath + "/apron_punish_yearmonth_year.json",
			success: function(data){
				var data = data.rows;
				for(var i=0; i<data.length; i++){
					years.push(data[i].yearNo);
				}
			}
		});
		return years;
	}
	
	/**
	 * 功能：根据年份查询周数组
	 * 参数：年份
	 * 返回值：周数组
	 */
	function searchWeeks(year){
		//定义周数组;
		var weeks = [];
		$.ajax({
			type: 'post',
			async: false,
			data: {'yearNo': year},
			url: apronPunishBasePath + "/apron_punish_yearmonth_week.json",
			success: function(data){
				var rows = data.rows;
				for(var i=0; i<rows.length; i++){
					weeks.push({'weekCode': rows[i].weekCode,'weekDesc': "第"+ rows[i].weekCode + "周"});
				}
			}
		});
		return weeks;
	}
	
	/**
	 * 功能：根据年份查询月份数组
	 * 参数：年份
	 * 返回值：月份数组
	 */
	function searchMonths(year){
		//定义月份数组;
		var months = [];
		$.ajax({
			type: 'post',
			async: false,
			data: {'yearNo': year},
			url: apronPunishBasePath + "/apron_punish_yearmonth_month.json",
			success: function(data){
				var data = data.rows;
				for(var i=0; i<data.length; i++){
					months.push({'monthCode': data[i].monthCode,'monthDesc': data[i].monthDesc});
				}
			}
		});
		return months;
	}
	
	/**
	 * 功能：根据年份查询季度数组
	 * 参数：年份
	 * 返回值：月份数组
	 */
	function searchQuarters(year){
		//定义季度数组
		var quarters = [];
		$.ajax({
			type: 'post',
			async: false,
			data: {'yearNo': year},
			url: apronPunishBasePath + "/apron_punish_yearmonth_quarter.json",
			success: function(data){
				var data = data.rows;
				for(var i=0; i<data.length; i++){
					quarters.push({'quarterCode': data[i].quarterCode,'quarterDesc': data[i].quarterDesc});
				}
			}
		});
		return quarters;
	}
	
	/**
	 * 功能：选中某一标签面板事件，初始化面板数据
	 * 参数：title(标签面板标题)、index(标签面板下标)
	 * 返回值：null
	 */
	function onSelect(title, index){
		if(index == 0) {
			openWeekView();
		} else if(index == 1){
			openMonthView();
		} else if(index == 2){
			openQuaterView();
		} else{
			openYearView();
		}
	}
	
	/**
	 * 功能：打开周视图，并初始化数据
	 */
	function openWeekView() {
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		weeks = searchWeeks(years[yearIndex]);
		//为当前年份文本框赋值
		$("#week-view #viewYear").textbox('setValue',years[yearIndex]);
		//上一页按钮不可编辑
		$("#week-view #link-prev").linkbutton('disable');
		if(years.length<2){
			//下一页不可编辑
			$("#week-view #link-next").linkbutton('disable');
		} else{
			//下一页可编辑
			$("#week-view #link-next").linkbutton('enable');
		}
		//绘制周视图
		drawChartWeekView(years[yearIndex],weeks[0].weekCode);
	}
	
	/**
	 * 功能：打开月视图，并初始化数据
	 */
	function openMonthView(){
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		//获取月份数组
		monthes = searchMonths(years[yearIndex]);
		//设置初始当前月份编号下标为最近月份
		monthCodeIndex = 0;
		//为当前年份文本框赋值
		$("#month-view #viewYear").textbox('setValue',years[yearIndex]);
		//上一页按钮不可编辑
		$("#month-view #link-prev").linkbutton('disable');
		if(years.length<2){
			//下一页不可编辑
			$("#month-view #link-next").linkbutton('disable');
		} else{
			//下一页可编辑
			$("#month-view #link-next").linkbutton('enable');
		}
		//绘制月视图
		drawChartMonthView(years[yearIndex],monthes[monthCodeIndex].monthCode);
	}
	
	
	/**
	 * 功能：打开季度视图，并初始化数据
	 */
	function openQuaterView(){
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		//获取季度数组
		quarters = searchQuarters(years[yearIndex]);
		//设置初始当前季度编号下标为0
		quarterCodeIndex = 0;
		//为当前年份文本框赋值
		$("#quarter-view #viewYear").textbox('setValue',years[yearIndex]);
		//上一页按钮不可编辑
		$("#quarter-view #link-prev").linkbutton('disable');
		if(years.length<2){
			//下一页不可编辑
			$("#quarter-view #link-next").linkbutton('disable');
		} else{
			//下一页可编辑
			$("#quarter-view #link-next").linkbutton('enable');
		}
		//绘制季度视图
		drawChartQuarterView(years[yearIndex],quarters[quarterCodeIndex].quarterCode);
	}
	
	/**
	 * 功能：打开年视图，并初始化数据
	 */
	function openYearView(){
		//设置初始当前年份下标为0
		yearIndex = 0;
		//获取年份数组
		years = searchYears();
		$("#years #addButton").remove();
		//画年份信息
		$(years).each(function(i,item){
			var monthStr = "<td id='addButton'><input type='button'  style='width:80px;height:26px;margin-left:10px;' onclick='drawYearView("+i+")' value='"+item+"'></td>";
		    $("#years tr").append(monthStr);
		});
		drawChartYearView(years[yearIndex]);
	}
	
	/**
	 * 功能：翻到上一年
	 * 参数：当前对象
	 * 返回值：当yearIndex为0时，返回空，否则无返回值
	 */
	function prevYear(dom){
		$(dom).parents('tr').find("#link-next").linkbutton('enable');
		if(yearIndex == 0){
			return;
		}
		if(yearIndex == 1){
			$(dom).linkbutton('disable');
		} 
		yearIndex -= 1;
		$(dom).parents('tr').find("#viewYear").textbox('setValue',years[yearIndex]);
	}
	
	
	/**
	 * 功能：翻到下一年
	 * 参数：当前对象
	 * 返回值：当yearIndex等于years.length-1时，返回空，否则无返回
	 */
	function nextYear(dom){
		$(dom).parents('tr').find("#link-prev").linkbutton('enable');
		if(yearIndex == (years.length-1)){
			return;
		}
		if(yearIndex+1 == (years.length-1)){
			$(dom).linkbutton('disable');
		} 
		yearIndex += 1;
		$(dom).parents('tr').find("#viewYear").textbox('setValue',years[yearIndex]);
	}
	
	/**
	 * 功能：年份改变事件，年份改变时,改变可用周
	 */
	function changeEnableWeek(){
		$("#year-week #addButton").remove();
		//获取文本框中的年份
		var year = $("#year-week #viewYear").textbox('getValue');
		//获取月份数组
		weeks = searchWeeks(year);
		//如果周数大于10，则将下拉选的高度设为固定高度
		if(weeks.length > 10) {
			$("#weekSelect").combobox({
				panelHeight:"215px"
			});
		}else{
			$("#weekSelect").combobox({
				panelHeight:"auto"
			});
		}
		weekCodeIndex = 0;
		$("#weekSelect").combobox("loadData", weeks);
		$("#weekSelect").combobox("setValue", weeks[weekCodeIndex].weekCode);
		drawChartWeekView(year,weeks[weekCodeIndex].weekCode);
	}  
	
	/**
	 * 功能：年份改变事件，年份改变时,改变可用月份
	 */
	function changeEnableMonth(){
		$("#year-month #addButton").remove();
		//获取文本框中的年份
		var year = $("#year-month #viewYear").textbox('getValue');
		//获取月份数组
		monthes = searchMonths(year);
		monthCodeIndex = 0;
		//画月份信息
		$(monthes).each(function(i,item){
			var monthStr = "<td id='addButton'><input type='button'  style='width:80px;height:26px;margin-left:10px;' onclick='drawMonthView("+i+")' value='"+item.monthDesc+"'></td>";
		    $("#year-month tr").append(monthStr);
		});
	}  
	
	/**
	 * 功能：年份改变事件，年份改变时,改变可用季度
	 */
	function changeEnableQuarter(){
		$("#year-quarter #addButton").remove();
		//获取文本框中的年份
		var year = $("#quarter-view #viewYear").textbox('getValue');
		//获取月份数组
		quarters = searchQuarters(year);
		quarterCodeIndex = 0;
		//画月份信息
		$(quarters).each(function(i,item){
			var monthStr = "<td id='addButton'><input type='button'  style='width:80px;height:26px;margin-left:10px;' onclick='drawQuarterView("+i+")' value='"+item.quarterDesc+"'></td>";
		    $("#year-quarter tr").append(monthStr);
		});
	}
	
	/**
	 * 周视图选择周数
	 */
	function selectWeekEvt(rec) {
		var year = $("#year-week #viewYear").textbox('getValue');
		selectWeek = rec.weekCode;
		drawChartWeekView(year,rec.weekCode);
	}
	
	/**
	 * 功能：月份单击事件，绘制月视图
	 * 参数：月份编号下标
	 */
	function drawMonthView(index){
		monthCodeIndex = index;
		var year = $("#year-month #viewYear").textbox('getValue');
		drawChartMonthView(year,monthes[monthCodeIndex].monthCode);
	}
	
	/**
	 * 功能：季度单击事件，绘制季度视图
	 * 参数：季度编号下标
	 */
	function drawQuarterView(index){
		quarterCodeIndex = index;
		var year = $("#quarter-view #viewYear").textbox('getValue');
		drawChartQuarterView(year,quarters[quarterCodeIndex].quarterCode);
	}
	
	/**
	 * 功能： 年度单击事件，绘制年度视图
	 * 参数： 年度下标
	 */
	function drawYearView(index){
		yearIndex = index;
		drawChartYearView(years[yearIndex]);
	}

	
	
	