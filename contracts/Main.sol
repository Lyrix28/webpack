pragma solidity ^0.4.24;

import "./Tag.sol";
import "./New.sol";

contract Main {
    
    string[] public tags;
    mapping(string => Tag) name2Tag;
    mapping(address => New[]) public address2News;
    
    function addNew(string c, string t) external payable {
        New n = new New(c, t, 50, msg.sender);
        address(n).transfer(msg.value);
        if (uint(name2Tag[t]) == 0) {
            
            Tag tag = new Tag(msg.sender);
            tags.push(t);
            name2Tag[t] = tag;
            tag.addNew(n);
        } else {
            name2Tag[t].addNew(n);
        }
        address2News[msg.sender].push(n);
    }
    
    function getTag(string name) view external returns(address) {
        return name2Tag[name];
    }
    
}