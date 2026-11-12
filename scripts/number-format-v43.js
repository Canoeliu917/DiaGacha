function formatCardNoV43(no) {
  return String(no).padStart(4, '0');
}

if (typeof module !== 'undefined' && module.exports) module.exports = { formatCardNoV43 };
