"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        setError('Error fetching notes: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingNote) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${editingNote.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
        .then(response => response.json())
        .then(data => {
          setNotes(prevNotes => prevNotes.map(note => note.id === data.id ? data : note));
          setEditingNote(null);
        })
        .catch(error => console.error('Error updating note:', error));
    } else {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      })
        .then(response => response.json())
        .then(data => {
          setNotes(prevNotes => [...prevNotes, data]);
        })
        .catch(error => console.error('Error adding note:', error));
    }
    setShowForm(false);
    setNewNote({ title: '', description: '' });
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, description: note.description });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Notes Application</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6">
        <div className="container mx-auto flex flex-col h-full bg-white shadow-lg rounded-lg">
          <div className="p-6 border-b flex flex-col justify-center items-center">
            <button
              className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Hide Form' : 'Add New Note'}
            </button>

            {showForm && (
              <form className="mb-6 p-6 border rounded-lg bg-gray-50" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newNote.description}
                  onChange={handleInputChange}
                  className="w-full mb-4 p-3 border rounded-lg shadow-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                ></textarea>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                  >
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="space-y-6">
                {notes.map(note => (
                  <li key={note.id} className="p-6 border rounded-lg shadow-lg bg-white relative overflow-hidden">
                    <div className="flex flex-wrap justify-between mb-3 text-sm text-gray-500">
                      <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
                      <p>Updated at: {new Date(note.updated_at).toLocaleString()}</p>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">{note.title}</h2>
                    <div className="max-h-28 overflow-y-auto text-center">
                      <p className="text-gray-600">{note.description}</p>
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
