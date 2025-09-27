# Hello World Web Service

This project is a simple web service that outputs "Hello, World" to the web page using HTML and JavaScript.

## Project Structure

```
hello-world-web-service
├── src
│   ├── index.html
│   └── app.js
├── .gitignore
└── README.md
```

## Files

- `src/index.html`: Contains the HTML structure of the web service.
- `src/app.js`: Contains the JavaScript code that outputs "Hello, World" to the web page.
- `.gitignore`: Specifies files and directories to be ignored by Git.

## How to Run

1. Clone the repository to your local machine.
2. Open the `src/index.html` file in a web browser.
3. You should see "Hello, World" displayed on the page.

## License

This project is licensed under the MIT License.


조건:


남복: 남자 4명 이상 → 남자 4명 선택
여복: 여자 4명 이상 → 여자 4명 선택
혼복: 남자 2명 이상 + 여자 2명 이상 → 각 팀에 남1+여1
잡복: 남자 3명 + 여자 1명 또는 남자 1명 + 여자 3명

복식 경기로 할당해야 하며, 선수별로 최대한 골고루 싸울 수 있어야 함.

배정 알고리즘의 규칙은 다음과 같음:

1. 우선 가장 낮은 경기수를 갖는 선수들의 리스트를 구성.
2. 만약 리스트의 선수 명수가 4명이 안되면, 차순위의 경기수를 갖는 선수까지 포함해서 4명 선수의 리스트를 만듬. 이 때 최대한 남복 또는 여복이 되도록 구성하고, 그게 안되면 혼복, 그게 안되면 잡복으로 4명 구성.
3. 만약 리스트의 선수 명수가 5명 이상이면, 여기서도 남복 또는 여복을 우선적으로 하여 4명 구성, 그다음 혼복, 그리고 잡복 순으로.

그외 조건:
남복과 여복 구성이 모두 가능할 때 랜덤하게 선택.
동일한 복식 파트너를 만나는 경우와 동일한 상대편을 만나는 경우를 가능한 최소화.
선수별 경기수의 차이가 절대로 2경기 이상 나지 않아야 함. 퇴장한 선수의 경우는 예외.










선수이름을 입력하면 그 선수는 테니스장에 들어오게 됨.
