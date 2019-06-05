const express = require('express');
const router = express.Router();
import DatabaseHelper from './database'


module.exports = (app) => {
    const helper = new DatabaseHelper()
    const renderNewNoteForm = (user_id) => {
        response.render('note_edit.pug', { 'id': user_id })
    }
    var currentUser = ''
    var currentUserId = -1
    helper.initializeTables()

    router.get('/logout', (request, response) => {
        currentUser = '';
        currentUserId = -1;
        response.render('login.pug');
    })

    router.get('/newNote', (request, response) => {
        response.render('note_edit.pug', { 'id': currentUserId })
        // response.send("dupa");
    })

    router.all('/', (request, response) => {
        response.send("Hello world!");
    });

    router.get('/note/:user_id/:note_id', (request, response) => {
        response.send(`Sending book with id ${request.params.user_id}`)
    });

    router.post('/note', (request, response) => {
        var note = request.body;
        console.log(note);
        helper.addNewNote(currentUserId, note.title, note.body)
            .then(() => {
                // response.send('New note with title created.')
                helper.getAllUserNotes(currentUser)
                    .then((rows) => {
                        response.render('note_list.pug', { 'notes': rows, 'user': currentUser, 'newNote': renderNewNoteForm.bind(this), 'user_id': currentUserId })
                    })
            })
    });

    router.post('/user/login', (request, response) => {
        var login = request.body.login
        if (helper.login(login)) {

        } else {
            helper.addNewUser(login)
        }

        helper.getAllUserNotes(login)
            .then((rows) => {
                helper.getUserIdByLogin(login)
                    .then((id) => {
                        currentUser = login
                        currentUserId = id
                        response.render('note_list.pug', { 'notes': rows, 'user': login, 'newNote': renderNewNoteForm.bind(this), 'user_id': id })
                    })
            })
    });

    router.post('/user/register', (request, response) => {
        console.log(request.params)
        helper.addNewUser(request.params.login);
        response.send("Something happend xdd");
    })

    router.get('/user/all', (requests, response) => {
        response.send(helper.getAllUsers())
    })

    router.get('/showList', (request, response) => {
        helper.getAllUserNotes(currentUser)
            .then((rows) => {
                response.render('note_list.pug', { 'notes': rows, 'user': currentUser, 'newNote': renderNewNoteForm.bind(this), 'user_id': currentUserId })
            })
    })

    app.use('/content', router)
}


// module.exports = router;