package com.huibo.issue.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
import com.huibo.issue.service.DefectClassificationRatioService;
import com.huibo.issue.util.OutPutExcel;
/**
* <p>Title: 缺陷管理系统 - DefectClassificationRatioController</p>
*
* <p>Description:统计分析的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Controller
public class DefectClassificationRatioController {
	@Autowired
	private DefectClassificationRatioService defectClassificationRatioService;
	
	/**
	 * 缺陷分类占比
	 */
	@RequestMapping("/Ratio.json")
	public Map<String,Object> getDefectClassificationRatio(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map.put("rows", defectClassificationRatioService.getDefectClassificationRatio(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 缺陷状态分布
	 */
	@RequestMapping("/defectStatusDistribution")
	public Map<String,Object> defectStatusDistribution(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map.put("rows", defectClassificationRatioService.defectStatusDistribution(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 缺陷严重程度
	 */
	@RequestMapping("/defectSeverity")
	public Map<String,Object> defectSeverity(IssueBaseInfoPo po){
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			map.put("rows", defectClassificationRatioService.defectSeverity(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 工时统计日报
	 */
	@RequestMapping("/timeStatisticsDaily")
	public Map<String,Object> timeStatisticsDaily(IssueBaseInfoPo po){
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			map = defectClassificationRatioService.timeStatisticsDaily(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 工时统计月报
	 */
	@RequestMapping("/monthlyTimeStatisticsReport")
	public Map<String,Object> monthlyTimeStatisticsReport(IssueBaseInfoPo po){
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			map = defectClassificationRatioService.monthlyTimeStatisticsReport(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 日报导出
	 */
	@RequestMapping("/exportData")
	public void outPutExcel(HttpServletResponse resp) throws IOException{
        //获取数据
         List<IssueWorkLogPo>list = defectClassificationRatioService.getWorkHoursDay();
        //excel标题
         String[] title = {"项目名称","缺陷名称","登记时间","登记工时"}; 
         //excel文件名
         String fileName = "工时统计日报.xls";
         //送花eet名
         String sheetName = "工时统计日报信息表";
         //整理数据源
         String content[][]=new String[list.size()][title.length];
         System.out.println(list.size());
         for(int i=0;i<list.size();i++) {
        	 IssueWorkLogPo po=list.get(i);
        	 content[i][0]=po.getProjectName();
        	 content[i][1]=po.getIssueName();
        	 content[i][2]=po.getLogDate();
        	 content[i][3]=po.getWorkHours().toString();
         }
         //创建HSSFWorkbook 
         HSSFWorkbook wb = OutPutExcel.getHSSFWorkbook(sheetName, title, content, null);
         
         //输出文档
         OutputStream output=resp.getOutputStream();
		 resp.setContentType("application/ms-excel;charset=UTF-8"); 
         resp.setHeader("Content-Disposition", "attachment;filename="+ new String( fileName.getBytes("gb2312"), "ISO8859-1" ));         
         wb.write(output);
         output.flush();
         output.close();
	}
	
	/**
	 * 月报导出
	 */
	@RequestMapping("/exportDataMonth")
	public void exportDataMonth(HttpServletResponse resp) throws IOException{
        //获取数据
         List<IssueWorkLogPo>list = defectClassificationRatioService.exportDataMonth();
        //excel标题
         String[] title = {"项目名称","缺陷名称","登记时间","登记工时"}; 
         //excel文件名
         String fileName = "工时统计月报.xls";
         //送花eet名
         String sheetName = "工时统计月报信息表";
         //整理数据源
         String content[][]=new String[list.size()][title.length];
         System.out.println(list.size());
         for(int i=0;i<list.size();i++) {
        	 IssueWorkLogPo po=list.get(i);
        	 content[i][0]=po.getProjectName();
        	 content[i][1]=po.getIssueName();
        	 content[i][2]=po.getLogDate();
        	 content[i][3]=po.getWorkHours().toString();
         }
         //创建HSSFWorkbook 
         HSSFWorkbook wb = OutPutExcel.getHSSFWorkbook(sheetName, title, content, null);
         
         //输出文档
         OutputStream output=resp.getOutputStream();
		 resp.setContentType("application/ms-excel;charset=UTF-8"); 
         resp.setHeader("Content-Disposition", "attachment;filename="+ new String( fileName.getBytes("gb2312"), "ISO8859-1" ));         
         wb.write(output);
         output.flush();
         output.close();
	}

}