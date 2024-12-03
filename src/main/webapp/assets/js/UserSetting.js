const name = document.getElementById("form-name");
const email = document.getElementById("form-email");
const address = document.getElementById("form-address");
const phone = document.getElementById("form-sdt");
async function GetUserDetailForOrder()
{
	if (Object.keys(user).length === 0)
	{
		await getUser();
	}
	if (Object.keys(user).length === 0)
	{
		window.location.href = "./signin.html";
	}
	else
	{
		if (user.name)
		{
			document.getElementById("customer-name").innerHTML = user.name;
			document.getElementById("customer-name").classList.replace("text-danger", "text-secondary");
		}
		else
		{
			document.getElementById("customer-name").innerHTML = "Vui lòng nhập tên ở Thông tin tài khoản";
			document.getElementById("customer-name").classList.replace("text-secondary", "text-danger");
		}	
		if (user.address)
		{
			document.getElementById("customer-address").innerHTML = user.address;
			document.getElementById("customer-address").classList.replace("text-danger", "text-secondary");
		}
		else
		{
			document.getElementById("customer-address").innerHTML = "Vui lòng nhập địa chỉ ở Thông tin tài khoản";
			document.getElementById("customer-address").classList.replace("text-secondary", "text-danger");
		}	
		if (user.phoneNumber)
		{
			document.getElementById("customer-phone").innerHTML = user.phoneNumber;
			document.getElementById("customer-phone").classList.replace("text-danger", "text-secondary");
		}
		else
		{
			document.getElementById("customer-phone").innerHTML = "Vui lòng nhập số điện thoại ở Thông tin tài khoản";
			document.getElementById("customer-phone").classList.replace("text-secondary", "text-danger");
		}
	}
}
async function GetUserDetail()
{
	if (Object.keys(user).length === 0)
	{
		await getUser();
	}
	if (Object.keys(user).length === 0)
	{
		window.location.href = "./signin.html";
	}
	else
	{
		showinhtml();
	}
}
function showinhtml()
{
	name.value = user.name;
	email.value = user.email;
	address.value = user.address;
	phone.value = user.phoneNumber;
}
async function disableAccount()
{
	GetUserDetail();
	fetch(`/ConvenienceStore/Login?action=${encodeURIComponent('{"delete"}')}&email=${encodeURIComponent(user.email)}&id=${encodeURIComponent(user.id)}`, {
		    method: "GET",
		    headers: {
		        "Content-Type": "application/x-www-form-urlencoded"
		    },
		})
		.then(response => response.json())
		.then(data => {
		    if (data.success) {
				user={};
				alert("Xóa thành công.");
				window.location.href = "./index.html";
		    } else {
		        ShowToast('Xóa <span class="text-danger">thất bại<span>, vui lòng thử lại!');	
		    }
		})
		.catch(error => {

		});
}
async function changeDetail()
{
	if (!name.value)
	{
		ShowToast('<span class="text-danger">Thất bại: <span> <span class="text-secondary">vui lòng nhập tên<span>');
		return;
	}
	else if (!email.value)
	{
		ShowToast('<span class="text-danger">Thất bại: <span> <span class="text-secondary">vui lòng nhập địa chỉ email<span>');
		return;
	}
	else if (phone.value.length < 10 || phone.value.length > 11)
	{
		ShowToast('<span class="text-danger">Thất bại: <span> <span class="text-secondary">vui lòng nhập đúng số điện thoại<span>');
		return;
	}
	fetch(`/ConvenienceStore/Login?action=change`, {
			    method: "POST",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
				body: `email=${email.value}&phone=${phone.value}&name=${name.value}&address=${address.value}`
			})
			.then(response => response.json())
			.then(data => {
			    if (data.success) {
					ShowToast('Cập nhật <span class="text-primary">thành công<span>');
			    } else {
			        ShowToast('Cập nhật <span class="text-danger">thất bại<span>, vui lòng thử lại!');
			    }
			})
			.catch(error => {

			});
}
async function changePassword()
{
	const newPassword = document.getElementById("new-password").value;
	const curPassword = document.getElementById("cur-password").value;
	if (newPassword.length < 5 || newPassword.length > 15)
	{
		alert("Thất bại: nhập mật khẩu mới có độ dài từ 5 đến 15 kí tự");
		return;
	}
	fetch(`/ConvenienceStore/Login?action=changePassword`, {
			    method: "POST",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
				body: `new=${newPassword}&cur=${curPassword}`
			})
			.then(response => response.json())
			.then(data => {
			    if (data.success) {
					ShowToast('Cập nhật <span class="text-primary">thành công<span>');
			    } else {
			        ShowToast('Cập nhật <span class="text-danger">thất bại<span>, vui lòng thử lại!');
			    }
			})
			.catch(error => {

			});
}
function Gettinglogout() {
    fetch(`/ConvenienceStore/Login?action=logout`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
			
            // Reset thông tin người dùng
            user = {};
            // Điều hướng về trang chính
            window.location.href = "./index.html";
        } else {
			ShowToast('Đăng xuất <span class="text-danger">thất bại<span>, vui lòng thử lại!');
        }
    })
    .catch(error => {

    });
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
