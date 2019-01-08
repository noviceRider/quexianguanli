package com.huibo.issue.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huibo.issue.po.IssueAttachPo;
import com.huibo.issue.po.IssueBaseInfoPo;
import com.huibo.issue.po.IssueWorkLogPo;
import com.huibo.issue.service.HandleService;

/**
* <p>Title: 缺陷管理系统 - HandleController</p>
*
* <p>Description:缺陷处理的Controller</p>
*
* <p>Copyright: Copyright bnkj(c) 2016</p>
*
* <p>Company: 重庆汇博有限公司</p>
*
* @author 彭忠义 
* @version 1.0
*/

@Controller
public class HandleController {
	@Autowired
	private	HandleService handleService;
	
	/**
	 * 加载数据网格
	 */
	@RequestMapping("/loadHandle")
	public Map<String,Object> loadHandle(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = handleService.loadHandle(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 搜索处理界面需要的数据
	 */
	@RequestMapping("/dealWith")
	public Map<String,Object> dealWith(IssueBaseInfoPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map = handleService.dealWith(po);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 处理保存
	 */
	@RequestMapping("/handleOfPreservation")
	public Map<String,Object> handleOfPreservation(IssueWorkLogPo po){
		Map<String, Object> map = new HashMap<>();
		try {
			map.put("rows",handleService.handleOfPreservation(po));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 加载附件信息
	 */
	@RequestMapping("/queryAccessory")
	public Map<String,Object> queryAccessory(IssueAttachPo po){
		Map<String,Object> map = new HashMap<>();
		try {
			map.put("rows", handleService.queryAccessory(po));
		} catch (Exception e) {
		}
		System.out.println(map);
		return map;
	}
	
	/**
	 * 下载附件
	 */
	@RequestMapping("/previewPictures")
	public void previewPictures(String attachId,String attachFile,HttpServletResponse resp){
		Path path=Paths.get("D://upload//resource2//"+attachId+attachFile);
		File file=path.toFile();	
    	InputStream in = null;
		OutputStream out = null;
		try {
			in = new BufferedInputStream(new FileInputStream(file));
			byte[] bs=new byte[1024];
			int len=-1;
			resp.setContentType(Files.probeContentType(path));
			attachFile=new String( attachFile.getBytes("gb2312"), "ISO8859-1" );
			if(attachFile.length()>150)//解决IE 6.0 bug
			   attachFile=new String(attachFile.getBytes("GBK"),"ISO-8859-1");
			resp.setHeader("Content-Disposition", "attachement;filename="+attachId+attachFile);
			out = new BufferedOutputStream(resp.getOutputStream());
			while((len=in.read(bs))!=-1) {
				out.write(bs, 0, len);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally {
		 	try {
				in.close();
				out.flush();
			} catch (IOException e) {
				e.printStackTrace();
			} 	
		}		
	}
}