import { registerUser } from "../api/authService";
import { ApiError } from "../errors/apiError";

interface RegisterUser {
name: string,
email: string,
password: string,
}


interface RegisterFormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    confirmPassword: HTMLInputElement;
}

const registrationForm = document.getElementById('registration-form') as HTMLFormElement;

registrationForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const elements = registrationForm.elements as RegisterFormElements;

    const formData: RegisterUser =  {
        name: elements.name.value,
        email: elements.email.value,
        password: elements.password.value
    }
    const confirmPassword = elements.confirmPassword.value;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;

    if (!emailRegex.test(formData.email)) {
        console.log('Please use a valid email format, "@stud.noroff.no" ');
        return;
    }
    else if (formData.password.length < 8) {
        console.log('Password must contain atleast 8 characters.');
        return;
    } 
    else if (formData.password !== confirmPassword) {
        console.log('Passwords do not match.');
        return;
    }
    try {
        const profile = await registerUser(formData);
        console.log(`Successful registration! ${profile.name}`);
    }catch(error) {
       if (error instanceof ApiError) {
        if (error.status === 409) {
            console.log('Credentials already in use.')
            return;
        }else if (error.status === 400) {
            console.log(error.message);
        }else if (error.status === 500) {
            console.log('Please try again later.');
        }else {
            console.log('Something unknown went wrong, please try again later.');
        }
       }
    }
})

    

