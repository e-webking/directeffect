/**
 * 
 */
$(function() {

	$.validator.addMethod('valueNotEquals', function(value, element, arg){
		return arg != value;
	}, "Please select a valid option");
	$.validator.addMethod('valueEqualsZero', function(value, element, arg){
		return value != 0;
	}, "Please select a valid option");

	//Rules of individual elements
	var $name 		= $('#name').attr('name');
	var $institute	= $('#institution').attr('name');
	var $telephone 	= $('#phone').attr('name');
	var $email 		= $('#email').attr('name');

	$params = {rules:{}, groups:{}, messages:{}};

	$params['rules'][$name] = {"required": true};
	$params['rules'][$institute] = {"required": true};
	$params['rules'][$telephone] = {"required": true};
	$params['rules'][$email] = {"required": true, "email": true};
	
	$params['messages'][$name] = {"required": "Name is required"};
	$params['messages'][$institute] = {"required": "Institution is required"};
	$params['messages'][$telephone] = {"required": "Phone number is required"};
	$params['messages'][$email] = {"required": "Email is required", "email": "Please enter a valid email"};
	$params['errorElement'] = "div";
	$params['wrapper'] = "div";
	$params['ignore'] =  [];
	
	$("#frmLanding").validate($params);
});