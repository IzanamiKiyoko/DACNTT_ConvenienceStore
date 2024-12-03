(() => {
  "use strict"; 
  // Lấy tất cả các form có class 'needs-validation'
  var forms = document.querySelectorAll(".needs-validation");
  
  // Duyệt qua từng form
  Array.from(forms).forEach(form => {
    form.addEventListener("submit", event => {
      // Nếu form không hợp lệ, ngừng submit và hiển thị lỗi
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Nếu form hợp lệ, gọi hàm SignUpNow()
        SignUpNow();
      }
      
      // Thêm lớp 'was-validated' vào form
      form.classList.add("was-validated");
    }, false);
  });
})();