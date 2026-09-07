
const themeToggle = document.getElementById('themeToggle');
const prismLight = document.getElementById('prism-light');
const prismDark = document.getElementById('prism-dark');
function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if(prismLight) prismLight.disabled = isDark;
    if(prismDark) prismDark.disabled = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
}
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme === 'dark');
themeToggle.addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') !== 'dark'));
function switchTab(idx) {
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('.code-content').forEach((c, i) => c.classList.toggle('active', i === idx));
}
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const activeCode = document.querySelector('.code-content.active code');
        if (activeCode) {
            navigator.clipboard.writeText(activeCode.innerText).then(() => {
                const orig = copyBtn.innerText;
                copyBtn.innerText = "Copied!";
                setTimeout(() => copyBtn.innerText = orig, 2000);
            });
        }
    });
}
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const baseURI = document.querySelector('meta[name="base-url"]').getAttribute('content');
let searchIndex = [];
fetch(baseURI + '/search-index.json').then(res => res.json()).then(data => searchIndex = data);
searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    searchResults.innerHTML = '';
    if (!q) { searchResults.style.display = 'none'; return; }
    const matches = searchIndex.filter(p => p.t.toLowerCase().includes(q)).slice(0, 10);
    if (matches.length > 0) {
        matches.forEach(m => {
            const a = document.createElement('a');
            a.className = 'search-result-item';
            a.href = baseURI + m.u;
            a.innerText = m.t;
            searchResults.appendChild(a);
        });
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
});
document.addEventListener('click', e => {
    if(!searchInput.contains(e.target)) searchResults.style.display = 'none';
});
