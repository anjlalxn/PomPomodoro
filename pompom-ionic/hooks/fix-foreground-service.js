// Android 14 (targetSDK 34) crashes if a foreground service has no type.
// After every prepare: remove every ForegroundService entry, then add one with the type.
const fs = require('fs');
const path = require('path');

module.exports = function (ctx) {
  const manifest = path.join(
    ctx.opts.projectRoot,
    'platforms/android/app/src/main/AndroidManifest.xml'
  );
  if (!fs.existsSync(manifest)) return;

  let xml = fs.readFileSync(manifest, 'utf8');

  // remove all existing entries (self-closing or with children)
  xml = xml.replace(
    /\s*<service[^>]*com\.davidbriglio\.foreground\.ForegroundService[^>]*\/>/g,
    ''
  );
  xml = xml.replace(
    /\s*<service[^>]*com\.davidbriglio\.foreground\.ForegroundService[^>]*>[\s\S]*?<\/service>/g,
    ''
  );

  // add one entry with the type
  xml = xml.replace(
    '</application>',
    '    <service android:name="com.davidbriglio.foreground.ForegroundService" ' +
      'android:foregroundServiceType="specialUse" android:stopWithTask="true" />\n    </application>'
  );

  fs.writeFileSync(manifest, xml);
};