import React from "react";
import ContactForm from './ContactForm';
import { render, screen, fireEvent, act } from "@testing-library/react";



test('Can render the form without errors', () => {

    render(<ContactForm />)

})

test('Adds user data object to the DOM when form is filled out and submitted & testing that there are no validation errors', async () => {

    // render ContactForm
    render(<ContactForm />)


    // Query for inputs
    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const email = screen.getByLabelText(/email/i)
    const message = screen.getByLabelText(/message/i)

    // Fill out inputs
    fireEvent.change(firstName, { target: { value: 'Greg' }})
    fireEvent.change(lastName, { target: { value: 'Wilson' }})
    fireEvent.change(email, { target: { value: 'gjwilson7390@gmail.com' }})
    fireEvent.change(message, { target: { value: 'What is up?' }})

   

    

    await act(async () => {
        fireEvent.blur(firstName)
        fireEvent.blur(lastName)
        fireEvent.blur(email)
        fireEvent.blur(message)
    })

    const errors = screen.queryByText(/looks like there was an error/i)

    expect(errors).not.toBeInTheDocument()

    
    // Query for submit button
     const submitButton = screen.getByRole('button', { name: /submit/i })

    // Click on submit button
    fireEvent.click(submitButton)

    // See if DOM contains the new submission
    expect(await screen.findByText(/gjwilson7390@gmail.com/i)).toBeInTheDocument();

    


})

test('Test that validation error messages working', async () => {

    render(<ContactForm />)

    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const email = screen.getByLabelText(/email/i)
    const message = screen.getByLabelText(/message/i)

    // Fill out inputs
    fireEvent.change(firstName, { target: { value: 'Gregory-John' }})
    fireEvent.change(lastName, { target: { value: '' }})
    fireEvent.change(email, { target: { value: '' }})
    fireEvent.change(message, { target: { value: '' }})  
    
    await act(async () => {
        fireEvent.blur(firstName)
        fireEvent.blur(lastName)
        fireEvent.blur(email)
        fireEvent.blur(message)
    }) 

    const errors = screen.queryAllByText(/looks like there was an error/i)

    if (errors.length !== 3) {
        throw new Error('Received less errors than expected')
    }


        errors.forEach( (error) => {
            expect(error).toBeInTheDocument()
        })
    

})


test('Test that first name required validation error message is working', async () => {

    render(<ContactForm />)

    const firstName = screen.getByLabelText(/first name/i)

    fireEvent.change(firstName, { target: { value: '' }})


    await act(async () => {
        fireEvent.blur(firstName)
    }) 

    const error = screen.queryByText(/looks like there was an error/i)

    expect(error).toBeInTheDocument()


})

test('A mood is selected from drop-down list', () => {

    const { getByTestId } = render(<ContactForm />);

    fireEvent.change(getByTestId('select-option'), { target: { value: 1 } }) 

    let option = getByTestId('select-option')

    expect(option.selected).toBeTruthy();
    
})
