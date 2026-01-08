// Theme toggle function
function toggleTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const body = document.body;
    
    // Toggle the checkbox state
    themeToggle.checked = !themeToggle.checked;
    
    if (themeToggle.checked) {
        body.classList.add('light-theme');
        themeLabel.textContent = 'تم روشن';
        localStorage.setItem('theme', 'light');
        console.log('تم روشن فعال شد');
    } else {
        body.classList.remove('light-theme');
        themeLabel.textContent = 'تم تاریک';
        localStorage.setItem('theme', 'dark');
        console.log('تم تاریک فعال شد');
    }
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const body = document.body;
    
    if (savedTheme === 'light') {
        themeToggle.checked = true;
        body.classList.add('light-theme');
        themeLabel.textContent = 'تم روشن';
        console.log('تم روشن از حافظه لود شد');
    } else {
        themeToggle.checked = false;
        body.classList.remove('light-theme');
        themeLabel.textContent = 'تم تاریک';
        console.log('تم تاریک از حافظه لود شد');
    }
    
    // Add event listener to the checkbox itself
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('light-theme');
            themeLabel.textContent = 'تم روشن';
            localStorage.setItem('theme', 'light');
            console.log('تم روشن فعال شد (از چک‌باکس)');
        } else {
            body.classList.remove('light-theme');
            themeLabel.textContent = 'تم تاریک';
            localStorage.setItem('theme', 'dark');
            console.log('تم تاریک فعال شد (از چک‌باکس)');
        }
    });
});

// Back to top button
const backTopBtn = document.getElementById('backTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backTopBtn.classList.add('show');
    } else {
        backTopBtn.classList.remove('show');
    }
});

backTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input-field');
const searchBtn = document.querySelector('.search-btn-main');

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        alert(`در حال جستجو برای: "${searchTerm}"`);
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Settings popup
const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPopup.classList.toggle('show');
});

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPopup.contains(e.target) && 
        !settingsBtn.contains(e.target) && 
        e.target !== settingsBtn) {
        settingsPopup.classList.remove('show');
    }
});

// Navigation
const navItems = document.querySelectorAll('.nav-menu-item');
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const content = this.getAttribute('data-content');
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show content section
        console.log(`بخش ${content} کلیک شد`);
        
        // Scroll to weblog section
        if (content === 'آموزش') {
            const weblogSection = document.querySelector('.section-weblog');
            weblogSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Footer subscription
const subBtn = document.querySelector('.sub-btn');
const subInput = document.querySelector('.sub-in');

subBtn.addEventListener('click', () => {
    const email = subInput.value.trim();
    if (email) {
        alert(`ایمیل ${email} با موفقیت ثبت شد`);
        subInput.value = '';
    } else {
        alert('لطفا ایمیل خود را وارد کنید');
    }
});

subInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        subBtn.click();
    }
});

// Weblog boxes hover effect
const weblogBoxes = document.querySelectorAll('.box-weblog');
weblogBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    box.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        alert(`باز کردن ${title}`);
    });
});

// Social links
const socialLinks = document.querySelectorAll('.soc-lnk');
socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className.split(' ')[1];
        alert(`باز کردن ${platfo}`);
    });
});

// Footer links
const footerLinks = document.querySelectorAll('.ftr-lnk');
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const linkText = this.textContent;
        console.log(`لینک ${linkText} کلیک شد`);
    });
});