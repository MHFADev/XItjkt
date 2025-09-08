// React Components untuk Portfolio Interaktif

// 1. Interactive Project Showcase Component
class ProjectShowcase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProject: 0,
            isPlaying: false,
            projects: [
                {
                    id: 1,
                    title: "Portfolio Website",
                    description: "Website portfolio responsif dengan animasi 3D dan tema yin-yang",
                    technologies: ["React", "Three.js", "Flask", "Tailwind CSS"],
                    features: ["3D Animations", "Dark/Light Theme", "Responsive Design", "Email Integration"],
                    status: "Completed",
                    progress: 100
                },
                {
                    id: 2,
                    title: "IT Support Dashboard",
                    description: "Dashboard untuk monitoring dan manajemen IT support sekolah",
                    technologies: ["Python", "Flask", "SQLite", "Bootstrap"],
                    features: ["Real-time Monitoring", "Ticket System", "Hardware Tracking"],
                    status: "In Progress",
                    progress: 75
                },
                {
                    id: 3,
                    title: "Learning Management System",
                    description: "Platform pembelajaran online untuk siswa SMK",
                    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
                    features: ["Live Classes", "Assignment Submission", "Real-time Chat"],
                    status: "Planning",
                    progress: 25
                }
            ]
        };
    }

    componentDidMount() {
        this.startAutoPlay();
    }

    componentWillUnmount() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    startAutoPlay = () => {
        this.autoPlayInterval = setInterval(() => {
            if (this.state.isPlaying) {
                this.setState(prevState => ({
                    selectedProject: (prevState.selectedProject + 1) % prevState.projects.length
                }));
            }
        }, 4000);
    }

    toggleAutoPlay = () => {
        this.setState(prevState => ({ isPlaying: !prevState.isPlaying }));
    }

    selectProject = (index) => {
        this.setState({ selectedProject: index });
    }

    render() {
        const { projects, selectedProject, isPlaying } = this.state;
        const currentProject = projects[selectedProject];

        return React.createElement('div', {
            className: 'react-project-showcase bg-yang/50 dark:bg-yin/50 backdrop-blur-md rounded-2xl p-6 border border-yin/10 dark:border-yang/10'
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'flex justify-between items-center mb-6'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-2xl font-bold gradient-text'
                }, '🚀 Interactive Project Showcase'),
                React.createElement('button', {
                    key: 'play-btn',
                    onClick: this.toggleAutoPlay,
                    className: `px-4 py-2 rounded-lg transition-all duration-300 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`
                }, isPlaying ? '⏸️ Pause' : '▶️ Play')
            ]),

            // Project Navigation
            React.createElement('div', {
                key: 'navigation',
                className: 'flex space-x-2 mb-6 overflow-x-auto pb-2'
            }, projects.map((project, index) =>
                React.createElement('button', {
                    key: project.id,
                    onClick: () => this.selectProject(index),
                    className: `flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedProject === index 
                            ? 'bg-yin dark:bg-yang text-yang dark:text-yin' 
                            : 'bg-yin/10 dark:bg-yang/10 hover:bg-yin/20 dark:hover:bg-yang/20'
                    }`
                }, project.title)
            )),

            // Current Project Display
            React.createElement('div', {
                key: 'current-project',
                className: 'animate-fade-in-up'
            }, [
                React.createElement('div', {
                    key: 'project-header',
                    className: 'flex justify-between items-start mb-4'
                }, [
                    React.createElement('div', { key: 'project-info' }, [
                        React.createElement('h4', {
                            key: 'project-title',
                            className: 'text-xl font-semibold mb-2'
                        }, currentProject.title),
                        React.createElement('p', {
                            key: 'project-desc',
                            className: 'text-yin/70 dark:text-yang/70 mb-4'
                        }, currentProject.description)
                    ]),
                    React.createElement('span', {
                        key: 'project-status',
                        className: `px-3 py-1 rounded-full text-sm font-medium ${
                            currentProject.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            currentProject.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`
                    }, currentProject.status)
                ]),

                // Progress Bar
                React.createElement('div', {
                    key: 'progress-section',
                    className: 'mb-4'
                }, [
                    React.createElement('div', {
                        key: 'progress-label',
                        className: 'flex justify-between mb-2'
                    }, [
                        React.createElement('span', {
                            key: 'progress-text',
                            className: 'text-sm font-medium'
                        }, 'Progress'),
                        React.createElement('span', {
                            key: 'progress-percent',
                            className: 'text-sm font-medium'
                        }, `${currentProject.progress}%`)
                    ]),
                    React.createElement('div', {
                        key: 'progress-bar-container',
                        className: 'w-full bg-yin/10 dark:bg-yang/10 rounded-full h-2'
                    }, React.createElement('div', {
                        key: 'progress-bar',
                        className: 'bg-gradient-to-r from-yin to-yin-soft dark:from-yang dark:to-yang-soft h-2 rounded-full transition-all duration-1000',
                        style: { width: `${currentProject.progress}%` }
                    }))
                ]),

                // Technologies
                React.createElement('div', {
                    key: 'technologies',
                    className: 'mb-4'
                }, [
                    React.createElement('h5', {
                        key: 'tech-title',
                        className: 'font-medium mb-2'
                    }, '🛠️ Technologies:'),
                    React.createElement('div', {
                        key: 'tech-list',
                        className: 'flex flex-wrap gap-2'
                    }, currentProject.technologies.map((tech, index) =>
                        React.createElement('span', {
                            key: index,
                            className: 'px-3 py-1 bg-yin/10 dark:bg-yang/10 rounded-full text-sm font-medium'
                        }, tech)
                    ))
                ]),

                // Features
                React.createElement('div', {
                    key: 'features',
                    className: 'mb-4'
                }, [
                    React.createElement('h5', {
                        key: 'features-title',
                        className: 'font-medium mb-2'
                    }, '✨ Features:'),
                    React.createElement('ul', {
                        key: 'features-list',
                        className: 'list-disc list-inside space-y-1 text-sm text-yin/70 dark:text-yang/70'
                    }, currentProject.features.map((feature, index) =>
                        React.createElement('li', { key: index }, feature)
                    ))
                ])
            ])
        ]);
    }
}

// 2. Skill Level Calculator Component
class SkillCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSkill: '',
            experience: 0,
            projects: 0,
            learning: 0,
            calculatedLevel: 0,
            skillData: {
                'HTML/CSS': { base: 90, projects: 15, experience: 24 },
                'JavaScript': { base: 85, projects: 12, experience: 18 },
                'React': { base: 54, projects: 8, experience: 12 },
                'Python': { base: 70, projects: 10, experience: 15 },
                'Node.js': { base: 60, projects: 6, experience: 12 }
            }
        };
    }

    calculateSkillLevel = (skill, experience, projects, learning) => {
        const base = this.state.skillData[skill]?.base || 50;
        const experienceBonus = Math.min(experience * 2, 20);
        const projectBonus = Math.min(projects * 3, 15);
        const learningBonus = Math.min(learning * 1.5, 10);
        
        return Math.min(base + experienceBonus + projectBonus + learningBonus, 100);
    }

    handleCalculate = () => {
        const { currentSkill, experience, projects, learning } = this.state;
        if (currentSkill) {
            const level = this.calculateSkillLevel(currentSkill, experience, projects, learning);
            this.setState({ calculatedLevel: level });
        }
    }

    render() {
        const { currentSkill, experience, projects, learning, calculatedLevel, skillData } = this.state;

        return React.createElement('div', {
            className: 'react-skill-calculator bg-yang/50 dark:bg-yin/50 backdrop-blur-md rounded-2xl p-6 border border-yin/10 dark:border-yang/10'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-2xl font-bold gradient-text mb-6'
            }, '🧮 Skill Level Calculator'),

            React.createElement('div', {
                key: 'form',
                className: 'space-y-4'
            }, [
                // Skill Selection
                React.createElement('div', { key: 'skill-select' }, [
                    React.createElement('label', {
                        key: 'skill-label',
                        className: 'block font-medium mb-2'
                    }, 'Pilih Skill:'),
                    React.createElement('select', {
                        key: 'skill-dropdown',
                        value: currentSkill,
                        onChange: (e) => this.setState({ currentSkill: e.target.value }),
                        className: 'w-full p-3 border border-yin/20 dark:border-yang/20 rounded-lg bg-yang dark:bg-yin'
                    }, [
                        React.createElement('option', { key: 'default', value: '' }, 'Pilih skill...'),
                        ...Object.keys(skillData).map(skill =>
                            React.createElement('option', { key: skill, value: skill }, skill)
                        )
                    ])
                ]),

                // Experience Slider
                React.createElement('div', { key: 'experience' }, [
                    React.createElement('label', {
                        key: 'exp-label',
                        className: 'block font-medium mb-2'
                    }, `Pengalaman (bulan): ${experience}`),
                    React.createElement('input', {
                        key: 'exp-slider',
                        type: 'range',
                        min: 0,
                        max: 36,
                        value: experience,
                        onChange: (e) => this.setState({ experience: parseInt(e.target.value) }),
                        className: 'w-full h-2 bg-yin/20 dark:bg-yang/20 rounded-lg appearance-none cursor-pointer'
                    })
                ]),

                // Projects Slider
                React.createElement('div', { key: 'projects' }, [
                    React.createElement('label', {
                        key: 'proj-label',
                        className: 'block font-medium mb-2'
                    }, `Jumlah Proyek: ${projects}`),
                    React.createElement('input', {
                        key: 'proj-slider',
                        type: 'range',
                        min: 0,
                        max: 20,
                        value: projects,
                        onChange: (e) => this.setState({ projects: parseInt(e.target.value) }),
                        className: 'w-full h-2 bg-yin/20 dark:bg-yang/20 rounded-lg appearance-none cursor-pointer'
                    })
                ]),

                // Learning Hours Slider
                React.createElement('div', { key: 'learning' }, [
                    React.createElement('label', {
                        key: 'learn-label',
                        className: 'block font-medium mb-2'
                    }, `Jam Belajar/Minggu: ${learning}`),
                    React.createElement('input', {
                        key: 'learn-slider',
                        type: 'range',
                        min: 0,
                        max: 40,
                        value: learning,
                        onChange: (e) => this.setState({ learning: parseInt(e.target.value) }),
                        className: 'w-full h-2 bg-yin/20 dark:bg-yang/20 rounded-lg appearance-none cursor-pointer'
                    })
                ]),

                // Calculate Button
                React.createElement('button', {
                    key: 'calc-btn',
                    onClick: this.handleCalculate,
                    disabled: !currentSkill,
                    className: 'w-full py-3 px-6 bg-gradient-to-r from-yin to-yin-soft dark:from-yang dark:to-yang-soft text-yang dark:text-yin rounded-lg font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }, '🚀 Hitung Level Skill')
            ]),

            // Result Display
            calculatedLevel > 0 && React.createElement('div', {
                key: 'result',
                className: 'mt-6 p-4 bg-gradient-to-r from-yin/10 to-yin-soft/10 dark:from-yang/10 dark:to-yang-soft/10 rounded-lg'
            }, [
                React.createElement('h4', {
                    key: 'result-title',
                    className: 'font-bold mb-2'
                }, `Level ${currentSkill}:`),
                React.createElement('div', {
                    key: 'level-bar',
                    className: 'flex items-center space-x-4'
                }, [
                    React.createElement('div', {
                        key: 'bar-container',
                        className: 'flex-1 bg-yin/20 dark:bg-yang/20 rounded-full h-4'
                    }, React.createElement('div', {
                        key: 'level-fill',
                        className: 'bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold',
                        style: { width: `${calculatedLevel}%` }
                    }, `${Math.round(calculatedLevel)}%`)),
                    React.createElement('span', {
                        key: 'level-text',
                        className: 'font-bold text-lg'
                    }, this.getLevelName(calculatedLevel))
                ])
            ])
        ]);
    }

    getLevelName(level) {
        if (level >= 90) return '🌟 Expert';
        if (level >= 75) return '🔥 Advanced';
        if (level >= 60) return '💪 Intermediate';
        if (level >= 40) return '📚 Beginner';
        return '🌱 Novice';
    }
}

// Initialize React Components
document.addEventListener('DOMContentLoaded', function() {
    // Mount Project Showcase
    const projectContainer = document.getElementById('react-project-showcase');
    if (projectContainer) {
        ReactDOM.render(React.createElement(ProjectShowcase), projectContainer);
    }

    // Mount Skill Calculator
    const skillContainer = document.getElementById('react-skill-calculator');
    if (skillContainer) {
        ReactDOM.render(React.createElement(SkillCalculator), skillContainer);
    }
});