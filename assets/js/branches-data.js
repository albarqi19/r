// بيانات جميع الفروع - يمكن تحديثها من مكان واحد
// ستعمل كـ fallback إذا لم يكن Firebase متاحاً
window.branchesData = {
    'garb-dammam': {
        id: 'garb-dammam',
        name: 'فرع غرب الدمام',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360356',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9?g_st=com.google.maps.preview.copy',
        email: 'garb@tahfeez-sharqiya.com',
        phone: '966138360356',
        store: null, // سيتم إضافته لاحقاً
        status: 'active',
        region: 'الدمام',
        established: '1388',
        manager: 'manager@garb.com'
    },
    
    'sharq-dammam': {
        id: 'sharq-dammam',
        name: 'فرع شرق الدمام',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360357',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'sharq@tahfeez-sharqiya.com',
        phone: '966138360357',
        store: null,
        status: 'active',
        region: 'الدمام',
        established: '1390',
        manager: 'manager@sharq.com'
    },
    
    'rafeia': {
        id: 'rafeia',
        name: 'فرع الرفيعة',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360358',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'rafeia@tahfeez-sharqiya.com',
        phone: '966138360358',
        store: null,
        status: 'active',
        region: 'الرفيعة',
        established: '1392',
        manager: 'manager@rafeia.com'
    },
    
    'baqiq': {
        id: 'baqiq',
        name: 'فرع بقيق',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360359',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'baqiq@tahfeez-sharqiya.com',
        phone: '966138360359',
        store: null,
        status: 'active',
        region: 'بقيق',
        established: '1394',
        manager: 'manager@baqiq.com'
    },
    
    'anak': {
        id: 'anak',
        name: 'فرع عنك',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360360',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'anak@tahfeez-sharqiya.com',
        phone: '966138360360',
        store: null,
        status: 'active',
        region: 'عنك',
        established: '1395',
        manager: 'manager@anak.com'
    },
    
    'wadi-almiyah': {
        id: 'wadi-almiyah',
        name: 'فرع وادي المياه',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360361',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'wadi@tahfeez-sharqiya.com',
        phone: '966138360361',
        store: null,
        status: 'active',
        region: 'وادي المياه',
        established: '1396',
        manager: 'manager@wadi.com'
    },
    
    'khobar': {
        id: 'khobar',
        name: 'فرع الخبر',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360362',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'khobar@tahfeez-sharqiya.com',
        phone: '966138360362',
        store: 'https://store.tahfeez-khobar.com', // مثال لمتجر جاهز
        status: 'active',
        region: 'الخبر',
        established: '1397',
        manager: 'manager@khobar.com'
    },
    
    'sarrar': {
        id: 'sarrar',
        name: 'فرع الصرار',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360363',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'sarrar@tahfeez-sharqiya.com',
        phone: '966138360363',
        store: null,
        status: 'active',
        region: 'الصرار',
        established: '1398',
        manager: 'manager@sarrar.com'
    },
    
    'ras-tanura': {
        id: 'ras-tanura',
        name: 'فرع رأس تنورة',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360364',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'ras-tanura@tahfeez-sharqiya.com',
        phone: '966138360364',
        store: null,
        status: 'active',
        region: 'رأس تنورة',
        established: '1399',
        manager: 'manager@ras-tanura.com'
    },
    
    'qarya': {
        id: 'qarya',
        name: 'فرع قرية',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360365',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'qarya@tahfeez-sharqiya.com',
        phone: '966138360365',
        store: null,
        status: 'active',
        region: 'قرية',
        established: '1400',
        manager: 'manager@qarya.com'
    },
    
    'taaeriya': {
        id: 'taaeriya',
        name: 'فرع التعيرية',
        twitter: 'https://x.com/Org2Qer',
        whatsapp: '966138360366',
        instagram: 'https://www.instagram.com/org2qer/',
        location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
        email: 'taaeriya@tahfeez-sharqiya.com',
        phone: '966138360366',
        store: null,
        status: 'active',
        region: 'التعيرية',
        established: '1401',
        manager: 'manager@taaeriya.com'
    }
};

// وظائف مساعدة للعمل مع بيانات الفروع
window.branchesHelpers = {
    
    // الحصول على بيانات فرع محدد
    getBranch: async function(branchId) {
        // محاولة جلب البيانات من Firebase أولاً
        if (window.firebaseService) {
            try {
                const result = await window.firebaseService.getBranch(branchId);
                if (result.success) {
                    return result.data;
                }
            } catch (error) {
                console.log('استخدام البيانات المحلية كبديل');
            }
        }
        
        // استخدام البيانات المحلية كبديل
        return window.branchesData[branchId] || null;
    },
    
    // الحصول على جميع الفروع النشطة
    getActiveBranches: async function() {
        // محاولة جلب البيانات من Firebase أولاً
        if (window.firebaseService) {
            try {
                const result = await window.firebaseService.getAllBranches();
                if (result.success) {
                    return Object.values(result.data).filter(branch => branch.status === 'active');
                }
            } catch (error) {
                console.log('استخدام البيانات المحلية كبديل');
            }
        }
        
        // استخدام البيانات المحلية كبديل
        return Object.values(window.branchesData).filter(branch => branch.status === 'active');
    },
    
    // الحصول على فروع بمنطقة معينة
    getBranchesByRegion: function(region) {
        return Object.values(window.branchesData).filter(branch => branch.region === region);
    },
    
    // البحث عن فرع بالاسم
    searchBranches: function(searchTerm) {
        const term = searchTerm.toLowerCase();
        return Object.values(window.branchesData).filter(branch => 
            branch.name.toLowerCase().includes(term) || 
            branch.region.toLowerCase().includes(term)
        );
    },
    
    // تحديث بيانات فرع (سيتم استخدامها مع Firebase)
    updateBranch: async function(branchId, updateData) {
        // محاولة التحديث في Firebase أولاً
        if (window.firebaseService) {
            try {
                const result = await window.firebaseService.updateBranch(branchId, updateData);
                if (result.success) {
                    // تحديث البيانات المحلية أيضاً
                    if (window.branchesData[branchId]) {
                        window.branchesData[branchId] = { 
                            ...window.branchesData[branchId], 
                            ...updateData 
                        };
                        localStorage.setItem('branchesData', JSON.stringify(window.branchesData));
                    }
                    console.log(`تم تحديث بيانات ${branchId} في Firebase`);
                    return true;
                }
            } catch (error) {
                console.log('فشل التحديث في Firebase، استخدام التخزين المحلي');
            }
        }
        
        // التحديث المحلي كبديل
        if (window.branchesData[branchId]) {
            window.branchesData[branchId] = { 
                ...window.branchesData[branchId], 
                ...updateData 
            };
            
            // حفظ في localStorage مؤقتاً
            localStorage.setItem('branchesData', JSON.stringify(window.branchesData));
            
            console.log(`تم تحديث بيانات ${branchId} محلياً`);
            return true;
        }
        return false;
    },
    
    // تحميل البيانات من localStorage (إن وجدت)
    loadLocalData: function() {
        const localData = localStorage.getItem('branchesData');
        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                window.branchesData = { ...window.branchesData, ...parsedData };
                console.log('تم تحميل البيانات المحلية');
            } catch (error) {
                console.error('خطأ في تحميل البيانات المحلية:', error);
            }
        }
    },
    
    // إنشاء رابط للفرع
    getBranchURL: function(branchId, baseURL = '') {
        if (!window.branchesData[branchId]) return null;
        return `${baseURL}/branch-template.html?branch=${branchId}`;
    },
    
    // التحقق من صحة بيانات الفرع
    validateBranchData: function(branchData) {
        const required = ['id', 'name', 'status'];
        const missing = required.filter(field => !branchData[field]);
        
        if (missing.length > 0) {
            console.error('حقول مطلوبة مفقودة:', missing);
            return false;
        }
        
        return true;
    }
};

// تحميل البيانات المحلية عند التهيئة
document.addEventListener('DOMContentLoaded', function() {
    window.branchesHelpers.loadLocalData();
    console.log('تم تحميل بيانات الفروع:', Object.keys(window.branchesData).length, 'فرع');
});
