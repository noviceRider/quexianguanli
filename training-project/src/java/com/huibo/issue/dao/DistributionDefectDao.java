package com.huibo.issue.dao;

import java.util.List;
import java.util.Map;

import com.bn.javax.dao.Page;
import com.huibo.issue.po.IssueBaseInfoPo;
/**
* <p>Title: 缺陷管理系统 - DistributionDefectDao</p>
*
* <p>Description:缺陷分配的Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
public interface DistributionDefectDao {
	//加载数据网格及搜索
	public List<IssueBaseInfoPo> loadDistribution(Page page);
	
	//分配方法
	public List<IssueBaseInfoPo> allot(IssueBaseInfoPo issueId);
	
	//指派给下拉列表
	public List<String> designate(IssueBaseInfoPo po);
	
	//分配
	public Integer DistributionOfPreservation(IssueBaseInfoPo issueBaseInfoPo);
	
	//项目下拉列表
	public List<String> queryProjectTwo();
	
	//判断是否为项目管理员操作
	public Integer ifAdministrator(IssueBaseInfoPo po);
}
