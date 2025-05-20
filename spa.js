//////////////////// Customer Related jQueries /////////////////////////////
let customer_db = JSON.parse(localStorage.getItem('customer_db')) || [];
let selectedCustomerIndex = -1;

// Initialize the page
$(document).ready(function () {
    generateNextCustomerId();
    loadCustomersOnTable();

    // Enable form when add button is clicked
    $('[data-bs-target="#addCustomerModal"]').click(function () {
        $('#customerForm')[0].reset();
        generateNextCustomerId();
    });
});

// Load customers into the table
function loadCustomersOnTable() {
    $('#customer_tbody').empty();

    if (customer_db.length === 0) {
        $('#customer_tbody').append('<tr><td colspan="6" class="text-center">No customers found</td></tr>');
        return;
    }

    customer_db.forEach((customer, index) => {
        let row = `<tr data-index="${index}">
                      <td>${customer.id}</td>
                      <td>${customer.name}</td>
                      <td>${customer.phone}</td>
                      <td>${customer.email || '-'}</td>
                      <td>${customer.address || '-'}</td>
                      <td>
                          <button class="btn btn-sm btn-danger delete-customer-btn" data-index="${index}">
                              <i class="bi bi-trash"></i>
                          </button>
                      </td>
                  </tr>`;
        $('#customer_tbody').append(row);
    });

    // Add click event for delete buttons
    $('.delete-customer-btn').on('click', function(e) {
        e.stopPropagation(); // Prevent row selection when clicking delete
        const index = $(this).data('index');
        deleteCustomer(index);
    });
}

// Generate the next customer ID
function generateNextCustomerId() {
    if (customer_db.length === 0) {
        $('#customer_id').val('C001');
        return;
    }

    // Get the highest ID and increment
    const maxId = Math.max(...customer_db.map(c =>
        parseInt(c.id.substring(1))));
    const nextId = 'C' + String(maxId + 1).padStart(3, '0');
    $('#customer_id').val(nextId);
}

// Delete customer function
function deleteCustomer(index) {
    if (index === -1 || index >= customer_db.length) {
        Swal.fire({
            icon: "warning",
            title: "No Selection!",
            text: "Please select a valid customer first"
        });
        return;
    }

    const customer = customer_db[index];

    Swal.fire({
        title: "Are you sure?",
        html: `You are about to delete <strong>${customer.name}</strong> (${customer.id})`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            customer_db.splice(index, 1);
            syncCustomers();
            loadCustomersOnTable();
            resetCustomerForm();

            Swal.fire(
                "Deleted!",
                "Customer has been deleted.",
                "success"
            );
        }
    });
}

// Save customer to the database
$('#customer_save').on('click', function () {
    let id = $('#customer_id').val();
    let name = $('#customerName').val().trim();
    let phone = $('#customerPhone').val().trim();
    let email = $('#customerEmail').val().trim();
    let address = $('#customerAddress').val().trim();

    // Validation
    if (!name || !phone) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please fill all required fields!"
        });
        return;
    }

    // Phone number validation
    if (!/^0[1-9][0-9]{8}$/.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone!",
            text: "Please enter a valid Sri Lankan phone number (10 digits starting with 0)"
        });
        return;
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email!",
            text: "Please enter a valid email address"
        });
        return;
    }

    let customer_data = {
        id: id,
        name: name,
        phone: phone,
        email: email || null,
        address: address || null
    };

    // Check if we're updating an existing customer
    if (selectedCustomerIndex !== -1) {
        customer_db[selectedCustomerIndex] = customer_data;
    } else {
        customer_db.push(customer_data);
    }

    syncCustomers();
    loadCustomersOnTable();

    Swal.fire({
        title: "Success!",
        text: `Customer ${selectedCustomerIndex !== -1 ? 'updated' : 'added'} successfully`,
        icon: "success"
    }).then(() => {
        $('#addCustomerModal').modal('hide');
        resetCustomerForm();
    });
});

// Select a customer from the table
$('#customer_tbody').on('click', 'tr', function (e) {
    if ($(e.target).hasClass('delete-customer-btn') || $(e.target).parents('.delete-customer-btn').length) {
        return;
    }

    selectedCustomerIndex = $(this).data('index');
    const customer = customer_db[selectedCustomerIndex];

    $('#customer_id').val(customer.id);
    $('#customerName').val(customer.name);
    $('#customerPhone').val(customer.phone);
    $('#customerEmail').val(customer.email || '');
    $('#customerAddress').val(customer.address || '');

    $('#addCustomerModal').modal('show');
});

// Search functionality
$('.input-group input').on('keyup', function () {
    const searchTerm = $(this).val().toLowerCase();

    $('#customer_tbody tr').each(function () {
        const rowText = $(this).text().toLowerCase();
        $(this).toggle(rowText.includes(searchTerm));
    });
});

// Sync with localStorage
function syncCustomers() {
    localStorage.setItem('customer_db', JSON.stringify(customer_db));
    generateNextCustomerId();
}

// Reset the form
function resetCustomerForm() {
    $('#customerForm')[0].reset();
    selectedCustomerIndex = -1;
    generateNextCustomerId();
}

// Close modal handler
$('#addCustomerModal').on('hidden.bs.modal', function () {
    resetCustomerForm();
});

////////////////////// Product Related jQueries /////////////////////////////
let product_db = JSON.parse(localStorage.getItem('product_db')) || [];
let selectedProductIndex = -1;

// Initialize the page
$(document).ready(function () {
    generateNextProductId();
    loadProductsOnTable();

    // Enable form when add button is clicked
    $('[data-bs-target="#addProductModal"]').click(function () {
        $('#addProductModal form')[0].reset();
        generateNextProductId();
    });
});

// Load products into the table
function loadProductsOnTable() {
    $('#store_tbody').empty();

    if (product_db.length === 0) {
        $('#store_tbody').append('<tr><td colspan="8" class="text-center">No products found</td></tr>');
        return;
    }

    product_db.forEach((product, index) => {
        let row = `<tr data-index="${index}">
                      <td>${product.id}</td>
                      <td>${product.name}</td>
                      <td>${product.category}</td>
                      <td>$${product.price.toFixed(2)}</td>
                      <td>${product.quantity}</td>
                      <td>${product.barcode || '-'}</td>
                      <td>${product.description || '-'}</td>
                      <td>
                          <button class="btn btn-sm btn-danger delete-product-btn" data-index="${index}">
                              <i class="bi bi-trash"></i>
                          </button>
                      </td>
                  </tr>`;
        $('#store_tbody').append(row);
    });

    // Add click event for delete buttons
    $('.delete-product-btn').on('click', function(e) {
        e.stopPropagation(); // Prevent row selection when clicking delete
        const index = $(this).data('index');
        deleteProduct(index);
    });
}

// Generate the next product ID
function generateNextProductId() {
    if (product_db.length === 0) {
        $('#id').val('P001');
        return;
    }

    // Get the highest ID and increment
    const maxId = Math.max(...product_db.map(p =>
        parseInt(p.id.substring(1))));
    const nextId = 'P' + String(maxId + 1).padStart(3, '0');
    $('#id').val(nextId);
}

// Delete product function
function deleteProduct(index) {
    if (index === -1 || index >= product_db.length) {
        Swal.fire({
            icon: "warning",
            title: "No Selection!",
            text: "Please select a valid product first"
        });
        return;
    }

    const product = product_db[index];

    Swal.fire({
        title: "Are you sure?",
        html: `You are about to delete <strong>${product.name}</strong> (${product.id})`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            product_db.splice(index, 1);
            syncProducts();
            loadProductsOnTable();
            resetProductForm();

            Swal.fire(
                "Deleted!",
                "Product has been deleted.",
                "success"
            );
        }
    });
}

// Save product to the database
$('#addProductModal .btn-primary').on('click', function () {
    let id = $('#id').val();
    let name = $('#productName').val().trim();
    let category = $('#productCategory').val();
    let price = parseFloat($('#productPrice').val());
    let quantity = parseInt($('#productQuantity').val());
    let barcode = $('#productBarcode').val().trim();
    let description = $('#productDescription').val().trim();

    // Validation
    if (!name || !category || isNaN(price) || isNaN(quantity)) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please fill all required fields with valid data!"
        });
        return;
    }

    if (price <= 0) {
        Swal.fire({
            icon: "error",
            title: "Invalid Price!",
            text: "Price must be greater than 0"
        });
        return;
    }

    if (quantity < 0) {
        Swal.fire({
            icon: "error",
            title: "Invalid Quantity!",
            text: "Quantity cannot be negative"
        });
        return;
    }

    let product_data = {
        id: id,
        name: name,
        category: category,
        price: price,
        quantity: quantity,
        barcode: barcode || null,
        description: description || null
    };

    // Check if we're updating an existing product
    if (selectedProductIndex !== -1) {
        product_db[selectedProductIndex] = product_data;
    } else {
        product_db.push(product_data);
    }

    syncProducts();
    loadProductsOnTable();

    Swal.fire({
        title: "Success!",
        text: `Product ${selectedProductIndex !== -1 ? 'updated' : 'added'} successfully`,
        icon: "success"
    }).then(() => {
        $('#addProductModal').modal('hide');
        resetProductForm();
    });
});

// Select a product from the table
$('#store_tbody').on('click', 'tr', function () {
    // Don't trigger if delete button was clicked
    if ($(event.target).hasClass('delete-product-btn') || $(event.target).parents('.delete-product-btn').length) {
        return;
    }

    selectedProductIndex = $(this).data('index');
    const product = product_db[selectedProductIndex];

    $('#id').val(product.id);
    $('#productName').val(product.name);
    $('#productCategory').val(product.category);
    $('#productPrice').val(product.price);
    $('#productQuantity').val(product.quantity);
    $('#productBarcode').val(product.barcode || '');
    $('#productDescription').val(product.description || '');

    $('#addProductModal').modal('show');
});

// Search functionality
$('.input-group input').on('keyup', function () {
    const searchTerm = $(this).val().toLowerCase();

    $('#store_tbody tr').each(function () {
        const rowText = $(this).text().toLowerCase();
        $(this).toggle(rowText.includes(searchTerm));
    });
});

// Sync with localStorage
function syncProducts() {
    localStorage.setItem('product_db', JSON.stringify(product_db));
    generateNextProductId();
}

// Reset the form
function resetProductForm() {
    $('#addProductModal form')[0].reset();
    selectedProductIndex = -1;
    generateNextProductId();
}

// Close modal handler
$('#addProductModal').on('hidden.bs.modal', function () {
    resetProductForm();
});

////////////////////// Order Management /////////////////////////////
let order_db = JSON.parse(localStorage.getItem('order_db')) || [];
let selectedOrderIndex = -1;
let currentOrderItems = [];

// Initialize the page
$(document).ready(function () {
    loadOrdersOnTable();
    populateCustomerDropdown();
    populateProductDropdown();

    // Set current date as default
    $('#orderDate').val(new Date().toISOString().split('T')[0]);

    // Add product to order
    $('#addProductBtn').on('click', function() {
        addProductToOrder();
    });

    // Place order button
    $('#order-place-btn').on('click', function() {
        placeOrder();
    });

    // New order button
    $('#new_order_btn').on('click', function() {
        generateNextOrderId();
        currentOrderItems = [];
        updateOrderItemsTable();
        $('#orderDate').val(new Date().toISOString().split('T')[0]);
        $('#orderNotes').val('');
    });

    // Search orders
    $('#search_order_btn').on('click', function() {
        filterOrders($('#search_orders').val());
    });

    $('#search_orders').on('keyup', function() {
        filterOrders($(this).val());
    });
});

// Generate next order ID
function generateNextOrderId() {
    if (order_db.length === 0) {
        $('#orderId').val('O001');
        return;
    }

    const maxId = Math.max(...order_db.map(o =>
        parseInt(o.id.substring(1))));
    const nextId = 'O' + String(maxId + 1).padStart(3, '0');
    $('#orderId').val(nextId);
}

// Populate customer dropdown
function populateCustomerDropdown() {
    const dropdown = $('#orderCustomer');
    dropdown.empty();
    dropdown.append('<option value="">Select Customer</option>');

    customer_db.forEach(customer => {
        dropdown.append(`<option value="${customer.id}">${customer.name}</option>`);
    });
}

// Populate product dropdown
function populateProductDropdown() {
    const dropdown = $('#orderProductSelect');
    dropdown.empty();
    dropdown.append('<option value="">Select Product</option>');

    product_db.forEach(product => {
        if (product.quantity > 0) {
            dropdown.append(`<option value="${product.id}" data-price="${product.price}">${product.name}</option>`);
        }
    });
}

// Add product to order items
function addProductToOrder() {
    const productId = $('#orderProductSelect').val();
    const quantity = parseInt($('#orderProductQty').val());

    if (!productId || isNaN(quantity) || quantity <= 0) {
        showAlert('Error!', 'Please select a product and enter a valid quantity!', 'error');
        return;
    }

    const product = product_db.find(p => p.id === productId);
    if (!product) {
        showAlert('Error!', 'Selected product not found!', 'error');
        return;
    }

    if (quantity > product.quantity) {
        showAlert('Insufficient Stock!', `Only ${product.quantity} items available in stock!`, 'error');
        return;
    }

    // Check if product already exists in order
    const existingItemIndex = currentOrderItems.findIndex(item => item.id === productId);
    if (existingItemIndex !== -1) {
        // Update quantity if already exists
        const newQty = currentOrderItems[existingItemIndex].quantity + quantity;
        if (newQty > product.quantity) {
            showAlert('Insufficient Stock!', `Cannot add more than available stock (${product.quantity})!`, 'error');
            return;
        }
        currentOrderItems[existingItemIndex].quantity = newQty;
    } else {
        // Add new item
        currentOrderItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    updateOrderItemsTable();
    $('#orderProductQty').val(1);
}

// Update the order items table
function updateOrderItemsTable() {
    const tableBody = $('#orderItemsTable');
    tableBody.empty();

    if (currentOrderItems.length === 0) {
        tableBody.append('<tr><td colspan="5" class="text-center">No items added</td></tr>');
        $('#orderTotalAmount').text('$0.00');
        return;
    }

    currentOrderItems.forEach((item, index) => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="btn btn-sm btn-danger remove-item-btn" data-index="${index}"><i class="bi bi-trash"></i></button></td>
        </tr>`;
        tableBody.append(row);
    });

    // Calculate and update total
    const total = currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    $('#orderTotalAmount').text(`$${total.toFixed(2)}`);

    // Add event listeners to remove buttons
    $('.remove-item-btn').on('click', function() {
        const index = $(this).data('index');
        currentOrderItems.splice(index, 1);
        updateOrderItemsTable();
    });
}

// Place the order
function placeOrder() {
    const customerId = $('#orderCustomer').val();
    const orderDate = $('#orderDate').val();
    const notes = $('#orderNotes').val();

    if (!customerId) {
        showAlert('Error!', 'Please select a customer!', 'error');
        return;
    }

    if (currentOrderItems.length === 0) {
        showAlert('Warning!', 'Please add at least one product to the order!', 'warning');
        return;
    }

    const customer = customer_db.find(c => c.id === customerId);
    if (!customer) {
        showAlert('Error!', 'Selected customer not found!', 'error');
        return;
    }

    // Create order object
    const order = {
        id: $('#orderId').val(),
        customerId: customerId,
        customerName: customer.name,
        date: orderDate,
        items: currentOrderItems,
        notes: notes || null,
        status: 'completed'
    };

    // Update product quantities in inventory
    currentOrderItems.forEach(orderItem => {
        const product = product_db.find(p => p.id === orderItem.id);
        if (product) {
            product.quantity -= orderItem.quantity;
            if (product.quantity < 0) product.quantity = 0;
        }
    });

    // Save changes
    order_db.push(order);
    localStorage.setItem('order_db', JSON.stringify(order_db));
    localStorage.setItem('product_db', JSON.stringify(product_db));

    showAlert('Success!', `Order #${order.id} placed successfully!`, 'success').then(() => {
        $('#createOrderModal').modal('hide');
        loadOrdersOnTable();
        populateProductDropdown(); // Refresh product dropdown with updated quantities
    });
}

// Load orders into the table
function loadOrdersOnTable() {
    $('#order_tbody').empty();

    if (order_db.length === 0) {
        $('#order_tbody').append('<tr><td colspan="6" class="text-center">No orders found</td></tr>');
        return;
    }

    order_db.forEach((order, index) => {
        const orderDate = order.date ?
            (order.date instanceof Date ?
                order.date.toLocaleDateString() :
                new Date(order.date).toLocaleDateString()) :
            '-';

        const totalItems = order.items ?
            order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) :
            0;

        const totalPrice = order.items ?
            order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) :
            0;

        let row = `<tr data-index="${index}">
            <td>${order.id || '-'}</td>
            <td>${order.customerName || order.customer || '-'}</td>
            <td>${orderDate}</td>
            <td>${totalItems}</td>
            <td>$${totalPrice.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-info view-order-btn" data-index="${index}">
                    <i class="bi bi-eye"></i> Invoice
                </button>
            </td>
        </tr>`;
        $('#order_tbody').append(row);
    });

    // Add event listeners to view buttons
    $('.view-order-btn').on('click', function() {
        const index = $(this).data('index');
        viewOrderDetails(index);
    });
}

// View order details
function viewOrderDetails(index) {
    const order = order_db[index];
    if (!order) return;

    const orderDate = order.date ?
        (order.date instanceof Date ?
            order.date.toLocaleDateString() :
            new Date(order.date).toLocaleDateString()) :
        '-';

    const customer = customer_db.find(c => c.id === order.customerId);
    const customerInfo = customer ?
        `${customer.name}<br>${customer.phone}<br>${customer.email || ''}` :
        'Customer not found';

    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `<tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`;
    });

    const totalPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    Swal.fire({
        title: `Order #${order.id}`,
        html: `
            <div class="text-start">
                <p><strong>Date:</strong> ${orderDate}</p>
                <p><strong>Customer:</strong><br>${customerInfo}</p>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="3">Total</th>
                                <th>$${totalPrice.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
            </div>
        `,
        width: '800px',
        confirmButtonText: 'Close'
    });
}

// Filter orders
function filterOrders(searchTerm) {
    const term = searchTerm.toLowerCase();
    $('#order_tbody tr').each(function() {
        const rowText = $(this).text().toLowerCase();
        $(this).toggle(rowText.includes(term));
    });
}

// Helper function to show alerts
function showAlert(title, text, icon) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'OK'
    });
}

//////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    $("#store_content").hide();
    $("#customer_content").hide();
    $("#order_content").hide();
    $("#invoice-content").hide();
});

$("#dash-btn").on("click", function () {
    $("#dashboard_content").css("display", "block");
    $("#store_content").css("display", "none");
    $("#customer_content").css("display", "none");
    $("#order_content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#store-btn").on("click", function () {
    $("#store_content").css("display", "block");
    $("#dashboard_content").css("display", "none");
    $("#customer_content").css("display", "none");
    $("#order_content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#customer-btn").on("click", function () {
    $("#customer_content").css("display", "block");
    $("#store_content").css("display", "none");
    $("#dashboard_content").css("display", "none");
    $("#order_content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#order-btn").on("click", function () {
    $("#order_content").css("display", "block");
    $("#store_content").css("display", "none");
    $("#customer_content").css("display", "none");
    $("#dashboard_content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

