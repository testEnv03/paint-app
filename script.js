let myData = {
    art: [],
    name: 'draw',
    hamburger: false,
    help: false,
    dark: true,
    openModal: false,
    openOptions: [],
    tool: 'pencil',
    img: '',
    stroke: '#ff0000',
    text: 'Hello',
    fill: '#821717',
    strokeWidth: 5,
    linecap: 'butt'
}
const app = new Vue({
    el: '#app',
    data : myData,
    methods: {
        // assign blob address of uploaded image to img
        onFileChange(event) {
            const file = event.target.files[0];
            this.img = URL.createObjectURL(file);
        },
        // change tool
        selectTool(tool, event){
            this.tool = tool;
        },
        // function runs on drag
        move(event){
            switch(this.tool)
            {
                case 'line': this.drawLine(event); break;
                case 'circle': this.drawCircle(event); break;
                case 'rect': this.drawRect(event); break;
                case 'pencil': this.drawPencil(event); break;
                case 'eraser': this.drawEraser(event); break;
                case 'text': this.drawText(event); break;
                case 'img': this.drawImg(event); break;
            }
        },
        // functions runs on click on svg to insert a new SVG child object
        start(event){
            switch(this.tool)
            {
                case 'line': this.startLine(event); break;
                case 'circle': this.startCircle(event); break;
                case 'rect': this.startRect(event); break;
                case 'pencil': this.startPencil(event); break;
                case 'eraser': this.startEraser(event); break;
                case 'text': this.startText(event); break;
                case 'img': this.startImg(event); break;
            }
        },
        // starts line both starting and ending point are initially are co-ordinates of cursor
        startLine(event){
            this.art.push({
                tool: 'line',
                x1: event.clientX, y1: event.clientY,
                x2: event.clientX, y2: event.clientY,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth != 0 ? this.strokeWidth : 1,      // line should at least have 1 stroke width
                linecap: this.linecap,
                rotate: 0
            });
        },
        // starts rectangle x and y point are initially are co-ordinates of cursor height and width is also 0
        startRect(event){
            this.art.push({
                tool: 'rect',
                x: event.clientX, y: event.clientY,
                width: 0, height: 0,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0,
                rotate: 0
            });
        },
        // starts Circle x and y point are initially are co-ordinates of cursor radius is zero
        startCircle(event){
            this.art.push({
                tool: 'circle',
                x: event.clientX, y: event.clientY,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0
            });
        },
        // start polyline for pencil with first node of cursor position
        startPencil(event){
            this.art.push({
                tool: 'polyline',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.stroke
            });
        },
        // start polyline for eraser with first node of cursor position
        startEraser(event){
            this.art.push({
                tool: 'eraser',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1
            });
        },
        // start Text
        startText(event){
            this.art.push({
                tool: 'text',
                x: event.clientX, y: event.clientY,
                text: this.text,
                size: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.stroke,
                rotate: 0
            });
        },
        // start image
        startImg(event){
            this.art.push({
                tool: 'img',
                img: this.img,
                width: 0,
                x: event.clientX, y: event.clientY,
                rotate: 0
            });
        },
        // update endpoint of line
        drawLine(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.x2 = event.clientX;
                lastLine.y2 = event.clientY;
            }
        },
        // update radius of circle
        drawCircle(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastCircle = this.art[this.art.length - 1];
                
                // pythagoras theorem
                let a = Math.abs(lastCircle.x - event.clientX);
                let b = Math.abs(lastCircle.y - event.clientY);
                lastCircle.radius = Math.sqrt((a * a) + (b * b));
            }
        },
        // update height and width of the rectangle
        drawRect(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastRect = this.art[this.art.length - 1];
                if(event.clientX - lastRect.x > 0 && event.clientY - lastRect.y > 0)
                {
                    lastRect.width = event.clientX - lastRect.x;
                    lastRect.height = event.clientY - lastRect.y;
                }
            }
        },
        // update width of the image
        drawImg(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastImg = this.art[this.art.length - 1];
                if(event.clientX - lastImg.x > 0 && event.clientY - lastImg.y > 0)
                {
                    lastImg.width = event.clientX - lastImg.x;
                }
            }
        },
        // push x,y co-ordinates of current cursor position of the pencil
        drawPencil(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },
        // push x,y co-ordinates of current cursor position of the eraser
        drawEraser(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },
        // update x,y co-ordinates of Text
        drawText(event){
            if(event.buttons == 1 || event.buttons == 3){
                let text = this.art[this.art.length - 1];
                text.x = event.clientX;
                text.y = event.clientY;
            }
        },
        // saves the art object to localStorage
        saveArt(){
            this.name = prompt('Enter File Name', this.name);
            if(this.name)
            {
                localStorage.setItem(`art_${this.name}`, JSON.stringify(app.art));
            }
        },
        
        // retrieve data from localstorage and assign to art array objects
        openArt(event){
            let key = event.target.value;
            this.name = key.substring(4, key.length)
            this.art = JSON.parse(localStorage.getItem(key));      
        },
        openArtFromAPI(artData){
            this.art = artData;      
        },
        
        // erase all the data of from artboard
        trash(){
            if(confirm("Are you sure?")){
                this.art = [];
            }
        },
        // lister for keydown events
        keydown(event){
            if(this.art.length > 0){
                let last = this.art[this.art.length - 1];
                switch(this.tool){
                    case 'rect':
                        event.key == 'ArrowDown' && last.radius > 0 ? last.radius -= 2 : '';
                        event.key == 'ArrowUp' ? last.radius += 2 : '';
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'img':
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'text':
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'circle':
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                }
            }
            event.key == 'z' && event.ctrlKey ? this.art.pop() : "";
            if(event.key == 's' && event.ctrlKey){
                event.preventDefault(); 
                this.saveArt();
            }
        }
    },
}).$mount('#app');


document.addEventListener("keydown", app.keydown);

var rrsAPI = 'http://localhost:5007/api/v1/Runtime'
var valueUpdated = false
var isSessionCleared = false
let isDataSaved = false
let savedArt = ''

function clearSession(){
    isSessionCleared = true
}

function saveData(){
    isDataSaved = true
    savedArt = JSON.stringify(app.art)
}

// Onload Function - this block executes on iFrame render
window.onload = getFromRRS

        function getFromRRS (){
            var authToken = ''
            var sessionId = ''
            var lineItemId = ''
            var projectId = ''
            var routeId = ''

            window.addEventListener('message', listenerEvent, false)

            function listenerEvent(message){
                authToken = message.data.authToken
                sessionId = message.data.sessionId
                lineItemId = message.data.lineItemId
                projectId = message.data.projectId
                routeId = message.data.routeId

                // console.log('message sent from parent : ' + authToken)

                let myHeaders = new Headers();
                let sendAuthorization = `Bearer ${authToken}`
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append('Authorization', sendAuthorization);

                let requestOptionsGet = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                fetch(`${rrsAPI}/getFrameInfo`, requestOptionsGet)
                .then(response => response.text())
                .then(result => {
                    // console.log(JSON.parse(result))
                    if(result != '{}'){
                        final_result = JSON.parse(result)
                        // console.log(final_result.isDataSaved)
                        if(final_result.savedArt != ''){
                            savedArt = final_result.savedArt
                        }
                        // console.log('inside console to check saved art : ' + final_result.savedArt)
                        if(final_result.isDataSaved == 'true'){
                            // console.log('inside true condition of isDataSaved')
                            isDataSaved = true
                            if(JSON.stringify(final_result.art) === JSON.stringify(final_result.savedArt)){
                                app.openArtFromAPI(JSON.parse(final_result.art))
                            }
                            else{
                                let confirmation = confirm('Click Ok for recent unsaved art and cancel for last saved art.')
                                if(confirmation){
                                    app.openArtFromAPI(JSON.parse(final_result.art))
                                }
                                else{
                                    app.openArtFromAPI(JSON.parse(final_result.savedArt))

                                }
                            }
                        }
                        else{
                            app.openArtFromAPI(JSON.parse(final_result.art))
                        }

                    }
                    else{
                        console.log('1st Initialization')
                    }
                })
                .catch(error => console.log('error', error));

                }

            
        }

// Onunload Function - this function executes while page is unloading iFrame
window.addEventListener('message', listenerEvent, false)
        function listenerEvent(message){
            authToken = message.data.authToken
            sessionId = message.data.sessionId
            lineItemId = message.data.lineItemId
            projectId = message.data.projectId
            routeId = message.data.routeId
        }
        
        function sendToRRS(isSessionCleared, isDataSaved){
            let myHeaders = new Headers();
                var sendAuthorization = `Bearer ${authToken}`
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append('Authorization', sendAuthorization);

               let parameters = {
                    authToken : authToken,
                    sessionId : sessionId,
                    lineItemId : lineItemId,
                    projectId : projectId,
                    routeId : routeId,
                    ClientSessionID : '',
                    ClientToken : '',
                    ClientURL : '',
                    isDataSaved : isDataSaved,
                    savedArt : savedArt,
                    art : JSON.stringify(app.art),
                    valueUpdated : valueUpdated
                }

                let setData = ''
                if(isSessionCleared == true){
                    setData = JSON.stringify({});
                    console.log('Session Cleared')
                }
                else{
                    setData = JSON.stringify(parameters);
                    console.log('Session Not Cleared')
                }
    
                let requestOptionsPost = {
                    method: 'POST',
                    headers: myHeaders,
                    body: setData,
                    redirect: 'follow',
                    keepalive: true     //to keep the post method running even though page is not available
                };
        
                fetch(`${rrsAPI}/setFrameInfo`, requestOptionsPost)
                .then(response => response.text())
                // .then(result => console.log(JSON.parse(result)))
                .catch(error => console.log('error', error));
        }
        window.onunload = function(){
            sendToRRS(isSessionCleared,isDataSaved)
        } 