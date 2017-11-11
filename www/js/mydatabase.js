//VARIABLES NEEDED

var adminurl = "my url";


var db = openDatabase('hniretailer', '1.0', 'hnireyailer DB', 50 * 1024 * 1024);
db.transaction(function (tx) {  
    tx.executeSql('CREATE TABLE IF NOT EXISTS  `retailers`(id unsigned primary auto_increment, name varchar , email varchar unique,password varchar, gstin varchar , pan varchar, shopname varchar , contact varchar ,status tinyint, remember_token varchar, created_at timestamp, updated_at timestamp)');
    
 });
 db.transaction(function (tx) {  
    tx.executeSql('CREATE TABLE IF NOT EXISTS  `products`(id unsigned primary auto_increment, name varchar , image varchar ,volume double(8,2), price double(10,5) , description varchar, featured tinyint , created_at timestamp, updated_at timestamp)');
    
 });
 
var mydatabase = angular.module('mydatabase', [])
    .factory('MyDatabase', function ($http, $location, MyServices) {



        return {
           
        }
    });




