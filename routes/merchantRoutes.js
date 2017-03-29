var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Merchant = require('../models/merchant');
var Queue = require('../models/queue');

var avgTime = 2; // MINUTES

// Register Merchant
router.post('/registermerchant', function(req, res){
	var businessname = req.body.businessname;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var phonenumber = req.body.phonenumber;
	var username = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Confirm Password
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	
	if(errors){
		res.render('register',{
			errors:errors
		});
	}
	else
	{
		Merchant.findOne({username:username}, function(err, result){
		if(err) 
		{
			throw err;
		}
		// If user is not registered, then register user
		if(!result)
		{
		var newMerchant = new Merchant({
			businessname: businessname,
			firstname: firstname,
			lastname: lastname,
			phonenumber: phonenumber,
			username: username,
			password: password
		});

		Merchant.createMerchant(newMerchant, function(err, merchant){
			if(err) throw err;
			console.log(merchant);
		});

		var BusinessSchema = mongoose.Schema({
			businessname: {
				type: String
			},
			firstname: {
				type: String
			},
			lastname: {
				type: String
			},
			email: {
				type: String
			},
			phonenumber: {
				type: Number
			},
			date: {
				type: Date, 
				default: Date.now // This is in milliseconds
			}
		});

		var BusinessCollection = mongoose.model(businessname, BusinessSchema);

		createBusinessCollection = function(newBusinessCollection, callback){
			newBusinessCollection.save(callback);
		};
		
		var newBusiness = new BusinessCollection({
			businessname: businessname,
			firstname: firstname,
			lastname: lastname,
			email: username,
			phonenumber: phonenumber,
		});
		
		createBusinessCollection(newBusiness, function(err, BusinessCollection){
			if(err) throw err;
			console.log(BusinessCollection);
		});
				
		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/login');
		}
		else
		{
			console.log('Found same email already registered for another Merchant.');
			req.flash('error_msg', 'Cannot Register: Email already registered');
			res.redirect('/register');
		}
		})
	}
});

// Merchant Delete User from queue
router.post('/completeTransaction', function(req, res){
	// find the user with id 
	Queue.findByIdAndRemove(req.body.id, function(err) {
		if (err) throw err;
		// deleted the user
		console.log('User deleted!');
		});

	res.redirect('/');
});

module.exports = router;