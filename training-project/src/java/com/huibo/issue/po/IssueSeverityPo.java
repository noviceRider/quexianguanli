package com.huibo.issue.po;

import com.bn.javax.po.BasePo;
/**
 * <p>title:缺陷管理系统-IssueSeverityPo</p>
 * 
 * <p>Description:缺陷严重程度的po</p>
 * 
 * <p>Copyright:Copyright hbrc(c) 2018</p>
 * 
 * <p>Company:重庆汇博人才</p>
 * 
 * @author 张浩
 * @version 1.0
 */
public class IssueSeverityPo extends BasePo {

	/**
	 *  严重程度编号
	 */
	private String severityCode ;
	
	/**
	 * 	严重程度描述
	 */
	private String severityDesc ;
	
	/**
	 * 	当前状态
	 */
	private String moduleState ;
	
	/**
	 * 	当前状态描述
	 */
	public String dictCode ;
	
	/**
	 * 	创建人
	 */
	private String createBy ;
	
	/**
	 * 	创建人姓名
	 */
	private String createByName ;
	
	/**
	 * 	创建时间
	 */
	private String createTime ;
	
	/**
	 * 	修改人
	 */
	private String modifyBy ;
	
	/**
	 * 	修改人姓名
	 */
	private String modifyByName ;
	
	/**
	 * 	修改时间
	 */
	private String modifyTime ;

	public String getSeverityCode() {
		return severityCode;
	}

	public void setSeverityCode(String severityCode) {
		this.severityCode = severityCode;
	}

	public String getSeverityDesc() {
		return severityDesc;
	}

	public void setSeverityDesc(String severityDesc) {
		this.severityDesc = severityDesc;
	}

	public String getModuleState() {
		return moduleState;
	}

	public void setModuleState(String moduleState) {
		this.moduleState = moduleState;
	}

	public String getDictCode() {
		return dictCode;
	}

	public void setDictCode(String dictCode) {
		this.dictCode = dictCode;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreateByName() {
		return createByName;
	}

	public void setCreateByName(String createByName) {
		this.createByName = createByName;
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

	public String getModifyByName() {
		return modifyByName;
	}

	public void setModifyByName(String modifyByName) {
		this.modifyByName = modifyByName;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	@Override
	public String toString() {
		return "IssueSeverityPo [severityCode=" + severityCode + ", severityDesc=" + severityDesc + ", moduleState="
				+ moduleState + ", dictCode=" + dictCode + ", createBy=" + createBy + ", createByName=" + createByName
				+ ", createTime=" + createTime + ", modifyBy=" + modifyBy + ", modifyByName=" + modifyByName
				+ ", modifyTime=" + modifyTime + "]";
	}

	
	
	
	
}
