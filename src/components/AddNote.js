import React, { useContext, useState } from 'react'
import noteContext from "../context/notes/noteContext"
import Notes from './Notes';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "" })
        props.showAlert("Note added successfully.", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" autoComplete='on' aria-describedby="emailHelp" value={note.title} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" autoComplete='on' value={note.description} onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} required />
                </div>

                <button disabled={note.title.length < 1 || note.description.length < 1} type="submit" autoComplete='on' className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
            <Notes showAlert={props.showAlert} />
        </div>
    )
}

export default AddNote