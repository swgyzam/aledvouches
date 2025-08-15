// DOM elements
const vouchesPage = document.getElementById('vouchesPage');
const detailPage = document.getElementById('detailPage');
const vouchesGrid = document.getElementById('vouchesGrid');
const detailContent = document.getElementById('detailContent');
const backButton = document.getElementById('backButton');
const searchInput = document.getElementById('searchInput');
const mediaModal = new bootstrap.Modal(document.getElementById('mediaModal'));

// Initialize the page
function init() {
    fetchVouchesData();
    setupEventListeners();
}

// Fetch vouches data from JSON file
function fetchVouchesData() {
    fetch('vouchesData.json')
        .then(response => response.json())
        .then(data => {
            renderVouches(data);
        })
        .catch(error => console.error('Error fetching vouches data:', error));
}

// Setup event listeners
function setupEventListeners() {
    backButton.addEventListener('click', showVouchesPage);
    searchInput.addEventListener('input', handleSearch);
}

// Render vouches grid
function renderVouches(vouches) {
    vouchesGrid.innerHTML = '';
    vouches.forEach(vouch => {
        const vouchCard = createVouchCard(vouch);
        vouchesGrid.appendChild(vouchCard);
    });
}

// Create vouch card
function createVouchCard(vouch) {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';
    
    const statusColor = vouch.status === '1st Transaction' ? 'success' : 
                        vouch.status === 'Continue' ? 'warning' : 'secondary';
    
    const stars = '★'.repeat(vouch.rating) + '☆'.repeat(5 - vouch.rating);
    
    col.innerHTML = `
        <div class="vouch-card h-100 rounded-4 p-4 text-dark cursor-pointer" onclick="showVouchDetail(${vouch.id})">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-${statusColor} status-badge">${vouch.status}</span>
                <small class="text-muted">${vouch.date}</small>
            </div>
            
            <h5 class="fw-bold mb-2">${vouch.title}</h5>
            <p class="amount-text fs-4 fw-bold mb-3">${vouch.amount}</p>
            
            <div class="mb-3">
                <small class="text-muted d-block">Buyer: ${vouch.buyer}</small>
                <small class="text-muted d-block">Seller: ${vouch.seller}</small>
            </div>
            
            <div class="d-flex justify-content-between align-items-center">
                <span class="text-warning">${stars}</span>
                <i class="bi bi-arrow-right-circle fs-5"></i>
            </div>
        </div>
    `;
    
    return col;
}

// Show vouch detail
function showVouchDetail(vouchId) {
    const vouch = vouchesData.find(v => v.id === vouchId);
    if (!vouch) return;
    
    detailContent.innerHTML = createDetailContent(vouch);
    vouchesPage.classList.add('d-none');
    detailPage.classList.remove('d-none');
    detailPage.classList.add('fade-in');
}

// Create detail content
function createDetailContent(vouch) {
    const statusColor = vouch.status === '1st Transaction' ? 'success' : 
                        vouch.status === 'Continue' ? 'warning' : 'secondary';
    
    const stars = '★'.repeat(vouch.rating) + '☆'.repeat(5 - vouch.rating);
    
    const mediaGrid = vouch.media.map((media, index) => `
        <div class="col-6 col-md-4">
            <div class="media-thumbnail rounded-3 overflow-hidden" onclick="showMediaModal('${media.url}', '${media.type}', '${media.alt}')">
                ${media.type === 'video' ? 
                    `<div class="position-relative">
                        <img src="${media.url}" alt="${media.alt}" class="img-fluid w-100" style="height: 120px; object-fit: cover;">
                        <div class="position-absolute top-50 start-50 translate-middle">
                            <i class="bi bi-play-circle-fill text-dark fs-1"></i>
                        </div>
                    </div>` :
                    `<img src="${media.url}" alt="${media.alt}" class="img-fluid w-100" style="height: 120px; object-fit: cover;">`
                }
            </div>
        </div>
    `).join('');
    
    return `
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 class="fw-bold text-primary mb-2">${vouch.title}</h2>
                        <span class="badge bg-${statusColor} status-badge">${vouch.status}</span>
                    </div>
                    <div class="text-end">
                        <div class="amount-text fs-3 fw-bold">${vouch.amount}</div>
                        <div class="text-warning fs-5">${stars}</div>
                    </div>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6 class="text-muted mb-1">Transaction Date</h6>
                        <p class="fw-semibold">${vouch.date}</p>
                    </div>
                    <div class="col-md-3">
                        <h6 class="text-muted mb-1">Buyer</h6>
                        <p class="fw-semibold">${vouch.buyer}</p>
                    </div>
                    <div class="col-md-3">
                        <h6 class="text-muted mb-1">Seller</h6>
                        <p class="fw-semibold">${vouch.seller}</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h6 class="text-muted mb-2">Description</h6>
                    <p class="text-secondary">${vouch.description}</p>
                </div>
                
                <div class="mb-4">
                    <h6 class="text-muted mb-3">Transaction Media</h6>
                    <div class="row g-3">
                        ${mediaGrid}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show media modal
function showMediaModal(url, type, alt) {
    const mediaContent = document.getElementById('mediaContent');
    
    if (type === 'video') {
        mediaContent.innerHTML = `
            <video controls class="img-fluid rounded" style="max-height: 70vh;">
                <source src="${url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p class="text-white mt-2">${alt}</p>
        `;
    } else {
        mediaContent.innerHTML = `
            <img src="${url}" alt="${alt}" class="img-fluid rounded" style="max-height: 70vh;">
            <p class="text-white mt-2">${alt}</p>
        `;
    }
    
    mediaModal.show();
}

// Show vouches page
function showVouchesPage() {
    detailPage.classList.add('d-none');
    vouchesPage.classList.remove('d-none');
    vouchesPage.classList.add('fade-in');
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredVouches = vouchesData.filter(vouch => 
        vouch.title.toLowerCase().includes(searchTerm) ||
        vouch.buyer.toLowerCase().includes(searchTerm) ||
        vouch.seller.toLowerCase().includes(searchTerm) ||
        vouch.description.toLowerCase().includes(searchTerm)
    );
    renderVouches(filteredVouches);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
