document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');

    // Fetch user profile data
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
                <h3>Recent Contributions:</h3>
                <div id="contributions"></div>
            `;
            downloadBtn.style.display = 'block';

            // Fetch recent public events
            fetch(`https://api.github.com/users/${username}/events`)
                .then(response => response.json())
                .then(events => {
                    const contributionsDiv = document.getElementById('contributions');
                    contributionsDiv.innerHTML = events.slice(0, 5).map(event => {
                        const date = new Date(event.created_at).toLocaleDateString();
                        const eventType = event.type.replace('Event', '');
                        return `<p><strong>${eventType}:</strong> ${event.repo.name} on ${date}</p>`;
                    }).join('');
                })
                .catch(error => {
                    contributionsDiv.innerHTML = `<p>No recent contributions found.</p>`;
                });
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});
