(function () {
  function initTabs(root) {
    if (!root) return;
    const menuItems = Array.from(root.querySelectorAll('[data-example-tab]'));
    const panels = Array.from(root.querySelectorAll('[data-example-panel]'));
    if (!menuItems.length || !panels.length) return;

    function activate(name) {
      menuItems.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.exampleTab === name);
      });
      panels.forEach((panel) => {
        const active = panel.dataset.examplePanel === name;
        panel.classList.toggle('is-active', active);
      });
    }

    menuItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.exampleTab || 'tab1';
        activate(name);
      });
    });

    activate('tab1');
  }

  function init() {
    const root = document.querySelector('.example-app') || document.body;
    initTabs(root);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
