const { Router } = require('express');

const {
	renderNoteForm,
	createNewNote,
	renderNotes,
	renderEditForm,
	updateNote,
	deleteNote
} = require('../controllers/notes.controller');

const router = Router();

const { isAuthenticated } = require('../helpers/auth');

// New note
// Se solicita la ruta
// Luego, mediante un middleware, se verifica si el usuario esta logueado
router.get('/notes/add', isAuthenticated, renderNoteForm);
router.post('/notes/new-note', isAuthenticated, createNewNote);
// Get all notes
router.get('/notes', isAuthenticated, renderNotes);
// Edit notes
router.get('/notes/edit/:id', isAuthenticated, renderEditForm);
router.put('/notes/edit/:id', isAuthenticated, updateNote);
// Delete notes
router.delete('/notes/delete/:id', isAuthenticated, deleteNote);

module.exports = router;

/**
 * GET -> extraer datos
 * POST -> crear registor
 * PUT -> actualizar registro
 * DELETE -> borrar registro
 */
