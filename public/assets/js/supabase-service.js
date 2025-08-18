// إعدادات Supabase
console.log('🚀 بدء تحميل supabase-service.js...');

const supabaseUrl = 'https://aydtrypogxbqmvbqerce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZHRyeXBvZ3hicW12YnFlcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDY1ODMsImV4cCI6MjA3MTA4MjU4M30.J_bb8_J3eYW5XQ2D3oXLId8bHO4vYW5j9ZwdtUlZ0CA';

// تهيئة Supabase client
let supabaseClient;

// إنشاء window.supabaseService مباشرة لضمان توفره
window.supabaseService = {
    // وظيفة للتحقق السريع من الجلسة
    checkSession: function() {
        const userSession = localStorage.getItem('userSession');
        const currentBranch = localStorage.getItem('currentBranch');
        const userToken = localStorage.getItem('userToken');
        
        const result = {
            hasSession: !!userSession,
            user: userSession ? JSON.parse(userSession) : null,
            currentBranch: currentBranch,
            userToken: userToken,
            timestamp: new Date().toISOString()
        };
        
        console.log('🔍 supabase-service: فحص الجلسة:', result);
        return result;
    },
    
    // دوال بسيطة للتوافق
    signInUser: function(username, password) {
        console.log('🔐 محاولة تسجيل الدخول:', username);
        return { success: true, message: 'تم تسجيل الدخول' };
    },
    
    signOutUser: function() {
        console.log('🚪 تسجيل الخروج...');
        localStorage.removeItem('userSession');
        localStorage.removeItem('currentBranch');
        localStorage.removeItem('userToken');
        return { success: true, message: 'تم تسجيل الخروج' };
    },
    
    // placeholders للدوال الأخرى - سيتم تحديثها لاحقاً
    getAllBranches: null,
    getBranch: null,
    updateBranch: null,
    createUpdateRequest: null,
    approveUpdateRequest: null,
    rejectUpdateRequest: null,
    getPendingRequests: null,
    logEvent: function(eventName, parameters = {}) {
        console.log('📊 تسجيل الحدث:', eventName, parameters);
    },
    setupInitialData: null
};

console.log('📝 تم إنشاء window.supabaseService أولياً');

// تحميل مكتبة Supabase
function loadSupabase() {
    return new Promise((resolve, reject) => {
        // تحقق إذا كانت Supabase محملة بالفعل من HTML
        if (typeof window.supabase !== 'undefined') {
            console.log('🔍 Supabase محملة مسبقاً من HTML');
            initializeSupabase();
            resolve();
            return;
        }

        console.log('🔄 تحميل Supabase SDK من JavaScript...');
        
        // تحميل Supabase SDK
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('✅ تم تحميل مكتبة Supabase');
            setTimeout(() => {
                initializeSupabase();
                resolve();
            }, 100);
        };
        script.onerror = (error) => {
            console.error('❌ فشل تحميل مكتبة Supabase:', error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// تهيئة خدمات Supabase
function initializeSupabase() {
    try {
        console.log('🔥 بدء تهيئة Supabase...');
        
        // التحقق من وجود supabase
        if (typeof window.supabase === 'undefined') {
            throw new Error('Supabase SDK غير محملة');
        }
        
        // تهيئة العميل
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('✅ تم تهيئة Supabase Client');
        
        console.log('✅ تم تهيئة Supabase بنجاح');
        
        // إعداد مراقب حالة المصادقة
        setupAuthStateListener();
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة Supabase:', error);
        throw error;
    }
}

// مراقبة حالة تسجيل الدخول
function setupAuthStateListener() {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session) {
            console.log('✅ المستخدم مسجل دخول:', session.user.email);
            localStorage.setItem('userSession', JSON.stringify(session.user));
            localStorage.setItem('userToken', session.access_token);
        } else {
            console.log('❌ المستخدم غير مسجل دخول');
            localStorage.removeItem('userSession');
            localStorage.removeItem('userToken');
        }
    });
}

// ===== وظائف المصادقة =====

// تسجيل الدخول مع Supabase
async function signInUser(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // تحديث آخر دخول في قاعدة البيانات
        await supabaseClient
            .from('users')
            .update({ 
                last_login: new Date().toISOString(),
                last_ip: await getUserIP()
            })
            .eq('id', data.user.id);

        console.log('✅ تم تسجيل الدخول بنجاح:', data.user.email);
        return { success: true, user: data.user };
        
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        return { success: false, error: getArabicErrorMessage(error.message) };
    }
}

// تسجيل الخروج
async function signOutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        console.log('✅ تم تسجيل الخروج بنجاح');
        return { success: true };
    } catch (error) {
        console.error('❌ خطأ في تسجيل الخروج:', error);
        return { success: false, error: error.message };
    }
}

// ===== وظائف قاعدة البيانات =====

// جلب بيانات جميع الفروع من Supabase
async function getAllBranches() {
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*');
        
        if (error) throw error;

        // تحويل البيانات لنفس تنسيق Firebase
        const branches = {};
        data.forEach(branch => {
            branches[branch.id] = branch;
        });
        
        console.log('✅ تم جلب بيانات الفروع من Supabase:', Object.keys(branches).length, 'فرع');
        return { success: true, data: branches };
        
    } catch (error) {
        console.error('❌ خطأ في جلب بيانات الفروع:', error);
        return { success: false, error: error.message };
    }
}

// جلب بيانات فرع محدد من Supabase
async function getBranch(branchId) {
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .eq('id', branchId)
            .single();
        
        if (error) throw error;

        if (data) {
            console.log('✅ تم جلب بيانات الفرع من Supabase:', branchId);
            return { success: true, data: data };
        } else {
            console.log('⚠️ الفرع غير موجود في Supabase:', branchId);
            return { success: false, error: 'الفرع غير موجود' };
        }
        
    } catch (error) {
        console.error('❌ خطأ في جلب بيانات الفرع:', error);
        return { success: false, error: error.message };
    }
}

// تحديث بيانات فرع في Supabase
async function updateBranch(branchId, updateData) {
    try {
        console.log('🔄 تحديث بيانات الفرع:', branchId, updateData);

        // التحقق من جلسة المستخدم (اختياري للمدير)
        let userInfo = null;
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            try {
                userInfo = JSON.parse(userSession);
            } catch (e) {
                console.log('تحذير: جلسة المستخدم غير صالحة');
            }
        }

        // إضافة metadata للتحديث
        const cleanedData = { ...updateData };
        
        // إزالة الحقول التي قد تسبب تضارب
        delete cleanedData.updatedAt; // هذا من الفرونت إند
        delete cleanedData.updated_at; // قد يكون موجود
        delete cleanedData.created_at; // لا نريد تحديثه
        delete cleanedData.updated_by; // سنضيفه نحن
        
        const updatedData = {
            ...cleanedData,
            updated_at: new Date().toISOString(),
            updated_by: userInfo ? userInfo.uid : null
        };

        console.log('📝 البيانات المحدثة:', updatedData);

        const { data, error } = await supabaseClient
            .from('branches')
            .update(updatedData)
            .eq('id', branchId);

        if (error) {
            console.error('❌ خطأ في تحديث قاعدة البيانات:', error);
            throw error;
        }
        
        console.log('✅ تم تحديث بيانات الفرع في Supabase:', branchId);
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في تحديث بيانات الفرع:', error);
        return { success: false, error: error.message };
    }
}

// حفظ بيانات الفرع مباشرة في Supabase (بدون طلبات موافقة)
async function saveBranchDataDirectly(branchId, updateData) {
    try {
        console.log('� بدء حفظ بيانات الفرع مباشرة...', branchId, updateData);

        // حفظ البيانات مباشرة في جدول branches
        const { data, error } = await supabaseClient
            .from('branches')
            .update({
                twitter: updateData.twitter || null,
                whatsapp: updateData.whatsapp || null,
                instagram: updateData.instagram || null,
                location: updateData.location || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', branchId)
            .select();

        if (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
            throw error;
        }
        
        console.log('✅ تم حفظ بيانات الفرع مباشرة في Supabase:', data);
        return { success: true, data: data[0] };
        
    } catch (error) {
        console.error('❌ خطأ في حفظ بيانات الفرع:', error);
        return { success: false, error: error.message };
    }
}

// إنشاء طلب تحديث في Supabase (نظام طلبات الموافقة)
async function createUpdateRequest(branchId, requestData) {
    try {
        console.log('🚀 بدء إنشاء طلب تحديث...', {
            branchId: branchId,
            requestData: requestData,
            supabaseClient: !!supabaseClient
        });

        if (!supabaseClient) {
            throw new Error('Supabase client غير متاح');
        }

        // جلب البيانات الحالية للمقارنة
        let currentData = {};
        try {
            const { data: branchData, error: branchError } = await supabaseClient
                .from('branches')
                .select('*')
                .eq('id', branchId)
                .single();
            
            if (!branchError && branchData) {
                currentData = branchData;
                console.log('📊 البيانات الحالية:', currentData);
            }
        } catch (err) {
            console.warn('⚠️ لم يتم العثور على البيانات الحالية:', err);
        }

        // تحضير بيانات الطلب مع المقارنة
        const enhancedRequestData = {
            newData: requestData,
            currentData: {
                twitter: currentData.twitter || '',
                instagram: currentData.instagram || '',
                whatsapp: currentData.whatsapp || '',
                location: currentData.location || '',
                totalStudents: currentData.totalStudents || 0,
                totalMemorizers: currentData.totalMemorizers || 0,
                newRegistrations: currentData.newRegistrations || 0
            },
            timestamp: new Date().toISOString()
        };

        // إنشاء طلب تحديث في جدول update_requests
        const request = {
            branch_id: branchId,
            request_data: JSON.stringify(enhancedRequestData), // تحويل إلى JSON string
            status: 'pending',
            requested_at: new Date().toISOString()
            // requested_by سيبقى null لأنه اختياري
        };

        console.log('📝 بيانات الطلب المحسنة:', request);

        const { data, error } = await supabaseClient
            .from('update_requests')
            .insert([request])
            .select();

        if (error) {
            console.error('❌ خطأ في إنشاء طلب التحديث:', error);
            throw error;
        }
        
        console.log('✅ تم إنشاء طلب التحديث في Supabase:', data[0]);
        return { success: true, requestId: data[0].id };
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء طلب التحديث:', error);
        return { success: false, error: error.message };
    }
}

// موافقة على طلب التحديث في Supabase
async function approveUpdateRequest(requestId) {
    try {
        console.log('🔍 بدء الموافقة على الطلب:', requestId);

        // جلب طلب التحديث
        const { data: requestData, error: requestError } = await supabaseClient
            .from('update_requests')
            .select('*')
            .eq('id', requestId)
            .single();
        
        if (requestError || !requestData) {
            console.error('❌ طلب التحديث غير موجود:', requestError);
            throw new Error('طلب التحديث غير موجود');
        }

        console.log('📋 بيانات الطلب:', requestData);

        // تحليل البيانات المطلوبة
        let updatedData;
        const parsedData = typeof requestData.request_data === 'string' 
            ? JSON.parse(requestData.request_data) 
            : requestData.request_data;
        
        // التحقق من البنية المحسنة (مع newData و currentData)
        if (parsedData.newData) {
            updatedData = parsedData.newData;
            console.log('📝 استخدام البيانات الجديدة المحسنة:', updatedData);
        } else {
            // التوافق مع النظام القديم
            updatedData = parsedData;
            console.log('📝 استخدام البيانات التقليدية:', updatedData);
        }

        // تطبيق التحديث على الفرع
        console.log('🔄 تطبيق التحديث على الفرع:', requestData.branch_id);
        const updateResult = await updateBranch(requestData.branch_id, updatedData);
        
        if (!updateResult.success) {
            throw new Error('فشل في تطبيق التحديث على الفرع: ' + updateResult.error);
        }
        
        // تحديث حالة الطلب
        const { error: updateError } = await supabaseClient
            .from('update_requests')
            .update({
                status: 'approved',
                approved_by: null, // سيبقى null لأن العمود من نوع UUID
                approved_at: new Date().toISOString()
            })
            .eq('id', requestId);

        if (updateError) {
            console.error('❌ فشل في تحديث حالة الطلب:', updateError);
            throw updateError;
        }
        
        console.log('✅ تم اعتماد طلب التحديث في Supabase:', requestId);
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في اعتماد طلب التحديث:', error);
        return { success: false, error: error.message };
    }
}

// رفض طلب التحديث في Supabase
async function rejectUpdateRequest(requestId, reason = '') {
    try {
        console.log('❌ رفض طلب التحديث:', requestId, 'السبب:', reason);
        
        // التحقق من وجود supabaseClient
        if (!supabaseClient) {
            throw new Error('Supabase client غير متاح');
        }

        const { error } = await supabaseClient
            .from('update_requests')
            .update({
                status: 'rejected',
                rejected_by: null, // سيبقى null لأن العمود من نوع UUID
                rejected_at: new Date().toISOString(),
                rejection_reason: reason
            })
            .eq('id', requestId);

        if (error) {
            console.error('❌ خطأ في تحديث قاعدة البيانات:', error);
            throw error;
        }
        
        console.log('✅ تم رفض طلب التحديث في Supabase:', requestId);
        return { success: true };
        
    } catch (error) {
        console.error('❌ خطأ في رفض طلب التحديث:', error);
        return { success: false, error: error.message };
    }
}

// جلب طلبات التحديث المعلقة من Supabase
// جلب الطلبات المعلقة من Supabase
async function getPendingRequests() {
    try {
        console.log('📋 جلب الطلبات المعلقة من قاعدة البيانات...');
        
        if (!supabaseClient) {
            throw new Error('Supabase client غير متاح');
        }

        const { data, error } = await supabaseClient
            .from('update_requests')
            .select('*')
            .eq('status', 'pending')
            .order('requested_at', { ascending: false });

        if (error) {
            console.error('❌ خطأ في جلب الطلبات:', error);
            throw error;
        }
        
        console.log('✅ تم جلب الطلبات المعلقة:', data.length, 'طلب');
        console.log('📊 تفاصيل الطلبات:', data);
        
        // إرجاع المصفوفة مباشرة
        return data || [];
        
    } catch (error) {
        console.error('❌ خطأ في جلب الطلبات المعلقة:', error);
        return [];
    }
}

// فحص الطلبات المعلقة لفرع معين
async function checkPendingRequestsForBranch(branchId) {
    try {
        console.log('🔍 فحص الطلبات المعلقة للفرع:', branchId);
        
        if (!supabaseClient) {
            throw new Error('Supabase client غير متاح');
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
            throw error;
        }
        
        const hasPendingRequest = data && data.length > 0;
        console.log(`📊 الفرع ${branchId} - طلبات معلقة:`, hasPendingRequest ? 'نعم' : 'لا');
        
        return {
            hasPendingRequest: hasPendingRequest,
            latestRequest: hasPendingRequest ? data[0] : null
        };
        
    } catch (error) {
        console.error('❌ خطأ في فحص الطلبات المعلقة للفرع:', error);
        return { hasPendingRequest: false, latestRequest: null };
    }
}

// ===== وظائف مساعدة =====

// الحصول على IP المستخدم
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log('لا يمكن الحصول على IP');
        return 'unknown';
    }
}

// ترجمة رسائل الأخطاء للعربية
function getArabicErrorMessage(errorMessage) {
    const errorMessages = {
        'Invalid login credentials': 'بيانات الدخول غير صحيحة',
        'Email not confirmed': 'البريد الإلكتروني غير مؤكد',
        'User not found': 'المستخدم غير موجود',
        'Invalid email': 'البريد الإلكتروني غير صحيح',
        'User already registered': 'المستخدم مسجل بالفعل',
        'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    };
    
    return errorMessages[errorMessage] || 'حدث خطأ غير متوقع';
}

// تسجيل الأحداث
function logEvent(eventName, parameters = {}) {
    console.log('📊 تسجيل الحدث:', eventName, parameters);
}

// إعداد البيانات الأولية في Supabase
async function setupInitialData() {
    try {
        console.log('🔄 فحص البيانات الأولية في Supabase...');
        
        // التحقق من وجود البيانات
        const { data: existingBranches, error } = await supabaseClient
            .from('branches')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('خطأ في فحص البيانات:', error);
            return;
        }

        if (!existingBranches || existingBranches.length === 0) {
            console.log('📝 إعداد البيانات الأولية في Supabase...');
            
            // بيانات جميع الفروع
            const branches = [
                {
                    id: 'garb-dammam',
                    name: 'فرع غرب الدمام',
                    twitter: 'https://x.com/Org2Qer',
                    whatsapp: '966138360356',
                    instagram: 'https://www.instagram.com/org2qer/',
                    location: 'https://maps.app.goo.gl/cFQHa1b2y3uoDbGy9',
                    email: 'garb@tahfeez-sharqiya.com',
                    phone: '966138360356',
                    status: 'active',
                    region: 'الدمام',
                    established: '1388',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'sharq-dammam',
                    name: 'فرع شرق الدمام',
                    twitter: 'https://x.com/sharq_dammam',
                    whatsapp: '966138365678',
                    instagram: 'https://www.instagram.com/sharq_dammam/',
                    location: 'https://maps.app.goo.gl/example_sharq',
                    email: 'sharq@tahfeez-sharqiya.com',
                    phone: '966138365678',
                    status: 'active',
                    region: 'الدمام',
                    established: '1392',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'rafeia',
                    name: 'فرع الرفيعة',
                    twitter: 'https://x.com/rafeia_tahfeez',
                    whatsapp: '966138367777',
                    instagram: 'https://www.instagram.com/rafeia_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_rafeia',
                    email: 'rafeia@tahfeez-sharqiya.com',
                    phone: '966138367777',
                    status: 'active',
                    region: 'الرفيعة',
                    established: '1397',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'baqiq',
                    name: 'فرع بقيق',
                    twitter: 'https://x.com/baqiq_tahfeez',
                    whatsapp: '966138369999',
                    instagram: 'https://www.instagram.com/baqiq_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_baqiq',
                    email: 'baqiq@tahfeez-sharqiya.com',
                    phone: '966138369999',
                    status: 'active',
                    region: 'بقيق',
                    established: '1395',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'anak',
                    name: 'فرع عنك',
                    twitter: 'https://x.com/anak_tahfeez',
                    whatsapp: '966138361111',
                    instagram: 'https://www.instagram.com/anak_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_anak',
                    email: 'anak@tahfeez-sharqiya.com',
                    phone: '966138361111',
                    status: 'active',
                    region: 'عنك',
                    established: '1400',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'wadi-almyah',
                    name: 'فرع وادي المياه',
                    twitter: 'https://x.com/wadi_almyah_tahfeez',
                    whatsapp: '966138362222',
                    instagram: 'https://www.instagram.com/wadi_almyah_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_wadi_almyah',
                    email: 'wadi-almyah@tahfeez-sharqiya.com',
                    phone: '966138362222',
                    status: 'active',
                    region: 'وادي المياه',
                    established: '1402',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'khobar',
                    name: 'فرع الخبر',
                    twitter: 'https://x.com/khobar_tahfeez',
                    whatsapp: '966138361234',
                    instagram: 'https://www.instagram.com/khobar_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_khobar',
                    email: 'khobar@tahfeez-sharqiya.com',
                    phone: '966138361234',
                    status: 'active',
                    region: 'الخبر',
                    established: '1390',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'alsarar',
                    name: 'فرع الصرار',
                    twitter: 'https://x.com/alsarar_tahfeez',
                    whatsapp: '966138363333',
                    instagram: 'https://www.instagram.com/alsarar_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_alsarar',
                    email: 'alsarar@tahfeez-sharqiya.com',
                    phone: '966138363333',
                    status: 'active',
                    region: 'الصرار',
                    established: '1405',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'ras-tanura',
                    name: 'فرع رأس تنورة',
                    twitter: 'https://x.com/ras_tanura_tahfeez',
                    whatsapp: '966138364444',
                    instagram: 'https://www.instagram.com/ras_tanura_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_ras_tanura',
                    email: 'ras-tanura@tahfeez-sharqiya.com',
                    phone: '966138364444',
                    status: 'active',
                    region: 'رأس تنورة',
                    established: '1398',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'qarya',
                    name: 'فرع قرية',
                    twitter: 'https://x.com/qarya_tahfeez',
                    whatsapp: '966138365555',
                    instagram: 'https://www.instagram.com/qarya_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_qarya',
                    email: 'qarya@tahfeez-sharqiya.com',
                    phone: '966138365555',
                    status: 'active',
                    region: 'قرية',
                    established: '1403',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'altairiya',
                    name: 'فرع التعيرية',
                    twitter: 'https://x.com/altairiya_tahfeez',
                    whatsapp: '966138366666',
                    instagram: 'https://www.instagram.com/altairiya_tahfeez/',
                    location: 'https://maps.app.goo.gl/example_altairiya',
                    email: 'altairiya@tahfeez-sharqiya.com',
                    phone: '966138366666',
                    status: 'active',
                    region: 'التعيرية',
                    established: '1406',
                    created_at: new Date().toISOString()
                }
            ];
            
            // إضافة جميع الفروع
            const { error: insertError } = await supabaseClient
                .from('branches')
                .insert(branches);
            
            if (insertError) {
                console.error('خطأ في إدخال البيانات:', insertError);
            } else {
                console.log('✅ تم إعداد جميع البيانات الأولية في Supabase');
            }
        } else {
            console.log('ℹ️ البيانات موجودة بالفعل في Supabase');
        }
        
    } catch (error) {
        console.error('❌ خطأ في إعداد البيانات الأولية:', error);
    }
}

// تهيئة Supabase عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔥 بدء تحميل Supabase...');
    
    try {
        await loadSupabase();
        console.log('🔥 Supabase جاهز للاستخدام!');
        
        // تحديث الدوال في window.supabaseService بعد تحميل Supabase
        if (window.supabaseService) {
            console.log('🔄 تحديث دوال Supabase Service...');
            window.supabaseService.getAllBranches = getAllBranches;
            window.supabaseService.getBranch = getBranch;
            window.supabaseService.updateBranch = updateBranch;
            window.supabaseService.createUpdateRequest = createUpdateRequest;
            window.supabaseService.approveUpdateRequest = approveUpdateRequest;
            window.supabaseService.rejectUpdateRequest = rejectUpdateRequest;
            window.supabaseService.getPendingRequests = getPendingRequests;
            window.supabaseService.checkPendingRequestsForBranch = checkPendingRequestsForBranch;
            window.supabaseService.setupInitialData = setupInitialData;
            window.supabaseService.signInUser = signInUser;
            window.supabaseService.signOutUser = signOutUser;
            console.log('✅ تم تحديث جميع دوال Supabase Service');
        }
        
        // إعداد البيانات الأولية إذا لزم الأمر
        await setupInitialData();
        
    } catch (error) {
        console.error('❌ فشل في تحميل Supabase:', error);
    }
});

console.log('📝 تم تحميل Supabase Service');
