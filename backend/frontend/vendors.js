// -------------------------
// Vendors Module UI Injection
// -------------------------

// 1. Inject the Sidebar Menu Item
const navMenu = document.querySelector('.nav-menu');
const vendorsMenuItem = document.createElement('a');
vendorsMenuItem.href = "#";
vendorsMenuItem.className = "nav-item";
vendorsMenuItem.dataset.view = "vendors";
vendorsMenuItem.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
    Vendors
`;
// Insert before Holidays or just at the end
navMenu.appendChild(vendorsMenuItem);

// 2. Inject the Vendors View Container
const mainContent = document.querySelector('.main-content');
const vendorsViewHTML = `
<div class="view-container hidden" id="vendors-view">
    <div class="action-bar">
        <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="vendor-search" placeholder="Search vendors...">
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary" onclick="window.app.exportVendorsExcel()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export to Excel
            </button>
            <button class="btn btn-primary" onclick="window.app.openVendorModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Vendor
            </button>
        </div>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Vendor Name</th>
                    <th>Category</th>
                    <th>Loan EMI</th>
                    <th>Order Date</th>
                    <th>Receive Date</th>
                    <th>Payment Date</th>
                    <th>Payment Given</th>
                    <th>Payment Due</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="vendor-table-body">
                <!-- Data populated by JS -->
            </tbody>
        </table>
    </div>
</div>
`;
mainContent.insertAdjacentHTML('beforeend', vendorsViewHTML);

// 3. Inject the Vendor Modal
const body = document.querySelector('body');
const vendorModalHTML = `
<div class="modal-overlay" id="vendor-modal">
    <div class="modal-content">
        <h2 class="modal-title" id="vendor-modal-title">Add New Vendor</h2>
        <form id="vendor-form" onsubmit="event.preventDefault(); window.app.saveVendor();">
            <div class="modal-scroll-area">
                <input type="hidden" id="vendor-id">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="vendor-name">Vendor Name</label>
                        <input type="text" id="vendor-name">
                    </div>
                    <div class="form-group">
                        <label for="vendor-category">Category</label>
                        <select id="vendor-category">
                            <option value="">Select Category</option>
                            <option value="Uniform">Uniform</option>
                            <option value="Stationary">Stationary</option>
                            <option value="Builders">Builders</option>
                            <option value="Id card">Id card</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vendor-loan-emi">Loan EMI (₹)</label>
                        <input type="number" step="0.01" id="vendor-loan-emi" value="0.00">
                    </div>
                    <div class="form-group">
                        <label for="vendor-status">Payment Status</label>
                        <select id="vendor-status">
                            <option value="Advance">Advance</option>
                            <option value="Due">Due</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vendor-order-date">Order Date</label>
                        <input type="date" id="vendor-order-date">
                    </div>
                    <div class="form-group">
                        <label for="vendor-receive-date">Order Receive Date</label>
                        <input type="date" id="vendor-receive-date">
                    </div>
                    <div class="form-group">
                        <label for="vendor-payment-date">Payment Date</label>
                        <input type="date" id="vendor-payment-date">
                    </div>
                    <div class="form-group">
                        <label for="vendor-payment-given">Payment Given (₹)</label>
                        <input type="number" step="0.01" id="vendor-payment-given" value="0.00">
                    </div>
                    <div class="form-group">
                        <label for="vendor-payment-due">Payment Due (₹)</label>
                        <input type="number" step="0.01" id="vendor-payment-due" value="0.00">
                    </div>
                </div>

                <div class="form-group" style="margin-top: 1rem;">
                    <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--text-main);">Monthly Payment Details (₹)</h3>
                    <div class="fee-month-grid">
                        <div class="fee-month-item"><label for="vendor-payment-jan">January</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-jan" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-feb">February</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-feb" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-mar">March</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-mar" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-apr">April</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-apr" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-may">May</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-may" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-jun">June</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-jun" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-jul">July</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-jul" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-aug">August</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-aug" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-sep">September</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-sep" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-oct">October</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-oct" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-nov">November</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-nov" value="0.00"></div></div>
                        <div class="fee-month-item"><label for="vendor-payment-dec">December</label><div class="fee-input-with-icon"><span>₹</span><input type="number" step="0.01" id="vendor-payment-dec" value="0.00"></div></div>
                    </div>
                    <div class="form-group" style="margin-top: 1rem; max-width: 250px;">
                        <label for="total-vendor-payment-paid">Total Payments Given (₹) - Auto</label>
                        <input type="number" step="0.01" id="total-vendor-payment-paid" value="0.00" readonly style="background-color: #f1f5f9; cursor: not-allowed; font-weight: bold; color: var(--primary);">
                    </div>
                </div>

            </div>
            <div class="modal-actions" style="margin-top: 1rem;">
                <button type="button" class="btn btn-secondary" onclick="window.app.closeModals()">Cancel</button>
                <button type="submit" class="btn btn-primary" id="save-vendor-btn">Save Vendor</button>
            </div>
        </form>
    </div>
</div>
`;
body.insertAdjacentHTML('beforeend', vendorModalHTML);

const vendorDetailsModalHTML = `
<div class="modal-overlay" id="vendor-details-modal">
    <div class="modal-content">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div>
                <h2 class="modal-title" id="vendor-details-name" style="margin: 0;">Vendor Details</h2>
                <span id="vendor-details-category-badge" style="background:var(--bg-main);padding:0.25rem 0.75rem;border-radius:var(--radius-md);font-size:0.9rem;color:var(--primary);font-weight:600;display:inline-block;margin-top:0.5rem;"></span>
            </div>
            <button class="btn btn-secondary" onclick="window.app.closeModals()">Close</button>
        </div>
        
        <div class="details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-lg);">
            <div><span style="color:var(--text-muted);font-size:0.85rem;">Loan EMI</span><p id="vendor-details-emi" style="font-weight:600; margin:0.25rem 0 0 0;"></p></div>
            <div><span style="color:var(--text-muted);font-size:0.85rem;">Order Date</span><p id="vendor-details-order-date" style="font-weight:600; margin:0.25rem 0 0 0;"></p></div>
            <div><span style="color:var(--text-muted);font-size:0.85rem;">Receive Date</span><p id="vendor-details-receive-date" style="font-weight:600; margin:0.25rem 0 0 0;"></p></div>
            <div><span style="color:var(--text-muted);font-size:0.85rem;">Payment Date</span><p id="vendor-details-payment-date" style="font-weight:600; margin:0.25rem 0 0 0;"></p></div>
            <div><span style="color:var(--text-muted);font-size:0.85rem;">Status</span><p id="vendor-details-status" style="font-weight:600; margin:0.25rem 0 0 0;"></p></div>
        </div>

        <div>
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; color: var(--text-main); margin-bottom: 1rem;">Monthly Payments</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
                <!-- 12 months -->
                <div><span style="color:var(--text-muted);font-size:0.85rem;">January</span><p id="vendor-details-jan" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">February</span><p id="vendor-details-feb" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">March</span><p id="vendor-details-mar" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">April</span><p id="vendor-details-apr" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">May</span><p id="vendor-details-may" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">June</span><p id="vendor-details-jun" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">July</span><p id="vendor-details-jul" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">August</span><p id="vendor-details-aug" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">September</span><p id="vendor-details-sep" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">October</span><p id="vendor-details-oct" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">November</span><p id="vendor-details-nov" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">December</span><p id="vendor-details-dec" style="font-weight:600; margin:0.25rem 0 0 0;">₹0</p></div>
            </div>
            
            <div style="margin-top: 1.5rem; display: flex; gap: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <div><span style="color:var(--text-muted);font-size:0.85rem;">Payment Given</span><p id="vendor-details-given" style="font-weight:bold; color:var(--primary); font-size: 1.25rem; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">Payment Due</span><p id="vendor-details-total-due" style="font-weight:bold; color:#ef4444; font-size: 1.25rem; margin:0.25rem 0 0 0;">₹0</p></div>
                <div><span style="color:var(--text-muted);font-size:0.85rem;">Total Monthly Payments</span><p id="vendor-details-total-paid" style="font-weight:bold; color:#16a34a; font-size: 1.25rem; margin:0.25rem 0 0 0;">₹0</p></div>
            </div>
        </div>
    </div>
</div>
`;
body.insertAdjacentHTML('beforeend', vendorDetailsModalHTML);

// -------------------------
// Logic Integration overrides
// -------------------------

// Wait for app to initialize
setTimeout(() => {
    if (!window.app) return;

    window.app.vendors = [];

    // Ensure fetchVendors is called when global data is loaded
    const originalLoadData = window.app.loadData.bind(window.app);
    window.app.loadData = async function() {
        await originalLoadData();
        await window.app.fetchVendors();
    };
    // Patch _performSwitchView to update title and visibility for vendors
    const originalPerformSwitchView = window.app._performSwitchView.bind(window.app);
    window.app._performSwitchView = function(viewName) {
        originalPerformSwitchView(viewName);
        
        if (viewName === 'vendors') {
            document.getElementById('page-title').textContent = 'Vendors Management';
            
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.dataset.view === viewName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            document.querySelectorAll('.view-container').forEach(container => {
                container.classList.add('hidden');
            });
            document.getElementById('vendors-view').classList.remove('hidden');
        }
    };

    window.app.exportVendorsExcel = function() {
        window.location.href = `${API_URL}/vendors/export`;
    };

    // Add Vendor logic
    window.app.fetchVendors = async function() {
        try {
            // API_URL is global in app.js
            const response = await fetch(`${API_URL}/vendors/`);
            if (!response.ok) throw new Error('Network response was not ok');
            this.vendors = await response.json();
            this.renderVendors(this.vendors);
        } catch (error) {
            console.error('Error fetching vendors', error);
        }
    };

    window.app.renderVendors = function(data) {
        const tbody = document.getElementById('vendor-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:2rem;">No vendors added yet.</td></tr>`;
            return;
        }

        data.forEach(vendor => {
            const tr = document.createElement('tr');
            
            const badgeColors = {
                'Advance': 'background:#e0f2fe;color:#0284c7;',
                'Due': 'background:#fee2e2;color:#ef4444;',
                'Paid': 'background:#dcfce7;color:#16a34a;'
            };
            const statusStyle = badgeColors[vendor.status] || 'background:var(--bg-main);color:var(--text-main);';

            tr.innerHTML = `
                <td><strong>${vendor.vendor_name}</strong></td>
                <td>${vendor.vendor_category}</td>
                <td>₹${vendor.loan_emi.toLocaleString('en-IN')}</td>
                <td>${vendor.order_date ? new Date(vendor.order_date).toLocaleDateString() : '-'}</td>
                <td>${vendor.order_receive_date ? new Date(vendor.order_receive_date).toLocaleDateString() : '-'}</td>
                <td>${vendor.payment_date ? new Date(vendor.payment_date).toLocaleDateString() : '-'}</td>
                <td>₹${vendor.payment_given.toLocaleString('en-IN')}</td>
                <td><strong style="color:var(--primary)">₹${vendor.payment_due.toLocaleString('en-IN')}</strong></td>
                <td><span style="${statusStyle}padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;font-weight:600;">${vendor.status}</span></td>
                <td class="actions-cell">
                    <button class="btn btn-sm btn-primary" onclick="window.app.viewVendorDetails(${vendor.id})">Details</button>
                    <button class="btn btn-sm btn-edit" onclick="window.app.editVendor(${vendor.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteVendor(${vendor.id})">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    window.app.filterVendors = function(query) {
        query = query.toLowerCase();
        const filtered = this.vendors.filter(v => 
            v.vendor_name.toLowerCase().includes(query) || 
            v.vendor_category.toLowerCase().includes(query)
        );
        this.renderVendors(filtered);
    };

    window.app.openVendorModal = function() {
        document.getElementById('vendor-id').value = '';
        document.getElementById('vendor-form').reset();
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const el = document.getElementById(`vendor-payment-${m}`);
            if(el) el.value = "0.00";
        });
        const totalEl = document.getElementById('total-vendor-payment-paid');
        if(totalEl) totalEl.value = "0.00";
        document.getElementById('vendor-modal-title').textContent = 'Add New Vendor';
        document.getElementById('vendor-modal').classList.add('active');
    };

    window.app.viewVendorDetails = function(id) {
        const vendor = this.vendors.find(v => v.id === id);
        if (!vendor) return;

        document.getElementById('vendor-details-name').textContent = vendor.vendor_name || 'N/A';
        document.getElementById('vendor-details-category-badge').textContent = vendor.vendor_category || 'N/A';
        document.getElementById('vendor-details-emi').textContent = `₹${parseFloat(vendor.loan_emi || 0).toLocaleString('en-IN')}`;
        document.getElementById('vendor-details-order-date').textContent = vendor.order_date ? new Date(vendor.order_date).toLocaleDateString() : '-';
        document.getElementById('vendor-details-receive-date').textContent = vendor.order_receive_date ? new Date(vendor.order_receive_date).toLocaleDateString() : '-';
        document.getElementById('vendor-details-payment-date').textContent = vendor.payment_date ? new Date(vendor.payment_date).toLocaleDateString() : '-';
        document.getElementById('vendor-details-status').textContent = vendor.status || '-';
        document.getElementById('vendor-details-given').textContent = `₹${parseFloat(vendor.payment_given || 0).toLocaleString('en-IN')}`;
        document.getElementById('vendor-details-total-due').textContent = `₹${parseFloat(vendor.payment_due || 0).toLocaleString('en-IN')}`;

        let total = 0;
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const val = vendor[`payment_${m}`];
            document.getElementById(`vendor-details-${m}`).textContent = val !== undefined && val > 0 ? `₹${parseFloat(val).toLocaleString('en-IN')}` : '₹0';
            if (val) total += parseFloat(val);
        });
        
        document.getElementById('vendor-details-total-paid').textContent = `₹${total.toLocaleString('en-IN')}`;

        document.getElementById('vendor-details-modal').classList.add('active');
    };

    window.app.editVendor = function(id) {
        const vendor = this.vendors.find(v => v.id === id);
        if (!vendor) return;

        document.getElementById('vendor-id').value = vendor.id;
        document.getElementById('vendor-name').value = vendor.vendor_name;
        document.getElementById('vendor-category').value = vendor.vendor_category;
        document.getElementById('vendor-loan-emi').value = vendor.loan_emi;
        document.getElementById('vendor-order-date').value = vendor.order_date || '';
        document.getElementById('vendor-receive-date').value = vendor.order_receive_date || '';
        document.getElementById('vendor-payment-date').value = vendor.payment_date || '';
        document.getElementById('vendor-payment-given').value = vendor.payment_given;
        document.getElementById('vendor-payment-due').value = vendor.payment_due;
        document.getElementById('vendor-status').value = vendor.status;

        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const el = document.getElementById(`vendor-payment-${m}`);
            if (el) el.value = vendor[`payment_${m}`] !== undefined ? vendor[`payment_${m}`] : 0;
        });
        
        // Trigger auto calculatation
        if(typeof calculateTotalVendorPayment === 'function') {
            calculateTotalVendorPayment();
        }

        document.getElementById('vendor-modal-title').textContent = 'Edit Vendor';
        document.getElementById('vendor-modal').classList.add('active');
    };

    window.app.saveVendor = async function() {
        const id = document.getElementById('vendor-id').value;
        const data = {
            vendor_name: document.getElementById('vendor-name').value,
            vendor_category: document.getElementById('vendor-category').value,
            loan_emi: parseFloat(document.getElementById('vendor-loan-emi').value) || 0,
            order_date: document.getElementById('vendor-order-date').value || null,
            order_receive_date: document.getElementById('vendor-receive-date').value || null,
            payment_date: document.getElementById('vendor-payment-date').value || null,
            payment_given: parseFloat(document.getElementById('vendor-payment-given').value) || 0,
            payment_due: parseFloat(document.getElementById('vendor-payment-due').value) || 0,
            status: document.getElementById('vendor-status').value,
            payment_jan: parseFloat(document.getElementById('vendor-payment-jan').value) || 0,
            payment_feb: parseFloat(document.getElementById('vendor-payment-feb').value) || 0,
            payment_mar: parseFloat(document.getElementById('vendor-payment-mar').value) || 0,
            payment_apr: parseFloat(document.getElementById('vendor-payment-apr').value) || 0,
            payment_may: parseFloat(document.getElementById('vendor-payment-may').value) || 0,
            payment_jun: parseFloat(document.getElementById('vendor-payment-jun').value) || 0,
            payment_jul: parseFloat(document.getElementById('vendor-payment-jul').value) || 0,
            payment_aug: parseFloat(document.getElementById('vendor-payment-aug').value) || 0,
            payment_sep: parseFloat(document.getElementById('vendor-payment-sep').value) || 0,
            payment_oct: parseFloat(document.getElementById('vendor-payment-oct').value) || 0,
            payment_nov: parseFloat(document.getElementById('vendor-payment-nov').value) || 0,
            payment_dec: parseFloat(document.getElementById('vendor-payment-dec').value) || 0
        };

        try {
            const url = id ? `${API_URL}/vendors/${id}` : `${API_URL}/vendors/`;
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Save failed');
            
            window.app.showToast(id ? 'Vendor updated successfully' : 'Vendor added successfully');
            window.app.closeModals();
            await window.app.fetchVendors();
        } catch (error) {
            window.app.showToast('Error saving vendor', 'error');
        }
    };

    window.app.deleteVendor = async function(id) {
        if (!confirm('Are you sure you want to delete this vendor?')) return;
        
        try {
            const response = await fetch(`${API_URL}/vendors/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            
            window.app.showToast('Vendor deleted');
            await window.app.fetchVendors();
        } catch (error) {
            window.app.showToast('Error deleting vendor', 'error');
        }
    };

    // Bind event listeners for vendors
    const vendorSearchMenu = document.getElementById('vendor-search');
    if (vendorSearchMenu) {
        vendorSearchMenu.addEventListener('input', (e) => window.app.filterVendors(e.target.value));
    }
    
    // Auto-calculate logic
    const vendorMonthInputs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => document.getElementById(`vendor-payment-${m}`));
    const totalVendorPaymentInput = document.getElementById('total-vendor-payment-paid');

    window.calculateTotalVendorPayment = () => {
        let total = 0;
        vendorMonthInputs.forEach(input => {
            if (input) total += parseFloat(input.value) || 0;
        });
        if (totalVendorPaymentInput) totalVendorPaymentInput.value = total.toFixed(2);
    };

    vendorMonthInputs.forEach(input => {
        if (input) input.addEventListener('input', window.calculateTotalVendorPayment);
    });

    // Bind click to the nav item we generated
    vendorsMenuItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.app.switchView('vendors');
    });

    // Make sure close modal applies to vendor modal too
    document.getElementById('vendor-modal').addEventListener('click', (e) => {
        if (e.target.id === 'vendor-modal') window.app.closeModals();
    });

    document.getElementById('vendor-details-modal').addEventListener('click', (e) => {
        if (e.target.id === 'vendor-details-modal') window.app.closeModals();
    });

    // Fetch initial vendors data if already authenticated (so we don't miss the initial loadData call)
    if (sessionStorage.getItem('site_authenticated') === 'true') {
        window.app.fetchVendors();
    }

}, 1000); // Give app.js a bit of time to initialize
