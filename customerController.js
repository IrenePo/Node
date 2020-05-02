'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  database : 'asiakas'
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          //res.send(error);
          //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
          //res.statusCode = 201;
          //res.send(results);
          //res.send({ "status": 768, "error": null, "response": results });
        }
    });

    },

    fetchAll: function(req, res){
        console.log("Body = " + JSON.stringify(req.body));
        console.log("Params = " + JSON.stringify(req.query));
        res.send("Kutsuttiin fetchAll");
    },

    create: (req, res) => {

      console.log("CREATE: ", req.body);

      let q = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, ASTY_AVAIN, LUONTIPVM)" + 
      "VALUES(?, ?, ?, ?, ?, ?)";

      console.log("query:" + q);

      //TEHTÄVÄ 7 - Tarkistetaan että kaikki tiedot on annettu, jos ei ole

      if (req.body.nimi == null || req.body.osoite == null || req.body.postinro == null || req.body.postitmp == null || req.body.asty_avain == null) {
          res.statusCode = 400;
          res.send("Arvoja puuttui!");
          console.log("Arvoja puuttui!");
      }

      else (
      connection.query(q, [req.body.nimi, req.body.osoite, req.body.postinro, 
          req.body.postitmp, req.body.asty_avain, req.body.luontipvm],
          function (error, result, fields) {
              if (error) {
                  console.log("Virhe", error);
                  res.statusCode = 400;   // 400, 500
                  res.json({ status: "NOT OK", msg: "Virhe!" });
              
              }

              else {
                  res.statusCode = 201;
                  console.log("RESULT:", result);
                  res.json({ avain: result.insertId, nimi: req.body.nimi, 
                  osoite: req.body.osoite, postinro: req.body.postinro, 
                  postitmp: req.body.postitmp, asty_avain: req.body.asty_avain, 
                  luontipvm: req.body.luontipvm})
                  console.log("tulosta: ", req.body.luontipvm)

              }
          }));
          
  },

    update: function(req, res){

    },

    delete: function (req, res) {

      console.log("DELETE params: ", req.params);

      let q = "DELETE FROM asiakas WHERE AVAIN = ?";

      console.log("query:" + q);

      connection.query(q, [req.params.id], function (error, result, fields) {

          if (error) {
              console.log("Virhe", error);
              res.statusCode = 400;   // 400, 500
              res.json({ status: "NOT OK", msg: "Tekninen virhe" });
          }

          else if (result.affectedRows == 0) {
              console.log("Ei poistettuja rivejä...", result.affectedRows);
              res.statusCode = 404;   // 400, 500
              res.json({ status: "NOT OK", msg: "Ei poistettuja rivejä." });
            
          }

          else {
              res.statusCode = 204;
              console.log("RESULT:", result);
              res.json({status: "OK", msg: "Kutsuttiin delete" });
              
          }

      });
  

        
    }
}
