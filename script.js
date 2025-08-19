// Create particles effect
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 70;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `float ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
        particle.style.opacity = Math.random() * 0.7 + 0.1;
        
        container.appendChild(particle);
    }
}

// Compile and execute EBPL code
async function runCode() {
    const editor = document.getElementById('editor');
    const output = document.getElementById('output');
    const runButton = document.querySelector('.btn-run');
    
    runButton.innerHTML = '<i class="fas fa-sync fa-spin"></i> EXECUTING';
    runButton.classList.add('pulse');
    
    try {
        const response = await fetch('http://localhost:3000/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: editor.value
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Format output with syntax highlighting
            let formattedOutput = '';
            const lines = result.output.split('\n');
            
            for (const line of lines) {
                if (line.trim() === '') continue;
                
                if (line.startsWith('"') && line.endsWith('"')) {
                    formattedOutput += `<span class="ebpl-string">${line}</span>\n`;
                } else if (!isNaN(line)) {
                    formattedOutput += `<span class="ebpl-number">${line}</span>\n`;
                } else if (line === 'true' || line === 'false') {
                    formattedOutput += `<span class="ebpl-keyword">${line}</span>\n`;
                } else {
                    formattedOutput += `<span class="ebpl-identifier">${line}</span>\n`;
                }
            }
            
            // Add execution info
            formattedOutput += `\n<span class="ebpl-comment"># Execution successful</span>\n`;
            formattedOutput += `<span class="ebpl-comment"># Generated JavaScript:</span>\n`;
            formattedOutput += `<pre>${result.jsCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
            
            output.innerHTML = formattedOutput;
        } else {
            output.innerHTML = `<span style="color: #ff5f56;">${result.error}</span>`;
        }
    } catch (error) {
        output.innerHTML = `<span style="color: #ff5f56;">Network error: ${error.message}</span>`;
    } finally {
        runButton.innerHTML = '<i class="fas fa-play"></i> EXECUTE';
        runButton.classList.remove('pulse');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Add event listeners
    document.getElementById('executeBtn').addEventListener('click', runCode);
    
    document.getElementById('newFileBtn').addEventListener('click', function() {
        document.getElementById('editor').value = '';
    });
    
    document.getElementById('clearOutputBtn').addEventListener('click', function() {
        document.getElementById('output').textContent = 'Output cleared';
        setTimeout(() => {
            document.getElementById('output').textContent = 'Results will appear here after execution';
        }, 1500);
    });
    
    document.getElementById('exportBtn').addEventListener('click', function() {
        const code = document.getElementById('editor').value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ebpl-program.ebpl';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});