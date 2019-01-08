package com.huibo.issue.po;

import com.bn.javax.po.BasePo;
/**
 * <p>title:缺陷管理系统-IssueWorkLogPo</p>
 * 
 * <p>Description:工时记录的po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 彭忠义
 * @version 1.0
 */
public class IssueWorkLogPo extends BasePo {
	/**
	 * 记录序号
	 */
	private Integer logId;
	
	/**
	 * 缺陷序号
	 */
	private Integer	issueId;
	
	/**
	 * 工时数
	 */
	private String workHours;
	
	/**
	 * 记录描述
	 */
	private String logDesc;
	
	/**
	 * 登记时间
	 */
	private String logDate;
	
	/**
	 * 当前状态
	 */
	private String logState;
	private String issueStateName;		//状态名字
	
	/**
	 * 创建人
	 */
	private	String createBy;
	
	/**
	 * 创建时间
	 */
	private	String createTime;
	
	/**
	 * 修改人
	 */
	private	String modifyBy;
	
	/**
	 * 修改时间
	 */
	private	String modifyTime;
	
	/**
	 * 完成率
	 */
	private	String doneRatio;
	
	/**
	 * 项目名称
	 * @return
	 */
	private	String projectName;
	
	/**
	 * 缺陷名称
	 * @return
	 */
	private String issueName;
	
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

	public String getWorkHours() {
		return workHours;
	}

	public void setWorkHours(String workHours) {
		this.workHours = workHours;
	}

	public String getLogDesc() {
		return logDesc;
	}

	public void setLogDesc(String logDesc) {
		this.logDesc = logDesc;
	}

	public String getLogDate() {
		return logDate;
	}

	public void setLogDate(String logDate) {
		this.logDate = logDate;
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
		return "IssueWorkLog [logId=" + logId + ", issueId=" + issueId + ", workHours=" + workHours + ", logDesc="
				+ logDesc + ", logDate=" + logDate + ", logState=" + logState + ", createBy=" + createBy
				+ ", createTime=" + createTime + ", modifyBy=" + modifyBy + ", modifyTime=" + modifyTime + "]";
	}

	public String getIssueStateName() {
		return issueStateName;
	}

	public void setIssueStateName(String issueStateName) {
		this.issueStateName = issueStateName;
	}

	public String getDoneRatio() {
		return doneRatio;
	}

	public void setDoneRatio(String doneRatio) {
		this.doneRatio = doneRatio;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getIssueName() {
		return issueName;
	}

	public void setIssueName(String issueName) {
		this.issueName = issueName;
	}

	
	
}
