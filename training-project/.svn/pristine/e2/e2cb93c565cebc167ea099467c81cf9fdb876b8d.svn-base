//定义全局标记是否完成加载
var isLoadWeek = false;
var isLoadMonth = false;
var isLoadQuarter = false;
var isLoadYear = false;
var selectWeek;
var weekmap;
var map;
var quartermap;
var yearmap;	
$(function() {
	dojo.require("esri.map");
	dojo.require("esri.tasks.ProjectParameters");	
	//当HTML加载时执行初始化方法
	dojo.addOnLoad(initweek);
	dojo.addOnLoad(initmonth);
	dojo.addOnLoad(initquarter);
	dojo.addOnLoad(inityear);
});

/**
 * 周视图初始化方法
 */
function initweek() {
	//自定义底图
	weekmap = new esri.Map("weekmap",{
    	logo:false //隐藏logo
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(getSYSParameter("arcgis.basemap"));
    weekmap.addLayer(basemap);
	
    //自定义要素层
	var layerDefinition = {  
            "geometryType": "esriGeometryPoint",  
            "fields": [{  
				  "name": "ID",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "ID"  
				},
				{  
				  "name": "违章次数",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "punish_nums"  
				}]  
    };
	
    //特征集  
    var featureCollection = {  
	     layerDefinition: layerDefinition,  
         outFields: ['*']
    };
    
    //创建要素层
	featureLayer4 = new esri.layers.FeatureLayer(featureCollection, {
		objectIdField:"违章次数", //该层对象ID字段名称
		showLabels: true ,//是否显示标签
		showAttribution : true //是否显示属性
	});	
	
	//将要素层添加到map
	weekmap.addLayer(featureLayer4);
    
	//创建热度地图渲染器
	var heatmapRenderer = new esri.renderer.HeatmapRenderer({  
			field: "违章次数",  
			blurRadius: 20,  
			maxPixelIntensity: 200,  
			minPixelIntensity: 0 
        });  
	
	//渲染颜色控制
    heatmapRenderer.setColorStops([   
          { ratio: 0, color: "rgb(255, 230, 0, 0)"},  
          { ratio: 0.2, color: "rgb(250, 146, 0)"},  
          { ratio: 0.3, color: "rgb(250, 50, 0)" },  
          { ratio: 0.4, color: "rgba(250, 0, 0)" }  
   ]); 
	    
	//将渲染器添加到要素层
    featureLayer4.setRenderer(heatmapRenderer); 
	
	//设置地图中心点
    weekmap.on("load", function() {
		//var centerPoint = new esri.geometry.Point(49014108.941154525,49828539.78742246,map.spatialReference);
		
		//设置地图的中心点和缩放等级
		//map.centerAndZoom(centerPoint, 2);
		
		//加载完成
		isLoadWeek = true;	
		
		//地图加载完毕，显示当前周的热度地图
		loadWeek();
	});
}

/**
 * 月视图初始化方法
 */
function initmonth() {
	//自定义底图
    map = new esri.Map("map",{
    	logo:false //隐藏logo
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(getSYSParameter("arcgis.basemap"));
	map.addLayer(basemap);
	
    //自定义要素层
	var layerDefinition = {  
            "geometryType": "esriGeometryPoint",  
            "fields": [{  
				  "name": "ID",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "ID"  
				},
				{  
				  "name": "违章次数",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "punish_nums"  
				}]  
    };
	
    //特征集  
    var featureCollection = {  
	     layerDefinition: layerDefinition,  
         outFields: ['*']
    };
    
    //创建要素层
	featureLayer1 = new esri.layers.FeatureLayer(featureCollection, {
		objectIdField:"违章次数", //该层对象ID字段名称
		showLabels: true ,//是否显示标签
		showAttribution : true //是否显示属性
	});	
	
	//将要素层添加到map
    map.addLayer(featureLayer1);
    
	//创建热度地图渲染器
	var heatmapRenderer = new esri.renderer.HeatmapRenderer({  
			field: "违章次数",  
			blurRadius: 20,  
			maxPixelIntensity: 200,  
			minPixelIntensity: 0 
        });  
	
	//渲染颜色控制
    heatmapRenderer.setColorStops([   
          { ratio: 0, color: "rgb(255, 230, 0, 0)"},  
          { ratio: 0.2, color: "rgb(250, 146, 0)"},  
          { ratio: 0.3, color: "rgb(250, 50, 0)" },  
          { ratio: 0.4, color: "rgba(250, 0, 0)" }  
   ]); 
	    
	//将渲染器添加到要素层
    featureLayer1.setRenderer(heatmapRenderer); 
	
	//设置地图中心点
	map.on("load", function() {
		//var centerPoint = new esri.geometry.Point(49014108.941154525,49828539.78742246,map.spatialReference);
		
		//设置地图的中心点和缩放等级
		//map.centerAndZoom(centerPoint, 2);
		
		//加载完成
		isLoadMonth = true;	
		
		//地图加载完毕，显示当前月份的热度地图
		loadMonth();
	});
}

/**
 * 季度视图初始化方法
 */
function initquarter() {
	//自定义底图
    quartermap = new esri.Map("quartermap",{
    	logo:false //隐藏logo
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(getSYSParameter("arcgis.basemap"));
    quartermap.addLayer(basemap);
    
	//设置地图中心点
	quartermap.on("load", function() {
		var centerPoint = new esri.geometry.Point(97867.54340533944,107028.96580267083,quartermap.spatialReference);
		
		//设置地图的中心点和缩放等级
		quartermap.centerAndZoom(centerPoint, 1);
	});
	
    //自定义要素层
	var layerDefinition = {  
            "geometryType": "esriGeometryPoint",  
            "fields": [{  
				  "name": "ID",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "ID"  
				},
				{  
				  "name": "违章次数",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "punish_nums"  
				}]  
    };
	
    //特征集  
    var featureCollection = {  
	     layerDefinition: layerDefinition,  
         outFields: ['*']
    };
    
    //创建要素层
	featureLayer2 = new esri.layers.FeatureLayer(featureCollection, {
		objectIdField:"违章次数", //该层对象ID字段名称
		showLabels: true ,//是否显示标签
		showAttribution : true //是否显示属性
	});
	
	//将要素层添加到map
    quartermap.addLayer(featureLayer2);
    
	//创建热度地图渲染器
	var heatmapRenderer = new esri.renderer.HeatmapRenderer({  
			field: "违章次数",  
			blurRadius: 20,  
			maxPixelIntensity: 200,  
			minPixelIntensity: 0 
        });  
	
	//渲染颜色控制
    heatmapRenderer.setColorStops([   
          { ratio: 0, color: "rgb(255, 230, 0, 0)"},  
          { ratio: 0.2, color: "rgb(250, 146, 0)"},  
          { ratio: 0.3, color: "rgb(250, 50, 0)" },  
          { ratio: 0.4, color: "rgba(250, 0, 0)" }  
   ]); 
	    
	//将渲染器添加到要素层
    featureLayer2.setRenderer(heatmapRenderer); 
	//加载完成
	isLoadQuarter = true;			
}

/**
 * 年视图初始化方法
 */
function inityear() {
	//自定义底图
    yearmap = new esri.Map("yearmap",{
    	logo:false //隐藏logo
    });
    var basemap = new esri.layers.ArcGISTiledMapServiceLayer(getSYSParameter("arcgis.basemap"));
    yearmap.addLayer(basemap);
    
	//设置地图中心点
	yearmap.on("load", function() {
		var centerPoint = new esri.geometry.Point(97867.54340533944,107028.96580267083,yearmap.spatialReference);
		
		//设置地图的中心点和缩放等级
		yearmap.centerAndZoom(centerPoint, 1);
	});
	
    //自定义要素层
	var layerDefinition = {  
            "geometryType": "esriGeometryPoint",  
            "fields": [{  
				  "name": "ID",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "ID"  
				},
				{  
				  "name": "违章次数",  
				  "type": "esriFieldTypeInteger",  
				  "alias": "punish_nums"  
				}]  
    };
	
    //特征集  
    var featureCollection = {  
	     layerDefinition: layerDefinition,  
         outFields: ['*']
    };
    
    //创建要素层
	featureLayer3 = new esri.layers.FeatureLayer(featureCollection, {
		objectIdField:"违章次数", //该层对象ID字段名称
		showLabels: true ,//是否显示标签
		showAttribution : true //是否显示属性
	});	
	//将要素层添加到map
    yearmap.addLayer(featureLayer3);
    
	//创建热度地图渲染器
	var heatmapRenderer = new esri.renderer.HeatmapRenderer({  
			field: "违章次数",  
			blurRadius: 20,  
			maxPixelIntensity: 200,  
			minPixelIntensity: 0 
        });  
	
	//渲染颜色控制
    heatmapRenderer.setColorStops([   
          { ratio: 0, color: "rgb(255, 230, 0, 0)"},  
          { ratio: 0.2, color: "rgb(250, 146, 0)"},  
          { ratio: 0.3, color: "rgb(250, 50, 0)" },  
          { ratio: 0.4, color: "rgba(250, 0, 0)" }  
   ]); 
	    
	//将渲染器添加到要素层
    featureLayer3.setRenderer(heatmapRenderer); 
    
	//加载完成
	isLoadYear = true;			
}

/**
 * 加载周视图数据，绘点
 */
function loadWeekData(data) {	 
	if(data != undefined){
		var pointArr = [];
		for(var i = 0; i<data.length; i++){
			//循环从data中读取每条数据的经纬度创建一个坐标存入数组
	   		var point = new esri.geometry.Point(data[i].longitude, data[i].latitude);
			pointArr.push(point);
		}
		
		//调用坐标转换函数
		asyncGeometryProject(pointArr, map, function(geometry) {
			for(var i = 0 ;i < geometry.length; i++) {
				//画点到要素层
				addGraphic4(geometry[i], data[i].breakRuleNums);
				
				//创建弹窗信息
				createInfoTemplate4();
			}
		}); 
	}
}

 /**
  * 加载月视图数据，绘点
  */
function loadMonthData(data) {	 
	if(data != undefined){
		var pointArr = [];
		for(var i = 0; i<data.length; i++){
			//循环从data中读取每条数据的经纬度创建一个坐标存入数组
	   		var point = new esri.geometry.Point(data[i].longitude, data[i].latitude);
			pointArr.push(point);
		}
		
		//调用坐标转换函数
		asyncGeometryProject(pointArr, map, function(geometry) {
			for(var i = 0 ;i < geometry.length; i++) {
				//画点到要素层
				addGraphic1(geometry[i], data[i].breakRuleNums);
				
				//创建弹窗信息
				createInfoTemplate1();
			}
		}); 
	}
}
 
 /**
  * 加载季度视图数据，绘点
  */
function loadQuarterData(data) {	 
	if(data != undefined){
		var pointArr = [];
		for(var i = 0; i<data.length; i++){
	  		//循环从data中读取每条数据的经纬度创建一个坐标存入数组
	  		var point = new esri.geometry.Point(data[i].longitude, data[i].latitude);
			pointArr.push(point);
		}
		
		//调用坐标转换函数
		asyncGeometryProject(pointArr, map, function(geometry) {
			for(var i = 0 ;i < geometry.length; i++) {
				//画点到要素层
				addGraphic2(geometry[i], data[i].breakRuleNums);
				
				//创建弹窗信息
				createInfoTemplate2();
			}
		}); 
	}
}

 /**
  * 加载年视图数据，绘点
  */
function loadYearData(data) {	 
	if(data != undefined){
		var pointArr = [];
		for(var i = 0; i<data.length; i++){
	  		//循环从data中读取每条数据的经纬度创建一个坐标存入数组
	  		var point = new esri.geometry.Point(data[i].longitude, data[i].latitude);
			pointArr.push(point);
		}
		
		//调用坐标转换函数
		asyncGeometryProject(pointArr, map, function(geometry) {
			for(var i = 0 ;i < geometry.length; i++) {
				//画点到要素层
				addGraphic3(geometry[i], data[i].breakRuleNums);
				
				//创建弹窗信息
				createInfoTemplate3();
			}
		}); 
	}
}
/**
 * 以同步的方式从arcgis服务器中的几何服务进行4326到地图目标几何坐标转换，并返回转换结果(json)
 * @param gPoint 4326地理坐标
 * @param mapObj map对象
 * @returns
 * 	4326进行投影转换后的几何坐标
 */
 syncGeometryProject = function(gPoint, mapObj) {
	//构造传递给几何服务的参数
	var geometrydata = {
	  inSR: '{wkid:4326}',
	  outSR: '{"wkt":\'' + mapObj.spatialReference.wkt + '\'}',
	  f: 'json',
	  geometries: "["+gPoint.x + "," + gPoint.y+"]"
  	};
  
	//通过jquery同步请求的方式向几何服务发送请求，并接收转换的结果
  	var strResp = $.ajax({
	  type: "post",
	  url : "http://192.168.1.200:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer/project",
	  data: geometrydata,
	  dataType: "html",
	  async: false
  	}).responseText;
  
 	return JSON.parse(strResp);
};

/**
 * 以异步的方式从arcgis服务器中的几何服务进行4326到地图目标几何坐标转换，并返回转换结果(json)
 * @param gPoint 4326地理坐标
 * @param mapObj map对象
 * @param callback 异步回调函数
 * @returns
 * 	4326进行投影转换后的几何坐标
 */
function asyncGeometryProject(gPoint, mapObj, callback) {
 	//创建一个GeometryService  
  	var geomSVC = new esri.tasks.GeometryService(getSYSParameter("arcgis.geometryserver"));

 	//投影参数
	var params = new esri.tasks.ProjectParameters();
	params.geometries = gPoint;
	params.inSR = new esri.SpatialReference({wkid:4326});
	params.outSR = mapObj.spatialReference;
	geomSVC.project(params, callback) ;
}

/**
 * 在周视图要素层添加图形
 * @param geometry 几何图形
 * @param punish_nums 违章次数
 */
function addGraphic4(geometry, punish_nums) {
	//创建点符号
	var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	
	//获取违章次数设置到Graphic属性
	var attr = {};
	attr["违章次数"] = punish_nums;
	
	//创建一个几何图形
	var gra = new esri.Graphic(geometry, markerSymbol);
	gra.setAttributes(attr);
	featureLayer4.add(gra);
 }

/**
 * 创建周视图弹窗
 */
function createInfoTemplate4() {
	//创建popupTemplate
    var popupTemplate = new esri.dijit.PopupTemplate({
    	title:"属性",
    	description: "违章次数:  {违章次数}"
        });
	featureLayer4.setInfoTemplate(popupTemplate);
}

/**
 * 在月视图要素层添加图形
 * @param geometry 几何图形
 * @param punish_nums 违章次数
 */
function addGraphic1(geometry, punish_nums) {
	//创建点符号
	var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	
	//获取违章次数设置到Graphic属性
	var attr = {};
	attr["违章次数"] = punish_nums;
	
	//创建一个几何图形
	var gra = new esri.Graphic(geometry, markerSymbol);
	gra.setAttributes(attr);
	featureLayer1.add(gra);
 }

/**
 * 创建月视图弹窗
 */
function createInfoTemplate1() {
	//创建popupTemplate
    var popupTemplate = new esri.dijit.PopupTemplate({
    	title:"属性",
    	description: "违章次数:  {违章次数}"
        });
	featureLayer1.setInfoTemplate(popupTemplate);
}

/**
 * 在季度视图要素层添加图形
 * @param geometry 几何图形
 * @param punish_nums 违章次数
 */
function addGraphic2(geometry, punish_nums) {
	//创建点符号
	var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	
	//获取违章次数设置到Graphic属性
	var attr = {};
	attr["违章次数"] = punish_nums;
	
	//创建一个几个图形
	var gra = new esri.Graphic(geometry, markerSymbol);
	gra.setAttributes(attr);
	featureLayer2.add(gra);
 }

/**
 * 创建季度视图弹窗
 */
function createInfoTemplate2() {
	//创建popupTemplate
    var popupTemplate = new esri.dijit.PopupTemplate({
    	title:"属性",
    	description: "违章次数:  {违章次数}"
        });
	featureLayer2.setInfoTemplate(popupTemplate);
}

/**
 * 在年视图要素层添加图形
 * @param geometry 几何图形
 * @param punish_nums 违章次数
 */
function addGraphic3(geometry, punish_nums) {
	//创建点符号
	var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	
	//获取违章次数设置到Graphic属性
	var attr = {};
	attr["违章次数"] = punish_nums;
	
	//创建一个几个图形
	var gra = new esri.Graphic(geometry, markerSymbol);
	gra.setAttributes(attr);
	featureLayer3.add(gra);
 }

/**
 * 创建年视图弹窗
 */
function createInfoTemplate3() {
	//创建popupTemplate
    var popupTemplate = new esri.dijit.PopupTemplate({
    	title:"属性",
    	description: "违章次数:  {违章次数}"
        });
	featureLayer3.setInfoTemplate(popupTemplate);
}

/**
 * 功能：加载违章单位排行初始数据
 */
$(function (){
	$("#year-week #viewYear").textbox().next('span').css('border','none');
	$("#year-month #viewYear").textbox().next('span').css('border','none');
	$("#year-quarter #viewYear").textbox().next('span').css('border','none');
});

/**
 * 功能：获取数据并绘制周视图
 * 参数：yearNo(年份)、weekCode(周编号)
 */
function drawChartWeekView(yearNo, weekCode){
	selectWeek = weekCode;
	$.ajax({
		type: 'post',
		async: false,
		data: {'yearNo': yearNo, 'weekCode': weekCode},
		url: apronPunishBasePath + "/apron_punish_breakrulemap_week.json",
		success: function(data){
			data = data.rows;
			if(isLoadWeek && data !=""){
				featureLayer4.clear();
				loadWeekData(data);
				featureLayer4.redraw();
			}else if(isLoadWeek && data =="") {
				featureLayer4.clear();
				featureLayer4.redraw();
			}
		}
	});
 }

/**
 * 功能：获取数据并绘制月视图
 * 参数：yearNo(年份)、monthCode(月份编号)
 */
function drawChartMonthView(yearNo, monthCode){
	$.ajax({
		type: 'post',
		async: false,
		data: {'yearNo': yearNo, 'monthCode': monthCode},
		url: apronPunishBasePath + "/apron_punish_breakrulemap_month.json",
		success: function(data){
			data = data.rows;
			if(isLoadMonth && data !=""){
				featureLayer1.clear();
				loadMonthData(data);
				featureLayer1.redraw();
			}else if(isLoadMonth && data =="") {
				featureLayer1.clear();
				featureLayer1.redraw();
			}
		}
	});
 }


/**
 * 功能：获取数据并绘制季度视图
 * 参数：yearNo(年份)、quarter(季度编号)
 */
function drawChartQuarterView(yearNo,quarterCode){
	$.ajax({
		type: 'post',
		async: false,
		data: {'yearNo': yearNo, 'quarterCode': quarterCode},
		url: apronPunishBasePath + "/apron_punish_breakrulemap_quarter.json",
		success: function(data){
			data = data.rows;
			if(isLoadQuarter && data !=""){
				featureLayer2.clear();
				loadQuarterData(data);
				featureLayer2.redraw();
			}else if(isLoadQuarter && data =="") {
				featureLayer2.clear();
				featureLayer2.redraw();
			}
		}
	});
}

/**
 * 功能：获取数据并绘制年视图
 * 参数：yearNo(年份)
 */
function drawChartYearView(yearNo){
	$.ajax({
		type: 'post',
		async: false,
		data: {'yearNo': yearNo},
		url: apronPunishBasePath + "/apron_punish_breakrulemap_year.json",
		success: function(data){
			data = data.rows;
			if(isLoadYear && data !=""){
				featureLayer3.clear();
				loadYearData(data);
				featureLayer3.redraw();
			}else if(isLoadYear && data =="") {
				featureLayer3.clear();
				featureLayer3.redraw();
			}
		}
	});
}

/**
 * 功能：打开违章单位周排行详情对话框，并初始化数据
 */
function openWeekDetailDLG(){
	var yearNo = years[yearIndex];
	var weekCode = $("#weekSelect").combobox("getValue");
	//跳出弹窗
	 $("#publishAreaDLG").show().window({
		 width: "900",
		 height: "480",
		 title: yearNo+'年第'+weekCode+'周区域违章排行记录',
		iconCls: 'icon-detail',
		 modal:true,
		 resizable: false,
		 collapsible: false,
		 minimizable: false,
		 maximizable: false
	 });
	//初始化datagrid动态加载数据的url
	 $("#publishAreaDatagrid").datagrid({
		 url: apronPunishBasePath + "/apron_punish_breakrulemap_weekpage.json",
		 queryParams: {'yearNo': yearNo, 'weekCode': weekCode}
	 });
}

/**
 * 功能：打开违章单位月排行详情对话框，并初始化数据
 */
function openMonthDetailDLG(){
	var yearNo = years[yearIndex];
	var monthCode = monthes[monthCodeIndex].monthCode;
	//跳出弹窗
	 $("#publishAreaDLG").show().window({
		 width: "900",
		 height: "480",
		 title: yearNo+'年'+monthCode+'月区域违章排行记录',
		iconCls: 'icon-detail',
		 modal:true,
		 resizable: false,
		 collapsible: false,
		 minimizable: false,
		 maximizable: false
	 });
	//初始化datagrid动态加载数据的url
	 $("#publishAreaDatagrid").datagrid({
		 url: apronPunishBasePath + "/apron_punish_breakrulemap_monthpage.json",
		 queryParams: {'yearNo': yearNo, 'monthCode': monthCode}
	 });
}

/**
 * 功能：打开违章单位季度排行详情对话框，并初始化数据
 */
function openQuarterDetailDLG(){
	var yearNo = years[yearIndex];
	var quarterCode = quarters[quarterCodeIndex].quarterCode;
	//跳出弹窗
	 $("#publishAreaDLG").show().window({
		 width: "900",
		 height: "480",
		 title: yearNo+'年'+quarterCode+'季度区域违章排行记录',
		iconCls: 'icon-detail',
		 modal:true,
		 resizable: false,
		 collapsible: false,
		 minimizable: false,
		 maximizable: false
	 });
	//初始化datagrid动态加载数据的url
	 $("#publishAreaDatagrid").datagrid({
		 url: apronPunishBasePath + "/apron_punish_breakrulemap_quarterpage.json",
		 queryParams: {'yearNo': yearNo, 'quarterCode': quarterCode}
	 });
}

/**
 * 功能：打开违章单位年度排行详情对话框，并初始化数据
 */
function openYearDetailDLG(){
	var yearNo = years[yearIndex];
	//跳出弹窗
	 $("#publishAreaDLG").show().window({
		 width: "900",
		 height: "480",
		 title: yearNo+'年区域违章排行记录',
		iconCls: 'icon-detail',
		 modal:true,
		 resizable: false,
		 collapsible: false,
		 minimizable: false,
		 maximizable: false
	 });
	//初始化datagrid动态加载数据的url
	 $("#publishAreaDatagrid").datagrid({
		 url: apronPunishBasePath + "/apron_punish_breakrulemap_yearpage.json",
		 queryParams: {'yearNo': yearNo}
	 });
}


/**
 * 功能：调用接口，返回系统参数
 * @returns key
 */
function getSYSParameter(key){
	var url = undefined;
	$.ajax({
		type: "post",
		async: false,
		data:{"paramId":key},
		url:  apronPunishBasePath + "/apron_punish_sysparam_findbyid.json",
		success: function(data){
			url = data.param.paramValue;
		}
	});
	return url;
}

/**
 * 功能：判断是否隐藏分页信息
 * @param data
 */
function onLoadSuccess(data){
	if(data.total<15){
		$(".datagrid-pager").hide();
	}else{
		$(".datagrid-pager").show();
	}
}
