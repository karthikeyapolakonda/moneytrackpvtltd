// Money Track Pvt Ltd - Personal Finance Tracker
// Comprehensive JavaScript Application

class FinanceTracker {
    constructor() {
        this.transactions = [];
        this.budgets = [];
        this.goals = [];
        this.categories = [];
        this.settings = {
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            theme: 'light'
        };
        
        this.charts = {};
        this.currentSection = 'dashboard';
        
        this.init();
    }

    init() {
        this.loadData();
        this.initializeDefaultCategories();
        this.setupEventListeners();
        this.updateDashboard();
        this.showSection('dashboard');
        this.initializeCharts();
        
        // Set today's date as default for transaction date
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('goalTargetDate').value = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('moneyTrackData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.transactions = data.transactions || [];
            this.budgets = data.budgets || [];
            this.goals = data.goals || [];
            this.categories = data.categories || [];
            this.settings = { ...this.settings, ...data.settings };
        }
    }

    saveData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            categories: this.categories,
            settings: this.settings
        };
        localStorage.setItem('moneyTrackData', JSON.stringify(data));
    }

    // Initialize default categories
    initializeDefaultCategories() {
        if (this.categories.length === 0) {
            this.categories = [
                { id: 1, name: 'Salary', type: 'income', color: '#10b981' },
                { id: 2, name: 'Freelance', type: 'income', color: '#3b82f6' },
                { id: 3, name: 'Investment', type: 'income', color: '#8b5cf6' },
                { id: 4, name: 'Food & Dining', type: 'expense', color: '#f59e0b' },
                { id: 5, name: 'Transportation', type: 'expense', color: '#ef4444' },
                { id: 6, name: 'Shopping', type: 'expense', color: '#ec4899' },
                { id: 7, name: 'Entertainment', type: 'expense', color: '#06b6d4' },
                { id: 8, name: 'Bills & Utilities', type: 'expense', color: '#84cc16' },
                { id: 9, name: 'Healthcare', type: 'expense', color: '#f97316' },
                { id: 10, name: 'Education', type: 'expense', color: '#6366f1' }
            ];
            this.saveData();
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Quick Actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Modal Controls
        this.setupModalControls();

        // Form Submissions
        this.setupFormSubmissions();

        // Search and Filters
        this.setupSearchAndFilters();

        // Settings
        this.setupSettings();

        // Data Management
        this.setupDataManagement();
    }

    setupModalControls() {
        // Transaction Modal
        const transactionModal = document.getElementById('transactionModal');
        const addTransactionBtn = document.getElementById('addTransactionBtn');
        const cancelTransactionBtn = document.getElementById('cancelTransaction');

        addTransactionBtn.addEventListener('click', () => this.showModal('transactionModal'));
        cancelTransactionBtn.addEventListener('click', () => this.hideModal('transactionModal'));

        // Budget Modal
        const budgetModal = document.getElementById('budgetModal');
        const createBudgetBtn = document.getElementById('createBudgetBtn');
        const cancelBudgetBtn = document.getElementById('cancelBudget');

        createBudgetBtn.addEventListener('click', () => this.showModal('budgetModal'));
        cancelBudgetBtn.addEventListener('click', () => this.hideModal('budgetModal'));

        // Goal Modal
        const goalModal = document.getElementById('goalModal');
        const createGoalBtn = document.getElementById('createGoalBtn');
        const cancelGoalBtn = document.getElementById('cancelGoal');

        createGoalBtn.addEventListener('click', () => this.showModal('goalModal'));
        cancelGoalBtn.addEventListener('click', () => this.hideModal('goalModal'));

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close modals on X click
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });
    }

    setupFormSubmissions() {
        // Transaction Form
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Budget Form
        document.getElementById('budgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBudget();
        });

        // Goal Form
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });
    }

    setupSearchAndFilters() {
        // Transaction Search
        document.getElementById('transactionSearch').addEventListener('input', (e) => {
            this.filterTransactions();
        });

        // Category Filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterTransactions();
        });

        // Type Filter
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filterTransactions();
        });

        // Analytics Period
        document.getElementById('analyticsPeriod').addEventListener('change', (e) => {
            this.updateAnalytics();
        });
    }

    setupSettings() {
        // Currency Setting
        document.getElementById('currency').addEventListener('change', (e) => {
            this.settings.currency = e.target.value;
            this.saveData();
            this.updateDashboard();
        });

        // Date Format Setting
        document.getElementById('dateFormat').addEventListener('change', (e) => {
            this.settings.dateFormat = e.target.value;
            this.saveData();
            this.updateDashboard();
        });

        // Add Category
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.addCategory();
        });
    }

    setupDataManagement() {
        // Export Data
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('exportAllDataBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import Data
        document.getElementById('importDataBtn').addEventListener('click', () => {
            this.importData();
        });

        // Clear All Data
        document.getElementById('clearAllDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Update section-specific content
        switch (sectionName) {
            case 'transactions':
                this.updateTransactionsTable();
                break;
            case 'budget':
                this.updateBudgetSection();
                break;
            case 'goals':
                this.updateGoalsSection();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
            case 'settings':
                this.updateSettingsSection();
                break;
        }
    }

    // Quick Actions
    handleQuickAction(action) {
        switch (action) {
            case 'add-income':
                document.getElementById('transactionType').value = 'income';
                this.showModal('transactionModal');
                break;
            case 'add-expense':
                document.getElementById('transactionType').value = 'expense';
                this.showModal('transactionModal');
                break;
            case 'set-budget':
                this.showModal('budgetModal');
                break;
            case 'create-goal':
                this.showModal('goalModal');
                break;
        }
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Populate category options
        this.populateCategoryOptions();
        
        // Focus first input
        const firstInput = modal.querySelector('input, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }

    // Transaction Management
    addTransaction() {
        const type = document.getElementById('transactionType').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const description = document.getElementById('transactionDescription').value;
        const categoryId = parseInt(document.getElementById('transactionCategory').value);
        const date = document.getElementById('transactionDate').value;

        if (!amount || !description || !categoryId || !date) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            type: type,
            amount: amount,
            description: description,
            categoryId: categoryId,
            date: date,
            createdAt: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateDashboard();
        this.hideModal('transactionModal');
        this.showNotification('Transaction added successfully!', 'success');

        // Update transactions table if visible
        if (this.currentSection === 'transactions') {
            this.updateTransactionsTable();
        }
    }

    deleteTransaction(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== transactionId);
            this.saveData();
            this.updateDashboard();
            this.updateTransactionsTable();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
    }

    // Budget Management
    addBudget() {
        const categoryId = parseInt(document.getElementById('budgetCategory').value);
        const amount = parseFloat(document.getElementById('budgetAmount').value);
        const period = document.getElementById('budgetPeriod').value;

        if (!categoryId || !amount || !period) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Check if budget already exists for this category and period
        const existingBudget = this.budgets.find(b => 
            b.categoryId === categoryId && b.period === period
        );

        if (existingBudget) {
            existingBudget.amount = amount;
            this.showNotification('Budget updated successfully!', 'success');
        } else {
            const budget = {
                id: Date.now(),
                categoryId: categoryId,
                amount: amount,
                period: period,
                createdAt: new Date().toISOString()
            };
            this.budgets.push(budget);
            this.showNotification('Budget created successfully!', 'success');
        }

        this.saveData();
        this.hideModal('budgetModal');
        this.updateBudgetSection();
    }

    deleteBudget(budgetId) {
        if (confirm('Are you sure you want to delete this budget?')) {
            this.budgets = this.budgets.filter(b => b.id !== budgetId);
            this.saveData();
            this.updateBudgetSection();
            this.showNotification('Budget deleted successfully!', 'success');
        }
    }

    // Goal Management
    addGoal() {
        const title = document.getElementById('goalTitle').value;
        const targetAmount = parseFloat(document.getElementById('goalAmount').value);
        const currentAmount = parseFloat(document.getElementById('goalCurrentAmount').value) || 0;
        const targetDate = document.getElementById('goalTargetDate').value;
        const description = document.getElementById('goalDescription').value;

        if (!title || !targetAmount || !targetDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const goal = {
            id: Date.now(),
            title: title,
            targetAmount: targetAmount,
            currentAmount: currentAmount,
            targetDate: targetDate,
            description: description,
            createdAt: new Date().toISOString()
        };

        this.goals.push(goal);
        this.saveData();
        this.hideModal('goalModal');
        this.updateGoalsSection();
        this.showNotification('Goal created successfully!', 'success');
    }

    updateGoalProgress(goalId, amount) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
            this.saveData();
            this.updateGoalsSection();
        }
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.saveData();
            this.updateGoalsSection();
            this.showNotification('Goal deleted successfully!', 'success');
        }
    }

    // Category Management
    addCategory() {
        const name = document.getElementById('newCategoryName').value;
        const type = document.getElementById('newCategoryType').value;

        if (!name || !type) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const category = {
            id: Date.now(),
            name: name,
            type: type,
            color: this.getRandomColor()
        };

        this.categories.push(category);
        this.saveData();
        this.updateSettingsSection();
        this.populateCategoryOptions();
        this.showNotification('Category added successfully!', 'success');

        // Clear form
        document.getElementById('newCategoryName').value = '';
    }

    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category? This will affect all related transactions.')) {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.transactions = this.transactions.filter(t => t.categoryId !== categoryId);
            this.budgets = this.budgets.filter(b => b.categoryId !== categoryId);
            this.saveData();
            this.updateSettingsSection();
            this.populateCategoryOptions();
            this.updateDashboard();
            this.showNotification('Category deleted successfully!', 'success');
        }
    }

    getRandomColor() {
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Data Population
    populateCategoryOptions() {
        const categorySelects = document.querySelectorAll('#transactionCategory, #budgetCategory');
        
        categorySelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Category</option>';
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                option.dataset.type = category.type;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        });
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateSummaryCards();
        this.updateRecentTransactions();
        this.updateCharts();
    }

    updateSummaryCards() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter transactions for current month
        const monthlyTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;
        const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expenses);
        document.getElementById('netBalance').textContent = this.formatCurrency(balance);
        document.getElementById('savingsRate').textContent = `${savingsRate}%`;

        // Update budget overview
        this.updateBudgetOverview();
    }

    updateBudgetOverview() {
        const totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyExpenses = this.transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        const remainingBudget = totalBudget - monthlyExpenses;

        document.getElementById('totalBudget').textContent = this.formatCurrency(totalBudget);
        document.getElementById('totalSpent').textContent = this.formatCurrency(monthlyExpenses);
        document.getElementById('remainingBudget').textContent = this.formatCurrency(remainingBudget);
    }

    updateRecentTransactions() {
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const container = document.getElementById('recentTransactionsList');
        container.innerHTML = '';

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No transactions yet</p>';
            return;
        }

        recentTransactions.forEach(transaction => {
            const category = this.categories.find(c => c.id === transaction.categoryId);
            const transactionElement = this.createTransactionElement(transaction, category);
            container.appendChild(transactionElement);
        });
    }

    createTransactionElement(transaction, category) {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        
        const iconClass = transaction.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const categoryName = category ? category.name : 'Unknown';
        const categoryColor = category ? category.color : '#6b7280';

        div.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon" style="background-color: ${categoryColor}20; color: ${categoryColor}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${categoryName} • ${this.formatDate(transaction.date)}</p>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
            </div>
        `;

        return div;
    }

    // Chart Management
    initializeCharts() {
        this.createMonthlyChart();
        this.createCategoryChart();
    }

    updateCharts() {
        this.updateMonthlyChart();
        this.updateCategoryChart();
    }

    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    updateMonthlyChart() {
        if (!this.charts.monthly) return;

        const last6Months = this.getLast6Months();
        const monthlyData = this.getMonthlyData(last6Months);

        this.charts.monthly.data.labels = last6Months.map(month => 
            new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        );
        this.charts.monthly.data.datasets[0].data = monthlyData.income;
        this.charts.monthly.data.datasets[1].data = monthlyData.expenses;
        this.charts.monthly.update();
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    updateCategoryChart() {
        if (!this.charts.category) return;

        const categoryData = this.getCategoryData();
        
        this.charts.category.data.labels = categoryData.labels;
        this.charts.category.data.datasets[0].data = categoryData.data;
        this.charts.category.data.datasets[0].backgroundColor = categoryData.colors;
        this.charts.category.update();
    }

    // Analytics
    updateAnalytics() {
        this.createTrendChart();
        this.createAnalyticsCategoryChart();
        this.createMonthlyComparisonChart();
        this.createSpendingPatternChart();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createAnalyticsCategoryChart() {
        const ctx = document.getElementById('analyticsCategoryChart').getContext('2d');
        this.charts.analyticsCategory = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Amount',
                    data: [],
                    backgroundColor: '#6366f1',
                    borderRadius: 4
                }]
            },
            options: {


                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    createMonthlyComparisonChart() {
        const ctx = document.getElementById('monthlyComparisonChart').getContext('2d');
        this.charts.monthlyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'This Month',
                    data: [],
                    backgroundColor: '#6366f1'
                }, {
                    label: 'Last Month',
                    data: [],
                    backgroundColor: '#94a3b8'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    createSpendingPatternChart() {
        const ctx = document.getElementById('spendingPatternChart').getContext('2d');
        this.charts.spendingPattern = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Spending Pattern',
                    data: [],
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Data Helpers
    getLast6Months() {
        const months = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(date);
        }
        
        return months;
    }

    getMonthlyData(months) {
        const income = [];
        const expenses = [];

        months.forEach(month => {
            const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
            const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

            const monthTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= monthStart && transactionDate <= monthEnd;
            });

            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthExpenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            income.push(monthIncome);
            expenses.push(monthExpenses);
        });

        return { income, expenses };
    }

    getCategoryData() {
        const categoryTotals = {};
        
        this.transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const category = this.categories.find(c => c.id === transaction.categoryId);
                if (category) {
                    if (!categoryTotals[category.name]) {
                        categoryTotals[category.name] = {
                            amount: 0,
                            color: category.color
                        };
                    }
                    categoryTotals[category.name].amount += transaction.amount;
                }
            }
        });

        const labels = Object.keys(categoryTotals);
        const data = labels.map(label => categoryTotals[label].amount);
        const colors = labels.map(label => categoryTotals[label].color);

        return { labels, data, colors };
    }

    // Table Updates
    updateTransactionsTable() {
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '';

        if (this.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No transactions found</td></tr>';
            return;
        }

        const filteredTransactions = this.getFilteredTransactions();
        
        filteredTransactions.forEach(transaction => {
            const category = this.categories.find(c => c.id === transaction.categoryId);
            const row = this.createTransactionRow(transaction, category);
            tbody.appendChild(row);
        });
    }

    getFilteredTransactions() {
        let filtered = [...this.transactions];

        // Search filter
        const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm) ||
                (this.categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm))
            );
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter').value;
        if (categoryFilter) {
            filtered = filtered.filter(t => t.categoryId === parseInt(categoryFilter));
        }

        // Type filter
        const typeFilter = document.getElementById('typeFilter').value;
        if (typeFilter) {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    createTransactionRow(transaction, category) {
        const row = document.createElement('tr');
        
        const categoryName = category ? category.name : 'Unknown';
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const amountPrefix = transaction.type === 'income' ? '+' : '-';

        row.innerHTML = `
            <td>${this.formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>${categoryName}</td>
            <td><span class="badge ${transaction.type}">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span></td>
            <td class="${amountClass}">${amountPrefix}${this.formatCurrency(transaction.amount)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="financeTracker.deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        return row;
    }

    filterTransactions() {
        this.updateTransactionsTable();
    }

    // Budget Section
    updateBudgetSection() {
        this.updateBudgetCategories();
        this.populateCategoryOptions();
    }

    updateBudgetCategories() {
        const container = document.getElementById('budgetCategoriesList');
        container.innerHTML = '';

        if (this.budgets.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No budgets set</p>';
            return;
        }

        this.budgets.forEach(budget => {
            const category = this.categories.find(c => c.id === budget.categoryId);
            if (!category) return;

            const spent = this.getCategorySpent(category.id);
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = spent > budget.amount;

            const budgetElement = document.createElement('div');
            budgetElement.className = 'budget-category';
            budgetElement.innerHTML = `
                <div class="category-header">
                    <div class="category-name">${category.name}</div>
                    <div class="category-amount">${this.formatCurrency(budget.amount)}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${isOverBudget ? 'over-budget' : ''}" 
                         style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="progress-info">
                    <span>Spent: ${this.formatCurrency(spent)}</span>
                    <span>${percentage.toFixed(1)}%</span>
                </div>
                <div class="budget-actions">
                    <button class="btn btn-sm btn-danger" onclick="financeTracker.deleteBudget(${budget.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(budgetElement);
        });
    }

    getCategorySpent(categoryId) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return this.transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.categoryId === categoryId && 
                       t.type === 'expense' &&
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // Goals Section
    updateGoalsSection() {
        const container = document.getElementById('goalsList');
        container.innerHTML = '';

        if (this.goals.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No goals set</p>';
            return;
        }

        this.goals.forEach(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            const goalElement = document.createElement('div');
            goalElement.className = 'goal-card';
            goalElement.innerHTML = `
                <div class="goal-header">
                    <div>
                        <div class="goal-title">${goal.title}</div>
                        <div class="goal-amount">${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)}</div>
                    </div>
                </div>
                <div class="goal-progress">
                    <div class="progress-circle" style="background: conic-gradient(#6366f1 ${progress * 3.6}deg, #e5e7eb 0deg)">
                        <div class="progress-percentage">${progress.toFixed(0)}%</div>
                    </div>
                </div>
                <div class="goal-details">
                    <div class="goal-detail">
                        <div class="goal-detail-label">Target Date</div>
                        <div class="goal-detail-value">${this.formatDate(goal.targetDate)}</div>
                    </div>
                    <div class="goal-detail">
                        <div class="goal-detail-label">Days Left</div>
                        <div class="goal-detail-value">${Math.max(0, daysLeft)}</div>
                    </div>
                    <div class="goal-detail">
                        <div class="goal-detail-label">Remaining</div>
                        <div class="goal-detail-value">${this.formatCurrency(goal.targetAmount - goal.currentAmount)}</div>
                    </div>
                </div>
                ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                <div class="goal-actions">
                    <button class="btn btn-sm btn-primary" onclick="financeTracker.updateGoalProgress(${goal.id}, 100)">
                        <i class="fas fa-plus"></i> Add ₹100
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="financeTracker.deleteGoal(${goal.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(goalElement);
        });
    }

    // Settings Section
    updateSettingsSection() {
        this.updateCategoriesList();
        this.updateSettingsValues();
    }

    updateCategoriesList() {
        const container = document.getElementById('categoriesList');
        container.innerHTML = '';

        this.categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            categoryElement.innerHTML = `
                <div class="category-info">
                    <div class="category-color" style="background-color: ${category.color}"></div>
                    <div>
                        <div class="category-name">${category.name}</div>
                        <div class="category-type">${category.type}</div>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger" onclick="financeTracker.deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(categoryElement);
        });
    }

    updateSettingsValues() {
        document.getElementById('currency').value = this.settings.currency;
        document.getElementById('dateFormat').value = this.settings.dateFormat;
    }

    // Data Export/Import
    exportData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            categories: this.categories,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-track-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.transactions = data.transactions || [];
                        this.budgets = data.budgets || [];
                        this.goals = data.goals || [];
                        this.categories = data.categories || [];
                        this.settings = { ...this.settings, ...data.settings };
                        
                        this.saveData();
                        this.updateDashboard();
                        this.showNotification('Data imported successfully!', 'success');
                    } catch (error) {
                        this.showNotification('Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.transactions = [];
            this.budgets = [];
            this.goals = [];
            this.categories = [];
            this.settings = {
                currency: 'INR',
                dateFormat: 'DD/MM/YYYY',
                theme: 'light'
            };
            
            this.saveData();
            this.updateDashboard();
            this.showNotification('All data cleared successfully!', 'success');
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        const currencySymbols = {
            'INR': '₹',
            'EUR': '€',
            'GBP': '£',
            'USD': '$'
        };
        
        const symbol = currencySymbols[this.settings.currency] || '$';
        return `${symbol}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const format = this.settings.dateFormat;
        
        switch (format) {
            case 'MM/DD/YYYY':
                return date.toLocaleDateString('en-US');
            case 'DD/MM/YYYY':
                return date.toLocaleDateString('en-GB');
            case 'YYYY-MM-DD':
                return date.toISOString().split('T')[0];
            default:
                return date.toLocaleDateString('en-US');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${icons[type]}"></i>
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-message">${message}</div>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }
}

// Initialize the application
const financeTracker = new FinanceTracker();

// Add some sample data for demonstration
if (financeTracker.transactions.length === 0) {
    // Add sample transactions
    const sampleTransactions = [
        {
            id: 1,
            type: 'income',
            amount: 5000,
            description: 'Monthly Salary',
            categoryId: 1,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            type: 'expense',
            amount: 1200,
            description: 'Rent Payment',
            categoryId: 8,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            type: 'expense',
            amount: 300,
            description: 'Grocery Shopping',
            categoryId: 4,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            type: 'expense',
            amount: 150,
            description: 'Gas Station',
            categoryId: 5,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            type: 'income',
            amount: 800,
            description: 'Freelance Project',
            categoryId: 2,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        }
    ];

    financeTracker.transactions = sampleTransactions;
    financeTracker.saveData();
    financeTracker.updateDashboard();
}

// Add some sample budgets
if (financeTracker.budgets.length === 0) {
    const sampleBudgets = [
        {
            id: 1,
            categoryId: 4,
            amount: 500,
            period: 'monthly',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            categoryId: 5,
            amount: 200,
            period: 'monthly',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            categoryId: 6,
            amount: 300,
            period: 'monthly',
            createdAt: new Date().toISOString()
        }
    ];

    financeTracker.budgets = sampleBudgets;
    financeTracker.saveData();
}

// Add some sample goals
if (financeTracker.goals.length === 0) {
    const sampleGoals = [
        {
            id: 1,
            title: 'Emergency Fund',
            targetAmount: 10000,
            currentAmount: 2500,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: 'Build an emergency fund for unexpected expenses',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Vacation Fund',
            targetAmount: 3000,
            currentAmount: 800,
            targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: 'Save for a dream vacation',
            createdAt: new Date().toISOString()
        }
    ];

    financeTracker.goals = sampleGoals;
    financeTracker.saveData();
}

// Initialize the application with sample data
financeTracker.updateDashboard();
financeTracker.updateTransactionsTable();
financeTracker.updateBudgetSection();
financeTracker.updateGoalsSection();
financeTracker.updateSettingsSection();

// Add CSS for badges
const style = document.createElement('style');
style.textContent = `
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }
    
    .badge.income {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }
    
    .badge.expense {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
    
    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    .text-muted {
        color: #6b7280;
    }
`;
document.head.appendChild(style);
