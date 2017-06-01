import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
var emojiss = require('emoji-js');
//
// var Atrament = require('atrament').Atrament;

var emoji = new emojiss ();

function generateColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16)
};

class App extends Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.enterMessage = this.enterMessage.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.enterUsername = this.enterUsername.bind(this);
        this._enterMessage = this._enterMessage.bind(this);
        this._enterUsername = this._enterUsername.bind(this)
    }
    state = {
        hide: 'hello-page',
        username : '',
        usernames: [],
        current_user: '',
        message: '',
        messages:{
            user: '',
            msg: '',
        },
        socket: window.io(),
        all_messages: [],
        smile_message: []
    };
    handleInput(e) {
        this.setState({
            message: e.target.value
        })
    }
    enterMessage() {
        const currentMessage = this.state.message;
        const thisUser = this.state.current_user;
        document.querySelector('.emoji-wysiwyg-editor').innerHTML = '';
        if (currentMessage !== '') {

            this.state.socket.emit('Send message', currentMessage);
            this.setState({
                message: ''
            });
            fetch('/messages', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-type": "application/json;odata=verbose"
                },
                body: JSON.stringify({
                    user: thisUser,
                    text: currentMessage,
                })
            })
                .then(function (data) {
                    console.log('Request succeeded with JSON response');
                    document.querySelector('.emoji-wysiwyg-editor').textContent = '';
                    var event = new Event("click");
                    document.querySelector('.emoji-wysiwyg-editor').dispatchEvent(event)
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });

        }
    }
    _enterMessage(e) {
        const currentMessage = this.state.message;
        const thisUser = this.state.current_user;

        if (e.key === 'Enter') {

            console.log(currentMessage, thisUser )
            if (currentMessage !== '') {

                this.state.socket.emit('Send message', currentMessage);
                this.setState({
                    message: ''
                });
                fetch('/messages', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        "Content-type": "application/json;odata=verbose"
                    },
                    body: JSON.stringify({
                        user: thisUser,
                        text: currentMessage,
                    })
                })
                    .then(function (data) {
                        console.log('Request succeeded with JSON response');
;
                        document.querySelector('.emoji-wysiwyg-editor').textContent = '';
                        var event = new Event("click");
                        document.querySelector('.emoji-wysiwyg-editor').dispatchEvent(event)
                    })
                    .catch(function (error) {
                        console.log('Request failed', error);
                    });

            }
        }

    }
    handleUsername(e) {
        this.setState({
            username: e.target.value,
        })
    }

    enterUsername() {

        if(this.state.username !== ''){
            const currentUser = this.state.username;
            this.setState({
                current_user: currentUser,
                hide: 'hide'
            });
            this.state.socket.emit('new user', currentUser,() => {});
            fetch('/username', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-type": "application/json;odata=verbose"
                },
                mode: 'same-origin',
                redirect: 'follow',
                credentials: 'include',
                body: JSON.stringify({
                    username: currentUser,

                })
            })
                .then(function (data) {
                    console.log('Сессия отработала');
                })
                .catch(function (error) {
                    console.log('С сессией беда', error);
                });
            document.getElementById("old").scrollTop = document.getElementById("old").scrollHeight
        }

    }
    _enterUsername(e) {

        if(e.key === "Enter") {
            if(this.state.username !== ''){
                const currentUser = this.state.username;
                this.setState({
                    current_user: currentUser,
                    hide: 'hide'
                });
                this.state.socket.emit('new user', currentUser,() => {});
                fetch('/username', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        "Content-type": "application/json;odata=verbose"
                    },
                    mode: 'same-origin',
                    redirect: 'follow',
                    credentials: 'include',
                    body: JSON.stringify({
                        username: currentUser,

                    })
                })
                    .then(function (data) {
                        console.log('Сессия отработала');
                    })
                    .catch(function (error) {
                        console.log('С сессией беда', error);
                    });
                document.getElementById("old").scrollTop = document.getElementById("old").scrollHeight
            }
        }

    }
    // smile() {
    //     var input = document.getElementById("old").innerHTML;
    //     var output = emojione.unicodeToImage(input);
    //     document.getElementById("old").innerHTML = output;
    // return <div dangerouslySetInnerHTML={createMarkup()} />;
    // }
    componentDidMount() {


        const self = this;

        // var copyArray = this.state.usernames.slice();
        return(

            self.state.socket.on('get users', function (data) {

                self.setState({
                    usernames: data,
                    username: ''
                });
                document.querySelectorAll('.user').forEach(e => {
                    e.style.color = generateColor()
                });
            }),

                fetch('/messages')
                    .then(res => res.json())
                    .then(all_messages => this.setState({all_messages})),
                fetch('/username',{
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-type": "application/json;odata=verbose"
                    },
                    mode: 'same-origin',
                    redirect: 'follow',
                    credentials: 'include'})
                    .then(res => res.json())
                    .then(data => {

                        this.setState({current_user: data.username, messages:{user:data.username} });

                        if (data.username === undefined){
                            this.setState({hide: 'hello-page'})
                        }
                        else {
                            this.state.socket.emit('session users', 1,() => {});
                            // console.log('asssssssss');
                            // self.state.socket.on('getAll', function (datas) {
                            //     console.log(datas, data.username);
                            //     self.setState({
                            //         usernames: datas.push(data.username),
                            //         username: ''
                            //     });
                            // });
                            // var copyArray = this.state.usernames.slice();
                            // console.log(this.state.usernames, self.state.usernames, _data)
                            // copyArray.push(data.username);
                            this.setState({hide: 'hide'})
                        }
                    }),

                this.state.socket.on('new message', function (data) {

                    var check = function() {
                        if(data.user === undefined) {
                            return self.state.current_user
                        }
                        else return data.user
                    };
                    self.setState({
                        messages: {
                            user: check(),
                            msg:  data.msg
                        }
                    });
                    const newMsg = {
                        user: data.user,
                        text: self.state.messages.msg
                    }
                    // newMsg.innerHTML = emojione.unicodeToImage(check() + ": " + self.state.messages.msg);
                    // document.getElementById('old').appendChild(newMsg);
                    const slic = self.state.smile_message.slice();
                    slic.push(newMsg);
                    self.setState({
                        smile_message: slic
                    });
                    // var input = document.getElementById("old").innerHTML;
                    // var output = emojione.unicodeToImage(input);
                    // document.getElementById("old").innerHTML = output;
                    document.getElementById("old").scrollTop = document.getElementById("old").scrollHeight;


                }),
                setTimeout(function () {

                    // console.log('asdasd')
                    // var input = document.getElementById("old").innerHTML;
                    // var output = emojione.unicodeToImage(input);
                    // document.getElementById("old").innerHTML = output;
                    document.getElementById("old").scrollTop = document.getElementById("old").scrollHeight;
                    ReactDOM.findDOMNode(document.querySelector('.emoji-wysiwyg-editor')).addEventListener('DOMSubtreeModified', function(e){
                        // console.log(e.srcElement.data)

                        var mes = ReactDOM.findDOMNode(document.querySelector('.emoji-wysiwyg-editor')).textContent;
                        // String(mes)
                        self.setState({
                            message: ''
                        });
                        self.setState({
                            message: mes
                        })
                        console.log(mes)
                    })
                    document.querySelector('.emoji-wysiwyg-editor').addEventListener('keypress', function (e) {
                        var key = e.which || e.keyCode;
                        if (key === 13) {

                            self.enterMessage()
                        }
                    });

                    document.querySelectorAll('.user').forEach(e => {
                        e.style.color = generateColor()
                    });
                    // var sketcher = new Atrament(document.querySelector('#mySketcher'), window.innerWidth, window.innerHeight);
                }, 500)


                // document.querySelector('.user').sty
            // le.color= "#ffffff"

            // ReactDOM.findDOMNode(document.querySelector('.emojionearea-editor')).addEventListener('click', function(){console.log(222222)})

        )

    }

    render() {
        return (
            <div className="wrapper">

                <div className={this.state.hide}>
                    <div className="rawrrr">
                        <h1>RAWRRR!!!</h1>
                    </div>
                    <div className="img-wrap">
                        <img className="log-raw" src="img/name-input.svg" alt=""/>
                    </div>
                    <div className="input-aria">
                        <input type="text" value={this.state.username} onChange={this.handleUsername} onKeyPress={this._enterUsername} /> <button onClick={this.enterUsername}  >Login</button>
                    </div>

                </div>

                <div className="chat-window">

                    {/*<canvas style={{width: '100vw',*/}
                        {/*height: '100vh',*/}
                        {/*position: 'fixed',*/}
                        {/*top: 0,*/}
                        {/*left: 0,*/}
                        {/*}} id="mySketcher"  />*/}


                    <div className="rawrrr hide">
                        <h1>RAWRRR!!!</h1>
                    </div>
                    <div className="users-list">
                        {this.state.usernames.map((name, i) => <div className="user" key={i}><img src="img/user-avatar.svg" alt=""/>{name}</div>)}

                    </div>

                    <div className="chat">
                        <div id="old" className="messages-area">

                            {this.state.all_messages.map((e,i) => {
                                var rt = {__html: e.user +': '+  emoji.replace_unified(e.text)};
                                return <div className="single-msg" key={i} dangerouslySetInnerHTML ={rt}></div>
                            })
                            }
                            {
                                this.state.smile_message.map((e,i) => {
                                    var ht = {__html: e.user +': '+  emoji.replace_unified(e.text)};
                                    return <div className="single-msg" key={i} dangerouslySetInnerHTML ={ht}></div>
                            })
                            }



                        </div>

                        <div className="message-input">
                            <div className="wrap-input">
                                <input data-emojiable="true"  className="inp" type="text" value={this.state.message} onChange={this.handleInput} onKeyPress={this._enterMessage} />
                                <button onClick={this.enterMessage}  ><img src="img/enter-message.svg" alt=""/></button>
                                <img className="smile" src="img/smiles.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default App;
