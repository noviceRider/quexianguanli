package com.huibo.issue.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huibo.issue.bo.IssuePriorityBo;
import com.huibo.issue.po.IssuePriorityPo;
import com.huibo.issue.service.IssuePriorityService;
/**
* <p>Title: 缺陷管理系统 - IssuePriorityController</p>
*
* <p>Description:控制层逻辑管理的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Controller
public class IssuePriorityController {
	
	@Autowired
	private IssuePriorityService issuePriorityService;
	
	/**
	 * 通过id或者描述查询优先级
	 */
	@RequestMapping("/basicData/getIssuePriority.json")
	public  Map<String,Object> getIssuePriority(IssuePriorityBo issuePriorityBo){
		return issuePriorityService.getIssuePriority(issuePriorityBo);
	}
	
	/**
	 * 通过id查询优先级
	 */
	@RequestMapping("/basicData/getIssuePriorityId.json")
	public  Map<String,Object> getIssuePriorityId(String id){
		System.out.println(id);
		return new HashMap<String,Object>() {
			{
				put("rows",issuePriorityService.getIssuePriorityId(id));
			}
		};
	}
	
	/**
	 * 新增优先级信息
	 */
	@RequestMapping("/basicData/addPriorityPo")
	public  Map<String,Object> addPriorityPo(IssuePriorityPo PriorityPo){
		return new HashMap<String,Object>() {
			{
				put("rows",issuePriorityService.addPriorityPo(PriorityPo));
			}
		};
	}
	
	/**
	 * 修改优先级信息
	 */
	@RequestMapping("/basicData/updPriorityPo.json")
	public  Map<String,Object> updPriorityPo(IssuePriorityPo PriorityPo){
		System.out.println(PriorityPo);	
		return new HashMap<String,Object>() {
			{
				put("rows",issuePriorityService.updPriorityPo(PriorityPo));
			}
		};
	}
	
	/**
	 * 删除优先级信息
	 */
	@RequestMapping("/basicData/delPriorityPo")
	public  Map<String, Object> delPriorityPo(
			  @RequestParam("delIds[]")String[] delIds){
			System.out.println(delIds);
		return new HashMap<String,Object>() {
			{
				put("rows",issuePriorityService.delPriorityPo(delIds));
			}
		};
	}
	
	/**
	 * 表单验证
	 */
	@RequestMapping("/basicData/validatePriorityCode.json")
	public  Map<String, Object> validatePriorityCode(IssuePriorityPo po){
		int code = 0 ;
		Map<String,Object> map = new HashMap<String,Object>();
		Integer count = issuePriorityService.validatePriorityCode(po);
		if(count == 0) {
			code = 1;
		}
		System.out.println("count:"+count);
		map.put("resultCode", code);
		return map;
	}
}