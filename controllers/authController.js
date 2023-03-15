module.exports = {
    getSignup: (req, res) => {
        res.render('signup.pug')
    },
    postSignup: (req, res) => {
        const { email, password, username } = req.body

        console.log('POST/signup -> email:', email)
        console.log('POST/signup -> password:', password)
        console.log('POST/signup -> username:', username)
        console.log('-----------------')

        res.render('signup.pug', {
            alert: {
                success: true,
                message: `Utilisateur ${username} enregistré`,
            },
        })
    },
    getSignin: (req, res) => {
        res.render('signin.pug')
    },
}
