$(document).ready(function() {
	getCities();
	$('#ticket_form').submit(function (event) {		
		$.ajax({
			url: '/reserve',
			type: 'POST',
			dataType: 'application/json',
			data: $(this).serializeArray(),
			complete: function(r) {
				json = JSON.parse(r.responseText);
				alert('Спасибо за заказ, ' + json.name + ' ' + json.surname + '. Ваша бронь успешно сохранена.');
			}
		});
		event.preventDefault();
	})
});


function getCities() {
	$.ajax({
		url: '/cities',
		type: 'POST',
		dataType: 'json',
		success: function( cities ) {
			$.each(cities, function(key, value) {
				$('select').append($('<option>').text(value).attr('value', key));
			});
		}
	});
}