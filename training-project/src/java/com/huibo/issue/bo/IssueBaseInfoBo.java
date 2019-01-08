package com.huibo.issue.bo;

import com.bn.javax.po.BasePo;
import com.huibo.issue.po.IssueBaseInfoPo;
/**
 * <p>title:缺陷管理系统-IssueBaseInfoBo</p>
 * 
 * <p>Description:缺陷基本信息的bo</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 彭忠义
 * @version 1.0
 */
public class IssueBaseInfoBo extends IssueBaseInfoPo {
	private String keyWord;

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}
	
}
