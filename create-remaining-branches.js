const fs = require('fs');
const path = require('path');

// قائمة الفروع التي تحتاج إنشاء
const remainingBranches = [
    { id: 'anak', name: 'فرع عنك' },
    { id: 'wadi-almiyah', name: 'فرع وادي المياه' },
    { id: 'sarrar', name: 'فرع الصرار' },
    { id: 'qarya', name: 'فرع قرية' },
    { id: 'taaeriya', name: 'فرع التعيرية' }
];

const templatePath = path.join(__dirname, 'branches', 'garb-dammam', 'index.html');
const branchesDir = path.join(__dirname, 'branches');

console.log('🚀 بدء إنشاء الفروع المتبقية...');

// قراءة الملف النموذجي
const templateContent = fs.readFileSync(templatePath, 'utf8');

remainingBranches.forEach(branch => {
    console.log(`📁 إنشاء فرع: ${branch.name} (${branch.id})`);
    
    // إنشاء مجلد الفرع
    const branchDir = path.join(branchesDir, branch.id);
    if (!fs.existsSync(branchDir)) {
        fs.mkdirSync(branchDir, { recursive: true });
    }
    
    // تحديث محتوى الملف
    let branchContent = templateContent;
    branchContent = branchContent.replace(/const BRANCH_ID = 'garb-dammam';/, `const BRANCH_ID = '${branch.id}';`);
    branchContent = branchContent.replace(/تحفيظ الشرقية - فرع غرب الدمام/g, `تحفيظ الشرقية - ${branch.name}`);
    branchContent = branchContent.replace(/فرع غرب الدمام/g, branch.name);
    
    // حفظ الملف
    const branchFilePath = path.join(branchDir, 'index.html');
    fs.writeFileSync(branchFilePath, branchContent, 'utf8');
    
    console.log(`✅ تم إنشاء ${branch.name} في ${branchFilePath}`);
});

console.log('🎉 تم إنشاء جميع الفروع المتبقية بنجاح!');
