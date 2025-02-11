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
@WebServlet("/StoreLocationServlet")
public class StoreLocationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();
	public JSONArray stores = new JSONArray();
 protected void doGet(HttpServletRequest request, HttpServletResponse response) throws
ServletException, IOException {
	 response.setContentType("application/json;charset=UTF-8");	 
	 PrintWriter out = response.getWriter();
	 String action = request.getParameter("action");
	 if ("stores".equals(action)) 
	 {
		 if (stores.length() == 0)
		 {
			 try {
				 String query = "SELECT id, name, address, email, phoneNumber, close FROM store_location";
				 PreparedStatement ps = connection.prepareStatement(query);
				 ResultSet rs = ps.executeQuery();
				 stores.clear();
				 while (rs.next()) {
					 JSONObject jsonObject = new JSONObject();
					 jsonObject.put("id", rs.getInt("id"));
					 jsonObject.put("name", rs.getString("name"));
					 jsonObject.put("address", rs.getString("address"));
					 jsonObject.put("email", rs.getString("email"));
					 jsonObject.put("phoneNumber", rs.getString("phoneNumber"));
					 jsonObject.put("close", rs.getInt("close"));
					 stores.put(jsonObject);
				 }
				 	// Đóng ResultSet và PreparedStatement
				 	rs.close();
				 	ps.close();
			 } catch (Exception e) {
				 e.printStackTrace();
				 response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				 out.print("{\"error\":\"An error occurred on the server\"}");
			 } finally {
				 out.close();
			 }
		 }
	 }
	 else if ("list".equals(action)) 
	 {
	     out.print(stores.toString());
	 }
 }
 
 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
 ServletException, IOException 
 {	 

}
}