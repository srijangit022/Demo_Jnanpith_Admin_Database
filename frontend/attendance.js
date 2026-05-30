// -------------------------
// Attendance Module UI Injection
// -------------------------

(function() {
    // 1. Inject the Sidebar Menu Item
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const navItem = document.createElement('a');
    navItem.href = "#";
    navItem.className = "nav-item";
    navItem.dataset.view = "attendance";
    navItem.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Attendance
    `;
    navMenu.appendChild(navItem);

    // 2. Inject the Attendance View Container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const grades = [
        "Lower Nursery", "Upper Nursery", "Preperatory",
        "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
        "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
        "11th Grade", "12th Grade"
    ];

    let gradeOptions = '<option value="">Select Grade</option>';
    grades.forEach(g => {
        gradeOptions += `<option value="${g}">${g}</option>`;
    });

    const todayDate = new Date().toISOString().split('T')[0];

    const viewHTML = `
    <div class="view-container hidden" id="attendance-view">
        <div class="action-bar" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: space-between;">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div class="search-box" style="margin: 0; min-width: 15vw;">
                    <select id="attendance-grade-select" style="border: none; outline: none; background: transparent; padding: 0.5rem; font-size: 0.95rem; cursor: pointer; color: var(--text-main); font-family: inherit; width: 100%;">
                        ${gradeOptions}
                    </select>
                </div>
                <div class="search-box" style="margin: 0; padding: 0.5rem 1rem;">
                    <input type="date" id="attendance-date" value="${todayDate}" style="border: none; outline: none; font-family: inherit; font-size: 0.95rem; color: var(--text-main);">
                </div>
                <button class="btn btn-primary" onclick="window.app.fetchAttendanceList()">
                    Load Students
                </button>
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary" onclick="window.app.exportAttendanceExcel()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export CSV
                </button>
                <button class="btn btn-primary" id="save-attendance-btn" onclick="window.app.saveAttendance()" style="display: none;">
                    Save Attendance
                </button>
            </div>
        </div>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 80px;">Student ID</th>
                        <th>Name</th>
                        <th style="width: 250px; text-align: center;">Status</th>
                    </tr>
                </thead>
                <tbody id="attendance-table-body">
                    <tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem;">Select a class and click "Load Students"</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
    mainContent.insertAdjacentHTML('beforeend', viewHTML);

    navItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.app.switchView('attendance');
    });

})();

// -------------------------
// Logic Integration overrides
// -------------------------

setTimeout(() => {
    if (!window.app) return;

    window.app.attendanceRecords = [];

    // Patch _performSwitchView to update title and visibility for classes
    const originalPerformSwitchView = window.app._performSwitchView.bind(window.app);
    window.app._performSwitchView = function(viewName) {
        originalPerformSwitchView(viewName);
        
        if (viewName === 'attendance') {
            document.getElementById('page-title').textContent = 'Daily Attendance';
            
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
            const view = document.getElementById('attendance-view');
            if(view) view.classList.remove('hidden');
        }
    };

    window.app.fetchAttendanceList = async function() {
        const grade = document.getElementById('attendance-grade-select').value;
        const date = document.getElementById('attendance-date').value;
        
        if (!grade) {
            this.showToast('Please select a grade first', 'error');
            return;
        }

        if (!date) {
            this.showToast('Please specify a date', 'error');
            return;
        }

        const tbody = document.getElementById('attendance-table-body');
        const saveBtn = document.getElementById('save-attendance-btn');
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem;">Loading...</td></tr>`;
        saveBtn.style.display = 'none';

        try {
            const response = await fetch(`${window.API_URL || 'http://localhost:8000'}/attendance/class/${encodeURIComponent(grade)}?date=${date}`);
            if (!response.ok) throw new Error('Failed to load');
            const data = await response.json();
            
            this.attendanceRecords = data;
            this.renderAttendanceList();
            
            if (data.length > 0) {
                saveBtn.style.display = 'inline-flex';
            }
        } catch (error) {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#ef4444;padding:2rem;">Error loading data. Make sure backend is running.</td></tr>`;
        }
    };

    window.app.renderAttendanceList = function() {
        const tbody = document.getElementById('attendance-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (this.attendanceRecords.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem;">No students found in this class.</td></tr>`;
            return;
        }

        this.attendanceRecords.forEach(s => {
            const tr = document.createElement('tr');
            
            const isPresent = s.status === 'Present';
            const isAbsent = s.status === 'Absent';
            
            tr.innerHTML = `
                <td>#${s.student_id}</td>
                <td><strong>${s.first_name} ${s.last_name}</strong></td>
                <td style="text-align: center;">
                    <div style="display: inline-flex; background: var(--bg-main); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                        <label style="cursor: pointer; padding: 4px 12px; border-radius: 4px; ${isPresent ? 'background: #dcfce7; color: #166534; font-weight: 600;' : 'color: var(--text-muted);'}">
                            <input type="radio" name="att_${s.student_id}" value="Present" ${isPresent ? 'checked' : ''} style="display:none;" onchange="window.app.updateAttendanceRecord(${s.student_id}, 'Present')">
                            Present
                        </label>
                        <label style="cursor: pointer; padding: 4px 12px; border-radius: 4px; ${isAbsent ? 'background: #fee2e2; color: #991b1b; font-weight: 600;' : 'color: var(--text-muted);'}">
                            <input type="radio" name="att_${s.student_id}" value="Absent" ${isAbsent ? 'checked' : ''} style="display:none;" onchange="window.app.updateAttendanceRecord(${s.student_id}, 'Absent')">
                            Absent
                        </label>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    window.app.updateAttendanceRecord = function(studentId, status) {
        const record = this.attendanceRecords.find(r => r.student_id === studentId);
        if (record) {
            record.status = status;
            // Briefly re-render to update the styled labels
            this.renderAttendanceList();
        }
    };

    window.app.saveAttendance = async function() {
        const grade = document.getElementById('attendance-grade-select').value;
        const date = document.getElementById('attendance-date').value;
        
        if (!grade || !date) return;
        
        const payload = {
            date: date,
            grade: grade,
            records: this.attendanceRecords.map(r => ({
                student_id: r.student_id,
                status: r.status
            }))
        };
        
        try {
            const response = await fetch(`${window.API_URL || 'http://localhost:8000'}/attendance/class/${encodeURIComponent(grade)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error('Failed to save');
            
            this.showToast('Attendance saved successfully', 'success');
            
            // Refresh dashboard widgets if today
            const today = new Date().toISOString().split('T')[0];
            if (date === today) {
                this.fetchDashboardAttendance();
            }
        } catch(error) {
            console.error(error);
            this.showToast('Failed to save attendance', 'error');
        }
    };

    window.app.exportAttendanceExcel = function() {
        const grade = document.getElementById('attendance-grade-select').value;
        const date = document.getElementById('attendance-date').value;
        
        if (!grade) {
            this.showToast('Please select a grade first', 'error');
            return;
        }

        if (!date) {
            this.showToast('Please specify a date', 'error');
            return;
        }
        
        window.location.href = `${window.API_URL || 'http://localhost:8000'}/attendance/export/${encodeURIComponent(grade)}?date=${date}`;
    };

}, 1800);
