const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/Documents",{useNewUrlParser:true});


const documentSchema= new mongoose.Schema({
    fname:{
        type:String,
        required:[true,"Please Enter Name"]
    },
    lname:{
        type:String,
        required:[true,"Please Enter Last Name"]
    },
    dl:String,
    rc:String,
    vehicleNumber:{
        type:String,
        required:[true,"Please Enter vehicleNumber"]
    },
    uid:String
});
const userSchema=new mongoose.Schema({
    fullname:String,
    aadhar:String,
    email:String,
    password:String,
    mobile:String
});
const user=new mongoose.model("user",userSchema);
const document=new mongoose.model("document",documentSchema);



app.get('/',function(req,res){

    res.render('index.ejs',{success:""});

})
app.get('/register.ejs',function(req,res){

    res.render('register.ejs');

})
app.get('/login.ejs',function(req,res){

    res.render('login.ejs',{success:""});

})
app.get("/home.ejs",function(req,res){
    res.render("home.ejs");
})

app.get("/echallans.ejs",function(req,res){
    res.render("echallans.ejs",{success:''});
})
app.get("/echallanpayment.ejs",function(req,res){
    res.render("echallanpayment.ejs",{success:''});
})
app.get("/myvehicles.ejs",function(req,res){
    document.find(function(err,vehicles){
        if(err){
            console.log(err);
        }
        else{
            res.render("myvehicles.ejs",{success:'',data:vehicles});
        }
    })
    
})
app.get("/upload.ejs",function(req,res){
    res.render("upload.ejs",{success:''});
})
app.get("/id.ejs",function(req,res){
    document.find(function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("id.ejs",{data:result});
        }
    })
})
app.get("/contactpage.ejs",function(req,res){
    res.render("contactpage.ejs",{success:''});
})
app.get("/trafficPolice.ejs",function(req,res){
    res.render("trafficPolice.ejs",{vehicleNumber:"",dlNumber:"",rcNumber:""})
})
app.get("/rto.ejs",function(req,res){
    document.find(function(err,vehicles){
        if(err){
            console.log(err);
        }
        else{
            res.render("rto.ejs",{data:vehicles});
        }
    })
})
app.post("/rto.ejs",function(req,res){
    document.updateOne({_id:req.body.nid},{uid:req.body.uid},function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/rto.ejs");
        }
    })
})
app.post("/trafficPolice.ejs",function(req,res){
    document.findOne({uid:req.body.id},function(err,vehicles){
        if(err){
            console.log(err);
        }
        else{
            console.log(vehicles);
            res.render("trafficPolice.ejs",{vehicleNumber:vehicles.vehicleNumber,dlNumber:vehicles.dl,rcNumber:vehicles.rc});
        }
    })
})
app.post("/register",function(req,res){
    const newUser=new user({
        fullname:req.body.fullname,
        aadhar:req.body.aadhar,
        email:req.body.email,
        password:req.body.password,
        mobile:req.body.mobile,
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("login.ejs");
        }
    })
})
app.post("/login",function(req,res){
    const aadh=req.body.aadhar;
    const password=req.body.password;
    if(aadh==="admin"){
        if(password=="123456789"){
            res.redirect("rto.ejs")
        }
    }
    if(aadh==="adminTP"){
        if(password=="1234567890"){
            res.redirect("trafficPolice.ejs")
        }
    }
    user.findOne({aadhar:aadh},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("home.ejs");
                }
            }
            else{
                res.render("login.ejs")
            }
        }
    })
})

app.post("/upload.ejs",function(req,res){
    const newDocument=new document({
        fname:req.body.fname,
        lname:req.body.lname,
        dl:req.body.dl,
        rc:req.body.rc,
        vehicleNumber:req.body.vehicleNumber,
        uid:"-1"
    });
    newDocument.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("upload.ejs",{success:"Successfully Updated document!"});
        }
    });
})



app.listen(3000,function(){
    console.log("Server Started");
});