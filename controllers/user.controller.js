const userModel = require(`${__dirname}/../models/user.model.js`);
const moment = require("moment");
const {object, string} = require("yup");
const { use } = require("../routes/users");

module.exports = {
    index:async (req, res)=>{
        //Đọc dữ liệu từ Database
        let msg = req.flash("msg");
        let {status, keyword} = req.query;
        console.log('status', status);
        let statusBool
        if(status === 'active' || status == 'inactive'){
            statusBool = status === 'active' ? true : false;
        }
        const users = await userModel.all(statusBool, keyword);
        res.render("users/index", {
            users, moment, status, keyword, msg
        });
    },
    add: (req, res) =>{
        res.render("users/add", {req})
    },
    handleAdd: async (req, res)=>{
        const schema = object({
            name: string().required('Tên bắt buộc phải nhập'),
            email: string().required('Email bắt buộc phải nhập')
            .email("Email không đúng định dạng")
            .test("unique", "Email đã tồn tại trên hệ thống",async (value)=>{
                return await userModel.emailUnique(value);
            })
        })
        try {
            const body = await schema.validate(req.body, {abortEarly: false});
            await userModel.create(body);
            req.flash('msg', 'Thêm người dùng thành công !!!');
            return res.redirect('/users');
        } catch (e) {
            const errors = Object.fromEntries(
                e.inner.map((item)=>[
                    item.path, item.message
                ])
            );
            req.flash("errors", errors)
            req.flash("old", req.body)
        }
        return res.redirect("/users/add")
    },
    handleId: async (req, res) =>{
        let id = req.params.id;
        let type = req.path.startsWith('/delete') ? 'delete' : req.path.startsWith('/edit') ? 'edit' : "";
        const [user] = await userModel.findId(id);
        req.flash("email", user.email)
        return res.render(`users/${type}`, {user, req: req.errors || req.old ? req : {}})
    },
    handleDelete: async (req, res)=>{
        let [email] = req.flash("email");
        let id = req.params.id;
        try{
            await userModel.removeId(id);
        }catch(Ex){
            console.log('Ex', Ex);
        }
        return res.redirect("/users?status=all")
    },
    handleEdit: async (req, res) =>{
        let [email] = req.flash("email");
        let id = req.params.id;
        const schema = object({
            name: string().required('Tên bắt buộc phải nhập'),
            email: string().required('Email bắt buộc phải nhập')
            .email("Email không đúng định dạng")
            .test("unique", "Email đã tồn tại trên hệ thống",async (value)=>{
                return await userModel.emailCheckUpdate(email, value);
            })
        })
        try {
            const body = await schema.validate(req.body, {abortEarly: false});
            await userModel.update(body, id);
            req.flash('msg', 'Thay đổi thông tin thành công !!!');
            return res.redirect('/users?status=all');
        } catch (e) {
            console.log('error', e);
            const errors = Object.fromEntries(
                e.inner.map((item)=>[
                    item.path, item.message
                ])
            );
            req.flash("errors", errors);
            req.flash("old", req.body);
        }
        return res.redirect(`/users${req.path}`);
    }
}