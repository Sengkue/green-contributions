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
                <p class="contributions"><strong>Contributions:</strong> Loading...</p> <!-- Placeholder for contributions -->
                <a href="${data.html_url}" target="_blank">View Profile on GitHub</a>
            `;
            // Call the GitHub events API to get contributions (example)
            fetch(`https://api.github.com/users/${username}/events/public`)
                .then(eventResponse => eventResponse.json())
                .then(events => {
                    const contributions = events.length;  // Simple way to count contributions
                    const contributionsElement = document.querySelector('.contributions');
                    contributionsElement.innerHTML = `<strong>Contributions:</strong> ${contributions} in the last year`;
                })
                .catch(err => {
                    document.querySelector('.contributions').innerHTML = `<strong>Contributions:</strong> N/A`;
                });

            downloadBtn.style.display = 'block';
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    html2canvas(document.getElementById('profile'),{ useCORS: true }).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'github_profile.png';
        link.click();
    });
});
