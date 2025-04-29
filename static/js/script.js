


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const classifyBtn = document.getElementById('classifyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const previewSection = document.getElementById('previewSection');
    const previewContainer = document.getElementById('previewContainer');
    const resultsSection = document.getElementById('resultsSection');
    const resultsGrid = document.getElementById('resultsGrid');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Variables
    let selectedFile = null;

    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect({ target: fileInput });
        }
    });
    
    classifyBtn.addEventListener('click', classifyImage);
    resetBtn.addEventListener('click', resetAll);

    // Functions
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }
        
        selectedFile = file;
        displayPreview(file);
        classifyBtn.disabled = false;
        resetBtn.disabled = false;
    }

    function displayPreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewContainer.innerHTML = '';
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-preview';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Selected image preview';
            
            imgContainer.appendChild(img);
            previewContainer.appendChild(imgContainer);
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    }

    function classifyImage() {
        if (!selectedFile) return;
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        classifyBtn.disabled = true;
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Get more accurate mock results based on filename
            const fileName = selectedFile.name.toLowerCase();
            const results = generateAccurateMockResults(fileName);
            
            // Display results
            displayResults(results);
            
            // Show results section
            resultsSection.style.display = 'block';
        }, 2000);
    }

    function generateAccurateMockResults(filename) {
        // Determine which category set to use based on filename
        let selectedCategories;
        
        if (filename.includes('cat') || filename.includes('kitten') || filename.includes('feline')) {
            selectedCategories = [
                { label: 'Cat', confidence: 92 },
                { label: 'Kitten', confidence: 85 },
                { label: 'Domestic Animal', confidence: 80 },
                { label: 'Pet', confidence: 75 },
                { label: 'Mammal', confidence: 70 }
            ];
        } 
        else if (filename.includes('dog') || filename.includes('puppy') || filename.includes('canine')) {
            selectedCategories = [
                { label: 'Dog', confidence: 90 },
                { label: 'Puppy', confidence: 82 },
                { label: 'Canine', confidence: 78 },
                { label: 'Pet', confidence: 75 },
                { label: 'Mammal', confidence: 70 }
            ];
        }
        else if (filename.includes('bird') || filename.includes('eagle') || filename.includes('parrot')) {
            selectedCategories = [
                { label: 'Bird', confidence: 88 },
                { label: 'Avian', confidence: 80 },
                { label: 'Flying Animal', confidence: 75 },
                { label: 'Wildlife', confidence: 70 },
                { label: 'Animal', confidence: 65 }
            ];
        }
        else if (filename.includes('car') || filename.includes('vehicle') || filename.includes('auto')) {
            selectedCategories = [
                { label: 'Car', confidence: 95 },
                { label: 'Vehicle', confidence: 85 },
                { label: 'Automobile', confidence: 80 },
                { label: 'Transportation', confidence: 70 },
                { label: 'Machine', confidence: 65 }
            ];
        }
        else if (filename.includes('flower') || filename.includes('rose') || filename.includes('tulip')) {
            selectedCategories = [
                { label: 'Flower', confidence: 90 },
                { label: 'Plant', confidence: 85 },
                { label: 'Rose', confidence: 75 },
                { label: 'Tulip', confidence: 65 },
                { label: 'Botany', confidence: 60 }
            ];
        }
        else if (filename.includes('mountain') || filename.includes('peak') || filename.includes('alps')) {
            selectedCategories = [
                { label: 'Mountain', confidence: 95 },
                { label: 'Landscape', confidence: 85 },
                { label: 'Nature', confidence: 80 },
                { label: 'Peak', confidence: 75 },
                { label: 'Outdoors', confidence: 70 }
            ];
        }
        else {
            // Default to animals with some randomization
            selectedCategories = [
                { label: 'Cat', confidence: 85 },
                { label: 'Dog', confidence: 75 },
                { label: 'Bird', confidence: 60 },
                { label: 'Fish', confidence: 40 },
                { label: 'Rabbit', confidence: 30 }
            ].map(item => ({
                label: item.label,
                confidence: Math.min(100, Math.max(5, item.confidence + Math.floor(Math.random() * 20) - 10))
            })).sort((a, b) => b.confidence - a.confidence);
        }
        
        return selectedCategories;
    }

    function displayResults(results) {
        resultsGrid.innerHTML = '';
        
        // Add top result
        const topResult = document.createElement('div');
        topResult.className = 'top-result result-card';
        topResult.innerHTML = `
            <h3>Top Prediction</h3>
            <p>${results[0].label}</p>
            <div class="confidence-meter">
                <div class="confidence-level" style="width: ${results[0].confidence}%"></div>
            </div>
            <p class="confidence-value">${results[0].confidence}% confidence</p>
        `;
        resultsGrid.appendChild(topResult);
        
        // Add other results
        results.slice(1).forEach(result => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <h3>${result.label}</h3>
                <div class="confidence-meter">
                    <div class="confidence-level" style="width: ${result.confidence}%"></div>
                </div>
                <p class="confidence-value">${result.confidence}% confidence</p>
            `;
            resultsGrid.appendChild(card);
        });
    }

    function resetAll() {
        selectedFile = null;
        fileInput.value = '';
        previewContainer.innerHTML = '';
        previewSection.style.display = 'none';
        resultsSection.style.display = 'none';
        classifyBtn.disabled = true;
        resetBtn.disabled = true;
    }
});