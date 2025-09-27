let absentPlayers = new Set();
let assignedPlayers = new Set(); // 배정된 선수들 추적
let playerMatchCounts = new Map(); // 선수별 경기수 추적
let partnerHistory = new Map(); // 파트너 이력 추적 Map<playerIndex, Set<partnerIndex>>

let playerCount = 0;
const testNames = ['김철수', '이영희', '박민수', '최지은', '정다윤', '홍길동', '송미라', '장현우', '조영민', '한지우', '윤서연', '강동훈', '임소영', '배준호', '신혜진', '오태민'];
const testGenders = ['남', '여'];
let usedNames = new Set(); // 사용된 이름들을 추적

function testEntry() {
	// 16개의 입력 폼이 필요하므로 부족한 만큼 추가
	while (playerCount < 16) {
		addNextPlayer();
	}
	
	// 성별 카운터 초기화
	let maleCount = 0;
	let femaleCount = 0;
	
	// 16명 모두 입장시키기
	for (let entryCount = 0; entryCount < 16; entryCount++) {
		const form = document.getElementById('personForm');
		const nameField = form[`name${entryCount}`];
		const genderField = form[`gender${entryCount}`];
		
		if (nameField && genderField) {
			// 사용되지 않은 이름 찾기
			const availableNames = testNames.filter(name => !usedNames.has(name));
			
			// 모든 이름이 사용되었으면 리셋
			if (availableNames.length === 0) {
				usedNames.clear();
				availableNames.push(...testNames);
			}
			
			// 사용 가능한 이름 중에서 랜덤 선택
			const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
			
			// 성별 선택 로직: 남자가 10명 이상이 되도록 조정
			let selectedGender;
			const remainingPlayers = 16 - entryCount;
			
			if (maleCount < 10) {
				// 남자가 10명 미만인 경우
				if (remainingPlayers <= (10 - maleCount)) {
					// 남은 선수가 필요한 남자 수와 같거나 적으면 무조건 남자
					selectedGender = '남';
				} else {
					// 남은 선수가 충분하면 70% 확률로 남자 선택
					selectedGender = Math.random() < 0.7 ? '남' : '여';
				}
			} else {
				// 남자가 10명 이상이면 나머지는 여자
				selectedGender = '여';
			}
			
			// 성별 카운터 업데이트
			if (selectedGender === '남') {
				maleCount++;
			} else {
				femaleCount++;
			}
			
			// 선택된 이름을 사용된 이름 목록에 추가
			usedNames.add(randomName);
			
			nameField.value = randomName;
			setSelectedGender(entryCount, selectedGender);
			
			// 해당 선수의 입장 버튼 찾아서 직접 처리
			const playerButton = document.querySelector(`button[onclick="toggleAbsent(${entryCount})"]`);
			if (playerButton) {
				// 입장 -> 퇴장
				playerButton.textContent = '퇴장';
				playerButton.classList.add('exit');
				// 입장 시 이름과 성별 고정
				nameField.disabled = true;
				// 라디오 버튼들도 비활성화
				const radios = document.querySelectorAll(`input[name="gender${entryCount}"]`);
				radios.forEach(radio => radio.disabled = true);
				absentPlayers.delete(entryCount);
			}
		}
	}
	
	alert(`16명의 선수가 모두 입장하였습니다.\n구성: 남자 ${maleCount}명, 여자 ${femaleCount}명`);
}

function defaultEntry() {
	// 기본 선수 목록
	const defaultPlayers = [
		{name: '홍성철', gender: '남'},
		{name: '홍현수', gender: '남'},
		{name: '이대현', gender: '남'},
		{name: '이범기', gender: '남'},
		{name: '최성은', gender: '남'},
		{name: '최영준', gender: '남'},
		{name: '이영욱', gender: '남'},
		{name: '김유식', gender: '남'},
		{name: '이준민', gender: '남'},
		{name: '방준호', gender: '남'},
		{name: '조영진', gender: '남'},
		{name: '정정훈', gender: '남'},
		{name: '전혜선', gender: '여'},
		{name: '양근영', gender: '여'}
	];
	
	// 필요한 만큼 입력 폼 생성
	while (playerCount < defaultPlayers.length) {
		addNextPlayer();
	}
	
	// 기본 선수들 입장시키기
	const enteredRows = []; // 입장한 행들을 저장할 배열
	
	for (let entryCount = 0; entryCount < defaultPlayers.length; entryCount++) {
		const form = document.getElementById('personForm');
		const nameField = form[`name${entryCount}`];
		const genderField = form[`gender${entryCount}`];
		
		if (nameField && genderField) {
			const player = defaultPlayers[entryCount];
			
			nameField.value = player.name;
			setSelectedGender(entryCount, player.gender);
			
			// 해당 선수의 입장 버튼 찾아서 직접 처리
			const playerButton = document.querySelector(`button[onclick="toggleAbsent(${entryCount})"]`);
			if (playerButton) {
				// 입장 -> 퇴장
				playerButton.textContent = '퇴장';
				playerButton.classList.add('exit');
				// 입장 시 이름과 성별 고정
				nameField.disabled = true;
				// 라디오 버튼들도 비활성화
				const radios = document.querySelectorAll(`input[name="gender${entryCount}"]`);
				radios.forEach(radio => radio.disabled = true);
				absentPlayers.delete(entryCount);
				
				// 해당 행을 배열에 저장
				const playerRow = playerButton.parentElement.parentElement;
				enteredRows.push(playerRow);
			}
		}
	}
	
	// 모든 입장한 행들을 올바른 순서로 재배치
	const personInputs = document.getElementById('personInputs');
	enteredRows.forEach(row => {
		personInputs.appendChild(row);
	});
	
	const maleCount = defaultPlayers.filter(p => p.gender === '남').length;
	const femaleCount = defaultPlayers.filter(p => p.gender === '여').length;
	
	// 기본 선수 입장 후 새로운 선수를 위한 빈 입력란 추가
	addNextPlayer();
	
	alert(`기본 선수 ${defaultPlayers.length}명이 입장하였습니다.\n구성: 남자 ${maleCount}명, 여자 ${femaleCount}명`);
}

function fixedTestEntry() {
	// 고정된 선수 목록
	const fixedPlayers = [
		{name: '제임스', gender: '남'},
		{name: '서인성', gender: '남'},
		{name: '홍성철', gender: '남'},
		{name: '이대현', gender: '남'},
		{name: '양근영', gender: '여'},
		{name: '최성은', gender: '남'},
		{name: '안희덕', gender: '남'},
		{name: '이범기', gender: '남'},
		{name: '이영욱', gender: '남'},
		{name: '이준민', gender: '남'},
		{name: '방준호', gender: '남'},
		{name: '전혜선', gender: '여'},
		{name: '게스트', gender: '여'}
	];
	
	// 필요한 만큼 입력 폼 생성
	while (playerCount < fixedPlayers.length) {
		addNextPlayer();
	}
	
	// 고정된 선수들 입장시키기
	for (let entryCount = 0; entryCount < fixedPlayers.length; entryCount++) {
		const form = document.getElementById('personForm');
		const nameField = form[`name${entryCount}`];
		const genderField = form[`gender${entryCount}`];
		
		if (nameField && genderField) {
			const player = fixedPlayers[entryCount];
			
			nameField.value = player.name;
			setSelectedGender(entryCount, player.gender);
			
			// 해당 선수의 입장 버튼 찾아서 직접 처리
			const playerButton = document.querySelector(`button[onclick="toggleAbsent(${entryCount})"]`);
			if (playerButton) {
				// 입장 -> 퇴장
				playerButton.textContent = '퇴장';
				playerButton.classList.add('exit');
				// 입장 시 이름과 성별 고정
				nameField.disabled = true;
				// 라디오 버튼들도 비활성화
				const radios = document.querySelectorAll(`input[name="gender${entryCount}"]`);
				radios.forEach(radio => radio.disabled = true);
				absentPlayers.delete(entryCount);
			}
		}
	}
	
	const maleCount = fixedPlayers.filter(p => p.gender === '남').length;
	const femaleCount = fixedPlayers.filter(p => p.gender === '여').length;
	
	alert(`FIXED 테스트: ${fixedPlayers.length}명의 선수가 입장하였습니다.\n구성: 남자 ${maleCount}명, 여자 ${femaleCount}명`);
}

function toggleAbsent(index) {
	const button = event.target;
	const form = document.getElementById('personForm');
	const name = form[`name${index}`].value.trim();
	const gender = getSelectedGender(index);
	const nameInput = form[`name${index}`];
	
	// 이름과 성별이 입력되지 않은 경우 경고
	if (!name || !gender) {
		alert('이름과 성별을 먼저 입력해주세요.');
		return;
	}
	
	if (button.textContent === '입장') {
		// 입장 -> 퇴장
		button.textContent = '퇴장';
		button.classList.add('exit');
		// 입장 시 이름과 성별 고정
		nameInput.disabled = true;
		// 라디오 버튼들도 비활성화
		const radios = document.querySelectorAll(`input[name="gender${index}"]`);
		radios.forEach(radio => radio.disabled = true);
		absentPlayers.delete(index);
		
		// 입장한 선수의 행을 맨 아래로 이동
		const personInputs = document.getElementById('personInputs');
		const playerRow = button.parentElement.parentElement; // td -> tr
		personInputs.appendChild(playerRow);
		
		// 다음 선수 입력 폼 추가 (맨 위에)
		addNextPlayer();
	} else {
		// 퇴장 -> 해당 선수 정보 완전 삭제 (테이블 행 제거)
		const playerRow = button.parentElement.parentElement; // td -> tr
		playerRow.remove();
		
		// absentPlayers에서도 제거
		absentPlayers.delete(index);
	}
}

// 라디오 버튼의 선택된 값을 가져오는 헬퍼 함수
function getSelectedGender(playerIndex) {
	const form = document.getElementById('personForm');
	const radios = form.querySelectorAll(`input[name="gender${playerIndex}"]`);
	for (let radio of radios) {
		if (radio.checked) {
			return radio.value;
		}
	}
	return '';
}

// 라디오 버튼의 값을 설정하는 헬퍼 함수
function setSelectedGender(playerIndex, genderValue) {
	const form = document.getElementById('personForm');
	const radios = form.querySelectorAll(`input[name="gender${playerIndex}"]`);
	for (let radio of radios) {
		if (radio.value === genderValue) {
			radio.checked = true;
			break;
		}
	}
}

function addNextPlayer() {
	const personInputs = document.getElementById('personInputs');
	
	const tr = document.createElement('tr');
	tr.innerHTML = `
		<td><input type="text" name="name${playerCount}" placeholder="이름 입력" /></td>
		<td>
			<label><input type="radio" name="gender${playerCount}" value="남" checked> 남</label>
			<label><input type="radio" name="gender${playerCount}" value="여"> 여</label>
		</td>
		<td><span class="match-count" id="match-count-${playerCount}">0</span></td>
		<td><button type="button" onclick="toggleAbsent(${playerCount})">입장</button></td>
	`;
	
	// 새 입력란은 맨 위에 추가
	personInputs.insertBefore(tr, personInputs.firstChild);
	playerCount++;
}

function assignToCourt(courtNumber) {
	// 현재 입장한 선수들 중 배정되지 않은 선수 찾기
	const form = document.getElementById('personForm');
	const availablePlayers = [];
	
	for (let i = 0; i < playerCount; i++) {
		const nameField = form[`name${i}`];
		const genderField = form[`gender${i}`];
		
		const selectedGender = getSelectedGender(i);
		if (nameField && nameField.value.trim() && selectedGender) {
			// 입장한 선수 중 배정되지 않은 선수만 선택
			if (!absentPlayers.has(i) && !assignedPlayers.has(i)) {
				availablePlayers.push({
					index: i,
					name: nameField.value.trim(),
					gender: selectedGender
				});
			}
		}
	}
	
	// 최소 4명 이상이어야 배정 가능
	if (availablePlayers.length < 4) {
		alert(`배정이 불가능합니다. 현재 배정 가능한 선수: ${availablePlayers.length}명 (최소 4명 필요)`);
		return;
	}
	
	// 경기수가 적은 선수들을 우선 선택
	availablePlayers.sort((a, b) => {
		const countA = playerMatchCounts.get(a.index) || 0;
		const countB = playerMatchCounts.get(b.index) || 0;
		// 경기수가 적은 순으로 정렬, 같으면 랜덤
		if (countA === countB) {
			return Math.random() - 0.5;
		}
		return countA - countB;
	});
	
	// 완전히 새로운 배정 알고리즘 구현
	let selectedPlayers = [];
	let doublesType = '';
	
	// 1단계: 가장 낮은 경기수를 갖는 선수들의 리스트 구성
	const minMatchCount = Math.min(...availablePlayers.map(p => playerMatchCounts.get(p.index) || 0));
	const maxMatchCount = Math.max(...availablePlayers.map(p => playerMatchCounts.get(p.index) || 0));
	
	// 경기수 차이가 2 이상 나지 않도록 제한
	const eligiblePlayers = availablePlayers.filter(p => {
		const matchCount = playerMatchCounts.get(p.index) || 0;
		return matchCount <= minMatchCount + 1; // 최소 경기수 + 1까지만 허용
	});
	
	console.log(`전체 ${availablePlayers.length}명 중 배정 가능한 선수: ${eligiblePlayers.length}명 (경기수 ${minMatchCount}-${minMatchCount + 1})`);
	
	if (eligiblePlayers.length < 4) {
		alert(`배정 가능한 선수가 부족합니다. (${eligiblePlayers.length}명)`);
		return;
	}
	
	// 2단계: 후보 선수 그룹 구성
	let candidateGroup = [];
	
	// 최소 경기수 선수들 먼저 추가
	const lowestMatchPlayers = eligiblePlayers.filter(p => (playerMatchCounts.get(p.index) || 0) === minMatchCount);
	candidateGroup.push(...lowestMatchPlayers);
	
	// 4명 미만이면 차순위 경기수 선수 추가
	if (candidateGroup.length < 4) {
		const nextLevelPlayers = eligiblePlayers.filter(p => (playerMatchCounts.get(p.index) || 0) === minMatchCount + 1);
		candidateGroup.push(...nextLevelPlayers.slice(0, 4 - candidateGroup.length));
	}
	
	console.log(`후보 그룹 구성 완료: ${candidateGroup.length}명`);
	
	// 3단계: 최적 4명 조합 선택
	selectedPlayers = selectOptimalComposition(candidateGroup);
	
	// 새로운 최적 구성 선택 함수 (README 규칙 기반)
	function selectOptimalComposition(candidatePlayers) {
		const males = candidatePlayers.filter(p => p.gender === '남');
		const females = candidatePlayers.filter(p => p.gender === '여');
		
		console.log(`후보 선수 구성: 남자 ${males.length}명, 여자 ${females.length}명`);
		
		// 우선순위 1: 남복 (남자 4명 이상)
		if (males.length >= 4) {
			console.log('남복 구성 가능');
			// 남복과 여복이 모두 가능하면 랜덤 선택
			if (females.length >= 4) {
				console.log('남복과 여복 모두 가능 - 랜덤 선택');
				if (Math.random() >= 0.5) {
					doublesType = '남복';
					return selectBestPlayers(males, 4);
				} else {
					doublesType = '여복';
					return selectBestPlayers(females, 4);
				}
			} else {
				doublesType = '남복';
				return selectBestPlayers(males, 4);
			}
		}
		
		// 우선순위 2: 여복 (여자 4명 이상)
		if (females.length >= 4) {
			console.log('여복 구성');
			doublesType = '여복';
			return selectBestPlayers(females, 4);
		}
		
		// 우선순위 3: 혼복 (남자 2명 이상 + 여자 2명 이상)
		if (males.length >= 2 && females.length >= 2) {
			console.log('혼복 구성');
			doublesType = '혼복';
			return createMixedDoubles(males, females);
		}
		
		// 우선순위 4: 잡복 (남자 3명 + 여자 1명 또는 남자 1명 + 여자 3명)
		if ((males.length === 3 && females.length >= 1) || 
			(males.length >= 1 && females.length === 3)) {
			console.log('잡복 구성');
			doublesType = '잡복';
			return createImbalancedMatch(males, females);
		}
		
		// 예외 상황: 위 조건에 맞지 않는 경우
		console.log('예외적 구성');
		doublesType = '기타';
		return candidatePlayers.slice(0, 4);
	}
	
	// 파트너 이력을 고려하여 최적의 선수들을 선택하는 함수
	function selectBestPlayers(players, count) {
		if (players.length <= count) {
			return players;
		}
		
		// 가능한 모든 조합 중에서 파트너 이력 점수가 가장 낮은 조합 찾기
		const combinations = getCombinations(players, count);
		let bestCombination = combinations[0];
		let bestScore = calculatePartnerHistoryScore(bestCombination);
		
		for (let i = 1; i < combinations.length; i++) {
			const score = calculatePartnerHistoryScore(combinations[i]);
			if (score < bestScore) {
				bestScore = score;
				bestCombination = combinations[i];
			}
		}
		
		console.log(`${count}명 중 최적 조합 선택 완료 (점수: ${bestScore})`);
		return bestCombination;
	}
	
	// 조합 생성 함수
	function getCombinations(array, size) {
		if (size > array.length) return [];
		if (size === array.length) return [array];
		if (size === 1) return array.map(item => [item]);
		
		const combinations = [];
		for (let i = 0; i <= array.length - size; i++) {
			const head = array[i];
			const tailCombinations = getCombinations(array.slice(i + 1), size - 1);
			for (let tailCombination of tailCombinations) {
				combinations.push([head, ...tailCombination]);
			}
		}
		return combinations;
	}
	
	// 파트너 이력 점수 계산
	function calculatePartnerHistoryScore(players) {
		let score = 0;
		
		// 가능한 모든 파트너 쌍에 대해 점수 계산
		for (let i = 0; i < players.length; i++) {
			for (let j = i + 1; j < players.length; j++) {
				const player1 = players[i];
				const player2 = players[j];
				
				const player1History = partnerHistory.get(player1.index) || new Set();
				const player2History = partnerHistory.get(player2.index) || new Set();
				
				// 이전에 파트너였던 경우 페널티 점수 추가
				if (player1History.has(player2.index) || player2History.has(player1.index)) {
					score += 10;
				}
			}
		}
		
		return score;
	}
	
	// 혼복 구성 함수 (각 팀에 남1+여1)
	function createMixedDoubles(males, females) {
		const selectedMales = selectBestPlayers(males, 2);
		const selectedFemales = selectBestPlayers(females, 2);
		
		// A팀: 남자1 + 여자1, B팀: 남자1 + 여자1
		return [selectedMales[0], selectedFemales[0], selectedMales[1], selectedFemales[1]];
	}
	
	// 잡복 구성 함수
	function createImbalancedMatch(males, females) {
		if (males.length >= 3 && females.length >= 1) {
			// 남자 3명 + 여자 1명
			const selectedMales = selectBestPlayers(males, 3);
			const selectedFemales = selectBestPlayers(females, 1);
			return [...selectedMales, ...selectedFemales];
		} else if (males.length >= 1 && females.length >= 3) {
			// 남자 1명 + 여자 3명
			const selectedMales = selectBestPlayers(males, 1);
			const selectedFemales = selectBestPlayers(females, 3);
			return [...selectedMales, ...selectedFemales];
		}
		
		// 예외 상황
		return [...males.slice(0, Math.min(males.length, 2)), 
				...females.slice(0, Math.min(females.length, 2))];
	}
	
	console.log(`${doublesType} 구성으로 대진 배정 완료`);
	
	// A팀과 B팀에 배정 (이미 올바른 순서로 구성되어 있음)
	const teamA = selectedPlayers.slice(0, 2);
	const teamB = selectedPlayers.slice(2, 4);
	
	// 다른 코트에 동일한 선수가 배정되어 있는지 확인
	const otherCourtNumber = courtNumber === 1 ? 2 : 1;
	const otherTeamADiv = document.getElementById(`court${otherCourtNumber}-team-a`);
	const otherTeamBDiv = document.getElementById(`court${otherCourtNumber}-team-b`);
	
	if (otherTeamADiv && otherTeamBDiv) {
		const otherPlayers = [];
		if (otherTeamADiv.innerHTML !== '-') {
			otherPlayers.push(...otherTeamADiv.innerHTML.split('<br>'));
		}
		if (otherTeamBDiv.innerHTML !== '-') {
			otherPlayers.push(...otherTeamBDiv.innerHTML.split('<br>'));
		}
		
		// 선택된 선수들 중 다른 코트에 이미 배정된 선수가 있는지 확인
		const duplicatePlayers = selectedPlayers.filter(player => 
			otherPlayers.includes(player.name)
		);
		
		if (duplicatePlayers.length > 0) {
			const duplicateNames = duplicatePlayers.map(p => p.name).join(', ');
			alert(`에러: 다음 선수들이 ${otherCourtNumber}번 코트에 이미 배정되어 있습니다: ${duplicateNames}`);
			return;
		}
	}
	
	// 화면에 표시 (성별에 따른 색상 적용)
	const teamADiv = document.getElementById(`court${courtNumber}-team-a`);
	const teamBDiv = document.getElementById(`court${courtNumber}-team-b`);
	
	const teamAPlayer1 = `<span class="player-${teamA[0].gender === '남' ? 'male' : 'female'}">${teamA[0].name}</span>`;
	const teamAPlayer2 = `<span class="player-${teamA[1].gender === '남' ? 'male' : 'female'}">${teamA[1].name}</span>`;
	const teamBPlayer1 = `<span class="player-${teamB[0].gender === '남' ? 'male' : 'female'}">${teamB[0].name}</span>`;
	const teamBPlayer2 = `<span class="player-${teamB[1].gender === '남' ? 'male' : 'female'}">${teamB[1].name}</span>`;
	
	teamADiv.innerHTML = `${teamAPlayer1}<br>${teamAPlayer2}`;
	teamBDiv.innerHTML = `${teamBPlayer1}<br>${teamBPlayer2}`;
	
	// 배정된 선수들을 assignedPlayers에 추가
	selectedPlayers.forEach(player => assignedPlayers.add(player.index));
	
	// 코트 상태 변경
	const statusIndicator = document.getElementById(`court${courtNumber}-status-indicator`);
	if (statusIndicator) {
		statusIndicator.textContent = '경기중';
		statusIndicator.classList.add('playing');
	}
	
	// 배정 버튼 숨기기
	const courtDiv = document.getElementById(`court${courtNumber}`);
	const assignBtn = courtDiv.querySelector('.assign-btn');
	if (assignBtn) {
		assignBtn.style.display = 'none';
	}
	
	// 대진표 컨테이너 표시
	const matchContainer = document.getElementById(`court${courtNumber}-match-container`);
	if (matchContainer) {
		matchContainer.style.display = 'flex';
	}
	
	// 완료 버튼 활성화
	const completeBtn = courtDiv.querySelector('.complete-btn');
	if (completeBtn) {
		completeBtn.disabled = false;
	}
	
	// 취소 버튼 표시
	const cancelBtn = courtDiv.querySelector('.cancel-btn');
	if (cancelBtn) {
		cancelBtn.style.display = 'block';
	}
	
	alert(`${courtNumber}번 코트에 선수 배정이 완료되었습니다.`);
}

function cancelAssignment(courtNumber) {
	// 현재 배정된 선수들을 assignedPlayers에서 제거
	const teamADiv = document.getElementById(`court${courtNumber}-team-a`);
	const teamBDiv = document.getElementById(`court${courtNumber}-team-b`);
	
	const teamAPlayers = teamADiv.innerHTML;
	const teamBPlayers = teamBDiv.innerHTML;
	
	if (teamAPlayers !== '-' && teamBPlayers !== '-') {
		// 배정된 선수들을 assignedPlayers에서 제거
		const form = document.getElementById('personForm');
		const canceledPlayerNames = [];
		
		// A팀과 B팀 선수 이름 추출
		const teamANames = teamAPlayers.split('<br>');
		const teamBNames = teamBPlayers.split('<br>');
		canceledPlayerNames.push(...teamANames, ...teamBNames);
		
		// 해당 선수들을 assignedPlayers에서 제거
		for (let i = 0; i < playerCount; i++) {
			const nameField = form[`name${i}`];
			if (nameField && nameField.value.trim()) {
				const playerName = nameField.value.trim();
				if (canceledPlayerNames.includes(playerName)) {
					assignedPlayers.delete(i);
				}
			}
		}
	}
	
	// 코트 초기화
	teamADiv.innerHTML = '-';
	teamBDiv.innerHTML = '-';
	
	// 코트 상태 변경
	const statusIndicator = document.getElementById(`court${courtNumber}-status-indicator`);
	if (statusIndicator) {
		statusIndicator.textContent = '대기중';
		statusIndicator.classList.remove('playing');
	}
	
	// 배정 버튼 다시 표시
	const courtDiv = document.getElementById(`court${courtNumber}`);
	const assignBtn = courtDiv.querySelector('.assign-btn');
	if (assignBtn) {
		assignBtn.style.display = 'block';
	}
	
	// 완료 버튼 비활성화
	const completeBtn = courtDiv.querySelector('.complete-btn');
	if (completeBtn) {
		completeBtn.disabled = true;
	}
	
	// 대진표 컨테이너 숨기기
	const matchContainer = document.getElementById(`court${courtNumber}-match-container`);
	if (matchContainer) {
		matchContainer.style.display = 'none';
	}
	
	// 취소 버튼 숨기기
	const cancelBtn = courtDiv.querySelector('.cancel-btn');
	if (cancelBtn) {
		cancelBtn.style.display = 'none';
	}
	
	alert(`${courtNumber}번 코트 배정이 취소되었습니다. 선수들이 다시 배정 가능한 상태가 되었습니다.`);
}

function completeMatch(courtNumber) {
	// 해당 코트의 선수들을 배정 해제
	const teamADiv = document.getElementById(`court${courtNumber}-team-a`);
	const teamBDiv = document.getElementById(`court${courtNumber}-team-b`);
	
	// 현재 대진 정보를 히스토리에 추가하기 전에 완료된 선수들을 찾아서 배정 해제
	const teamAPlayers = teamADiv.innerHTML;
	const teamBPlayers = teamBDiv.innerHTML;
	
	if (teamAPlayers !== '-' && teamBPlayers !== '-') {
		// 완료된 선수들을 assignedPlayers에서 제거하여 다시 배정 가능하게 만들기
		const form = document.getElementById('personForm');
		const completedPlayerNames = [];
		
		// A팀과 B팀 선수 이름 추출 (HTML 태그 제거)
		const teamANames = teamAPlayers.split('<br>').map(name => name.replace(/<[^>]*>/g, '').trim());
		const teamBNames = teamBPlayers.split('<br>').map(name => name.replace(/<[^>]*>/g, '').trim());
		completedPlayerNames.push(...teamANames, ...teamBNames);
		
		console.log('완료된 선수들:', completedPlayerNames);
		
		// 해당 선수들을 assignedPlayers에서 제거하고 경기수 증가, 파트너 이력 기록
		const completedPlayerIndices = [];
		
		for (let i = 0; i < playerCount; i++) {
			const nameField = form[`name${i}`];
			if (nameField && nameField.value.trim()) {
				const playerName = nameField.value.trim();
				if (completedPlayerNames.includes(playerName)) {
					// 배정된 선수 목록에서 제거 (다시 배정 가능하게 만들기)
					assignedPlayers.delete(i);
					completedPlayerIndices.push(i);
					
					// 경기수 증가
					const currentCount = playerMatchCounts.get(i) || 0;
					playerMatchCounts.set(i, currentCount + 1);
					
					// 화면에 경기수 업데이트
					const matchCountSpan = document.getElementById(`match-count-${i}`);
					if (matchCountSpan) {
						matchCountSpan.textContent = `${currentCount + 1}`;
						console.log(`${playerName}의 경기수가 ${currentCount + 1}로 업데이트됨`);
					} else {
						console.log(`match-count-${i} 요소를 찾을 수 없음`);
					}
				}
			}
		}
		
		// 파트너 이력 기록 (A팀 내 파트너, B팀 내 파트너)
		if (completedPlayerIndices.length === 4) {
			// A팀 선수들 (첫 2명)
			const teamAIndices = completedPlayerIndices.slice(0, 2);
			// B팀 선수들 (나머지 2명)
			const teamBIndices = completedPlayerIndices.slice(2, 4);
			
			// A팀 파트너 이력 기록
			recordPartnership(teamAIndices[0], teamAIndices[1]);
			// B팀 파트너 이력 기록
			recordPartnership(teamBIndices[0], teamBIndices[1]);
			
			console.log('파트너 이력 기록 완료');
		}
		
		const historyDiv = document.getElementById(`court${courtNumber}-history`);
		const historyItem = document.createElement('div');
		historyItem.className = 'history-item';
		
		const now = new Date();
		const timeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
		
		historyItem.innerHTML = `
			<div style="font-weight: bold; margin-bottom: 5px;">${timeString} 완료</div>
			<div class="teams">
				<div class="team">${teamAPlayers}</div>
				<div class="vs">VS</div>
				<div class="team">${teamBPlayers}</div>
			</div>
		`;
		
		historyDiv.appendChild(historyItem);
		
		// 스크롤을 최신 항목으로 이동
		historyDiv.scrollTop = historyDiv.scrollHeight;
	}
	
	// 코트 초기화
	teamADiv.innerHTML = '-';
	teamBDiv.innerHTML = '-';
	
	// 코트 상태 변경
	const statusIndicator = document.getElementById(`court${courtNumber}-status-indicator`);
	if (statusIndicator) {
		statusIndicator.textContent = '대기중';
		statusIndicator.classList.remove('playing');
	}
	
	// 배정 버튼 다시 표시
	const courtDiv = document.getElementById(`court${courtNumber}`);
	const assignBtn = courtDiv.querySelector('.assign-btn');
	const completeBtn = courtDiv.querySelector('.complete-btn');
	const cancelBtn = courtDiv.querySelector('.cancel-btn');
	
	if (assignBtn) {
		assignBtn.style.display = 'block';
	}
	
	// 완료 버튼 다시 비활성화
	if (completeBtn) {
		completeBtn.disabled = true;
	}
	
	// 대진표 컨테이너 숨기기
	const matchContainer = document.getElementById(`court${courtNumber}-match-container`);
	if (matchContainer) {
		matchContainer.style.display = 'none';
	}
	
	// 취소 버튼 숨기기
	if (cancelBtn) {
		cancelBtn.style.display = 'none';
	}
	
	alert(`${courtNumber}번 코트 경기가 완료되었습니다. 선수들이 다시 배정 가능한 상태가 되었습니다.`);
}

document.addEventListener('DOMContentLoaded', function() {
	// 첫 번째 선수 입력 폼 자동 생성
	addNextPlayer();
	
	// 테스트입장 버튼 이벤트 리스너 추가
	const testButton = document.getElementById('testButton');
	testButton.addEventListener('click', testEntry);
	
	// FIXED 테스트입장 버튼 이벤트 리스너 추가
	const fixedTestButton = document.getElementById('fixedTestButton');
	fixedTestButton.addEventListener('click', fixedTestEntry);
	
	// 기본입장 버튼 이벤트 리스너 추가
	const defaultEntryButton = document.getElementById('defaultEntryButton');
	defaultEntryButton.addEventListener('click', defaultEntry);
	
	const form = document.getElementById('personForm');
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const resultDiv = document.getElementById('result');
		resultDiv.innerHTML = '';
		const people = [];
		for (let i = 0; i < playerCount; i++) {
			const nameField = form[`name${i}`];
			if (nameField) {
				const name = nameField.value.trim();
				const gender = getSelectedGender(i);
				if (name && gender) {
					const status = absentPlayers.has(i) ? '퇴장' : '입장완료';
					people.push({ name, gender, status });
				}
			}
		}
		if (people.length === 0) {
			resultDiv.textContent = '입력된 정보가 없습니다.';
		} else {
			const ul = document.createElement('ul');
			people.forEach(person => {
				const li = document.createElement('li');
				li.textContent = `${person.name} (${person.gender}) - ${person.status}`;
				if (person.status === '퇴장') {
					li.style.color = '#ff6b6b';
				} else if (person.status === '입장완료') {
					li.style.color = '#4CAF50';
				}
				ul.appendChild(li);
			});
			resultDiv.appendChild(ul);
		}
	});
});

// 파트너십 기록 함수
function recordPartnership(playerIndex1, playerIndex2) {
	// playerIndex1의 파트너 이력에 playerIndex2 추가
	if (!partnerHistory.has(playerIndex1)) {
		partnerHistory.set(playerIndex1, new Set());
	}
	partnerHistory.get(playerIndex1).add(playerIndex2);
	
	// playerIndex2의 파트너 이력에 playerIndex1 추가
	if (!partnerHistory.has(playerIndex2)) {
		partnerHistory.set(playerIndex2, new Set());
	}
	partnerHistory.get(playerIndex2).add(playerIndex1);
	
	console.log(`파트너십 기록: 선수 ${playerIndex1} - 선수 ${playerIndex2}`);
}
