'use strict';

import pushService                      from "../services/push-service";
// import pushService                      from "../services/test-service";
import userService						from "../services/user-service";

exports.registerUser = async(req, res) => {
    try {
		const token = req.body.token || req.query.token || req.headers['x-access-token'];
		const data = await userService.refreshToken(token);
		if (!data) {
			return res.status(404).send({ message: 'Not found!'  });
		}

		const userId = req.params['userId'];
		const connectionId = req.query['connectionId'];
		console.log(userId);
		console.log(connectionId);
		if (userId && connectionId) {
			pushService.registerUser(userId, connectionId);
			res.send();
		} else {
			res.status(400).send( {message: 'Bad Request'});
		}
	} catch (error) {
		return res.status(500).send({ message: 'Falha ao processar sua requisição' });
	}
};

/**
 * Api to send message to user.
 */
exports.pushMessage = async (req, res) => {
	try {
		const token = req.body.token || req.query.token || req.headers['x-access-token'];
		const data = await userService.refreshToken(token);
		if (!data) {
			return res.status(404).send({ message: 'Not found!'  });
		}
		const userId = req.params['userId'];
		console.log(req.body.message);
		if (userId && req.body.message) {
			pushService.pushMessage(userId, req.body.message);
			res.send();
		}
		else {
			res.status(400).send( {message: 'Bad Request'});
		}
	} catch (error) {
		return res.status(500).send({ message: 'Falha ao processar sua requisição' });
	}

};
