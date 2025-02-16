import { conversationFlow } from './conversation.js';
import { validation } from './validation.js';

class ChatWidget {
    constructor() {
        this.currentStep = 'start';
        this.isOpen = false;
        this.userResponses = {
            timestamp: new Date().toISOString(),
            answers: {}
        };
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
    }
    
    attachEventListeners() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        document.querySelector('.close-button').addEventListener('click', () => this.toggleChat());
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen && this.chatMessages.children.length === 0) {
            this.showStep(this.currentStep);
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showOptions(options, allowMultiple = false) {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        let selectionSummary;
        if (allowMultiple) {
            selectionSummary = document.createElement('div');
            selectionSummary.classList.add('selection-summary');
            selectionSummary.style.display = 'none';
            optionsContainer.appendChild(selectionSummary);
        }

        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            if (option.toLowerCase().includes('continue')) {
                button.classList.add('continue-button');
            }

            const buttonText = document.createElement('span');
            buttonText.textContent = option;

            const checkmark = document.createElement('span');
            checkmark.textContent = '✓';
            checkmark.classList.add('checkmark');

            button.appendChild(buttonText);
            button.appendChild(checkmark);

            button.onclick = () => {
                if (allowMultiple) {
                    if (option.toLowerCase().includes('continue')) {
                        const selectedOptions = Array.from(optionsContainer.querySelectorAll('.option-button.selected'))
                            .map(btn => btn.querySelector('span').textContent)
                            .filter(text => !text.toLowerCase().includes('continue'));

                        if (selectedOptions.length > 0) {
                            this.handleOption(selectedOptions, true);
                        }
                    } else {
                        button.classList.toggle('selected');
                        const selectedOptions = Array.from(optionsContainer.querySelectorAll('.option-button.selected'))
                            .map(btn => btn.querySelector('span').textContent)
                            .filter(text => !text.toLowerCase().includes('continue'));

                        if (selectedOptions.length > 0) {
                            selectionSummary.textContent = 'Selected: ' + selectedOptions.join(', ');
                            selectionSummary.style.display = 'block';
                        } else {
                            selectionSummary.style.display = 'none';
                        }
                    }
                } else {
                    this.handleOption(option, false);
                }
            };
            optionsContainer.appendChild(button);
        });

        this.chatMessages.appendChild(optionsContainer);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showForm(fields) {
        const form = document.createElement('div');
        form.classList.add('options-container');

        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        form.appendChild(errorContainer);

        fields.forEach(field => {
            const input = document.createElement('input');
            input.type = field.name === 'email' ? 'email' : 'text';
            input.placeholder = field.label;
            input.classList.add('input-field');
            input.maxLength = field.name === 'description' || field.name === 'expected_outcome' ? 256 : 100;

            input.addEventListener('input', () => {
                const validations = [];
                validations.push(validation.required(input.value));
                validations.push(validation.maxLength(input.value, input.maxLength));

                if (field.name === 'email') {
                    validations.push(validation.email(input.value));
                }

                const error = validations.find(v => !v.isValid);
                if (error) {
                    errorContainer.textContent = error.message;
                    errorContainer.style.display = 'block';
                } else {
                    errorContainer.style.display = 'none';
                }
            });

            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.classList.add('option-button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = () => this.handleFormSubmit(form);
        form.appendChild(submitButton);

        this.chatMessages.appendChild(form);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async sendToBackend(data) {
        try {
            const response = await fetch('https://softwine-questionnaire-654206846542.us-central1.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error sending data:', error);
            throw error;
        }
    }

    async handleFormSubmit(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input');
        let isValid = true;
        let firstInvalidInput = null;
        const errorContainer = form.querySelector('.error-message');

        inputs.forEach(input => {
            const validations = [];
            validations.push(validation.required(input.value));
            validations.push(validation.maxLength(input.value, input.maxLength));

            if (input.type === 'email') {
                validations.push(validation.email(input.value));
            }

            const error = validations.find(v => !v.isValid);
            if (error) {
                isValid = false;
                errorContainer.textContent = error.message;
                errorContainer.style.display = 'block';
                if (!firstInvalidInput) firstInvalidInput = input;
            }

            formData[input.type] = input.value;
        });

        if (isValid) {
            errorContainer.style.display = 'none';
            this.userResponses.answers[this.currentStep] = formData;
            this.saveResponses();

            const nextStep = conversationFlow[this.currentStep].next;
            this.currentStep = nextStep;
            this.showStep(this.currentStep);
        } else if (firstInvalidInput) {
            firstInvalidInput.focus();
        }
        try {
            if (this.currentStep === 'summary') {
                await this.sendToBackend({
                    timestamp: this.userResponses.timestamp,
                    responses: this.userResponses.answers
                });
            }
        } catch (error) {
            this.addMessage("There was an error submitting your consultation. Please try again.", 'bot');
        }
    }

    handleOption(option, allowMultiple) {
        if (allowMultiple && Array.isArray(option)) {
            this.addMessage("Selected: " + option.join(", "), 'user');
            this.userResponses.answers[this.currentStep] = option;
            const nextStep = conversationFlow[this.currentStep].next;
            this.currentStep = nextStep;
            this.showStep(this.currentStep);
        } else if (!allowMultiple) {
            this.addMessage(option, 'user');
        }

        if (this.currentStep === 'summary' && option === "Yes, show summary") {
            this.addMessage(this.showSummary(), 'bot');
        }

        if (allowMultiple && option !== "Continue to contact info") {
            if (!this.userResponses.answers[this.currentStep]) {
                this.userResponses.answers[this.currentStep] = [];
            }
            this.userResponses.answers[this.currentStep].push(option);
            return;
        }

        let nextStep;
        if (typeof conversationFlow[this.currentStep].next === 'string') {
            nextStep = conversationFlow[this.currentStep].next;
        } else {
            nextStep = conversationFlow[this.currentStep].next[option];
        }

        if (!allowMultiple) {
            this.userResponses.answers[this.currentStep] = option;
        }

        this.saveResponses();
        if (nextStep) {
            this.currentStep = nextStep;
            this.showStep(this.currentStep);
        }
    }

    showStep(step) {
        const currentStepData = conversationFlow[step];
        this.addMessage(currentStepData.message, 'bot');

        if (currentStepData.type === 'form') {
            this.showForm(currentStepData.fields);
        } else if (currentStepData.options) {
            this.showOptions(currentStepData.options, currentStepData.allowMultiple);
        }
    }

    saveResponses() {
        console.log('Saved responses:', this.userResponses);
        localStorage.setItem('chatbot_responses', JSON.stringify(this.userResponses));
    }

    showSummary() {
        let summaryText = "📋 Consultation Summary<br><br>";

        const sectionNames = {
            project_type: "Project Type",
            new_system_details: "Project Description",
            similar_solutions: "Similar Solutions",
            ai_enhancement_needs: "AI Capabilities Needed",
            data_availability: "Data Status",
            project_scale: "Organization Size",
            timeline: "Timeline",
            current_challenges: "Current Challenges",
            budget_range: "Budget Range",
            contact_info: "Contact Information"
        };

        for (const [key, value] of Object.entries(this.userResponses.answers)) {
            if (value && sectionNames[key]) {
                summaryText += `▶ ${sectionNames[key]}<br>`;
                const formattedValue = this.formatValue(key, value);
                if (formattedValue) {
                    summaryText += `${formattedValue}<br><br>`;
                }
            }
        }

        summaryText += `Consultation Date: ${new Date(this.userResponses.timestamp).toLocaleString()}`;
        return summaryText;
    }

    formatValue(key, value) {
        if (!value) return "";

        if (Array.isArray(value)) {
            return value.map(item => `• ${item}`).join('<br>');
        }

        if (key === "contact_info" && typeof value === "object") {
            const contactInfo = [];
            if (value.text) contactInfo.push(`• Name: ${value.text}`);
            if (value.email) contactInfo.push(`• Email: ${value.email}`);
            if (value.company) contactInfo.push(`• Company: ${value.company}`);
            return contactInfo.join('<br>');
        }

        return value;
    }
}

// Initialize chat widget
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});