document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const getStartedBtn = document.querySelector('.cta-button');
    const templateSection = document.querySelector('.template-selection');
    const editorSection = document.querySelector('.editor');
    const previewContent = document.querySelector('.preview-content');
    const copyBtn = document.querySelector('.copy-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const goBackBtn = document.querySelector('.go-back-btn');
    const heroSection = document.querySelector('.hero');
    const skillInput = document.getElementById('skill-input');
    const skillLevel = document.getElementById('skill-level');
    const addSkillBtn = document.querySelector('.add-skill-btn');
    const skillsList = document.querySelector('.skills-list');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const projectsList = document.querySelector('.projects-list');
    const profileImageInput = document.getElementById('profile-image');

    // State
    let currentTemplate = '';
    let skills = [];
    let projects = [];

    // Function Declarations
    function updateSkillsList() {
        if (!skillsList) return;
        skillsList.innerHTML = skills.map((skill, index) => {
            const levelColors = {
                beginner: '#22c55e',
                intermediate: '#eab308',
                advanced: '#3b82f6'
            };
            return `
                <div class="skill-item ${skill.level}">
                    <span>
                        ${skill.name}
                        <span class="skill-level" style="background-color: ${levelColors[skill.level]}">
                            ${skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                        </span>
                    </span>
                    <button onclick="removeSkill(${index})" title="Remove skill">×</button>
                </div>
            `;
        }).join('');
    }

    function updateProjectsList() {
        if (!projectsList) return;
        projectsList.innerHTML = projects.map((project, index) => `
            <div class="project-item">
                <h4>${project.name}</h4>
                <p>${project.description}</p>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.url}</a>
                <div class="project-actions">
                    <button onclick="removeProject(${index})" title="Remove project">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Event Listeners
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            templateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    if (goBackBtn) {
        goBackBtn.addEventListener('click', () => {
            // Hide editor section
            editorSection.classList.remove('visible');
            editorSection.classList.add('hidden');
            
            // Show hero and templates sections
            heroSection.classList.remove('hidden');
            templateSection.classList.remove('hidden');
            
            // Scroll to templates section
            templateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Skills Management
    if (addSkillBtn && skillInput && skillLevel) {
        // Add skill on button click
        addSkillBtn.addEventListener('click', addSkill);
        
        // Add skill on Enter key
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }

    function addSkill() {
        const skill = skillInput.value.trim();
        const level = skillLevel.value;
        
        if (skill) {
            // Check for duplicates
            const isDuplicate = skills.some(s => 
                s.name.toLowerCase() === skill.toLowerCase() && 
                s.level === level
            );

            if (isDuplicate) {
                alert('This skill with the same level already exists!');
                return;
            }

            skills.push({ name: skill, level });
            updateSkillsList();
            skillInput.value = '';
            skillInput.focus();
            updatePreview();
        }
    }

    // Projects Management
    if (addProjectBtn) {
        // Add project on button click
        addProjectBtn.addEventListener('click', addProject);
        
        // Add project on Enter key in the last input field
        const projectUrl = document.getElementById('project-url');
        if (projectUrl) {
            projectUrl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addProject();
                }
            });
        }
    }

    function addProject() {
        const projectName = document.getElementById('project-name')?.value.trim();
        const projectDesc = document.getElementById('project-description')?.value.trim();
        const projectUrl = document.getElementById('project-url')?.value.trim();
        
        if (!projectName || !projectDesc || !projectUrl) {
            alert('Please fill in all project fields');
            return;
        }

        // Validate URL format
        try {
            new URL(projectUrl);
        } catch (e) {
            alert('Please enter a valid URL (e.g., https://github.com/username/project)');
            return;
        }

        // Check for duplicate project names
        if (projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
            alert('A project with this name already exists!');
            return;
        }

        projects.push({
            name: projectName,
            description: projectDesc,
            url: projectUrl
        });

        // Clear inputs
        document.getElementById('project-name').value = '';
        document.getElementById('project-description').value = '';
        document.getElementById('project-url').value = '';
        
        // Focus back on project name input
        document.getElementById('project-name').focus();
        
        updateProjectsList();
        updatePreview();
    }

    // Global Functions
    window.removeSkill = (index) => {
        skills.splice(index, 1);
        updateSkillsList();
        updatePreview();
        skillInput.focus();
    };

    window.removeProject = (index) => {
        if (confirm('Are you sure you want to remove this project?')) {
            projects.splice(index, 1);
            updateProjectsList();
            updatePreview();
            document.getElementById('project-name').focus();
        }
    };

    // Template Selection
    document.querySelectorAll('.select-template-btn').forEach(button => {
        button.addEventListener('click', () => {
            const templateCard = button.closest('.template-card');
            if (!templateCard) return;
            
            const templateId = templateCard.dataset.templateId;
            currentTemplate = templateId;
            
            // Hide hero and template sections, show editor
            if (heroSection) heroSection.classList.add('hidden');
            if (templateSection) templateSection.classList.add('hidden');
            if (editorSection) {
                editorSection.classList.remove('hidden');
                editorSection.classList.add('visible');
            }
            
            // Scroll to top with animation
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Reset all fields
            skills = [];
            projects = [];
            updateSkillsList();
            updateProjectsList();
            document.getElementById('profile-image').value = '';

            // Pre-fill template-specific content
            switch(templateId) {
                case 'minimal':
                    document.getElementById('name').value = 'John Doe';
                    document.getElementById('title').value = 'Developer';
                    document.getElementById('about').value = 'Building things with code.';
                    document.getElementById('github').value = 'https://github.com/johndoe';
                    document.getElementById('linkedin').value = 'https://linkedin.com/in/johndoe';
                    document.getElementById('twitter').value = 'https://twitter.com/johndoe';
                    document.getElementById('profile-image').value = 'https://github.com/johndoe.png';
                    break;

                case 'simple':
                    document.getElementById('name').value = 'John Doe';
                    document.getElementById('title').value = 'Full Stack Developer';
                    document.getElementById('about').value = 'Building software with passion and purpose.';
                    document.getElementById('github').value = 'https://github.com/johndoe';
                    document.getElementById('linkedin').value = 'https://linkedin.com/in/johndoe';
                    document.getElementById('twitter').value = 'https://twitter.com/johndoe';
                    document.getElementById('profile-image').value = 'https://github.com/johndoe.png';
                    
                    skills = [
                        { name: 'JavaScript', level: 'advanced' },
                        { name: 'React', level: 'advanced' },
                        { name: 'Node.js', level: 'advanced' }
                    ];
                    updateSkillsList();
                    break;

                case 'developer':
                    document.getElementById('name').value = 'John Doe';
                    document.getElementById('title').value = 'Senior Software Engineer | Open Source Contributor';
                    document.getElementById('about').value = 'Passionate software engineer with expertise in full-stack development and cloud technologies.';
                    document.getElementById('github').value = 'https://github.com/johndoe';
                    document.getElementById('linkedin').value = 'https://linkedin.com/in/johndoe';
                    document.getElementById('twitter').value = 'https://twitter.com/johndoe';
                    document.getElementById('profile-image').value = 'https://github.com/johndoe.png';
                    
                    skills = [
                        { name: 'React', level: 'advanced' },
                        { name: 'TypeScript', level: 'advanced' },
                        { name: 'Node.js', level: 'advanced' },
                        { name: 'Docker', level: 'intermediate' }
                    ];
                    projects = [
                        {
                            name: 'Project Alpha',
                            description: 'A revolutionary app built with React and Node.js',
                            url: 'https://github.com/johndoe/project-alpha'
                        },
                        {
                            name: 'Project Beta',
                            description: 'High-performance backend system using Go',
                            url: 'https://github.com/johndoe/project-beta'
                        }
                    ];
                    updateSkillsList();
                    updateProjectsList();
                    break;

                case 'stats':
                    document.getElementById('name').value = 'John Doe';
                    document.getElementById('title').value = 'Software Developer';
                    document.getElementById('about').value = 'Open source enthusiast and full-stack developer.';
                    document.getElementById('github').value = 'https://github.com/johndoe';
                    document.getElementById('linkedin').value = 'https://linkedin.com/in/johndoe';
                    document.getElementById('twitter').value = 'https://twitter.com/johndoe';
                    document.getElementById('profile-image').value = 'https://github.com/johndoe.png';
                    break;
            }

            // Update preview
            updatePreview();

            // Add input event listeners for live preview
            document.querySelectorAll('input, textarea').forEach(input => {
                // Remove existing listeners first to avoid duplicates
                input.removeEventListener('input', updatePreview);
                // Add new listener
                input.addEventListener('input', updatePreview);
            });
        });
    });

    // Add input event listeners for live preview on page load
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Preview Generation
    function updatePreview() {
        if (!previewContent) return;

        const name = document.getElementById('name')?.value || '';
        const title = document.getElementById('title')?.value || '';
        const about = document.getElementById('about')?.value || '';
        const github = document.getElementById('github')?.value || '';
        const linkedin = document.getElementById('linkedin')?.value || '';
        const twitter = document.getElementById('twitter')?.value || '';
        const website = document.getElementById('website')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const blog = document.getElementById('blog')?.value || '';
        const dribbble = document.getElementById('dribbble')?.value || '';
        const youtube = document.getElementById('youtube')?.value || '';
        const profileImageUrl = document.getElementById('profile-image')?.value || '';

        let markdown = '';
        
        switch (currentTemplate) {
            case 'minimal':
                if (profileImageUrl) {
                    markdown += `<img src="${profileImageUrl}" alt="Profile" width="200" height="200" style="border-radius: 50%;">\n\n`;
                }
                markdown += `# ${name}\n${title}\n\n${about}\n\n`;
                
                if (skills.length > 0) {
                    markdown += `### Skills\n`;
                    const skillsByLevel = skills.reduce((acc, skill) => {
                        if (!acc[skill.level]) acc[skill.level] = [];
                        acc[skill.level].push(skill.name);
                        return acc;
                    }, {});
                    
                    Object.entries(skillsByLevel).forEach(([level, levelSkills]) => {
                        markdown += `**${level.charAt(0).toUpperCase() + level.slice(1)}:** ${levelSkills.join(', ')}\n`;
                    });
                    markdown += '\n';
                }
                
                if (projects.length > 0) {
                    markdown += `### Projects\n`;
                    projects.forEach(project => {
                        markdown += `- [${project.name}](${project.url}) - ${project.description}\n`;
                    });
                    markdown += '\n';
                }
                
                markdown += `### Connect With Me\n`;
                let contacts = [];
                if (github) contacts.push(`[GitHub](${github})`);
                if (linkedin) contacts.push(`[LinkedIn](${linkedin})`);
                if (twitter) contacts.push(`[Twitter](${twitter})`);
                if (website) contacts.push(`[Website](${website})`);
                if (blog) contacts.push(`[Blog](${blog})`);
                if (dribbble) contacts.push(`[Dribbble](${dribbble})`);
                if (youtube) contacts.push(`[YouTube](${youtube})`);
                if (email) contacts.push(`[Email](mailto:${email})`);
                markdown += contacts.join(' • ');
                break;
                
            case 'simple':
                if (profileImageUrl) {
                    markdown += `<img src="${profileImageUrl}" alt="Profile" width="200" height="200" style="border-radius: 50%; margin-bottom: 20px;">\n\n`;
                }
                markdown += `# Hi there 👋 I'm ${name}\n\n${title}\n\n${about}\n\n## 🔗 Connect with me\n`;
                if (github) markdown += `[![GitHub](https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=GitHub&logoColor=white)](${github})\n`;
                if (linkedin) markdown += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=LinkedIn&logoColor=white)](${linkedin})\n`;
                if (twitter) markdown += `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white)](${twitter})\n`;
                if (website) markdown += `[![Website](https://img.shields.io/badge/Website-4CAF50?style=for-the-badge&logo=Google-Chrome&logoColor=white)](${website})\n`;
                if (blog) markdown += `[![Blog](https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=Blogger&logoColor=white)](${blog})\n`;
                if (dribbble) markdown += `[![Dribbble](https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white)](${dribbble})\n`;
                if (youtube) markdown += `[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=YouTube&logoColor=white)](${youtube})\n`;
                if (email) markdown += `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=Gmail&logoColor=white)](mailto:${email})\n`;
                
                if (skills.length > 0) {
                    markdown += `\n## 💻 Tech Stack\n`;
                    skills.forEach(skill => {
                        const color = skill.level === 'advanced' ? '3b82f6' : 
                                    skill.level === 'intermediate' ? 'eab308' : '22c55e';
                        markdown += `![${skill.name}](https://img.shields.io/badge/${skill.name}-${color}?style=for-the-badge&logo=${skill.name}&logoColor=white)\n`;
                    });
                }
                break;
                
            case 'developer':
                if (profileImageUrl) {
                    markdown += `<img src="${profileImageUrl}" alt="Profile" width="200" height="200" style="border-radius: 50%; margin-bottom: 20px;">\n\n`;
                }
                markdown += `# ${name}\n### ${title}\n\n${about}\n\n`;
                
                if (skills.length > 0) {
                    markdown += `🛠️ **Tech Stack**\n`;
                    const skillsByLevel = skills.reduce((acc, skill) => {
                        if (!acc[skill.level]) acc[skill.level] = [];
                        acc[skill.level].push(skill.name);
                        return acc;
                    }, {});
                    
                    Object.entries(skillsByLevel).forEach(([level, levelSkills]) => {
                        markdown += `- ${level.charAt(0).toUpperCase() + level.slice(1)}: ${levelSkills.map(s => `\`${s}\``).join(' ')}\n`;
                    });
                    markdown += '\n';
                }

                if (projects.length > 0) {
                    markdown += `🔭 **Featured Projects**\n`;
                    projects.forEach(project => {
                        markdown += `- [${project.name}](${project.url}) - ${project.description}\n`;
                    });
                    markdown += '\n';
                }
                
                if (github) {
                    const username = github.split('/').pop();
                    markdown += `📊 **GitHub Stats**\n`;
                    markdown += `<p align="center">\n`;
                    markdown += `  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=dark" alt="GitHub Stats" />\n`;
                    markdown += `  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark" alt="GitHub Streak" />\n`;
                    markdown += `</p>\n\n`;
                }
                
                markdown += `🤝 **Connect With Me**\n`;
                if (linkedin) markdown += `- [LinkedIn](${linkedin})\n`;
                if (twitter) markdown += `- [Twitter](${twitter})\n`;
                if (website) markdown += `- [Website](${website})\n`;
                if (blog) markdown += `- [Blog](${blog})\n`;
                if (dribbble) markdown += `- [Dribbble](${dribbble})\n`;
                if (youtube) markdown += `- [YouTube](${youtube})\n`;
                if (email) markdown += `- [Email](mailto:${email})\n`;
                break;
                
            case 'stats':
                if (github) {
                    const username = github.split('/').pop();
                    markdown = `# ${name}'s GitHub Stats\n\n<div align="center">\n\n`;
                    if (profileImageUrl) {
                        markdown += `<img src="${profileImageUrl}" alt="Profile" width="200" height="200" style="border-radius: 50%; margin-bottom: 20px;">\n\n`;
                    }
                    markdown += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical)\n\n`;
                    markdown += `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=radical)\n\n`;
                    markdown += `![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=radical)\n\n`;
                    
                    if (skills.length > 0) {
                        markdown += `### Skills\n`;
                        skills.forEach(skill => {
                            const color = skill.level === 'advanced' ? '3b82f6' : 
                                        skill.level === 'intermediate' ? 'eab308' : '22c55e';
                            markdown += `![${skill.name}](https://img.shields.io/badge/${skill.name}-${color}?style=for-the-badge&logo=${skill.name}&logoColor=white)\n`;
                        });
                        markdown += '\n';
                    }
                    
                    markdown += `### Connect With Me\n`;
                    if (linkedin) markdown += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=LinkedIn&logoColor=white)](${linkedin})\n`;
                    if (twitter) markdown += `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=Twitter&logoColor=white)](${twitter})\n`;
                    if (website) markdown += `[![Website](https://img.shields.io/badge/Website-4CAF50?style=for-the-badge&logo=Google-Chrome&logoColor=white)](${website})\n`;
                    if (blog) markdown += `[![Blog](https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=Blogger&logoColor=white)](${blog})\n`;
                    if (dribbble) markdown += `[![Dribbble](https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white)](${dribbble})\n`;
                    if (youtube) markdown += `[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=YouTube&logoColor=white)](${youtube})\n`;
                    if (email) markdown += `[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=Gmail&logoColor=white)](mailto:${email})\n\n`;
                    
                    markdown += `### Contributions\n`;
                    markdown += `![Contribution Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark)\n\n`;
                    markdown += `### Profile Views\n`;
                    markdown += `![Profile Views](https://komarev.com/ghpvc/?username=${username}&color=blueviolet)\n\n`;
                    markdown += `### Trophy Case\n`;
                    markdown += `![Trophies](https://github-profile-trophy.vercel.app/?username=${username}&theme=darkhub&row=1)\n\n`;
                    markdown += `</div>`;
                } else {
                    markdown = `# ${name}'s GitHub Stats\n\nPlease add your GitHub profile URL to see the stats.`;
                }
                break;
        }

        // Update the preview content
        previewContent.textContent = markdown;
        const previewArea = document.querySelector('.preview-area');
        if (previewArea) {
            previewArea.style.display = 'block';
        }
    }

    // Copy and Download functionality
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!previewContent) return;
            navigator.clipboard.writeText(previewContent.textContent)
                .then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Markdown';
                    }, 2000);
                });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!previewContent) return;
            const blob = new Blob([previewContent.textContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'README.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}); 