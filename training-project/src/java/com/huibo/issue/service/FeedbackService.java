package com.huibo.issue.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.dao.FeedbackDao;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.issueCommentPo;
/**
* <p>Title: 缺陷管理系统 - FeedbackService</p>
*
* <p>Description:缺陷反馈的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Service
public class FeedbackService {
	
	@Autowired
	private FeedbackDao feedbackDao;
	
	/**
	 * 加载数据
	 */
	public Map<String, Object> loadFeedback(IssueBaseInfoPo po) {
		po.setCurrentLoggedInUser(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		Map<String, Object> map = new HashMap<String, Object>();
		Page page = new Page(po);
		List<IssueBaseInfoPo> list = feedbackDao.loadFeedback(page);
		map.put("rows",list);
		map.put("total",page.getTotalRecord());
		return map;
	}
	
	/**
	 * 反馈界面保存按钮
	 */
	public Integer feedbackOfPreservation(IssueBaseInfoPo po) {
		po.setCreateBy(CommonFunction.getUserFromSession().getUserId());	//注入创建人
		po.setModifyBy(CommonFunction.getUserFromSession().getUserId());    //注入修改人
		feedbackDao.feedbackState(po);		//反馈后，改变状态
		return feedbackDao.feedbackOfPreservation(po);		
	}

	/**
	 * 加载缺陷反馈的数据 
	 */
	public List<Object> loadingDefectFeedback(issueCommentPo po) {
		return feedbackDao.loadingDefectFeedback(po);
	}
}