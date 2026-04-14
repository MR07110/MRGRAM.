// api/supabase-config.js
// MRgram Supabase Configuration (Media Storage)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ========== ASOSIY ACCOUNT (HOZIRGI) ==========
const supabaseUrl = "https://mujoriozaxjojrgkkars.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11am9yaW96YXhqb2pyZ2trYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjQ1MjQsImV4cCI6MjA5MDU0MDUyNH0.IiCWIT5QU06Wd7fEgRtTkG4IoC5oxyTgRAuWxRf15Zw";

// Bucket nomi (media saqlash uchun)
export const BUCKET = "videos";

// Supabase client yaratish
export const supabase = createClient(supabaseUrl, supabaseKey);

// ========== BUCKET MA'LUMOTLARI ==========
export const STORAGE = {
    BUCKET_NAME: BUCKET,
    PUBLIC_URL: `${supabaseUrl}/storage/v1/object/public/${BUCKET}`,
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/ogg', 'audio/wav']
};

// ========== YORDAMCHI FUNKSIYALAR ==========

// Fayl yuklash
export async function uploadFile(file, folder = 'media') {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${timestamp}_${safeName}`;
    
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });
            
        if (error) throw error;
        
        // Public URL olish
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(data.path);
            
        return {
            url: publicUrl,
            path: data.path,
            fullPath: data.fullPath,
            bucket: BUCKET,
            name: file.name,
            type: file.type,
            size: file.size
        };
    } catch (error) {
        console.error('❌ Supabase yuklash xatosi:', error);
        throw error;
    }
}

// Rasm yuklash
export async function uploadImage(file, folder = 'images') {
    if (!file.type.startsWith('image/')) {
        throw new Error('Fayl rasm emas!');
    }
    return await uploadFile(file, folder);
}

// Video yuklash
export async function uploadVideo(file, folder = 'videos') {
    if (!file.type.startsWith('video/')) {
        throw new Error('Fayl video emas!');
    }
    return await uploadFile(file, folder);
}

// Audio/Ovozli xabar yuklash
export async function uploadAudio(file, folder = 'audio') {
    if (!file.type.startsWith('audio/')) {
        throw new Error('Fayl audio emas!');
    }
    return await uploadFile(file, folder);
}

// Faylni o'chirish
export async function deleteFile(path) {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .remove([path]);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('❌ Fayl o\'chirish xatosi:', error);
        return { success: false, error };
    }
}

// Bucket hajmini tekshirish
export async function getBucketSize() {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .list();
            
        if (error) throw error;
        
        let totalSize = 0;
        for (const file of data) {
            const { data: fileData } = await supabase.storage
                .from(BUCKET)
                .list(file.name);
                
            if (fileData) {
                totalSize += fileData.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);
            }
        }
        
        return {
            bytes: totalSize,
            mb: (totalSize / (1024 * 1024)).toFixed(2),
            gb: (totalSize / (1024 * 1024 * 1024)).toFixed(4),
            files: data.length
        };
    } catch (error) {
        console.error('❌ Hajm tekshirish xatosi:', error);
        return null;
    }
}

// Public URL olish
export function getPublicUrl(path) {
    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);
    return data.publicUrl;
}

// ========== REAL-TIME SUBSCRIPTION ==========

// Bucket o'zgarishlarini tinglash
export function subscribeToBucket(callback) {
    return supabase
        .channel('bucket-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'storage',
            table: 'objects'
        }, callback)
        .subscribe();
}

// ========== ACCOUNT ALMASHTIRISH (5-6 kunda) ==========

// Zaxira accountlar ro'yxati
export const BACKUP_ACCOUNTS = [
    // 1-ACCOUNT (Hozirgi)
    {
        url: "https://mujoriozaxjojrgkkars.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11am9yaW96YXhqb2pyZ2trYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjQ1MjQsImV4cCI6MjA5MDU0MDUyNH0.IiCWIT5QU06Wd7fEgRtTkG4IoC5oxyTgRAuWxRf15Zw",
        bucket: "videos",
        active: true
    },
    // 2-ACCOUNT (Zaxira) - To'lganda qo'lda almashtiriladi
    {
        url: "https://xxxxxxxxxxxx.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        bucket: "videos",
        active: false
    },
    // 3-ACCOUNT (Zaxira)
    {
        url: "https://yyyyyyyyyyyy.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        bucket: "videos",
        active: false
    }
];

// Account almashtirish (5-6 kunda qo'lda)
export function switchToAccount(accountIndex) {
    if (accountIndex >= BACKUP_ACCOUNTS.length) {
        console.error('❌ Account mavjud emas!');
        return null;
    }
    
    const account = BACKUP_ACCOUNTS[accountIndex];
    const newClient = createClient(account.url, account.key);
    
    // Active status yangilash
    BACKUP_ACCOUNTS.forEach((acc, i) => {
        acc.active = (i === accountIndex);
    });
    
    console.log(`✅ Account almashtirildi: ${account.url}`);
    
    // Yangi client qaytarish
    return {
        client: newClient,
        bucket: account.bucket,
        url: account.url
    };
}

// Faol account ma'lumoti
export function getActiveAccount() {
    return BACKUP_ACCOUNTS.find(acc => acc.active) || BACKUP_ACCOUNTS[0];
}

console.log('✅ Supabase config yuklandi');
console.log(`📦 Bucket: ${BUCKET}`);
console.log(`🔗 URL: ${supabaseUrl}`);
