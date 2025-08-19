// 全局脚本

// 页面滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '20px 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 菜单高亮
function highlightMenu() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href').substring(1) === current) {
            link.style.color = '#4299e1';
        }
    });
}

window.addEventListener('scroll', highlightMenu);

// 文档页面交互
function setupDocsPage() {
    const docsLinks = document.querySelectorAll('.docs-sidebar a');
    
    if (docsLinks.length > 0) {
        // 设置当前页面的活动链接
        const currentPath = window.location.pathname;
        docsLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
        
        // 文档内容切换
        docsLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 移除所有活动状态
                docsLinks.forEach(l => l.classList.remove('active'));
                
                // 添加当前活动状态
                this.classList.add('active');
                
                // 加载相应内容（在实际应用中可能是异步加载）
                const href = this.getAttribute('href');
                window.location.href = href;
            });
        });
    }
}

// 下载按钮点击统计
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const version = this.getAttribute('data-version');
            // 在实际应用中，这里可以发送统计请求
            console.log(`Downloading version: ${version}`);
        });
    });
}

// 页面加载完成后执行
window.addEventListener('load', function() {
    setupDocsPage();
    setupDownloadButtons();
    
    // 添加页面进入动画
    const fadeElements = document.querySelectorAll('.hero, .features, .showcase, .tech-stack, .download-section');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// 图片加载错误处理
function setupImageErrorHandlers() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'assets/placeholder.png';
            this.alt = '图片加载失败';
        });
    });
}

// 表单提交处理
function setupFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 在实际应用中，这里会处理表单提交逻辑
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Form submitted:', data);
            
            // 显示成功消息
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = '提交成功！';
            
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                this.reset();
            }, 2000);
        });
    });
}

// 资源加载器
function ResourceLoader() {
    this.loaded = 0;
    this.total = 0;
    this.callbacks = [];
}

ResourceLoader.prototype.add = function(url, type) {
    this.total++;
    
    return new Promise((resolve, reject) => {
        if (type === 'image') {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.loaded++;
                this.updateProgress();
                resolve(img);
            };
            img.onerror = reject;
        } else if (type === 'script') {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                this.loaded++;
                this.updateProgress();
                resolve(script);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        } else if (type === 'stylesheet') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => {
                this.loaded++;
                this.updateProgress();
                resolve(link);
            };
            link.onerror = reject;
            document.head.appendChild(link);
        }
    });
};

ResourceLoader.prototype.updateProgress = function() {
    const progress = (this.loaded / this.total) * 100;
    this.callbacks.forEach(callback => callback(progress));
    
    if (this.loaded === this.total) {
        this.callbacks.forEach(callback => {
            if (typeof callback === 'function' && callback.onComplete) {
                callback.onComplete();
            }
        });
    }
};

ResourceLoader.prototype.onProgress = function(callback) {
    this.callbacks.push(callback);
};

// 导出函数以便在其他脚本中使用
if (typeof window !== 'undefined') {
    window.ResourceLoader = ResourceLoader;
}

// 主题切换功能
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = '🌙';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.border = 'none';
    themeToggle.style.backgroundColor = '#4299e1';
    themeToggle.style.color = 'white';
    themeToggle.style.fontSize = '1.5rem';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    themeToggle.style.zIndex = '999';
    themeToggle.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            this.textContent = '☀️';
            document.body.style.backgroundColor = '#1a202c';
            document.body.style.color = 'white';
        } else {
            this.textContent = '🌙';
            document.body.style.backgroundColor = '#f5f5f5';
            document.body.style.color = '#333';
        }
    });
}