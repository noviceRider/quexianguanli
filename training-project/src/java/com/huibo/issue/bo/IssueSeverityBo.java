package com.huibo.issue.bo;

import com.huibo.issue.po.IssueSeverityPo;

/**
 * <p>title:缺陷管理系统-IssueSeverityBo</p>
 * 
 * <p>Description:严重程度的bo</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public class IssueSeverityBo extends IssueSeverityPo {

	private String keyWord ;

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}
	
	
}
