
var goalx;
var goaly;
var startx;
var starty;

var val=document.getElementById("slider").value;
var row=val;
var col=val;

var MD=[];
var PD=[];
var huristic=[];
var FX=[];//f(x)
var MW=[];//mapWeight
var parent=[];
var path=[];

for (var i=0;i<col;i++){
	MD[i]=[];
	PD[i]=[];
	FX[i]=[];
	MW[i]=[];
	parent[i]=[];
}

var alpha=document.getElementById("alpha");
alpha.addEventListener("input", ipAlpha, false);
var a=1;

var re=document.getElementById("reset");
re.addEventListener("click", resetBt,false);

var startFlag=0;
var startPoint;
var st=document.getElementById("startPoint");
st.addEventListener("click", startPoint, false);

var endFlag=0;
var endPoint;
var ed=document.getElementById("endPoint");
ed.addEventListener("click", endPoint, false);

var wall=document.getElementById("walls");
wall.addEventListener("click", addWalls, false);

var choice = document.getElementById("hueristic");
choice.addEventListener("click",addValues,false);

var stat = document.getElementById("status");
stat.style.display = "none";

var done=document.getElementById("done");
done.addEventListener("click", doneDanaaDone, false);

var solveMaze=document.getElementById("solveMaze");
solveMaze.addEventListener("click", mazeSolver, false);

var ran = document.getElementById("slider");
ran.onchange=create_table;


function create_table()
{
	
	var main1=document.getElementById("main");
	document.body.removeChild(main1);
	var slider=document.getElementById("slider");
	var n=slider.value;
	var val=n;
	row=n;
	col=n;
	var table=document.createElement("table");
	table.id="main";
	var table1=document.createElement("table");
	table.appendChild(table1);
	
	
	console.log("resize");
	for(i=0;i<n;i++)
	{
		var tr=document.createElement("tr");
		for(j=0;j<n;j++)
		{
			var td=document.createElement("td");
			td.className="off";
			//console.log(td.className);
			tr.appendChild(td);
		}	
		table1.appendChild(tr);
	}
	h1=document.getElementById("h1");
	document.body.appendChild(table);
	MD=[];
	PD=[];
	FX=[];
	MW=[];
	parent=[];
	for (var i=0;i<col;i++){
		MD[i]=[];
		PD[i]=[];
		FX[i]=[];
		MW[i]=[];
		parent[i]=[];
	}
	
}



function addWalls()
{
	removeStart();
	removeEnd();
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			//console.log(board);
			board.children[0].children[i].children[j].addEventListener("click",select,false);
		}
	}
}

function removeWalls()
{
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			board.children[0].children[i].children[j].removeEventListener("click",select,false);
		}
	}	
}

function select(e){
//	console.log(e.target);
	if(e.target.className=="on")
		e.target.className="off";
	else
		e.target.className="on";
}

function resetBt(){
	reset();
	calcFXandMW();
}

function reset(){
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			if(board.children[0].children[i].children[j].className=="path" || board.children[0].children[i].children[j].className=="visited")
				board.children[0].children[i].children[j].className="off";
		}
	}
	var s=document.getElementById("count");
	s.innerHTML="0";
}



function select(e){
//	console.log(e.target);
	if(e.target.className=="on")
		e.target.className="off";
	else
		e.target.className="on";
}



function startPoint(){
	removeWalls();
	removeEnd();
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			//console.log(board);
			board.children[0].children[i].children[j].addEventListener("click",selectStart,false);
		}
	}
}



function selectStart(e){
//	console.log(e.target);
	if(e.target.className=="off")
	{
		if(startFlag==0)
		{
			e.target.className="startOn";
			startPoint=e;
			startFlag=1;
		}
		else
		{
			e.target.className="startOn";
			startPoint.target.className="off";
			startPoint=e;
		}
			
	}
	startx=e.target.parentElement.rowIndex;
	starty=e.target.cellIndex;
}

function removeStart()
{
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			board.children[0].children[i].children[j].removeEventListener("click",selectStart,false);
		}
	}	
}

function endPoint(){
	removeWalls();
	removeStart();
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			//console.log(board);
			board.children[0].children[i].children[j].addEventListener("click",selectEnd,false);
		}
	}
}

function selectEnd(e){
//	console.log(e.target);
	if(e.target.className=="off")
	{
		if(endFlag==0)
		{
			e.target.className="endOn";
			endPoint=e;
			endFlag=1;
		}
		else
		{
			e.target.className="endOn";
			endPoint.target.className="off";
			endPoint=e;
		}
	}
    goalx=e.target.parentElement.rowIndex;
	goaly=e.target.cellIndex;
}

function removeEnd()
{
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			board.children[0].children[i].children[j].removeEventListener("click",selectEnd,false);
		}
	}	
}

function calcFXandMW(){
	var board=document.getElementById("main");
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			if(board.children[0].children[i].children[j].className=="startOn")
			{
				FX[i][j]=0;
				MW[i][j]=(a*huristic[i][j]);
			}
			else
			{
				FX[i][j]="inf";
				MW[i][j]="inf";
			}
		}
	}
}

function addValues()
{
	reset();
//	console.log(goalx,goaly);
	removeStart();
	removeEnd();
	removeWalls();
	var value = choice.options[choice.selectedIndex].text;
	var board=document.getElementById("main");
//    console.log(goalx,goaly);
	if(value=="Manhattan Distance")
	{
		for(var i=0;i<row;i++)
		{
			for(var j=0;j<col;j++)
			{
				if(board.children[0].children[i].children[j].className=="off" && board.children[0].children[i].children[j].className!="startOn" && board.children[0].children[i].children[j].className!="endOn")
				{
					board.children[0].children[i].children[j].innerHTML = MD[i][j];
				}
			}
		}
		huristic=MD;
	}
	if(value=="Pythagorean Distance")
	{
		for(var i=0;i<row;i++)
		{
			for(var j=0;j<col;j++)
			{
				if(board.children[0].children[i].children[j].className=="off" && board.children[0].children[i].children[j].className!="startOn" && board.children[0].children[i].children[j].className!="endOn")
				{
					board.children[0].children[i].children[j].innerHTML = PD[i][j];
				}
			}
		}
		huristic=PD;
	}
	calcFXandMW();
//	console.log("FX:");
//	console.log(FX);
//	console.log("MW");
//	console.log(MW);
}


function calcDist(){
	var board=document.getElementById("main");
//    console.log(goalx,goaly);
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			var dist1 = Math.abs((goalx-i)) + Math.abs((goaly-j));
			MD[i][j]=dist1;
			var dist2 = Math.sqrt(((goalx-i)*(goalx-i)) + ((goaly-j)*(goaly-j)))
			dist2 = dist2.toPrecision(2)
			PD[i][j]=dist2;
		}
	}
	
}

function doneDanaaDone(){
	console.log("done");

	calcDist();
	
	removeStart();
	removeEnd();
	removeWalls();
	var builder=document.getElementById("builder");
	var right=document.getElementById("right");
	right.removeChild(builder);
	var solver= document.getElementById("solver");
	solver.style.display="block";


	var board=document.getElementById("main");
    for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			if(board.children[0].children[i].children[j].className=="off" && board.children[0].children[i].children[j].className!="startOn" && board.children[0].children[i].children[j].className!="endOn")
			{
				board.children[0].children[i].children[j].innerHTML = MD[i][j];
			}
		}
	}
	huristic=MD;
	//	console.log("huristic");
	//	console.log(huristic);
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			if(board.children[0].children[i].children[j].className=="startOn")
			{
				FX[i][j]=0;
				MW[i][j]=(a*huristic[i][j]);
			}
			else
			{
				FX[i][j]="inf";
				MW[i][j]="inf";
			}
		}
	}
//	console.log("FX:");
//	console.log(FX);
//	console.log("MW");
//	console.log(MW);
}




function findPath(min){
	var board=document.getElementById("main");
	for(var i=0;i<path.length;i++){
		if(board.children[0].children[path[i][0]].children[path[i][1]].className=="path")
			board.children[0].children[path[i][0]].children[path[i][1]].className="visited";
	}
	var x=0;
	path=[];
	cur=[min[0], min[1]];
//	console.log(min,cur);
//	console.log(parent);
	while(cur[0]!=-1 && cur[1]!=-1 && parent[cur[0]][cur[1]]!=[-1,-1]){
		if(board.children[0].children[cur[0]].children[cur[1]].className=="off" || board.children[0].children[cur[0]].children[cur[1]].className=="visited")
			board.children[0].children[cur[0]].children[cur[1]].className="path";
//		console.log(min,cur);
		path[x]=cur;
		x++;
		cur=parent[cur[0]][cur[1]];
	}
	console.log("min:", min);
	console.log("path:");
	console.log(path);

}


function mazeSolver(){
	
	var steps=0;

//	console.log(goalx, goaly);
//	console.log(huristic);
//	console.log(FX);
//	console.log(MW);

	parent[startx][starty]=[-1,-1];
	while(MW[goalx][goaly]=="inf"){
		steps++;
		var min="inf";//[x,y,val]
		var noNum=true;
		
		for(var i=0;i<row;i++){
			for(var j=0;j<col;j++){
				if (noNum){
					noNum=isNaN(MW[i][j]);
//					console.log(isNaN(MW[i][j]), MW[i][j]);
				}
				
				if(MW[i][j]!="inf" && MW[i][j]!="X"){
					if (min=="inf"){
						min=[i,j,MW[i][j]];
					}
					else if(MW[i][j]<min[2]){
						min=[i,j,MW[i][j]];
					}
				}
			}
		}

		if(noNum){
			stat.style.display = "block";
			be = document.getElementById("beauty");
			be.style.color="black";
			be.innerHTML = "No Path Detected!"
			console.log("IMPOSSIBLE");
			return;
		}
		
		
//		findPath(min);

		var board=document.getElementById("main");
		
		if(min[1]===0){//first column
			if(board.children[0].children[min[0]].children[min[1]+1].className=="on"){}
			else if(MW[min[0]][min[1]+1]=="X"){}
			else if(FX[min[0]][min[1]+1]=="inf"){
				FX[min[0]][min[1]+1]= FX[min[0]][min[1]]+1;
				MW[min[0]][min[1]+1]= (a*huristic[min[0]][min[1]+1])+FX[min[0]][min[1]+1];
				parent[min[0]][min[1]+1]=[min[0],min[1]];
			}
		}
		
		else if (min[1]==col-1){
			if(board.children[0].children[min[0]].children[min[1]-1].className=="on"){}
			else if(MW[min[0]][min[1]-1]=="X"){}
			else if(FX[min[0]][min[1]-1]=="inf"){
			FX[min[0]][min[1]-1]= FX[min[0]][min[1]]+1;
				MW[min[0]][min[1]-1]= (a*huristic[min[0]][min[1]-1])+FX[min[0]][min[1]-1];
				parent[min[0]][min[1]-1]=[min[0],min[1]];
			}
		}
		else{
			if(board.children[0].children[min[0]].children[min[1]+1].className=="on"){}
			else if(MW[min[0]][min[1]+1]=="X"){}
			else if(FX[min[0]][min[1]+1]=="inf"){
				FX[min[0]][min[1]+1]= FX[min[0]][min[1]]+1;
				MW[min[0]][min[1]+1]= (a*huristic[min[0]][min[1]+1])+FX[min[0]][min[1]+1];
				parent[min[0]][min[1]+1]=[min[0],min[1]];
			}
			if(board.children[0].children[min[0]].children[min[1]-1].className=="on"){}
			else if(MW[min[0]][min[1]-1]=="X"){}
			else if(FX[min[0]][min[1]-1]=="inf"){
				FX[min[0]][min[1]-1]= FX[min[0]][min[1]]+1;
				MW[min[0]][min[1]-1]= (a*huristic[min[0]][min[1]-1])+FX[min[0]][min[1]-1];
				parent[min[0]][min[1]-1]=[min[0],min[1]];
			}
		}
		
		if(min[0]===0){//first row
			if(board.children[0].children[min[0]+1].children[min[1]].className=="on"){}
			else if(MW[min[0]+1][min[1]]=="X"){}
			else if(FX[min[0]+1][min[1]]=="inf"){
				FX[min[0]+1][min[1]]= FX[min[0]][min[1]]+1;
				MW[min[0]+1][min[1]]= (a*huristic[min[0]+1][min[1]])+FX[min[0]+1][min[1]];
				parent[min[0]+1][min[1]]=[min[0],min[1]];
			}
		}
		
		else if (min[0]==row-1){
			if(board.children[0].children[min[0]-1].children[min[1]].className=="on"){}
			else if(MW[min[0]-1][min[1]]=="X"){}
			else if(FX[min[0]-1][min[1]]=="inf"){
				FX[min[0]-1][min[1]]= FX[min[0]][min[1]]+1;
				MW[min[0]-1][min[1]]= (a*huristic[min[0]-1][min[1]])+FX[min[0]-1][min[1]];
				parent[min[0]-1][min[1]]=[min[0],min[1]];
			}
		}
		else{
			if(board.children[0].children[min[0]+1].children[min[1]].className=="on"){}
			else if(MW[min[0]+1][min[1]]=="X"){}
			else if(FX[min[0]+1][min[1]]=="inf"){
				FX[min[0]+1][min[1]]= FX[min[0]][min[1]]+1;
				MW[min[0]+1][min[1]]= (a*huristic[min[0]+1][min[1]])+FX[min[0]+1][min[1]];
				parent[min[0]+1][min[1]]=[min[0],min[1]];
			}
			if(board.children[0].children[min[0]-1].children[min[1]].className=="on"){}
			else if(MW[min[0]-1][min[1]]=="X"){}
			else if(FX[min[0]-1][min[1]]=="inf"){
				FX[min[0]-1][min[1]]= FX[min[0]][min[1]]+1;
				MW[min[0]-1][min[1]]= (a*huristic[min[0]-1][min[1]])+FX[min[0]-1][min[1]];
				parent[min[0]-1][min[1]]=[min[0],min[1]];
			}
		}
//		if(board.children[0].children[min[0]].children[min[1]].className!="on" && board.children[0].children[min[0]].children[min[1]].className!="startOn" && board.children[0].children[min[0]].children[min[1]].className!="endOn" && board.children[0].children[min[0]].children[min[1]].className!="path")
//			board.children[0].children[min[0]].children[min[1]].className="visited";
		MW[min[0]][min[1]]="X";
		//		console.log(MW);
		findPath(min);
				
	}
	console.log("steps:",steps);
	var s=document.getElementById("count");
	s.innerHTML=steps;
	console.log(MW);
}

function ipAlpha(){
	reset();
	calcFXandMW();
	e=document.getElementById("alpha")
	console.log("a=",e.value);
	a=e.value;
}
