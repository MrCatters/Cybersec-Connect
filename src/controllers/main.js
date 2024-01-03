'use strict'

exports.about = function(req, res){
    res.render('about');
};

exports.connections = function(req, res){
    res.render('connections');
};

exports.connection = function(req, res){
    res.render('connection');
};

exports.index = function(req, res){
    res.render('index');
};

exports.contact = function(req, res){
    res.render('contact');
};