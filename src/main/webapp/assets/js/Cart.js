var Cart = JSON.parse(localStorage.getItem("Cart")) || [];
async function getProducts()
{
	let response = await fetch('/ConvenienceStore/DetailServlet?action=list');
	if (response.ok) 
	{
		products = await response.json();
		if (!Array.isArray(products) || products.length === 0)
		{
			alert('Đã xảy ra lỗi không nhận được dữ liệu, vui lòng tải lại trang');
		}
		showUserSettingCart();
	}
}
async function getCartbefore() 
{
	if (!Array.isArray(products) || products.length == 0)
	{
		await getProducts();			
	}
	Cart.forEach(product => {
	        addCart(product.id,product.quantity,0,product.note);
	});
}
function addToCartSession(product) 
{
    const existingProduct = Cart.find(item => item.id === product.id);   
    if (existingProduct) 
	{
        existingProduct.quantity += product.quantity;
    } 
	else 
	{
        Cart.push(product);
    }    
    // Lưu giỏ hàng cập nhật vào localStorage
    localStorage.setItem("Cart", JSON.stringify(Cart));
}
async function addCart(id,quantity=1,update=1,note="")
{
	if (!document.getElementById("item-cart-"+id))
	{	
		try 
		{			
			if (Array.isArray(products) && products.length > 0) 
			{
				for (var i = 0; i < products.length; i++)
				{
					if (products[i].id === id)
					{
						document.getElementById("cart-list").innerHTML 
						+= createCartDetail(products[i].id,products[i].name,products[i].image,products[i].price,quantity,note);						
						if (update === 1)
						{
							ShowToast('Đã thêm <span class="text-primary">' +products[i].name+'</span> vào giỏ hàng');
							const product = {
						    	id: id,
						    	quantity: quantity,
								note: ""
							};	
						addToCartSession(product);
						}
						break;
					}
				}
			}			
		} 
		catch (error) 
		{
		     //alert('Đã xảy ra lỗi giỏ hàng 2: ' + error);
		}
	}
	else
	{
		var thisQ = 0;
		for (var i=0;i<products.length;i++)
		{
			if (products[i].id === id)
			{
				thisQ = products[i].quantity;
				break;
			}
		}
		var product = Cart.find(item => item.id === id);
		if (product)
		{
			product.quantity += quantity;
			if (product.quantity > thisQ)
			{
				product.quantity = thisQ;
				ShowToast("Đã đạt giới hạn số lượng sản phẩm. Số lượng tự động điều chỉnh ngang giới hạn");
			}
			document.getElementById("cart-quantity-"+id).value = product.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
	}	
}
async function addCart2()
{
	if (!Array.isArray(products) || products.length == 0)
	{
		alert("products rỗng");
		await getProducts();			
	}
	if (!document.getElementById("item-cart-"+parseInt(document.getElementById("item-id").innerHTML)))
	{
		try 
		{			
			if (Array.isArray(products) && products.length > 0) 
			{
				for (var i = 0; i < products.length; i++)
				{
					if (products[i].id === parseInt(document.getElementById("item-id").innerHTML))
					{					
						if (products[i].quantity > 0)
						{
							if (parseInt(document.getElementById("modal-quantity").value) > products[i].quantity)
							{
								document.getElementById("modal-quantity").value = products[i].quantity;
								ShowToast("Đã đạt giới hạn số lượng sản phẩm. Số lượng tự động điều chỉnh ngang giới hạn");
							}
							else
							{
								ShowToast('Đã thêm <span class="text-primary">' +products[i].name+'</span> vào giỏ hàng');
							}
							document.getElementById("cart-list").innerHTML 
							+= createCartDetail(products[i].id,products[i].name,products[i].image,products[i].price,parseInt(document.getElementById("modal-quantity").value),"");
							const product = {
								id: parseInt(document.getElementById("item-id").innerHTML),
								quantity: parseInt(document.getElementById("modal-quantity").value),
								note: ""
							};
							addToCartSession(product);
							break;
						}
					}
				}		
			}			
		} 
		catch (error) 
		{

		}	 
	}
	else
	{
		var thisQ = 0;
		for (var i=0;i<products.length;i++)
		{
			if (products[i].id === parseInt(document.getElementById("item-id").innerHTML))
			{
				thisQ = products[i].quantity;
				break;
			}
		}
		var product = Cart.find(item => item.id === parseInt(document.getElementById("item-id").innerHTML));
		if (product)
		{
			product.quantity += parseInt(document.getElementById("modal-quantity").value);
			if (product.quantity > thisQ)
			{
				product.quantity = thisQ;
				ShowToast("Đã đạt giới hạn số lượng sản phẩm. Số lượng tự động điều chỉnh ngang giới hạn");
			}
			document.getElementById("cart-quantity-"+parseInt(document.getElementById("item-id").innerHTML)).value = product.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
	}
}
function createCartDetail(id,name,img,price,quantity,note)
{
	return `
	<li class="list-group-item py-3 ps-0 border-top border-bottom" id="item-cart-${id}">
	                     <!-- row -->
	                     <div class="row align-items-center">
	                        <div class="col-6 col-md-6 col-lg-7">
	                           <div class="d-flex">
	                              <img src="${img}" alt="Ecommerce" class="icon-shape icon-xxl" />
	                              <div class="ms-3">
	                                 <!-- title -->
	                                 <div class="text-inherit" onclick="loadProductDetail(${id})">
	                                    <h6 class="mb-0">${name}</h6>
	                                 </div>
	                                
	                                 <!-- text -->
	                                 <div class="mt-2 small lh-1">
	                                    <div class="text-decoration-none text-inherit" onclick="deleteCart(${id})">
	                                       <span class="me-1 align-text-bottom">
	                                          <svg
	                                             xmlns="http://www.w3.org/2000/svg"
	                                             width="14"
	                                             height="14"
	                                             viewBox="0 0 24 24"
	                                             fill="none"
	                                             stroke="currentColor"
	                                             stroke-width="2"
	                                             stroke-linecap="round"
	                                             stroke-linejoin="round"
	                                             class="feather feather-trash-2 text-success">
	                                             <polyline points="3 6 5 6 21 6"></polyline>
	                                             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
	                                             <line x1="10" y1="11" x2="10" y2="17"></line>
	                                             <line x1="14" y1="11" x2="14" y2="17"></line>
	                                          </svg>
	                                       </span>
	                                       <a href="#!" class="text-muted">Xóa</a>
	                                    </div>
	                                 </div>
									 <div class="input-group" style="height:30px;margin-top:8px;">
									 	<input id="note-input-${id}" class="form-control rounded" type="text" placeholder="Ghi chú" value="${note}" style="height:30px;">
										<span class="uboyt-group-append">
											<button class="btn bg-white border border-start-0 ms-n10 rounded-0 rounded-end d-flex align-items-center justify-content-center" 
											type="button" style="height:30px;" onclick="SaveNote(${id})">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											        viewBox="0 0 24 24" fill="none" stroke="currentColor"
											        stroke-width="2" stroke-linecap="round"
											        stroke-linejoin="round" class="feather feather-file-text text-success">
											        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
											        <polyline points="14 2 14 8 20 8"></polyline>
											        <line x1="16" y1="13" x2="8" y2="13"></line>
											        <line x1="16" y1="17" x2="8" y2="17"></line>
											        <line x1="10" y1="9" x2="8" y2="9"></line>
											    </svg>
											</button>
										</span>
									</div>
	                              </div>
	                           </div>
	                        </div>
	                        <!-- input group -->
	                        <div class="col-4 col-md-3 col-lg-3">
	                           <!-- input -->
	                           <!-- input -->
	                           <div class="input-group input-spinner">
	                              <input type="button" value="-" class="button-minus btn btn-sm" data-field="quantity" onclick="minusQuantity(${id})">
	                              <input type="number" step="1" max="10" value="${quantity}" id="cart-quantity-${id}" name="quantity" class="quantity-field form-control-sm form-input" />
	                              <input type="button" value="+" class="button-plus btn btn-sm" data-field="quantity" onclick="addQuantity(${id})">
	                           </div>
	                        </div>
	                        <!-- price -->
	                        <div class="col-2 text-lg-end text-start text-md-end col-md-2">
	                           <span class="fw-bold">${price} VNĐ</span>
	                        </div>
	                     </div>
	                  </li>`;
}
function ShowToast(text)
{
	document.getElementById('toast-text').innerHTML=text;
	const toastElement = document.getElementById('liveToast');
	const toast = new bootstrap.Toast(toastElement, {
		animation: true,
		delay: 1500
	});
	toast.show();
}
function SaveNote(id)
{
	if (document.getElementById("note-input-" + id).value.length <= 255)
	{
		let existingProduct = Cart.find(item => item.id === id);  
		if (existingProduct)
		{
			existingProduct.note = document.getElementById("note-input-" + id).value;
			localStorage.setItem("Cart", JSON.stringify(Cart));
			ShowToast("Đã lưu ghi chú thành công");
		}		
	}
	else
	{
		ShowToast('Ghi chú cần phải dưới <span class="text-primary">255<span> kí tự');
	}
	
}
function deleteCart(id)
{
	document.getElementById("item-cart-" + id).remove();
	Cart = Cart.filter(item => item.id !== id);
	localStorage.setItem("Cart", JSON.stringify(Cart));
	ShowToast("Đã xóa sản phẩm khỏi giỏ hàng");
}
function addQuantity(id)
{
	var thisQ = 0;
	for (var i=0;i<products.length;i++)
	{
		if (products[i].id === id)
		{
			thisQ = products[i].quantity;
			break;
		}
	}
	let existingProduct = Cart.find(item => item.id === id);  
	if (existingProduct)
	{
		if (existingProduct.quantity < thisQ)
		{
	    	existingProduct.quantity++;
			document.getElementById("cart-quantity-" + id).value = existingProduct.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
		else
		{
			ShowToast("Đã đạt giới hạn số lượng sản phẩm");
		}
	}
}
function minusQuantity(id)
{
	let existingProduct = Cart.find(item => item.id === id);  
	if (existingProduct)
	{
		if (existingProduct.quantity > 1)
		{
			existingProduct.quantity--;
			document.getElementById("cart-quantity-" + id).value = existingProduct.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
		else
		{
			ShowToast("Số lượng sản phẩm trong giỏ hàng tối thiểu là 1");
		}
	}
}
function deleteAllCart()
{
	localStorage.removeItem("Cart");
	document.getElementById("cart-list").innerHTML = "";
	ShowToast("Đã làm trống giỏ hàng");
}
let totalOrder=0;
let totalQuantity=0;
async function showUserSettingCart()
{	
	let response = await fetch('/ConvenienceStore/DetailServlet?action=list');
	if (response.ok) 
	{
		products = await response.json();
		if (!Array.isArray(products) || products.length === 0)
		{
			alert('Đã xảy ra lỗi không nhận được dữ liệu, vui lòng tải lại trang');
		}
		await fetch(`/ConvenienceStore/Login?action=${encodeURIComponent('{"get"}')}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				})
				.then(response => response.json())
				.then(data => {
				if (data.success) 
				{
					totalOrder=0;
					totalQuantity=0;			
					Cart.forEach(product => {
						totalQuantity+=product.quantity;
						addCart3(product.id,product.quantity);			
					});
				}
				else
				{
					window.location.href = "./signin.html";
				}
				})
				.catch(error => {
					//alert("Đã xảy ra lỗi nhận người dùng cart:"+ error);
					});
				}
}
async function addCart3(id,quantity=1)
{	
	if (!document.getElementById("item-cart-"+id))
	{	
		try 
		{		
			if (Array.isArray(products) && products.length > 0) 
			{
				for (var i = 0; i < products.length; i++)
				{
					if (products[i].id === id)
					{
						document.getElementById("table-cart").innerHTML 
						+= createUSCartDiv(products[i].id,products[i].name,products[i].image,products[i].price,quantity,products[i].tag,products[i].type);
						totalOrder+=products[i].price*quantity;
						document.getElementById("total-quantity").innerHTML = totalQuantity;
						document.getElementById("total-price").innerHTML = totalOrder;
						document.getElementById("table-cart").appendChild(document.getElementById("total-value"));			
						break;
					}
				}	
			}		
		} 
		catch (error) 
		{
		     //alert('Đã xảy ra lỗi giỏ hàng 3: ' + error);
		}		 
	}	
}
function createUSCartDiv(id,name,img,price,quantity,tag,type)
{
	return `
	<tr id="item-cart-${id}">
	   <td class="align-middle border-top-0 w-0">
	       <img src="${img}" alt="Ecommerce" class="icon-shape icon-xl" />
	       </td>
	        <td class="align-middle border-top-0">
	                                          <h6 class="mb-0 text-wrap">${name}</h6>
	                                       <span><small class="text-muted">${Tag(tag)}</small></span>
	                                    </td>
	                                    <td class="align-middle border-top-0">
	                                       <a href="#" class="text-inherit">${id}</a>
	                                    </td>
	                                    <td class="align-middle border-top-0">${quantity}</td>
	                                    <td class="align-middle border-top-0">${price}</td>
	                                    <td class="align-middle border-top-0">${price*quantity}</td>
										<td class="align-middle border-top-0">
										<a href="#!" data-bs-toggle="modal" data-bs-target="#NoteModal" class="btn btn-primary ms-2" onclick="USUINote(${id},'${name}')">Xem</a>
										</td>
	                                 </tr>`;
}
function USUINote(id,name)
{
	let existingProduct = Cart.find(item => item.id === id);  
	if (existingProduct)
	{
		document.getElementById("NoteModalLabel").innerHTML = "Ghi chú cho sản phẩm " + name;
		document.getElementById("note-input-cart").value = existingProduct.note;
		document.getElementById("save-note").onclick = function () 
		{
			if (document.getElementById("note-input-cart").value.length <= 255)
			{
				let existingProduct = Cart.find(item => item.id === id);  
				if (existingProduct)
				{
					existingProduct.note = document.getElementById("note-input-cart").value;
					localStorage.setItem("Cart", JSON.stringify(Cart));
					ShowToast("Đã lưu ghi chú thành công");
				}
			}
			else
			{
				ShowToast('Ghi chú cần phải dưới <span class="text-primary">255<span> kí tự');
			}		
		};
	}	
}
function Tag(i)
{
	switch(i) 
	{
	     case 0:
	    	 return "Thực phẩm tươi sống";
	     case 1:
	    	 return "Thực phẩm chế biến sẵn";
	     case 2:
	    	 return "Đồ uống";
	     case 3:
	    	 return "Đồ uống có cồn";
	     case 4:
	    	 return "Đồ ăn nhẹ và đồ ngọt";
	     case 5:
	    	 return "Hóa mỹ phẩm";
	     case 6:
	    	 return "Đồ dùng gia đình";
	     case 7:
	    	 return "Văn phòng phẩm";
	     default:
	    	 return "Khác";
	  }
}
function Type(i)
{
	switch(i) 
	{
	     case 0:
	    	 return "Chai";
	     case 1:
	    	 return "Gói";
	     case 2:
	    	 return "Thùng";
	     case 3:
	    	 return "Lon";
	     case 4:
	    	 return "Hộp";
		case 5:
			 return "Kg";
	     default:
	    	 return "Khác";
	     }
}
async function addCart2DB() {
    try {
		if (Object.keys(user).length === 0)
		{
			await getUser();
		}	
		if (Cart.length === 0)
		{
			ShowToast('Vui lòng thêm sản phẩm vào giỏ hàng để tiến hành đặt hàng');
			return;
		}
		else if (!user.address || !user.name || !user.phoneNumber)
		{
			ShowToast('Vui lòng nhập đầy đủ thông tin ở <span class="text-primary">"Thông tin tài khoản"<span> để tiến hành đặt hàng');
			return;
		}
		else
		{
		let tempCart = [];
		Cart.forEach(product => {
					 let newElement = { id: product.id, quantity: product.quantity, note: product.note};
					 products.forEach(value => {
					 	if (value.id == product.id)
						{
							newElement["price"] = value.price;
						}
					 });
					 tempCart.push(newElement);
				});
        // Dữ liệu để gửi đến API OrderNow
        const data = {
            cart: JSON.stringify(tempCart), // Cart là một biến toàn cục hoặc được định nghĩa trước đó
            user: JSON.stringify(user), // Truyền user đã lấy từ API Login
        };
        // Gửi thông tin cart và user đến API OrderNow
        await fetch("/ConvenienceStore/OrderNow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // Truyền toàn bộ data dưới dạng JSON
        })
		.then(response => response.json())
			.then(data => {
			    if (data.success) {					
					ShowToast("Đã đặt hàng thành công. Cảm ơn bạn đã mua hàng");
					localStorage.removeItem("Cart");
					document.getElementById("table-cart").innerHTML = "";
					window.location.href = "./orderdetail.html?id="+data.message;
					
			    } else {
					alert("Lỗi máy chủ không nhận được đơn hàng, vui lòng thử lại: " + data.message);	
			    }
			})
			.catch(error => {
			    //console.error("Error:", error);
			});

        }

    } catch (error) {
        //console.error("Error:", error);
    }
}
