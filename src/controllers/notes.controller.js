const noteCtrl = {};

const Note = require('../models/Note');

noteCtrl.renderNoteForm = (req, res) => {
	res.render('notes/new-note');
};

noteCtrl.createNewNote = async (req, res) => {
	// Extraer datos del formulario
	const { title, description } = req.body;
	// Instancia de notas para tener el schema
	const newNote = new Note({ title, description });
	newNote.user = req.user.id; // almacenar el id del usuario
	// Guardar la data en mongo
	await newNote.save();
	// Enviar mensaje antes de redirecionar
	req.flash('success_msg', 'Note Added Successfully');
	res.redirect('/notes');
};

noteCtrl.renderNotes = async (req, res) => {
	try {
		// Extraer todas las notas
		const notes = await Note.find({ user: req.user.id }).sort({ createdAt: 'desc' });
		// Enviar la data a la vista
		res.render('notes/all-notes', {
			notes
		});
	} catch (e) {
		alert(e.getMessage());
	}
};

noteCtrl.renderEditForm = async (req, res) => {
	const note = await Note.findById(req.params.id);
	// Validar que un usuario no pueda validar una nota ajena
	if (note.user != req.user.id) {
		req.flash('error_msg', 'Not authorized');
		return res.redirect('/notes');
	}
	res.render('notes/edit-note', { note });
};

noteCtrl.updateNote = async (req, res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, { title, description });
	req.flash('success_msg', 'Note Updated Successfully');
	res.redirect('/notes');
};

noteCtrl.deleteNote = async (req, res) => {
	const resp = await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Note Deleted Successfully');
	res.redirect('/notes');
};

module.exports = noteCtrl;
