//汎用化について　ヘッダーをkeyにするのが未完成
function view(url) {
	const converse_to_JSON_API = "https://script.google.com/macros/s/AKfycbywkvE7kC7zNtCnSh-fZ_8-KIonle4wRx8eY7xYuF_uGlsxiv0N4FuGIv1jJAJVK9r_/exec";
	fetch(converse_to_JSON_API + "?sheet_id=" +url)
		.then(result => result.json())
		.then((output) => {
			result = "";
	
			for(const keys in output ) {
				result += "<h2>" + keys.trim() + "</h2>";
				result += "<div id='wrapper'>";
				for(var n=0,key=output[keys];n<key.length;n++){
					result += "<div class='wrap'>";
					result += `<div id="${keys.trim()}${n+1}" class="quiz_num active_one active" onclick="showQuestion('${keys}',${n+1});">${keys} 問${n+1}</div>`;
					result += `<div id="${keys.trim()}${n+1}Question" class="" onclick="showAnswer('${keys}',${n+1});"> ${key[n].Question} </div>`;
					result += `<div id="${keys.trim()}${n+1}Answer" class=""> ${key[n].Answer} </div>`;
					result += "</div>";
				}
				result += "</div>"
			}
			document.getElementById("output").innerHTML = result;
			document.getElementById("log").innerHTML = "";

			document.getElementById("spreadsheet_id").remove();
			document.getElementById("spreadsheet_submit").remove();
	}).catch(err => {
		console.error("エラー内容"+err);
		document.getElementById("log").innerHTML = "リンクが正しくないか権限がありません";
	});
}

function showQuestion(key,index) {
	const self = document.getElementById(key+index);
	const question = document.getElementById(key+index+"Question");
	const answer   = document.getElementById(key+index+"Answer");
	
	if( question.className.includes("active_two") ){
		self.classList.toggle("active_one");
		self.classList.toggle("active_two");
		question.classList.toggle("active_two");
		question.classList.toggle("active");
	} else if( !question.className.includes("active_two") && !question.className.includes("active_three") ) {
		self.classList.toggle("active_one");
		self.classList.toggle("active_two");
		question.classList.toggle("active");
		question.classList.toggle("active_two");
		disp_modal(self.innerHTML,question.innerHTML,answer.innerHTML);
	} else if( question.className.includes("active_three") ) {
		self.classList.toggle("active_three");
		self.classList.toggle("active_one");
		self.style.backgroundColor = "skyblue";
		question.classList.toggle("active_three");
		answer.classList.toggle("active_three");
		
		question.classList.toggle("active");
		answer.classList.toggle("active");
		
		question.classList.toggle("unactive");
		answer.classList.toggle("unactive");
	}
}
function showAnswer(key,index) {
	const self = document.getElementById(key+index);
	const question = document.getElementById(key+index+"Question");
	const answer   = document.getElementById(key+index+"Answer");

	if( question.className.includes("active_two") ) {
		self.classList.toggle("active_two");
		self.classList.toggle("active_three");
		question.classList.toggle("active_two");
		question.classList.toggle("active_three");
		answer.classList.toggle("active_three");
		answer.classList.toggle("active");
	} else if( answer.className.includes("active_three") ) {
		self.classList.toggle("active_three");
		self.classList.toggle("active_two");
		question.classList.toggle("active_three");
		question.classList.toggle("active_two");
		answer.classList.toggle("active_three");
		answer.classList.toggle("active");
	}
}

function disp_modal(self,question,answer) {
	const modal_wrap = document.getElementById("modal_wrap");
	const modal = document.getElementById("modal");

	modal.innerHTML =
		`
			<p id="num_index">${self}</p>
			<p id="question">${question}</p>
			<p id="answer" style="color: red;">${answer}</p>
		`;
		
	modal_wrap.onclick = (e) => {
		if(e.target.id == "modal_wrap") modal_wrap.style.left = "-100%";
	};
	modal.onclick = () => { document.getElementById("answer").style.display = "block"; };
	modal_wrap.style.left = "0";
}