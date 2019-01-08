package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.issueCommentPo;
import com.huibo.issue.service.FeedbackService;
/**
* <p>Title: 缺陷管理系统 - FeedbackController</p>
*
* <p>Description:缺陷反馈的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Controller
public class FeedbackController {
	@Autowired
	private FeedbackService feedbackSerivce;
	
	/**
	 * 页面加载及搜索
	 */
	@RequestMapping("/loadFeedback")
	public Map<String,Object> loadFeedback(IssueBaseInfoPo po){
		Map<String,Object> map = new HashMap<>();
		try {
			map = feedbackSerivce.loadFeedback(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 反馈界面保存按钮
	 */
	@RequestMapping("/feedbackOfPreservation")
	public Map<String,Object> feedbackOfPreservation(IssueBaseInfoPo po){
		Map<String,Object> map = new HashMap<>();
		try {
			map.put("rows", feedbackSerivce.feedbackOfPreservation(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 加载缺陷反馈的数据 
	 */
	@RequestMapping("/loadingDefectFeedback")
	public Map<String,Object> loadingDefectFeedback(issueCommentPo po){
		Map<String,Object> map = new HashMap<>();
		try {
			map.put("rows", feedbackSerivce.loadingDefectFeedback(po));
		} catch (Exception e) {
		}
		System.out.println(map);
		return map;
	}
}