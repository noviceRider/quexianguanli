package com.huibo.issue.bo;

import com.huibo.issue.po.IssueTypePo;


/**
 * <p>
 * Title: 缺陷跟踪管理系统 - BusinesslogicService
 * </p>
 *
 * <p>
 * Description:实体类管理的bo
 * </p>
 *
 * <p>
 * Copyright: Copyright hbkj(c) 2018
 * </p>
 *
 * <p>
 * Company: 重庆汇博科技股份有限公司
 * </p>
 *
 * @author 揭振宇
 * @version 1.0
 */
public class IssueTypeBo extends IssueTypePo {

	private String keyWords;

	public String getKeyWords() {
		return keyWords;
	}

	public void setKeyWords(String keyWords) {
		this.keyWords = keyWords;
	}

	@Override
	public String toString() {
		return "IssueTypeBo [keyWords=" + keyWords + "]";
	}
	
	
}
