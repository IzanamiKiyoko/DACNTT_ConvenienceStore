package controller;
import controller.Login;
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
import javax.servlet.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import org.json.JSONObject;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@WebServlet("/OrderNow")
public class OrderNow extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    request.setCharacterEncoding("UTF-8");
	    PrintWriter out = response.getWriter();
	    JSONObject responseJson = new JSONObject();
	    StringBuilder jsonBuffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

     // Parse JSON request body
        JSONObject requestBody = new JSONObject(jsonBuffer.toString());

        // Lấy dữ liệu `cart` và `user`
        String cartJson = requestBody.getString("cart"); // Chuỗi JSON chứa thông tin giỏ hàng
        String userJson = requestBody.getString("user"); // Chuỗi JSON chứa thông tin user

        // Parse JSON `cart` và `user` nếu cần
        JSONArray cart = new JSONArray(cartJson);
        JSONObject user = new JSONObject(userJson);
        //Tạo giá trị ngày tháng năm hiện tại
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = now.format(formatter);
        //LẤy dữ liệu mã cửa hàng
        int storeID = 1;
		 Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if ("StoreID".equals(cookie.getName())) {
	                String username = cookie.getValue(); // Lấy giá trị của cookie
	                // Xử lý với giá trị cookie
	                storeID = Integer.parseInt(username);
	            }
	        }
	    }
	    int oid = -1;
        String sql = "INSERT INTO orders (cid,create_date,process,sid,ship_add,cname,cphoneNumber) VALUES (?,?,0,?,?,?,?);";
        try
        {
        	PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        	stmt.setInt(1, user.getInt("id"));
	    	stmt.setString(2, formattedDateTime);
	    	stmt.setInt(3, storeID);
	    	stmt.setString(4, user.getString("address"));
	    	stmt.setString(5, user.getString("name"));
	    	stmt.setString(6, user.getString("phoneNumber"));
            int check = stmt.executeUpdate();
            if (check > 0)
            {
            	// Lấy ID tự động sinh
            	ResultSet generatedKeys = stmt.getGeneratedKeys();
                if (generatedKeys.next())
                {
                    oid = generatedKeys.getInt(1); // Cột 1 chứa ID      
                } 
             
            }
            stmt.close();
        }
        catch (Exception e){
        	responseJson.put("success", false);
            responseJson.put("message", e.getMessage());
        }
        finally {
           
        }
        sql = "INSERT INTO order_detail (oid,pid,quantity,note,price) VALUES (?,?,?,?,?);";
        try
        {
        	PreparedStatement stmt = connection.prepareStatement(sql);
        	for (int i = 0; i < cart.length(); i++)
        	{
        		JSONObject item = cart.getJSONObject(i);
        		stmt.setInt(1, oid);
        		stmt.setInt(2, item .getInt("id"));
        		stmt.setInt(3, item .getInt("quantity"));
        		stmt.setString(4, item.getString("note"));
        		stmt.setInt(5, item.getInt("price"));
        		stmt.executeUpdate();        		
            }
        	stmt.close();
        	responseJson.put("success", true);
            responseJson.put("message", oid);
        }
        catch (Exception e){
        	responseJson.put("success", false);
            responseJson.put("message", e.getMessage());
        	
        }
        finally {
            
        }
        sql = "update products set quantity=quantity-? where id=?;";
        try
        {
        	PreparedStatement stmt = connection.prepareStatement(sql);
        	for (int i = 0; i < cart.length(); i++)
        	{
        		JSONObject item = cart.getJSONObject(i);
        		stmt.setInt(1, item .getInt("quantity"));
        		stmt.setInt(2, item .getInt("id"));
        		stmt.executeUpdate();        		
            }
        	stmt.close();
        	responseJson.put("success", true);
            responseJson.put("message", oid);
        }
        catch (Exception e){
        	responseJson.put("success", false);
            responseJson.put("message", e.getMessage());
        	
        }
        finally {
            
        }
        out.write(responseJson.toString());
	}

	
}