package controller;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import util.DBConnection;
import java.util.Base64;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
@WebServlet("/Orders")
public class Orders extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();	
	public JSONArray orders = new JSONArray();
	public JSONArray details = new JSONArray();
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    request.setCharacterEncoding("UTF-8");
	    String action = request.getParameter("action");
	    PrintWriter out = response.getWriter();
	    JSONObject responseJson = new JSONObject();
	    if ("detail".equals(action)) 
	    {
	    	responseJson.put("success", true);
            responseJson.put("message", details);
	    } 
	    else if ("orders".equals(action)) 
	    {	    	
	    	try {
	            String query = "SELECT * FROM orders where cid=?";
	            PreparedStatement ps = connection.prepareStatement(query);
	            ps.setInt(1, Integer.parseInt(request.getParameter("id")));
	            ResultSet rs = ps.executeQuery();
	            orders.clear();
	            details.clear();
	            while (rs.next()) {
	                JSONObject jsonObject = new JSONObject();
	                jsonObject.put("id", rs.getInt("id"));
	                jsonObject.put("cid", rs.getInt("cid"));
	                jsonObject.put("create_date", rs.getString("create_date"));
	                jsonObject.put("process", rs.getInt("process"));
	                jsonObject.put("sid", rs.getInt("sid"));
	                jsonObject.put("ship_add", rs.getString("ship_add"));
	                jsonObject.put("cname", rs.getString("cname"));
	                jsonObject.put("cphoneNumber", rs.getString("cphoneNumber"));
	                int total = 0;
	                String query2 = "SELECT order_detail.oid as oid, order_detail.pid as pid, order_detail.quantity as quantity, "
	                		+ "order_detail.note as note, order_detail.price as price, products.name as name FROM order_detail "
	                		+ "left join products on order_detail.pid = products.id where oid=?";
	                PreparedStatement ps2 = connection.prepareStatement(query2);		            
	                ps2.setInt(1, rs.getInt("id"));
	            	ResultSet rs2 = ps2.executeQuery();	            	
	            	while (rs2.next()) {
	            		JSONObject jsonObject2 = new JSONObject();
	            		jsonObject2.put("oid", rs2.getInt("oid"));
	            		jsonObject2.put("pid", rs2.getInt("pid"));
	            		jsonObject2.put("name", rs2.getString("name"));
	            		jsonObject2.put("quantity", rs2.getInt("quantity"));
	            		jsonObject2.put("note", rs2.getString("note"));
	            		jsonObject2.put("price", rs2.getInt("price"));
	            		total +=rs2.getInt("price");
	            		details.put(jsonObject2);            	
	            	}
		            jsonObject.put("price", total);
	                orders.put(jsonObject);
	            }
	            responseJson.put("success", true);
	            responseJson.put("message", "Lấy dữ liệu hoàn tất");
	            // Đóng ResultSet và PreparedStatement
	            rs.close();
	            ps.close();	            
	        } catch (Exception e) {
	        	responseJson.put("success", false);
	            responseJson.put("message", e.getMessage());
	        } finally {
	            out.close();
	        }
	    }
	    else if ("list".equals(action)) 
	    {
	    	responseJson.put("success", true);
            responseJson.put("message", orders);
	    }
	    out.write(responseJson.toString());
}

 
 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
 ServletException, IOException 
 {	 
	 
}
}