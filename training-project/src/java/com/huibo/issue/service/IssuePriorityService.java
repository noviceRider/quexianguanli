package com.huibo.issue.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bn.frame.util.CommonFunction;
import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssuePriorityBo;
import com.huibo.issue.dao.IssuePriorityDao;
import com.huibo.issue.po.IssuePriorityPo;


/**
* <p>Title: 缺陷管理系统 - IssuePriorityService</p>
*
* <p>Description:服务层逻辑管理的Service</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
@Service
public class IssuePriorityService {
	
	@Autowired
	private IssuePriorityDao issuePriorityDao;
	
	/**
	 * 增加优先级信息
	 * @param priorityPo
	 * @return
	 */
	public Object addPriorityPo(IssuePriorityPo priorityPo) {
		priorityPo.setPriorityState("01");	//注入状态
		priorityPo.setCreateBy(CommonFunction.getUserFromSession().getUserName());	//注入创建人
		priorityPo.setModifyBy(CommonFunction.getUserFromSession().getUserName());	//注入修改人
		Integer row = issuePriorityDao.addPriorityPo(priorityPo);
		return row;
	}
	
	/**
	 * 修改优先级信息
	 * @param priorityPo
	 * @return
	 */
	public Integer updPriorityPo(IssuePriorityPo priorityPo) {
		priorityPo.setModifyBy(CommonFunction.getUserFromSession().getUserName());//注入修改人
		issuePriorityDao.updPriorityPo(priorityPo);
		return 1;
	}
	
	/**
	 * 删除优先级信息
	 * @param delIds
	 * @return
	 */
	public Integer delPriorityPo(String[] delIds) {
		return issuePriorityDao.delPriorityPo(delIds);
	}
	
	/**
	 * 查询优先级信息
	 * @param issuePriorityBo
	 * @return
	 */
	public Map<String,Object> getIssuePriority(IssuePriorityBo issuePriorityBo) {
		Map<String,Object> result = new HashMap<String, Object>();
		Page page = new Page(issuePriorityBo);
		List<IssuePriorityPo> list = issuePriorityDao.getIssuePriority(page);
		result.put("rows",list);
		result.put("total",page.getTotalRecord());
		return result;
	}
	
	/**
	 * 根据id查询信息
	 * @param id
	 * @return
	 */
	public IssuePriorityPo getIssuePriorityId(String id) {
		return issuePriorityDao.getIssuePriorityId(id);
	}

	/**
	 * 表单验证
	 * @param po
	 * @return
	 */
	public Integer validatePriorityCode(IssuePriorityPo po) {
		return issuePriorityDao.validatePriorityCode(po);
	}
}