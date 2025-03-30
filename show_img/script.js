let show_window = window.open("./show.html", "show_window")
let modal = document.getElementById("modal");
let data;

if( getParam('url') ) {
	view(getParam('url'));
	document.getElementById("spreadsheet_id").remove();
	document.getElementById("spreadsheet_submit").remove();
}
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function view(url) {
	const converse_to_JSON_API = "https://script.google.com/macros/s/AKfycbywkvE7kC7zNtCnSh-fZ_8-KIonle4wRx8eY7xYuF_uGlsxiv0N4FuGIv1jJAJVK9r_/exec";
	fetch(converse_to_JSON_API + "?sheet_id=" +url)
		.then(result => result.json())
		.then((output) => {
			let body = document.getElementById("body");
			let data = output;

			// Num型でも全てStringに変換する
			let classes = Object.keys(output);
			for( let n = 0; n < classes.length; n++ ) {
				for( let i = 0; i < output[classes[n]].length; i++ ) {
					data[classes[n]][i]["質問"] = output[classes[n]][i]["質問"].toString();
					data[classes[n]][i]["答え"] = output[classes[n]][i]["答え"].toString();
				}
			}
	
			for(const keys in output ) {
				let h2 = document.createElement("h2");
				h2.innerHTML = keys.trim();
				body.appendChild(h2);
				let wrapper = document.createElement("div");
				wrapper.classList.add("wrapper");

				for( let n = 0, key = output[keys.trim()]; n <key.length; n++ ){
					let btn = document.createElement("div");
					btn.classList.add("btn");
					btn.innerHTML = `<p><u>${keys.trim().replace(/クラス/g,"")}${(n+1)}</u></p><p>${data[keys.trim()][n]["質問"].slice(0,20)}...</p>`;
					btn.dataset.cls = keys.trim();
					btn.dataset.num = (n+1);
					wrapper.appendChild(btn);
				}
				body.appendChild(wrapper);
				
				let btn = document.querySelectorAll(".btn");
				btn.forEach( (value) => {
					let cls = value.dataset.cls;
					let num = value.dataset.num;
					value.addEventListener("click", (e)=> {
						value.classList.add("check");
						let win_body = show_window.document.getElementById("body");
						modal.classList.toggle("open")
						modal.style.left = "0";
						// 下でモーダルに追加してるためリセットする
						modal.innerHTML = "";
						let div = document.createElement("div");
						div.id = "container";
						div.innerHTML = "<p id='question'>"+data[cls][num-1]["質問"].replace("\n","<br>") + "</p>"
						+ `<button id='show_answer'>答え</button>`
						+ "<p id='answer'>" +data[cls][num-1]["答え"].replace("\n","<br>") + "</p>";
						div.style.fontSize = "2rem";
						win_body.innerHTML = data[cls][num-1]["質問"].replace(/[\n/]/,"<br>");
						
						modal.appendChild(div);

						document.getElementById("show_answer").addEventListener("click",(e)=>{
							show_window.document.getElementById("body").innerHTML = (document.getElementById("answer").innerHTML).replace(/[\n/]/,"<br>");
						})
					})
				})
			}
			let range = document.createElement("input");
				range.setAttribute("type","range");
				range.setAttribute("min","1");
				range.setAttribute("max","10");
				range.setAttribute("step","0.3");
				range.setAttribute("value","4");
				range.id = "range";
				body.appendChild(range);
			show_window.document.getElementById("body").style.fontSize = "4rem";
			document.getElementById("range").addEventListener("input",(e)=> {
				show_window.document.getElementById("body").style.fontSize = e.target.value + "rem";
			})
		}).catch(err => {
		console.log("エラー内容"+err);
	});
}
modal.addEventListener("click", (e)=> {
	if(e.target.id == "modal") {
		modal.classList.toggle("open");
		modal.style.left = "-100vw";
		show_window.document.getElementById("body").innerHTML = "";
	}
})