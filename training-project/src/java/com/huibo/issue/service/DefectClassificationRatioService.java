package com.huibo.issue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.javax.dao.Page;
import com.huibo.issue.dao.DefectClassificationRatioDao;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
/**
* <p>Title: 缺陷管理系统 - DefectClassificationRatioService</p>
*
* <p>Description:统计分析的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Service
public class DefectClassificationRatioService {
	@Autowired
	private DefectClassificationRatioDao defectClassificationRatioDao;
	/**
	 * 缺陷分类占比
	 */
	public List<String> getDefectClassificationRatio(IssueBaseInfoPo po) {
		return defectClassificationRatioDao.getDefectClassificationRatio(po);
	}

	/**
	 * 缺陷状态分布
	 */
	public List<IssueBaseInfoPo> defectStatusDistribution(IssueBaseInfoPo po) {
		return defectClassificationRatioDao.defectStatusDistribution(po);
	}

	/**
	 * 缺陷严重程度
	 */
	public Object defectSeverity(IssueBaseInfoPo po) {
		return defectClassificationRatioDao.defectSeverity(po);
	}

	/**
	 * 工时统计日报
	 */
	public Map<String, Object> timeStatisticsDaily(IssueBaseInfoPo po) {
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(po);
		List<IssueBaseInfoPo> list = defectClassificationRatioDao.timeStatisticsDaily(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}

	/**
	 * 工时统计月报
	 */
	public Map<String, Object> monthlyTimeStatisticsReport(IssueBaseInfoPo po) {
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(po);
		List<IssueBaseInfoPo> list = defectClassificationRatioDao.monthlyTimeStatisticsReport(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}

	/**
	 * 日报导出
	 * @return
	 */
	public List<IssueWorkLogPo> getWorkHoursDay() {
		// TODO Auto-generated method stub
		return defectClassificationRatioDao.getWorkHoursDay();
	}

	/**
	 * 月报导出
	 * @return
	 */
	public List<IssueWorkLogPo> exportDataMonth() {
		// TODO Auto-generated method stub
		return defectClassificationRatioDao.exportDataMonth();
	}
}