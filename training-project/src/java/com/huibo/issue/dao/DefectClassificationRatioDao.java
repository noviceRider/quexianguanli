package com.huibo.issue.dao;

import java.util.List;
import java.util.Map;

import com.bn.javax.dao.Page;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
/**
* <p>Title: 缺陷管理系统 - DefectClassificationRatioDao</p>
*
* <p>Description:统计分析的Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
public interface DefectClassificationRatioDao {
	//缺陷分类占比
	public List<String> getDefectClassificationRatio(IssueBaseInfoPo po);

	//缺陷状态分布
	public List<IssueBaseInfoPo> defectStatusDistribution(IssueBaseInfoPo po);

	//缺陷严重程度
	public List<IssueBaseInfoPo> defectSeverity(IssueBaseInfoPo po);

	//统计工时日报
	public List<IssueBaseInfoPo> timeStatisticsDaily(Page page);
	
	//工时统计月报
	public List<IssueBaseInfoPo> monthlyTimeStatisticsReport(Page page);

	//日报导出
	public List<IssueWorkLogPo> getWorkHoursDay();

	//月报导出
	public List<IssueWorkLogPo> exportDataMonth();
}
