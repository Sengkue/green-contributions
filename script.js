document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            profileDiv.innerHTML = `
                <h2>${data.login}</h2>
                <img src="${data.avatar_url}" alt="${data.login}'s avatar" width="100">
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
                <h3>Contributions:</h3>
                <img src="https://ghchart.rshah.org/${username}" alt="${data.login}'s contributions" style="border-radius: 0; box-shadow: none; width: 100%; max-width: 600px;" />
            `;
            downloadBtn.style.display = 'block';
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');

    // Download the contribution chart
    const chartUrl = `https://ghchart.rshah.org/${username}`;
    const chartLink = document.createElement('a');
    chartLink.href = chartUrl;
    chartLink.download = 'github_contributions.png';
    chartLink.click();

    // Capture the profile card
    html2canvas(profileDiv, { useCORS: true }).then(function(canvas) {
        const profileLink = document.createElement('a');
        profileLink.href = canvas.toDataURL();
        profileLink.download = 'github_profile.png';
        profileLink.click();
    });
});
