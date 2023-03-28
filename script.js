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
			data = output;
	
			for(const keys in output ) {
				let h2 = document.createElement("h2");
				h2.innerHTML = keys.trim();
				body.appendChild(h2);
				let wrapper = document.createElement("div");
				wrapper.classList.add("wrapper");

				for(var n=0,key=output[keys.trim()];n<key.length;n++){
					let btn = document.createElement("div");
					btn.classList.add("btn");
					btn.innerHTML = keys.trim() + (n+1);
					wrapper.appendChild(btn);
				}
				body.appendChild(wrapper);
				
				let btn = document.querySelectorAll(".btn");
				btn.forEach( (value) => {
					let cls = value.innerHTML.replace(/\d/g,"");
					let num = value.innerHTML.replace(cls,"");
					value.addEventListener("click", (e)=> {
						value.classList.add("check");
						let win_body = show_window.document.getElementById("body");
						modal.style.left = "0";
						// 下でモーダルに追加してるためリセットする
						modal.innerHTML = "";
						let h3 = document.createElement("h3");
						h3.innerHTML = e.target.innerHTML;
						let div = document.createElement("div");
						div.appendChild(h3);
						div.id = "container";
						div.innerHTML = data[cls][num-1]["質問"]
							+ `<button onclick="
								show_window.document.getElementById('body').innerHTML = '${data[cls][num-1]['答え']}';
								">答え</button>`
							+ data[cls][num-1]["答え"];
						div.style.fontSize = "2rem";

						win_body.innerHTML = data[cls][num-1]["質問"];
						
						modal.appendChild(div);
					})
				})
			}
			let range = document.createElement("input");
				range.setAttribute("type","range");
				range.setAttribute("min","1");
				range.setAttribute("max","10");
				range.setAttribute("step","0.3");
				range.setAttribute("value","2");
				range.id = "range";
				body.appendChild(range);
			document.getElementById("range").addEventListener("input",(e)=> {
				show_window.document.getElementById("body").style.fontSize = e.target.value + "rem";
			})
		}).catch(err => {
		console.log("エラー内容"+err);
	});
}
modal.addEventListener("click", (e)=> {
	if(e.target.id == "modal") {
		modal.style.left = "-100vw";
		show_window.document.getElementById("body").innerHTML = "";
	}
})