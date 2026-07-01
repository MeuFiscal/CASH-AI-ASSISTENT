const fs = require('fs');

function fixModals(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('createPortal')) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';");
    content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { createPortal } from 'react-dom';");
  }

  // ActionModals.tsx fixes
  content = content.replace(/return \(\s*<div className="fixed inset-0[^>]*z-50[^>]*>/g, (match) => {
    return match.replace('return (', 'return createPortal(').replace('z-50', 'z-[9999]').replace(' animate-in fade-in', '');
  });

  // UserDrawer.tsx fixes
  content = content.replace(/return \(\s*<>\s*<div className="fixed inset-0[^>]*z-40[^>]*>/g, (match) => {
    return match.replace('return (', 'return createPortal(').replace('z-40', 'z-[9998]');
  });
  
  // Replace the closing tags of the modals
  content = content.replace(/<\/div>\n  \);\n\}/g, "</div>,\n    document.body\n  );\n}");
  // For UserDrawer closing fragment
  content = content.replace(/<\/div>\n    <\/>\n  \);\n\}/g, "</div>\n    </>,\n    document.body\n  );\n}");

  fs.writeFileSync(filePath, content);
}

fixModals('src/features/admin/pages/users/components/ActionModals.tsx');
fixModals('src/features/admin/pages/users/components/UserDrawer.tsx');
