var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('./mydb.js');


var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3002);
app.use(express.static('public'));

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('resetScreen',context);
    })
  });
});

app.get('/',function(req,res){
   res.render('home');
});

app.get('/getworkouts',function(req,res,next){
   var workouts;
   mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
      if(err){
         next(err);
         return;
      }
   console.log(rows);
   res.send(JSON.stringify(rows));
   });
});

app.get('/new',function(req,res,next){
  if(req.query.n == ""){ req.query.n = null; }
  mysql.pool.query("INSERT INTO workouts (`name`,`weight`,`reps`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.query.n, req.query.w, req.query.r, req.query.d, req.query.l], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM workouts WHERE id="+result.insertId, function(err, rows, fields){
       if(err){
          next(err);
          return;
       }
    res.send(JSON.stringify(rows));
    });
  });
});

app.get('/del', function(req,res,next){
   mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id], function(err, result){
      if(err){
         next(err);
         return;
      }
      res.send(result.affectedRows + 'row(s) deleted');
   });
});

app.get('/upd', function(req,res,next){
   mysql.pool.query("UPDATE workouts SET name=?, weight=?, reps=?, date=?, lbs=? WHERE id=?", 
                   [req.query.n, req.query.w, req.query.r, req.query.d, req.query.l, req.query.id], function(err, result){
                   if(err){
                      next(err);
                      return;
                   }
                   mysql.pool.query("SELECT * FROM workouts WHERE id="+req.query.id, function(err, rows, fields){
                   if(err){
                      next(err);
                      return;
                   }
    res.send(JSON.stringify(rows));
    });
  });
});
   

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
