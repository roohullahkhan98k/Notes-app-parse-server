// function User(username, LoginCount, isloggedIn) {
//   this.username = username;
//   this.LoginCount = LoginCount;
//   this.isloggedIn = isloggedIn;
//   return this;
// }

// const user1 =  User ("rooh", 0, false);
// const user2 =  User ("roohi", 0, false);
// console.log(user1);



// // understanding object and the new keyword
// function createUser(name, price){
//    this.name = name;
//    this.price = price;
// }


//  createUser.prototype.incrementPrice = function(){
//   this.price ++;
//  }
// createUser.prototype.printPrice = function(){
//     console.log(`Price of ${this.name} is ${this.price}`);
//   }

// const chai = new createUser("chai", 10);
// const tea = createUser("tea", 250);



// chai.incrementPrice();
// chai.printPrice();



//this section is to understand the prototype


// cosntructor function


// function Person(name, age) {
//     this.name = name;
//     this.age = age;
// }
// Person.prototype.greet = function() {
//     console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
// };

// const rooh = new Person("rooh", 23);
// rooh.greet(); 


//es6 class syntax

// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }

//     greet() {
//         console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
//     }
    
// }
// const rooh = new Person("rooh", 23);
// rooh.greet();




//lets understand call in call we passthe current execution context to another function


// function SetUsername(username) {
//     this.username = username;
// }

// function createUser(username, email, password) {
//     SetUsername.call(this, username); 
//     this.email = email;
//     this.password = password;
   
// }


// const user1 = new createUser("rooh", "rooh@estrat.com", "12345678");
// console.log(user1)


// cosntructor function




// function multiplyBy5(num){
//     return num * 5;
// }

// multiplyBy5.power= 5;

// console.log(multiplyBy5(10)); 
// console.log(multiplyBy5.power);

// const user1 = {
//     name: "rooh",
//     age: 23,
// }

// const user2 = {
//     name: "roohi",
//     age: 23,
// }

// //old way to set prototype
// user1.__proto__ = user2;
// //modern way to set prototype
// Object.setPrototypeOf(user2, user1);

// //also called as prototypal inheritance



// const userName = "rooh          ";

// String.prototype.trueLength = function(){
//     console.log(`${this}`);
//     console.log(`true length is: ${this.trim().length}`);
// }

// userName.trueLength();



// "rooohullah khan    ".trueLength()