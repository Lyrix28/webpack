pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./New.sol";

contract Tag is Ownable {
    New[] public news;

    address[] private investigators;

    constructor(address a) public {
        investigators.push(a);
    }
    
    event AddNew(address n);
    function addNew(New n) public onlyOwner {
        news.push(n);
        for (uint i = 0; i < investigators.length; i ++) {
            n.addInvestigator(investigators[i]);
        }
        n.startNew();
        emit AddNew(n);
    }
    
    event InvestigatorChange(uint c);
    function addInvestigator() public {
        bool flag = true;
        for (uint i = 0; i < investigators.length; i ++) {
            if (msg.sender == investigators[i]) {
                flag = false;
                break;
            }
        }
        
        if (flag) {
            investigators.push(msg.sender);
            emit InvestigatorChange(investigators.length);
        }
        
    }
    
    function removeInvestigator() public {
        uint len = investigators.length;
        for (uint i = 0; i < len; i ++) {
            if (msg.sender == investigators[i]) {
                investigators[i] = investigators[len-1];
                delete investigators[len-1];
                investigators.length --;
        
                emit InvestigatorChange(investigators.length);
                break;
            }
        }
        
    }
    
    function getInvsCount() view external returns(uint) {
        return investigators.length;
    }
}