import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';



@Injectable()
export class Database {

theConsole: string = "Console Messages";


options: any = {
    name: 'AssetTrackerdata.db',
    location: 'default',
    createFromLocation: 1
}

private db: SQLiteObject;
private databaseReady : BehaviorSubject<boolean>;
users: any = [];
userCount = 0;

constructor(private sqlite: SQLite, private platform: Platform, private storage: Storage) {
    
    this.databaseReady= new BehaviorSubject(false);
    this.connectToDb();
    this.createPartList();
    console.log('from constructor in database');
}

getDatabaseState(){
    return this.databaseReady.asObservable();
}

private connectToDb():void {
   this.platform.ready().then(()=>{
    this.sqlite.create(this.options)
        .then((db: SQLiteObject) => {

            this.db = db;
            this.databaseReady.next(true);
            var sql = 'create table IF NOT EXISTS user (userid INTEGER PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255))';
            //IF you move the below statment out of here then the db variable will not be initialized
            //before you can use it to execute the SQL. 
            this.db.executeSql(sql, [])
            .then(() => this.theConsole += 'Executed SQL' + sql)
            .catch(e => this.theConsole += "Error: " + JSON.stringify(e));
            console.log(this.theConsole);


        })
        .catch(e => this.theConsole += JSON.stringify(e));
    })
}


createPartList(){
    this.platform.ready().then(()=>{
        this.sqlite.create(this.options)
            .then((db: SQLiteObject) => {
    
                this.db = db;
                this.databaseReady.next(true);
                var sql = 'create table IF NOT EXISTS part (partid INTEGER PRIMARY KEY, partname VARCHAR(255), partdesc VARCHAR(255), datetime VARCHAR(255))';
                //IF you move the below statment out of here then the db variable will not be initialized
                //before you can use it to execute the SQL. 
                this.db.executeSql(sql, [])
                .then(() => this.theConsole += 'Executed SQL' + sql)
                .catch(e => this.theConsole += "Error: " + JSON.stringify(e));
                console.log(this.theConsole);
    
    
            })
            .catch(e => this.theConsole += JSON.stringify(e));
        })

}

addPart(accountInfo:any):void {
   
    var sql = "INSERT INTO part (partid, partname ,partdesc) VALUES ('"+accountInfo.username+"','"+accountInfo.email+"', "+ accountInfo.password+"')";
   
    this.db.executeSql(sql,[])
    .then(() => this.theConsole += "\n" + 'Executed SQL' + sql)
    .catch(e => this.theConsole += "Error: " + JSON.stringify(e));

     
}

addUser(accountInfo:any):void {
   
    var sql = "INSERT INTO user (username, email ,password) VALUES ('"+accountInfo.username+"','"+accountInfo.email+"', "+ accountInfo.password+"')";
   
    this.db.executeSql(sql,[])
    .then(() => this.theConsole += "\n" + 'Executed SQL' + sql)
    .catch(e => this.theConsole += "Error: " + JSON.stringify(e));

     
}




loginUser (accountInfo:any) {

    this.connectToDb();
    var sql = "SELECT COUNT(*) AS USERCOUNT FROM USER WHERE USERNAME = '"+accountInfo.username+"' AND PASSWORD = '"+accountInfo.password+"'";
    
    this.db.executeSql(sql,[])
        .then((result) => {
        if(result.rows.length > 0){
            this.userCount = parseInt(result.rows.item(0).USERCOUNT);
        }
        this.theConsole += "\n" + 'Executed SQL' + sql})
        .catch(e => this.theConsole += "Error: " + JSON.stringify(e));

    return this.userCount; 
}
    

getAllUsers() {

    var sql = "SELECT * FROM user";
    
    this.db.executeSql(sql, [])
        .then((result) => {

            this.users = [];
            
            this.theConsole += JSON.stringify(result);
            if (result.rows.length > 0) {
                for(var i=0; i<result.rows.length; i++) {
                    this.users.push({rowid:result.rows.item(i).userid,username:result.rows.item(i).username,email:result.rows.item(i).email})
                }
                this.theConsole += 'Result' + result.rows.item(0);
            }
            this.theConsole += "\n" + result.rows.item(0).username+ result.rows.item(0).password;
            this.theConsole +=  "\n" +'Rows' + result.rows.length;
            console.log(this.theConsole);
        })

       .catch(e => this.theConsole += JSON.stringify(e));

       return this.users;
}

getConsoleMessages() {
    return this.theConsole;
}

}