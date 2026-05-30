const API_URL = 'http://localhost:8000';

class App {
    constructor() {
        this.currentView = 'dashboard';
        this.currentClass = 'All';
        this.students = [];
        this.employees = [];
        this.holidays = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initClock();
        if (sessionStorage.getItem('site_authenticated') === 'true') {
            document.getElementById('app-container').classList.add('ready');
            this.loadData();
        } else {
            this.promptGlobalPassword();
        }
    }

    initClock() {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            
            const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('en-IN', options);

            const clockEl = document.getElementById('digital-clock');
            const dateEl = document.getElementById('date-calendar');
            
            if (clockEl) clockEl.textContent = timeString;
            if (dateEl) dateEl.textContent = dateString;
        };
        
        updateClock(); // initial call
        setInterval(updateClock, 1000);
    }

    bindEvents() {
        // Navigation Setup (Main Menu)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (item.id === 'students-menu-toggle') {
                    const subMenu = document.getElementById('students-sub-menu');
                    const chevron = item.querySelector('.chevron');
                    subMenu.classList.toggle('hidden');
                    if (subMenu.classList.contains('hidden')) {
                        chevron.style.transform = 'rotate(0deg)';
                    } else {
                        chevron.style.transform = 'rotate(180deg)';
                    }
                    return;
                }

                const view = e.currentTarget.dataset.view;
                if (view) this.switchView(view);
            });
        });

        // Navigation Setup (Sub Menu Items)
        document.querySelectorAll('.nav-sub-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                const className = e.currentTarget.dataset.class;
                
                // Update active states for sub-items
                document.querySelectorAll('.nav-sub-item').forEach(i => i.style.fontWeight = 'normal');
                e.currentTarget.style.fontWeight = 'bold';

                this.currentClass = className;
                this.switchView(view);
            });
        });

        // Search Handlers
        document.getElementById('student-search').addEventListener('input', (e) => this.filterStudents(e.target.value));
        document.getElementById('employee-search').addEventListener('input', (e) => this.filterEmployees(e.target.value));

        // Form Submissions
        document.getElementById('student-form').addEventListener('submit', (e) => this.handleStudentSubmit(e));
        document.getElementById('employee-form').addEventListener('submit', (e) => this.handleEmployeeSubmit(e));
        
        // Let's add holiday search as well
        document.getElementById('holiday-search').addEventListener('input', (e) => this.filterHolidays(e.target.value));

        // Auto-calculate admission fees due
        const admissionFeesInput = document.getElementById('student-admission-fees');
        const admissionFeesPaidInput = document.getElementById('student-admission-fees-paid');
        const admissionFeesDueInput = document.getElementById('student-admission-fees-due');

        const calculateDue = () => {
            const fees = parseFloat(admissionFeesInput.value) || 0;
            const paid = parseFloat(admissionFeesPaidInput.value) || 0;
            admissionFeesDueInput.value = (fees - paid).toFixed(2);
        };

        admissionFeesInput.addEventListener('input', calculateDue);
        admissionFeesPaidInput.addEventListener('input', calculateDue);

        // Auto-calculate total monthly fees paid
        const monthInputs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => document.getElementById(`fee-paid-${m}`));
        const totalMonthlyPaidInput = document.getElementById('total-monthly-paid');

        const calculateTotalMonthlyPaid = () => {
            let total = 0;
            monthInputs.forEach(input => {
                if (input) total += parseFloat(input.value) || 0;
            });
            if (totalMonthlyPaidInput) totalMonthlyPaidInput.value = total.toFixed(2);
        };

        monthInputs.forEach(input => {
            if (input) input.addEventListener('input', calculateTotalMonthlyPaid);
        });

        // Auto-calculate total monthly salary paid for employees
        const empMonthInputs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => document.getElementById(`emp-salary-${m}`));
        const totalEmpSalaryPaidInput = document.getElementById('total-emp-salary-paid');

        const calculateTotalEmpSalaryPaid = () => {
            let total = 0;
            empMonthInputs.forEach(input => {
                if (input) total += parseFloat(input.value) || 0;
            });
            if (totalEmpSalaryPaidInput) totalEmpSalaryPaidInput.value = total.toFixed(2);
        };

        empMonthInputs.forEach(input => {
            if (input) input.addEventListener('input', calculateTotalEmpSalaryPaid);
        });

        // Close Modals on Outside Click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay && overlay.id !== 'password-modal') this.closeModals();
            });
        });
    }

    promptGlobalPassword() {
        const input = document.getElementById('admin-password-input');
        if (input) input.value = '';
        document.getElementById('password-modal').classList.add('active');
        setTimeout(() => { if (input) input.focus(); }, 100);
    }

    submitPassword() {
        const input = document.getElementById('admin-password-input');
        if (!input) return;
        const pwd = input.value;
        
        if (pwd === 'Demo@123') {
            sessionStorage.setItem('site_authenticated', 'true');
            // Remove active state from modal
            document.getElementById('password-modal').classList.remove('active');
            // Show the app container
            document.getElementById('app-container').classList.add('ready');
            this.showToast('Portal Unlocked Successfully!', 'success');
            // Load dashboard data
            this.loadData();
        } else {
            this.showToast('Incorrect Password', 'error');
            input.value = '';
            input.focus();
        }
    }

    switchView(viewName) {
        if ((viewName === 'employees' || viewName === 'vendors' || viewName === 'analytics' || viewName === 'owner') && this.currentView !== viewName) {
            this.targetProtectedView = viewName;
            this.promptAdminPassword();
            return;
        }
        this._performSwitchView(viewName);
    }

    promptAdminPassword() {
        const input = document.getElementById('secondary-admin-password-input');
        if (input) input.value = '';
        document.getElementById('admin-password-modal').classList.add('active');
        setTimeout(() => { if (input) input.focus(); }, 100);
    }

    submitAdminPassword() {
        const input = document.getElementById('secondary-admin-password-input');
        if (!input) return;
        const pwd = input.value;
        
        if (pwd === 'Demo@123') {
            document.getElementById('admin-password-modal').classList.remove('active');
            this.showToast('Admin Section Unlocked Successfully!', 'success');
            if (this.targetProtectedView) {
                this._performSwitchView(this.targetProtectedView);
                this.targetProtectedView = null; // Clear it out
            }
        } else {
            this.showToast('Incorrect Admin Password', 'error');
            input.value = '';
            input.focus();
        }
    }

    _performSwitchView(viewName) {
        // Update Nav Active State
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.view === viewName || (viewName === 'students' && item.id === 'students-menu-toggle')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide all views, show targeted
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.add('hidden');
        });
        document.getElementById(`${viewName}-view`).classList.remove('hidden');

        // Update Header Title
        let titleText = '';
        if (viewName === 'dashboard') titleText = 'Dashboard';
        if (viewName === 'employees') titleText = 'Employees';
        if (viewName === 'holidays') titleText = 'Holidays Schedule';
        if (viewName === 'students') {
            titleText = this.currentClass === 'All' ? 'Students - All Classes' : `Students - ${this.currentClass}`;
            this.filterStudents(document.getElementById('student-search').value); // Re-apply filter for current class
        }

        document.getElementById('page-title').textContent = titleText;
        this.currentView = viewName;
    }

    async loadData() {
        try {
            await Promise.all([
                this.fetchStudents(),
                this.fetchEmployees(),
                this.fetchBirthdays(),
                this.fetchHolidays(),
                this.fetchUpcomingHolidays(),
                this.fetchDashboardAttendance()
            ]);
            this.updateDashboard();
        } catch (error) {
            this.showToast('Failed to load data from server. Ensure backend is running.', 'error');
            console.error('Error loading data:', error);
        }
    }

    async fetchBirthdays() {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/birthdays/today`);
            if (!response.ok) throw new Error('Network response was not ok');
            const birthdays = await response.json();
            this.renderBirthdays(birthdays);
        } catch (error) {
            console.error('Error loading birthdays:', error);
            document.getElementById('birthday-empty-state').textContent = 'Failed to load birthdays.';
        }
    }

    renderBirthdays(birthdays) {
        const container = document.getElementById('birthday-list');
        
        if (birthdays.length === 0) {
            container.innerHTML = '<p class="text-muted" style="margin: 0; padding: 1rem 0; text-align: center;">No birthdays today.</p>';
            return;
        }

        container.innerHTML = '';
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        birthdays.forEach(b => {
            const li = document.createElement('li');
            li.style.padding = '0.75rem 0';
            li.style.borderBottom = '1px solid var(--border-color)';
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '10px';

            const icon = b.type === 'Student' ? '🎓' : '👨‍🏫';
            const details = b.type === 'Student' ? `Grade: ${b.grade}` : `${b.position} (${b.department})`;
            
            li.innerHTML = `
                <span style="font-size: 1.5rem;">${icon}</span>
                <div>
                    <h4 style="margin: 0; color: var(--text-main); font-weight: 600;">${b.name}</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${b.type} - ${details}</p>
                </div>
            `;
            list.appendChild(li);
        });

        // Remove the bottom border from the last item
        if (list.lastChild) {
            list.lastChild.style.borderBottom = 'none';
        }

        container.appendChild(list);
    }

    // --- Students Logic --- //
    async fetchStudents() {
        const response = await fetch(`${API_URL}/students/`);
        if (!response.ok) throw new Error('Network response was not ok');
        this.students = await response.json();
        this.renderStudents(this.students);
    }

    renderStudents(data) {
        const tbody = document.getElementById('student-table-body');
        tbody.innerHTML = '';
        
        data.forEach(student => {
            const tr = document.createElement('tr');
            
            // Format dates
            const dob = new Date(student.date_of_birth).toLocaleDateString('en-IN');
            const enrolled = new Date(student.enrollment_date).toLocaleDateString('en-IN');
            
            // Format Due with warning color if greater than 0
            const dueFees = student.admission_fees_due > 0 
                ? `<span style="color: #ef4444; font-weight: 600;">₹${student.admission_fees_due.toLocaleString('en-IN')}</span>`
                : `<span style="color: var(--secondary);">₹0</span>`;

            tr.innerHTML = `
                <td>#${student.id}</td>
                <td><strong>${student.first_name} ${student.last_name}</strong></td>
                <td><span style="background:var(--bg-main);padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;color:var(--primary);font-weight:600;">${student.grade}</span></td>
                <td>${dob}</td>
                <td>${enrolled}</td>
                <td style="font-size: 0.85rem;">${student.contact_number}</td>
                <td>₹${student.monthly_fees.toLocaleString('en-IN')}</td>
                <td>₹${student.admission_fees.toLocaleString('en-IN')}</td>
                <td><strong style="color: var(--primary);">₹${student.total_fees.toLocaleString('en-IN')}</strong></td>
                <td>${dueFees}</td>
                <td class="actions-cell">
                    <button class="btn btn-sm btn-primary" onclick="window.app.viewStudentDetails(${student.id})">Details</button>
                    <button class="btn btn-sm btn-edit" onclick="window.app.editStudent(${student.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteStudent(${student.id})">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterStudents(query) {
        query = query ? query.toLowerCase() : '';
        const filtered = this.students.filter(s => {
            const matchesSearch = 
                s.first_name.toLowerCase().includes(query) || 
                s.last_name.toLowerCase().includes(query) ||
                s.grade.toLowerCase().includes(query);
            
            const matchesClass = this.currentClass === 'All' || s.grade === this.currentClass;
            
            return matchesSearch && matchesClass;
        });
        this.renderStudents(filtered);
    }

    async handleStudentSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('student-id').value;
        const data = {
            first_name: document.getElementById('student-first-name').value,
            last_name: document.getElementById('student-last-name').value,
            date_of_birth: document.getElementById('student-dob').value,
            grade: document.getElementById('student-grade').value,
            enrollment_date: document.getElementById('student-enrollment').value,
            contact_number: document.getElementById('student-contact').value,
            monthly_fees: parseFloat(document.getElementById('student-monthly-fees').value) || 0,
            total_fees: parseFloat(document.getElementById('student-total-fees').value) || 0,
            annual_program_fees: parseFloat(document.getElementById('student-annual-program-fees').value) || 0,
            admission_fees: parseFloat(document.getElementById('student-admission-fees').value) || 0,
            admission_fees_paid: parseFloat(document.getElementById('student-admission-fees-paid').value) || 0,
            admission_fees_due: parseFloat(document.getElementById('student-admission-fees-due').value) || 0,
            fee_paid_jan: parseFloat(document.getElementById('fee-paid-jan').value) || 0,
            fee_paid_feb: parseFloat(document.getElementById('fee-paid-feb').value) || 0,
            fee_paid_mar: parseFloat(document.getElementById('fee-paid-mar').value) || 0,
            fee_paid_apr: parseFloat(document.getElementById('fee-paid-apr').value) || 0,
            fee_paid_may: parseFloat(document.getElementById('fee-paid-may').value) || 0,
            fee_paid_jun: parseFloat(document.getElementById('fee-paid-jun').value) || 0,
            fee_paid_jul: parseFloat(document.getElementById('fee-paid-jul').value) || 0,
            fee_paid_aug: parseFloat(document.getElementById('fee-paid-aug').value) || 0,
            fee_paid_sep: parseFloat(document.getElementById('fee-paid-sep').value) || 0,
            fee_paid_oct: parseFloat(document.getElementById('fee-paid-oct').value) || 0,
            fee_paid_nov: parseFloat(document.getElementById('fee-paid-nov').value) || 0,
            fee_paid_dec: parseFloat(document.getElementById('fee-paid-dec').value) || 0
        };

        try {
            const url = id ? `${API_URL}/students/${id}` : `${API_URL}/students/`;
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Save failed');
            
            this.showToast(id ? 'Student updated successfully' : 'Student added successfully');
            this.closeModals();
            await this.fetchStudents();
            this.updateDashboard();
        } catch (error) {
            this.showToast('Error saving student', 'error');
        }
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (!student) return;

        document.getElementById('student-id').value = student.id;
        document.getElementById('student-first-name').value = student.first_name;
        document.getElementById('student-last-name').value = student.last_name;
        document.getElementById('student-dob').value = student.date_of_birth;
        document.getElementById('student-grade').value = student.grade;
        document.getElementById('student-enrollment').value = student.enrollment_date;
        document.getElementById('student-contact').value = student.contact_number;
        document.getElementById('student-monthly-fees').value = student.monthly_fees;
        document.getElementById('student-total-fees').value = student.total_fees;
        document.getElementById('student-annual-program-fees').value = student.annual_program_fees;
        document.getElementById('student-admission-fees').value = student.admission_fees;
        document.getElementById('student-admission-fees-paid').value = student.admission_fees_paid;
        document.getElementById('student-admission-fees-due').value = student.admission_fees_due;
        
        document.getElementById('fee-paid-jan').value = student.fee_paid_jan !== undefined ? student.fee_paid_jan : 0;
        document.getElementById('fee-paid-feb').value = student.fee_paid_feb !== undefined ? student.fee_paid_feb : 0;
        document.getElementById('fee-paid-mar').value = student.fee_paid_mar !== undefined ? student.fee_paid_mar : 0;
        document.getElementById('fee-paid-apr').value = student.fee_paid_apr !== undefined ? student.fee_paid_apr : 0;
        document.getElementById('fee-paid-may').value = student.fee_paid_may !== undefined ? student.fee_paid_may : 0;
        document.getElementById('fee-paid-jun').value = student.fee_paid_jun !== undefined ? student.fee_paid_jun : 0;
        document.getElementById('fee-paid-jul').value = student.fee_paid_jul !== undefined ? student.fee_paid_jul : 0;
        document.getElementById('fee-paid-aug').value = student.fee_paid_aug !== undefined ? student.fee_paid_aug : 0;
        document.getElementById('fee-paid-sep').value = student.fee_paid_sep !== undefined ? student.fee_paid_sep : 0;
        document.getElementById('fee-paid-oct').value = student.fee_paid_oct !== undefined ? student.fee_paid_oct : 0;
        document.getElementById('fee-paid-nov').value = student.fee_paid_nov !== undefined ? student.fee_paid_nov : 0;
        document.getElementById('fee-paid-dec').value = student.fee_paid_dec !== undefined ? student.fee_paid_dec : 0;
        
        let total = 0;
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const val = student[`fee_paid_${m}`];
            if (val) total += parseFloat(val);
        });
        document.getElementById('total-monthly-paid').value = total.toFixed(2);

        document.getElementById('student-modal-title').textContent = 'Edit Student';
        this.openStudentModal();
    }

    viewStudentDetails(id) {
        const student = this.students.find(s => s.id === id);
        if (!student) return;

        document.getElementById('details-name').textContent = `${student.first_name} ${student.last_name}`;
        document.getElementById('details-grade-badge').textContent = student.grade;
        
        let total = 0;
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const val = student[`fee_paid_${m}`];
            document.getElementById(`details-${m}`).textContent = val !== undefined && val > 0 ? `₹${parseFloat(val).toLocaleString('en-IN')}` : '₹0';
            if (val) total += parseFloat(val);
        });

        document.getElementById('details-total-paid').textContent = `₹${total.toLocaleString('en-IN')}`;

        document.getElementById('student-details-modal').classList.add('active');
    }

    async deleteStudent(id) {
        if (!confirm('Are you sure you want to delete this student?')) return;
        
        try {
            const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            
            this.showToast('Student deleted');
            await this.fetchStudents();
            this.updateDashboard();
        } catch (error) {
            this.showToast('Error deleting student', 'error');
        }
    }

    // --- Employee Logic --- //
    async fetchEmployees() {
        const response = await fetch(`${API_URL}/employees/`);
        if (!response.ok) throw new Error('Network response was not ok');
        this.employees = await response.json();
        this.renderEmployees(this.employees);
    }

    renderEmployees(data) {
        const tbody = document.getElementById('employee-table-body');
        tbody.innerHTML = '';
        
        data.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${emp.id}</td>
                <td><strong>${emp.emp_id || '-'}</strong></td>
                <td>${emp.first_name} ${emp.last_name}</td>
                <td>${emp.department}</td>
                <td><span style="background:#e0f2fe;padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;color:#0284c7;font-weight:600;">${emp.position}</span></td>
                <td>${emp.joining_date}</td>
                <td><span style="background:#fee2e2;padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;color:#ef4444;font-weight:600;">${emp.blood_group}</span></td>
                <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                <td class="actions-cell">
                    <button class="btn btn-sm btn-primary" onclick="window.app.viewEmployeeDetails(${emp.id})">Details</button>
                    <button class="btn btn-sm btn-edit" onclick="window.app.editEmployee(${emp.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteEmployee(${emp.id})">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterEmployees(query) {
        query = query.toLowerCase();
        const filtered = this.employees.filter(e => 
            e.first_name.toLowerCase().includes(query) || 
            e.last_name.toLowerCase().includes(query) ||
            e.department.toLowerCase().includes(query) ||
            e.position.toLowerCase().includes(query)
        );
        this.renderEmployees(filtered);
    }

    async handleEmployeeSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('employee-id').value;
        const data = {
            emp_id: document.getElementById('employee-emp-id').value,
            first_name: document.getElementById('employee-first-name').value,
            last_name: document.getElementById('employee-last-name').value,
            department: document.getElementById('employee-department').value,
            position: document.getElementById('employee-position').value,
            joining_date: document.getElementById('employee-joining-date').value,
            birth_date: document.getElementById('employee-birth-date').value,
            blood_group: document.getElementById('employee-blood-group').value,
            salary: parseFloat(document.getElementById('employee-salary').value),
            contact_number: document.getElementById('employee-contact').value,
            salary_paid_jan: parseFloat(document.getElementById('emp-salary-jan').value) || 0.0,
            salary_paid_feb: parseFloat(document.getElementById('emp-salary-feb').value) || 0.0,
            salary_paid_mar: parseFloat(document.getElementById('emp-salary-mar').value) || 0.0,
            salary_paid_apr: parseFloat(document.getElementById('emp-salary-apr').value) || 0.0,
            salary_paid_may: parseFloat(document.getElementById('emp-salary-may').value) || 0.0,
            salary_paid_jun: parseFloat(document.getElementById('emp-salary-jun').value) || 0.0,
            salary_paid_jul: parseFloat(document.getElementById('emp-salary-jul').value) || 0.0,
            salary_paid_aug: parseFloat(document.getElementById('emp-salary-aug').value) || 0.0,
            salary_paid_sep: parseFloat(document.getElementById('emp-salary-sep').value) || 0.0,
            salary_paid_oct: parseFloat(document.getElementById('emp-salary-oct').value) || 0.0,
            salary_paid_nov: parseFloat(document.getElementById('emp-salary-nov').value) || 0.0,
            salary_paid_dec: parseFloat(document.getElementById('emp-salary-dec').value) || 0.0
        };

        try {
            const url = id ? `${API_URL}/employees/${id}` : `${API_URL}/employees/`;
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Save failed');
            
            const savedEmployee = await response.json();
            const photoInput = document.getElementById('employee-photo');
            if (photoInput && photoInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file', photoInput.files[0]);
                const photoRes = await fetch(`${API_URL}/employees/${savedEmployee.id}/photo`, {
                    method: 'POST',
                    body: formData
                });
                if (!photoRes.ok) throw new Error('Photo upload failed');
                photoInput.value = ''; // clear input after success
            }
            
            this.showToast(id ? 'Employee updated successfully' : 'Employee added successfully');
            this.closeModals();
            await this.fetchEmployees();
            this.updateDashboard();
        } catch (error) {
            this.showToast('Error saving employee', 'error');
        }
    }

    editEmployee(id) {
        const emp = this.employees.find(e => e.id === id);
        if (!emp) return;

        document.getElementById('employee-id').value = emp.id;
        document.getElementById('employee-emp-id').value = emp.emp_id || '';
        document.getElementById('employee-first-name').value = emp.first_name;
        document.getElementById('employee-last-name').value = emp.last_name;
        document.getElementById('employee-department').value = emp.department;
        document.getElementById('employee-position').value = emp.position;
        document.getElementById('employee-joining-date').value = emp.joining_date;
        document.getElementById('employee-birth-date').value = emp.birth_date;
        document.getElementById('employee-blood-group').value = emp.blood_group;
        document.getElementById('employee-salary').value = emp.salary;
        document.getElementById('employee-contact').value = emp.contact_number;

        document.getElementById('emp-salary-jan').value = emp.salary_paid_jan !== undefined ? emp.salary_paid_jan : 0;
        document.getElementById('emp-salary-feb').value = emp.salary_paid_feb !== undefined ? emp.salary_paid_feb : 0;
        document.getElementById('emp-salary-mar').value = emp.salary_paid_mar !== undefined ? emp.salary_paid_mar : 0;
        document.getElementById('emp-salary-apr').value = emp.salary_paid_apr !== undefined ? emp.salary_paid_apr : 0;
        document.getElementById('emp-salary-may').value = emp.salary_paid_may !== undefined ? emp.salary_paid_may : 0;
        document.getElementById('emp-salary-jun').value = emp.salary_paid_jun !== undefined ? emp.salary_paid_jun : 0;
        document.getElementById('emp-salary-jul').value = emp.salary_paid_jul !== undefined ? emp.salary_paid_jul : 0;
        document.getElementById('emp-salary-aug').value = emp.salary_paid_aug !== undefined ? emp.salary_paid_aug : 0;
        document.getElementById('emp-salary-sep').value = emp.salary_paid_sep !== undefined ? emp.salary_paid_sep : 0;
        document.getElementById('emp-salary-oct').value = emp.salary_paid_oct !== undefined ? emp.salary_paid_oct : 0;
        document.getElementById('emp-salary-nov').value = emp.salary_paid_nov !== undefined ? emp.salary_paid_nov : 0;
        document.getElementById('emp-salary-dec').value = emp.salary_paid_dec !== undefined ? emp.salary_paid_dec : 0;
        
        let total = 0;
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const val = emp[`salary_paid_${m}`];
            if (val) total += parseFloat(val);
        });
        document.getElementById('total-emp-salary-paid').value = total.toFixed(2);

        document.getElementById('employee-modal-title').textContent = 'Edit Employee';
        this.openEmployeeModal();
    }

    viewEmployeeDetails(id) {
        const emp = this.employees.find(e => e.id === id);
        if (!emp) return;

        document.getElementById('emp-details-name').textContent = `${emp.first_name} ${emp.last_name}`;
        document.getElementById('emp-details-emp-code').textContent = emp.emp_id ? `ID: ${emp.emp_id}` : '';
        document.getElementById('emp-details-dept-badge').textContent = emp.department;
        document.getElementById('emp-details-position').textContent = emp.position;
        document.getElementById('emp-details-contact').textContent = emp.contact_number;
        document.getElementById('emp-details-joining').textContent = emp.joining_date;
        document.getElementById('emp-details-birth').textContent = emp.birth_date;
        document.getElementById('emp-details-blood').textContent = emp.blood_group;
        document.getElementById('emp-details-salary').textContent = `₹${emp.salary.toLocaleString('en-IN')}`;

        let empTotal = 0;
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(m => {
            const val = emp[`salary_paid_${m}`];
            document.getElementById(`emp-details-${m}`).textContent = val !== undefined && val > 0 ? `₹${parseFloat(val).toLocaleString('en-IN')}` : '₹0';
            if (val) empTotal += parseFloat(val);
        });

        document.getElementById('emp-details-total-salary-paid').textContent = `₹${empTotal.toLocaleString('en-IN')}`;

        const photoEl = document.getElementById('emp-details-photo');
        const noPhotoEl = document.getElementById('emp-details-no-photo');
        
        if (emp.photo_url) {
            photoEl.src = `${API_URL}${emp.photo_url}`;
            photoEl.style.display = 'block';
            noPhotoEl.style.display = 'none';
        } else {
            photoEl.src = '';
            photoEl.style.display = 'none';
            noPhotoEl.style.display = 'block';
        }

        document.getElementById('employee-details-modal').classList.add('active');
    }

    async deleteEmployee(id) {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            
            this.showToast('Employee deleted');
            await this.fetchEmployees();
            this.updateDashboard();
        } catch (error) {
            this.showToast('Error deleting employee', 'error');
        }
    }

    exportEmployeesExcel() {
        window.location.href = `${API_URL}/employees/export`;
    }

    // --- Holiday Logic --- //
    async fetchHolidays() {
        try {
            const response = await fetch(`${API_URL}/holidays/`);
            if (!response.ok) throw new Error('Network response was not ok');
            this.holidays = await response.json();
            this.renderHolidays(this.holidays);
        } catch (error) {
            console.error('Error fetching holidays', error);
        }
    }

    async fetchUpcomingHolidays() {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/holidays/upcoming`);
            if (!response.ok) throw new Error('Network response was not ok');
            const upcomingHolidays = await response.json();
            this.renderUpcomingHolidays(upcomingHolidays);
        } catch (error) {
            console.error('Error fetching upcoming holidays', error);
        }
    }

    renderHolidays(data) {
        const tbody = document.getElementById('holiday-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem;">No holidays added yet.</td></tr>`;
            return;
        }

        data.forEach(holiday => {
            const tr = document.createElement('tr');
            
            const startDate = new Date(holiday.start_date).toLocaleDateString('en-IN');
            const endDate = new Date(holiday.end_date).toLocaleDateString('en-IN');

            tr.innerHTML = `
                <td><strong>${holiday.occasion}</strong></td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td><span style="background:var(--bg-main);padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;color:var(--primary);font-weight:600;">${holiday.duration_days} Day(s)</span></td>
                <td class="actions-cell">
                    <button class="btn btn-sm btn-danger" onclick="window.app.deleteHoliday(${holiday.id})">Del</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderUpcomingHolidays(data) {
        const tbody = document.getElementById('dashboard-holidays-body');
        if (!tbody) return;
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;color:var(--text-muted);padding:1.5rem;">No upcoming holidays this week.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        data.forEach(holiday => {
            const tr = document.createElement('tr');
            const startDate = new Date(holiday.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            
            tr.innerHTML = `
                <td><strong>${holiday.occasion}</strong></td>
                <td><span style="background:#e0f2fe;padding:0.25rem 0.5rem;border-radius:var(--radius-md);font-size:0.8rem;color:#0284c7;font-weight:600;">Starts ${startDate}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    async fetchDashboardAttendance() {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/attendance/today`);
            if (!response.ok) throw new Error('Network error');
            const attData = await response.json();
            this.renderDashboardAttendance(attData);
        } catch (error) {
            console.error('Error fetching dashboard attendance', error);
            const body = document.getElementById('dashboard-attendance-body');
            if (body) body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#ef4444;padding:1.5rem;">Failed to load attendance summary.</td></tr>`;
        }
    }

    renderDashboardAttendance(data) {
        const tbody = document.getElementById('dashboard-attendance-body');
        if (!tbody) return;
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1.5rem;">No active classes found.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        data.forEach(gradeRow => {
            const tr = document.createElement('tr');
            
            let percentage = 0;
            if (gradeRow.total_students > 0) {
                percentage = Math.round((gradeRow.present_students / gradeRow.total_students) * 100);
            }
            
            let color = 'var(--text-muted)';
            if (gradeRow.present_students > 0) {
                if (percentage >= 90) color = '#22c55e'; // Green
                else if (percentage >= 75) color = '#eab308'; // Yellow
                else color = '#ef4444'; // Red
            } else if (gradeRow.total_students > 0) {
                color = '#ef4444'; // 0 present is bad
            }

            tr.innerHTML = `
                <td><strong>${gradeRow.grade}</strong></td>
                <td>${gradeRow.total_students}</td>
                <td>${gradeRow.present_students}</td>
                <td><strong style="color:${color}">${gradeRow.present_students > 0 ? percentage + '%' : 'Not Marked'}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterHolidays(query) {
        query = query.toLowerCase();
        const filtered = this.holidays.filter(h => h.occasion.toLowerCase().includes(query));
        this.renderHolidays(filtered);
    }

    async saveHoliday() {
        const id = document.getElementById('holiday-id').value;
        const data = {
            occasion: document.getElementById('holiday-occasion').value,
            start_date: document.getElementById('holiday-start-date').value,
            end_date: document.getElementById('holiday-end-date').value,
            duration_days: parseInt(document.getElementById('holiday-duration').value) || 1
        };

        try {
            const url = id ? `${API_URL}/holidays/${id}` : `${API_URL}/holidays/`;
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Save failed');
            
            this.showToast(id ? 'Holiday updated successfully' : 'Holiday added successfully');
            this.closeModals();
            await this.fetchHolidays();
            await this.fetchUpcomingHolidays();
        } catch (error) {
            this.showToast('Error saving holiday', 'error');
        }
    }

    async deleteHoliday(id) {
        if (!confirm('Are you sure you want to delete this holiday?')) return;
        
        try {
            const response = await fetch(`${API_URL}/holidays/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            
            this.showToast('Holiday deleted');
            await this.fetchHolidays();
            await this.fetchUpcomingHolidays();
        } catch (error) {
            this.showToast('Error deleting holiday', 'error');
        }
    }

    // --- Dashboard & Utilities --- //
    updateDashboard() {
        document.getElementById('total-students').textContent = this.students.length;
        document.getElementById('total-employees').textContent = this.employees.length;
    }

    openStudentModal() {
        if (this.currentClass !== 'All') {
            document.getElementById('student-grade').value = this.currentClass;
        } else {
            document.getElementById('student-grade').value = '';
        }
        document.getElementById('student-modal').classList.add('active');
    }

    openEmployeeModal() {
        document.getElementById('employee-modal').classList.add('active');
    }

    openHolidayModal() {
        document.getElementById('holiday-modal').classList.add('active');
    }

    closeModal(id) {
        this.closeModals();
    }

    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.getElementById('student-form').reset();
        document.getElementById('student-id').value = '';
        document.getElementById('student-modal-title').textContent = 'Add New Student';
        
        document.getElementById('employee-form').reset();
        document.getElementById('employee-id').value = '';
        document.getElementById('employee-modal-title').textContent = 'Add New Employee';

        const holidayForm = document.getElementById('holiday-form');
        if (holidayForm) {
            holidayForm.reset();
            document.getElementById('holiday-id').value = '';
            document.getElementById('holiday-modal-title').textContent = 'Add New Holiday';
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);
        
        // Trigger reflow for animation
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize on load
window.app = new App();
