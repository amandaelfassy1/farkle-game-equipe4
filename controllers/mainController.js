module.exports = {
    home: (req, res) => {
        res.render('index.pug')
    },
    default: (req, res) => {
        res.status(404).render('404.pug')
    },
}
