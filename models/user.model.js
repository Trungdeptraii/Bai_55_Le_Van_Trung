const sql = require(`${__dirname}/../utils/db.js`);

module.exports = {
    all: (status, keyword)=>{
        let filter = sql `where name is not null`;
        if(status != undefined){
            filter = sql`${filter} and status = ${status}`;
        }
        if(keyword?.length){
            filter = sql`${filter} and (lower(name like ${'%'+ keyword +'%'}) or lower(email like ${'%'+ keyword +'%'}))`;
        }
        return sql `select * from users ${filter} order by created_at desc`
    },
    emailUnique: async (email)=>{
        const result = await sql `select * from users where ${email} = users.email`
        return result.length ? false : true;
    },
    create: async (users)=>{
        let {name, email, status} = users;
        let strInsert = sql `users (name, email, status) 
        values (${name}, ${email}, ${status == 0 ? false : true})`
        return sql `insert into ${strInsert}`
    },
    findId: (id) =>{
        return sql `select * from users where id = ${id}`
    },
    removeId: (id)=>{
        return sql `delete from users where id = ${id}`;
    },
    emailCheckUpdate: async(emailId, emailUpdate)=>{
        let emailAll = await sql `select users.email from users where not email = ${emailId} and email = ${emailUpdate}`;
        return emailAll.length ? false : true;
    },
    update: (data, id)=>{
        objKey = Object.keys(data);
        objValue = Object.values(data);
        return sql`update users set name=${objValue[0]}, email=${objValue[1]}, status=${objValue[2] == "1" ? true : false} where id = ${id}`
    }
}