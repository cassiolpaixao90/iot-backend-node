import {Router}                                 from "express";
import colors                                   from "colors";

exports.get  = (req, res, next) => {
    res.status(200).send({
        title: "Node Iot API",
        version: "0.0.2"
    });
    console.log(colors.yellow("router index"));
};

exports.ping = (req, res) => {
	res.send('ping')
};

exports.status = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	var info = {
		'name': "iot-sensor",
		'version': "v.0.0.1"
	};
	res.send(info)
};