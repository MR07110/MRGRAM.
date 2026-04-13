# Fish shell uchun to'liq audit skripti (to'g'rilangan)

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        MRGRAM ATOMIC 4-BOSS - TO'LIQ AUDIT              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 1️⃣ BOSS fayllari
echo "1️⃣ BOSS FAYLLARI:"
echo "─────────────────────────────────────"
set boss_files CORE_BOSS/event-bus.js CORE_BOSS/main-boss.js CORE_BOSS/data-boss.js CORE_BOSS/ui-boss.js CORE_BOSS/module-loader.js
for f in $boss_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 2️⃣ CONSTANTS fayllari
echo "2️⃣ CONSTANTS FAYLLARI:"
echo "─────────────────────────────────────"
set const_files constants/events.js constants/errors.js constants/ui-text.js constants/config.js
for f in $const_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 3️⃣ SERVICES fayllari
echo "3️⃣ SERVICES FAYLLARI:"
echo "─────────────────────────────────────"
set service_files services/firebase/firestore.js services/firebase/auth.js services/firebase/realtime.js services/supabase/storage.js services/supabase/realtime.js services/supabase/storage-core.js services/supabase/storage-uploader.js services/supabase/storage-manager.js
for f in $service_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 4️⃣ AUTH MODULLARI
echo "4️⃣ AUTH MODULLARI:"
echo "─────────────────────────────────────"
set auth_files CORE_BOSS/modules/auth/auth-login.js CORE_BOSS/modules/auth/auth-register.js CORE_BOSS/modules/auth/auth-logout.js CORE_BOSS/modules/auth/auth-session.js
for f in $auth_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 5️⃣ CHAT MODULLARI
echo "5️⃣ CHAT MODULLARI:"
echo "─────────────────────────────────────"
set chat_files CORE_BOSS/modules/chat/chat-send-message.js CORE_BOSS/modules/chat/chat-receive-message.js CORE_BOSS/modules/chat/chat-delete-message.js CORE_BOSS/modules/chat/chat-edit-message.js CORE_BOSS/modules/chat/chat-forward-message.js CORE_BOSS/modules/chat/chat-typing-indicator.js CORE_BOSS/modules/chat/chat-read-receipt.js
for f in $chat_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 6️⃣ CALL MODULLARI
echo "6️⃣ CALL MODULLARI:"
echo "─────────────────────────────────────"
set call_files CORE_BOSS/modules/call/call-dialer.js CORE_BOSS/modules/call/call-webrtc-connection.js CORE_BOSS/modules/call/call-media-stream.js CORE_BOSS/modules/call/call-ui-handler.js CORE_BOSS/modules/call/call-accept.js CORE_BOSS/modules/call/call-reject.js CORE_BOSS/modules/call/call-end.js
for f in $call_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 7️⃣ VOICE MODULLARI
echo "7️⃣ VOICE MODULLARI:"
echo "─────────────────────────────────────"
set voice_files CORE_BOSS/modules/voice/voice-recorder.js CORE_BOSS/modules/voice/voice-player.js CORE_BOSS/modules/voice/voice-visualizer.js CORE_BOSS/modules/voice/voice-converter.js CORE_BOSS/modules/voice/voice-uploader.js
for f in $voice_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 8️⃣ VAULT MODULLARI
echo "8️⃣ VAULT MODULLARI:"
echo "─────────────────────────────────────"
set vault_files CORE_BOSS/modules/vault/vault-pin-verify.js CORE_BOSS/modules/vault/vault-pin-change.js CORE_BOSS/modules/vault/vault-encrypt.js CORE_BOSS/modules/vault/vault-decrypt.js CORE_BOSS/modules/vault/vault-contacts.js
for f in $vault_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 9️⃣ CONTACTS MODULLARI
echo "9️⃣ CONTACTS MODULLARI:"
echo "─────────────────────────────────────"
set contact_files CORE_BOSS/modules/contacts/contact-add.js CORE_BOSS/modules/contacts/contact-remove.js CORE_BOSS/modules/contacts/contact-search.js CORE_BOSS/modules/contacts/contact-list.js
for f in $contact_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 🔟 MEDIA MODULLARI
echo "🔟 MEDIA MODULLARI:"
echo "─────────────────────────────────────"
set media_files CORE_BOSS/modules/media/media-upload.js CORE_BOSS/modules/media/media-preview.js CORE_BOSS/modules/media/media-viewer.js CORE_BOSS/modules/media/media-capture.js
for f in $media_files
    if test -f $f
        set lines (wc -l < $f | string trim)
        echo "   ✅ $f ($lines qator)"
    else
        echo "   ❌ $f (YO'Q)"
    end
end
echo ""

# 📊 YAKUNIY STATISTIKA
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                     YAKUNIY STATISTIKA                   ║"
echo "╚══════════════════════════════════════════════════════════╝"

set total_js (find . -name "*.js" -not -path "./node_modules/*" | wc -l | string trim)
set total_css (find . -name "*.css" -not -path "./node_modules/*" | wc -l | string trim)
set total_html (find . -name "*.html" | wc -l | string trim)
set empty_files (find . -name "*.js" -type f -empty | wc -l | string trim)
set non_empty_files (math $total_js - $empty_files)
set total_all (math $total_js + $total_css + $total_html)

echo "   📜 JS fayllar (jami): $total_js ta"
echo "   ✅ JS fayllar (to'liq): $non_empty_files ta"
echo "   ❌ JS fayllar (bo'sh): $empty_files ta"
echo "   🎨 CSS fayllar: $total_css ta"
echo "   🌐 HTML fayllar: $total_html ta"
echo "   📁 Jami: $total_all ta"
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    AUDIT YAKUNLANDI                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
