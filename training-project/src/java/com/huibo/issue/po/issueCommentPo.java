package com.huibo.issue.po;

import com.bn.javax.po.BasePo;
/**
 * <p>title:缺陷管理系统-issueCommentPo</p>
 * 
 * <p>Description:评论记录的po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 彭忠义
 * @version 1.0
 */
public class issueCommentPo extends BasePo {

	/**
	 * 记录序号
	 */
	private Integer logId;
	
	/**
	 * 缺陷序号
	 */
	private Integer issueId;
	
	/**
	 * 评论内容
	 */
	private String comment;
	
	/**
	 * 当前状态
	 */
	private String logState;
	
	/**
	 * 创建人
	 */
	private	String	   createBy;
	
	/**
	 * 创建时间
	 */
	private	String	   createTime;
	
	/**
	 * 修改人
	 */
	private	String	   modifyBy;
	
	/**
	 * 修改时间
	 */
	private	String	   modifyTime;

	public Integer getLogId() {
		return logId;
	}

	public void setLogId(Integer logId) {
		this.logId = logId;
	}

	public Integer getIssueId() {
		return issueId;
	}

	public void setIssueId(Integer issueId) {
		this.issueId = issueId;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getLogState() {
		return logState;
	}

	public void setLogState(String logState) {
		this.logState = logState;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getModifyBy() {
		return modifyBy;
	}

	public void setModifyBy(String modifyBy) {
		this.modifyBy = modifyBy;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	@Override
	public String toString() {
		return "issueCommentPo [logId=" + logId + ", issueId=" + issueId + ", comment=" + comment + ", logState="
				+ logState + ", createBy=" + createBy + ", createTime=" + createTime + ", modifyBy=" + modifyBy
				+ ", modifyTime=" + modifyTime + "]";
	}
	
}
