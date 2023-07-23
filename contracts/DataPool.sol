// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "hardhat/console.sol";

contract DataPool {

  	address[] public users; //stores all the users that are available 
    mapping (address => Record[]) data;

    struct Record {
        string encrypted_data;
        string clear_text_data;
		bool isCancer;
    }


	event Reward(address indexed patient,address indexed purchased_by, string cid, uint256 amount);
	event Access(address indexed patient,address indexed purchased_by, string cid);
	event Upload(address indexed patient, Record data);
	event InvokeTraining(address indexed purchased_by, Record[] allData);

	function addData(string memory _clearData, string memory _encryptedData, bool _isCancer) public {
        Record memory new_data = Record({
            encrypted_data: _encryptedData,
            clear_text_data: _clearData,
			isCancer:_isCancer
        });
		
        data[msg.sender].push(new_data);

		if(!isUserExist(msg.sender)) {
            users.push(msg.sender);
        }

		emit Upload(msg.sender, new_data );
    }

	function getData(address user_address) public view returns(Record[] memory){
		return data[user_address];
	}

	function getUsers() public view returns(address[] memory){
		return users;
	}

	function trainModel() public {
		uint256 cost = 100*10**18;
		//get all data
		//invoke training job
		//returns CID to model
		//pays all users

		uint256 amntToEach = cost / users.length;

		Record[] memory allData = new Record[](0); // Declare the array in memory.

		for(uint i = 0; i < users.length; i++) {
			Record[] memory userRecords = getData(users[i]);
			for(uint m = 0; m < userRecords.length; m++) {
				// Need to expand memory array before pushing to it.
				Record[] memory tempData = new Record[](allData.length + 1);
				for(uint n = 0; n < allData.length; n++) {
					tempData[n] = allData[n];
				}
				tempData[allData.length] = userRecords[m];
				allData = tempData;
				
				emit Access(users[i], msg.sender, userRecords[m].clear_text_data);
				emit Reward(users[i], msg.sender, userRecords[m].clear_text_data, amntToEach);
			}
		}

		emit InvokeTraining(msg.sender, allData);
	}


	function isUserExist(address user) private view returns(bool) {
			for(uint i = 0; i < users.length; i++) {
				if(users[i] == user) {
					return true;
				}
			}
			return false;
		}
}