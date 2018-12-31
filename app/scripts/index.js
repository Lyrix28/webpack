// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import mainArtifact from '../../build/contracts/Main.json'
import tagArtifact from '../../build/contracts/Tag.json'
import newArtifact from '../../build/contracts/New.json'

var tagaddress = ''

// 合约地址
var address = '0xCC0c847df523d4303Ba2c9ab5d6e6183ABAAACB5'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const Main = contract(mainArtifact)
const Tag = contract(tagArtifact)
const New = contract(newArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    Main.setProvider(web3.currentProvider)
    Tag.setProvider(web3.currentProvider)
    New.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

    })

    self.pullTags(0)
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  addNews: function () {
    const self = this

    var tag = prompt("请输入Tag", "")
    if (tag) {
      var content = prompt("请输入Content", "")
      if (content) {
        self.pushUp(content,tag)
      }
    }
  },

  pushUp: function(content,tag) {
    const self = this

    this.setStatus('Pushing News... (please wait)')

    let meta
    Main.at(address).then(function (instance) {
      meta = instance
      return meta.addNew(content,tag,{from:account})
    }).then(function () {
      self.setStatus('News pushed!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error pushing news; see log.')
    })
  },

  getYourNews: function() {
  	const self = this
  	self.pullYourNews(0)

  	var tags = document.getElementById("tags")
    var news = document.getElementById("news")
    var nneeww = document.getElementById("new")
    var yournews = document.getElementById("yournews")
    var getyournews = document.getElementById("getyournews")
    
    tags.hidden = true
    news.hidden = true
    nneeww.hidden = true
    yournews.hidden = false
    getyournews.hidden = true
  },

  pullYourNews: function(count) {
  	const self = this

  	this.setStatus('Pulling Your News... (please wait)')

    let meta
      Main.at(address).then(function (instance) {
        meta = instance
        return meta.address2News(account,count)
      }).then(function (result) {
      	if (result) {
      	  self.getNewInfo(result,0)
          self.pullYourNews(++count)
          self.setStatus(count+' Your News pulled!')
      	}
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error pulling your news; see log.')
      })
  },

  getNewInfo: function(newaddress,flag) {

    const self = this

    let meta
    let tag,state,content,startTime,percent,owner,balance
    New.at(newaddress).then(function (instance) {
      meta = instance
      if (flag == 0) {
      	return meta.tag()
      } else {
      	return meta.owner()
      }
    }).then(function (result) {
    	if (flag == 0) {
    		tag = result
    	} else {
    		owner = result
    	}
      return meta.startTime()
    }).then(function (result) {
      startTime = result
      return meta.percent()
    }).then(function (result) {
      percent = result
      return meta.state()
    }).then(function (result) {
      state = result
      if (result == 1) {
        return meta.getConent()
      } else {
      	return "Over!"
      }
    }).then(function (result) {
      content = result

      web3.eth.getBalance(newaddress, function (err, result) {
	      if (err != null) {
	        alert('There was an error fetching your accounts.')
	        return
	      }

	      balance = result

	      if (flag == 0) {
	      	self.addYourNewDiv(newaddress,tag,startTime,balance,content)
	      } else {
	      	self.addNewDiv(newaddress,owner,startTime,balance,content)
	      }

	    })
      
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error pulling your news; see log.')
    })

  },


	timetrans: function(date){
	    var date = new Date(date*1000);//如果date为13位不需要乘1000
	    var Y = date.getFullYear() + '-';
	    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes());
	    return Y+M+D+h+m;
	 },

  addYourNewDiv: function(newaddress,tag,startTime,balance,content) {

    var wrapper = document.getElementById("wrapper3")

    var tagdiv = document.createElement("div")
    tagdiv.innerText = tag
    tagdiv.className = 'divborder'
    wrapper.appendChild(tagdiv)

    var startTimediv = document.createElement("div")
    startTimediv.innerText = this.timetrans(startTime)
    startTimediv.className = 'divborder'
    wrapper.appendChild(startTimediv)

    var balancediv = document.createElement("div")
    balancediv.innerText = web3.fromWei(balance,'ether')
    balancediv.className = 'divborder'
    wrapper.appendChild(balancediv)

    var contentdiv = document.createElement("div")
    if (content.length > 10) {
    	contentdiv.innerText = content.slice(0,10)+" ..."
    }
    else {
    	contentdiv.innerText = content
    }

    contentdiv.className = 'divborder'
    if (content != "Over!") {
    	contentdiv.id = "divhover"
    	contentdiv.setAttribute('address',newaddress)
    	contentdiv.setAttribute('content',content)
    	contentdiv.setAttribute("onclick","App.yourNewClick(this)")
    }
    wrapper.appendChild(contentdiv)

  },

  yourNewClick: function(div) {
    
    var news = document.getElementById("yournews")
    var nneeww = document.getElementById("yournew")
    nneeww.setAttribute('address',div.attributes['address'].nodeValue)

    var contentDiv = nneeww.children[0]
    contentDiv.innerText = div.attributes['content'].nodeValue
    news.hidden = true
    nneeww.hidden = false
  },

  killNew: function(div) {
  	var newdiv = div.parentNode

    const self = this

    this.setStatus('Killing News... (please wait)')

    let meta
    New.at(newdiv.attributes['address'].nodeValue).then(function (instance) {
      meta = instance
      return meta.kill({from:account})
    }).then(function (result) {
      self.setStatus('Killed News')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error killing news; see log.')
    })
  },

  transfer: function(div) {

  	var amount = prompt("请输入金额(ether)", "0")
  	if (amount <= 0) return

  	var newdiv = div.parentNode

    const self = this

    this.setStatus('Transfering ... (please wait)')
  	var message = {from: account, to:newdiv.attributes['address'].nodeValue, value: web3.toWei(amount, 'ether')}

  	web3.eth.sendTransaction(message, (err, res) => {
        var output = "";
        if (!err) {
            this.setStatus('Transfered')
        } else {
            self.setStatus('Error Transfering; see log.')
        }
    })
  },

  pullTags: function(count) {
    const self = this

    this.setStatus('Pulling Tags... (please wait)')

    let meta
      Main.at(address).then(function (instance) {
        meta = instance
        return meta.tags(count)
      }).then(function (result) {
        if (result) {
          self.addTagDiv(result)
          self.pullTags(++count)
          self.setStatus(count+' Tags pulled!')
        }
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error pulling tags; see log.')
      })

  },

  addTagDiv: function(tag) {
    var wrapper = document.getElementById("tagswrapper")
    var div = document.createElement("div")
    div.innerText = tag
    div.className = 'divborder'
    div.id = "divhover"
    div.setAttribute("onclick","App.tagClick(this)")
    wrapper.appendChild(div)
  },

  registerTag: function() {
  	const self = this

    this.setStatus('Registering in... (please wait)')

    let meta
    Tag.at(tagaddress).then(function (instance) {
      meta = instance
      return meta.addInvestigator({from:account})
    }).then(function () {
      self.setStatus('Registered')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error Registering; see log.')
    })
  },

  unregisterTag: function() {
  	const self = this

    this.setStatus('Unregistering in... (please wait)')

    let meta
    Tag.at(tagaddress).then(function (instance) {
      meta = instance
      return meta.removeInvestigator({from:account})
    }).then(function () {
      self.setStatus('Unregistered')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error Unregistering; see log.')
    })
  },

  tagClick: function(div) {
    const self = this

    this.setStatus('Pulling News in '+div.innerText+'... (please wait)')

    let meta
    Main.at(address).then(function (instance) {
      meta = instance
      return meta.getTag(div.innerText)
    }).then(function (result) {
      tagaddress = result
      self.pullNews(0)
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error pulling news; see log.')
    })

    var tags = document.getElementById("tags")
    var news = document.getElementById("news")
    news.children[0].innerText = "News in "+div.innerText
    tags.hidden = true
    news.hidden = false
  },

  pullNews: function(count) {
    const self = this

    let meta
      Tag.at(tagaddress).then(function (instance) {
        meta = instance
        return meta.news(count)
      }).then(function (result) {
        if (result) {
          self.getNewInfo(result)
          self.pullNews(++count)
          self.setStatus(count+' News pulled!')
        }
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error pulling tags; see log.')
      })
    
  },

  addNewDiv: function(newaddress,owner,startTime,balance,content) {

    var wrapper = document.getElementById("wrapper2")

    var ownerdiv = document.createElement("div")
    ownerdiv.innerText = owner.slice(0,5)+' ... '+owner.slice(40)
    ownerdiv.className = 'divborder'
    wrapper.appendChild(ownerdiv)

    var startTimediv = document.createElement("div")
    startTimediv.innerText = this.timetrans(startTime)
    startTimediv.className = 'divborder'
    wrapper.appendChild(startTimediv)

    var balancediv = document.createElement("div")
    balancediv.innerText = web3.fromWei(balance,'ether')
    balancediv.className = 'divborder'
    wrapper.appendChild(balancediv)

    var contentdiv = document.createElement("div")
    if (content.length > 10) {
    	contentdiv.innerText = content.slice(0,10)+" ..."
    }
    else {
    	contentdiv.innerText = content
    }
    
    contentdiv.className = 'divborder'
    if (content != "Over!") {
    	contentdiv.id = "divhover"
    	contentdiv.setAttribute('address',newaddress)
    	contentdiv.setAttribute('content',content)
    	contentdiv.setAttribute("onclick","App.newClick(this)")
    }
    wrapper.appendChild(contentdiv)

  },

  newClick: function(div) {
    
    var news = document.getElementById("news")
    var nneeww = document.getElementById("new")
    nneeww.setAttribute('address',div.attributes['address'].nodeValue)

    var contentDiv = nneeww.children[0]
    contentDiv.innerText = div.attributes['content'].nodeValue
    news.hidden = true
    nneeww.hidden = false
  },

  voteNew: function(div,votenum) {
  	var newdiv = div.parentNode

    const self = this

    this.setStatus('Voting News... (please wait)')

    let meta
    New.at(newdiv.attributes['address'].nodeValue).then(function (instance) {
      meta = instance
      return meta.vote(votenum,{from:account})
    }).then(function (result) {
      this.setStatus('Voted News')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error voting news; see log.')
    })

  },
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
