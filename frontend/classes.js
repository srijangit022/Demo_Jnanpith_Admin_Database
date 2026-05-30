// -------------------------
// Classes Module UI Injection
// -------------------------

(function() {
    // 1. Inject the Sidebar Menu Item
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    const classesMenuItem = document.createElement('a');
    classesMenuItem.href = "#";
    classesMenuItem.className = "nav-item";
    classesMenuItem.dataset.view = "classes";
    classesMenuItem.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        Classes
    `;
    navMenu.appendChild(classesMenuItem);

    // 2. Inject the Classes View Container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    const classesViewHTML = `
    <div class="view-container hidden" id="classes-view">
        <div class="action-bar" style="justify-content: space-between;">
            <h2 style="font-size: 1.25rem; font-weight: 600;">Class Management</h2>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Grade / Class</th>
                        <th>Total Students</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody id="classes-table-body">
                    <!-- Data populated by JS -->
                    <tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem;">Loading classes...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
    mainContent.insertAdjacentHTML('beforeend', classesViewHTML);

    // Bind click to the nav item we generated
    classesMenuItem.addEventListener('click', (e) => {
        e.preventDefault();
        window.app.switchView('classes');
    });

})();

// -------------------------
// Logic Integration overrides
// -------------------------

// Wait for app.js to initialize
setTimeout(() => {
    if (!window.app) return;

    window.app.classesSummary = [];

    // Patch _performSwitchView to update title and visibility for classes
    const originalPerformSwitchViewClasses = window.app._performSwitchView.bind(window.app);
    window.app._performSwitchView = function(viewName) {
        originalPerformSwitchViewClasses(viewName);
        
        if (viewName === 'classes') {
            document.getElementById('page-title').textContent = 'Classes Management';
            
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
            const classView = document.getElementById('classes-view');
            if(classView) classView.classList.remove('hidden');
        }
    };

    window.app.fetchClassesSummary = async function() {
        try {
            const response = await fetch(`${window.API_URL || 'http://localhost:8000'}/classes/`);
            if (!response.ok) throw new Error('Network response was not ok');
            this.classesSummary = await response.json();
            this.renderClasses(this.classesSummary);
        } catch (error) {
            console.error('Error fetching classes summary', error);
            const tbody = document.getElementById('classes-table-body');
            if (tbody) tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#ef4444;padding:2rem;">Failed to load data. Make sure backend is running.</td></tr>`;
        }
    };

    window.app.renderClasses = function(data) {
        const tbody = document.getElementById('classes-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem;">No classes found. Add students to see classes here.</td></tr>`;
            return;
        }

        data.forEach(cls => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td><strong>${cls.grade}</strong></td>
                <td><span style="background:var(--bg-main);padding:0.25rem 0.75rem;border-radius:var(--radius-md);font-size:0.9rem;color:var(--primary);font-weight:600;">${cls.student_count} Students</span></td>
                <td class="actions-cell" style="text-align: right;">
                    <button class="btn btn-sm btn-primary" onclick="window.app.exportClassExcel('${cls.grade}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export to Excel
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    window.app.exportClassExcel = function(grade) {
        // Trigger file download using API endpoint
        window.location.href = `${window.API_URL || 'http://localhost:8000'}/classes/export/${encodeURIComponent(grade)}`;
    };

    // Fetch initial classes data
    window.app.fetchClassesSummary();

}, 1500); // Give app.js and vendors.js time to initialize first
