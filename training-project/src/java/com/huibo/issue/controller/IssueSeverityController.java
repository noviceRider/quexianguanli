package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huibo.issue.bo.IssueSeverityBo;
import com.huibo.issue.po.IssueSeverityPo;
import com.huibo.issue.service.IssueSeverityService;

/**
 * <p>title:缺陷管理系统-IssueSeverityController</p>
 * 
 * <p>Description:缺陷严重程度的Controller</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
@Controller
public class IssueSeverityController {
	@Autowired
	private IssueSeverityService issueSeverityService ;
	
	/**
	 * 	查询
	 */
	@RequestMapping("/getSeverity")
	public Map<String, Object> getIssueSeverity(IssueSeverityBo bo){
		Map<String, Object> map = null ;
		try {
			map = issueSeverityService.getIssueSeverity(bo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 	增加
	 */
	@RequestMapping("/addSeverity")
	public Map<String,Object> addSeverity(IssueSeverityPo po){
		
		return new HashMap<String,Object>() {
			{
				put("result",issueSeverityService.addSeverity(po));
			}
		};
	}
	/**
	 * 删除
	 */
	@RequestMapping("/deleteSeverity")
	public Map<String,Object> deleteSeverity(@RequestParam("delIds[]") String[] delIds) {
		Map<String, Object> result = null;
		try {
			result = new HashMap<String,Object>();
			result.put("result", issueSeverityService.deleteSeverity(delIds));
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		return result;			
	}

	/**
	 * 	禁用、启用
	 */
	@RequestMapping("/operation")
	public Map<String,Object> operation(IssueSeverityBo bo) {
		return new HashMap<String,Object>(){
			{
				put("result",issueSeverityService.operation(bo));
			}
		};
	}
	
	/**
	 * 	根据编号查询单条数据
	 */
	@RequestMapping("/getSeverityByCode")
	public  Map<String,Object> getSeverityByCode(IssueSeverityPo po){
		Map<String,Object> result = null ;
		try {
			result = new HashMap<String,Object>();
			result.put("result", issueSeverityService.getSeverityByCode(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result ;
	}
	
	/**
	 * 	修改
	 */
	@RequestMapping("/updateSeverity")
	public  Map<String,Object> updateSeverity(IssueSeverityPo po){
		return new HashMap<String,Object>() {
			{
				put("result",issueSeverityService.updateSeverity(po));
			}
		};
	}
	
	/**
	 * 	表单验证
	 * @param po
	 * @return
	 */
	@RequestMapping("/yanzheng")
	public  Map<String, Object> validatePriorityCode(IssueSeverityPo po){
		int code = 0 ;
		Map<String,Object> map = new HashMap<String,Object>();
		Integer count = issueSeverityService.validatePriorityCode(po);
		if(count == 0) {
			code = 1;
		}
		System.out.println("count:"+count);
		map.put("resultCode", code);
		return map;
	}
}