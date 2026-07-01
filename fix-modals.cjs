const fs = require('fs');

function fixModals(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('createPortal')) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';");
    content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { createPortal } from 'react-dom';");
  }

  // ActionModals.tsx fixes (since it was partially modified by my previous tool, I'll use regex to fix both states)
  content = content.replace(/return (createPortal\()?\n?\s*<div className="fixed inset-0[^>]*z-\[?9999\]?[^>]*>/g, (match) => {
    return 'return createPortal(\n    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">';
  });

  // UserDrawer.tsx fixes
  content = content.replace(/return \(\s*<>\s*<div className="fixed inset-0[^>]*z-40[^>]*>/g, (match) => {
    return 'return createPortal(\n    <>\n      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity" onClick={onClose} />';
  });
  content = content.replace(/z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300/g, 'z-[9999] shadow-2xl flex flex-col');

  // Replace the closing tags of the modals in ActionModals
  content = content.replace(/<\/div>\n  \);\n\}/g, "</div>,\n    document.body\n  );\n}");
  // For UserDrawer closing fragment
  content = content.replace(/<\/div>\n    <\/>\n  \);\n\}/g, "</div>\n    </>,\n    document.body\n  );\n}");

  fs.writeFileSync(filePath, content);
}

fixModals('src/features/admin/pages/users/components/ActionModals.tsx');
fixModals('src/features/admin/pages/users/components/UserDrawer.tsx');
