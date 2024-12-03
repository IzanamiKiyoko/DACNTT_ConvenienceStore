let orders = [];
let details = [];
async function getOrdersList()
{	
	if (orders.length === 0)
	{
	if (Object.keys(user).length === 0)
	{
		await getUser();
	}	
	if (Object.keys(user).length === 0)
	{
		window.location.href = "./signin.html";
	}
	let response = await fetch('/ConvenienceStore/Orders?action=orders&id='+user.id);
	if (response.ok) 
	{
		await fetch("/ConvenienceStore/Orders?action=list", {
			    method: "GET",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
			})
			.then(response => response.json())
			.then(data => {
			    if (data.success) 
				{
					orders = data.message;
					getOrdersListBefore();
			    } 
				else 
				{
					
			    }
			})
			.catch(error => {
			    
			});
	}
	}
}
async function getOrdersListBefore() 
{
	orders.sort((a, b) => {
	    // Sắp xếp theo id giảm dần
	    if (a.process !== b.process) {
	        return a.process - b.process; // Tăng dần theo trạng thái
	    }
	    // Nếu trạng thái bằng nhau, sắp xếp theo id
	    return b.id - a.id; // Giảm dần theo id
	});

	orders.forEach(item => {
	    showList(item.id, item.quantity);
	});
}
function showList(id)
{
	if (!document.getElementById("item-order-"+id))
	{	
		if (Array.isArray(orders) && orders.length > 0) 
		{
			for (var i = 0; i < orders.length; i++)
			{
				if (orders[i].id === id)
				{
					if (document.getElementById("table-orders"))
					{
						if (orders[i].process == 3)
						{
							document.getElementById("table-orders").innerHTML 
							+= createOrderDIV(orders[i].id,orders[i].create_date,orders[i].process,orders[i].price,"text-secondary");	
						}	
						else if (orders[i].process == 4)
						{
							document.getElementById("table-orders").innerHTML 
							+= createOrderDIV(orders[i].id,orders[i].create_date,orders[i].process,orders[i].price,"text-danger");	
						} 
						else
						{
							document.getElementById("table-orders").innerHTML 
							+= createOrderDIV(orders[i].id,orders[i].create_date,orders[i].process,orders[i].price,"text-primary");	
						}					
					}
					break;
				}
			}	
		}	 
	}	
}
function createOrderDIV(id,day,process,total,color)
{
	return `
	<tr id="item-order-${id}">
		        <td class="align-middle border-top-0 ${color}">${id}</div>
		        <td class="align-middle border-top-0 ${color}">${day}</td>
		        <td class="align-middle border-top-0 ${color}">${Process_name(process)}</td>
		        <td class="align-middle border-top-0 ${color}">${total} VNĐ</td>
				<td id="total-price" class="align-middle border-top-0">
				<a href="./orderdetail.html?id=${id}" class="btn btn-primary ms-2">Xem</a></td>  		                                    
	</tr>`;
}
function Process_name(process)
{
	switch (process)
	{
		case 0: 
			return "Chờ xử lý";
		case 1: 
			return "Đang xử lý";
		case 2: 
			return "Đang giao hàng";
		case 3: 
			return "Đã hoàn thành";
		case 4: 
			return "Đã hủy";
		default:
			return "Lỗi hiển thị";
	}
}
function ShowDetailOrder(id)
{	
	id_detail = id;
	window.location.href = "./orderdetail.html";	
}
async function getDetailsList()
{	
	if (orders.length === 0) 
	{
		await getOrdersList();		
	}
	
	if (details.length === 0)
	{
	await fetch("/ConvenienceStore/Orders?action=detail", {
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
	},
	})
	.then(response => response.json())
	.then(data => {
	if (data.success) 
	{
		details = data.message;
	} 
	else 
	{
						
	}
	})
	.catch(error => {
				    
	});
	}
	const url = new URL(window.location.href);
	const id = url.searchParams.get('id');
	if (id == null)
	{
		window.location.href = "./checkout.html";
	}
	else
	{
		var index = 1;
		var total = 0;
		for (var i = 0; i < Object.keys(orders).length; i++)
		{
			if (orders[i].id == id)
			{
				document.getElementById("detail-order-id").innerHTML=orders[i].id;
				document.getElementById("detail-customer-name").innerHTML=orders[i].cname;
				document.getElementById("detail-customer-address").innerHTML=orders[i].ship_add;
				document.getElementById("detail-customer-phone").innerHTML=orders[i].cphoneNumber;
				document.getElementById("detail-order-day").innerHTML=orders[i].create_date;
				document.getElementById("detail-order-process").innerHTML=Process_name(orders[i].process);
			}
		}
		document.getElementById("order-items").innerHTML="";
		for (var i = 0; i < Object.keys(details).length; i++)
		{
			if (details[i].oid == id)
			{
				document.getElementById("order-items").innerHTML
				+=createOrderDetailDIV(index,details[i].name,details[i].quantity,details[i].price,details[i].note);
				index++;
				total+=details[i].price*details[i].quantity;
			}
		}
		document.getElementById("total-price").innerHTML=total + " VNĐ";
	}
}
function createOrderDetailDIV(index,name,quantity,price,note="")
{
	return 	`
			    <tr>
			        <td>${index}</td>
			        <td class="text-wrap">${name}</td>
			        <td>${quantity}</td>
			        <td>${price} VNĐ</td>
					<td>${price*quantity}VNĐ</td>
					<td>
					<a href="#!" data-bs-toggle="modal" data-bs-target="#NoteModal" class="btn btn-primary ms-2" onclick="OrderDetailNote('${name}','${note}')">
					Xem</a></td>
			    </tr>`;
}
function OrderDetailNote(name,note)
{
	document.getElementById("NoteModalLabel").innerHTML = "Ghi chú cho sản phẩm " + name;
	if (note)
	{
		document.getElementById("NoteModalContext").innerHTML = 'Nội dung: <span class="text-primary">' + note + '<span>';	
	}
	else
	{
		document.getElementById("NoteModalContext").innerHTML = "Khách hàng không có ghi chú cho sản phẩm này";	
	}
}