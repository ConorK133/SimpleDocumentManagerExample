var DocList = [];
var totalDocs = 0;
var userInfo = {
	admin: false, username: 'Conor'
}

class Document {
	constructor(docInfo) {
		this.projectCode = docInfo.projectCode;
		this.groupCode = docInfo.groupCode;
		this.docType = docInfo.docType;
		this.docNumber = docInfo.docNumber;
		this.docTitle = docInfo.docTitle;
		this.docCreator = docInfo.docCreator;
		this.docDate = docInfo.docDate;
		this.uploaded = docInfo.uploaded;
	}
};

class User {
	constructor(userInfo){
		this.admin = userInfo.admin;
		this.username = userInfo.username;
	}
}

//------------------- Document Structure Methods -------------------------
function CreateDoc(docInfo)
{
	// Creates Document from the information prepared in PrepareDoc
	// User and date specific information is added and the new document is added to the Document array
	docInfo.docNumber = GetDocNumber();
	docInfo.docCreator = userInfo.username;

	var today = new Date();
	docInfo.docDate = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();

	var newDoc = new Document(docInfo);
	DocList.push(newDoc);
}

function DeleteDoc(docToFind)
{
	// Checks if the user is an admin.
	// if it is find the index of the document number passed and cut it from the array
	if (userInfo.admin) {
		var index = DocList.indexOf(DocList.find(x => x.docNumber === docToFind));
		if(index > -1)
		{
			DocList.splice(index, 1);	
		}
	}
	else{
		alert("You do not have permission to perform this action");
	}
}

function EditDoc(docInfo)
{
	// Checks if the user is an admin
	//	if it is find the index of the document number passed, take the information that is allow to be edited, passed from the from and update the Document at the index. 
	if (userInfo.admin) {
		var docExists = DocList.find(x => x.docNumber === docInfo);
		if (docExists) {
			var x = document.getElementById("my_form");
			var index = DocList.indexOf(docExists);

			DocList[index].projectCode = x.elements[0].value;
			DocList[index].groupCode = x.elements[1].value
			DocList[index].docType = x.elements[2].value
			DocList[index].docTitle = x.elements[3].value

			x.reset();
		}
	}
}

function PrepareDoc(){
	//Take the information from the form and pass it to create doc
	var x = document.getElementById("my_form");
	var doc = {};

	doc.projectCode = x.elements[0].value;
	doc.groupCode = x.elements[1].value;
	doc.docType = x.elements[2].value;
	doc.docTitle = x.elements[3].value;
	doc.uploaded = x.elements[4].value;
   
    x.reset();
    CreateDoc(doc);
}

function GetDocNumber()
{
	//creates document number. Appends zeros to 6 digits
	totalDocs++;
	var temp = "" + totalDocs;
	while(temp.length < 6)
	{
		temp = "0" + temp;
	}
	return temp;
}


//------------------- Sorting methods -------------------------

function SortDocs(param, order)
{
	// sorts the document array with dynamicSort as a comparitor
	DocList.sort(dynamicSort(param, order));
}

function dynamicSort(param, order) {
	// uses the parameter and order passed to compare and return it to the sort method.
    return function (a,b) {
        var result = (a[param] < b[param]) ? -1 : (a[param] > b[param]) ? 1 : 0;
        return result * order;
    }
}

//------------------ HTML Editing methods -------------------------

function printdocs(){
	// itterates through document list and appends to Div
	var docs = document.getElementById("doc-holder");

	for (var i = 0;  DocList.length > i; i++) {
		appendNewDoc(i);
	}
	
}

function appendNewDoc(index, newDoc){
	// Creates new HTML Element for the Document passed and appends it to the document holder
	if (newDoc) {
		index = DocList.length-1;
	}
	var docs = document.getElementById("doc-holder");

	var btn = addBtn(index, "edit");
	var btn2 = addBtn(index, "del");

	var message = document.createElement('div');
	message.setAttribute('class','lobby-message');
	message.style.backgroundSize = 'cover';
	message.textContent = docToString(DocList[index]);
	message.appendChild(btn);
	message.appendChild(btn2);
	docs.appendChild(message);

	
}

function docToString(doc)
{
	return doc.docTitle + "	|	" + doc.projectCode + "	|	" + doc.groupCode + "	|	" + doc.docType + "	|	" + doc.docNumber + "	|	" + doc.docCreator + "	|	" + doc.docDate;
}

function addBtn(index, func){
	//used to create Edit and Delete buttons and assigns their functionality
	var btn = document.createElement('BUTTON');
	btn.setAttribute("type", "submit");
	btn.setAttribute('id', DocList[index].docNumber);
	btn.setAttribute('class', "btn1")
	

	if (func === "del") {
		btn.textContent = "Delete";
		btn.onclick = function(){
				DeleteDoc(this.id);
				document.getElementById("doc-holder").innerHTML = ""; 
				printdocs();
		};
	}
	else
	{
		btn.textContent = "Edit";
		var modal = document.getElementById('createModal');
		var mbtn = document.getElementsByClassName('btn');
		btn.onclick = function(){
			if (userInfo.admin) {
				modal.style.display = "block";
				mbtn[0].setAttribute('id', this.id);
			}
			else{
				alert("You do not have permission to perform this action");
			}
		};
	}

	return btn;
}


//------------------- Utils -------------------------
function SwitchAdmin() {

	//Emulates user authentication system and allows to test admin and non admin
	userInfo.admin = !userInfo.admin;
	return userInfo.admin;
}

//create sample doc
CreateDoc({
	projectCode: "ABC",
	groupCode: "G1G",
	docType: "TXT",
	docNumber: "",
	docTitle: "Test Title 1",
	uploaded: false
});

