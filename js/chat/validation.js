export const validation = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(value),
            message: emailRegex.test(value) ? '' : 'Please enter a valid email address'
        };
    },
    
    required: (value) => ({
        isValid: value.trim().length > 0,
        message: value.trim().length > 0 ? '' : 'This field is required'
    }),
    
    maxLength: (value, max) => ({
        isValid: value.length <= max,
        message: value.length <= max ? '' : `Maximum ${max} characters allowed`
    })
}