// إعدادات Supabase
console.log('🚀 بدء تحميل supabase-service.js...');

const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDY1ODMsImV4cCI6MjA3MTA4MjU4M30.J_bb8_J3eYW5XQ2D3oXLId8bHO4vYW5j9ZwdtUlZ0CA';

// تهيئة العميل
let supabaseClient;

// إنشاء window.supabaseService مباشرة
window.supabaseService = {
    // وظائف أساسية
    checkSession: function() {
        const userSession = localStorage.getItem('userSession');
        return {
            hasSession: !!userSession,
            user: userSession ? JSON.parse(userSession) : null,
            timestamp: new Date().toISOString()
        };
    },
    
    signInUser: function(username, password) {
        console.log('🔐 محاولة تسجيل الدخول:', username);
        return { success: true, message: 'تم تسجيل الدخول' };
    },
    
    signOutUser: function() {
        console.log('🚪 تسجيل الخروج...');
        localStorage.removeItem('userSession');
        return { success: true, message: 'تم تسجيل الخروج' };
    },
    
    logEvent: function(eventName, parameters = {}) {
        console.log('📊 تسجيل الحدث:', eventName, parameters);
    },
    
    // الدوال الرئيسية - سيتم تحديثها
    getBranch: null,
    getAllBranches: null,
    updateBranch: null,
    createUpdateRequest: null,
    approveUpdateRequest: null,
    rejectUpdateRequest: null,
    getPendingRequests: null,
    checkPendingRequestsForBranch: null
};

// جلب بيانات فرع محدد من Supabase
async function getBranch(branchId) {
    try {
        console.log('🔍 جلب بيانات الفرع:', branchId);
        
        if (!supabaseClient) {
            console.error('❌ Supabase client غير متوفر');
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .eq('branch_id', branchId)
            .single();
        
        if (error) {
            console.error('❌ خطأ في قاعدة البيانات:', error);
            return { success: false, error: error.message };
        }

        if (data) {
            console.log('✅ تم العثور على الفرع:', data.branch_name);
            return { success: true, data: data };
        } else {
            console.log('⚠️ الفرع غير موجود:', branchId);
            return { success: false, error: 'الفرع غير موجود' };
        }
        
    } catch (error) {
        console.error('❌ خطأ في getBranch:', error);
        return { success: false, error: error.message };
    }
}

// جلب جميع الفروع
async function getAllBranches() {
    try {
        console.log('📋 جلب جميع الفروع...');
        
        if (!supabaseClient) {
            console.error('❌ Supabase client غير متوفر');
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .order('branch_name');
        
        if (error) {
            console.error('❌ خطأ في قاعدة البيانات:', error);
            return { success: false, error: error.message };
        }

        console.log(`✅ تم جلب ${data.length} فرع`);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('❌ خطأ في getAllBranches:', error);
        return { success: false, error: error.message };
    }
}

// تحديث بيانات فرع
async function updateBranch(branchId, updateData) {
    try {
        console.log('🔄 تحديث بيانات الفرع:', branchId);
        
        if (!supabaseClient) {
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        const { data, error } = await supabaseClient
            .from('branches')
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('branch_id', branchId);

        if (error) {
            console.error('❌ خطأ في التحديث:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ تم تحديث الفرع بنجاح');
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في updateBranch:', error);
        return { success: false, error: error.message };
    }
}

// إنشاء طلب تحديث
async function createUpdateRequest(branchId, requestData) {
    try {
        console.log('🚀 إنشاء طلب تحديث للفرع:', branchId);
        
        if (!supabaseClient) {
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        const request = {
            branch_id: branchId,
            request_data: JSON.stringify(requestData),
            status: 'pending',
            requested_at: new Date().toISOString()
        };

        const { data, error } = await supabaseClient
            .from('update_requests')
            .insert([request])
            .select();

        if (error) {
            console.error('❌ خطأ في إنشاء الطلب:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ تم إنشاء طلب التحديث');
        return { success: true, requestId: data[0].id };
        
    } catch (error) {
        console.error('❌ خطأ في createUpdateRequest:', error);
        return { success: false, error: error.message };
    }
}

// موافقة على طلب تحديث
async function approveUpdateRequest(requestId) {
    try {
        console.log('✅ موافقة على الطلب:', requestId);
        
        if (!supabaseClient) {
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        // جلب الطلب أولاً
        const { data: requestData, error: fetchError } = await supabaseClient
            .from('update_requests')
            .select('*')
            .eq('id', requestId)
            .single();
        
        if (fetchError || !requestData) {
            return { success: false, error: 'الطلب غير موجود' };
        }

        // تطبيق التحديث
        const updatedData = JSON.parse(requestData.request_data);
        const updateResult = await updateBranch(requestData.branch_id, updatedData.newData || updatedData);
        
        if (!updateResult.success) {
            return { success: false, error: 'فشل في تطبيق التحديث' };
        }
        
        // تحديث حالة الطلب
        const { error: updateError } = await supabaseClient
            .from('update_requests')
            .update({
                status: 'approved',
                approved_at: new Date().toISOString()
            })
            .eq('id', requestId);

        if (updateError) {
            return { success: false, error: updateError.message };
        }
        
        console.log('✅ تم اعتماد الطلب بنجاح');
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في approveUpdateRequest:', error);
        return { success: false, error: error.message };
    }
}

// رفض طلب تحديث
async function rejectUpdateRequest(requestId, reason = '') {
    try {
        console.log('❌ رفض الطلب:', requestId);
        
        if (!supabaseClient) {
            return { success: false, error: 'قاعدة البيانات غير متصلة' };
        }
        
        const { error } = await supabaseClient
            .from('update_requests')
            .update({
                status: 'rejected',
                rejected_at: new Date().toISOString(),
                rejection_reason: reason
            })
            .eq('id', requestId);

        if (error) {
            return { success: false, error: error.message };
        }
        
        console.log('✅ تم رفض الطلب');
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في rejectUpdateRequest:', error);
        return { success: false, error: error.message };
    }
}

// جلب الطلبات المعلقة
async function getPendingRequests() {
    try {
        console.log('📋 جلب الطلبات المعلقة...');
        
        if (!supabaseClient) {
            return [];
        }
        
        const { data, error } = await supabaseClient
            .from('update_requests')
            .select('*')
            .eq('status', 'pending')
            .order('requested_at', { ascending: false });

        if (error) {
            console.error('❌ خطأ في جلب الطلبات:', error);
            return [];
        }
        
        console.log(`✅ تم جلب ${data.length} طلب معلق`);
        return data || [];
        
    } catch (error) {
        console.error('❌ خطأ في getPendingRequests:', error);
        return [];
    }
}

// فحص الطلبات المعلقة لفرع
async function checkPendingRequestsForBranch(branchId) {
    try {
        console.log('🔍 فحص الطلبات المعلقة للفرع:', branchId);
        
        if (!supabaseClient) {
            return { hasPendingRequest: false, latestRequest: null };
        }
        
        const { data, error } = await supabaseClient
            .from('update_requests')
            .select('*')
            .eq('branch_id', branchId)
            .eq('status', 'pending')
            .order('requested_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('❌ خطأ في فحص الطلبات:', error);
            return { hasPendingRequest: false, latestRequest: null };
        }
        
        const hasPendingRequest = data && data.length > 0;
        return {
            hasPendingRequest: hasPendingRequest,
            latestRequest: hasPendingRequest ? data[0] : null
        };
        
    } catch (error) {
        console.error('❌ خطأ في checkPendingRequestsForBranch:', error);
        return { hasPendingRequest: false, latestRequest: null };
    }
}

// تحميل Supabase SDK
async function loadSupabase() {
    try {
        console.log('🔄 تحميل Supabase SDK...');
        
        // تحميل Supabase من CDN
        if (typeof window.supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
            
            // انتظار قليل للتأكد من التحميل
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // إنشاء العميل
        if (typeof window.supabase !== 'undefined') {
            supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
            console.log('✅ تم إنشاء Supabase client');
            
            // ربط الدوال
            window.supabaseService.getBranch = getBranch;
            window.supabaseService.getAllBranches = getAllBranches;
            window.supabaseService.updateBranch = updateBranch;
            window.supabaseService.createUpdateRequest = createUpdateRequest;
            window.supabaseService.approveUpdateRequest = approveUpdateRequest;
            window.supabaseService.rejectUpdateRequest = rejectUpdateRequest;
            window.supabaseService.getPendingRequests = getPendingRequests;
            window.supabaseService.checkPendingRequestsForBranch = checkPendingRequestsForBranch;
            
            console.log('✅ تم ربط جميع الدوال بـ window.supabaseService');
            console.log('📋 الدوال المتاحة:', Object.keys(window.supabaseService).filter(key => typeof window.supabaseService[key] === 'function'));
            
        } else {
            throw new Error('فشل في تحميل Supabase SDK');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل Supabase:', error);
        throw error;
    }
}

// بدء التحميل عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSupabase);
} else {
    loadSupabase();
}

// إضافة fallback للتأكد
setTimeout(() => {
    if (!window.supabaseService.getBranch) {
        console.log('🔄 إعادة محاولة تحميل Supabase...');
        loadSupabase().catch(console.error);
    }
}, 1000);

console.log('📝 تم تحميل supabase-service.js المحسن');
