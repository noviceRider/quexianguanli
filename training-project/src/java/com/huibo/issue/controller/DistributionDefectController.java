package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.service.DistributionDefectService;

/**
* <p>Title: 缺陷管理系统 - DistributionDefectController</p>
*
* <p>Description:缺陷分配的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Controller
public class DistributionDefectController {
	@Autowired
	private DistributionDefectService distributionDefectService;
	
	/**
	 * 加载数据网格及搜索
	 */
	@RequestMapping("/loadDistribution")
	public Map<String,Object> loadDistribution(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.loadDistribution(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 分配方法
	 */
	@RequestMapping("/allot")
	public Map<String, Object> allot(IssueBaseInfoPo issueId){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.allot(issueId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 指派给下拉列表
	 */
	@RequestMapping("/designate")
	public Map<String,Object> designate(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.designate(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 分配
	 */
	@RequestMapping("/DistributionOfPreservation")
	public Map<String,Object> DistributionOfPreservation(IssueBaseInfoPo issueBaseInfoPo){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.DistributionOfPreservation(issueBaseInfoPo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 项目下拉列表
	 */
	@RequestMapping("/queryProjectTwo")
	public Map<String,Object> queryProjectTwo(){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.queryProjectTwo();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 判断是否为项目管理员操作
	 */
	@RequestMapping("/ifAdministrator")
	public Map<String,Object> ifAdministrator(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = distributionDefectService.ifAdministrator(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}