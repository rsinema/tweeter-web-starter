// import { FollowDaoFillTable } from "./FollowDaoFillTable";
import { DynamoUserDAOFillTable } from "./dynamo/DynamoUserDAOFillTable";
import { DynamoFollowDAOFillTable } from "./dynamo/DynamoFollowDAOFillTable";
import { User } from "tweeter-shared";

// Make sure to increase the write capacities for the follow table, follow index, and user table.

let mainUsername = "@riley";
let followername = "@user_";
let imageUrl =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "hello";
let lastName = "world";
let numUsers = 10000;
let batchSize = 25;
let aliasList: string[] = Array.from(
  { length: numUsers },
  (_, i) => followername + (i + 1)
);

const userDaoFillTable = new DynamoUserDAOFillTable();
const followDaoFillTable = new DynamoFollowDAOFillTable();

console.log("setting followers");
setFollowers(0);
console.log("setting users");
setUsers(0);
userDaoFillTable.increaseFollowersCount(mainUsername, numUsers);

function setFollowers(i: number) {
  if (i >= numUsers) return;
  else if (i % 1000 == 0) {
    console.log(i + " followers");
  }
  let followList = aliasList.slice(i, i + batchSize);
  followDaoFillTable
    .createFollows(mainUsername, followList)
    .then(() => setFollowers(i + batchSize))
    .catch((err) => console.log("error while setting followers: " + err));
}
function setUsers(i: number) {
  if (i >= numUsers) return;
  else if (i % 1000 == 0) {
    console.log(i + " users");
  }
  let userList = createUserList(i);
  userDaoFillTable
    .createUsers(userList)
    .then(() => setUsers(i + batchSize))
    .catch((err) => console.log("error while setting users: " + err));
}

function createUserList(i: number) {
  let users: User[] = [];
  let limit = i + batchSize;
  for (let j = i; j < limit; ++j) {
    let user = new User(
      firstName + j,
      lastName + j,
      followername + j,
      imageUrl
    );
    users.push(user);
  }
  return users;
}
