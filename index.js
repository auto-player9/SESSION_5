const express = require("express");
const app = express();
const cors =  require("cors")
app.use(cors())
require("dotenv").config()
const url = process.env.MONGOO_URL
app.use(express.json());
const httpStatusText = require("./utils/httpStatusText")
const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes")
const mongoose  = require("mongoose");
const  path  = require("path");
mongoose.connect(url).then(() =>{console.log("connect to server")})
app.use("/api/courses", coursesRouter)
app.use("/api/users", usersRouter)
app.use((error,req,res,next) =>{
 res.status(error.statusCode || 500 ).json({ status: error.statusText || httpStatusText.ERORR, message: error.message, code: error.statusCode || 500 ,data: null})
})

app.use("/uploads" , express.static(path.join(__dirname, 'uploads')))

app.all('*', (req, res) =>{
    res.json({ status: httpStatusText.ERORR, message: "this resource is not available" })
})

app.listen(process.env.PORT, () => {
    console.log("listening on port 4000");
});
