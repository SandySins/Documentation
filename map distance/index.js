const express = require('express')
const app = express()
app.set('view engine', 'ejs')

app.get('/map', (req, res) => {
  let p1={
    lat:23.351688570850346,
    lng:85.34977281202653
  }
  let p2={
    lat:23.36914922817745,
    lng:85.32144541421017
  }
  res.render('map',{p1,p2})
})
app.listen(3000,()=>{
  console.log("on 3000")
})