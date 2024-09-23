document.getElementById('searchBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const profileDiv = document.getElementById('profile');
    const downloadBtn = document.getElementById('downloadBtn');
    const ctx = document.getElementById('myChart').getContext('2d');

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
            `;

            // Placeholder data for contributions (you may want to fetch real data)
            const contributionData = [12, 19, 3, 5, 2, 3, 7]; // Example data
            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']; // Example labels

            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Contributions',
                        data: contributionData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('myChart').style.display = 'block';
            downloadBtn.style.display = 'block';
        })
        .catch(error => {
            profileDiv.innerHTML = `<p>User not found. Please try again.</p>`;
            downloadBtn.style.display = 'none';
        });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    html2canvas(document.getElementById('profile'), { useCORS: true }).then(function(canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'github_profile.png';
        link.click();
    });
});
