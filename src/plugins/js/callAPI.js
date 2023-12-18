function callAddProduct(data) {
    $.ajax({
        url: '/api/products',
        type: 'POST',
        data: data,
        success: function (response) {
            clearFormFields();
            alert("Created")
            window.location.href = '/products'

        },
        error: function (error) {
            alert("Error");
            console.error('Lỗi khi gửi yêu cầu POST:', error);
        }
    });
}

function callUpdateProduct(id, data){
    $.ajax({
        url: `/api/product/${id}`,
        type: 'PUT',
        data: data,
        success: function(response) {
            window.location.href = '/products'
        },
        error: function (error) {
            alert("Error");
            console.error('Lỗi khi gửi yêu cầu POST:', error);
        }
    });
}

function callDeleteProduct(id){
    $.ajax({
        url: `/api/product/${id}`,
        type: 'DELETE',
        success: function(response) {
            alert("Deleted")
            window.location.reload()
        },
        error: function (error) {
            alert("Error");
            console.error('Lỗi khi gửi yêu cầu DELETE:', error);
        }
    });
}