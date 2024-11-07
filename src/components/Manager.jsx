import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrashAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './Manager.css';


const PasswordInput = forwardRef(({ value, onChange, placeholder, name, type }, ref) => (
  <input
    ref={ref}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="manager-input"
    type={type}
    name={name}
    id={name}
  />
));

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const getPasswords = async () => {
    try {
      let req = await fetch("http://localhost:3000/");
      let passwords = await req.json();
      setPasswordArray(passwords);
    } catch (error) {
      toast.error('Failed to fetch passwords. Please check your server connection.');
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard!', {
      position: "top-right",
      autoClose: 5000,
      theme: "dark",
    });
  };

  const showPassword = () => {
    setIsPasswordVisible(prev => !prev); 
  };

  const savePassword = async () => {
    if (form.site && form.username && form.password) {
      const newPassword = { ...form, id: uuidv4() };

      try {
        await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPassword),
        });
        setPasswordArray((prev) => [...prev, newPassword]);
        setForm({ site: "", username: "", password: "" });
        toast.success('Password saved!');
      } catch (error) {
        toast.error('Error: Password not saved!');
      }
    } else {
      toast.error('Error: All fields must be filled out!');
    }
  };

  const deletePassword = async (id) => {
    if (window.confirm("Do you really want to delete this password?")) {
      try {
        await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
        setPasswordArray((prev) => prev.filter(item => item.id !== id));
        toast.success('Password deleted!');
      } catch (error) {
        toast.error('Error: Could not delete password.');
      }
    }
  };

  const editPassword = async (id) => {
    const item = passwordArray.find(i => i.id === id);
    setForm({ ...item, id: id });
    setPasswordArray((prev) => prev.filter(item => item.id !== id));
    await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />
      <div className="manager-background">
        <div className="manager-container">
          <h1 className="manager-heading">
            <span className="manager-heading-green">&lt;</span><span>Pass</span><span className='manager-heading-green'>OP</span><span className="manager-heading-green">/&gt;</span>
          </h1>
          <p className="manager-subheading">Your own Password Manager</p>

          <div className="manager-form">
            <input
              value={form.site}
              onChange={handleChange}
              placeholder="Enter website URL"
              className="manager-input"
              type="text"
              name="site"
              id="site"
            />
            <div className="manager-form-row">
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="manager-input-user"
                type="text"
                name="username"
                id="username"
              />
              <div className="manager-password-wrapper">
                <PasswordInput
                  ref={passwordRef}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"} 
                />
                <span className="manager-eye-icon" onClick={showPassword}>
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} 
                </span>
              </div>
            </div>
            <div className='save-container'>
              <button onClick={savePassword} className="manager-save-btn">
                Save
              </button>
            </div>
          </div>

          <div className="manager-passwords">
            <h2 className="manager-passwords-heading">Your Passwords</h2>
            {passwordArray.length === 0 && <div>No passwords to show</div>}
            {passwordArray.length > 0 && (
              <table className="manager-table">
                <thead className="manager-table-head">
                  <tr>
                    <th className="manager-table-cell">Site</th>
                    <th className="manager-table-cell">Username</th>
                    <th className="manager-table-cell">Password</th>
                    <th className="manager-table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className='manager-table-body'>
                  {passwordArray.map((item) => (
                    <tr key={item.id}>
                      <td className="manager-table-cell">
                        <div className="manager-icon-wrapper">
                          <a href={item.site} target="_blank" rel="noopener noreferrer">{item.site}</a>
                          <span className="manager-copy-icon" onClick={() => copyText(item.site)}>
                            <FaCopy />
                          </span>
                        </div>
                      </td>
                      <td className="manager-table-cell">
                        <div className="manager-icon-wrapper">
                          <span>{item.username}</span>
                          <span className="manager-copy-icon" onClick={() => copyText(item.username)}>
                            <FaCopy />
                          </span>
                        </div>
                      </td>
                      <td className="manager-table-cell">
                        <div className="manager-icon-wrapper">
                          <span>{item.password}</span>
                          <span className="manager-copy-icon" onClick={() => copyText(item.password)}>
                            <FaCopy />
                          </span>
                        </div>
                      </td>
                      <td className="manager-table-cell">
                        <span className="manager-icon-spacing" onClick={() => editPassword(item.id)}>
                          <FaEdit />
                        </span>
                        <span className="manager-icon-spacing" onClick={() => deletePassword(item.id)}>
                          <FaTrashAlt />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
