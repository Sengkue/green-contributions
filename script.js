document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    // Fetch user data from GitHub API
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            // Use a CORS proxy to fetch the contribution chart
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const chartUrl = `https://ghchart.rshah.org/${username}`;

            // Fetch the contribution chart with the CORS proxy
            fetch(proxyUrl + chartUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Contribution chart not found');
                    }
                    return response.url; // Use the proxied URL
                })
                .then(proxiedChartUrl => {
                    profileDiv.innerHTML = `
                        <h2>${data.login}</h2>
                        <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                        <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                        <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                        <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                        <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                        <h3>Contributions:</h3>
                        <img id="contributionChart" src="${proxiedChartUrl}" alt="${data.login}'s contributions" style="border-radius: 0; box-shadow: none; width: 100%; max-width: 600px;" />
                    `;
                    downloadBtn.style.display = 'block';
                })
                .catch(error => {
                    profileDiv.innerHTML += `<p>${error.message}</p>`;
                    downloadBtn.style.display = 'none';
                });
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const chartImage = document.getElementById('contributionChart');
    
    chartImage.onload = function() {
        html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'github_profile.png';
            link.click();
        });
    };
    
    chartImage.onerror = function() {
        alert('Failed to load contribution chart. Please try again.');
    };
});
