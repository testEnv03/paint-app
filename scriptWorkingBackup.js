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
    // data() {
    //     return {
    //         // art: [],
    //         // name: 'draw',
    //         // hamburger: false,
    //         // help: false,
    //         // dark: true,
    //         // openModal: false,
    //         // openOptions: [],
    //         // tool: 'pencil',
    //         // img: '',

    //         // stroke: '#ff0000',
    //         // text: 'Hello',
    //         // fill: '#821717',
    //         // strokeWidth: 5,
    //         // linecap: 'butt'
    //     }
    // },
    methods: {
        // asign blob address of uploaded image to img
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

function clearSession(){
    isSessionCleared = true
    // sessionStorage.removeItem('drawing-board-default-board');
}

// Onload Function - this block executes on iFrame render
window.onload = getFromRRS

        function getFromRRS (){
            var authToken = ''
            var sessionId = ''
            var lineItemId = ''
            var projectId = ''
            var routeId = ''

            window.addEventListener('message', listnerEvent, false)

            function listnerEvent(message){
                authToken = message.data.authToken
                sessionId = message.data.sessionId
                lineItemId = message.data.lineItemId
                projectId = message.data.projectId
                routeId = message.data.routeId

                console.log('message sent from parent : ' + authToken)

                let myHeaders = new Headers();
                let sendAuthorization = `Bearer ${authToken}`
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append('Authorization', sendAuthorization);

                let requestOptionsGet = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                fetch(`${rrsAPI}/getUserSessionInfo`, requestOptionsGet)
                .then(response => response.text())
                .then(result => {
                    // console.log(JSON.parse(result))
                    if(result != '{}'){
                        final_result = JSON.parse(result)
                        console.log(JSON.parse(final_result.art)[0])
            //             let key = event.target.value;
            // this.name = key.substring(4, key.length)
                        // var art = JSON.stringify(app.$data.art[0])
                        console.log('console for vue : ' + JSON.stringify(app.$data))
                        var art = JSON.stringify(app.$data.art)
                        var art1 = JSON.parse(art)
                        // Object.assign(art,grade)
                        console.log('art before setting : '+ typeof(art1) + art1 )
                        // art = JSON.parse(final_result.art)[0]
                        console.log('from vue app : ' + art)
                        app.openArtFromAPI(JSON.parse(final_result.art))
                        // app.openAPI(JSON.parse(final_result.art)[0])
                        // this.app.art = JSON.parse(final_result.art)[0];
                        // this.art = JSON.parse(final_result.art)[0];
                        // Object.assign(art1,JSON.parse(final_result.art)[0])
                        // console.log(final_result.art)
                        // app.openAPI(JSON.parse(final_result.art)[0])
                        // console.log(this.art)
                        console.log('art after setting :' + art1)
                        // console.log(final_result.valueUpdated)
                        // let confirmation = confirm('Want Updated Values or last State Values ?')
                        // if(confirmation){
                        //     getPropertyFromPath(requestOptionsGet)
                        // }
                        // else{
                        //     document.getElementById('width').value = final_result.width
                        //     document.getElementById('height').value = final_result.height

                        // }
                    }
                    else{
                        // getPropertyFromPath(requestOptionsGet)
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
        
        function sendToRRS(isSessionCleared){
            let myHeaders = new Headers();
                var sendAuthorization = `Bearer ${authToken}`
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append('Authorization', sendAuthorization);

                // this.name = Math.floor(Date.now()/1000)
                // if(this.name)
                // {
                //     localStorage.setItem(`art_${this.name}`, JSON.stringify(app.art));
                // }

               let parameters = {
                    authToken : authToken,
                    sessionId : sessionId,
                    lineItemId : lineItemId,
                    projectId : projectId,
                    routeId : routeId,
                    ClientSessionID : '',
                    ClientToken : '',
                    ClientURL : '',
                    art : JSON.stringify(app.art),
                    valueUpdated : valueUpdated
                }

                // width : document.getElementById("width").value,
                //     height : document.getElementById("height").value,


                // console.log('inside on unload')
                // console.log(typeof(isSessionCleared))
                let setData = ''
                if(isSessionCleared == true){
                    setData = JSON.stringify({});
                    console.log('Session Cleared')
                }
                else{
                    setData = JSON.stringify(parameters);
                    console.log('Session Not Cleared')
                }
            //    console.log(JSON.parse(setData))
    
                let requestOptionsPost = {
                method: 'POST',
                headers: myHeaders,
                body: setData,
                redirect: 'follow',
                keepalive: true
                };
        
                fetch(`${rrsAPI}/setUserSessionInfo`, requestOptionsPost)
                .then(response => response.text())
                .then(result => console.log(JSON.parse(result)))
                .catch(error => console.log('error', error));
        }
        // if(isSessionCleared === false){
        //     console.log(isSessionCleared)
        //     // window.onunload = sendToRRS 
        // }
        window.onunload = function(){
            // console.log('inside onunload function call')
            sendToRRS(isSessionCleared)
        } 