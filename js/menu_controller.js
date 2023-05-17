function start_game(){
	let name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./html/cohetegame.html");
}