var bodyParser  = require("body-parser"),
methodOverride  = require("method-override"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/resful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
    
// RESTFUL ROUTES
app.get("/",function(req, res) {
    res.redirect("blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) console.log(err);
        else res.render("index", {blogs : blogs});
    });
});

// NEW ROUTE    
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// POST ROUTE
/* Blog.create({
//     title : "EZ Game",
//     image :"https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/31282817_1730438287050850_3646496022500212736_n.png?_nc_cat=0&oh=6423f35a43b11e9920eaf2c88e1b3bb2&oe=5B981159",
//     body : "medais = ez game!"
// });

app.post("/blogs", function(req, res){
    Blog.create({
        title : req.body.title,
        image : req.body.image,
        body : req.body.body
    }, function(err, blog) {
        if (err) console.log(err);
        else {
            console.log(req.body + "saved!");
            res.redirect("blog");
        }
    });
});
*/
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
          res.render("new"); 
        } else {
            //console.log(req.body + "saved!");
            res.redirect("blogs");
        }
    });
});

// SHOW ROUTE   
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog : foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog : foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + updatedBlog._id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("sever is running");
});