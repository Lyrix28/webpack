pragma solidity ^0.4.24;

contract New {
    
    string content;
    uint32 public percent;
    uint32 public state;
    string public tag;
    uint public startTime;
    
    mapping(address => bool) invesgatores2bool;
    address[] upers;
    address[] downers;
    
    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    constructor(string c, string t, uint32 p, address sender) public {
        startTime = now;
        content = c;
        tag = t;
        percent = p;
        owner = sender;
    }
    
    function getConent() public view returns(string) {
        
        require(state == 1);
        require(startTime+1 days > now);
        
        return content;
    }
    
    event KillNew(address n);
    function kill() onlyOwner public payable {
        
        require(msg.sender == owner);
        uint amount = percent*getBalance()/100;
        address[] storage tgt;
        if (upers.length >= downers.length) {
            tgt = upers;
        } else {
            tgt = downers;
        }
        if (tgt.length > 0) amount /= tgt.length;
        
        for(uint i = 0; i < tgt.length; i ++) {
            tgt[i].transfer(amount);
        }
        state = 2;
        owner.transfer(getBalance());
        emit KillNew(this);
    }
    
    function addInvestigator(address a) public {
        
        require(state == 0);
        invesgatores2bool[a] = true;
    }
    
    function startNew() public {
        
        require(state == 0);
        state = 1;
    }
    
    event Vote(address n, int i);
    function vote(int i) external payable {
        
        require(state == 1);
        require (startTime+1 days > now);
        require(invesgatores2bool[msg.sender]);
        
        invesgatores2bool[msg.sender] = false;
        if (i > 0) upers.push(msg.sender);
        else downers.push(msg.sender);
        
        emit Vote(this, i);
    }
    
    function () payable public {}
}