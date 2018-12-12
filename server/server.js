const { loader } = require('./app')

loader().then(app => {
    app.listen(3000, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    });
})