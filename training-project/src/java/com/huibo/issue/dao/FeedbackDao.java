package com.huibo.issue.dao;

import java.util.List;
import java.util.Map;

import com.bn.javax.dao.Page;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.issueCommentPo;
/**
* <p>Title: 缺陷管理系统 - FeedbackDao</p>
*
* <p>Description:缺陷反馈的Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
public interface FeedbackDao {
	//加载页面及搜索
	public List<IssueBaseInfoPo> loadFeedback(Page page);
	
	//反馈界面的保存
	public Integer feedbackOfPreservation(IssueBaseInfoPo po);
	
	//反馈后将状态改变
	public void feedbackState(IssueBaseInfoPo po);
	
	//加载缺陷反馈的数据 
	public List<Object> loadingDefectFeedback(issueCommentPo po);
}
