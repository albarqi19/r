// تكوين Firebase (سيتم إضافة المفاتيح لاحقاً)
const firebaseConfig = {
    // سيتم إضافة إعدادات Firebase هنا
    apiKey: "your-api-key",
    authDomain: "tahfeez-sharqiya.firebaseapp.com",
    databaseURL: "https://tahfeez-sharqiya-default-rtdb.firebaseio.com",
    projectId: "tahfeez-sharqiya",
    storageBucket: "tahfeez-sharqiya.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// بيانات الفروع المؤقتة (قبل Firebase)
const branchesData = {
    'garb-dammam': {
        name: 'غرب الدمام',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'sharq-dammam': {
        name: 'شرق الدمام',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'rafeia': {
        name: 'الرفيعة',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'baqiq': {
        name: 'بقيق',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'anak': {
        name: 'عنك',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'wadi-almiyah': {
        name: 'وادي المياه',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'khobar': {
        name: 'الخبر',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'sarrar': {
        name: 'الصرار',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'ras-tanura': {
        name: 'رأس تنورة',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'qarya': {
        name: 'قرية',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    },
    'taaeriya': {
        name: 'التعيرية',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        status: 'active'
    }
};

// وظائف إدارة البيانات
class BranchManager {
    constructor() {
        this.currentBranch = this.getBranchFromURL();
        this.init();
    }
    
    // استخراج معرف الفرع من المسار
    getBranchFromURL() {
        const pathParts = window.location.pathname.split('/');
        // البحث عن معرف الفرع في المسار
        for (let i = 0; i < pathParts.length; i++) {
            if (branchesData[pathParts[i]]) {
                return pathParts[i];
            }
        }
        return null;
    }
    
    // تحميل بيانات الفرع
    async loadBranchData(branchId = null) {
        const id = branchId || this.currentBranch;
        
        if (!id || !branchesData[id]) {
            console.error('فرع غير موجود:', id);
            return null;
        }
        
        // في المستقبل، سيتم جلب البيانات من Firebase
        // const snapshot = await database.ref(`branches/${id}`).once('value');
        // return snapshot.val();
        
        return branchesData[id];
    }
    
    // تحديث بيانات الصفحة
    async updatePageData() {
        if (!this.currentBranch) return;
        
        const data = await this.loadBranchData();
        if (!data) return;
        
        // تحديث اسم الفرع
        const branchNameElements = document.querySelectorAll('.branch-name');
        branchNameElements.forEach(element => {
            element.textContent = data.name;
        });
        
        // تحديث عنوان الصفحة
        document.title = `تحفيظ الشرقية - ${data.name}`;
        
        // تحديث الروابط
        this.updateSocialLinks(data);
        
        console.log('تم تحميل بيانات الفرع:', data.name);
    }
    
    // تحديث روابط التواصل الاجتماعي
    updateSocialLinks(data) {
        // تويتر
        const twitterLink = document.querySelector('a[href*="x.com"], a[href*="twitter.com"]');
        if (twitterLink && data.twitter) {
            twitterLink.href = data.twitter;
        }
        
        // واتساب
        const whatsappLink = document.querySelector('a[href*="wa.me"]');
        if (whatsappLink && data.whatsapp) {
            whatsappLink.href = `https://wa.me/${data.whatsapp}`;
        }
        
        // إنستغرام
        const instagramLink = document.querySelector('a[href*="instagram.com"]');
        if (instagramLink && data.instagram) {
            instagramLink.href = data.instagram;
        }
        
        // الموقع الجغرافي
        const locationLink = document.querySelector('a[href*="maps"]');
        if (locationLink && data.location) {
            locationLink.href = data.location;
        }
    }
    
    // تهيئة النظام
    async init() {
        if (this.currentBranch) {
            await this.updatePageData();
        }
    }
}

// وظائف عامة
const utils = {
    // عرض رسالة نجاح
    showSuccess(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    // عرض رسالة خطأ
    showError(message, duration = 4000) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة مدير الفروع
    window.branchManager = new BranchManager();
    
    console.log('تم تحميل نظام إدارة الفروع');
});
