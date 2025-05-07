//////////////////// Item Related jQueries /////////////////////////////

// To store item details on an array / db
let item_db = [];

generateNextItemId();

// to load stored item details on the table
function loadItemsOnTable() {

    $('#item_tbody').empty();

    item_db.map((item, index) => {
        let name = item.name;
        let price = item.price;
        let qoh = item.qoh;

        let data = `<tr>
                      <td>${'I' + String(index + 1).padStart(3, '0')}</td>
                      <td>${name}</td>
                      <td>${price}</td>
                      <td>${qoh}</td>
                  </tr>`

        $('#item_tbody').append(data);
    });
}

// to generate item ids automatically
function generateNextItemId() {
    const nextItemId = 'I' + String(item_db.length + 1).padStart(3, '0');
    $('#nextItemId').val(nextItemId);
}

// When Save a new item
$('#item_save').on('click', function () {
    let id = $('#nextItemId').val();
    let name = $('#newItemName').val();
    let price = $('#newItemPrice').val();
    let qoh = $('#newItemQoh').val();

    if (name === '' || price === '' || qoh === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else {
        let item_data = {
            id: id,
            name: name,
            price: price,
            qoh: qoh
        };

        item_db.push(item_data);
        console.log(item_db);
        syncAvailableItems();

        loadItemsOnTable();

        Swal.fire({
            title: "Item Added successfully..!",
            icon: "success",
            draggable: true
        });
    }

    $('#newItemName').val("");
    $('#newItemPrice').val("");
    $('#newItemQoh').val("");

    generateNextItemId();
});

// to update item details
$('#item_update').on('click', function () {
    let id = $('#id').val();
    let name = $('#item_name').val();
    let price = $('#price').val();
    let qoh = $('#qoh').val();


    if (name === '' || price === '' || qoh === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else if (selectedItemIndex !== -1) {

        item_db[selectedItemIndex] = {
            id: id,
            name: name,
            price: price,
            qoh: qoh
        };

        loadItemsOnTable();

        console.log(item_db);
        syncAvailableItems();

        Swal.fire({
            title: "Item updated successfully..!",
            icon: "success",
            draggable: true
        });

        $('#id').val("");
        $('#item_name').val("");
        $('#price').val("");
        $('#qoh').val("");

        // Reset form and index
        $('#item_form_fieldset').prop('disabled', true);
        $('#item_reset').click();
        selectedItemIndex = -1;

    } else {
        Swal.fire({
            icon: "warning",
            title: "No item selected!",
            text: "Please select an item to update."
        });
    }
});

// Reset the form
$('#item_reset').on('click', function () {
    $('#id').val("");
    $('#item_name').val("");
    $('#price').val("");
    $('#qoh').val("");
});

$('#item_delete').on('click', function () {
    if (selectedItemIndex !== -1) {
        // selected index and range (ensure only selected item deleting)
        item_db.splice(selectedItemIndex, 1);
        loadItemsOnTable();
        syncAvailableItems();

        Swal.fire({
            title: "Deleted!",
            text: "Item has been deleted successfully.",
            icon: "success"
        });

        // reset form
        $('#item_form_fieldset').prop('disabled', true);
        $('#item_reset').click();
        selectedItemIndex = -1;
    }
});


// select an item by click on a table row
$('#item_tbody').on('click', 'tr', function () {
    //const index = $(this).index();
    //const selectedItem = item_db[index];
    selectedItemIndex = $(this).index();
    const selectedItem = item_db[selectedItemIndex];

    // to fill the form with selected customer's data
    $('#id').val(selectedItem.id);
    $('#item_name').val(selectedItem.name);
    $('#price').val(selectedItem.price);
    $('#qoh').val(selectedItem.qoh);

    $('#item_form_fieldset').prop('disabled', false);
});

// to search items by a data
$(document).ready(function () {

    function filterItems() {
        var value = $(this).val().toLowerCase();
        $("#item_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }

    // to filter items at live (while typing)
    $("#search_item_input").on("keyup", filterItems);

    // to filter items after click search btn
    $('#search_item_btn').on('click', function (e) {
        e.preventDefault();
        filterItems();
    });
});


//////////////////// Customer Related jQueries /////////////////////////////

// To store customer details on an array / db
let customer_db = [];

generateNextCustomerId();

// to load stored customer details on the table
function loadCustomersOnTable() {

    $('#customer_tbody').empty();

    customer_db.map((item, index) => {
        let name = item.name;
        let phone = item.phone;
        let address = item.address;

        let data = `<tr>
                      <td>${'C' + String(index + 1).padStart(3, '0')}</td>
                      <td>${name}</td>
                      <td>${phone}</td>
                      <td>${address}</td>
                  </tr>`

        $('#customer_tbody').append(data);
    });
}

// to generate customer ids automatically
function generateNextCustomerId() {
    const nextId = 'C' + String(customer_db.length + 1).padStart(3, '0');
    $('#nextId').val(nextId);
}

// When Save a new Customer
$('#customer_save').on('click', function () {
    let id = $('#nextId').val();
    let name = $('#newName').val();
    let phone = $('#newPhone').val();
    let address = $('#newAddress').val();

    // console.log(`fname: ${fname}, lname: ${lname}, address: ${address}`);

    if (name === '' || phone === '' || address === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else {
        let customer_data = {
            id: id,
            name: name,
            phone: phone,
            address: address
        };

        customer_db.push(customer_data);
        console.log(customer_db);

        syncCustomers();
        loadCustomersOnTable();


        Swal.fire({
            title: "Customer Added successfully..!",
            icon: "success",
            draggable: true
        });
    }

    $('#newName').val("");
    $('#newAddress').val("");
    $('#newPhone').val("");

    generateNextCustomerId();
});

// to update customer details
$('#customer_update').on('click', function () {
    let id = $('#customer_id').val();
    let name = $('#name').val();
    let phone = $('#phone').val();
    let address = $('#address').val();


    if (name === '' || phone === '' || address === '') {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Please enter valid inputs..!"
        });
    } else if (selectedCustomerIndex !== -1) {

        customer_db[selectedCustomerIndex] = {
            id: id,
            name: name,
            phone: phone,
            address: address
        };

        loadCustomersOnTable();
        syncCustomers();

        console.log(customer_db);

        Swal.fire({
            title: "Customer updated successfully..!",
            icon: "success",
            draggable: true
        });

        $('#customer_id').val("");
        $('#name').val("");
        $('#address').val("");
        $('#phone').val("");

        // Reset form and index
        $('#customer_form_fieldset').prop('disabled', true);
        $('#customer_reset').click();
        selectedCustomerIndex = -1;

    } else {
        Swal.fire({
            icon: "warning",
            title: "No customer selected!",
            text: "Please select a customer to update."
        });
    }
});

// Reset the form
$('#customer_reset').on('click', function () {
    $('#customer_id').val("");
    $('#name').val("");
    $('#address').val("");
    $('#phone').val("");
});

$('#customer_delete').on('click', function () {
    if (selectedCustomerIndex !== -1) {
        // selected index and range (ensure only that customer deleting)
        customer_db.splice(selectedCustomerIndex, 1);
        loadCustomersOnTable();
        syncCustomers();

        Swal.fire({
            title: "Deleted!",
            text: "Customer has been deleted successfully.",
            icon: "success"
        });

        // reset form
        $('#customer_form_fieldset').prop('disabled', true);
        $('#customer_reset').click();
        selectedCustomerIndex = -1;
    }
});

// select a customer by click on a table row
$('#customer_tbody').on('click', 'tr', function () {
    //const index = $(this).index();
    //const selectedCustomer = customer_db[index];
    selectedCustomerIndex = $(this).index();
    const selectedCustomer = customer_db[selectedCustomerIndex];

    // to fill the form with selected customer's data
    $('#customer_id').val(selectedCustomer.id);
    $('#name').val(selectedCustomer.name);
    $('#phone').val(selectedCustomer.phone);
    $('#address').val(selectedCustomer.address);

    $('#customer_form_fieldset').prop('disabled', false);
});

// to search customer by a data
$(document).ready(function () {
    function filterCustomers() {
        var value = $(this).val().toLowerCase();
        $("#customer_tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    }

    // to filter customer at live (while typing)
    $("#search_input").on("keyup", filterCustomers);

    // to filter customer after click search btn
    $('#search_btn').on('click', function (e) {
        e.preventDefault();
        filterCustomers();
    });
});


//////////////////// Order Related jQueries /////////////////////////////

// Sample items array (can be fetched from backend too)
let available_items = [];
let orders_db = [];

$(document).ready(function () {
    $("#search_order_item_input").prop("disabled", true);
    $("#search_order_item_btn").prop("disabled", true);
    $("#search_customer_input").prop("disabled", true);
    $("#search_customer_btn").prop("disabled", true);
    $("#finalize-order-place-btn").prop("disabled", true);
    $("#order-available-item-card").css("pointer-events", "none").css("opacity", "0.6");
    $("#order-items-card").css("pointer-events", "none").css("opacity", "0.6");

    /*available_items = [
        {name: "Toffee", price: 15.00, qoh: 20},
        {name: "Cake", price: 1200.00, qoh: 5},
        {name: "Chocolate", price: 160.00, qoh: 50},
        {name: "Lollipop", price: 10.00, qoh: 100},
        {name: "Biscuit", price: 100.00, qoh: 40},
        {name: "Marshmallows", price: 150.00, qoh: 80}
    ];*/
    //renderItems();
});

function syncAvailableItems() {
    available_items = item_db
        .filter(item => item.qoh > 0) // 🔄 Exclude items with QoH <= 0
        .map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            qoh: parseInt(item.qoh)
        }));
    renderItems();
}

function renderItems(filter = "") {
    const container = $("#order_item_tbody");
    container.empty();

    $.each(available_items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())), function (index, item) {
        const card = `
                    <div class="col-6 col-md-6 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name}</h6>
                                    <p class="card-text mb-2">Rs. ${item.price.toFixed(2)}</p>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-dark btn-sm add_to_cart_btn" data-index="${index}">
                                        <i class="ti ti-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        container.append(card);
    });
}

//renderItems();

// Search filter (live typing)
$("#search_order_item_input").on("keyup", function () {
    renderItems($(this).val());
});

// Search button
$("#search_order_item_btn").on("click", function (e) {
    e.preventDefault();
    renderItems($("#search_order_item_input").val());
});


// get Customer list
/*const customerList = [
    {id: "C001", name: "John"},
    {id: "C002", name: "Mary"},
    {id: "C003", name: "Nimal"},
    {id: "C004", name: "Jeeva"},
    {id: "C005", name: "Priya"},
    {id: "C006", name: "Akshay"}
];*/
let customerList = [];
const datalist_customers = $("#customerDatalistOptions");

function syncCustomers() {
    customerList = customer_db;
    $.each(customerList, function (index, customer) {
        let customerOption = `<option value="${customer.name}">`;
        datalist_customers.append(customerOption);
    });
}

$(document).ready(function () {
    syncCustomers();
});

// add items to cart
$(document).on("click", ".add_to_cart_btn", function () {
    const index = $(this).data("index");
    const item = available_items[index];
    let count = 1;
    let itemTotalAmount = item.price * count;
    const cartCard = `
                    <div class="col-12 col-md-12 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name} x <span class="item-cart-count-display">${count}</span></h6>
                                    <p class="card-text mb-2 item-total">Rs. ${item.price.toFixed(2)} x <span class="item-cart-count-display">${count}</span> = <span class="item-total-amount">${itemTotalAmount.toFixed(2)}</span></p>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 increaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-plus"></i></button><span class="item-cart-count">${count}</span>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 decreaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-minus"></i></button>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-dark btn-sm remove_from_cart_btn"><i class="ti ti-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    $("#item_cart").append(cartCard);
});

$(document).on('click', ".increaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countDisplay = cardBody.find(".item-cart-count-display");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = available_items.find(i => i.name === item).price;
    const itemData = available_items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count++;

    // Check quantity limit
    if (count > itemData.qoh) {
        alert(`Only ${itemData.qoh} ${item}(s) available.`);
        return;
    }

    countSpans.text(count);
    countDisplay.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
});

$(document).on('click', ".decreaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countDisplay = cardBody.find(".item-cart-count-display");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = available_items.find(i => i.name === item).price;
    //const itemData = items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count--;

    // Check quantity limit
    if (count < 1) {
        return;
    }

    countSpans.text(count);
    countDisplay.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
    syncAvailableItems();
});

$(document).on("click", ".remove_from_cart_btn", function () {
    $(this).closest(".col-12").remove();
});

$(document).on("click", "#finalize-order-place-btn", function (e) {
    e.preventDefault();

    const customerName = $("#search_customer_input").val().trim();
    const customer = customerList.find(c => c.name === customerName);

    //if (!customerName || !customerList.includes(customerName)) {
    if (!customer) {
        Swal.fire({
            icon: 'error',
            title: 'Customer not selected!',
            text: 'Please select a valid customer before placing the order.',
        });
        return;
    }

    const cartItems = $("#item_cart").children(".col-12, .col-md-12");

    if (cartItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cart is empty!',
            text: 'Please add items before placing the order.',
        });
        return;
    }

    // to get order details
    const orderId = $("#next_order_id").val();
    const orderedItems = [];

    cartItems.each(function () {
        const itemName = $(this).find(".card-title").text().split(" x ")[0].trim();
        const itemQuantity = parseInt($(this).find(".item-cart-count").text().trim());
        const itemPrice = Number(available_items.find(i => i.name === itemName).price);

        const item = {name: itemName, quantity: itemQuantity, price: itemPrice};
        orderedItems.push(item);
        console.log("Item:", item.name, "Price:", item.price, "Quantity:", item.quantity);
        console.log("Raw quantity text:", $(this).find(".item-cart-count").text());

    });

    const order = {
        orderId: orderId,
        customer: customerName,
        available_items: orderedItems
    };

    orders_db.push(order);

    const totalAmount = orderedItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
    console.log("Item Prices:", orderedItems.map(item => item.price));
    console.log("Calculated Total:", totalAmount);

    const invoice = {
        invoiceId: invoices.length + 1 ,
        orderId: orderId,
        customerName: customerName,
        items: orderedItems,
        totalAmount: Number(totalAmount.toFixed(2))
    }

    invoices.push(invoice);
    console.log("Invoices Data:", invoices);
    updateInvoiceTable();

    // If cart is not empty
    Swal.fire({
        icon: 'success',
        title: 'Order placed!',
        text: 'Your order has been successfully submitted.',
        confirmButtonText: 'OK'
    }).then(() => {
        const order = {
            orderId: $('#next_order_id').val(),
            customer: customer.id,
            available_items: []
        };

        orderedItems.forEach(item => {
            const inventoryItem = item_db.find(i => i.name === item.name);
            if (inventoryItem) {
                if (inventoryItem.qoh - item.quantity < 0) {
                    console.error(`Insufficient stock for ${item.name}.`);
                    return; // Prevent QoH from going negative
                }

                inventoryItem.qoh -= item.quantity; // Reduce stock
                console.log(`Updated QoH for ${item.name}:`, inventoryItem.qoh);

                // Ensure item_db updates correctly
                const itemIndex = item_db.findIndex(i => i.name === item.name);
                if (itemIndex !== -1) {
                    item_db[itemIndex].qoh = inventoryItem.qoh;
                }
            }
        });
        console.log(item_db);
        console.log(available_items);
        syncAvailableItems();
        loadItemsOnTable();

        console.log("updated item db: "+item_db);
        console.log("updated available items: "+available_items);

        $("#item_cart").empty();

        generateNextOrderId();
        $("#search_customer_input").val("");
        /*$("#search_item_input").prop("disabled", true);
        $("#search_item_btn").prop("disabled", true);
        $("#search_customer_input").prop("disabled", true);
        $("#search_customer_btn").prop("disabled", true);
        $("#finalize-order-place-btn").prop("disabled", true);
        $(".card-body").css("pointer-events", "none").css("opacity", "0.6");*/

    });
});

$(document).on("click", "#new_order_btn", function () {
    $("#search_order_item_input").prop("disabled", false);
    $("#search_order_item_btn").prop("disabled", false);
    $("#search_customer_input").prop("disabled", false);
    $("#search_customer_btn").prop("disabled", false);
    $("#finalize-order-place-btn").prop("disabled", false);
    $("#order-available-item-card").css("pointer-events", "auto").css("opacity", "1");
    $("#order-items-card").css("pointer-events", "auto").css("opacity", "1");

    generateNextOrderId();
});

function generateNextOrderId() {
    const nextOrderId = 'OR' + String(orders_db.length + 1).padStart(3, '0');
    $('#next_order_id').val(nextOrderId);
}

//////////////////// Invoice / Order history Related jQueries /////////////////////////////

    let invoices = [];

    function updateInvoiceTable() {
        $("#invoice_tbody").empty(); // Clear previous data

        if (invoices.length === 0) {
            alert("No Invoices Available..!");
            return;
        }

        let orderDate = new Date().toLocaleDateString('en-LK');


        invoices.forEach(invoice => {
            const row = `
                    <tr>
                        <th scope="row">${invoice.invoiceId}</th>
                        <td>${invoice.orderId}</td>
                        <td>${invoice.customerName}</td>
                        <td>${orderDate}</td>
                        <td>${invoice.totalAmount.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-light text-dark btn-sm print_invoice_btn" data-id="${invoice.orderId}" style="width: 30px; height: 30px; padding: 0; font-size: 20px">
                                <i class="ti ti-printer"></i>
                            </button>
                        </td>
                    </tr>
                 `;
            $("#invoice_tbody").append(row);
        });
    }

    $(document).on("click", ".print_invoice_btn", function () {
    const receiptId = $(this).data("id");

        // Find the invoice details
        const invoice = invoices.find(inv => inv.orderId === receiptId);
        if (!invoice) {
            Swal.fire({
                icon: 'error',
                title: 'Invoice not found!',
                text: 'Something went wrong, please try again.',
            });
            return;
        }

        const items = invoice.items;
        const date = invoice.date || new Date().toLocaleDateString('en-LK');
        const time = new Date().toLocaleTimeString('en-LK', {hour: '2-digit', minute: '2-digit'});
        const subTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
        const tax = 0;
        const total = subTotal + tax;

        populateInvoice(items, receiptId, date, time, subTotal, tax, total);
    });

    function populateInvoice(items, receiptId, date, time, subTotal, tax, total) {
        const modalHtml = `
                    <div class="modal fade" id="invoiceModal" tabindex="-1" aria-labelledby="invoiceModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
                            <div class="modal-content">
                                <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title" id="invoiceModalLabel"><i class="ti ti-receipt"></i> RECEIPT</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container-fluid">
                                    <div class="text-center mb-3">
                                        <h6 class="mb-0">Bite Of Bliss</h6>
                                        <p class="mb-0 small">31/5z, Main Street, Kalutara South</p>
                                        <p class="mb-0 small">Email: bob@gmail.com</p>
                                        <p class="small">Phone: +94712345678</p>
                                    </div>
                                    <hr class="my-2">
                                    <div class="row mb-2">
                                        <div class="col-8">Reciept Id: ${receiptId}</div>
                                        <div class="col-4 text-end">Invoice No: ${invoices.length}</div>
                                        <div class="col-8">Date: ${date}</div>
                                        <div class="col-4 text-end">Time: ${time}</div>
                                    </div>
                                    <hr class="my-2">
                                    <div id="invoice-items">
                                        ${items.map(item => `
                                            <div class="row">
                                                <div class="col-7">${item.name}${item.quantity ? ' x ' + item.quantity : ''}</div>
                                                <div class="col-5 text-end">Rs. ${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <hr class="my-2">
                                    <div class="row">
                                        <div class="col-7">Sub Total</div>
                                        <div class="col-5 text-end">Rs. ${subTotal.toFixed(2)}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-7">+ Tax</div>
                                        <div class="col-5 text-end">Rs. ${tax.toFixed(2)}</div>
                                    </div>
                                    <hr class="my-2">
                                    <div class="row">
                                        <div class="col-7"><strong>Total</strong></div>
                                        <div class="col-5 text-end"><strong>Rs. ${total.toFixed(2)}</strong></div>
                                    </div>
                                    <hr class="my-3">
                                    <div class="text-center">
                                        <p class="small">Thank You For Visiting!</p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-dark">Print</button>
                            </div>
                        </div>
                    </div>
                </div>`;

    $("#invoiceModal").remove();

    $("body").append(modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("invoiceModal"));
    modal.show();
};

$(document).ready(function() {
    $("#item-content").hide();
    $("#customer-content").hide();
    $("#orders-content").hide();
    $("#invoice-content").hide();
});

$("#home-manage-btn").on("click", function () {
    $("#dashboard-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#item-manage-btn").on("click", function () {
    $("#item-content").css("display", "block");
    $("#dashboard-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#customer-manage-btn").on("click", function () {
    $("#customer-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#order-manage-btn").on("click", function () {
    $("#orders-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
    $("#invoice-content").css("display", "none");
});

$("#invoice-manage-btn").on("click", function () {
    $("#invoice-content").css("display", "block");
    $("#item-content").css("display", "none");
    $("#customer-content").css("display", "none");
    $("#orders-content").css("display", "none");
    $("#dashboard-content").css("display", "none");
});
