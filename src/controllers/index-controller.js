import {Router}                                 from "express";
import colors                                   from "colors";

exports.get  = (req, res, next) => {
    res.status(200).send({
        title: "Node Iot API",
        version: "0.0.2"
    });
    console.log(colors.yellow("router index"));
};
