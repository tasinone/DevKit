// Determine the correct path based on current location
const isInSubfolder = window.location.pathname.includes('/tools/');
const basePath = isInSubfolder ? '../' : '';

// Load Header
fetch(`${basePath}header.html`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.text();
  })
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
    new ThemeManager();      // Initialize Theme after header loads
    new MobileMenu();        // Initialize mobile menu
    new LogoManager();       // Initialize logo manager
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// Load Footer
fetch(`${basePath}footer.html`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.text();
  })
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.themeKey = 'theme-preference';
    this.currentTheme = this.getStoredTheme();
    this.init();
  }

  getStoredTheme() {
    return localStorage.getItem(this.themeKey) || 'auto';
  }

  storeTheme(theme) {
    localStorage.setItem(this.themeKey, theme);
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme() {
    let appliedTheme;

    if (this.currentTheme === 'auto') {
      appliedTheme = this.getSystemTheme();
    } else {
      appliedTheme = this.currentTheme;
    }

    document.documentElement.setAttribute('data-theme', appliedTheme);
    this.updateThemeIcon(appliedTheme);
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();

    if (this.currentTheme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyTheme();
      });
    }
  }

  setupEventListeners() {
    const toggles = ['theme-toggle', 'mobile-theme-toggle'];
    toggles.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.toggleTheme());
    });
  }

  toggleTheme() {
    // Step out of 'auto' mode into light or dark
    if (this.currentTheme === 'auto') {
      this.currentTheme = this.getSystemTheme() === 'dark' ? 'light' : 'dark';
    } else {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    }

    this.storeTheme(this.currentTheme);
    this.applyTheme();
  }

  updateThemeIcon(appliedTheme) {
    const isLight = appliedTheme === 'light';
    const themeButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');

    const moonIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" class="icon">
        <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/>
      </svg>`;

    const sunIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="icon">
        <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/>
      </svg>`;

    // Show sun in light mode, moon in dark mode
    themeButtons.forEach(button => {
      button.innerHTML = isLight ? sunIcon : moonIcon;
    });
  }
}

// Mobile Menu Class
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.mobileMenu) return;

    this.menuToggle.addEventListener('click', () => this.toggleMenu());

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.menuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.mobileMenu.classList.toggle('active');
  }

  closeMenu() {
    this.mobileMenu.classList.remove('active');
  }
}

// Logo management
class LogoManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Check if logo.png exists
            const response = await fetch('assets/logo.png', { method: 'HEAD' });
            if (response.ok) {
                this.loadLogo();
            }
        } catch (error) {
            // Logo doesn't exist, keep text
            console.log('Logo not found, using text');
        }
    }

    loadLogo() {
        const logoText = document.getElementById('logo-text');
        if (logoText) {
            logoText.innerHTML = '<img src="assets/logo.png" alt="DevKit" /> DevKit';
        }
    }
}

// Handle navigation clicks
// Remove this code while adding these pages.
// document.addEventListener('click', (e) => {
//     if (e.target.matches('a[href^="#"]')) {
//         e.preventDefault();
//         const targetId = e.target.getAttribute('href').slice(1);
        
//         // Handle special navigation items
//         switch (targetId) {
//             case 'about':
//                 alert('About page - Add your about content here');
//                 break;
//             case 'contact':
//                 alert('Contact page - Add your contact information here');
//                 break;
//             case 'sitemap':
//                 alert('Sitemap page - Add your sitemap here');
//                 break;
//         }
//     }
// });

// Prevent direct access to tools directory
// if (window.location.pathname.includes('/tools/') && !document.referrer.includes(window.location.origin)) {
//     if (window.history.length > 1) {
//         window.history.back();
//     } else {
//         window.location.href = '/';
//     }
// }

// Display notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');
  notificationText.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}