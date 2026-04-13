#!/usr/bin/env fish

function master-audit
    set_color --bold blue
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║        MRGRAM ATOMIC 4-BOSS MASTER AUDIT                 ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    set_color normal
    echo ""

    # 1️⃣ Fayl hajmi auditi
    set_color yellow
    echo "1️⃣ Fayl hajmi auditi (≤100 qator):"
    set_color normal
    echo "─────────────────────────────────────"
    set over_limit 0
    for file in (find . -name "*.js" -not -path "./node_modules/*")
        set lines (wc -l < $file | string trim)
        if test $lines -gt 100
            set_color red
            echo "❌ $file → $lines qator"
            set_color normal
            set over_limit (math $over_limit + 1)
        end
    end
    if test $over_limit -eq 0
        set_color green
        echo "✅ Barcha fayllar 100 qatordan kam!"
        set_color normal
    else
        set_color red
        echo "⚠️ $over_limit ta fayl 100 qatordan oshgan!"
        set_color normal
    end
    echo ""

    # 2️⃣ Import yo'llari tekshiruvi
    set_color yellow
    echo "2️⃣ Import yo'llari tekshiruvi:"
    set_color normal
    echo "─────────────────────────────────────"
    set errors 0
    for file in (find . -name "*.js" -not -path "./node_modules/*")
        set imports (grep -oE "from ['\"](\\.{1,2}/[^'\"]+)['\"]" $file 2>/dev/null | sed -E "s/from ['\"]//g" | sed -E "s/['\"]//g")
        if test -n "$imports"
            set file_dir (dirname $file)
            for imp in $imports
                set full_path "$file_dir/$imp"
                if not test -f "$full_path"; and not test -f "$full_path.js"; and not test -f "$full_path/index.js"
                    set_color red
                    echo "❌ $file → $imp"
                    set_color normal
                    set errors (math $errors + 1)
                end
            end
        end
    end
    if test $errors -eq 0
        set_color green
        echo "✅ Barcha import yo'llari to'g'ri!"
        set_color normal
    else
        set_color red
        echo "⚠️ $errors ta xato import topildi!"
        set_color normal
    end
    echo ""

    # 3️⃣ String event tekshiruvi
    set_color yellow
    echo "3️⃣ String event tekshiruvi:"
    set_color normal
    echo "─────────────────────────────────────"
    set string_events (find . -name "*.js" -not -path "./node_modules/*" -not -path "./constants/events.js" -exec grep -ohE "emit\(['\"]([a-z:-]+)['\"]" {} \; 2>/dev/null | sed -E "s/emit\(['\"]//g" | sort -u)
    if test -n "$string_events"
        set_color red
        for e in $string_events
            echo "❌ String event topildi: '$e'"
        end
        set_color normal
    else
        set_color green
        echo "✅ Hech qanday string event yo'q!"
        set_color normal
    end
    echo ""

    # 4️⃣ Fayllar statistikasi
    set_color yellow
    echo "4️⃣ Fayllar statistikasi:"
    set_color normal
    echo "─────────────────────────────────────"
    set js_files (find . -name "*.js" -not -path "./node_modules/*" | wc -l | string trim)
    set css_files (find . -name "*.css" -not -path "./node_modules/*" | wc -l | string trim)
    set html_files (find . -name "*.html" | wc -l | string trim)
    set total (math $js_files + $css_files + $html_files)
    
    echo "   📜 JS fayllar: $js_files ta"
    echo "   🎨 CSS fayllar: $css_files ta"
    echo "   🌐 HTML fayllar: $html_files ta"
    set_color --bold cyan
    echo "   📁 Jami: $total ta"
    set_color normal
    echo ""

    # 5️⃣ BOSS tizimi tekshiruvi
    set_color yellow
    echo "5️⃣ BOSS tizimi tekshiruvi:"
    set_color normal
    echo "─────────────────────────────────────"
    
    if test -f "CORE_BOSS/event-bus.js"
        set_color green; echo "   ✅ event-bus.js"; set_color normal
    else
        set_color red; echo "   ❌ event-bus.js topilmadi!"; set_color normal
    end
    
    if test -f "CORE_BOSS/main-boss.js"
        set_color green; echo "   ✅ main-boss.js"; set_color normal
    else
        set_color red; echo "   ❌ main-boss.js topilmadi!"; set_color normal
    end
    
    if test -f "CORE_BOSS/data-boss.js"
        set_color green; echo "   ✅ data-boss.js"; set_color normal
    else
        set_color red; echo "   ❌ data-boss.js topilmadi!"; set_color normal
    end
    
    if test -f "CORE_BOSS/ui-boss.js"
        set_color green; echo "   ✅ ui-boss.js"; set_color normal
    else
        set_color red; echo "   ❌ ui-boss.js topilmadi!"; set_color normal
    end
    
    if test -f "CORE_BOSS/module-loader.js"
        set_color green; echo "   ✅ module-loader.js"; set_color normal
    else
        set_color red; echo "   ❌ module-loader.js topilmadi!"; set_color normal
    end
    echo ""

    # Yakuniy
    set_color --bold blue
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                     AUDIT YAKUNLANDI                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    set_color normal
end

# Funksiyani ishga tushirish
master-audit
