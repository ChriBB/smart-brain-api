
const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password} = req.body;
	// security front to backend if email, name and password are empty then
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
				})
				.then(user => {
					res.json(user[0]); //pakt de laatste nieuwe inschrijving	
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register')) // unable to register will be visible, error log not
}

// create and export handleRegister
module.exports = {
	handleRegister: handleRegister
};