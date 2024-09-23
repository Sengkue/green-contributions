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
                <img src="https://ghchart.rshah.org/${username}" alt="${data.login}'s contributions" class="contribution-chart" style="border-radius: 0; box-shadow: none;" />
            `;
            downloadBtn.style.display = 'block';

            // Add an event listener to the contribution chart to ensure it's loaded before downloading
            const chartImg = profileDiv.querySelector('.contribution-chart');
            chartImg.onload = () => {
                downloadBtn.onclick = () => {
                    html2canvas(profileDiv, { useCORS: true }).then(canvas => {
                        const link = document.createElement('a');
                        link.href = canvas.toDataURL();
                        link.download = 'github_profile.png';
                        link.click();
                    });
                };
            };
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});
