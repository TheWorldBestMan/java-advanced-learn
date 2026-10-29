(function () {
  'use strict';
  function write(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (e) {
      var banner = document.getElementById('storageWarning');
      if (banner) banner.hidden = false;
      return false;
    }
  }
  window.LearningStorage = { write: write };
})();
