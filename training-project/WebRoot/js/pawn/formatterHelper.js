/**
 * 格式化帮助类
 */

/**
 * 数字格式化
 * @param value 格式化的值
 * @param length 小数点后保留的位数
 * 保留小数点后指定位，无小数点则保留指定个数的0
 */
function numberFormatter(value,length){
	//value转化为字符串
	value=value+"";
	
	//无小数点
	if(value.split(".")[1]==null || value.split(".")[1]=="" || value.split(".")[1]==undefined){
		value+=".";
		for(var i=0;i<length;i++){
			value+="0";
		}
	}else{//包含小数点
		var pointPart=value.split(".")[1];
		
		//小数点部分长度是否小于指定长度，小于则补0
		if(pointPart.length<length){
			pointPart+=".";
			
			for(var j=0;j<length-pointPart.length;j++){
				pointPart+="0";
			}
			
			value=value.split(".")[0]+pointPart;
		}else if(pointPart.length==length){//相等则四舍五入，进位后添0
			if(parseInt(pointPart.charAt(pointPart.length-1))>5){
				
			}
		}
	}
}
