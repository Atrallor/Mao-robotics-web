document.addEventListener('DOMContentLoaded', function() {
    fetch('./html/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            const currentHash = window.location.hash || '#workers';
            updateActiveTab(currentHash);
        });

    function updateActiveTab(hash) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === hash) {
                tab.classList.add('active');
            }
        });

        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        const activeSection = document.querySelector(hash);
        if (activeSection) activeSection.style.display = 'block';
    }

    window.addEventListener('hashchange', () => {
        updateActiveTab(window.location.hash);
    });
});