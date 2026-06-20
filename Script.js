// =============================
// DOM Elements
// =============================

let notesData = [
    { id: 1, title: 'Calculus Basics', subject: 'Mathematics', description: 'Learn calculus fundamentals', category: 'Chapter 1-3', file: 'calculus.pdf', date: '2024-01-15' },
    { id: 2, title: 'Physics: Motion', subject: 'Physics', description: 'Motion and forces explained', category: 'Unit 2', file: 'physics.pdf', date: '2024-01-14' },
    { id: 3, title: 'Python Programming', subject: 'Programming', description: 'Python basics tutorial', category: 'Week 1-2', file: 'python.pdf', date: '2024-01-13' },
    { id: 4, title: 'Chemistry Reactions', subject: 'Chemistry', description: 'Chemical reactions guide', category: 'Chapter 4', file: 'chemistry.pdf', date: '2024-01-12' },
    { id: 5, title: 'Cell Biology', subject: 'Biology', description: 'Cell structure and function', category: 'Unit 1', file: 'biology.pdf', date: '2024-01-11' },
    { id: 6, title: 'Renaissance History', subject: 'History', description: 'The Renaissance period', category: 'Period 3', file: 'history.pdf', date: '2024-01-10' },
    { id: 7, title: 'Shakespeare Literature', subject: 'Literature', description: 'Shakespeare analysis', category: 'Semester 2', file: 'literature.pdf', date: '2024-01-09' },
    { id: 8, title: 'Algebra Advanced', subject: 'Mathematics', description: 'Advanced algebra problems', category: 'Chapter 8-10', file: 'algebra.pdf', date: '2024-01-08' }
];

// Load from LocalStorage when page starts
function loadFromStorage() {
    const stored = localStorage.getItem('knowledgeHubNotes');
    if (stored) {
        try {
            const parsedData = JSON.parse(stored);
            notesData = [...parsedData, ...notesData];
            console.log('✅ Loaded', parsedData.length, 'notes from storage');
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }
}

// Save to LocalStorage
function saveToStorage() {
    try {
        localStorage.setItem('knowledgeHubNotes', JSON.stringify(notesData));
        console.log('✅ Notes saved to storage');
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
}

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded, initializing Knowledge Hub...');
    
    // Load stored notes first
    loadFromStorage();
    
    // Display all notes
    displayAllNotes();
    
    // Attach event listeners
    attachListeners();
    
    console.log('✅ App initialized successfully - Total notes:', notesData.length);
});

// =============================
// DISPLAY FUNCTIONS
// =============================

function displayAllNotes() {
    const notesGrid = document.getElementById('notesGrid');
    
    if (!notesGrid) {
        console.error('❌ ERROR: notesGrid element not found!');
        return;
    }
    
    console.log('📝 Displaying', notesData.length, 'notes');
    
    if (notesData.length === 0) {
        notesGrid.innerHTML = '';
        const noNotes = document.getElementById('noNotes');
        if (noNotes) noNotes.style.display = 'block';
        return;
    }
    
    const noNotes = document.getElementById('noNotes');
    if (noNotes) noNotes.style.display = 'none';
    
    notesGrid.innerHTML = notesData.map((note, index) => `
        <div class="note-card" style="animation-delay: ${index * 0.1}s">
            <div class="note-header">
                <div class="note-icon">
                    ${getIcon(note.subject)}
                </div>
                <span class="note-subject">${note.subject}</span>
            </div>
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <p class="note-description">${escapeHtml(note.description)}</p>
            <p class="note-category">📁 ${escapeHtml(note.category)}</p>
            <div class="note-footer">
                <span class="note-date">${formatDate(note.date)}</span>
                <button class="note-download" onclick="downloadNote('${escapeHtml(note.file)}', ${note.id})">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
}

function getIcon(subject) {
    const icons = {
        'Mathematics': '<i class="fas fa-calculator"></i>',
        'Physics': '<i class="fas fa-atom"></i>',
        'Chemistry': '<i class="fas fa-flask"></i>',
        'Biology': '<i class="fas fa-leaf"></i>',
        'History': '<i class="fas fa-scroll"></i>',
        'Literature': '<i class="fas fa-book-open"></i>',
        'Programming': '<i class="fas fa-code"></i>',
        'Science': '<i class="fas fa-microscope"></i>'
    };
    return icons[subject] || '<i class="fas fa-book"></i>';
}

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================
// MODAL FUNCTIONS
// =============================

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        setTimeout(() => {
            modal.classList.remove('show');
        }, 3000);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// =============================
// ATTACH EVENT LISTENERS
// =============================

function attachListeners() {
    console.log('📌 Attaching event listeners...');
    
    // Upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
        console.log('✅ Upload form listener attached');
    }
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchNotes);
        console.log('✅ Search listener attached');
    }
    
    // Filter subject
    const filterSubject = document.getElementById('filterSubject');
    if (filterSubject) {
        filterSubject.addEventListener('change', searchNotes);
        console.log('✅ Filter listener attached');
    }
    
    // File upload
    const fileInput = document.getElementById('file');
    const fileLabel = document.querySelector('.file-input-label');
    
    if (fileInput && fileLabel) {
        // Click to upload
        fileLabel.addEventListener('click', () => fileInput.click());
        
        // File selected
        fileInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                const fileName = e.target.files[0].name;
                const fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
                
                if (fileSize > 10) {
                    alert('❌ File size must be less than 10MB. Current size: ' + fileSize + 'MB');
                    fileInput.value = '';
                    return;
                }
                
                const span = fileLabel.querySelector('span');
                if (span) {
                    span.textContent = '✓ ' + fileName + ' (' + fileSize + 'MB) selected';
                }
                fileLabel.style.borderColor = '#27ae60';
                fileLabel.style.background = 'rgba(39, 174, 96, 0.08)';
            }
        });
        
        // Drag and drop
        fileLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileLabel.style.borderColor = '#B8960F';
            fileLabel.style.background = 'rgba(212, 175, 55, 0.15)';
        });
        
        fileLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileLabel.style.borderColor = '#D4AF37';
            fileLabel.style.background = 'rgba(212, 175, 55, 0.05)';
        });
        
        fileLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileLabel.style.borderColor = '#D4AF37';
            fileLabel.style.background = 'rgba(212, 175, 55, 0.05)';
            
            if (e.dataTransfer.files[0]) {
                const fileName = e.dataTransfer.files[0].name;
                const fileSize = (e.dataTransfer.files[0].size / 1024 / 1024).toFixed(2);
                
                if (fileSize > 10) {
                    alert('❌ File size must be less than 10MB. Current size: ' + fileSize + 'MB');
                    return;
                }
                
                fileInput.files = e.dataTransfer.files;
                const span = fileLabel.querySelector('span');
                if (span) {
                    span.textContent = '✓ ' + fileName + ' (' + fileSize + 'MB) selected';
                }
            }
        });
        
        console.log('✅ File upload listeners attached');
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        console.log('✅ Contact form listener attached');
    }
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        console.log('✅ Mobile menu listeners attached');
    }
}

// =============================
// UPLOAD HANDLER
// =============================

function handleUpload(e) {
    e.preventDefault();
    console.log('📤 Upload started...');
    
    try {
        const title = document.getElementById('title').value.trim();
        const subject = document.getElementById('subject').value;
        const description = document.getElementById('description').value.trim();
        const file = document.getElementById('file').files[0];
        const category = document.getElementById('category').value.trim();
        
        // Validation
        if (!title) {
            alert('❌ Please enter a note title');
            console.warn('⚠️ Title is empty');
            return;
        }
        
        if (!subject) {
            alert('❌ Please select a subject');
            console.warn('⚠️ Subject not selected');
            return;
        }
        
        if (!file) {
            alert('❌ Please select a file to upload');
            console.warn('⚠️ No file selected');
            return;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('❌ File size must be less than 10MB. Your file is ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
            console.warn('⚠️ File too large:', file.size);
            return;
        }
        
        // Valid file types
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        if (!validTypes.includes(file.type)) {
            alert('❌ Invalid file type. Please upload: PDF, DOC, DOCX, TXT, or PPTX');
            console.warn('⚠️ Invalid file type:', file.type);
            return;
        }
        
        // Create new note
        const newNote = {
            id: Date.now(), // Use timestamp as unique ID
            title: title,
            subject: subject,
            description: description || 'No description provided',
            category: category || 'General',
            file: file.name,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add to beginning of array (newest first)
        notesData.unshift(newNote);
        console.log('✅ Note added successfully:', newNote);
        
        // Save to localStorage
        saveToStorage();
        
        // Reset form
        e.target.reset();
        const fileLabel = document.querySelector('.file-input-label');
        const fileSpan = fileLabel.querySelector('span');
        if (fileSpan) {
            fileSpan.textContent = 'Click to upload or drag and drop';
        }
        fileLabel.style.borderColor = '#D4AF37';
        fileLabel.style.background = 'rgba(212, 175, 55, 0.05)';
        
        // Show success modal
        showSuccessModal();
        console.log('✅ Success modal shown');
        
        // Refresh display
        displayAllNotes();
        
        // Scroll to notes section
        setTimeout(() => {
            const notesSection = document.getElementById('notes');
            if (notesSection) {
                notesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
        
        console.log('✅ Note upload complete! Total notes now:', notesData.length);
        
    } catch (error) {
        console.error('❌ Error in handleUpload:', error);
        alert('❌ An error occurred while uploading. Please try again.');
    }
}

// =============================
// SEARCH AND FILTER
// =============================

function searchNotes() {
    try {
        const searchInput = document.getElementById('searchInput');
        const filterSubject = document.getElementById('filterSubject');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedSubject = filterSubject ? filterSubject.value : '';
        
        console.log('🔍 Searching with term:', searchTerm, 'and subject:', selectedSubject);
        
        const filtered = notesData.filter(note => {
            const matchesSearch = 
                note.title.toLowerCase().includes(searchTerm) ||
                note.description.toLowerCase().includes(searchTerm) ||
                note.category.toLowerCase().includes(searchTerm);
            
            const matchesSubject = !selectedSubject || note.subject === selectedSubject;
            
            return matchesSearch && matchesSubject;
        });
        
        console.log('🔍 Found', filtered.length, 'matching notes');
        
        const notesGrid = document.getElementById('notesGrid');
        const noNotes = document.getElementById('noNotes');
        
        if (filtered.length === 0) {
            notesGrid.innerHTML = '';
            if (noNotes) noNotes.style.display = 'block';
        } else {
            if (noNotes) noNotes.style.display = 'none';
            
            notesGrid.innerHTML = filtered.map((note, index) => `
                <div class="note-card" style="animation-delay: ${index * 0.1}s">
                    <div class="note-header">
                        <div class="note-icon">
                            ${getIcon(note.subject)}
                        </div>
                        <span class="note-subject">${note.subject}</span>
                    </div>
                    <h3 class="note-title">${escapeHtml(note.title)}</h3>
                    <p class="note-description">${escapeHtml(note.description)}</p>
                    <p class="note-category">📁 ${escapeHtml(note.category)}</p>
                    <div class="note-footer">
                        <span class="note-date">${formatDate(note.date)}</span>
                        <button class="note-download" onclick="downloadNote('${escapeHtml(note.file)}', ${note.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('❌ Error in searchNotes:', error);
    }
}

// =============================
// DOWNLOAD FUNCTION
// =============================

function downloadNote(fileName, noteId) {
    console.log('📥 Download requested for:', fileName, 'Note ID:', noteId);
    
    try {
        // In a real app, this would trigger actual file download from server
        // For now, simulate a download
        const note = notesData.find(n => n.id === noteId);
        if (note) {
            alert('✅ Download Started!\n\n📄 File: ' + fileName + '\n📌 Note: ' + note.title + '\n\n⏱️ Downloading...\n\n(In production, this would download the actual file)');
            console.log('✅ Download initiated for note:', note);
        }
    } catch (error) {
        console.error('❌ Error in downloadNote:', error);
    }
}

// =============================
// CONTACT FORM HANDLER
// =============================

function handleContactForm(e) {
    e.preventDefault();
    console.log('📧 Contact form submitted');
    
    try {
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea');
        
        let contactData = {
            name: '',
            email: '',
            message: ''
        };
        
        inputs.forEach(input => {
            if (input.placeholder === 'Your Name') {
                contactData.name = input.value.trim();
            } else if (input.type === 'email') {
                contactData.email = input.value.trim();
            } else if (input.tagName === 'TEXTAREA') {
                contactData.message = input.value.trim();
            }
        });
        
        // Validation
        if (!contactData.name) {
            alert('❌ Please enter your name');
            return;
        }
        if (!contactData.email) {
            alert('❌ Please enter your email');
            return;
        }
        if (!contactData.message) {
            alert('❌ Please enter a message');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            alert('❌ Please enter a valid email address');
            return;
        }
        
        console.log('✅ Contact message valid:', contactData);
        
        // In production, this would send to backend
        // For now, save to localStorage
        let messages = localStorage.getItem('contactMessages');
        messages = messages ? JSON.parse(messages) : [];
        messages.push({
            ...contactData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        alert('✅ Message Sent Successfully!\n\nThank you ' + contactData.name + '!\nWe will get back to you at ' + contactData.email + ' within 24 hours.');
        console.log('✅ Contact message saved');
        
        form.reset();
        
    } catch (error) {
        console.error('❌ Error in contact form:', error);
        alert('❌ An error occurred. Please try again.');
    }
}

// =============================
// SCROLL EFFECTS
// =============================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 30px rgba(212, 175, 55, 0.2)';
        } else {
            navbar.style.boxShadow = '0 5px 30px rgba(212, 175, 55, 0.15)';
        }
    }
});

// =============================
// WELCOME MESSAGE
// =============================

window.addEventListener('load', function() {
    console.clear();
    console.log('%c🎓 KNOWLEDGE HUB', 'font-size: 28px; font-weight: bold; color: #D4AF37; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%c📚 Educational Platform for Sharing Knowledge', 'font-size: 16px; color: #1a1a1a; font-weight: 600;');
    console.log('%c\n✅ FEATURES:', 'font-size: 14px; color: #D4AF37; font-weight: bold;');
    console.log('📤 Upload Notes with Drag & Drop');
    console.log('🔍 Search & Filter by Subject');
    console.log('💾 Local Storage Auto-Save');
    console.log('📱 Fully Responsive Design');
    console.log('%c\n📊 APPLICATION STATUS:', 'font-size: 14px; color: #27ae60; font-weight: bold;');
    console.log('Total Notes Loaded:', notesData.length);
    console.log('Storage Enabled:', !!localStorage);
    console.log('%c\n✨ Ready to Use!', 'font-size: 16px; color: #D4AF37; font-weight: bold;');
});
