import React from 'react'


function EditNote(props) {

    const { reference, closeref, enote, onchange, handleChange } = props;

    return (
        <div>
            <button type="button" ref={reference} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h5 className="modal-title " id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='my-5'>

                                <div className="mb-3 ">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className='form-control' id='tag' name='tag' value={enote.tag} onChange={onchange}></input>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" value={enote.title} onChange={onchange} name="title" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" name="description" value={enote.description} onChange={onchange} rows="3"></textarea>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button ref={closeref} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={handleChange} type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditNote