const fs = require('fs');
const path = require('path');

// قائمة جميع الفروع
const branches = [
    'garb-dammam',
    'sharq-dammam', 
    'khobar',
    'rafeia',
    'baqiq',
    'anak',
    'wadi-almiyah',
    'sarrar',
    'qarya',
    'taaeriya'
];

const branchesDir = path.join(__dirname, 'branches');

console.log('🚀 بدء تحديث جميع الفروع لإزالة البيانات الافتراضية وتحسين الروابط...');

branches.forEach(branchId => {
    const branchFile = path.join(branchesDir, branchId, 'index.html');
    
    if (fs.existsSync(branchFile)) {
        console.log(`📝 تحديث فرع: ${branchId}`);
        
        let content = fs.readFileSync(branchFile, 'utf8');
        
        // إزالة استدعاءات loadDefaultData
        content = content.replace(/loadDefaultData\(\);/g, 'console.warn(\'⚠️ لن يتم عرض أي روابط\');');
        
        // تحديث رسائل التحذير
        content = content.replace(
            /console\.warn\('⚠️ خدمة Supabase غير متوفرة، استخدام البيانات الافتراضية'\);/g,
            'console.warn(\'⚠️ خدمة Supabase غير متوفرة - لن يتم عرض أي روابط\');'
        );
        
        content = content.replace(
            /console\.warn\('⚠️ لم يتم العثور على بيانات الفرع، استخدام البيانات الافتراضية'\);/g,
            'console.warn(\'⚠️ لم يتم العثور على بيانات الفرع - لن يتم عرض أي روابط\');'
        );
        
        content = content.replace(
            /console\.error\('❌ خطأ في جلب بيانات الفرع:', error\);\s*loadDefaultData\(\);/g,
            'console.error(\'❌ خطأ في جلب بيانات الفرع:\', error);\n                console.warn(\'⚠️ سيتم إخفاء جميع الروابط بسبب الخطأ\');'
        );
        
        // إزالة دالة loadDefaultData بالكامل
        const defaultDataFunctionRegex = /\/\/ تحميل البيانات الافتراضية[\s\S]*?updateBranchLinks\(defaultData\);\s*}\s*/;
        content = content.replace(defaultDataFunctionRegex, '');
        
        // تحسين دالة updateBranchLinks للفتح المباشر للتطبيقات
        const newUpdateFunction = `        // تحديث الروابط بناءً على بيانات قاعدة البيانات
        function updateBranchLinks(branchData) {
            console.log('🔗 تحديث الروابط:', branchData);
            
            // Twitter - فتح التطبيق مباشرة على الهاتف أو الموقع على الحاسوب
            if (branchData.twitter) {
                const twitterLink = document.getElementById('twitterLink');
                // استخراج اسم المستخدم من الرابط
                const twitterUsername = branchData.twitter.split('/').pop();
                twitterLink.href = \`twitter://user?screen_name=\${twitterUsername}\`;
                twitterLink.addEventListener('click', function(e) {
                    // fallback للمتصفح إذا لم يفتح التطبيق
                    setTimeout(() => {
                        window.open(branchData.twitter, '_blank');
                    }, 500);
                });
                twitterLink.style.display = 'flex';
            }
            
            // Instagram - فتح التطبيق مباشرة
            if (branchData.instagram) {
                const instagramLink = document.getElementById('instagramLink');
                const instagramUsername = branchData.instagram.split('/').filter(part => part).pop();
                instagramLink.href = \`instagram://user?username=\${instagramUsername}\`;
                instagramLink.addEventListener('click', function(e) {
                    // fallback للمتصفح
                    setTimeout(() => {
                        window.open(branchData.instagram, '_blank');
                    }, 500);
                });
                instagramLink.style.display = 'flex';
            }
            
            // WhatsApp - فتح واتساب مباشرة
            if (branchData.whatsapp) {
                const whatsappLink = document.getElementById('whatsappLink');
                const phoneNumber = branchData.whatsapp.replace(/[^\\d]/g, ''); // إزالة كل شيء عدا الأرقام
                whatsappLink.href = \`whatsapp://send?phone=\${phoneNumber}\`;
                whatsappLink.addEventListener('click', function(e) {
                    // fallback للواتساب ويب
                    setTimeout(() => {
                        window.open(\`https://wa.me/\${phoneNumber}\`, '_blank');
                    }, 500);
                });
                whatsappLink.style.display = 'flex';
            }
            
            // Location - فتح خرائط جوجل مباشرة
            if (branchData.location) {
                const locationLink = document.getElementById('locationLink');
                locationLink.href = branchData.location;
                locationLink.style.display = 'flex';
            }
            
            console.log('✅ تم تحديث الروابط بنجاح - ستفتح التطبيقات مباشرة');
        }`;
        
        // استبدال دالة updateBranchLinks القديمة
        const oldUpdateFunctionRegex = /\/\/ تحديث الروابط بناءً على بيانات قاعدة البيانات[\s\S]*?console\.log\('✅ تم تحديث الروابط بنجاح'\);\s*}/;
        content = content.replace(oldUpdateFunctionRegex, newUpdateFunction);
        
        // حفظ الملف المحدث
        fs.writeFileSync(branchFile, content, 'utf8');
        console.log(`✅ تم تحديث فرع ${branchId}`);
    } else {
        console.log(`❌ لم يتم العثور على ملف ${branchId}`);
    }
});

console.log('🎉 تم تحديث جميع الفروع بنجاح! الآن:');
console.log('• لا توجد بيانات افتراضية - إذا لم تكن هناك بيانات لا تظهر الروابط');
console.log('• الروابط تفتح التطبيقات مباشرة (واتساب، تويتر، إنستغرام)');
