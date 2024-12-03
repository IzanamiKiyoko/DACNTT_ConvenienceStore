async function SignUpNow()
{
	alert("Đã vào");
	const fullname = document.getElementById('signup-fullName');
	const email = document.getElementById('signup-email');
	const password = document.getElementById('signup-password');
	if (fullname.value.trim() != "" && email.value.trim() != "" && password.value.trim() != "")
	{
		let formData = {
			fullname: fullname.value,
		    email: email.value,
		    password: password.value
		};

		fetch("/ConvenienceStore/UserServlet", {
		    method: "POST",
		    headers: {
		        "Content-Type": "application/json"
		    },
		    body: JSON.stringify(formData)
		})
		.then(response => response.json())
		.then(data => {
		    console.log("Dữ liệu phản hồi từ servlet:", data);
		})
		.catch(error => {
		    console.error("Lỗi:", error);
		});

	}
}