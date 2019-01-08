package com.huibo.issue.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bn.javax.dao.Page;
import com.huibo.issue.bo.IssueStateBo;
import com.huibo.issue.po.IssueState;

/**
* <p>Title: 缺陷状态 - IssueStateDao</p>
*
* <p>Description:接口 - IssueState</p>
*
* <p>Copyright: Copyright HBRC(c) 2016</p>

* <p>Company: 汇博人才</p>
*
* @author 王杰  
* @version 1.0
*/
public interface IssueStateDao {

	//新增
	public void addIssueState(IssueStateBo bo);
	
	//删除
	public void removeStateById( @Param("stateCodes") String stateCodes);
	
	//修改
	public void modifyIssueState(IssueStateBo bo);
	
	//分页查询
	public List<IssueState> queryIssueState(Page page);
	
	//单条查询
	public IssueState queryStateById(String stateCode);

	//禁用、启用转换
	public void switchM(IssueStateBo bo);

	//验证
	public Integer validateState(IssueStateBo bo);
}
