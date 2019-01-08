$(function () {
    //加载消息通知数据
    initNotificationData();
    
    //加载新闻公告数据
    initAnnouncementData();
});

/**
 * 加载消息通知数据网格
 */
function initNotificationData() {
    //加载消息管理表格数据
    $("#notificationTable").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: "203105"},
        method: "post",
        pagination: true,
        striped: true,
        pageList:[5,10,15],
        pageSize: "5",
        singleSelect: true,
        onDblClickRow: function(rowIndex, rowData){
        	 //双击打开查看详情对话框
            details(rowIndex);
        },
    });
}

/**
 * 加载新闻公告数据网格
 */
function initAnnouncementData() {
    //加载消息管理表格数据
    $("#announcementTable").datagrid({
        url: basePath + "/dataaccess.json",
        queryParams: {accessId: "203207"},
        method: "post",
        pagination: true,
        striped: true,
        pageList:[5,10,15],
        pageSize: "5",
        singleSelect: true,
    });
}




/**
 * 功能：消息通知  发布时间的格式化函数
 */
function createTimeFormatter(value) {
	if (value == "" || value == undefined) {
		return "";
	} else {
		var date = new Date(value);
		return date.pattern("yyyy-MM-dd hh:mm");
	}
}

/**
 * 详情的格式化函数
 * @param value 字段的值
 * @param row 该行的记录数据
 * @param index 该行的索引
 */
function detailFormatter(value, row, index) {
    return "<a href='#' onclick='details(" + index + ")' style='color:blue'>查看</a>";
}

/**
 * 获取详情
 */
function details(index) {
    //得到选中行的索引
    $("#notificationTable").datagrid("selectRow", index);

    //得到被选中的那一行数据
    var SelectedData = $("#notificationTable").datagrid("getSelected");

    //业务逻辑
    var logicId = "20.03.01.01";

    //从数据库中查询选中行的数据
    $.ajax({
        url: basePath + "/businesslogic.json",
        data: {
            logicId,
            notificationId: SelectedData.notificationId
        },
        type: "post",
        dataType: "json",
        success: function (data) {
            //格式化显示消息类型
            if (data.notificationType == "01") {
                data.notificationType = "消息";
            } else {
                data.notificationType = "通知";
            }

            //格式化显示消息状态
            if (data.notificationStat == "00") {
                data.notificationStat = "删除";
            } else if (data.notificationStat == "01") {
                data.notificationStat = "未读";
            } else {
                data.notificationStat = "已读";
            }
            
            
            //显示详情按钮的text
            var detailButtonText;
            
            //点击详情按钮跳转页面参数
            var handerId,handerUrl,handerTitle;
            
            var handerParams={};
            
            var myResourceId;
            
            //格式化显示消息来源
            if (data.sourceType == "01") {
                data.sourceType = "房源跟进记录";
                detailButtonText="房源";
                
                handerId='20.01.04.04';
        		handerUrl=basePath + '/view/house/houseResource/list.html';
        		handerTitle='房源列表';
        		
        		handerParams.accessId="202106";
        		handerParams.followLogId=data.resourceId;
        		
            } else if (data.sourceType == "02") {
                data.sourceType = "房源跟进任务";
                detailButtonText="房源";
                
                handerId='20.01.04.04';
        		handerUrl=basePath + '/view/house/houseResource/list.html';
        		handerTitle='房源列表';
        		
        		handerParams.accessId="202203";
        		handerParams.resourceType="1";
        		handerParams.followTaskId=data.resourceId;
        		
            } else if(data.sourceType == "03"){
                data.sourceType = "客源跟进记录";
                detailButtonText="客源";
                
                handerId='20.01.05.01';
        		handerUrl=basePath + '/view/house/clientResource/list.html';
        		handerTitle='客源列表';
        		
        		handerParams.accessId="202106";
        		handerParams.followLogId=data.resourceId;
        		
            }else if(data.sourceType == "04"){
                data.sourceType = "客源跟进任务";
                detailButtonText="客源";
                
                handerId='20.01.05.01';
        		handerUrl=basePath + '/view/house/clientResource/list.html';
        		handerTitle='客源列表';	
        		
        		handerParams.accessId="202203";
        		handerParams.resourceType="2";
        		handerParams.followTaskId=data.resourceId;
            }
            else if(data.sourceType == "05"){
                data.sourceType = "私房转公房";
                detailButtonText="房源";
                
                handerId='20.01.04.04';
        		handerUrl=basePath + '/view/house/houseResource/list.html';
        		handerTitle='房源列表';
        		
        		handerParams.accessId="201103";
        		handerParams.houseResourceId=data.resourceId;
            }
            else if(data.sourceType == "06"){
                data.sourceType = "私客转公客";
                detailButtonText="客源";
                
                handerId='20.01.05.01';
                handerUrl=basePath + '/view/house/clientResource/list.html';
        		handerTitle='客源列表';
        		
        		handerParams.accessId="201203";
        		handerParams.clientResourceId=data.resourceId;
            }
            else if(data.sourceType == "07"){
                data.sourceType = "合同相关";
                detailButtonText="合同管理";
                
            	handerId='20.01.06.02';
        		handerUrl=basePath + '/view/house/contract/contract.html';
        		handerTitle='合同'; 		
        		
        		handerParams.accessId="201303";
        		handerParams.contractId=data.resourceId;
            }
            
            
            $.ajax({
                url: basePath + "/dataaccess.json",
                data: handerParams,
                type: "post",
                dataType: "json",
                success: function (data) {
                	if(data.contractId){
                		myResourceId=data.contractId
                	}else{
                		myResourceId=data.resourceId
                	}
                	
                }
            });
            
            //显示数据
            $("#notificationId").html(data.notificationId);
            $("#notificationType").html(data.notificationType);
            $("#sourceType").html(data.sourceType);
            $("#content").html(data.content);
            $("#notificationStat").html(data.notificationStat);
         
            //打开对话框
            $("#detailDialog").dialog({
                buttons: [{
                	text: '查看' + detailButtonText,
                    iconCls: 'icon-detail',
                    handler: function () {
                        // TODO 生成需要打开的标签数据
                        top.$.contenttab.addTabFromData({
                        	// sys_menu（菜单表）中对应的菜单编码
                            id: handerId,
                            // sys_menu（菜单表）中对应的菜单地址
                            url: handerUrl,
                            // sys_menu（菜单表）中对应的菜单名称
                            title: handerTitle,
                            // 触发afterLoad事件并传递该数据对象
                            eventData: {
                                resourceId: myResourceId
                            }
                        });
                        
                        //关闭对话框
                        $("#detailDialog").dialog("close");
                    },
                 
                }, {
                    text: '关闭',
                    iconCls: 'icon-cancel',
                    handler: function () {
                        //关闭对话框
                        $("#detailDialog").dialog("close");

                        //清空表单
                        $("#detailForm").form("reset");
                    }
                }]
            }).dialog("open");
        }
    });
}


/**
 * 功能：新闻公告   格式化预约时间列数据
 */
function formatterTime(value, rowIndex, rowData) {
	if (value == "" || value == undefined) {
		return "";
	} else {
		var date = new Date(value);
		return date.pattern("yyyy-MM-dd hh:mm:ss");
	}
}

/**
 *功能：消息通知  关闭详情对话框
 **/
function cancel() {
    //关闭对话框
    $("#detailDialog").dialog("close");

    //清空表单
    $("#detailForm").form("reset");
	
	//重新加载数据
	initData();
}