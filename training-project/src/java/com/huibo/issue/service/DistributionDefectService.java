package com.huibo.issue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.dao.DistributionDefectDao;
import com.huibo.issue.po.IssueBaseInfoPo;
/**
* <p>Title: 缺陷管理系统 - DistributionDefectService</p>
*
* <p>Description:缺陷分配的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Service
public class DistributionDefectService {
	@Autowired
	private DistributionDefectDao distributionDefectDao;
	/**
	 * 加载数据网格及搜索
	 */
	public Map<String, Object> loadDistribution(IssueBaseInfoPo po) {
		po.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(po);
		List<IssueBaseInfoPo> list = distributionDefectDao.loadDistribution(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		System.out.println(map);
		return map;
	}
	
	/**
	 * 分配方法
	 * @param issueId
	 * @return
	 */
	public Map<String, Object> allot(IssueBaseInfoPo issueId) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rows", distributionDefectDao.allot(issueId));
		return map;
	}
	
	/**
	 * 指派给下拉列表
	 * @return
	 */
	public Map<String,Object> designate(IssueBaseInfoPo po) {
		return new HashMap<String,Object>() {
			{
				put("rows",distributionDefectDao.designate(po));
			}
		};
	}

	/**
	 * 分配
	 * @param issueBaseInfoPo
	 * @return
	 */
	public Map<String, Object> DistributionOfPreservation(IssueBaseInfoPo issueBaseInfoPo) {
		return new HashMap<String,Object>() {
			{
				put("rows",distributionDefectDao.DistributionOfPreservation(issueBaseInfoPo));
			}
		};
	}

	/**
	 * 项目下拉列表
	 * @return
	 */
	public Map<String, Object> queryProjectTwo() {
		return new HashMap<String,Object>(){
			{
				put("rows",distributionDefectDao.queryProjectTwo());
			}
		};
	}

	/**
	 * 判断是否为项目管理员操作
	 */
	public Map<String, Object> ifAdministrator(IssueBaseInfoPo po) {
		po.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());	//注入当前项目的操作人
		Map<String,Object> map = new HashMap<String,Object>();
		Integer number = distributionDefectDao.ifAdministrator(po);
		map.put("rows",number);
		return map;
	}
}