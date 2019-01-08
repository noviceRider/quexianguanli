package com.huibo.issue.dao;

import java.util.List;


import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssueSeverityBo;
import com.huibo.issue.po.IssueSeverityPo;

/**
 * <p>title:缺陷管理系统-IssueSeverityDao</p>
 * 
 * <p>Description:缺陷严重程度的dao</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public interface IssueSeverityDao {

	//查询
	public List<IssueSeverityPo> getIssueSeverity(Page page);

	//增加
	public Integer addSeverity(IssueSeverityPo po);

	//删除
	public Integer deleteSeverity(String[] delIds);

	//禁用、启用
	public Integer operation(IssueSeverityBo bo);

	//根据编号查询单条数据
	public IssueSeverityPo getSeverityByCode(IssueSeverityPo po);

	//修改
	public Integer updateSeverity(IssueSeverityPo po);

	//表单验证
	public Integer validatePriorityCode(IssueSeverityPo po);
}
