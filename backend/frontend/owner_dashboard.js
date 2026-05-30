// -------------------------
// Owner Dashboard UI Injection
// -------------------------

(function() {
    // 1. Inject the Sidebar Menu Item
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const navItem = document.createElement('a');
    navItem.href = "#";
    navItem.className = "nav-item";
    navItem.dataset.view = "owner";
    navItem.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            <path d="M12 12v.01"></path>
        </svg>
        Owner's Dashboard
    `;
    navMenu.appendChild(navItem);

    // 2. Inject the Owner View Container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const viewHTML = `
    <div class="view-container hidden" id="owner-view">
        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--text-main);">Executive Summary</h2>
            <button class="btn btn-primary" onclick="window.app.fetchOwnerStats()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                Refresh Data
            </button>
        </div>

        <div id="owner-loading" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <p>Loading owner dashboard data...</p>
        </div>

        <div id="owner-content" style="display: none;">
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                <!-- Row 1: Users -->
                <div class="stat-card" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0;">
                    <div style="font-size: 0.85rem; color: #166534; text-transform: uppercase;">Total Students</div>
                    <div id="os-students" style="font-size: 1.8rem; font-weight: 700; color: #14532d; margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe;">
                    <div style="font-size: 0.85rem; color: #1e40af; text-transform: uppercase;">Total Employees</div>
                    <div id="os-employees" style="font-size: 1.8rem; font-weight: 700; color: #1e3a8a; margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #ddd6fe;">
                    <div style="font-size: 0.85rem; color: #5b21b6; text-transform: uppercase;">Total Vendors</div>
                    <div id="os-vendors" style="font-size: 1.8rem; font-weight: 700; color: #4c1d95; margin-top: 0.5rem;">0</div>
                </div>
                <!-- Row 2: Financials Core -->
                <div class="stat-card" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0;">
                    <div style="font-size: 0.85rem; color: #065f46; text-transform: uppercase;">Total Revenue</div>
                    <div id="os-revenue" style="font-size: 1.8rem; font-weight: 700; color: #064e3b; margin-top: 0.5rem;">₹0</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca;">
                    <div style="font-size: 0.85rem; color: #991b1b; text-transform: uppercase;">Total Expenses</div>
                    <div id="os-expenses" style="font-size: 1.8rem; font-weight: 700; color: #7f1d1d; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border: 1px solid #a5f3fc;">
                    <div style="font-size: 0.85rem; color: #155e75; text-transform: uppercase;">Net Balance</div>
                    <div id="os-net" style="font-size: 1.8rem; font-weight: 700; color: #164e63; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #f59e0b;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Student Dues</div>
                    <div id="os-student-dues" style="font-size: 1.8rem; font-weight: 700; color: #b45309; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #ea580c;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Vendor Dues</div>
                    <div id="os-vendor-dues" style="font-size: 1.8rem; font-weight: 700; color: #c2410c; margin-top: 0.5rem;">₹0</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                <div class="stat-card" style="border-left: 4px solid #ef4444;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Defaulters</div>
                    <div id="os-defaulters" style="font-size: 1.8rem; font-weight: 700; color: #991b1b; margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Monthly Payroll</div>
                    <div id="os-payroll" style="font-size: 1.8rem; font-weight: 700; color: #6d28d9; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #14b8a6;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Active Classes</div>
                    <div id="os-classes" style="font-size: 1.8rem; font-weight: 700; color: #0f766e; margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #0ea5e9;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Top Class</div>
                    <div id="os-topclass" style="font-size: 1.3rem; font-weight: 700; color: #0369a1; margin-top: 0.5rem; word-break: break-all;">N/A</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: #f0fdf4;">
                    <div style="font-size: 0.85rem; color: #16a34a; text-transform: uppercase;">Today's Attendance</div>
                    <div id="os-attendance" style="font-size: 1.8rem; font-weight: 700; color: #15803d; margin-top: 0.5rem;">0%</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #f43f5e;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Upcoming Holidays (30d)</div>
                    <div id="os-holidays" style="font-size: 1.8rem; font-weight: 700; color: #be123c; margin-top: 0.5rem;">0</div>
                </div>
            </div>

        </div>
    </div>
    `;
    mainContent.insertAdjacentHTML('beforeend', viewHTML);

    navItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.app.switchView('owner');
    });

})();

// -------------------------
// Logic Integration overrides
// -------------------------

setTimeout(() => {
    if (!window.app) return;

    // Patch _performSwitchView to update title and visibility
    const originalPerformSwitchView = window.app._performSwitchView.bind(window.app);
    window.app._performSwitchView = function(viewName) {
        originalPerformSwitchView(viewName);
        
        if (viewName === 'owner') {
            document.getElementById('page-title').textContent = "Owner's Dashboard";
            
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
            const view = document.getElementById('owner-view');
            if(view) view.classList.remove('hidden');

            // Fetch data if not loaded yet
            if (document.getElementById('owner-content').style.display === 'none') {
                this.fetchOwnerStats();
            }
        }
    };

    window.app.fetchOwnerStats = async function() {
        document.getElementById('owner-loading').style.display = 'block';
        document.getElementById('owner-content').style.display = 'none';

        try {
            const response = await fetch(`${window.API_URL || 'http://localhost:8000'}/owner/stats`);
            if (!response.ok) throw new Error('Failed to load owner stats');
            const data = await response.json();
            
            this.renderOwnerStats(data);
            
            document.getElementById('owner-loading').style.display = 'none';
            document.getElementById('owner-content').style.display = 'block';
        } catch (error) {
            console.error(error);
            document.getElementById('owner-loading').innerHTML = \`<p style="color: #ef4444;">Failed to load data. Ensure backend is running.</p>\`;
        }
    };

    window.app.renderOwnerStats = function(data) {
        document.getElementById('os-students').textContent = data.total_students;
        document.getElementById('os-employees').textContent = data.total_employees;
        document.getElementById('os-vendors').textContent = data.total_vendors;
        document.getElementById('os-revenue').textContent = \`₹\${data.total_revenue.toLocaleString('en-IN')}\`;
        document.getElementById('os-expenses').textContent = \`₹\${data.total_expenses.toLocaleString('en-IN')}\`;
        document.getElementById('os-net').textContent = \`₹\${data.net_balance.toLocaleString('en-IN')}\`;
        document.getElementById('os-student-dues').textContent = \`₹\${data.total_student_dues.toLocaleString('en-IN')}\`;
        document.getElementById('os-vendor-dues').textContent = \`₹\${data.total_vendor_dues.toLocaleString('en-IN')}\`;
        document.getElementById('os-defaulters').textContent = data.total_defaulters;
        document.getElementById('os-payroll').textContent = \`₹\${data.total_monthly_payroll.toLocaleString('en-IN')}\`;
        document.getElementById('os-classes').textContent = data.active_classes_count;
        document.getElementById('os-topclass').textContent = data.highest_enrollment_class;
        document.getElementById('os-attendance').textContent = data.attendance_rate + '%';
        document.getElementById('os-holidays').textContent = data.upcoming_holidays_count;
    };

}, 2500);
