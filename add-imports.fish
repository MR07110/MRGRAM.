# String eventlarni almashtirish (Fish Shell)
for f in (find . -name "*.js")
    sed -i '' "s/'auth:login'/AUTH_EVENTS.LOGIN/g" $f
    sed -i '' "s/'auth:register'/AUTH_EVENTS.REGISTER/g" $f
    sed -i '' "s/'auth:logout'/AUTH_EVENTS.LOGOUT/g" $f
    sed -i '' "s/'ui:toast:show'/UI_EVENTS.TOAST_SHOW/g" $f
    sed -i '' "s/'ui:page:close'/UI_EVENTS.PAGE_CLOSE/g" $f
    sed -i '' "s/'call:connected'/CALL_EVENTS.CONNECTED/g" $f
    sed -i '' "s/'realtime:set'/REALTIME_EVENTS.SET/g" $f
    sed -i '' "s/'system:error'/SYSTEM_EVENTS.ERROR/g" $f
end

echo "✅ String eventlar almashtirildi!"
