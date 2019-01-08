package com.huibo.issue.dao;

import java.util.List;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssuePriorityBo;
import com.huibo.issue.po.IssuePriorityPo;


/**
* <p>Title: 缺陷管理系统 - IssuePriorityDao</p>
*
* <p>Description:Dao层</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/
public interface IssuePriorityDao {
	//新增优先级信息
	public Integer addPriorityPo(IssuePriorityPo priorityPo);
	
	//通过id或者描述查询优先级
	public List<IssuePriorityPo> getIssuePriority(Page page);
	
	//删除优先级信息
	public Integer delPriorityPo(String[] delIds);
	
	//通过id查询优先级
	public IssuePriorityPo getIssuePriorityId(String id);

	//修改优先级信息
	public void updPriorityPo(IssuePriorityPo priorityPo);

	//表单验证
	public Integer validatePriorityCode(IssuePriorityPo po);
}
