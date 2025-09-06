document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('personForm');
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const resultDiv = document.getElementById('result');
		resultDiv.innerHTML = '';
		const people = [];
		for (let i = 0; i < 16; i++) {
			const name = form[`name${i}`].value.trim();
			const gender = form[`gender${i}`].value;
			if (name && gender) {
				people.push({ name, gender });
			}
		}
		if (people.length === 0) {
			resultDiv.textContent = '입력된 정보가 없습니다.';
		} else {
			const ul = document.createElement('ul');
			people.forEach(person => {
				const li = document.createElement('li');
				li.textContent = `${person.name} (${person.gender})`;
				ul.appendChild(li);
			});
			resultDiv.appendChild(ul);
		}
	});
});
