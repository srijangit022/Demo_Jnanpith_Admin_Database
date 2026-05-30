// -------------------------
// Analytics Module UI Injection
// -------------------------

(function() {
    // 1. Inject the Sidebar Menu Item
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const navItem = document.createElement('a');
    navItem.href = "#";
    navItem.className = "nav-item";
    navItem.dataset.view = "analytics";
    navItem.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Analytics & Insights
    `;
    navMenu.appendChild(navItem);

    // 2. Inject the Analytics View Container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const viewHTML = `
    <div class="view-container hidden" id="analytics-view">
        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--text-main);">School Analytics Dashboard</h2>
            <button class="btn btn-primary" onclick="window.app.fetchAnalyticsData()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                Refresh Data
            </button>
        </div>

        <div id="analytics-loading" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            <p>Loading analytics data...</p>
        </div>

        <div id="analytics-content" style="display: none;">
            <!-- KPIs -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Active Students</div>
                    <div id="kpi-students" style="font-size: 1.8rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Active Staff</div>
                    <div id="kpi-staff" style="font-size: 1.8rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #22c55e;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Overall Revenue</div>
                    <div id="kpi-revenue" style="font-size: 1.8rem; font-weight: 700; color: #166534; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #ef4444;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Overall Expenses</div>
                    <div id="kpi-expenses" style="font-size: 1.8rem; font-weight: 700; color: #991b1b; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #3b82f6;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Net Balance Estimate</div>
                    <div id="kpi-net" style="font-size: 1.8rem; font-weight: 700; color: #1d4ed8; margin-top: 0.5rem;">₹0</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #f59e0b;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Total Dues Pending</div>
                    <div id="kpi-dues" style="font-size: 1.8rem; font-weight: 700; color: #b45309; margin-top: 0.5rem;">₹0</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: #fff1f2;">
                    <div style="font-size: 0.85rem; color: #e11d48; text-transform: uppercase; font-weight: 600;">Student Defaulter Count</div>
                    <div id="kpi-defaulters" style="font-size: 1.8rem; font-weight: 700; color: #be123c; margin-top: 0.5rem;">0</div>
                </div>
                <div class="stat-card" style="background: #f0fdf4;">
                    <div style="font-size: 0.85rem; color: #16a34a; text-transform: uppercase; font-weight: 600;">Today's Attendance Rate</div>
                    <div id="kpi-attendance" style="font-size: 1.8rem; font-weight: 700; color: #15803d; margin-top: 0.5rem;">0%</div>
                </div>
            </div>

            <!-- Charts -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div class="dashboard-section" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-main);">Financial Timeline (Revenue vs Expenses)</h3>
                    <div style="position: relative; height: 300px; width: 100%;">
                        <canvas id="financeChart"></canvas>
                    </div>
                </div>
                <div class="dashboard-section" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-main);">Staff by Department</h3>
                    <div style="position: relative; height: 300px; width: 100%;">
                        <canvas id="staffChart"></canvas>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <div class="dashboard-section" style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-main);">Class-wise Enrollment</h3>
                    <div style="position: relative; height: 300px; width: 100%;">
                        <canvas id="enrollmentChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    mainContent.insertAdjacentHTML('beforeend', viewHTML);

    navItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.app.switchView('analytics');
    });

})();

// -------------------------
// Logic Integration overrides
// -------------------------

setTimeout(() => {
    if (!window.app) return;

    let financeChartInstance = null;
    let staffChartInstance = null;
    let enrollmentChartInstance = null;

    // Patch _performSwitchView to update title and visibility
    const originalPerformSwitchView = window.app._performSwitchView.bind(window.app);
    window.app._performSwitchView = function(viewName) {
        originalPerformSwitchView(viewName);
        
        if (viewName === 'analytics') {
            document.getElementById('page-title').textContent = 'Analytics & Insights';
            
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
            const view = document.getElementById('analytics-view');
            if(view) view.classList.remove('hidden');

            // Fetch data if not loaded yet
            if (document.getElementById('analytics-content').style.display === 'none') {
                this.fetchAnalyticsData();
            }
        }
    };

    window.app.fetchAnalyticsData = async function() {
        document.getElementById('analytics-loading').style.display = 'block';
        document.getElementById('analytics-content').style.display = 'none';

        try {
            const response = await fetch(`${window.API_URL || 'http://localhost:8000'}/analytics/overview`);
            if (!response.ok) throw new Error('Failed to load analytics');
            const data = await response.json();
            
            this.renderAnalytics(data);
            
            document.getElementById('analytics-loading').style.display = 'none';
            document.getElementById('analytics-content').style.display = 'block';
        } catch (error) {
            console.error(error);
            document.getElementById('analytics-loading').innerHTML = `<p style="color: #ef4444;">Failed to load data. Ensure backend is running.</p>`;
        }
    };

    window.app.renderAnalytics = function(data) {
        // Render KPIs
        document.getElementById('kpi-students').textContent = data.total_students;
        document.getElementById('kpi-staff').textContent = data.total_employees;
        document.getElementById('kpi-revenue').textContent = `₹${data.total_revenue.toLocaleString('en-IN')}`;
        document.getElementById('kpi-expenses').textContent = `₹${data.total_expenses.toLocaleString('en-IN')}`;
        document.getElementById('kpi-net').textContent = `₹${data.net_balance.toLocaleString('en-IN')}`;
        document.getElementById('kpi-dues').textContent = `₹${data.total_outstanding.toLocaleString('en-IN')}`;
        document.getElementById('kpi-defaulters').textContent = data.defaulter_count;

        let attendancePercentage = 0;
        if (data.total_students > 0) {
            attendancePercentage = Math.round((data.attendance_present_today / data.total_students) * 100);
        }
        document.getElementById('kpi-attendance').textContent = attendancePercentage + '%';

        // Render Charts using Chart.js API
        
        // 1. Finance Timeline (Revenues vs Expenses)
        const ctxFinance = document.getElementById('financeChart').getContext('2d');
        if (financeChartInstance) financeChartInstance.destroy();
        financeChartInstance = new Chart(ctxFinance, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: data.monthly_revenue,
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: data.monthly_expenses,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 2. Staff by Department Doughnut Chart
        const ctxStaff = document.getElementById('staffChart').getContext('2d');
        if (staffChartInstance) staffChartInstance.destroy();
        const depts = Object.keys(data.department_staff);
        const deptValues = Object.values(data.department_staff);
        
        staffChartInstance = new Chart(ctxStaff, {
            type: 'doughnut',
            data: {
                labels: depts.length ? depts : ['No Data'],
                datasets: [{
                    data: deptValues.length ? deptValues : [1],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6', '#cbd5e1']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 3. Class-wise Enrollment Bar Chart
        const ctxEnroll = document.getElementById('enrollmentChart').getContext('2d');
        if (enrollmentChartInstance) enrollmentChartInstance.destroy();
        
        const sortOrder = ["Lower Nursery", "Upper Nursery", "Preperatory", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];
        
        // Sort the data based on the correct academic order
        const enrolledClasses = Object.keys(data.class_enrollment);
        enrolledClasses.sort((a, b) => {
            let i = sortOrder.indexOf(a);
            let j = sortOrder.indexOf(b);
            return (i === -1 ? 99 : i) - (j === -1 ? 99 : j);
        });

        const sortedValues = enrolledClasses.map(g => data.class_enrollment[g]);

        enrollmentChartInstance = new Chart(ctxEnroll, {
            type: 'bar',
            data: {
                labels: enrolledClasses,
                datasets: [{
                    label: 'Enrolled Students',
                    data: sortedValues,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    };

}, 2000);
