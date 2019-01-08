package com.huibo.issue.bo;

import com.huibo.issue.po.ProjectRole;

/**
* <p>Title: 缺陷管理系统 - ProjectRoleBo</p>
*
* <p>Description:实体类继承类 - ProjectRoleBo</p>
*
* <p>Copyright: Copyright HBRC(c) 2018</p>
*
* <p>Company: 汇博人才</p>
*
* @author 王杰  
* @version 1.0
*/
public class ProjectRoleBo extends ProjectRole {

	private String keyWord;
	
	/**
	 * 数据字符串(可操作状态+角色编号+角色姓名)
	 */
	private String dataStr;
	
	/**
	 * 
	 * 可操作状态表中的状态编号
	 */
	private String issueCode;

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}

	public String getDataStr() {
		return dataStr;
	}

	public void setDataStr(String dataStr) {
		this.dataStr = dataStr;
	}

	public String getIssueCode() {
		return issueCode;
	}

	public void setIssueCode(String issueCode) {
		this.issueCode = issueCode;
	}
	
	

}
