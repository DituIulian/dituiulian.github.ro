const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  links?.classList.remove('open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
  links?.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && links?.classList.contains('open')) {
    closeMenu();
    toggle?.focus();
  }
});
links?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
