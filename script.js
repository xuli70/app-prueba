// =================================
// APP BASE COOLIFY - JAVASCRIPT
// =================================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('? App Base Coolify cargada correctamente');
    
    // Initialize all components
    initThemeToggle();
    initTimeDisplay();
    initAnimations();
    initServiceWorker();
    initStatusCheck();
    
    // Show loaded message
    showNotification('? Aplicaci?n cargada correctamente', 'success');
});

// =================================
// THEME TOGGLE FUNCTIONALITY
// =================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    // Update toggle icon
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showNotification(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info');
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('svg path');
    
    if (theme === 'dark') {
        // Sun icon
        icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    } else {
        // Moon icon
        icon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
    }
}

// =================================
// TIME DISPLAY
// =================================
function initTimeDisplay() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        timestampElement.textContent = timeString;
    }
}

// =================================
// ANIMATIONS
// =================================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all cards
    document.querySelectorAll('.bg-white').forEach(card => {
        observer.observe(card);
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.bg-white').forEach(card => {
        card.classList.add('card-hover');
    });
}

// =================================
// SERVICE WORKER (PWA)
// =================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(error => {
                console.log('SW fall?:', error);
            });
    }
}

// =================================
// STATUS CHECK
// =================================
function initStatusCheck() {
    checkSystemStatus();
    setInterval(checkSystemStatus, 30000); // Check every 30 seconds
}

function checkSystemStatus() {
    // Simulate system status check
    const statusIndicator = document.querySelector('.animate-pulse');
    const statusText = statusIndicator?.closest('.text-center').querySelector('p');
    
    // Simulate random status
    const isOnline = Math.random() > 0.1; // 90% uptime simulation
    
    if (statusIndicator) {
        statusIndicator.className = `w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`;
    }
    
    if (statusText) {
        statusText.textContent = isOnline ? '? Activo y funcionando' : '? Verificando conexi?n';
    }
}

// =================================
// NOTIFICATIONS SYSTEM
// =================================
function showNotification(message, type = 'info') {
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">?</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        ${getNotificationStyles(type)}
    `;
    
    return notification;
}

function getNotificationStyles(type) {
    const styles = {
        success: 'background: linear-gradient(135deg, #10B981, #059669);',
        error: 'background: linear-gradient(135deg, #EF4444, #DC2626);',
        warning: 'background: linear-gradient(135deg, #F59E0B, #D97706);',
        info: 'background: linear-gradient(135deg, #3B82F6, #2563EB);'
    };
    
    return styles[type] || styles.info;
}

// Add CSS for notifications
const notificationCSS = `
    .notification.show {
        transform: translateX(0) !important;
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;

// Inject notification styles
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// =================================
// UTILITY FUNCTIONS
// =================================

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado al portapapeles', 'success');
    }).catch(() => {
        showNotification('Error al copiar', 'error');
    });
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// =================================
// API HELPERS
// =================================

// Simple fetch wrapper
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showNotification('Error de conexi?n', 'error');
        throw error;
    }
}

// =================================
// EVENT LISTENERS
// =================================

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement search functionality
        console.log('Search triggered');
    }
    
    // Ctrl/Cmd + D for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showNotification('Conexi?n restaurada', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Sin conexi?n a internet', 'warning');
});

// Handle errors globally
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('Ha ocurrido un error', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Error de aplicaci?n', 'error');
});

// =================================
// PERFORMANCE MONITORING
// =================================

// Simple performance monitoring
function measurePerformance() {
    if (performance.navigation) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`P?gina cargada en ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Carga lenta detectada');
        }
    }
}

// Measure performance when page loads
window.addEventListener('load', measurePerformance);

// =================================
// EXPORT FOR MODULES (if needed)
// =================================

// Make functions available globally if needed
window.AppBase = {
    showNotification,
    copyToClipboard,
    formatDate,
    debounce,
    storage,
    apiCall
};