var express= require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
//express sanitizer is used to get the pure html i.e it can remove javascript from text

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
//express sanitizer is used after body parser
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/Blogs",{useNewUrlParse:true});
var BlogSchema = mongoose.Schema({
	title:String,
	body:String,
	image:String,
	created:{type:Date ,default:Date.now}
})

var blogs = mongoose.model("blogs",BlogSchema);

/*blogs.create({
	title:"test Blogs",
	body:"This is a test blog",
	image:""
});
*/

app.get("/",function(req,res){
	res.redirect("/Blogs");
})

app.get("/Blogs",function(req,res){
	blogs.find({},function(err,blog){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blog:blog});
		}
	})
	
});

app.post("/Blogs",function(req,res){
	console.log(req.body.Blog);
	var t=req.body.Blog.title;
	var i=req.body.Blog.image;
	var b =req.sanitize(req.body.Blog.body);
	//var b =req.body.Blog.body;
	var newBlog={title:t,body:b,image:i};

	blogs.create(newBlog,function(err,BLOG){
		if(err){
			res.render("new");
		}else{
			console.log(BLOG);
			res.redirect("/Blogs");
		}
	});
	
});


app.get("/Blogs/new",function(req,res){
	res.render("new");
});


app.get("/Blogs/:id",function(req,res){
	blogs.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.render('/Blogs');
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
	
})

app.get("/Blogs/:id/edit",function(req,res){
	blogs.findById(req.params.id,function(err,FoundBlog){
		if(err){
			res.render("/Blogs");
		}else{
			res.render("edit",{blog:FoundBlog});
		}
	})
	
})

app.put("/Blogs/:id",function(req,res){
	//res.send("UPDATE BLOG");
	blogs.findByIdAndUpdate(req.params.id,req.body.Blog,function(err,UpdatedBlog){
		if(err){
			res.redirect("/Blogs");
		}else{
			res.redirect("/Blogs/"+req.params.id);
		}
	})
});

app.delete("/Blogs/:id",function(req,res){
		blogs.findByIdAndDelete(req.params.id,function(err,del){
			res.redirect("/Blogs");
		})
})

app.listen("3000",function(){
	console.log("server running");
});

