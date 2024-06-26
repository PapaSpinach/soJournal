const router = require('express').Router();
const { User } = require('../../models');
 
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.fields);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { username: req.fields.username } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password. Input correct email and password'});
            return;
        }
        const validPassword = await userData.checkPassword(req.fields.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password. Input correct email and password'});
            return;
        }

        req.session.save( ()=> {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({user: userData, message: ' You are logged in!'})
        }); 

    } catch (err) {
        res.status(400).json(err);
    }
})

router.post('/logout', (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;