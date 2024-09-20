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
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Following:</strong> ${data.following}</p>
                <a href="${data.html_url}" target="_blank">View Profile</a>
            `;
            downloadBtn.style.display = 'inline-block'; // Show download button
            downloadBtn.onclick = () => downloadProfileAsImage();
        })
        .catch(error => {
            profileDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
            downloadBtn.style.display = 'none'; // Hide download button if error occurs
        });
});

function downloadProfileAsImage() {
    // Capture the profile section as an image with useCORS enabled for cross-origin images
    html2canvas(document.getElementById('profile'), { useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgAnchor = document.createElement('a');
        imgAnchor.href = imgData;
        imgAnchor.download = 'github_profile.png'; // Name of the image file
        document.body.appendChild(imgAnchor);
        imgAnchor.click();
        document.body.removeChild(imgAnchor); // Remove the anchor element after download
    });
}

