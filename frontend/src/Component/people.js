import React, { useState, useEffect } from 'react';

const People = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for uploaded image

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch('http://localhost:5000/getUsers');
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else if (name === 'image') {
      setImage(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const createPerson = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage); // Append the selected image

      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);

      const response = await fetch('http://localhost:5000/createUser', {
        method: 'POST',
        body: formData, // Use formData for file upload
      });

      const data = await response.json();
      fetchPeople();
      setName('');
      setEmail('');
      setPhone('');
      setImage('');
      setSelectedImage(null); // Reset the selected image
    } catch (error) {
      console.error(error);
    }
  };

  const updatePerson = async () => {
    if (selectedPerson) {
      try {
        const formData = new FormData();
        formData.append('image', selectedImage || ''); // Append the selected image

        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);

        const response = await fetch(
          `http://localhost:5000/updateUser/${selectedPerson._id}`,
          {
            method: 'PUT',
            body: formData, // Use formData for file upload
          }
        );

        fetchPeople();
        setName('');
        setEmail('');
        setPhone('');
        setImage('')
        setSelectedImage(null); // Reset the selected image
        setSelectedPerson(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deletePerson = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteUser/${id}`, {
        method: 'DELETE',
      });
      fetchPeople();
    } catch (error) {
      console.error(error);
    }
  };

  const selectPerson = (person) => {
    setSelectedPerson(person);
    setName(person.name);
    setEmail(person.email);
    setPhone(person.phone);
    setImage(person.image);
  };

  return (
    <div>
      <h1>CRUD Application</h1>
      <div>
        <h2>Create or Update Person</h2>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={phone}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageUpload} // Handle image upload
        />
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            style={{ maxWidth: '100px' }}
          />
        )}
        <button onClick={updatePerson}>Update</button>
        <button onClick={createPerson}>Create</button>
      </div>
      <h2>People</h2>
      <ol>
        {people.map((person) => (
          <li key={person._id}>
            <span style={{ fontWeight: 'bold' }}>Name: </span>
            {person.name} - <span style={{ fontWeight: 'bold' }}>Email: </span>
            {person.email} - <span style={{ fontWeight: 'bold' }}>Phone: </span>
            {person.phone} - <span style={{ fontWeight: 'bold' }}>Image: </span>
            <span><img src={`http://localhost:5000/uploads/${person.image}`} alt={person.name} style={{ maxWidth: '50px', position:"relative", top:"20px" }} /></span>
            <button onClick={() => selectPerson(person)}>Edit</button>
            <button onClick={() => deletePerson(person._id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default People;
