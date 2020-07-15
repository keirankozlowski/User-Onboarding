import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field.'),
    email: yup.string().email('Must be a valid email.').required('Must include email address.'),
    password: yup.string().required('Please enter a password.').min(6),
    tos: yup.boolean().oneOf([true], 'Please accept terms of service.')
});

function Form() {
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [formState, setFormState] = useState({
      name: "",
      email: "",
      password: "",
      tos: ""
    });

    const [errors, setErrors] = useState({
      name: "",
      email: "",
      password: "",
      tos: ""
    });
    
    const [post, setPost] = useState([]);

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
          setButtonDisabled(!valid);
        });
      }, [formState]);

    const formSubmit = e => {
    e.preventDefault();
        axios
        .post("https://reqres.in/api/users", formState)
        .then(res => {
            console.log(res);
            setPost(res.data); // get just the form data from the REST api

            // reset form if successful
            setFormState({
                name: "",
                email: "",
                password: "",
                tos: ""
            });
        })
        .catch(err => console.log(err.response));
    };

    const validateChange = e => {
      // Reach will allow us to "reach" into the schema and test only one part.
      yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
          setErrors({
            ...errors,
            [e.target.name]: ""
          });
        })
        .catch(err => {
          setErrors({
            ...errors,
            [e.target.name]: err.errors[0]
          });
        });
    };

    const inputChange = e => {
      e.persist();
      const newFormData = {
        ...formState,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
      };
  
      validateChange(e);
      setFormState(newFormData);
    };
    
    return (
        <form onSubmit={formSubmit}>
            <label htmlFor="name">
                Name
                <input
                type="text"
                name="name"
                value={formState.name}
                onChange={inputChange}
                />
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>
            <label htmlFor="email">
                Email
                <input
                type="text"
                name="email"
                value={formState.email}
                onChange={inputChange}
                />
                {errors.email.length > 0 ? (
                <p className="error">{errors.email}</p>
                ) : null}
            </label>
            <label htmlFor="password">
                Password
                <input
                type="password"
                name="password"
                value={formState.password}
                onChange={inputChange}
                />
                {errors.password.length > 0 ? (
                <p className="error">{errors.password}</p>
                ) : null}
            </label>
            <label htmlFor="tos" className="tos">
                <input
                type="checkbox"
                name="tos"
                checked={formState.tos}
                onChange={inputChange}
                />
                Terms of Service
            </label>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
    );
}

export default Form;
