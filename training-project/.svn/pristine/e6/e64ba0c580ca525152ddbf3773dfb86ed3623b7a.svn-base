/**
 * 字符串格式化对象
 */
var StrFormat = {
	/**
	 * 将一个表示数字的字符串格式化成###,###.00的格式
	 * 	传入非数字参数则返回空字符串
	 * @param sValue 字符串形式的数字
	 * @returns {String} ###,###.00格式的字符串
	 */
	currencyFormat : function(sValue) {
		var newValue = "";
		
		//判断传入的参数是否是数字（数字和字符串类型的数字返回true,其他的返回false）
		var isNum = $.isNumeric(sValue);
		if(!isNum) {
			return "";
		}

		//将数字转化为两位小数
		var value = parseFloat(sValue).toFixed(2);
		//小数部分
		var decimal = value.substring(value.indexOf('.'));
		//整数部分
		var integer = parseInt(value.substring(0,value.indexOf('.')));
		//将整数部分转成带千分号分割的字符串
		var micrNum = integer.toLocaleString(); 
		//格式化之后的字符串为：整数部分+小数部分
		newValue = micrNum + decimal;
		
		return newValue;
	},
	/**
	 * 将一个表示数字的字符串格式化成######.00的格式
	 * 	传入非数字参数则返回空字符串
	 * @param sValue 字符串形式的数字
	 * @returns {String} ######.00格式的字符串
	 */
	numberFormat : function(sValue) {
		var newValue = "";
		
		//判断传入的参数是否是数字（数字和字符串类型的数字返回true,其他的返回false）
		var isNum = $.isNumeric(sValue);
		if(!isNum) {
			return "";
		}

		//将数字转化为两位小数
		newValue = parseFloat(sValue).toFixed(2);
		
		return newValue;
	},
	/**
	 * 将一个表示时间戳的数字转化成指定的时间、日期格式 ,若不传type则默认转换为yyyy-mm-dd hh:mm
	 * @param sValue 字符串格式的数字，代表自1900开始的时间
	 * @param type 需要转化成的时间、日期格式，1 yyyy-mm-dd格式；2 hh:mm 格式；3 yyyy-mm-dd hh:mm格式；4 yyyy-mm-dd hh:mm:ss格式
	 * @returns {String} 转化后的字符串
	 */
	dateTimeFormat : function(sValue, type) {
		var newValue = "";
		
		//判断传入的参数是否是数字（数字和字符串类型的数字返回true,其他的返回false）
		var isNum = $.isNumeric(sValue);
		if(!isNum) {
			return "";
		}
		
		//将时间戳转换成时间格式
		var date = new Date(sValue);
		//年
		var y = date.getFullYear();
		//月
		var m = date.getMonth()+1;
		m = m < 10 ? "0" + m : m; 
		//日
		var d = date.getDate();
		d = d < 10 ? "0" + d : d; 
		//时
		var h = date.getHours();
		h = h < 10 ? "0" + h : h;
		//分
		var mm = date.getMinutes();
		mm = mm < 10 ? "0" + mm : mm;
		//秒
		var s = date.getSeconds();
		s = s < 10 ? "0" + s : s;
		
		//转化为yyyy-mm-dd格式
		if(type == 1) {
			newValue = y + "-" + m + "-" + d;
		}
		//转化为hh:mm格式
		else if(type == 2) {
			newValue = h + ":" + mm;
		}
		//转化为yyyy-mm-dd hh:mm格式
		else if(type == 3 || type == null) {
			newValue = y + "-" + m + "-" + d + " " + h + ":" + mm;
		}
		//转化为yyyy-mm-dd hh:mm:ss格式
		else if(type == 4) {
			newValue = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
		}
		
		return newValue;
	}
};




