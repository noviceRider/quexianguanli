package com.bn.workflow.service;


/**
* <p>Title: 工作流 - IProcessExtService</p>
*
* <p>Description:工作流扩展服务接口</p>
*
* <p>Copyright: Copyright BSST(c) 2017</p>
*
* <p>Company: 重庆商软冠联信息技术发展有限公司</p>
*
* @author william
* 
* @version 1.0
*/
public interface IProcessExtService {
	/**
	 * 传入参数，执行指定的数据访问
	 * @param accessId 数据访问编号
	 * @param pamams 传入的参数，字符串(JSON、逗号隔开的参数等)
	 * @throws Exception
	 */
	public void execDataAccess(String accessId, String pamams) throws Exception;
	
	/**
	 * 传入参数，执行指定的业务逻辑
	 * @param logicId 业务逻辑编号
	 * @param pamams 传入的参数，字符串(JSON、逗号隔开的参数等)
	 * @throws Exception
	 */
	public void execLogic(String logicId, String pamams) throws Exception;
}
